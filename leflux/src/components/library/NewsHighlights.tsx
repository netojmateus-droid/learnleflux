import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Library, Loader2 } from 'lucide-react';
import { getCuratedNews, NewsTopicId } from '@/data/news';
import { useI18n } from '@/services/i18n';
import { Button } from '@/components/common/Button';
import { useToast } from '@/components/common/Toast';
import { useLibraryStore } from '@/store/libraryStore';
import { fetchImageForTerm } from '@/lib/external/images';

async function extractArticleContent(url: string, title: string, summary: string): Promise<string> {
  const buildFallback = () =>
    [title, '', summary, '', 'Notas rápidas para estudo:', '- Anote termos novos e traduções breves.', '- Resuma o que entendeu em duas frases.', '', `Fonte original: ${url}`].join('\n');

  if (!url) return buildFallback();

  const proxyUrl = /^https?:/i.test(url) ? `https://r.jina.ai/${url}` : `https://r.jina.ai/https://${url}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(proxyUrl, { signal: controller.signal });
    if (response.ok) {
      const text = (await response.text()).trim();
      if (text.length > 250) {
        return text;
      }
    }
  } catch (error) {
    console.debug('News extraction failed', error);
  } finally {
    clearTimeout(timeout);
  }

  return buildFallback();
}

export function NewsHighlights() {
  const { locale, t } = useI18n();
  const { push } = useToast();
  const addText = useLibraryStore((state) => state.addText);
  const defaultTopic = (locale.meta.topics[0]?.id ?? 'culture') as NewsTopicId;
  const [topic, setTopic] = useState<NewsTopicId>(defaultTopic);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    setTopic((locale.meta.topics[0]?.id ?? 'culture') as NewsTopicId);
  }, [locale.meta.code]);

  const items = useMemo(() => getCuratedNews(locale.meta.code, topic), [locale.meta.code, topic]);

  const handleSave = async (item: (typeof items)[number]) => {
    if (savingId) return;
    setSavingId(item.id);
    try {
      const content = await extractArticleContent(item.url, item.title, item.summary);
      let cover: string | undefined;
      try {
        cover = await fetchImageForTerm(item.title, { locale: item.language });
      } catch (imageError) {
        console.debug('News cover generation failed', imageError);
      }

      addText({
        title: item.title,
        lang: item.language,
        content,
        coverUrl: cover,
        progress: 0,
      });
      push(t('news.saved', 'Artigo salvo na biblioteca.'), 'success');
    } catch (error) {
      console.error(error);
      push(t('news.saveError', 'Não foi possível salvar o artigo agora.'), 'error');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <section id="news" className="surface-glass flex flex-col gap-6 rounded-3xl px-6 py-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">{t('news.title')}</p>
          <h2 className="font-display text-2xl font-semibold text-text-primary">{t('news.subtitle')}</h2>
        </div>
        <label className="flex items-center gap-3 text-sm text-text-secondary">
          {t('common.topic')}
          <select
            value={topic}
            onChange={(event) => setTopic(event.target.value as NewsTopicId)}
            className="focus-ring rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-text-primary"
          >
            {locale.meta.topics.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-6 text-sm text-text-secondary">
          {t('news.empty')}
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="group rounded-3xl border border-white/10 bg-white/5 px-5 py-4 transition hover:border-accent/40 hover:bg-accent/10"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">{item.source}</p>
              <h3 className="mt-2 font-display text-lg text-text-primary group-hover:text-accent">{item.title}</h3>
              <p className="mt-3 text-sm text-text-secondary">{item.summary}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors"
                >
                  {t('news.cta')} <ExternalLink className="h-4 w-4" />
                </a>
                <Button
                  intent="ghost"
                  onClick={() => void handleSave(item)}
                  disabled={savingId === item.id}
                >
                  {savingId === item.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Library className="mr-2 h-4 w-4" />
                  )}
                  {savingId === item.id ? t('news.saving', 'Salvando...') : t('news.save', 'Adicionar à biblioteca')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
