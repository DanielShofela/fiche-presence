const CACHE_NAME = 'presence-app-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/Picture1.png',
  '/manifest.json'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Stratégie de cache : Network First avec fallback sur le cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Mettre en cache la nouvelle réponse
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Si offline, utiliser le cache
        return caches.match(event.request);
      })
  );
});

// Gestion des synchronisations en arrière-plan
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-presences') {
    event.waitUntil(syncPresences());
  }
});

// Fonction pour synchroniser les données
async function syncPresences() {
  try {
    const db = await getIndexedDB();
    const pendingRecords = await db.getAll('pending');
    
    for (const record of pendingRecords) {
      try {
        const response = await fetch('/api/presences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(record),
        });
        
        if (response.ok) {
          await db.delete('pending', record.id);
        }
      } catch (error) {
        console.error('Erreur de synchronisation:', error);
      }
    }
  } catch (error) {
    console.error('Erreur lors de la synchronisation:', error);
  }
}