 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/README.md b/README.md
index 31f507a2f8f5b54f6012cce373df01414a802bfb..1bc96d96eec420044b973f87ff257c41900eff54 100644
--- a/README.md
+++ b/README.md
@@ -1 +1,72 @@
-# learnleflux
\ No newline at end of file
+# LinguaFlow
+
+LinguaFlow é uma Progressive Web App (PWA) _offline-first_ criada com React 18, Vite e TypeScript para proporcionar uma experiência de aprendizado de idiomas baseada em _comprehensible input_. O projeto segue a filosofia "Neuro-Focused Zen": telas minimalistas, microinterações suaves e foco absoluto em leitura calma, vocabulário vivo e revisão espaçada.
+
+## ✨ Principais recursos
+
+- **Biblioteca pessoal** com textos e vídeos importados, porcentagem de progresso e sugestões diárias de vocabulário.
+- **Importação versátil** de conteúdo (texto, links e vídeos do YouTube com capas geradas via pollinations.ai).
+- **Leitura imersiva** com tipografia Lexend, palavras clicáveis, dicionário (DictionaryAPI.dev / Wiktionary) e pronúncia via Web Speech API.
+- **Modo de estudo YouTube** com player integrado, anotações sincronizadas e salvamento de vocabulário com timestamp.
+- **Galeria de vocabulário** visual, com áudio nativo, filtros por estágio SRS e envio à revisão.
+- **Revisão Zen** com algoritmo SRS (new/learning/mastered), cloze tests e som ambiente opcional (chuva, ondas, floresta).
+- **Configurações e progresso**: idioma alvo, ajuste de som ambiente, exportação JSON (backup) e estatísticas gerais.
+- **Offline-first** com cache inteligente via `vite-plugin-pwa` e persistência em IndexedDB (`idb-keyval`).
+
+## 🛠️ Stack principal
+
+- React 18 + Vite + TypeScript
+- TailwindCSS 3 + HeadlessUI + Lucide Icons
+- Zustand com persistência IndexedDB
+- React Router 6, Framer Motion e TanStack Query
+- Service Worker automatizado (`vite-plugin-pwa`)
+
+## 🚀 Executando localmente
+
+```bash
+pnpm install # ou npm install / yarn install
+pnpm dev     # inicia o servidor de desenvolvimento
+```
+
+### Scripts disponíveis
+
+- `dev` – servidor de desenvolvimento
+- `build` – build de produção (`tsc` + `vite build`)
+- `preview` – pré-visualização da build
+- `lint` – lint com ESLint + TypeScript
+
+## 📱 PWA & Offline
+
+- Manifesto e ícones na pasta `public/`
+- Service Worker gerado automaticamente com Workbox (`registerSW` em `main.tsx`)
+- Cache de APIs públicas (DictionaryAPI, Wiktionary e thumbs do YouTube)
+- Persistência de estado em IndexedDB garantindo acesso offline à biblioteca e vocabulário
+
+## 📂 Estrutura de pastas
+
+```
+src/
+├── components/      # UI compartilhada, layout, feedback, leitura
+├── pages/           # Telas principais (Library, Import, Reading, YouTube, Vocabulary, Review, Settings)
+├── providers/       # Providers globais (toasts, som ambiente)
+├── routes/          # Rotas do React Router
+├── services/        # Integração com APIs públicas
+├── store/           # Zustand stores persistentes
+├── utils/           # Funções auxiliares (SRS, language detection, IndexedDB)
+└── styles/          # Estilos Tailwind
+```
+
+## 🔒 Privacidade
+
+Todo o conteúdo é armazenado localmente no navegador. A sincronização externa (Google Drive) está planejada, mas não implementada.
+
+## 🌐 APIs Públicas
+
+- **DictionaryAPI.dev** e **Wiktionary** para definições e exemplos
+- **Web Speech API** para pronúncia nativa e gratuita
+- **Pollinations.ai** para geração de capas e imagens evocativas
+- **YouTube IFrame** para reprodução de vídeos e modo cinema
+
+---
+
+Sinta-se à vontade para explorar, adaptar e evoluir o LinguaFlow conforme suas necessidades de estudo suave e contínuo. Boa jornada! 🌊
 
EOF
)
