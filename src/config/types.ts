/**
 * Time unit types for displaying "time since" calculations
 */
export type TimeUnit = 'days' | 'weeks' | 'months' | 'years';

/**
 * Reminder type - one-off or recurring
 */
export type ReminderType = 'one_off' | 'recurring';

/**
 * Recurrence frequency for reminders
 */
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

/**
 * Theme preference
 */
export type ThemePreference = 'light' | 'dark';

/**
 * Language code (currently only 'en', but designed for i18n)
 */
export type LanguageCode = 'en';

/**
 * Milestone configuration type
 */
export interface MilestoneConfig {
  label: string;
  targetAmount: number;
  targetUnit: TimeUnit;
  isPredefined: boolean;
}

