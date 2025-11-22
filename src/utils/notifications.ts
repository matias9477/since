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

/**
 * Calculate the exact date when a milestone will be reached
 * Based on the event start date and milestone target
 */
export const calculateMilestoneDate = (
  eventStartDate: Date,
  targetAmount: number,
  targetUnit: 'days' | 'weeks' | 'months' | 'years'
): Date => {
  const milestoneDate = new Date(eventStartDate);

  switch (targetUnit) {
    case 'days':
      milestoneDate.setDate(milestoneDate.getDate() + targetAmount);
      break;
    case 'weeks':
      milestoneDate.setDate(milestoneDate.getDate() + targetAmount * 7);
      break;
    case 'months':
      // Add months using setMonth which handles month overflow correctly
      milestoneDate.setMonth(milestoneDate.getMonth() + targetAmount);
      break;
    case 'years':
      milestoneDate.setFullYear(milestoneDate.getFullYear() + targetAmount);
      break;
  }

  return milestoneDate;
};

/**
 * Format milestone time for notification message
 * Converts milestone target to a readable time string
 */
const formatMilestoneTime = (
  targetAmount: number,
  targetUnit: 'days' | 'weeks' | 'months' | 'years'
): string => {
  const unitLabel = targetAmount === 1 
    ? targetUnit.slice(0, -1) // Remove 's' for singular (e.g., "day" instead of "days")
    : targetUnit;
  
  return `${targetAmount} ${unitLabel}`;
};

/**
 * Schedule a milestone notification
 * This schedules a one-time notification for when the milestone is reached
 * The notification will fire even if the app is closed (OS-level scheduling)
 */
export const scheduleMilestoneNotification = async (
  eventTitle: string,
  milestoneLabel: string,
  milestoneDate: Date,
  eventId: string,
  milestoneId: string,
  targetAmount: number,
  targetUnit: 'days' | 'weeks' | 'months' | 'years'
): Promise<string> => {
  if (isExpoGo()) return '';

  // Don't schedule if milestone date is in the past
  if (milestoneDate < new Date()) {
    console.log(`[Notifications] Skipping milestone notification for ${milestoneLabel} - date is in the past`);
    return '';
  }

  try {
    // Request permissions if not already granted
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('[Notifications] Permission not granted, cannot schedule milestone notification');
      return '';
    }

    const timeString = formatMilestoneTime(targetAmount, targetUnit);
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎉 Milestone Reached!',
        body: `It's been ${timeString} since ${eventTitle}`,
        data: {
          type: 'milestone',
          eventId,
          milestoneId,
          milestoneLabel,
        },
        sound: true,
      },
      trigger: milestoneDate, // OS-level scheduling - works when app is closed
    });

    console.log(`[Notifications] Scheduled milestone notification: ${milestoneLabel} for ${milestoneDate.toISOString()}`);
    return identifier;
  } catch (error) {
    console.error(`[Notifications] Error scheduling milestone notification for ${milestoneLabel}:`, error);
    return '';
  }
};

/**
 * Schedule notifications for all milestones of an event
 * Called when an event is created to schedule all milestone notifications upfront
 */
export const scheduleEventMilestoneNotifications = async (
  eventId: string,
  eventTitle: string,
  eventStartDate: Date,
  milestones: Array<{
    id: string;
    label: string;
    targetAmount: number;
    targetUnit: 'days' | 'weeks' | 'months' | 'years';
  }>
): Promise<void> => {
  if (isExpoGo()) {
    console.log('[Notifications] Running in Expo Go, skipping milestone notifications');
    return;
  }

  console.log(`[Notifications] Scheduling ${milestones.length} milestone notifications for event: ${eventTitle}`);

  for (const milestone of milestones) {
    const milestoneDate = calculateMilestoneDate(
      eventStartDate,
      milestone.targetAmount,
      milestone.targetUnit
    );

    await scheduleMilestoneNotification(
      eventTitle,
      milestone.label,
      milestoneDate,
      eventId,
      milestone.id,
      milestone.targetAmount,
      milestone.targetUnit
    );
  }

  console.log(`[Notifications] Finished scheduling milestone notifications for event: ${eventTitle}`);
};

