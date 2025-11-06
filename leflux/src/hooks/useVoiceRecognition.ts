import { useCallback, useRef, useState } from 'react';

export interface UseVoiceRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

export interface UseVoiceRecognitionState {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  isSupported: boolean;
  error: string | null;
}

const SpeechRecognition = typeof window !== 'undefined' 
  ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition 
  : null;

export function useVoiceRecognition(options: UseVoiceRecognitionOptions = {}) {
  const {
    language = 'pt-BR',
    continuous = false,
    interimResults = true,
    maxAlternatives = 1,
  } = options;

  const [state, setState] = useState<UseVoiceRecognitionState>({
    isListening: false,
    transcript: '',
    interimTranscript: '',
    isSupported: !!SpeechRecognition,
    error: null,
  });

  const recognitionRef = useRef<any>(null);

  const start = useCallback(() => {
    if (!SpeechRecognition) {
      setState((prev) => ({
        ...prev,
        error: 'Reconhecimento de voz não suportado neste navegador',
      }));
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = continuous;
      recognitionRef.current.interimResults = interimResults;
      recognitionRef.current.maxAlternatives = maxAlternatives;
      recognitionRef.current.lang = language;

      recognitionRef.current.onstart = () => {
        setState((prev) => ({
          ...prev,
          isListening: true,
          error: null,
          transcript: '',
          interimTranscript: '',
        }));
      };

      recognitionRef.current.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript + ' ';
          } else {
            interim += transcript;
          }
        }

        setState((prev) => ({
          ...prev,
          transcript: prev.transcript + final,
          interimTranscript: interim,
        }));
      };

      recognitionRef.current.onerror = (event: any) => {
        setState((prev) => ({
          ...prev,
          error: `Erro: ${event.error}`,
          isListening: false,
        }));
      };

      recognitionRef.current.onend = () => {
        setState((prev) => ({
          ...prev,
          isListening: false,
          interimTranscript: '',
        }));
      };
    }

    recognitionRef.current.start();
  }, [continuous, interimResults, maxAlternatives, language]);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const abort = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    setState((prev) => ({
      ...prev,
      isListening: false,
      interimTranscript: '',
    }));
  }, []);

  const reset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      transcript: '',
      interimTranscript: '',
      error: null,
    }));
  }, []);

  return {
    ...state,
    start,
    stop,
    abort,
    reset,
  };
}
