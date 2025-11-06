import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { ReaderHeader } from '@/components/word/ReaderHeader';
import { WordModal } from '@/components/word/WordModal';
import { Button } from '@/components/common/Button';
import { StudyAssistant } from '@/components/common/StudyAssistant';
import { useLibraryStore } from '@/store/libraryStore';
import { usePrefsStore } from '@/store/prefsStore';
import { useVocabStore } from '@/store/vocabStore';
import { isSpeechSynthesisSupported } from '@/lib/external/tts';
import { cn } from '@/lib/utils';

const WORD_CAPTURE_REGEX = /([\p{L}\p{M}][\p{L}\p{M}'\-\u2019]*)/gu;
const WORD_MATCH_REGEX = /^[\p{L}\p{M}][\p{L}\p{M}'\-\u2019]*$/u;

function getParagraphs(content: string) {
  return content
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

function getSentenceForWord(paragraph: string, word: string) {
  const normalized = word.trim().toLowerCase();
  const sentences = paragraph.match(/[^.!?]+[.!?]?/g);
  if (!sentences) return paragraph.trim();
  const match = sentences.find((sentence) => sentence.toLowerCase().includes(normalized));
  return (match ?? paragraph).trim();
}

export function ReaderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { texts, isLoading } = useLibraryStore((state) => ({ texts: state.texts, isLoading: state.isLoading }));
  const updateText = useLibraryStore((state) => state.updateText);
  const prefs = usePrefsStore((state) => state.prefs);
  const vocab = useVocabStore((state) => state.vocab);
  const [selectedWord, setSelectedWord] = useState<{ term: string; sentence: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const text = useMemo(() => texts.find((item) => item.id === id), [texts, id]);
  const savedTerms = useMemo(() => new Set(vocab.map((entry) => entry.term.toLowerCase())), [vocab]);
  const paragraphs = useMemo(() => (text ? getParagraphs(text.content) : []), [text]);

  useEffect(() => {
    if (!text) return;
    setProgress(text.progress ?? 0);
  }, [text]);

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      if (scrollHeight <= clientHeight) {
        setProgress(1);
        return;
      }
      const next = Math.min(1, Math.max(0, scrollTop / (scrollHeight - clientHeight)));
      setProgress(next);
    };

    element.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [paragraphs.length, text?.id]);

  useEffect(() => {
    if (!text || !id) return;
    const rounded = Number(progress.toFixed(3));
    if (rounded === Number((text.progress ?? 0).toFixed(3))) return;
    updateText(id, { progress: progress });
  }, [progress, updateText, id, text]);

  useEffect(() => {
    if (!text) return;
    document.title = `${text.title} · LeFlux`;
  }, [text]);

  const handleWordClick = (word: string, paragraph: string) => {
    const clean = word.trim();
    if (!clean) return;
    const context = getSentenceForWord(paragraph, clean);
    setSelectedWord({ term: clean, sentence: context });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWord(null);
  };

  const handleSpeak = () => {
    if (!text || !isSpeechSynthesisSupported()) return;
    const utterance = new SpeechSynthesisUtterance(text.content);
    if (text.lang) utterance.lang = text.lang;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleStopSpeak = () => {
    if (!isSpeechSynthesisSupported()) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  useEffect(() => {
    return () => {
      if (isSpeechSynthesisSupported()) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (isLoading && !text) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-5xl flex-col gap-8 px-6 py-10">
        <div className="surface-glass flex flex-1 items-center justify-center px-6 py-16">
          <p className="text-text-secondary">Carregando conteúdo…</p>
        </div>
      </div>
    );
  }

  if (!text) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-4xl flex-col gap-8 px-6 py-10">
        <div className="surface-glass flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
          <h1 className="font-display text-2xl text-text-primary">Conteúdo não encontrado</h1>
          <p className="max-w-md text-text-secondary">
            Não encontramos o texto solicitado. Ele pode ter sido removido ou não sincronizou corretamente.
          </p>
          <Button intent="ghost" onClick={() => navigate(-1)}>
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <ReaderHeader
        title={text.title}
        progress={progress}
        onBack={() => navigate(-1)}
        onSpeak={handleSpeak}
        onStopSpeak={handleStopSpeak}
        isSpeaking={isSpeaking}
      />
      <div
        ref={contentRef}
        className="surface-glass flex-1 overflow-y-auto px-6 py-8"
        style={{ fontSize: `${prefs.fontSize}px`, lineHeight: prefs.lineHeight }}
      >
        <div className="space-y-6 text-text-primary">
          {paragraphs.map((paragraph, paragraphIndex) => {
            const parts = paragraph.split(WORD_CAPTURE_REGEX);
            return (
              <p key={`${paragraphIndex}-${paragraph.slice(0, 10)}`} className="leading-relaxed">
                {parts.map((part, partIndex) => {
                  if (!part) return null;
                  if (WORD_MATCH_REGEX.test(part)) {
                    const normalized = part.toLowerCase();
                    const isSaved = savedTerms.has(normalized);
                    return (
                      <button
                        key={`${paragraphIndex}-${partIndex}`}
                        type="button"
                        className={cn(
                          'inline rounded-md px-[2px] py-0.5 transition-colors hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent/50',
                          isSaved && 'bg-accent/15 text-accent'
                        )}
                        onClick={() => handleWordClick(part, paragraph)}
                      >
                        {part}
                      </button>
                    );
                  }
                  return (
                    <span key={`${paragraphIndex}-${partIndex}`}>
                      {part}
                    </span>
                  );
                })}
              </p>
            );
          })}
        </div>
      </div>

      <WordModal
        term={selectedWord?.term ?? ''}
        lang={text.lang}
        isOpen={isModalOpen && !!selectedWord}
        onClose={handleCloseModal}
        contextSentence={selectedWord?.sentence}
      />

      <button
        onClick={() => setAssistantOpen(!assistantOpen)}
        className="fixed bottom-20 right-6 rounded-full bg-accent p-3 hover:bg-accent/80 transition-colors shadow-lg z-40"
        title="Assistente de Estudo"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </button>

      <StudyAssistant
        language={text.lang === 'pt' ? 'Português' : text.lang === 'es' ? 'Espanhol' : 'English'}
        context={`Estou lendo: "${text.title}"`}
        visible={assistantOpen}
        onClose={() => setAssistantOpen(false)}
      />
    </div>
  );
}
