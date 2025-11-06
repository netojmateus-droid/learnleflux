import { useEffect, useMemo, useState } from 'react';
import { Volume2, Image as ImageIcon, Loader2, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { useToast } from '@/components/common/Toast';
import { useVocabStore } from '@/store/vocabStore';
import { lookupDictionary } from '@/lib/external/dictionary';
import { fetchImageForTerm } from '@/lib/external/images';
import { lingueeUrl } from '@/lib/external/linguee';
import { isSpeechSynthesisSupported, speak } from '@/lib/external/tts';
import { initialSrsState } from '@/lib/srs';
import type { DictionaryResult } from '@/lib/external/dictionary';

interface WordModalProps {
  term: string;
  lang: string;
  isOpen: boolean;
  onClose: () => void;
  contextSentence?: string;
}

export function WordModal({ term, lang, isOpen, onClose, contextSentence }: WordModalProps) {
  const { push } = useToast();
  const addVocab = useVocabStore((state) => state.addVocab);
  const existingEntry = useVocabStore((state) =>
    state.vocab.find((entry) => entry.term.toLowerCase() === term.toLowerCase())
  );
  const [dictionary, setDictionary] = useState<DictionaryResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState<string>();
  const imageSourceLabel = useMemo(() => {
    if (!imageUrl) return undefined;
    try {
      const { hostname } = new URL(imageUrl);
      if (hostname.includes('pollinations.ai')) return 'Pollinations';
      if (hostname.includes('pexels.com')) return 'Pexels';
      if (hostname.includes('pixabay.com')) return 'Pixabay';
      if (hostname.includes('giphy.com')) return 'Giphy';
      if (hostname.includes('unsplash.com') || hostname.includes('source.unsplash.com')) return 'Unsplash';
      return hostname.replace(/^www\./, '');
    } catch (error) {
      console.warn('Could not parse image source', error);
      return undefined;
    }
  }, [imageUrl]);

  const hasAudio = isSpeechSynthesisSupported();
  useEffect(() => {
    let cancelled = false;
    const hydrate = async () => {
      if (!isOpen) return;
      setLoading(true);
      setError(undefined);
      try {
        const [dict, image] = await Promise.all([
          lookupDictionary(term, lang).catch(() => null),
          fetchImageForTerm(term).catch(() => undefined),
        ]);
        if (!cancelled) {
          setDictionary(dict);
          setImageUrl(image);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Não foi possível carregar os detalhes agora.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [isOpen, term, lang]);

  const handleSave = () => {
    if (existingEntry) {
      push('Palavra já está salva no vocabulário.', 'info');
      return;
    }

    addVocab({
      term,
      lang,
      definition: dictionary?.definition,
      translation: dictionary?.translation,
      examples: dictionary?.examples ?? [],
      imageUrl,
      audioUrl: undefined,
      userSentences: contextSentence ? [contextSentence] : [],
      srs: initialSrsState(),
    });
    push('✨ Word saved.', 'success');
    onClose();
  };

  const handleRefreshImage = async () => {
    setImageLoading(true);
    try {
      const next = await fetchImageForTerm(`${term} illustration`);
      setImageUrl(next);
    } finally {
      setImageLoading(false);
    }
  };

  const handleSpeak = () => {
    if (!hasAudio) return;
    speak(term, { lang });
  };

  const lingueeHref = useMemo(() => lingueeUrl(term, lang, 'pt'), [term, lang]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={term}>
      <div className="space-y-6">
        {imageUrl && (
          <div className="relative overflow-hidden rounded-3xl">
            <img src={imageUrl} alt="" className="h-48 w-full object-cover" loading="lazy" />
            <div className="absolute inset-x-4 top-4 flex items-center justify-between text-xs text-white/70">
              {imageSourceLabel ? (
                <span className="rounded-full bg-black/40 px-3 py-1 backdrop-blur-sm">Image via {imageSourceLabel}</span>
              ) : (
                <span className="rounded-full bg-black/40 px-3 py-1 backdrop-blur-sm">Image</span>
              )}
              <Button intent="ghost" onClick={handleRefreshImage} aria-label="Trocar imagem" disabled={imageLoading}>
                {imageLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {hasAudio && (
            <Button intent="ghost" onClick={handleSpeak} aria-label="Ouvir pronúncia">
              <Volume2 className="h-4 w-4" />
            </Button>
          )}
          <Button intent="ghost" href={lingueeHref} target="_blank" rel="noreferrer">
            Ver no Linguee <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
          {existingEntry && (
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-text-secondary">
              <CheckCircle2 className="h-4 w-4 text-accent" /> Já está no seu vocabulário
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-text-secondary">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando detalhes…
          </div>
        ) : (
          <div className="space-y-4 text-text-secondary">
            {dictionary?.definition && (
              <section>
                <h3 className="font-display text-lg text-text-primary">Definição</h3>
                <p>{dictionary.definition}</p>
              </section>
            )}
            {dictionary?.examples?.length ? (
              <section>
                <h3 className="font-display text-lg text-text-primary">Exemplos</h3>
                <ul className="space-y-2 text-sm">
                  {dictionary.examples.slice(0, 3).map((example) => (
                    <li key={example} className="rounded-2xl bg-white/5 px-4 py-2 text-text-secondary">
                      “{example}”
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            {contextSentence && (
              <section>
                <h3 className="font-display text-lg text-text-primary">Contexto</h3>
                <p>{contextSentence}</p>
              </section>
            )}
            {error && <p className="text-sm text-red-300">{error}</p>}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button intent="ghost" onClick={onClose}>
            Fechar
          </Button>
          <Button intent="accent" onClick={handleSave} disabled={!!existingEntry}>
            Salvar no vocabulário
          </Button>
        </div>
      </div>
    </Modal>
  );
}
