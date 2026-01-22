// ===========================
// SERVICE WORKER
// SituationTracker PWA
// ===========================

const CACHE_VERSION = 'v2.0.0';
const CACHE_NAME = `situationtracker-${CACHE_VERSION}`;

// Dateien, die beim Installation gecacht werden sollen
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/register-sw.js',
    '/manifest.json',
    '/images/icon-192x192.png',
    '/images/icon-512x512.png'
];

// ===========================
// INSTALL EVENT
// ===========================
self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Install Event');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Caching static assets...');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => {
                console.log('✅ Static assets cached successfully');
                // Sofort aktivieren
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Error caching static assets:', error);
            })
    );
});

// ===========================
// ACTIVATE EVENT
// ===========================
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker: Activate Event');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                // Alte Caches löschen
                return Promise.all(
                    cacheNames
                        .filter(cacheName => {
                            return cacheName.startsWith('situationtracker-') 
                                && cacheName !== CACHE_NAME;
                        })
                        .map(cacheName => {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('✅ Old caches cleaned up');
                // Sofort alle Clients übernehmen
                return self.clients.claim();
            })
    );
});

// ===========================
// FETCH EVENT
// Cache-First-Strategie für statische Assets
// Network-First für API-Anfragen
// ===========================
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Nur gleiche Origin cachen
    if (url.origin !== location.origin) {
        return;
    }
    
    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                // Cache-First: Wenn im Cache, sofort zurückgeben
                if (cachedResponse) {
                    console.log('📦 Serving from cache:', request.url);
                    
                    // Im Hintergrund aktualisieren (für HTML/CSS/JS)
                    if (shouldUpdateInBackground(request)) {
                        updateCache(request);
                    }
                    
                    return cachedResponse;
                }
                
                // Nicht im Cache: Vom Netzwerk holen
                console.log('🌐 Fetching from network:', request.url);
                return fetch(request)
                    .then(response => {
                        // Nur erfolgreiche Antworten cachen
                        if (!response || response.status !== 200 || response.type === 'error') {
                            return response;
                        }
                        
                        // Response klonen (kann nur einmal gelesen werden)
                        const responseToCache = response.clone();
                        
                        // In Cache speichern
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(error => {
                        console.error('❌ Fetch failed:', error);
                        
                        // Offline-Fallback für HTML-Seiten
                        if (request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                        
                        throw error;
                    });
            })
    );
});

// ===========================
// HELPER FUNCTIONS
// ===========================

// Prüfen, ob Request im Hintergrund aktualisiert werden soll
function shouldUpdateInBackground(request) {
    const url = request.url;
    return url.endsWith('.html') || 
           url.endsWith('.css') || 
           url.endsWith('.js') ||
           url.endsWith('.json');
}

// Cache im Hintergrund aktualisieren
function updateCache(request) {
    fetch(request)
        .then(response => {
            if (response && response.status === 200) {
                return caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(request, response);
                        console.log('🔄 Cache updated in background:', request.url);
                    });
            }
        })
        .catch(error => {
            console.log('⚠️ Background update failed:', error);
        });
}

// ===========================
// MESSAGES FROM CLIENTS
// ===========================
self.addEventListener('message', event => {
    console.log('💬 Service Worker received message:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName.startsWith('situationtracker-')) {
                            console.log('🗑️ Clearing cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }).then(() => {
                event.ports[0].postMessage({ success: true });
            })
        );
    }
});

console.log('✅ Service Worker loaded successfully');
