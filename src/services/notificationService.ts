import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import type { SessionTimeslot, UserProfile } from '../types';

export interface NotificationStatus {
  hasPermission: boolean;
  platform: 'android' | 'ios' | 'web';
  scheduledCount: number;
}

const CHANNEL_ID = 'rc_pilates_reminders';
export const ACTION_TYPE_CLASS_REMINDER = 'CLASS_REMINDER_ACTIONS';

/**
 * Initialize Notification Channels and Inbuilt Action Buttons on Android
 */
export async function initializeNotificationChannels(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    // 1. Create high-importance channel for Android 8.0+
    await LocalNotifications.createChannel({
      id: CHANNEL_ID,
      name: 'RC Pilates Reminders',
      description: 'Heads-up class reminders and fee payment alerts',
      importance: 5, // High importance (drops down from top of screen)
      visibility: 1, // Visible on lockscreen
      sound: 'beep.wav',
      vibration: true,
      lights: true,
      lightColor: '#064e3b'
    });

    // 2. Register Inbuilt Notification Action Buttons ("Attending" / "Not attending")
    await LocalNotifications.registerActionTypes({
      types: [
        {
          id: ACTION_TYPE_CLASS_REMINDER,
          actions: [
            {
              id: 'attending',
              title: 'Attending',
              foreground: true
            },
            {
              id: 'not_attending',
              title: 'Not attending',
              destructive: true,
              foreground: true
            }
          ]
        }
      ]
    });
  } catch (err) {
    console.warn('Could not create notification channel or action types:', err);
  }
}

/**
 * Listen for user tapping "Attending" or "Not attending" in Android notification shade
 */
export function setupNotificationListeners(
  onAttendanceConfirmed: (sessionId: string, confirmation: 'attending' | 'not_attending') => void
): void {
  if (!Capacitor.isNativePlatform()) return;

  try {
    LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
      const actionId = action.actionId;
      const sessionId = action.notification.extra?.sessionId || 'slot-2';
      if (actionId === 'attending' || actionId === 'not_attending') {
        onAttendanceConfirmed(sessionId, actionId);
      }
    });
  } catch (err) {
    console.warn('Error adding notification action listener:', err);
  }
}

/**
 * Request notification permissions from the OS (Android 13+ prompt)
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    try {
      const check = await LocalNotifications.checkPermissions();
      if (check.display === 'granted') {
        return true;
      }
      const requested = await LocalNotifications.requestPermissions();
      return requested.display === 'granted';
    } catch (err) {
      console.warn('Error requesting native notification permission:', err);
      return false;
    }
  }

  // Web Browser fallback
  if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      if (Notification.permission === 'granted') return true;
      const perm = await Notification.requestPermission();
      return perm === 'granted';
    } catch (err) {
      console.warn('Web notification request failed:', err);
      return false;
    }
  }

  return false;
}

/**
 * Check current permission status
 */
export async function checkNotificationPermission(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    try {
      const check = await LocalNotifications.checkPermissions();
      return check.display === 'granted';
    } catch {
      return false;
    }
  }

  if (typeof window !== 'undefined' && 'Notification' in window) {
    return Notification.permission === 'granted';
  }

  return false;
}

/**
 * Trigger an immediate notification in the phone's notification shade
 * Useful for client demonstrations and instant verification.
 */
export async function triggerDemoNotification(
  type: 'class-reminder' | 'fee-reminder',
  delaySeconds: number = 2
): Promise<{ success: boolean; message: string }> {
  const granted = await requestNotificationPermission();
  if (!granted) {
    return {
      success: false,
      message: 'Notification permission was denied. Please allow notifications in device settings.'
    };
  }

  await initializeNotificationChannels();

  const title =
    type === 'class-reminder'
      ? '🧘 RC Pilates • Class in 45 Minutes'
      : '💳 RC Pilates • Membership Fee Due Tomorrow';

  const body =
    type === 'class-reminder'
      ? 'Your Reformer Alignment with Radhika starts at 08:00 AM. Are you attending?'
      : 'Friendly reminder: Your studio membership renewal for Reformer Unlimited is due tomorrow. Thank you!';

  const notificationId = type === 'class-reminder' ? 901 : 902;
  const triggerTime = new Date(Date.now() + delaySeconds * 1000);

  if (Capacitor.isNativePlatform()) {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: notificationId,
            title,
            body,
            schedule: { at: triggerTime, allowWhileIdle: true },
            channelId: CHANNEL_ID,
            actionTypeId: type === 'class-reminder' ? ACTION_TYPE_CLASS_REMINDER : undefined,
            extra: {
              sessionId: 'slot-2',
              type
            },
            smallIcon: 'ic_launcher',
            sound: 'beep.wav'
          }
        ]
      });

      return {
        success: true,
        message: `Notification scheduled! In ${delaySeconds}s, swipe down phone shade to tap "Attending" or "Not attending".`
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return { success: false, message: `Failed to schedule: ${errorMsg}` };
    }
  }

  // Web Browser / iOS PWA Fallback: trigger both system notification and interactive in-app banner
  setTimeout(() => {
    // 1. Native browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/pwa-icon-192.png'
        });
      } catch (e) {
        console.warn('Native notification failed:', e);
      }
    }

    // 2. Dispatch in-app interactive notification banner with "Attending" & "Not attending" buttons
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('rc-in-app-notification', {
          detail: {
            title,
            body,
            type,
            sessionId: 'slot-2',
            instructorName: 'Radhika Chopra',
            time: '08:00 AM'
          }
        })
      );
    }
  }, delaySeconds * 1000);

  return {
    success: true,
    message: `Alert arriving in ${delaySeconds} seconds with interactive "Attending" & "Not attending" buttons!`
  };
}

/**
 * Schedule automated class reminders 45 minutes before class start
 */
export async function scheduleClassReminder45Min(
  session: SessionTimeslot,
  instructorName = 'Radhika Chopra'
): Promise<boolean> {
  const granted = await requestNotificationPermission();
  if (!granted) return false;

  await initializeNotificationChannels();

  try {
    // Parse session date and start time (e.g., date: "2026-11-06", time: "08:00 AM - 09:00 AM")
    const startTimeStr = session.time.split(' - ')[0]?.trim(); // e.g. "08:00 AM"
    if (!startTimeStr) return false;

    const [timePart, modifier] = startTimeStr.split(' ');
    const [hoursStr, minutesStr] = timePart.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (modifier?.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (modifier?.toUpperCase() === 'AM' && hours === 12) hours = 0;

    const [year, month, day] = session.date.split('-').map(Number);
    const classStartTime = new Date(year, month - 1, day, hours, minutes, 0);

    // 45 minutes before class
    const triggerTime = new Date(classStartTime.getTime() - 45 * 60 * 1000);

    // If already passed, don't schedule
    if (triggerTime.getTime() <= Date.now()) {
      return false;
    }

    // Generate safe 32-bit integer ID from session id hash
    const idHash = Math.abs(
      session.id.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
    ) % 100000;

    if (Capacitor.isNativePlatform()) {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: idHash,
            title: `🧘 RC Pilates • Class in 45 Minutes`,
            body: `"${session.sessionTitle}" starts at ${startTimeStr} with ${instructorName}. Are you attending?`,
            schedule: { at: triggerTime, allowWhileIdle: true },
            channelId: CHANNEL_ID,
            actionTypeId: ACTION_TYPE_CLASS_REMINDER,
            extra: {
              sessionId: session.id,
              type: 'class-reminder'
            },
            smallIcon: 'ic_launcher'
          }
        ]
      });
    }

    return true;
  } catch (err) {
    console.warn('Error scheduling 45-min class reminder:', err);
    return false;
  }
}

/**
 * Schedule automated fee payment reminder 1 day before due date
 */
export async function scheduleFeeReminder1DayBefore(
  client: UserProfile
): Promise<boolean> {
  if (!client.feeRecord || client.feeRecord.status === 'paid') return false;

  const granted = await requestNotificationPermission();
  if (!granted) return false;

  await initializeNotificationChannels();

  try {
    const dueDateStr = client.feeRecord.dueDate; // e.g. "Nov 10, 2026" or "2026-11-10"
    const dueDate = new Date(dueDateStr);
    if (isNaN(dueDate.getTime())) return false;

    // 1 day before at 10:00 AM
    const triggerTime = new Date(dueDate.getTime() - 24 * 60 * 60 * 1000);
    triggerTime.setHours(10, 0, 0, 0);

    if (triggerTime.getTime() <= Date.now()) return false;

    const idHash = 50000 + (Math.abs(client.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % 10000);

    if (Capacitor.isNativePlatform()) {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: idHash,
            title: '💳 RC Pilates • Membership Fee Due Tomorrow',
            body: `Your studio membership for ${client.feeRecord.packageTitle} is due tomorrow (${client.feeRecord.dueDate}).`,
            schedule: { at: triggerTime, allowWhileIdle: true },
            channelId: CHANNEL_ID,
            smallIcon: 'ic_launcher'
          }
        ]
      });
    }

    return true;
  } catch (err) {
    console.warn('Error scheduling fee reminder:', err);
    return false;
  }
}

/**
 * Sync all upcoming class and fee reminders
 */
export async function syncAllStudioReminders(
  sessions: SessionTimeslot[],
  clients: UserProfile[],
  currentUser: UserProfile
): Promise<{ classesScheduled: number; feesScheduled: number }> {
  let classesScheduled = 0;
  let feesScheduled = 0;

  // Filter relevant sessions
  const userSessions =
    currentUser.role === 'instructor'
      ? sessions
      : sessions.filter(s => s.clientId === currentUser.id);

  for (const session of userSessions) {
    const success = await scheduleClassReminder45Min(session);
    if (success) classesScheduled++;
  }

  // Fees
  const targetClients =
    currentUser.role === 'instructor'
      ? clients.filter(c => c.feeRecord?.status === 'pending')
      : [currentUser].filter(c => c.feeRecord?.status === 'pending');

  for (const client of targetClients) {
    const success = await scheduleFeeReminder1DayBefore(client);
    if (success) feesScheduled++;
  }

  return { classesScheduled, feesScheduled };
}

