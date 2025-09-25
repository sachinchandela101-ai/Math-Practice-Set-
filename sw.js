const CACHE_NAME = 'math-mock-test-cache-v1';

// उन सभी फाइलों की लिस्ट जिन्हें हम कैश करना चाहते हैं
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  // CSS और फ़ॉन्ट्स
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  // सभी मॉक टेस्ट HTML फ़ाइलें
  'tw1.html', 'tw2.html', 'tw3.html', 'tw4.html', 'tw5.html',
  'pipe1.html', 'pipe2.html', 'pipe3.html', 'pipe4.html', 'pipe5.html',
  'tsd1.html', 'tsd2.html', 'tsd3.html', 'tsd4.html', 'tsd5.html',
  'boat1.html', 'boat2.html', 'boat3.html', 'boat4.html', 'boat5.html',
  'per1.html', 'per2.html', 'per3.html', 'per4.html', 'per5.html',
  'pl1.html', 'pl2.html', 'pl3.html', 'pl4.html', 'pl5.html',
  'mix1.html', 'mix2.html', 'mix3.html', 'mix4.html', 'mix5.html',
  'rp1.html', 'rp2.html', 'rp3.html', 'rp4.html', 'rp5.html',
  'part1.html', 'part2.html', 'part3.html', 'part4.html', 'part5.html',
  'avg1.html', 'avg2.html', 'avg3.html', 'avg4.html', 'avg5.html',
  'ci1.html', 'ci2.html', 'ci3.html', 'ci4.html', 'ci5.html',
  'si1.html', 'si2.html', 'si3.html', 'si4.html', 'si5.html',
  'trig1.html', 'trig2.html', 'trig3.html', 'trig4.html', 'trig5.html',
  'geo1.html', 'geo2.html', 'geo3.html', 'geo4.html', 'geo5.html',
  'alg1.html', 'alg2.html', 'alg3.html', 'alg4.html', 'alg5.html',
  'men1.html', 'men2.html', 'men3.html', 'men4.html', 'men5.html',
  'arithmetic_full.html'
];

// 'install' इवेंट: जब Service Worker पहली बार इंस्टॉल होता है, तो यह सभी फाइलों को कैश करता है
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
});

// 'fetch' इवेंट: हर नेटवर्क रिक्वेस्ट को इंटरसेप्ट करता है
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // अगर कैश में फाइल मौजूद है, तो उसे रिटर्न करें
        if (response) {
          return response;
        }
        // नहीं तो, नेटवर्क से फेच करें
        return fetch(event.request);
      })
  );
});

// 'activate' इवेंट: पुराने कैशे को हटाता है
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
