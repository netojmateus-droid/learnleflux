// This file contains the implementation of the service worker for LeFlux PWA.
// It manages caching and fetch requests to enable offline functionality.

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('leflux-cache-v1').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/offline.html',
                '/manifest.webmanifest',
                '/index.css',
                // Add other assets to cache as needed
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                return caches.match('/offline.html');
            });
        })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = ['leflux-cache-v1'];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});