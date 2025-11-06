/// <reference types="node" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const DEV_PORT = 5173;
const codespaceName =
  typeof globalThis !== 'undefined' && 'process' in globalThis
  ? (((globalThis as unknown) as { process: { env?: Record<string, string | undefined> } }).process.env?.CODESPACE_NAME ?? undefined)
    : undefined;
const codespaceHost = codespaceName ? `${codespaceName}-${DEV_PORT}.app.github.dev` : undefined;

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.dictionaryapi\.dev\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'dictionary-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            urlPattern: /^https:\/\/source\.unsplash\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
          {
            urlPattern: /^https:\/\/image\.pollinations\.ai\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'pollinations-images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 14, // 14 days
              },
            },
          },
          {
            urlPattern: /^https:\/\/r\.jina\.ai\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'jina-proxy-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              },
            },
          },
        ],
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'LeFlux',
        short_name: 'LeFlux',
        description: 'PWA offline-first para aprendizado de idiomas',
        theme_color: '#FFD166',
        background_color: '#0B0F14',
        display: 'standalone',
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
        ],
      },
    }),
  ],
  server: {
    port: DEV_PORT,
    host: true,
    open: true,
    hmr: codespaceHost
      ? {
          protocol: 'wss',
          host: codespaceHost,
        }
      : {
          protocol: 'ws',
        },
  },
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': '/src',
      '@/components': '/src/components',
      '@/pages': '/src/pages',
      '@/store': '/src/store',
      '@/lib': '/src/lib',
      '@/types': '/src/types',
      '@/styles': '/src/styles',
      '@/hooks': '/src/hooks',
    },
  },
});