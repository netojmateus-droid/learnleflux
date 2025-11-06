import { useMemo } from 'react';
import { Sparkles, VolumeX, CloudRain, Library as LibraryIcon, Leaf } from 'lucide-react';
import { usePrefsStore } from '@/store/prefsStore';
import { Button } from './Button';

const OPTIONS = [
  { value: 'none', label: 'Silêncio', icon: VolumeX },
  { value: 'rain', label: 'Chuva suave', icon: CloudRain },
  { value: 'library', label: 'Biblioteca', icon: LibraryIcon },
  { value: 'nature', label: 'Natureza', icon: Leaf },
] as const;

type AmbientOption = (typeof OPTIONS)[number]['value'];

export function AmbientToggle() {
  const { prefs, updatePrefs } = usePrefsStore();
  const current = useMemo(() => OPTIONS.find((opt) => opt.value === prefs.ambientSound) ?? OPTIONS[0], [prefs.ambientSound]);

  const handleNext = () => {
    const index = OPTIONS.findIndex((opt) => opt.value === current.value);
    const next = OPTIONS[(index + 1) % OPTIONS.length];
    updatePrefs({ ambientSound: next.value });
  };

  return (
    <div className="flex items-center gap-3">
      <Sparkles className="h-4 w-4 text-accent" aria-hidden />
      <div className="text-sm text-text-secondary">
        <p className="font-medium text-text-primary">Som ambiente</p>
        <p>{current.label}</p>
      </div>
      <Button intent="ghost" onClick={handleNext} aria-label="Alternar som ambiente">
        <current.icon className="h-4 w-4" aria-hidden />
      </Button>
    </div>
  );
}
