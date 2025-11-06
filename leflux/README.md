# LeFlux — PWA para aquisição de idiomas

LeFlux é uma Progressive Web App (PWA) offline-first que reúne importação de conteúdos, leitura assistida, construção de vocabulário e revisão espaçada em um único fluxo. Foi pensada para funcionar bem em conexões instáveis e manter a evolução do estudante mesmo sem internet.

## Experiências principais

- **Importador multiformato**: cola textos, arrasta arquivos (PDF, TXT, SRT, VTT) ou salva links/YouTube. Detecta idioma automaticamente, sugere capa via Unsplash e envia direto ao leitor.
- **Leitor imersivo**: tipografia configurável, tema automático, leitura em voz alta (Web Speech API) e palavras clicáveis. Cada termo abre um modal com dicionários, imagens, TTS e salvamento rápido para o vocabulário.
- **Vocabulário inteligente**: filtros por estágio (nova, aprendendo, dominada), busca global, ordenação por revisão/alfabética e modais de edição com frases personalizadas e agendamento para revisão.
- **Sessões de revisão (SRS)**: algoritmo inspirado no SM-2 controla ease/intervalo. O usuário escreve uma frase, escuta pronúncia e avalia a resposta (errei/difícil/fácil). Há resumo visual da sessão e registro das produções.
- **Criação de mini-histórias**: seleciona vocábulos para gerar prompts narrativos, edita no próprio app e pode salvar o texto remixado na biblioteca para leitura posterior.
- **Preferências & backup**: tema, idioma alvo, tamanho de fonte, linha, som ambiente. Exporta/importe JSON com tudo (textos, vocabulário, prefs) e possui área de risco para reset local.

## Arquitetura técnica

- **Stack**: React 18, Vite, TypeScript, Tailwind, Zustand, Dexie (substituído por idb nativo), framer-motion, lucide-react, vite-plugin-pwa.
- **Organização**:
  - `src/components`: componentes reutilizáveis (botões, modais, cards), widgets de vocab e review, layouts.
  - `src/pages`: rotas de alto nível (Biblioteca, Import, Reader, Vocabulary, Review, Texts, Account etc.).
  - `src/store`: Zustand stores para biblioteca, vocabulário, revisão, preferências.
  - `src/lib`: utilitários (SRS, tokenizer, parsers, integrações externas, IndexedDB, detecção de idioma).
  - `src/services`: camadas auxiliares (áudio, i18n, storage).
  - `src/tests`: testes de componentes e serviços críticos.
- **Roteamento**: React Router 6 com `src/routes/AppRoutes.tsx` e layout global em `src/App.tsx`.
- **Estilo**: Tailwind + tokens customizados (gradientes “glass”, tipografia Lexend/Inter, sombras suaves).

## Persistência & sincronização

- **IndexedDB + idb**: `src/lib/db/indexeddb.ts` expõe helpers para textos, vocabulário e prefs com migrations versionadas (`src/lib/db/migrations.ts`).
- **Hydration**: stores chamam `hydrate()` ao iniciar para carregar dados salvos.
- **Backups**: AccountPage exporta JSON com `meta.version`, `texts`, `vocab` e `prefs`. Import saneia entradas antes de inserir.
- **Offline**: Service Worker gerado via `vite-plugin-pwa` (cache de assets + offline fallback em `public/offline.html`).

## Fluxo do usuário

1. **Importa** um material (texto, arquivo ou link).
2. **Lê** no Reader com palavras clicáveis, salva termos relevantes.
3. **Administra** o vocabulário na página Vocabulary com filtros e modais.
4. **Revisa** itens due na página Review, usando SRS para espaçar repetições.
5. **Cria** histórias remixadas em Texts para reforçar vocabulário em contexto.
6. **Ajusta** preferências e faz backups em Account.

## Scripts

```bash
npm install        # instala dependências
npm run dev        # servidor de desenvolvimento em http://localhost:3000
npm run build      # build de produção + geração do service worker
npm run serve      # pré-visualização do build
npm run lint       # lint com ESLint
npm run test       # (placeholder) executar testes
```

## Convenções

- **Alias**: `@/` aponta para `src/` (config em `tsconfig.json` e `vite.config.ts`).
- **Stores**: operações assíncronas devem atualizar IndexedDB via helpers em `db` e manter o estado otimista.
- **Componentes**: usar `Button`, `Modal`, `Card` etc. para seguir design system. Novos ícones via `lucide-react`.
- **Toasts**: `useToast().push(message, intent)` com intents `success | error | info`.
- **Commit**: agrupar mudanças funcionais com descrição clara (ex: “feat(reader): add scroll progress persistence”).

## Roadmap / próximos passos

- Ambient sound player em segundo plano com crossfade.
- Estatísticas diárias (streak, tempo no leitor, cards revisados).
- Integração opcional com nuvens (Drive/Dropbox) para backup automático.
- Suporte a anotações manuais e highlights no Reader.
- Testes end-to-end (Playwright/Cypress) cobrindo importação, salvamento de vocabulário e revisão.

---

Projeto licenciado sob MIT. Contributions são bem-vindas via issues ou pull requests.