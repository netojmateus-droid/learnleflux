import { useEffect, useMemo, useState } from 'react';
import { Flame, Clock, Target, RefreshCw, Sparkles, ArrowLeftCircle, CheckCircle2 } from 'lucide-react';
import { useVocabStore } from '@/store/vocabStore';
import { useReviewStore } from '@/store/reviewStore';
import { Button } from '@/components/common/Button';
import { ProgressRing } from '@/components/common/ProgressRing';
import { ReviewCard } from '@/components/word/ReviewCard';
import { useToast } from '@/components/common/Toast';
import { cn } from '@/lib/utils';

const SESSION_LIMIT = 20;

const responseLabels: Record<0 | 1 | 2, string> = {
  0: 'Errei',
  1: 'Difícil',
  2: 'Fácil',
};

export function ReviewPage() {
  const { vocab, isLoading } = useVocabStore((state) => ({ vocab: state.vocab, isLoading: state.isLoading }));
  const { push } = useToast();
  const [desiredCount, setDesiredCount] = useState(10);

  const { session, currentIndex, isComplete, startSession, answer, results, reset } = useReviewStore((state) => ({
    session: state.session,
    currentIndex: state.currentIndex,
    isComplete: state.isComplete,
    startSession: state.startSession,
    answer: state.answer,
    results: state.results,
    reset: state.reset,
  }));

  const dueEntries = useMemo(() => vocab.filter((entry) => entry.srs.nextReview <= Date.now()), [vocab]);
  const mastered = useMemo(() => vocab.filter((entry) => entry.srs.stage === 'mastered').length, [vocab]);
  const active = useMemo(() => vocab.filter((entry) => entry.srs.stage === 'learning').length, [vocab]);

  useEffect(() => {
    if (!dueEntries.length) {
      setDesiredCount(5);
      return;
    }
    setDesiredCount((prev) => Math.min(Math.max(1, prev), Math.min(SESSION_LIMIT, dueEntries.length)));
  }, [dueEntries.length]);

  const current = session[currentIndex];
  const rawProgress = session.length ? currentIndex / session.length : 0;

  const handleStart = () => {
    if (dueEntries.length === 0) {
      push('Nenhuma palavra está pronta para revisão agora. Volte mais tarde ou salve novas palavras.', 'info');
      return;
    }
    const count = Math.min(Math.max(1, desiredCount), Math.min(SESSION_LIMIT, dueEntries.length));
    startSession(count);
  };

  const handleRestart = () => {
    reset();
  };

  const summary = useMemo(() => {
    return results.reduce(
      (acc, result) => {
        acc[result.response] += 1;
        if (result.userSentence) acc.produced += 1;
        return acc;
      },
      { 0: 0, 1: 0, 2: 0, produced: 0 } as Record<0 | 1 | 2 | 'produced', number>
    );
  }, [results]);

  const hasSession = session.length > 0;
  const sessionComplete = hasSession && isComplete;
  const progressValue = sessionComplete ? 1 : rawProgress;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-5xl flex-col gap-8 px-6 py-10">
      <header className="space-y-2 text-center md:text-left">
        <p className="text-sm uppercase tracking-[0.3em] text-text-tertiary">Revisão Zen</p>
        <h1 className="font-display text-3xl font-semibold text-text-primary md:text-4xl">
          Consolide com calma
        </h1>
        <p className="text-text-secondary">
          Revise até 20 itens por sessão com repetição espaçada v2 e produção ativa.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="surface-glass rounded-3xl px-6 py-5">
          <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">Disponíveis</p>
          <p className="font-display text-3xl text-text-primary">{dueEntries.length}</p>
          <p className="text-sm text-text-secondary">Prontos para revisar</p>
        </div>
        <div className="surface-glass rounded-3xl px-6 py-5">
          <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">Aprendendo</p>
          <p className="font-display text-3xl text-text-primary">{active}</p>
          <p className="text-sm text-text-secondary">Em fase ativa</p>
        </div>
        <div className="surface-glass rounded-3xl px-6 py-5">
          <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">Dominadas</p>
          <p className="font-display text-3xl text-text-primary">{mastered}</p>
          <p className="text-sm text-text-secondary">Estão sólidas</p>
        </div>
          <div className="surface-glass flex flex-col justify-between rounded-3xl px-6 py-5">
          <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">Progresso</p>
          <div className="mt-2">
            <ProgressRing value={progressValue} size={72} />
          </div>
          <p className="text-xs text-text-secondary">Sessão atual</p>
        </div>
      </section>

      <div className="surface-glass flex flex-1 flex-col gap-6 px-6 py-8">
        {!hasSession && !sessionComplete && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3 text-text-secondary">
                <Flame className="h-5 w-5 text-accent" />
                <div>
                  <p className="font-medium text-text-primary">Prepare a sessão</p>
                  <p className="text-sm text-text-secondary">
                    Selecione quantos cartões quer revisar agora. Recomendado: até {SESSION_LIMIT} itens.
                  </p>
                </div>
              </div>
              <Button intent="accent" onClick={handleStart} disabled={isLoading}>
                <RefreshCw className="mr-2 h-4 w-4" /> Iniciar sessão
              </Button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <label className="flex flex-col gap-3 text-sm text-text-secondary">
                Quantidade
                <input
                  type="range"
                  min={dueEntries.length ? 1 : 0}
                  max={Math.min(SESSION_LIMIT, Math.max(1, dueEntries.length))}
                  value={dueEntries.length ? desiredCount : 0}
                  disabled={dueEntries.length === 0}
                  onChange={(event) => setDesiredCount(Number(event.target.value))}
                />
                <div className="flex justify-between text-xs text-text-tertiary">
                  <span>1</span>
                  <span>{Math.min(SESSION_LIMIT, Math.max(1, dueEntries.length))}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-text-secondary">
                  <span>Selecionados</span>
                  <span className="font-medium text-text-primary">{dueEntries.length ? desiredCount : 0}</span>
                </div>
              </label>
            </div>

            {dueEntries.length === 0 && (
              <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text-secondary">
                <Sparkles className="h-4 w-4 text-accent" />
                Você está em dia! Volte depois ou adicione novas palavras no leitor.
              </div>
            )}
          </div>
        )}

        {hasSession && !sessionComplete && current && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <Clock className="h-4 w-4 text-text-tertiary" />
                <span>
                  Progresso {currentIndex + 1} de {session.length}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-tertiary">
                <span className="rounded-full bg-white/5 px-3 py-1">{current.srs.stage}</span>
                <span className="rounded-full bg-white/5 px-3 py-1">Ease {current.srs.ease.toFixed(2)}</span>
              </div>
            </div>

            <ReviewCard
              entry={current}
              index={currentIndex}
              total={session.length}
              onAnswer={(score, sentence) => answer(score, sentence)}
            />
          </div>
        )}

        {sessionComplete && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <CheckCircle2 className="h-12 w-12 text-accent" />
              <h2 className="font-display text-2xl text-text-primary">Sessão concluída</h2>
              <p className="max-w-md text-text-secondary">
                Bom trabalho! Continue praticando para manter o vocabulário vivo.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {(Object.keys(responseLabels) as Array<'0' | '1' | '2'>).map((key) => {
                const score = Number(key) as 0 | 1 | 2;
                return (
                  <div
                    key={key}
                    className={cn(
                      'rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-center text-text-secondary',
                      score === 2 && 'border-accent/40'
                    )}
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-text-tertiary">{responseLabels[score]}</p>
                    <p className="font-display text-3xl text-text-primary">{summary[score]}</p>
                  </div>
                );
              })}
              <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-center text-text-secondary">
                <p className="text-xs uppercase tracking-[0.2em] text-text-tertiary">Produção</p>
                <p className="font-display text-3xl text-text-primary">{summary.produced}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button intent="ghost" onClick={handleRestart}>
                <ArrowLeftCircle className="mr-2 h-4 w-4" /> Nova sessão
              </Button>
              <Button intent="accent" onClick={handleStart} disabled={dueEntries.length === 0}>
                <RefreshCw className="mr-2 h-4 w-4" /> Revisar mais
              </Button>
            </div>

            {results.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-display text-lg text-text-primary">Registro rápido</h3>
                <ul className="grid gap-2 text-sm text-text-secondary md:grid-cols-2">
                  {results.map((result) => (
                    <li key={`${result.entryId}-${result.timestamp}`} className="rounded-3xl border border-white/5 bg-white/5 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-text-primary">{result.term}</span>
                        <span className="text-xs uppercase tracking-[0.2em] text-text-tertiary">
                          {responseLabels[result.response]}
                        </span>
                      </div>
                      {result.userSentence && <p className="mt-2 text-xs text-text-secondary">“{result.userSentence}”</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
