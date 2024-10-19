//
//  service-worker.js
//  bar-inventory-app-local
//
//  Created by Patrick Wills on 10/19/24.
//

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('bar-inventory-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/app.js',
        '/manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
