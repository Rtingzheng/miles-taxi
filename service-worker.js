self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('jump-meter-cache').then(cache => {
      return cache.addAll([
        'miles.html',
        'script.js',
        'manifest.json',
        'car1.png',
        'car2.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(resp => resp || fetch(event.request))
  );
});