// Service Worker for Recovery Connect PWA
const CACHE_NAME = 'recovery-connect-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/recovery-tools.html',
  '/daily-meditations.html',
  '/peer-support.html',
  '/cbt-tools.html',
  '/journal-template.html',
  '/emergency-support.html',
  '/tracker-sobriety.html',
  '/assessment-pandemic.html',
  '/meditation-guide.html',
  '/planner-weekly.html',
  '/resource-library.html',
  '/peer-mentorship.html',
  '/crisis-support.html',
  '/community-guidelines.html',
  '/privacy-policy.html',
  '/terms-of-service.html',
  '/stories.html',
  // Add CSS and JS files (if externally linked)
  // Add image assets that are critical
  '/manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activated successfully');
      return self.clients.claim();
    })
  );
});

// Fetch event - Cache First strategy for app shell, Network First for data
self.addEventListener('fetch', (event) => {
  const requestURL = new URL(event.request.url);
  
  // Handle different caching strategies based on request type
  if (event.request.destination === 'document') {
    // For HTML documents, use Network First strategy
    event.respondWith(networkFirst(event.request));
  } else if (event.request.destination === 'image') {
    // For images, use Cache First strategy
    event.respondWith(cacheFirst(event.request));
  } else {
    // For everything else, use Cache First strategy
    event.respondWith(cacheFirst(event.request));
  }
});

// Cache First strategy
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache First strategy failed:', error);
    
    // Return offline page for HTML documents
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    
    // Return cached version or error
    return caches.match(request) || new Response('Network error', { 
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Network First strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Network First strategy failed, falling back to cache:', error);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page as last resort
    return caches.match('/offline.html') || new Response('Offline', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Background sync for data
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'background-sync-recovery-data') {
    event.waitUntil(syncRecoveryData());
  }
});

// Sync recovery data when online
async function syncRecoveryData() {
  try {
    // Get any pending data from IndexedDB or localStorage
    // This would sync with your backend when available
    console.log('Service Worker: Syncing recovery data...');
    
    // Placeholder for actual sync logic
    // In a real implementation, this would:
    // 1. Get offline data from storage
    // 2. Send to server
    // 3. Handle conflicts
    // 4. Update local storage
    
    return Promise.resolve();
  } catch (error) {
    console.error('Service Worker: Data sync failed', error);
    throw error;
  }
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Recovery Connect notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/icons/action-explore.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/action-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Recovery Connect', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  event.notification.close();
  
  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle app updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});