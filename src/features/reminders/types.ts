import type { ReminderType, RecurrenceFrequency } from '@/config/types';

/**
 * Reminder entity type matching the database schema
 */
export interface Reminder {
  id: string;
  eventId: string;
  type: ReminderType;
  scheduledAt: Date | null;
  recurrenceRule: RecurrenceFrequency | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input type for creating a new reminder
 */
export interface CreateReminderInput {
  eventId: string;
  type: ReminderType;
  scheduledAt?: Date;
  recurrenceRule?: RecurrenceFrequency;
}

/**
 * Input type for updating an existing reminder
 */
export interface UpdateReminderInput {
  type?: ReminderType;
  scheduledAt?: Date;
  recurrenceRule?: RecurrenceFrequency;
}

