import { useState } from 'react';
import { motion } from 'framer-motion';
import { VocabEntry } from '@/types';
import { cn } from '@/lib/utils';
import { VocabModal } from './VocabModal';

const stageLabels: Record<VocabEntry['srs']['stage'], string> = {
  new: 'Nova',
  learning: 'Aprendendo',
  mastered: 'Dominada',
};

interface VocabCardProps {
  entry: VocabEntry;
}

export function VocabCard({ entry }: VocabCardProps) {
  const [isOpen, setOpen] = useState(false);

  const progress = Math.min(1, Math.max(0, entry.srs.correctStreak / 5));
  const accentBorder =
    entry.srs.stage === 'mastered'
      ? 'border-emerald-300/50'
      : entry.srs.stage === 'learning'
      ? 'border-accent/50'
      : 'border-white/10';

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'surface-glass relative flex w-full flex-col overflow-hidden text-left transition-transform duration-200 ease-in-out hover:scale-[1.02] focus-ring',
          accentBorder,
          'border'
        )}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.18, ease: 'easeInOut' }}
        aria-label={`Abrir ${entry.term}`}
      >
        <div className="relative h-36 w-full overflow-hidden">
          {entry.imageUrl ? (
            <img src={entry.imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl">📚</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/70">
            <span className="rounded-full bg-black/40 px-3 py-1 backdrop-blur-sm">{stageLabels[entry.srs.stage]}</span>
            <span className="rounded-full bg-black/40 px-3 py-1 backdrop-blur-sm">
              {Math.round(entry.srs.ease * 100) / 100} ease
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 px-5 pb-6 pt-4">
          <header className="space-y-1">
            <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">{entry.lang}</p>
            <h3 className="font-display text-2xl text-text-primary">{entry.term}</h3>
            {entry.translation && <p className="text-sm text-text-secondary">{entry.translation}</p>}
          </header>
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <span className="rounded-full bg-white/5 px-3 py-1">Revisões: {entry.srs.reviews}</span>
            <span className="rounded-full bg-white/5 px-3 py-1">Produção: {entry.srs.produced}</span>
          </div>
          <div className="h-2 rounded-full bg-white/10">
            <div className="h-full rounded-full bg-accent" style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
        </div>
      </motion.button>

      <VocabModal entry={entry} isOpen={isOpen} onClose={() => setOpen(false)} />
    </>
  );
}
