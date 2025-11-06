import { useMemo, useState, useEffect } from 'react';
import { Volume2, Mic, MicOff } from 'lucide-react';
import { VocabEntry } from '@/types';
import { Button } from '@/components/common/Button';
import { speak, isSpeechSynthesisSupported } from '@/lib/external/tts';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';

interface ReviewCardProps {
  entry: VocabEntry;
  index: number;
  total: number;
  onAnswer: (score: 0 | 1 | 2, userSentence?: string) => void;
}

const answerLabels: Record<0 | 1 | 2, string> = {
  0: 'Errei',
  1: 'Difícil',
  2: 'Fácil',
};

export function ReviewCard({ entry, index, total, onAnswer }: ReviewCardProps) {
  const [sentence, setSentence] = useState('');
  const [revealed, setRevealed] = useState(false);
  const hasAudio = isSpeechSynthesisSupported();

  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported: isVoiceSupported,
    start: startListening,
    stop: stopListening,
    reset: resetTranscript,
  } = useVoiceRecognition({
    language: entry.lang === 'pt' ? 'pt-BR' : entry.lang === 'es' ? 'es-ES' : 'en-US',
    continuous: false,
    interimResults: true,
  });

  // Update sentence when voice transcript changes
  useEffect(() => {
    if (transcript) {
      setSentence(transcript);
    }
  }, [transcript]);

  const prompt = useMemo(() => {
    const base = entry.examples?.[0] ?? entry.definition ?? `Crie uma frase usando "${entry.term}"`;
    const regex = new RegExp(entry.term, 'ig');
    const cloze = base.replace(regex, '____');
    return cloze.includes('____') ? cloze : `${cloze} — complete com ${entry.term}`;
  }, [entry]);

  const handleSpeak = () => {
    if (!hasAudio) return;
    speak(entry.term, { lang: entry.lang });
  };

  const handleAnswer = (score: 0 | 1 | 2) => {
    onAnswer(score, sentence.trim() || undefined);
    setSentence('');
    setRevealed(false);
    resetTranscript();
  };

  const handleToggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <article className="surface-glass flex flex-col gap-6 px-6 py-8">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-text-tertiary">
          <span>
            {index + 1} / {total}
          </span>
          <span>{entry.lang}</span>
        </div>
        <div className="flex items-center gap-3">
          <h2 className="font-display text-3xl text-text-primary">{entry.term}</h2>
          {hasAudio && (
            <Button intent="ghost" onClick={handleSpeak} aria-label="Ouvir pronúncia">
              <Volume2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-sm text-text-secondary">{prompt}</p>
      </header>

      <textarea
        value={sentence + (isListening ? interimTranscript : '')}
        onChange={(event) => setSentence(event.target.value)}
        className="focus-ring min-h-[140px] rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary"
        placeholder="Escreva sua frase aqui ou use o microfone"
      />

      {isVoiceSupported && (
        <div className="flex items-center gap-3">
          <Button
            intent={isListening ? 'accent' : 'ghost'}
            onClick={handleToggleVoice}
            aria-label={isListening ? 'Parar gravação' : 'Começar gravação de voz'}
          >
            {isListening ? (
              <>
                <MicOff className="mr-2 h-4 w-4" />
                Parar gravação
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Usar voz
              </>
            )}
          </Button>
          {isListening && (
            <span className="text-sm text-accent">🎤 Ouvindo...</span>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
        <Button intent="ghost" onClick={() => setRevealed((prev) => !prev)}>
          {revealed ? 'Ocultar pistas' : 'Mostrar pistas'}
        </Button>
        {revealed && (
          <div className="flex flex-wrap items-center gap-3">
            {entry.translation && <span className="rounded-full bg-white/5 px-3 py-1">{entry.translation}</span>}
            {entry.definition && <span className="rounded-full bg-white/5 px-3 py-1">{entry.definition}</span>}
          </div>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {(Object.keys(answerLabels) as Array<'0' | '1' | '2'>).map((key) => {
          const value = Number(key) as 0 | 1 | 2;
          const intent = value === 2 ? 'accent' : value === 1 ? 'neutral' : 'ghost';
          return (
            <Button key={key} intent={intent} onClick={() => handleAnswer(value)} fullWidth>
              {answerLabels[value]}
            </Button>
          );
        })}
      </div>
    </article>
  );
}
