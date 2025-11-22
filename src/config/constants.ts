import { TimeUnit, ReminderType, RecurrenceFrequency, ThemePreference, LanguageCode } from './types';

/**
 * Default time unit for new events
 * TODO: This should be read from user settings instead of being hardcoded
 */
export const DEFAULT_TIME_UNIT: TimeUnit = 'days';

/**
 * Available time units
 * TODO: Consider making this configurable or extensible in the future
 */
export const TIME_UNITS: readonly TimeUnit[] = ['days', 'weeks', 'months', 'years'] as const;

/**
 * Available reminder types
 * TODO: Consider making this extensible in the future
 */
export const REMINDER_TYPES: readonly ReminderType[] = ['one_off', 'recurring'] as const;

/**
 * Available recurrence frequencies for reminders
 * Users can set reminders to repeat daily, weekly, monthly, or yearly
 */
export const RECURRENCE_FREQUENCIES: readonly RecurrenceFrequency[] = ['daily', 'weekly', 'monthly', 'yearly'] as const;

/**
 * Default theme preference
 * TODO: This should be read from user settings instead of being hardcoded
 */
export const DEFAULT_THEME: ThemePreference = 'light';

/**
 * Default language
 * TODO: This should be read from device/system settings instead of being hardcoded
 */
export const DEFAULT_LANGUAGE: LanguageCode = 'en';

