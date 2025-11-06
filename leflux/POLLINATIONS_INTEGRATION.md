# Integração Pollinations no LeFlux

Este projeto já integra a API Pollinations para geração de imagens e texto, com suporte a chat com IA.

## 📋 O que foi adicionado

### 1. Hook `usePollinationsChat`
**Arquivo:** `src/hooks/usePollinationsChat.ts`

Um hook React para conversa com IA focado em aprendizado de idiomas.

```typescript
import { usePollinationsChat } from '@/hooks/usePollinationsChat';

const { messages, isLoading, error, sendMessage, clearHistory } = usePollinationsChat({
  systemPrompt: 'You are a friendly language learning assistant.',
  temperature: 0.8,
  maxTokens: 400,
});

await sendMessage("How do I pronounce 'café'?");
```

**Recursos:**
- Conversa multi-turnos com contexto preservado
- Funciona apenas online (não interfere com offline)
- Suporta cancelamento de requisições
- Tratamento de erros robusto

### 2. Componente `StudyAssistant`
**Arquivo:** `src/components/common/StudyAssistant.tsx`

Um widget de chat flutuante para assistência durante o estudo.

```tsx
import { StudyAssistant } from '@/components/common/StudyAssistant';

function MyPage() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setOpen(!open)}>💬 Assistente</button>
      <StudyAssistant 
        language="Portuguese"
        context="Learning intermediate vocabulary"
        visible={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
```

**Props:**
- `language`: Idioma de estudo (padrão: "English")
- `context`: Contexto adicional para o assistente
- `visible`: Controla visibilidade
- `onClose`: Callback ao fechar

### 3. Geração de Imagens
**Arquivo:** `src/lib/external/images.ts` (já existente)

A função `fetchImageForTerm()` já tenta Pollinations primeiro:

```typescript
import { fetchImageForTerm } from '@/lib/external/images';

const imageUrl = await fetchImageForTerm('café com leite', {
  width: 640,
  height: 480,
  nologo: true,
});
```

**Ordem de fallback:**
1. Pollinations (IA)
2. Pexels API
3. Pixabay API
4. Giphy API
5. Unsplash API

### 4. Geração de Texto
**Arquivo:** `src/lib/external/pollinations.ts` (já existente)

Funções disponíveis:

```typescript
// Texto simples
import { generatePollinationsText } from '@/lib/external/pollinations';
const text = await generatePollinationsText('Write a haiku', { 
  language: 'Portuguese',
  maxCharacters: 200,
});

// Histórias para aprendizado
import { generatePollinationsStory } from '@/lib/external/pollinations';
const story = await generatePollinationsStory(
  'Um gato curioso em um mercado',
  'Portuguese',
  500
);
```

## 🔌 Como Usar

### Exemplo 1: Adicionar assistente à página de leitura

```tsx
// src/pages/Reader/index.tsx
import { StudyAssistant } from '@/components/common/StudyAssistant';

export function Reader() {
  const [assistantOpen, setAssistantOpen] = useState(false);
  
  return (
    <>
      {/* Seu conteúdo */}
      <button onClick={() => setAssistantOpen(true)}>
        💡 Preciso de ajuda
      </button>
      
      <StudyAssistant 
        language={currentLanguage}
        context={`Estou lendo: "${textTitle}"`}
        visible={assistantOpen}
        onClose={() => setAssistantOpen(false)}
      />
    </>
  );
}
```

### Exemplo 2: Usar chat em uma modal

```tsx
import { usePollinationsChat } from '@/hooks/usePollinationsChat';

function VocabularyQuiz() {
  const { messages, sendMessage, isLoading } = usePollinationsChat({
    systemPrompt: 'You are a vocabulary expert. Explain words and provide examples.',
  });
  
  return (
    <div>
      {messages.map(msg => (
        <p key={msg.content}>{msg.role}: {msg.content}</p>
      ))}
      <input 
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            sendMessage(e.currentTarget.value);
            e.currentTarget.value = '';
          }
        }}
        disabled={isLoading}
      />
    </div>
  );
}
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie/edite `.env.local` (não versionado):

```bash
# Modelo Pollinations (opcional, padrão: 'turbo')
VITE_POLLINATIONS_MODEL=turbo

# APIs opcionais (as imagens usam múltiplos fallbacks)
VITE_PEXELS_API_KEY=sua-chave
VITE_PIXABAY_API_KEY=sua-chave
VITE_GIPHY_API_KEY=sua-chave

# Google OAuth (opcional)
VITE_GOOGLE_CLIENT_ID=seu-client-id
```

## 🎯 Casos de Uso

1. **Assistência durante leitura**: Dúvidas sobre vocabulário, pronúncia, contexto
2. **Prática de conversação**: Chat prático em tempo real
3. **Geração de conteúdo**: Histórias, exercícios, exemplos
4. **Capturas de tela**: Pedir explicações sobre imagens/conteúdo
5. **Pronúncia e sotaque**: Pedir exemplos e dicas

## ⚠️ Limitações

- **Online apenas**: Chat com IA requer conexão
- **Rate limits**: Pollinations pode ter limites de requisições
- **Tokens**: Máximo ~400 tokens por resposta (ajustável)
- **Privacidade**: Mensagens enviadas para Pollinations (não persistidas no app)

## 🚀 Próximos Passos

1. Integrar assistente em mais páginas (Lessons, Library, etc)
2. Adicionar persistência opcional de chat (LocalStorage)
3. Criar presets de prompts para diferentes tópicos
4. Adicionar suporte a voice input/output
5. Analytics para entender uso do assistente

## 📚 Referências

- [Pollinations API Docs](https://pollinations.ai)
- [usePollinationsChat Hook](./src/hooks/usePollinationsChat.ts)
- [StudyAssistant Component](./src/components/common/StudyAssistant.tsx)
