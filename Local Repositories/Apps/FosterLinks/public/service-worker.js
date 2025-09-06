// Service Worker for FosterLinks PWA

const CACHE_NAME = 'fosterlinks-cache-v2';
const STATIC_CACHE_NAME = 'fosterlinks-static-v2';
const DYNAMIC_CACHE_NAME = 'fosterlinks-dynamic-v2';
const FONT_CACHE_NAME = 'fosterlinks-fonts-v2';
const IMAGE_CACHE_NAME = 'fosterlinks-images-v2';

// Assets to cache immediately on service worker install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/js/0.chunk.js',
  '/static/js/bundle.js',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/offline.html' // Fallback page for when offline
];

// Font URLs to cache
const FONT_URLS = [
  'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap',
  'https://fonts.googleapis.com/icon?family=Material+Icons'
];

// Cache timeout in milliseconds (7 days)
const CACHE_TIMEOUT = 7 * 24 * 60 * 60 * 1000;

// Install a service worker
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing Service Worker...');
  
  // Skip waiting to ensure the new service worker activates immediately
  self.skipWaiting();
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE_NAME)
        .then(cache => {
          console.log('[Service Worker] Caching static assets');
          return cache.addAll(STATIC_ASSETS);
        }),
      
      // Cache fonts
      caches.open(FONT_CACHE_NAME)
        .then(cache => {
          console.log('[Service Worker] Caching fonts');
          return cache.addAll(FONT_URLS);
        })
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating Service Worker...');
  
  // Take control of all clients immediately
  self.clients.claim();
  
  event.waitUntil(
    caches.keys()
      .then(keyList => {
        return Promise.all(keyList.map(key => {
          // Delete any old caches
          if (
            key !== STATIC_CACHE_NAME && 
            key !== DYNAMIC_CACHE_NAME && 
            key !== FONT_CACHE_NAME &&
            key !== IMAGE_CACHE_NAME
          ) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

// Helper function to determine if a request is an API call
const isApiCall = (url) => {
  return (
    url.includes('firebaseio.com') || 
    url.includes('googleapis.com') ||
    url.includes('firestore.googleapis.com') ||
    url.includes('identitytoolkit.googleapis.com')
  );
};

// Helper function to determine if a request is for an image
const isImageRequest = (request) => {
  return (
    request.destination === 'image' || 
    request.url.endsWith('.png') || 
    request.url.endsWith('.jpg') || 
    request.url.endsWith('.jpeg') || 
    request.url.endsWith('.svg') || 
    request.url.endsWith('.gif')
  );
};

// Helper function to determine if a request is for a font
const isFontRequest = (request) => {
  return (
    request.destination === 'font' ||
    request.url.includes('fonts.googleapis.com') ||
    request.url.includes('fonts.gstatic.com')
  );
};

// Fetch event - handle network requests
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip cross-origin requests
  if (url.origin !== self.location.origin && !url.hostname.includes('fonts')) {
    // For API calls, use network with cache fallback
    if (isApiCall(event.request.url)) {
      event.respondWith(
        fetch(event.request)
          .then(response => {
            // Only cache successful responses
            if (!response || response.status !== 200) {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Store in dynamic cache
            caches.open(DYNAMIC_CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
                
                // Set expiration for cached API responses
                const now = new Date();
                const expiration = new Date(now.getTime() + CACHE_TIMEOUT);
                
                // Store expiration metadata
                const metadata = {
                  url: event.request.url,
                  timestamp: now.getTime(),
                  expiration: expiration.getTime()
                };
                
                localStorage.setItem(`cache-expiration-${event.request.url}`, JSON.stringify(metadata));
              });
            
            return response;
          })
          .catch(() => {
            // If network fails, try to return from cache
            return caches.match(event.request);
          })
      );
      return;
    }
    
    // Don't handle other cross-origin requests
    return;
  }
  
  // For font requests
  if (isFontRequest(event.request)) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Return cached font if available
          if (response) {
            return response;
          }
          
          // Otherwise fetch from network and cache
          return fetch(event.request)
            .then(networkResponse => {
              const responseToCache = networkResponse.clone();
              
              caches.open(FONT_CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
              
              return networkResponse;
            });
        })
    );
    return;
  }
  
  // For image requests
  if (isImageRequest(event.request)) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Return cached image if available
          if (response) {
            return response;
          }
          
          // Otherwise fetch from network and cache
          return fetch(event.request)
            .then(networkResponse => {
              const responseToCache = networkResponse.clone();
              
              caches.open(IMAGE_CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
              
              return networkResponse;
            })
            .catch(() => {
              // If image can't be fetched, return a placeholder
              if (event.request.url.includes('logo')) {
                return caches.match('/logo192.png');
              }
              // For other images, you could return a default placeholder image
            });
        })
    );
    return;
  }
  
  // For HTML navigation requests - use network-first strategy
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the latest version
          const responseToCache = response.clone();
          caches.open(STATIC_CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        })
        .catch(() => {
          // If offline, serve from cache
          return caches.match(event.request)
            .then(response => {
              return response || caches.match('/offline.html');
            });
        })
    );
    return;
  }
  
  // For all other requests - use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            caches.open(DYNAMIC_CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(err => {
            console.log('[Service Worker] Fetch failed:', err);
            // You could return a custom offline page/component here
          });
      })
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', event => {
  console.log('[Service Worker] Background Syncing', event);
  
  if (event.tag === 'sync-forms') {
    event.waitUntil(
      // Get all pending form submissions from IndexedDB and send them
      // This would require implementing IndexedDB storage for offline forms
      console.log('[Service Worker] Syncing pending form submissions')
    );
  }
});

// Handle push notifications
self.addEventListener('push', event => {
  console.log('[Service Worker] Push Notification received', event);
  
  let data = { title: 'New Notification', body: 'Something happened!', url: '/' };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      console.error('[Service Worker] Error parsing push notification data', e);
    }
  }
  
  const options = {
    body: data.body,
    icon: 'logo192.png',
    badge: 'favicon.ico',
    vibrate: [100, 50, 100], // Vibration pattern for mobile devices
    data: {
      url: data.url || '/'
    },
    actions: [
      { action: 'view', title: 'View' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification click', event);
  
  event.notification.close();
  
  if (event.action === 'view' || !event.action) {
    // Open the app and navigate to the specified URL
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then(windowClients => {
          // Check if there is already a window/tab open with the target URL
          for (let client of windowClients) {
            if (client.url === event.notification.data.url && 'focus' in client) {
              return client.focus();
            }
          }
          // If no window/tab is open or URL doesn't match, open a new one
          if (clients.openWindow) {
            return clients.openWindow(event.notification.data.url);
          }
        })
    );
  }
});

// Periodic cache cleanup
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'cleanupCache') {
    event.waitUntil(
      Promise.all([
        // Clean up dynamic cache
        caches.open(DYNAMIC_CACHE_NAME)
          .then(cache => {
            return cache.keys()
              .then(keys => {
                return Promise.all(keys.map(request => {
                  // Check expiration metadata
                  const metadataKey = `cache-expiration-${request.url}`;
                  const metadata = localStorage.getItem(metadataKey);
                  
                  if (metadata) {
                    const data = JSON.parse(metadata);
                    const now = new Date().getTime();
                    
                    // If expired, remove from cache
                    if (now > data.expiration) {
                      localStorage.removeItem(metadataKey);
                      return cache.delete(request);
                    }
                  }
                  
                  return Promise.resolve();
                }));
              });
          }),
          
        // Limit image cache size
        caches.open(IMAGE_CACHE_NAME)
          .then(cache => {
            return cache.keys()
              .then(keys => {
                // If more than 100 images, remove the oldest ones
                if (keys.length > 100) {
                  return Promise.all(
                    keys.slice(0, keys.length - 100).map(key => {
                      return cache.delete(key);
                    })
                  );
                }
                return Promise.resolve();
              });
          })
      ])
    );
  }
});