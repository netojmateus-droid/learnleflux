
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
// FIX: Add fileURLToPath to define __dirname in an ES module context.
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'LinguaFlow',
        short_name: 'LinguaFlow',
        description: 'A Neuro-Focused Zen PWA for language learning through comprehensible input.',
        theme_color: '#111827',
        background_color: '#111827',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/source\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'unsplash-images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/api\.dictionaryapi\.dev\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'dictionary-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      // FIX: Use `__dirname` defined from `import.meta.url` to resolve path in ES module.
      '@': path.resolve(__dirname, './src'),
    },
  },
  // pdfjs-dist worker
  // optimizeDeps: {
  //   exclude: ['pdfjs-dist'],
  // },
  esbuild: {
    target: 'esnext', // Support top-level await
  },
  build: {
    target: 'esnext', // Support top-level await in the build output
  },
});