// Minimal service worker — its only job is to satisfy Android/Chrome's
// installability check so "Add to Home Screen" gives a real full-screen
// app instead of a plain bookmark shortcut.
//
// It deliberately does NOT cache anything: every request just passes
// straight through to the network. That matters here specifically
// because this site shows live booking availability — caching that
// could show visitors outdated, already-taken time slots.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
