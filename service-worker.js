const CACHE_NAME = 'hub-v1';
const ASSETS = [
  './',
  './index.html',
  './styles/main.css',
  './styles/app-windows.css',
  './scripts/main.js',
  './scripts/storage.js',
  './scripts/utils.js',
  './scripts/apps/analytics.js',
  './scripts/apps/audio-player.js',
  './scripts/apps/books.js',
  './scripts/apps/calculator.js',
  './scripts/apps/calendar.js',
  './scripts/apps/checklist.js',
  './scripts/apps/collage.js',
  './scripts/apps/converter.js',
  './scripts/apps/fileman.js',
  './scripts/apps/finance.js',
  './scripts/apps/flashcards.js',
  './scripts/apps/games.js',
  './scripts/apps/goals.js',
  './scripts/apps/habits.js',
  './scripts/apps/hangman.js',
  './scripts/apps/logodesign.js',
  './scripts/apps/lorem.js',
  './scripts/apps/markdown.js',
  './scripts/apps/math.js',
  './scripts/apps/meme-gen.js',
  './scripts/apps/memory.js',
  './scripts/apps/minesweeper.js',
  './scripts/apps/mini-browser.js',
  './scripts/apps/notes.js',
  './scripts/apps/palette.js',
  './scripts/apps/passgen.js',
  './scripts/apps/photoedit.js',
  './scripts/apps/pixelart.js',
  './scripts/apps/planner.js',
  './scripts/apps/pomodoro.js',
  './scripts/apps/qrcode.js',
  './scripts/apps/quiz.js',
  './scripts/apps/recipes.js',
  './scripts/apps/rps.js',
  './scripts/apps/sketchpad.js',
  './scripts/apps/soundboard.js',
  './scripts/apps/textutils.js',
  './scripts/apps/timezone.js',
  './scripts/apps/todo.js',
  './scripts/apps/typing.js',
  './scripts/apps/typography.js',
  './scripts/apps/video-player.js',
  './scripts/apps/vocab.js',
  './scripts/apps/voicerec.js'
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
