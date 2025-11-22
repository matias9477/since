import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

/**
 * Check if running in Expo Go
 */
const isExpoGo = (): boolean => {
  return Constants.appOwnership === 'expo';
};

/**
 * Configure notification behavior
 * Should be called once at app startup
 */
export const configureNotifications = async (): Promise<boolean> => {
  if (isExpoGo()) return false;

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') return false;

    // Set notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    return true;
  } catch (error) {
    console.error('Error configuring notifications:', error);
    return false;
  }
};

/**
 * Schedule a daily notification
 */
export const scheduleDailyNotification = async (
  title: string,
  body: string,
  hour: number,
  minute: number,
  data?: any
): Promise<string> => {
  if (isExpoGo()) return '';

  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });

    return identifier;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return '';
  }
};

/**
 * Schedule a weekly notification
 */
export const scheduleWeeklyNotification = async (
  title: string,
  body: string,
  weekday: number, // 1-7 (Sunday = 1)
  hour: number,
  minute: number,
  data?: any
): Promise<string> => {
  if (isExpoGo()) return '';

  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday,
        hour,
        minute,
      },
    });

    return identifier;
  } catch (error) {
    console.error('Error scheduling weekly notification:', error);
    return '';
  }
};

/**
 * Schedule a monthly notification
 */
export const scheduleMonthlyNotification = async (
  title: string,
  body: string,
  day: number, // 1-31
  hour: number,
  minute: number,
  data?: any
): Promise<string> => {
  if (isExpoGo()) return '';

  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
        day,
        hour,
        minute,
      },
    });

    return identifier;
  } catch (error) {
    console.error('Error scheduling monthly notification:', error);
    return '';
  }
};

/**
 * Schedule a yearly notification
 */
export const scheduleYearlyNotification = async (
  title: string,
  body: string,
  month: number, // 1-12
  day: number, // 1-31
  hour: number,
  minute: number,
  data?: any
): Promise<string> => {
  if (isExpoGo()) return '';

  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.YEARLY,
        month,
        day,
        hour,
        minute,
      },
    });

    return identifier;
  } catch (error) {
    console.error('Error scheduling yearly notification:', error);
    return '';
  }
};

/**
 * Schedule a one-time notification at a specific date/time
 */
export const scheduleOneTimeNotification = async (
  title: string,
  body: string,
  date: Date,
  data?: any
): Promise<string> => {
  if (isExpoGo()) return '';

  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
      },
      trigger: date,
    });

    return identifier;
  } catch (error) {
    console.error('Error scheduling one-time notification:', error);
    return '';
  }
};

/**
 * Send immediate test notification
 */
export const sendTestNotification = async (): Promise<string> => {
  if (isExpoGo()) return '';

  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Test Notification',
        body: 'This is a test notification!',
        data: { type: 'test' },
      },
      trigger: null, // Send immediately
    });

    return identifier;
  } catch (error) {
    console.error('Error sending test notification:', error);
    return '';
  }
};

/**
 * Check if notifications are enabled
 */
export const areNotificationsEnabled = async (): Promise<boolean> => {
  if (isExpoGo()) return false;

  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error checking notification permissions:', error);
    return false;
  }
};

/**
 * Cancel a specific notification by identifier
 */
export const cancelNotification = async (identifier: string): Promise<void> => {
  if (isExpoGo()) return;

  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
};

/**
 * Cancel all notifications
 */
export const cancelAllNotifications = async (): Promise<void> => {
  if (isExpoGo()) return;

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error cancelling all notifications:', error);
  }
};

/**
 * Get all scheduled notifications
 */
export const getScheduledNotifications = async () => {
  if (isExpoGo()) return [];

  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};

