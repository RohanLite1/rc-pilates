// RC Pilates & Fitness Studio - Service Worker for Notification Shade Actions
const CACHE_NAME = 'rc-pilates-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Listen for action clicks directly inside the phone/system notification shade
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const action = event.action; // 'attending' | 'not_attending' | ''
  const notificationData = event.notification.data || {};
  const sessionId = notificationData.sessionId || 'slot-2';

  // If the user tapped a browser system button (e.g. Chrome's unsubscribe or dismiss), do not alter attendance
  if (action === 'unsubscribe' || action === 'dismiss') {
    return;
  }

  // Only dispatch attendance confirmation if the user explicitly clicked "Attending" or "Not attending"
  const isAttendanceAction = action === 'attending' || action === 'not_attending';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // 1. Send attendance action message if an explicit button was tapped
      if (isAttendanceAction) {
        for (const client of clientList) {
          client.postMessage({
            type: 'RC_NOTIFICATION_ACTION',
            action: action,
            sessionId: sessionId,
            notificationData: notificationData
          });
        }
      }

      // 2. Bring window to front or open studio app
      if (clientList.length > 0 && 'focus' in clientList[0]) {
        return clientList[0].focus();
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});

self.addEventListener('notificationclose', (event) => {
  // Notification dismissed by user
});
