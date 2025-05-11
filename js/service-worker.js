/**
 * Christian Blevens Portfolio
 * Service Worker for offline capabilities
 * 
 * This service worker provides caching for assets to improve load time and
 * enable offline functionality.
 */

// Cache name with version to enable easy updates
const CACHE_NAME = 'portfolio-cache-v1';

// Assets to cache on install
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/main.css',
  '/js/main.js',
  '/js/alpine-components.js',
  '/js/projects-data.js',
  '/js/utils.js',
  // External resources
  'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/alpinejs@3.12.0/dist/cdn.min.js'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching assets...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('Removing old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  // Skip for certain requests
  if (event.request.url.includes('chrome-extension://') || 
      event.request.url.includes('itch.io/')) {
    return;
  }
  
  // Handle requests
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Return cached response
          return cachedResponse;
        }
        
        // Fetch from network
        return fetch(event.request)
          .then(response => {
            // Don't cache non-success responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response to cache it and return it
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                // Skip caching certain resources
                const url = event.request.url;
                if (!url.includes('itch.io') && !url.includes('analytics')) {
                  cache.put(event.request, responseToCache);
                }
              });
            
            return response;
          })
          .catch(err => {
            // Check if we have a cached fallback for HTML requests
            if (event.request.headers.get('Accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
            
            // Let the error propagate otherwise
            throw err;
          });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});