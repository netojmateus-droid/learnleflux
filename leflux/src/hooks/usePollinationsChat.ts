import { useState, useCallback, useRef } from 'react';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface UsePollinationsChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

/**
 * Hook para conversa com IA usando Pollinations, focado em suporte a estudo de idiomas.
 * Funciona apenas online; respeita a privacidade do usuário (sem histórico persistido por padrão).
 */
export function usePollinationsChat(options: UsePollinationsChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    model = import.meta.env.VITE_POLLINATIONS_MODEL?.trim() || 'turbo',
    temperature = 0.7,
    maxTokens = 500,
    systemPrompt = 'You are a helpful language learning assistant.',
  } = options;

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim()) return;

      // Prevent multiple concurrent requests
      if (isLoading) return;
      setIsLoading(true);
      setError(null);

      // Create abort controller for this request
      abortControllerRef.current = new AbortController();

      try {
        // Add user message to history
        const newUserMessage: ChatMessage = { role: 'user', content: userMessage };
        const updatedMessages = [...messages, newUserMessage];
        setMessages(updatedMessages);

        // Prepare conversation context
        const conversation = updatedMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        // Call Pollinations API
        const response = await fetch('https://text.pollinations.ai/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              ...conversation,
            ],
            temperature,
            max_tokens: maxTokens,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const assistantMessage =
          typeof data === 'string'
            ? data
            : data.choices?.[0]?.message?.content || 'Sem resposta do servidor.';

        // Add assistant message to history
        const newAssistantMessage: ChatMessage = {
          role: 'assistant',
          content: assistantMessage,
        };

        setMessages((prev) => [...prev, newAssistantMessage]);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.debug('Chat request cancelled');
          return;
        }
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar resposta.';
        setError(errorMessage);
        console.error('Chat error:', err);

        // Remove the user message if the request fails
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, model, temperature, maxTokens, systemPrompt]
  );

  const clearHistory = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearHistory,
    cancelRequest,
  };
}
