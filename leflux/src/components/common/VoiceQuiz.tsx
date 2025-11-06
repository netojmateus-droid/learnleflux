import { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Check, X } from 'lucide-react';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { Button } from '@/components/common/Button';
import { useToast } from '@/components/common/Toast';
import { cn } from '@/lib/utils';

export interface VoiceQuizProps {
  questions: Array<{
    id: string;
    question: string;
    correctAnswer: string;
    pronunciation: string;
  }>;
  language?: string;
  languageCode?: string;
  onComplete?: (results: { correct: number; total: number }) => void;
}

export function VoiceQuiz({
  questions,
  language = 'Portuguese',
  languageCode = 'pt-BR',
  onComplete,
}: VoiceQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<Array<{ correct: boolean; answer: string }>>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const { push } = useToast();

  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error,
    start: startListening,
    stop: stopListening,
    reset: resetTranscript,
  } = useVoiceRecognition({
    language: languageCode,
    continuous: false,
    interimResults: true,
  });

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const checkAnswer = (answer: string) => {
    const normalized = answer.trim().toLowerCase().replace(/[^\p{L}\s]/gu, '');
    const correct = normalized.includes(currentQuestion.correctAnswer.toLowerCase());

    setFeedback(correct ? 'correct' : 'incorrect');
    setResults((prev) => [...prev, { correct, answer }]);

    if (!correct) {
      push(`Resposta incorreta. Correto: ${currentQuestion.correctAnswer}`, 'error');
    } else {
      push('Excelente! 🎉', 'success');
    }

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
        setFeedback(null);
        resetTranscript();
      } else {
        const correct = results.filter((r) => r.correct).length + (feedback === 'correct' ? 1 : 0);
        onComplete?.({ correct, total: questions.length });
      }
    }, 2000);
  };

  const handleSubmit = () => {
    const answer = (transcript || interimTranscript).trim();
    if (!answer) {
      push('Nenhuma resposta detectada. Tente novamente.', 'warning');
      return;
    }
    stopListening();
    checkAnswer(answer);
  };

  const handleSkip = () => {
    setResults((prev) => [...prev, { correct: false, answer: '' }]);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      resetTranscript();
    } else {
      const correct = results.filter((r) => r.correct).length;
      onComplete?.({ correct, total: questions.length });
    }
  };

  const playPronunciation = () => {
    const utterance = new SpeechSynthesisUtterance(currentQuestion.pronunciation);
    utterance.lang = languageCode;
    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) {
    return (
      <div className="surface-glass rounded-3xl p-8 text-center">
        <p className="text-text-secondary">
          Reconhecimento de voz não é suportado neste navegador. Use Chrome, Edge ou Safari.
        </p>
      </div>
    );
  }

  if (results.length === questions.length) {
    const correct = results.filter((r) => r.correct).length;
    const percentage = Math.round((correct / questions.length) * 100);

    return (
      <div className="surface-glass rounded-3xl p-8 text-center space-y-6">
        <div>
          <p className="font-display text-4xl font-bold text-accent">{percentage}%</p>
          <p className="text-text-secondary mt-2">
            Você acertou {correct} de {questions.length} perguntas
          </p>
        </div>

        <div className="space-y-2">
          {results.map((result, idx) => (
            <div
              key={idx}
              className={cn(
                'flex items-center gap-3 rounded-lg p-3',
                result.correct ? 'bg-green-900/20' : 'bg-red-900/20'
              )}
            >
              {result.correct ? (
                <Check className="h-5 w-5 text-green-400" />
              ) : (
                <X className="h-5 w-5 text-red-400" />
              )}
              <div className="text-left">
                <p className="text-sm font-semibold text-text-primary">
                  {questions[idx].question}
                </p>
                <p className={cn('text-xs', result.correct ? 'text-green-400' : 'text-red-400')}>
                  {result.correct ? '✓ Correto' : `✗ ${result.answer || 'Pulado'}`}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Button intent="accent" onClick={() => window.location.reload()}>
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="surface-glass rounded-3xl p-8 space-y-8">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm text-text-tertiary">
            Pergunta {currentIndex + 1} de {questions.length}
          </p>
          <p className="text-sm font-semibold text-accent">{Math.round(progress)}%</p>
        </div>
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
          <p className="text-lg font-semibold text-text-primary mb-4">
            {currentQuestion.question}
          </p>
          <Button intent="ghost" onClick={playPronunciation} className="w-full">
            <Volume2 className="mr-2 h-4 w-4" />
            Ouvir Pronúncia
          </Button>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-text-secondary">
            {isListening ? '🎤 Ouvindo...' : 'Clique no microfone para começar'}
          </p>

          <div className="flex gap-3">
            {!isListening ? (
              <Button
                intent="accent"
                onClick={startListening}
                className="flex-1"
              >
                <Mic className="mr-2 h-4 w-4" />
                Começar
              </Button>
            ) : (
              <Button
                intent="ghost"
                onClick={stopListening}
                className="flex-1 border-red-500/50 bg-red-900/20"
              >
                <MicOff className="mr-2 h-4 w-4" />
                Parar
              </Button>
            )}
          </div>

          {(transcript || interimTranscript) && (
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-sm text-text-primary">
                {transcript}
                <span className="text-text-tertiary italic">{interimTranscript}</span>
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-900/20 rounded-lg border border-red-500/30 text-red-200 text-sm">
              {error}
            </div>
          )}

          {feedback && (
            <div
              className={cn(
                'p-4 rounded-lg text-center font-semibold',
                feedback === 'correct'
                  ? 'bg-green-900/20 border border-green-500/30 text-green-200'
                  : 'bg-red-900/20 border border-red-500/30 text-red-200'
              )}
            >
              {feedback === 'correct' ? '✓ Correto!' : '✗ Tente novamente!'}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              intent="ghost"
              onClick={handleSubmit}
              disabled={!transcript && !interimTranscript}
              className="flex-1"
            >
              <Check className="mr-2 h-4 w-4" />
              Enviar
            </Button>
            <Button
              intent="ghost"
              onClick={handleSkip}
            >
              Pular
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
