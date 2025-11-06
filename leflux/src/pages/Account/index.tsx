import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Monitor,
  Moon,
  Sun,
  Volume2,
  Trees,
  FileDown,
  FileUp,
  Trash2,
  Loader2,
  CheckCircle2,
  CloudRain,
  Info,
  UserCircle,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useToast } from '@/components/common/Toast';
import { usePrefsStore } from '@/store/prefsStore';
import { useLibraryStore } from '@/store/libraryStore';
import { useVocabStore } from '@/store/vocabStore';
import { useAuthStore } from '@/store/authStore';
import { GoogleAuthButton } from '@/components/common/GoogleAuthButton';
import { db, DB_VERSION } from '@/lib/db/indexeddb';
import { cn } from '@/lib/utils';
import type { UserPrefs, TextItem, VocabEntry } from '@/types';

const THEME_OPTIONS: Array<{ value: UserPrefs['theme']; label: string; icon: typeof Monitor }> = [
  { value: 'auto', label: 'Automático', icon: Monitor },
  { value: 'dark', label: 'Escuro', icon: Moon },
  { value: 'light', label: 'Claro', icon: Sun },
];

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'Inglês' },
  { value: 'pt', label: 'Português' },
  { value: 'es', label: 'Espanhol' },
  { value: 'fr', label: 'Francês' },
  { value: 'de', label: 'Alemão' },
  { value: 'it', label: 'Italiano' },
];

const AMBIENT_OPTIONS: Array<{ value: UserPrefs['ambientSound']; label: string; icon: typeof Volume2 }> = [
  { value: 'none', label: 'Silêncio', icon: Volume2 },
  { value: 'rain', label: 'Chuva', icon: CloudRain },
  { value: 'library', label: 'Biblioteca', icon: Info },
  { value: 'nature', label: 'Natureza', icon: Trees },
];

export function AccountPage() {
  const navigate = useNavigate();
  const { push } = useToast();
  const { prefs, updatePrefs, hydrate: hydratePrefs, isLoading: prefsLoading } = usePrefsStore();
  const { texts, hydrate: hydrateTexts } = useLibraryStore();
  const { vocab, hydrate: hydrateVocab } = useVocabStore();
  const { user, isAuthenticated } = useAuthStore();

  const [fontSize, setFontSize] = useState(prefs.fontSize);
  const [lineHeight, setLineHeight] = useState(prefs.lineHeight);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFontSize(prefs.fontSize);
    setLineHeight(prefs.lineHeight);
  }, [prefs.fontSize, prefs.lineHeight]);

  const vocabCount = vocab.length;
  const textCount = texts.length;
  const masteredCount = useMemo(
    () => vocab.filter((entry) => entry.srs.stage === 'mastered').length,
    [vocab]
  );

  const googleClientIdDefined = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim());

  const handleThemeChange = (theme: UserPrefs['theme']) => {
    updatePrefs({ theme });
  };

  const handleFontSizeChange = (value: number) => {
    setFontSize(value);
    updatePrefs({ fontSize: value });
  };

  const handleLineHeightChange = (value: number) => {
    setLineHeight(value);
    updatePrefs({ lineHeight: value });
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updatePrefs({ targetLang: event.target.value });
  };

  const handleAmbientChange = (value: UserPrefs['ambientSound']) => {
    updatePrefs({ ambientSound: value });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const [allTexts, allVocab, storedPrefs] = await Promise.all([
        db.getAllTexts(),
        db.getAllVocab(),
        db.getPrefs(),
      ]);

      const payload = {
        meta: {
          exportedAt: new Date().toISOString(),
          version: DB_VERSION,
        },
        texts: allTexts,
        vocab: allVocab,
        prefs: storedPrefs ?? prefs,
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `leflux-backup-${new Date().toISOString().split('T')[0]}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      push('Backup exportado.', 'success');
    } catch (error) {
      console.error(error);
      push('Não foi possível exportar agora.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw) as {
        texts?: unknown;
        vocab?: unknown;
        prefs?: unknown;
      } | null;

      if (!parsed || typeof parsed !== 'object') {
        throw new Error('invalid-backup');
      }

      const nextTexts = Array.isArray(parsed.texts) ? parsed.texts : [];
      const nextVocab = Array.isArray(parsed.vocab) ? parsed.vocab : [];
      const nextPrefs = parsed.prefs && typeof parsed.prefs === 'object' ? (parsed.prefs as UserPrefs) : undefined;

      await db.clearTexts();
      await db.clearVocab();
      await db.clearPrefs();

      const sanitizedTexts = nextTexts.filter((entry): entry is TextItem => {
        return !!entry && typeof entry === 'object' && 'id' in entry && 'content' in entry;
      });
      const sanitizedVocab = nextVocab.filter((entry): entry is VocabEntry => {
        return !!entry && typeof entry === 'object' && 'id' in entry && 'term' in entry;
      });

      await Promise.all(sanitizedTexts.map((entry) => db.putText(entry)));
      await Promise.all(sanitizedVocab.map((entry) => db.putVocab(entry)));

      if (nextPrefs) {
        await db.putPrefs(nextPrefs);
      }

      await Promise.all([hydrateTexts(), hydrateVocab(), hydratePrefs()]);
      push('Backup importado.', 'success');
    } catch (error) {
      console.error(error);
      push('Arquivo inválido ou corrompido.', 'error');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Isso vai remover biblioteca, vocabulário e preferências. Continuar?')) {
      return;
    }
    setIsResetting(true);
    try {
      await db.clearTexts();
      await db.clearVocab();
      await db.clearPrefs();
      await Promise.all([hydrateTexts(), hydrateVocab(), hydratePrefs()]);
      push('Todos os dados foram removidos.', 'info');
      navigate('/');
    } catch (error) {
      console.error(error);
      push('Não foi possível limpar agora.', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-5xl flex-col gap-8 px-6 py-10">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-text-tertiary">Conta</p>
        <h1 className="font-display text-3xl font-semibold text-text-primary md:text-4xl">
          Preferências & backups
        </h1>
        <p className="max-w-2xl text-text-secondary">
          Ajuste a experiência de leitura, controle áudio ambiente e faça exportação/restore dos seus dados offline.
        </p>
      </header>

      {googleClientIdDefined && (
        <section className="surface-glass flex flex-col gap-4 rounded-3xl px-6 py-6">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">Conta Google</p>
              <h2 className="font-display text-xl text-text-primary">Sincronização opcional</h2>
              <p className="text-sm text-text-secondary">
                Conecte-se com o Google para identificar seus backups e sincronizar preferências em múltiplos dispositivos.
              </p>
            </div>
            <GoogleAuthButton variant="solid" />
          </header>
          {isAuthenticated && user ? (
            <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
              {user.picture ? (
                <img src={user.picture} alt="Avatar do Google" className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <UserCircle className="h-12 w-12 text-text-secondary" />
              )}
              <div className="min-w-[200px] flex-1">
                <p className="text-sm font-medium text-text-primary">{user.name}</p>
                <p className="text-xs text-text-secondary">{user.email}</p>
                <p className="mt-1 text-xs text-text-tertiary">
                  Token expira em {new Date(user.expiresAt).toLocaleString()}
                </p>
              </div>
            </div>
          ) : null}
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-4">
        <div className="surface-glass rounded-3xl px-6 py-5">
          <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">Textos</p>
          <p className="font-display text-3xl text-text-primary">{textCount}</p>
          <p className="text-sm text-text-secondary">Na sua biblioteca</p>
        </div>
        <div className="surface-glass rounded-3xl px-6 py-5">
          <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">Vocabulário</p>
          <p className="font-display text-3xl text-text-primary">{vocabCount}</p>
          <p className="text-sm text-text-secondary">Palavras salvas</p>
        </div>
        <div className="surface-glass rounded-3xl px-6 py-5">
          <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">Dominadas</p>
          <p className="font-display text-3xl text-text-primary">{masteredCount}</p>
          <p className="text-sm text-text-secondary">Prontas para uso</p>
        </div>
        <div className="surface-glass rounded-3xl px-6 py-5">
          <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">Fonte</p>
          <p className="font-display text-3xl text-text-primary">{fontSize}px</p>
          <p className="text-sm text-text-secondary">Aplicado ao leitor</p>
        </div>
      </section>

      <div className="surface-glass flex flex-1 flex-col gap-8 px-6 py-8">
        <section className="space-y-6">
          <header className="space-y-1">
            <h2 className="font-display text-xl text-text-primary">Tema & idioma</h2>
            <p className="text-sm text-text-secondary">Sincronizamos automaticamente com o sistema, mas você pode escolher.</p>
          </header>
          <div className="flex flex-wrap gap-3">
            {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleThemeChange(value)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-text-secondary transition hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40',
                  prefs.theme === value && 'border-accent/60 bg-accent/15 text-accent'
                )}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>

          <label className="flex flex-col gap-2 text-sm text-text-secondary">
            Idioma alvo
            <select
              value={prefs.targetLang}
              onChange={handleLanguageChange}
              className="focus-ring rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary"
              disabled={prefsLoading}
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="space-y-6">
          <header className="space-y-1">
            <h2 className="font-display text-xl text-text-primary">Tipografia</h2>
            <p className="text-sm text-text-secondary">Defina o conforto visual para suas sessões de leitura.</p>
          </header>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2 text-sm text-text-secondary">
              <span className="uppercase tracking-[0.3em] text-text-tertiary">Tamanho</span>
              <input
                type="range"
                min={14}
                max={24}
                value={fontSize}
                onChange={(event) => handleFontSizeChange(Number(event.target.value))}
              />
              <span className="text-xs text-text-tertiary">{fontSize}px</span>
            </div>
            <div className="flex flex-col gap-2 text-sm text-text-secondary">
              <span className="uppercase tracking-[0.3em] text-text-tertiary">Altura da linha</span>
              <input
                type="range"
                min={1.4}
                max={1.9}
                step={0.05}
                value={lineHeight}
                onChange={(event) => handleLineHeightChange(Number(event.target.value))}
              />
              <span className="text-xs text-text-tertiary">{lineHeight.toFixed(2)}x</span>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <header className="space-y-1">
            <h2 className="font-display text-xl text-text-primary">Som ambiente</h2>
            <p className="text-sm text-text-secondary">Escolha um ruído de fundo leve para manter o foco.</p>
          </header>
          <div className="flex flex-wrap gap-3">
            {AMBIENT_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleAmbientChange(value)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-text-secondary transition hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40',
                  prefs.ambientSound === value && 'border-accent/60 bg-accent/15 text-accent'
                )}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <header className="space-y-1">
            <h2 className="font-display text-xl text-text-primary">Backup & restauração</h2>
            <p className="text-sm text-text-secondary">
              Seus dados ficam no seu dispositivo. Exporte um snapshot ou importe um arquivo salvo.
            </p>
          </header>
          <div className="flex flex-wrap gap-3">
            <Button intent="accent" onClick={handleExport} disabled={isExporting}>
              {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />} Exportar backup
            </Button>
            <Button intent="neutral" onClick={() => fileInputRef.current?.click()} disabled={isImporting}>
              {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />} Importar backup
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleImport}
            />
          </div>
          <p className="text-xs text-text-tertiary">
            Exportado com versão {DB_VERSION}. Arquivos de outra versão serão reconciliados automaticamente sempre que possível.
          </p>
        </section>

        <section className="space-y-4 rounded-3xl border border-red-400/30 bg-red-500/10 p-6">
          <header className="flex items-center gap-2 text-red-100">
            <Trash2 className="h-5 w-5" />
            <h2 className="font-display text-xl">Área de risco</h2>
          </header>
          <p className="text-sm text-red-200">
            Limpe tudo e volte ao estado inicial. Útil se quiser começar outro idioma do zero.
          </p>
          <Button intent="ghost" onClick={handleReset} disabled={isResetting} className="border-red-400/60 text-red-100 hover:bg-red-400/20">
            {isResetting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />} Apagar dados locais
          </Button>
          <div className="flex items-center gap-2 text-xs text-red-200">
            <CheckCircle2 className="h-4 w-4" />
            <span>Nenhum dado é enviado para servidores — exporte antes se quiser guardar uma cópia.</span>
          </div>
        </section>
      </div>
    </div>
  );
}
