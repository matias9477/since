import { TimeUnit, ReminderType, RecurrenceFrequency, ThemePreference, LanguageCode } from './types';

/**
 * Default time unit for new events
 */
export const DEFAULT_TIME_UNIT: TimeUnit = 'days';

/**
 * Available time units
 */
export const TIME_UNITS: readonly TimeUnit[] = ['days', 'weeks', 'months', 'years'] as const;

/**
 * Available reminder types
 */
export const REMINDER_TYPES: readonly ReminderType[] = ['one_off', 'recurring'] as const;

/**
 * Available recurrence frequencies
 */
export const RECURRENCE_FREQUENCIES: readonly RecurrenceFrequency[] = ['daily', 'weekly', 'monthly'] as const;

/**
 * Default theme preference
 */
export const DEFAULT_THEME: ThemePreference = 'light';

/**
 * Default language
 */
export const DEFAULT_LANGUAGE: LanguageCode = 'en';

