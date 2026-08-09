/**
 * Browser Notification Service for ParentFit PWA.
 * 
 * Provides a clean, safe wrapper around the browser native Notification API.
 * Handles permission states, notification creation, and safe closing without
 * automatic permission prompts or internal scheduling timers.
 */

const DEFAULT_OPTIONS = {
  body: '',
  icon: './assets/icons/latest.png',
  badge: './assets/icons/latest.png',
  tag: 'parentfit',
  renotify: false
};

/**
 * Checks if the browser supports native Notifications.
 * @returns {boolean} True if supported, false otherwise.
 */
export function isNotificationSupported() {
  return typeof window !== 'undefined' && typeof Notification !== 'undefined';
}

/**
 * Returns the current notification permission status.
 * @returns {"granted"|"denied"|"default"|"unsupported"} Permission status string.
 */
export function getPermissionStatus() {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }
  return Notification.permission || 'default';
}

/**
 * Requests browser notification permission asynchronously if not already determined.
 * Does NOT call alert() or mutate application state.
 * 
 * @async
 * @returns {Promise<"granted"|"denied"|"default"|"unsupported">} Resulting permission status.
 */
export async function requestPermission() {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }

  const current = getPermissionStatus();
  if (current === 'granted' || current === 'denied') {
    return current;
  }

  try {
    const res = await Notification.requestPermission();
    return res || getPermissionStatus();
  } catch (e) {
    return new Promise((resolve) => {
      try {
        Notification.requestPermission((permission) => {
          resolve(permission || getPermissionStatus());
        });
      } catch (err) {
        console.warn('[NotificationService] Permission request failed:', err);
        resolve(getPermissionStatus());
      }
    });
  }
}

/**
 * Checks if notifications are supported and permission has been granted.
 * @returns {boolean} True if notification can be shown, false otherwise.
 */
export function canNotify() {
  return isNotificationSupported() && getPermissionStatus() === 'granted';
}

/**
 * Creates and displays a native browser Notification.
 * Does NOT request permission automatically if not granted.
 * 
 * @param {string} title - Notification title text.
 * @param {Object} [options] - Native Notification options override.
 * @returns {Notification|null} Native Notification instance or null if unable to display.
 */
export function showNotification(title, options = {}) {
  if (!canNotify()) {
    return null;
  }

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return null;
  }

  try {
    const userOpts = (options && typeof options === 'object') ? options : {};
    const mergedOptions = {
      ...DEFAULT_OPTIONS,
      ...userOpts
    };

    return new Notification(title.trim(), mergedOptions);
  } catch (e) {
    console.warn('[NotificationService] Failed to create notification:', e);
    return null;
  }
}

/**
 * Convenience function for showing workout reminder notifications.
 * 
 * @param {string} [title="Today's Workout"] - Workout title.
 * @param {string} [body="Your gentle workout is ready."] - Reminder body text.
 * @returns {Notification|null} Notification instance or null.
 */
export function showWorkoutReminder(title = "Today's Workout", body = "Your gentle workout is ready.") {
  const finalTitle = (typeof title === 'string' && title.trim()) ? title.trim() : "Today's Workout";
  const finalBody = (typeof body === 'string' && body.trim()) ? body.trim() : "Your gentle workout is ready.";

  return showNotification(finalTitle, {
    body: finalBody,
    tag: 'parentfit-workout'
  });
}

/**
 * Convenience function for showing recovery day notifications.
 * Uses neutral, non-medical language.
 * 
 * @param {string} [title="Recovery Day"] - Recovery notification title.
 * @param {string} [body="Today is a good day for gentle recovery."] - Recovery message text.
 * @returns {Notification|null} Notification instance or null.
 */
export function showRecoveryReminder(title = "Recovery Day", body = "Today is a good day for gentle recovery.") {
  const finalTitle = (typeof title === 'string' && title.trim()) ? title.trim() : "Recovery Day";
  const finalBody = (typeof body === 'string' && body.trim()) ? body.trim() : "Today is a good day for gentle recovery.";

  return showNotification(finalTitle, {
    body: finalBody,
    tag: 'parentfit-recovery'
  });
}

/**
 * Safely closes an active notification instance.
 * 
 * @param {Notification} notification - Native Notification object to close.
 * @returns {boolean} True if successfully closed, false otherwise.
 */
export function closeNotification(notification) {
  if (!notification || typeof notification.close !== 'function') {
    return false;
  }

  try {
    notification.close();
    return true;
  } catch (e) {
    console.warn('[NotificationService] Failed to close notification:', e);
    return false;
  }
}
