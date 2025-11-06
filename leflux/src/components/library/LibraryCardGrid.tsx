import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MoreHorizontal, Trash2, BookOpen } from 'lucide-react';
import type { TextItem } from '@/types';
import { useLibraryStore } from '@/store/libraryStore';
import { cn } from '@/lib/utils';

interface LibraryCardGridProps {
  texts: TextItem[];
}

export function LibraryCardGrid({ texts }: LibraryCardGridProps) {
  const navigate = useNavigate();
  const deleteText = useLibraryStore((state) => state.deleteText);

  const handleRemove = useCallback(
    (id: string) => {
      if (window.confirm('Remover este texto da biblioteca?')) {
        deleteText(id);
      }
    },
    [deleteText]
  );

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {texts.map((text) => (
        <motion.article
          key={text.id}
          layout
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.18, ease: 'easeInOut' }}
          className="surface-glass flex flex-col overflow-hidden"
        >
          <button
            type="button"
            onClick={() => navigate(`/read/${text.id}`)}
            className={cn(
              'relative h-40 w-full overflow-hidden focus-ring text-left',
              !text.coverUrl && 'bg-gradient-to-br from-white/5 via-white/2 to-transparent'
            )}
            aria-label={`Abrir ${text.title}`}
          >
            {text.coverUrl ? (
              <img src={text.coverUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl">📚</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0" />
          </button>

          <div className="flex flex-1 flex-col gap-4 px-5 pb-5 pt-4">
            <header className="space-y-1">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-text-tertiary">
                <span>{text.lang}</span>
                <span>{Math.round(text.progress * 100)}%</span>
              </div>
              <h3 className="font-display text-xl text-text-primary">{text.title}</h3>
              <p className="text-sm text-text-secondary">
                Atualizado {new Date(text.updatedAt).toLocaleDateString()}
              </p>
            </header>

            <div className="h-2 rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${Math.min(100, Math.round(text.progress * 100))}%` }}
              />
            </div>

            <div className="mt-auto flex items-center gap-2 text-sm">
              <button
                type="button"
                onClick={() => navigate(`/read/${text.id}`)}
                className="focus-ring inline-flex flex-1 items-center justify-center gap-2 rounded-3xl bg-accent px-4 py-2 font-medium text-[#1E1E1E] transition-transform duration-200 ease-in-out hover:scale-[1.02]"
              >
                <BookOpen className="h-4 w-4" /> Ler
              </button>
              <button
                type="button"
                onClick={() => navigate(`/texts?focus=${text.id}`)}
                className="focus-ring inline-flex items-center justify-center rounded-3xl bg-white/8 px-3 py-2 text-text-secondary transition-all duration-200 ease-in-out hover:bg-white/12 hover:text-text-primary"
                aria-label="Ver detalhes"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleRemove(text.id)}
                className="focus-ring inline-flex items-center justify-center rounded-3xl bg-white/8 px-3 py-2 text-text-secondary transition-all duration-200 ease-in-out hover:bg-red-500/20 hover:text-red-200"
                aria-label="Remover texto"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
