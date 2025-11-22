import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import type { TimeUnit, ReminderType, RecurrenceFrequency, ThemePreference, LanguageCode } from '@/config/types';

/**
 * Events table - main entity for tracking time since events
 */
export const events = sqliteTable('events', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  // TODO: Replace hardcoded default 'days' with constant from config/constants.ts
  showTimeAs: text('show_time_as').$type<TimeUnit>().notNull().default('days'),
  color: text('color'),
  icon: text('icon'),
  isPinned: integer('is_pinned', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

/**
 * Reminders table - notifications for events
 */
export const reminders = sqliteTable('reminders', {
  id: text('id').primaryKey(),
  eventId: text('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  type: text('type').$type<ReminderType>().notNull(),
  scheduledAt: integer('scheduled_at', { mode: 'timestamp' }),
  recurrenceRule: text('recurrence_rule').$type<RecurrenceFrequency>(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

/**
 * Milestones table - optional markers for events
 */
export const milestones = sqliteTable('milestones', {
  id: text('id').primaryKey(),
  eventId: text('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  label: text('label').notNull(),
  targetAmount: real('target_amount').notNull(),
  targetUnit: text('target_unit').$type<TimeUnit>().notNull(),
  reachedAt: integer('reached_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

/**
 * Settings table - app-wide settings (single row expected)
 */
export const settings = sqliteTable('settings', {
  id: text('id').primaryKey().default('default'),
  // TODO: Replace hardcoded defaults with constants from config/constants.ts
  defaultShowTimeAs: text('default_show_time_as').$type<TimeUnit>().notNull().default('days'),
  useSystemTheme: integer('use_system_theme', { mode: 'boolean' }).notNull().default(true),
  theme: text('theme').$type<ThemePreference>().notNull().default('light'),
  language: text('language').$type<LanguageCode>().notNull().default('en'),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

