import { ArrowLeft, Moon, Sun, Monitor, Volume2, PauseCircle } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { ProgressRing } from '@/components/common/ProgressRing';
import { usePrefsStore } from '@/store/prefsStore';
import { isSpeechSynthesisSupported } from '@/lib/external/tts';
import { cn } from '@/lib/utils';

interface ReaderHeaderProps {
  title: string;
  progress?: number;
  onBack?: () => void;
  onSpeak?: () => void;
  onStopSpeak?: () => void;
  isSpeaking?: boolean;
}

const THEME_SEQUENCE: Array<'auto' | 'dark' | 'light'> = ['auto', 'dark', 'light'];

export function ReaderHeader({ title, progress, onBack, onSpeak, onStopSpeak, isSpeaking }: ReaderHeaderProps) {
  const { prefs, updatePrefs } = usePrefsStore();

  const handleFontChange = (value: number) => {
    updatePrefs({ fontSize: value });
  };

  const handleLineHeightChange = (value: number) => {
    updatePrefs({ lineHeight: value });
  };

  const handleThemeToggle = () => {
    const currentIndex = THEME_SEQUENCE.indexOf(prefs.theme);
    const next = THEME_SEQUENCE[(currentIndex + 1) % THEME_SEQUENCE.length];
    updatePrefs({ theme: next });
  };

  const speakSupported = isSpeechSynthesisSupported();
  const ThemeIcon = prefs.theme === 'dark' ? Moon : prefs.theme === 'light' ? Sun : Monitor;

  return (
    <header className="surface-glass sticky top-4 z-10 flex flex-col gap-6 px-6 py-5 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button intent="ghost" onClick={onBack} aria-label="Voltar">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="font-display text-2xl text-text-primary md:text-3xl">{title}</h1>
        </div>
        {typeof progress === 'number' && (
          <ProgressRing value={progress} size={72} />
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="flex flex-col gap-2 text-sm text-text-secondary">
          <span className="uppercase tracking-[0.2em] text-text-tertiary">Tamanho da fonte</span>
          <input
            type="range"
            min={14}
            max={24}
            value={prefs.fontSize}
            onChange={(event) => handleFontChange(Number(event.target.value))}
            className="w-full"
          />
          <span className="text-xs">{prefs.fontSize}px</span>
        </div>
        <div className="flex flex-col gap-2 text-sm text-text-secondary">
          <span className="uppercase tracking-[0.2em] text-text-tertiary">Altura da linha</span>
          <input
            type="range"
            step={0.1}
            min={1.4}
            max={1.8}
            value={prefs.lineHeight}
            onChange={(event) => handleLineHeightChange(Number(event.target.value))}
            className="w-full"
          />
          <span className="text-xs">{prefs.lineHeight.toFixed(1)}x</span>
        </div>
        <div className="flex flex-col gap-2 text-sm text-text-secondary">
          <span className="uppercase tracking-[0.2em] text-text-tertiary">Tema</span>
          <Button intent="neutral" onClick={handleThemeToggle} className="justify-start">
            <ThemeIcon className="mr-2 h-4 w-4" />
            {prefs.theme === 'auto' ? 'Auto' : prefs.theme === 'dark' ? 'Escuro' : 'Claro'}
          </Button>
        </div>
        <div className="flex flex-col gap-2 text-sm text-text-secondary">
          <span className="uppercase tracking-[0.2em] text-text-tertiary">Leitura</span>
          <div className="flex gap-3">
            <Button
              intent="accent"
              onClick={isSpeaking ? onStopSpeak : onSpeak}
              disabled={!speakSupported}
              fullWidth
              className={cn(isSpeaking && 'bg-white/10 text-text-primary')}
            >
              {isSpeaking ? (
                <>
                  <PauseCircle className="mr-2 h-4 w-4" /> Parar
                </>
              ) : (
                <>
                  <Volume2 className="mr-2 h-4 w-4" /> Ler em voz alta
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
