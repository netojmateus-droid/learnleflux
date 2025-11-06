import { useEffect, useState } from 'react';
import { Trash2, Volume2, Sparkle } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { useToast } from '@/components/common/Toast';
import { useVocabStore } from '@/store/vocabStore';
import { speak, isSpeechSynthesisSupported } from '@/lib/external/tts';
import type { VocabEntry } from '@/types';

interface VocabModalProps {
  entry: VocabEntry;
  isOpen: boolean;
  onClose: () => void;
}

export function VocabModal({ entry, isOpen, onClose }: VocabModalProps) {
  const { push } = useToast();
  const updateVocab = useVocabStore((state) => state.updateVocab);
  const deleteVocab = useVocabStore((state) => state.deleteVocab);
  const [translation, setTranslation] = useState(entry.translation ?? '');
  const [definition, setDefinition] = useState(entry.definition ?? '');
  const [newSentence, setNewSentence] = useState('');
  const [sentences, setSentences] = useState<string[]>(entry.userSentences);

  useEffect(() => {
    if (!isOpen) return;
    setTranslation(entry.translation ?? '');
    setDefinition(entry.definition ?? '');
    setSentences(entry.userSentences);
    setNewSentence('');
  }, [entry, isOpen]);

  const handleSave = () => {
    updateVocab(entry.id, {
      translation: translation || undefined,
      definition: definition || undefined,
      userSentences: sentences,
    });
    push('Vocabulário atualizado.', 'success');
    onClose();
  };

  const handleAddSentence = () => {
    if (!newSentence.trim()) return;
    const next = [...sentences, newSentence.trim()];
    setSentences(next);
    setNewSentence('');
  };

  const handleRemoveSentence = (index: number) => {
    setSentences((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAddToReview = () => {
    updateVocab(entry.id, {
      srs: {
        ...entry.srs,
        nextReview: Date.now(),
        stage: 'learning',
      },
    });
    push('Agendado para revisão.', 'info');
  };

  const handleGenerateSuggestion = () => {
    const suggestion = `Hoje, usei ${entry.term} para descrever algo importante.`;
    setNewSentence(suggestion);
  };

  const handleSpeak = () => {
    if (!isSpeechSynthesisSupported()) return;
    speak(entry.term, { lang: entry.lang });
  };

  const handleDelete = () => {
    if (confirm('Remover esta palavra do vocabulário?')) {
      deleteVocab(entry.id);
      push('Palavra removida.', 'info');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={entry.term}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          {isSpeechSynthesisSupported() && (
            <Button intent="ghost" onClick={handleSpeak} aria-label="Ouvir pronúncia">
              <Volume2 className="h-4 w-4" />
            </Button>
          )}
          <Button intent="ghost" onClick={handleAddToReview}>
            Adicionar à revisão
          </Button>
          <Button intent="ghost" onClick={handleGenerateSuggestion}>
            <Sparkle className="mr-2 h-4 w-4" /> Gerar sugestão
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-text-secondary">
            Tradução
            <input
              value={translation}
              onChange={(event) => setTranslation(event.target.value)}
              className="focus-ring rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary"
              placeholder="Tradução opcional"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-text-secondary">
            Definição
            <textarea
              value={definition}
              onChange={(event) => setDefinition(event.target.value)}
              className="focus-ring min-h-[120px] rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary"
              placeholder="Como você entende este termo"
            />
          </label>
        </div>

        <section className="space-y-3">
          <h3 className="font-display text-lg text-text-primary">Minhas frases</h3>
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              value={newSentence}
              onChange={(event) => setNewSentence(event.target.value)}
              className="focus-ring flex-1 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary"
              placeholder="Escreva uma frase usando a palavra"
            />
            <Button intent="accent" onClick={handleAddSentence}>
              Salvar frase
            </Button>
          </div>
          {sentences.length ? (
            <ul className="space-y-2 text-sm text-text-secondary">
              {sentences.map((sentence, index) => (
                <li key={`${sentence}-${index}`} className="flex items-start gap-3 rounded-2xl bg-white/5 px-4 py-3">
                  <span className="flex-1">{sentence}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSentence(index)}
                    className="text-text-tertiary transition-colors duration-200 hover:text-red-300"
                    aria-label="Remover frase"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-tertiary">Nenhuma frase ainda — crie uma para ativar a produção.</p>
          )}
        </section>

        <div className="flex flex-col justify-between gap-3 sm:flex-row">
          <Button intent="ghost" onClick={handleDelete} className="text-red-300 hover:text-red-200">
            <Trash2 className="mr-2 h-4 w-4" /> Remover
          </Button>
          <div className="flex gap-3">
            <Button intent="ghost" onClick={onClose}>
              Fechar
            </Button>
            <Button intent="accent" onClick={handleSave}>
              Salvar alterações
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
