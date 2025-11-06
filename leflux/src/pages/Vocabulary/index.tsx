import { useMemo, useState } from 'react';
import { Search, Filter, Sparkles, Clock, Layers, MessageCircle } from 'lucide-react';
import { useVocabStore } from '@/store/vocabStore';
import { VocabCard } from '@/components/word/VocabCard';
import { Button } from '@/components/common/Button';
import { StudyAssistant } from '@/components/common/StudyAssistant';
import { cn } from '@/lib/utils';

type StageFilter = 'all' | 'new' | 'learning' | 'mastered';
type SortOption = 'recent' | 'alphabetical' | 'review';

const stageLabels: Record<Exclude<StageFilter, 'all'>, string> = {
  new: 'Nova',
  learning: 'Aprendendo',
  mastered: 'Dominada',
};

export function VocabularyPage() {
  const { vocab, isLoading } = useVocabStore((state) => ({ vocab: state.vocab, isLoading: state.isLoading }));
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<StageFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const [showOnlyDue, setShowOnlyDue] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);

  const counts = useMemo(() => {
    return vocab.reduce(
      (acc, entry) => {
        acc.total += 1;
        acc[entry.srs.stage] += 1;
        if (entry.srs.nextReview <= Date.now()) acc.due += 1;
        return acc;
      },
      { total: 0, new: 0, learning: 0, mastered: 0, due: 0 } as Record<'total' | 'new' | 'learning' | 'mastered' | 'due', number>
    );
  }, [vocab]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return vocab
      .filter((entry) => {
        if (stageFilter !== 'all' && entry.srs.stage !== stageFilter) return false;
        if (showOnlyDue && entry.srs.nextReview > Date.now()) return false;
        if (!term) return true;
        return [entry.term, entry.translation ?? '', entry.definition ?? ''].some((field) =>
          field.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => {
        switch (sortOption) {
          case 'alphabetical':
            return a.term.localeCompare(b.term, undefined, { sensitivity: 'base' });
          case 'review':
            return a.srs.nextReview - b.srs.nextReview;
          case 'recent':
          default:
            return b.updatedAt - a.updatedAt;
        }
      });
  }, [vocab, stageFilter, showOnlyDue, search, sortOption]);

  const stageChips: StageFilter[] = ['all', 'new', 'learning', 'mastered'];

  return (
    <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-text-tertiary">Vocabulário</p>
        <h1 className="font-display text-3xl font-semibold text-text-primary md:text-4xl">
          Palavras vivas no seu contexto
        </h1>
        <p className="max-w-2xl text-text-secondary">
          Explore, filtre e refine seu vocabulário salvo com imagens, exemplos e pronúncia.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="surface-glass rounded-3xl px-6 py-5">
          <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">Total</p>
          <p className="font-display text-3xl text-text-primary">{counts.total}</p>
          <p className="text-sm text-text-secondary">Palavras salvas</p>
        </div>
        <div className="surface-glass rounded-3xl px-6 py-5">
          <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">Para revisar</p>
          <p className="font-display text-3xl text-text-primary">{counts.due}</p>
          <p className="text-sm text-text-secondary">Disponíveis agora</p>
        </div>
        <div className="surface-glass rounded-3xl px-6 py-5">
          <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">Aprendendo</p>
          <p className="font-display text-3xl text-text-primary">{counts.learning}</p>
          <p className="text-sm text-text-secondary">Na fase ativa</p>
        </div>
        <div className="surface-glass rounded-3xl px-6 py-5">
          <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">Dominadas</p>
          <p className="font-display text-3xl text-text-primary">{counts.mastered}</p>
          <p className="text-sm text-text-secondary">Prontas para uso</p>
        </div>
      </section>

      <div className="surface-glass flex flex-col gap-6 px-6 py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <Search className="h-4 w-4 text-text-tertiary" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por termo, tradução ou definição"
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
            />
          </div>
          <div className="flex gap-3">
            <Button
              intent="ghost"
              onClick={() => setShowOnlyDue((prev) => !prev)}
              className={cn(showOnlyDue && 'bg-accent/15 text-accent')}
            >
              <Clock className="mr-2 h-4 w-4" /> Due agora
            </Button>
            <div className="relative">
              <select
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value as SortOption)}
                className="focus-ring appearance-none rounded-full border border-white/10 bg-white/5 px-4 py-2 pr-10 text-sm text-text-primary"
              >
                <option value="recent">Mais recentes</option>
                <option value="alphabetical">A-Z</option>
                <option value="review">Próxima revisão</option>
              </select>
              <Filter className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {stageChips.map((chip) => (
            <button
              type="button"
              key={chip}
              onClick={() => setStageFilter(chip)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-text-secondary transition hover:text-text-primary',
                stageFilter === chip && 'border-accent/60 bg-accent/15 text-accent'
              )}
            >
              {chip === 'all' ? (
                <Layers className="h-4 w-4" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {chip === 'all' ? 'Todas' : stageLabels[chip]}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center py-16">
            <p className="text-text-secondary">Carregando vocabulário…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-center">
            <h2 className="font-display text-2xl text-text-primary">Nada por aqui ainda</h2>
            <p className="max-w-md text-text-secondary">
              Salve palavras pelo leitor ou importador para vê-las organizadas aqui. Use a busca e filtros para encontrar exatamente o que precisa.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((entry) => (
              <VocabCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => setAssistantOpen(!assistantOpen)}
        className="fixed bottom-20 right-6 rounded-full bg-accent p-3 hover:bg-accent/80 transition-colors shadow-lg z-40"
        title="Assistente de Estudo"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </button>

      <StudyAssistant
        language="Português"
        context="Estou estudando vocabulário. Ajude com pronuncia, exemplos, sinonimos e pratica."
        visible={assistantOpen}
        onClose={() => setAssistantOpen(false)}
      />
    </div>
  );
}
