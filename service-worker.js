const CACHE_NAME = 'hub-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/styles/theme.css',
  '/styles/app-windows.css',
  '/scripts/main.js',
  '/scripts/storage.js',
  '/scripts/utils.js',
  '/scripts/apps/todo.js',
  '/scripts/apps/notes.js',
  '/scripts/apps/calendar.js',
  '/scripts/apps/finance.js',
  '/scripts/apps/sketchpad.js',
  '/scripts/apps/quiz.js',
  '/scripts/apps/flashcards.js',
  '/scripts/apps/calculator.js',
  '/scripts/apps/audio-player.js',
  '/scripts/apps/video-player.js',
  '/scripts/apps/mini-browser.js',
  '/scripts/apps/games.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
