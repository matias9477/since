import { eq } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { reminders } from '@/db/schema';
import { generateId } from '@/lib/id';
import type { Reminder, CreateReminderInput, UpdateReminderInput } from './types';

/**
 * Get all reminders for an event
 */
export const getRemindersByEventId = async (eventId: string): Promise<Reminder[]> => {
  const db = getDb();
  if (!db) {
    throw new Error('Database not initialized');
  }

  const results = await db
    .select()
    .from(reminders)
    .where(eq(reminders.eventId, eventId));

  return results.map((row) => ({
    id: row.id,
    eventId: row.eventId,
    type: row.type,
    scheduledAt: row.scheduledAt ? new Date(row.scheduledAt) : null,
    recurrenceRule: row.recurrenceRule,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  }));
};

/**
 * Get a reminder by ID
 */
export const getReminderById = async (id: string): Promise<Reminder | null> => {
  const db = getDb();
  if (!db) {
    throw new Error('Database not initialized');
  }

  const results = await db
    .select()
    .from(reminders)
    .where(eq(reminders.id, id))
    .limit(1);

  if (results.length === 0) {
    return null;
  }

  const row = results[0];
  return {
    id: row.id,
    eventId: row.eventId,
    type: row.type,
    scheduledAt: row.scheduledAt ? new Date(row.scheduledAt) : null,
    recurrenceRule: row.recurrenceRule,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
};

/**
 * Create a new reminder
 */
export const createReminder = async (input: CreateReminderInput): Promise<Reminder> => {
  const db = getDb();
  if (!db) {
    throw new Error('Database not initialized');
  }

  const now = new Date();
  const id = generateId();

  const newReminder = {
    id,
    eventId: input.eventId,
    type: input.type,
    scheduledAt: input.scheduledAt || null,
    recurrenceRule: input.recurrenceRule || null,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(reminders).values(newReminder);

  return {
    id,
    eventId: newReminder.eventId,
    type: newReminder.type,
    scheduledAt: newReminder.scheduledAt,
    recurrenceRule: newReminder.recurrenceRule,
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * Update an existing reminder
 */
export const updateReminder = async (
  id: string,
  input: UpdateReminderInput
): Promise<Reminder | null> => {
  const db = getDb();
  if (!db) {
    throw new Error('Database not initialized');
  }

  const existing = await getReminderById(id);
  if (!existing) {
    return null;
  }

  const updateData: Partial<typeof reminders.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (input.type !== undefined) updateData.type = input.type;
  if (input.scheduledAt !== undefined) updateData.scheduledAt = input.scheduledAt;
  if (input.recurrenceRule !== undefined) updateData.recurrenceRule = input.recurrenceRule;

  await db.update(reminders).set(updateData).where(eq(reminders.id, id));

  return getReminderById(id);
};

/**
 * Delete a reminder
 */
export const deleteReminder = async (id: string): Promise<boolean> => {
  const db = getDb();
  if (!db) {
    throw new Error('Database not initialized');
  }

  try {
    await db.delete(reminders).where(eq(reminders.id, id));
    return true;
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return false;
  }
};

/**
 * Delete all reminders for an event
 */
export const deleteRemindersByEventId = async (eventId: string): Promise<boolean> => {
  const db = getDb();
  if (!db) {
    throw new Error('Database not initialized');
  }

  try {
    await db.delete(reminders).where(eq(reminders.eventId, eventId));
    return true;
  } catch (error) {
    console.error('Error deleting reminders:', error);
    return false;
  }
};

