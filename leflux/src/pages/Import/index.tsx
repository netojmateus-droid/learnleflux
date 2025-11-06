import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, UploadCloud, Link2, Sparkles, Image as ImageIcon, Loader2, ClipboardPaste } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useToast } from '@/components/common/Toast';
import { useLibraryStore } from '@/store/libraryStore';
import { detectLanguage } from '@/lib/detectors';
import { fetchImageForTerm } from '@/lib/external/images';
import { extractTextFromPdf } from '@/lib/parsers/pdf';
import { extractTextFromSubtitle } from '@/lib/parsers/subs';
import { fetchYouTubeMetadata } from '@/lib/external/youtube';
import { cn } from '@/lib/utils';

const buildProxyUrl = (input: string) =>
  /^https?:/i.test(input) ? `https://r.jina.ai/${input}` : `https://r.jina.ai/https://${input}`;

const sanitizeMultiline = (value: string) =>
  value
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const extractProxySnapshot = (raw: string) => {
  const titleMatch = raw.match(/^Title:\s*(.+)$/m);
  const urlMatch = raw.match(/^URL Source:\s*(.+)$/m);
  const markdownMarker = raw.indexOf('Markdown Content:');

  let content = markdownMarker >= 0 ? raw.slice(markdownMarker + 'Markdown Content:'.length) : raw;
  content = content
    .replace(/^Title:.*$/m, '')
    .replace(/^URL Source:.*$/m, '')
    .replace(/^Published Time:.*$/m, '')
    .replace(/^Warning:.*$/m, '')
    .replace(/^Markdown Content:/m, '')
    .trim();

  return {
    title: titleMatch?.[1]?.trim(),
    url: urlMatch?.[1]?.trim(),
    content: sanitizeMultiline(content),
  };
};

async function fetchWithFallback(target: string) {
  try {
    const response = await fetch(target, { mode: 'cors' });
    if (response.ok) {
      const body = await response.text();
      return { body, proxied: false } as const;
    }
  } catch (error) {
    console.debug('Direct fetch blocked by CORS', error);
  }

  const proxyUrl = buildProxyUrl(target);
  const proxyResponse = await fetch(proxyUrl);
  if (!proxyResponse.ok) {
    throw new Error('Falha ao carregar link');
  }
  const body = await proxyResponse.text();
  return { body, proxied: true } as const;
}

type ImportTab = 'text' | 'file' | 'link';

const languageOptions = [
  { value: 'en', label: 'Inglês' },
  { value: 'pt', label: 'Português' },
  { value: 'es', label: 'Espanhol' },
  { value: 'fr', label: 'Francês' },
  { value: 'de', label: 'Alemão' },
  { value: 'it', label: 'Italiano' },
];

const ACCEPTED_TEXT_TYPES = [
  'text/plain',
  'text/markdown',
  'application/pdf',
  '.pdf',
  '.txt',
  '.md',
  '.srt',
  '.vtt',
];

export function ImportPage() {
  const navigate = useNavigate();
  const { push } = useToast();
  const addText = useLibraryStore((state) => state.addText);
  const existingCount = useLibraryStore((state) => state.texts.length);

  const [activeTab, setActiveTab] = useState<ImportTab>('text');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('en');
  const [languageAuto, setLanguageAuto] = useState(true);
  const [coverUrl, setCoverUrl] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  const [isCoverLoading, setIsCoverLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileLoading, setFileLoading] = useState(false);

  const [link, setLink] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);

  useEffect(() => {
    if (!languageAuto) return;
    if (content.trim().length < 80) return;
    const controller = window.setTimeout(() => {
      const detected = detectLanguage(content, language);
      setLanguage(detected);
    }, 400);
    return () => window.clearTimeout(controller);
  }, [content, language, languageAuto]);

  useEffect(() => {
    if (!content && activeTab === 'text') {
      setCoverUrl(undefined);
    }
  }, [content, activeTab]);

  const stats = useMemo(() => {
    const totalChars = content.length;
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    return { totalChars, words };
  }, [content]);

  const resetForm = () => {
    setContent('');
    setTitle('');
    setCoverUrl(undefined);
    setLanguageAuto(true);
    setLanguage('en');
  };

  const ensureTitle = () => {
    if (title.trim()) return title.trim();
    const fallback = content.split('\n').find((line) => line.trim().length > 0);
    return fallback ? fallback.trim().slice(0, 80) : 'Novo conteúdo';
  };

  const ensureCover = async (baseTitle: string) => {
    if (coverUrl) return coverUrl;
    try {
      const generated = await fetchImageForTerm(baseTitle);
      setCoverUrl(generated);
      return generated;
    } catch (error) {
      console.warn('Cover generation failed', error);
      return undefined;
    }
  };

  const handleSaveText = async () => {
    if (!content.trim()) {
      push('Cole ou digite algum conteúdo antes de importar.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const computedTitle = ensureTitle();
      const finalCover = await ensureCover(computedTitle);
      const id = addText({
        title: computedTitle,
        lang: language,
        content: content.trim(),
        coverUrl: finalCover,
        progress: 0,
      });
      push('Conteúdo importado com sucesso.', 'success');
      resetForm();
      navigate(`/read/${id}`);
    } catch (error) {
      console.error(error);
      push('Não foi possível salvar agora. Tente novamente.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCoverGenerate = async () => {
    const term = title.trim() || content.split('\n')[0]?.slice(0, 60) || 'linguagem';
    if (!term) return;
    setIsCoverLoading(true);
    try {
      const url = await fetchImageForTerm(term);
      setCoverUrl(url);
    } catch (error) {
      console.error(error);
      push('Não conseguimos sugerir uma capa agora.', 'error');
    } finally {
      setIsCoverLoading(false);
    }
  };

  const handleFileSelection = async (file: File) => {
    setFileLoading(true);
    try {
      const fileName = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
      let extracted = '';
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        extracted = await extractTextFromPdf(file);
      } else if (file.name.toLowerCase().endsWith('.srt') || file.name.toLowerCase().endsWith('.vtt')) {
        extracted = await extractTextFromSubtitle(file);
      } else {
        extracted = await file.text();
      }

      if (!extracted.trim()) {
        push('Não conseguimos extrair texto deste arquivo.', 'warning');
        return;
      }

      const detected = detectLanguage(extracted, 'en');
      const cover = await fetchImageForTerm(fileName || 'texto');
      const id = addText({
        title: fileName || 'Arquivo importado',
        lang: detected,
        content: extracted.trim(),
        coverUrl: cover,
        progress: 0,
      });
      push(`Arquivo “${file.name}” importado.`, 'success');
      navigate(`/read/${id}`);
    } catch (error) {
      console.error(error);
      push('Não foi possível processar este arquivo agora.', 'error');
    } finally {
      setFileLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleLinkImport = async () => {
    if (!link.trim()) {
      push('Cole um link válido para continuar.', 'warning');
      return;
    }

    setLinkLoading(true);
    try {
      const url = link.trim();
      let titleFromLink = url;
      let cover: string | undefined;
      let extracted = '';

      const youtubeMeta = await fetchYouTubeMetadata(url).catch(() => null);
      if (youtubeMeta) {
        titleFromLink = youtubeMeta.title;
        cover = youtubeMeta.thumbnailUrl;
        extracted = `Assista ao vídeo “${youtubeMeta.title}” de ${youtubeMeta.author} e registre seu vocabulário.

Link: ${url}`;
      } else {
        const { body, proxied } = await fetchWithFallback(url);
        const parser = new DOMParser();
        const doc = parser.parseFromString(body, 'text/html');
        const article = doc.querySelector('article, main, body');
        const rawText = article?.textContent ?? body;
        extracted = sanitizeMultiline(rawText);

        const metaTitle = doc.querySelector('meta[property="og:title"], meta[name="title"], title');
        if (metaTitle?.textContent) {
          titleFromLink = metaTitle.getAttribute('content') ?? metaTitle.textContent ?? titleFromLink;
        }

        const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
        if (ogImage) {
          cover = ogImage;
        }

        if (proxied) {
          const snapshot = extractProxySnapshot(body);
          if (snapshot.title) {
            titleFromLink = snapshot.title;
          }
          if (snapshot.content) {
            extracted = snapshot.content;
          }
        }
      }

      if (!extracted || extracted.length < 160) {
        extracted = `Recurso salvo:

${url}

Use o modo leitor para anotar vocabulário manualmente.`;
      }

      const detected = detectLanguage(extracted, 'en');
      const finalCover = cover ?? (await fetchImageForTerm(titleFromLink));
      const id = addText({
        title: titleFromLink.trim().slice(0, 120),
        lang: detected,
        content: extracted,
        coverUrl: finalCover,
        progress: 0,
      });
      push('Link adicionado à biblioteca.', 'success');
      setLink('');
      navigate(`/read/${id}`);
    } catch (error) {
      console.error(error);
      push('Não foi possível importar este link. Alguns sites bloqueiam acesso direto; tente copiar o texto manualmente.', 'error');
    } finally {
      setLinkLoading(false);
    }
  };

  const renderTabs = () => (
    <div className="flex flex-wrap gap-3">
      {(
        [
          { id: 'text', label: 'Texto manual', icon: FileText },
          { id: 'file', label: 'Arquivo', icon: UploadCloud },
          { id: 'link', label: 'Link', icon: Link2 },
        ] as Array<{ id: ImportTab; label: string; icon: typeof FileText }>
      ).map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => setActiveTab(id)}
          className={cn(
            'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-text-secondary transition hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40',
            activeTab === id && 'border-accent/60 bg-accent/15 text-accent'
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );

  const renderTextTab = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-text-secondary">
          Título
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Título opcional"
            className="focus-ring rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-text-secondary">
          Idioma
          <div className="relative">
            <select
              value={language}
              onChange={(event) => {
                setLanguage(event.target.value);
                setLanguageAuto(false);
              }}
              className="focus-ring w-full appearance-none rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary"
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setLanguageAuto(true)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/5 px-3 py-1 text-xs text-text-tertiary hover:text-text-primary"
            >
              Auto
            </button>
          </div>
        </label>
      </div>

      <label className="flex flex-col gap-2 text-sm text-text-secondary">
        Conteúdo
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Cole aqui seu texto ou anote o que quer estudar"
          className="focus-ring min-h-[220px] rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
        <span className="rounded-full bg-white/5 px-3 py-1">{stats.words} palavras</span>
        <span className="rounded-full bg-white/5 px-3 py-1">{stats.totalChars} caracteres</span>
        <Button intent="ghost" onClick={handleCoverGenerate} disabled={isCoverLoading}>
          {isCoverLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Sugestão de capa
        </Button>
        {coverUrl && (
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-text-secondary">
            <ImageIcon className="h-4 w-4" /> Capa pronta
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button intent="ghost" onClick={resetForm} disabled={!content && !title}>
          Limpar
        </Button>
        <Button intent="accent" onClick={handleSaveText} disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ClipboardPaste className="mr-2 h-4 w-4" />} Importar
        </Button>
      </div>
    </div>
  );

  const renderFileTab = () => (
    <div className="space-y-6">
      <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 px-6 py-10 text-center">
        <UploadCloud className="mx-auto h-12 w-12 text-accent" />
        <h2 className="mt-4 font-display text-2xl text-text-primary">Solte um arquivo aqui</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Aceitamos PDF, TXT, SRT ou VTT. Processamos tudo localmente, preservando sua privacidade.
        </p>
        <div className="mt-6 flex justify-center">
          <Button intent="accent" onClick={() => fileInputRef.current?.click()} disabled={fileLoading}>
            {fileLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />} Selecionar arquivo
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TEXT_TYPES.join(',')}
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleFileSelection(file);
            }}
          />
        </div>
      </div>
      <p className="text-xs text-text-tertiary">
        Dica: para artigos longos, exporte como PDF ou copie o texto para a aba de texto manual.
      </p>
    </div>
  );

  const renderLinkTab = () => (
    <div className="space-y-6">
      <label className="flex flex-col gap-2 text-sm text-text-secondary">
        Link
        <input
          type="url"
          value={link}
          onChange={(event) => setLink(event.target.value)}
          placeholder="https://"
          className="focus-ring rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary"
        />
      </label>
      <p className="text-sm text-text-secondary">
        Função beta: funciona melhor com páginas que permitem leitura pública ou vídeos do YouTube com metadata disponível.
      </p>
      <div className="flex justify-end">
        <Button intent="accent" onClick={handleLinkImport} disabled={linkLoading}>
          {linkLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Link2 className="mr-2 h-4 w-4" />} Importar link
        </Button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-5xl flex-col gap-8 px-6 py-10">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-text-tertiary">Importar</p>
        <h1 className="font-display text-3xl font-semibold text-text-primary md:text-4xl">
          Traga conteúdo para o seu fluxo
        </h1>
        <p className="max-w-2xl text-text-secondary">
          Cole textos, links, vídeos ou arquivos. Detectamos o idioma automaticamente e transformamos em leitura imersiva.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="surface-glass rounded-3xl px-6 py-5">
          <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">Na biblioteca</p>
          <p className="font-display text-3xl text-text-primary">{existingCount}</p>
          <p className="text-sm text-text-secondary">Itens disponíveis offline</p>
        </div>
        <div className="surface-glass rounded-3xl px-6 py-5">
          <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">Formato</p>
          <p className="font-display text-3xl text-text-primary">{activeTab === 'text' ? 'Texto' : activeTab === 'file' ? 'Arquivo' : 'Link'}</p>
          <p className="text-sm text-text-secondary">Selecione a aba que faz sentido hoje</p>
        </div>
        <div className="surface-glass rounded-3xl px-6 py-5">
          <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">Assistente</p>
          <p className="font-display text-3xl text-text-primary">Smart</p>
          <p className="text-sm text-text-secondary">Detecta idioma e sugere capa automaticamente</p>
        </div>
      </section>

      <div className="surface-glass flex flex-1 flex-col gap-6 px-6 py-8">
        {renderTabs()}
        {activeTab === 'text' && renderTextTab()}
        {activeTab === 'file' && renderFileTab()}
        {activeTab === 'link' && renderLinkTab()}
      </div>
    </div>
  );
}
