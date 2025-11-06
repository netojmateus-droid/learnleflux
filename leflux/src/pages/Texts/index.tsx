import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Wand2, Copy, Check, Shuffle, Filter, BookOpen, GaugeCircle, Clock, Loader2 } from 'lucide-react';
import { useVocabStore } from '@/store/vocabStore';
import { useLibraryStore } from '@/store/libraryStore';
import { usePrefsStore } from '@/store/prefsStore';
import { Button } from '@/components/common/Button';
import { useToast } from '@/components/common/Toast';
import { cn } from '@/lib/utils';
import { useI18n } from '@/services/i18n';
import { generatePollinationsStory } from '@/lib/external/pollinations';
import type { VocabEntry } from '@/types';

const LENGTH_OPTIONS = [120, 220, 360];

type StoryCopy = ReturnType<typeof useI18n>['locale']['texts']['story'];

function interpolate(template: string, variables: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => variables[key] ?? '');
}

function pickRandom<T>(items: T[], count: number): T[] {
  if (count >= items.length) return [...items];
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function buildStory(
  vocabTerms: VocabEntry[],
  length: number,
  languageLabel: string,
  storyCopy: StoryCopy,
  guidance?: string
) {
  const sentences: string[] = [];
  const chosen = pickRandom(vocabTerms, Math.min(6, vocabTerms.length));
  const prompts = chosen.map((entry) => {
    const baseExample = entry.examples?.[0];
    if (baseExample) {
      return baseExample;
    }
    if (entry.definition) {
      return `${entry.term}: ${entry.definition}`;
    }
    const translationClause = entry.translation
      ? interpolate(storyCopy.translationClause, { translation: entry.translation })
      : '';
    return interpolate(storyCopy.fallbackSentence, {
      term: entry.term,
      translationClause,
      language: languageLabel,
    });
  });

  while (sentences.join(' ').length < length) {
    const entry = chosen[Math.floor(Math.random() * chosen.length)] ?? vocabTerms[Math.floor(Math.random() * vocabTerms.length)];
    if (!entry) break;
    const hasTranslation = entry.translation ? ` (${entry.translation})` : '';
    const example = entry.examples?.[Math.floor(Math.random() * (entry.examples.length || 1))] ?? '';
    const sentence = example
      ? example
      : interpolate(storyCopy.fallbackSentence, {
          term: entry.term,
          translationClause: entry.translation
            ? interpolate(storyCopy.translationClause, { translation: entry.translation })
            : '',
          language: languageLabel,
        });
    sentences.push(sentence);
  }

  const intro = interpolate(storyCopy.intro, { language: languageLabel });
  const bulletList = chosen.map((entry) => `- ${entry.term}${entry.translation ? ` (${entry.translation})` : ''}`).join('\n');
  const body = sentences.join(' ');

  const extra = guidance ? `\n${guidance.trim()}` : '';

  return `${intro}${extra ? `\n${extra}` : ''}

${storyCopy.vocabHeading}
${bulletList}

${storyCopy.storyHeading}
${body}`.trim();
}

function buildStoryFromPrompt(prompt: string, languageLabel: string, storyCopy: StoryCopy): string {
  const brief = interpolate(storyCopy.promptIntro, { prompt });
  const middle = interpolate(storyCopy.promptMiddle, { language: languageLabel });
  const ending = interpolate(storyCopy.promptEnding, { language: languageLabel });
  return `${brief}

${middle}

${ending}`.trim();
}

export function TextsPage() {
  const { vocab } = useVocabStore();
  const addText = useLibraryStore((state) => state.addText);
  const languagePrefs = usePrefsStore((state) => state.prefs);
  const { push } = useToast();
  const navigate = useNavigate();
  const { locale } = useI18n();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [lengthIndex, setLengthIndex] = useState(1);
  const [generated, setGenerated] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [mode, setMode] = useState<'vocab' | 'prompt'>('vocab');
  const [customPrompt, setCustomPrompt] = useState('');
  const [guidance, setGuidance] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const selectable = useMemo(() => [...vocab].sort((a, b) => b.updatedAt - a.updatedAt), [vocab]);
  const selectedEntries = useMemo(() => selectable.filter((entry) => selectedIds.includes(entry.id)), [selectable, selectedIds]);

  const targetLangCode = languagePrefs.targetLang || 'en';
  const languageLabel = locale.meta.languageLabel || targetLangCode.toUpperCase();

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((current) => current !== id) : [...prev, id]));
  };

  const handleSelectAll = () => {
    if (selectedIds.length === selectable.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(selectable.map((entry) => entry.id));
    }
  };

  const handleShuffle = () => {
    const randomIds = pickRandom(selectable, Math.min(selectable.length, 6)).map((entry) => entry.id);
    setSelectedIds(randomIds);
  };

  const handleGenerate = async () => {
    if (isGenerating) return;

    const lengthTarget = LENGTH_OPTIONS[lengthIndex];

    if (mode === 'prompt') {
      const trimmedPrompt = customPrompt.trim();
      if (!trimmedPrompt) {
        push(locale.texts.messages.promptRequired, 'info');
        return;
      }

      setIsGenerating(true);
      try {
        const remoteStory = (await generatePollinationsStory(trimmedPrompt, languageLabel, lengthTarget)).trim();
        if (!remoteStory) {
          throw new Error('Empty story from Pollinations');
        }
        setGenerated(remoteStory);
      } catch (error) {
        console.error(error);
        const fallbackStory = buildStoryFromPrompt(trimmedPrompt, languageLabel, locale.texts.story);
        setGenerated(fallbackStory);
        push(locale.texts.messages.fallback, 'info');
      } finally {
        setIsGenerating(false);
      }

      setIsCopied(false);
      return;
    }

    if (!selectable.length) {
      push(locale.texts.messages.needVocab, 'info');
      return;
    }

    const basis = selectedEntries.length ? selectedEntries : selectable.slice(0, 5);
    const trimmedGuidance = guidance.trim();
    const focusTerms = basis
      .map((entry) => `${entry.term}${entry.translation ? ` (${entry.translation})` : ''}`)
      .join(', ');
    const ideaSegments = [
      `Create a story that naturally incorporates these vocabulary items: ${focusTerms}.`,
      trimmedGuidance ? `Additional guidance: ${trimmedGuidance}.` : null,
      `Keep the tone accessible for ${languageLabel} learners.`,
    ].filter((segment): segment is string => Boolean(segment));
    const vocabPrompt = ideaSegments.join(' ');

    setIsGenerating(true);
    try {
      const remoteStory = (await generatePollinationsStory(vocabPrompt, languageLabel, lengthTarget)).trim();
      if (!remoteStory) {
        throw new Error('Empty story from Pollinations');
      }
      setGenerated(remoteStory);
    } catch (error) {
      console.error(error);
      const fallbackStory = buildStory(basis, lengthTarget, languageLabel, locale.texts.story, trimmedGuidance);
      setGenerated(fallbackStory);
      push(locale.texts.messages.fallback, 'info');
    } finally {
      setIsGenerating(false);
    }

    setIsCopied(false);
  };

  const handleCopy = async () => {
    if (!generated) return;
    try {
      await navigator.clipboard.writeText(generated);
      setIsCopied(true);
      push(locale.texts.messages.copied, 'success');
      window.setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error(error);
      push(locale.texts.messages.copyError, 'error');
    }
  };

  const handleExport = () => {
    if (!generated.trim()) {
      push(locale.texts.messages.emptyGenerated, 'info');
      return;
    }
    const title = interpolate(locale.texts.story.promptTitle, {
      date: new Date().toLocaleDateString(),
    });
    const id = addText({
      title,
      lang: targetLangCode,
      content: generated,
      coverUrl: undefined,
      progress: 0,
    });
    push(locale.texts.messages.saved, 'success');
    setTimeout(() => {
      navigate(`/read/${id}`);
    }, 250);
  };

  const summary = useMemo(() => {
    const totalSelected = selectedEntries.length;
    const dueSoon = selectedEntries.filter((entry) => entry.srs.nextReview <= Date.now()).length;
    const mastered = selectedEntries.filter((entry) => entry.srs.stage === 'mastered').length;
    return { totalSelected, dueSoon, mastered };
  }, [selectedEntries]);

  const copyLabel = isCopied ? locale.texts.actions.copied : locale.texts.actions.copy;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-text-tertiary">{locale.texts.tag}</p>
        <h1 className="font-display text-3xl font-semibold text-text-primary md:text-4xl">{locale.texts.title}</h1>
        <p className="max-w-2xl text-text-secondary">{locale.texts.description}</p>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="surface-glass rounded-3xl px-6 py-5">
          <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">{locale.texts.summary.selected}</p>
          <p className="font-display text-3xl text-text-primary">{summary.totalSelected}</p>
        </div>
        <div className="surface-glass rounded-3xl px-6 py-5">
          <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">{locale.texts.summary.due}</p>
          <p className="font-display text-3xl text-text-primary">{summary.dueSoon}</p>
        </div>
        <div className="surface-glass rounded-3xl px-6 py-5">
          <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">{locale.texts.summary.mastered}</p>
          <p className="font-display text-3xl text-text-primary">{summary.mastered}</p>
        </div>
        <div className="surface-glass rounded-3xl px-6 py-5">
          <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">{locale.texts.summary.length}</p>
          <p className="font-display text-3xl text-text-primary">{LENGTH_OPTIONS[lengthIndex]}</p>
        </div>
      </section>

      <div className="surface-glass flex flex-1 flex-col gap-8 px-6 py-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 text-text-secondary">
            <Sparkles className="h-5 w-5 text-accent" />
            <div>
              <p className="font-medium text-text-primary">{locale.texts.modeLabel}</p>
              <p className="text-sm text-text-secondary">
                {mode === 'prompt' ? locale.texts.promptHint : locale.texts.extraPromptHint}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['vocab', 'prompt'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setMode(option)}
                className={cn(
                  'rounded-full border border-white/10 px-4 py-2 text-sm transition hover:text-text-primary',
                  mode === option ? 'border-accent/60 bg-accent/15 text-accent' : 'text-text-secondary'
                )}
              >
                {locale.meta.storyModes[option]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button intent="ghost" onClick={handleSelectAll} disabled={mode === 'prompt'}>
            <Filter className="mr-2 h-4 w-4" />
            {selectedIds.length === selectable.length ? locale.texts.controls.clear : locale.texts.controls.selectAll}
          </Button>
          <Button intent="ghost" onClick={handleShuffle} disabled={mode === 'prompt' || !selectable.length}>
            <Shuffle className="mr-2 h-4 w-4" /> {locale.texts.controls.shuffle}
          </Button>
        </div>

        <label className="flex flex-col gap-2 text-sm text-text-secondary">
          {locale.texts.promptLabel}
          <textarea
            value={mode === 'prompt' ? customPrompt : guidance}
            onChange={(event) => (mode === 'prompt' ? setCustomPrompt(event.target.value) : setGuidance(event.target.value))}
            placeholder={mode === 'prompt' ? locale.texts.promptPlaceholder : locale.texts.extraPromptHint}
            className="focus-ring min-h-[120px] rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary"
          />
          <span className="text-xs text-text-tertiary">
            {mode === 'prompt' ? locale.texts.promptHint : locale.texts.extraPromptHint}
          </span>
        </label>

        {mode === 'prompt' ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-6 text-sm text-text-secondary">
            {locale.texts.promptHint}
          </div>
        ) : selectable.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
            <Wand2 className="h-12 w-12 text-accent" />
            <h2 className="font-display text-2xl text-text-primary">{locale.texts.messages.needVocab}</h2>
            <p className="max-w-md text-text-secondary">{locale.texts.extraPromptHint}</p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {selectable.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => handleToggle(entry.id)}
                className={cn(
                  'rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-left transition hover:border-accent/40 hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40',
                  selectedIds.includes(entry.id) && 'border-accent/60 bg-accent/15 text-accent'
                )}
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-text-tertiary">
                  <span>{entry.lang}</span>
                  <span>{entry.srs.stage}</span>
                </div>
                <h3 className="mt-2 font-display text-xl text-text-primary">{entry.term}</h3>
                {entry.translation && <p className="text-sm text-text-secondary">{entry.translation}</p>}
                <p className="mt-3 line-clamp-2 text-sm text-text-tertiary">
                  {entry.examples?.[0] ?? entry.definition ?? locale.common.noContent}
                </p>
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-text-secondary">
              <GaugeCircle className="h-5 w-5 text-accent" />
              <div className="flex items-center gap-2">
                {LENGTH_OPTIONS.map((option, index) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setLengthIndex(index)}
                    className={cn(
                      'rounded-full border border-white/10 px-4 py-2 text-sm text-text-secondary transition hover:text-text-primary',
                      lengthIndex === index && 'border-accent/60 bg-accent/15 text-accent'
                    )}
                  >
                    {option} {locale.texts.summary.lengthUnit}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button intent="ghost" onClick={handleCopy} disabled={!generated}>
                {isCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />} {copyLabel}
              </Button>
              <Button intent="accent" onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {isGenerating ? locale.texts.actions.generating : locale.texts.actions.generate}
              </Button>
              <Button intent="neutral" onClick={handleExport} disabled={!generated}>
                <BookOpen className="mr-2 h-4 w-4" /> {locale.texts.actions.export}
              </Button>
            </div>
          </div>

          <textarea
            value={generated}
            onChange={(event) => setGenerated(event.target.value)}
            className="focus-ring min-h-[240px] rounded-3xl border border-white/10 bg-[#090909] px-4 py-4 font-mono text-sm text-text-primary"
            placeholder={locale.texts.storyPlaceholder}
          />

          <div className="flex items-center gap-3 text-xs text-text-tertiary">
            <Clock className="h-4 w-4" />
            <span>{locale.texts.footerNote}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
