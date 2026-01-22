// ===========================
// SERVICE WORKER REGISTRATION
// ===========================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        registerServiceWorker();
    });
} else {
    console.log('⚠️ Service Worker wird von diesem Browser nicht unterstützt');
}

async function registerServiceWorker() {
    try {
        console.log('🔧 Registriere Service Worker...');
        
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
            scope: '/'
        });
        
        console.log('✅ Service Worker erfolgreich registriert:', registration.scope);
        
        // Update-Handling
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('🆕 Neue Service Worker Version gefunden');
            
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('🔄 Neue Version verfügbar. Seite neu laden für Update.');
                    
                    // Optional: Benutzer informieren
                    if (confirm('Eine neue Version ist verfügbar. Jetzt neu laden?')) {
                        newWorker.postMessage({ type: 'SKIP_WAITING' });
                        window.location.reload();
                    }
                }
            });
        });
        
        // Prüfe auf Updates
        setInterval(() => {
            registration.update();
            console.log('🔍 Prüfe auf Service Worker Updates...');
        }, 60 * 60 * 1000); // Jede Stunde
        
    } catch (error) {
        console.error('❌ Service Worker Registrierung fehlgeschlagen:', error);
    }
}

// Controller-Change-Event: Wird gefeuert wenn ein neuer SW aktiv wird
navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('🔄 Neuer Service Worker hat die Kontrolle übernommen');
    // Seite automatisch neu laden
    window.location.reload();
});

// Debug-Funktion: Service Worker neu laden
window.reloadServiceWorker = async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
        await registration.unregister();
        console.log('🗑️ Service Worker deregistriert');
        window.location.reload();
    }
};

// Debug-Funktion: Cache leeren
window.clearCache = async () => {
    try {
        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames.map(cacheName => {
                if (cacheName.startsWith('situationtracker-')) {
                    console.log('🗑️ Cache gelöscht:', cacheName);
                    return caches.delete(cacheName);
                }
            })
        );
        console.log('✅ Alle Caches geleert');
        alert('Cache geleert! Seite wird neu geladen.');
        window.location.reload();
    } catch (error) {
        console.error('❌ Fehler beim Cache leeren:', error);
    }
};

console.log('📱 PWA Ready! Offline-Funktionalität verfügbar.');
console.log('💡 Debug-Befehle:');
console.log('   - clearCache() → Cache leeren');
console.log('   - reloadServiceWorker() → Service Worker neu laden');
