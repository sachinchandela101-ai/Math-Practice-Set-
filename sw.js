const CACHE_NAME = 'math-mock-test-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    // उन सभी HTML, CSS, और JS फ़ाइलों को यहाँ जोड़ें जिन्हें आप ऑफ़लाइन उपलब्ध कराना चाहते हैं।
    // जैसे:
    // '/tw1.html',
    // '/tw2.html',
    // '/styles/main.css',
    // '/scripts/quiz-logic.js',
];

// इंस्टॉल इवेंट: जब सर्विस वर्कर पहली बार इंस्टॉल होता है
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// फ़ेच इवेंट: जब भी कोई नेटवर्क रिक्वेस्ट होती है
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // अगर कैश में रिसोर्स है, तो उसे वापस करें
        if (response) {
          return response;
        }
        // नहीं तो, नेटवर्क से फ़ेच करें
        return fetch(event.request);
      })
  );
});

// एक्टिवेट इवेंट: पुराने कैश को साफ़ करना
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
