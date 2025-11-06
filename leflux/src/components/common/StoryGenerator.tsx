import { useState } from 'react';
import { Loader2, Sparkles, Copy, Check } from 'lucide-react';
import { generatePollinationsStory } from '@/lib/external/pollinations';
import { Button } from '@/components/common/Button';
import { useToast } from '@/components/common/Toast';

export interface StoryGeneratorProps {
  language: string;
  languageCode: string;
  maxCharacters?: number;
  onStoryGenerated?: (story: string) => void;
}

export function StoryGenerator({
  language,
  languageCode,
  maxCharacters = 800,
  onStoryGenerated,
}: StoryGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [story, setStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { push } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      push('Digite um tema ou ideia para a história.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const generated = await generatePollinationsStory(
        prompt,
        language,
        maxCharacters
      );
      setStory(generated);
      onStoryGenerated?.(generated);
      push('História gerada com sucesso!', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao gerar história';
      push(`Erro: ${errorMessage}`, 'error');
      console.error('Story generation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!story) return;
    navigator.clipboard.writeText(story);
    setCopied(true);
    push('História copiada!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="surface-glass flex flex-col gap-6 rounded-3xl px-6 py-8">
      <div>
        <h3 className="font-display text-xl font-semibold text-text-primary">Gerador de Histórias</h3>
        <p className="mt-1 text-sm text-text-secondary">
          Crie histórias personalizadas em {language} para praticar leitura e vocabulário
        </p>
      </div>

      <div className="space-y-3">
        <label className="flex flex-col gap-2 text-sm text-text-secondary">
          Tema ou Ideia
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Ex: Uma gatinha curiosa num mercado de floresc... ou Viagem de trem para Barcelona...`}
            className="focus-ring min-h-[100px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary placeholder-text-tertiary"
            disabled={isLoading}
          />
        </label>

        <div className="flex gap-3">
          <Button
            intent="accent"
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Gerar História
              </>
            )}
          </Button>
        </div>
      </div>

      {story && (
        <div className="space-y-3">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-text-primary whitespace-pre-wrap leading-relaxed">{story}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              intent="ghost"
              onClick={handleCopy}
              className="flex-1"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar
                </>
              )}
            </Button>
            <Button
              intent="ghost"
              onClick={() => setStory('')}
            >
              Limpar
            </Button>
          </div>

          <p className="text-xs text-text-tertiary">
            💡 Dica: Copie a história e importe como novo texto para revisar palavra por palavra no leitor.
          </p>
        </div>
      )}
    </div>
  );
}
