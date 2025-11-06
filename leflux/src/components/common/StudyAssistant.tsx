import { useState, useRef, useEffect } from 'react';
import { Loader2, Send, X, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { usePollinationsChat } from '@/hooks/usePollinationsChat';
import { Button } from '@/components/common/Button';
import { useToast } from '@/components/common/Toast';
import { cn } from '@/lib/utils';

export interface StudyAssistantProps {
  language?: string;
  context?: string;
  visible?: boolean;
  onClose?: () => void;
}

export function StudyAssistant({
  language = 'English',
  context = '',
  visible = false,
  onClose,
}: StudyAssistantProps) {
  const [input, setInput] = useState('');
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { push } = useToast();

  const { messages, isLoading, error, sendMessage, clearHistory } = usePollinationsChat({
    systemPrompt: `You are a friendly language learning assistant helping students learn ${language}.${
      context ? ` Context: ${context}` : ''
    } Answer questions clearly, provide pronunciation tips, suggest examples, and encourage practice. Keep responses concise and encouraging.`,
    temperature: 0.8,
    maxTokens: 400,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setInput('');
    try {
      await sendMessage(trimmed);
    } catch (err) {
      push('Erro ao enviar mensagem. Tente novamente.', 'error');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!mounted || !visible) return null;

  return (
    <div className="surface-glass fixed bottom-6 right-6 z-50 flex h-[500px] w-[400px] flex-col rounded-2xl border border-white/10 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-accent/10 px-5 py-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-text-primary">Assistente de Estudo</h3>
          <p className="text-xs text-text-tertiary">{language}</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-2 hover:bg-white/10 transition-colors"
          aria-label="Fechar"
        >
          <X className="h-4 w-4 text-text-secondary" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="text-4xl mb-3">🌸</div>
            <p className="text-sm text-text-secondary">Faça uma pergunta sobre {language}!</p>
            <p className="text-xs text-text-tertiary mt-2">Pronuncia, gramática, vocabulário...</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                'flex',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[80%] rounded-xl p-3 text-sm',
                  msg.role === 'user'
                    ? 'bg-accent/30 text-text-primary'
                    : 'bg-white/5 text-text-secondary'
                )}
              >
                <ReactMarkdown className="prose prose-sm dark:prose-invert">{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-xl bg-white/5 p-3">
              <Loader2 className="h-4 w-4 animate-spin text-accent" />
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-900/20 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/10 bg-white/5 p-4 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Faça uma pergunta..."
            disabled={isLoading}
            className="focus-ring flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-text-primary placeholder-text-tertiary disabled:opacity-50"
          />
          <Button
            intent="accent"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-2"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => {
              clearHistory();
              push('Histórico limpo.', 'info');
            }}
            className="flex items-center gap-2 text-xs text-text-tertiary hover:text-text-secondary transition-colors w-full justify-center py-1"
          >
            <Trash2 className="h-3 w-3" />
            Limpar histórico
          </button>
        )}
      </div>
    </div>
  );
}
