import { eq, desc } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { events } from '@/db/schema';
import type { Event, CreateEventInput, UpdateEventInput } from './types';
import { DEFAULT_TIME_UNIT } from '@/config/constants';
import { PREDEFINED_MILESTONES } from '@/config/milestones';
import * as milestonesService from '@/features/milestones/milestonesService';
import { scheduleEventMilestoneNotifications } from '@/utils/notifications';

/**
 * Generate a UUID v4 string
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Get all events, optionally sorted by pinned status
 */
export const getAllEvents = async (): Promise<Event[]> => {
  const db = getDb();
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  const result = await db
    .select()
    .from(events)
    .orderBy(desc(events.isPinned), desc(events.createdAt));
  
  return result.map((row) => ({
    ...row,
    startDate: new Date(row.startDate),
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  }));
};

/**
 * Get a single event by ID
 */
export const getEventById = async (id: string): Promise<Event | null> => {
  const db = getDb();
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
  
  if (result.length === 0 || !result[0]) {
    return null;
  }
  
  const row = result[0];
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    startDate: new Date(row.startDate),
    showTimeAs: row.showTimeAs,
    color: row.color,
    icon: row.icon,
    isPinned: row.isPinned,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
};

/**
 * Create a new event
 */
export const createEvent = async (input: CreateEventInput): Promise<Event> => {
  const db = getDb();
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  if (!input.startDate) {
    throw new Error('Start date is required');
  }
  
  // Ensure startDate is a Date object
  let startDate: Date;
  if (input.startDate instanceof Date) {
    startDate = input.startDate;
  } else if (typeof input.startDate === 'string' || typeof input.startDate === 'number') {
    startDate = new Date(input.startDate);
  } else {
    throw new Error(`Invalid start date type: ${typeof input.startDate}`);
  }
  
  if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
    throw new Error(`Invalid start date: ${startDate}`);
  }
  
  const now = new Date();
  const id = generateId();
  
  // With mode: 'timestamp', Drizzle expects Date objects, not numbers
  const newEvent = {
    id,
    title: input.title,
    description: input.description ?? null,
    startDate: startDate, // Pass Date object, Drizzle will convert to timestamp
    showTimeAs: input.showTimeAs ?? DEFAULT_TIME_UNIT,
    color: input.color ?? null,
    icon: input.icon ?? null,
    isPinned: input.isPinned ?? false,
    createdAt: now, // Pass Date object
    updatedAt: now, // Pass Date object
  };
  
  await db.insert(events).values(newEvent);
  
  // Auto-create predefined milestones for the new event
  let createdMilestones: Array<{
    id: string;
    label: string;
    targetAmount: number;
    targetUnit: 'days' | 'weeks' | 'months' | 'years';
  }> = [];
  
  try {
    const milestoneInputs = PREDEFINED_MILESTONES.map((milestone) => ({
      eventId: id,
      label: milestone.label,
      targetAmount: milestone.targetAmount,
      targetUnit: milestone.targetUnit,
    }));
    createdMilestones = await milestonesService.createMilestones(milestoneInputs);
  } catch (error) {
    // Log error but don't fail event creation if milestones fail
    console.error('Error creating predefined milestones:', error);
  }

  // Schedule milestone notifications for all milestones
  // This happens asynchronously and won't block event creation
  if (createdMilestones.length > 0) {
    scheduleEventMilestoneNotifications(
      id,
      input.title,
      startDate,
      createdMilestones
    ).catch((error) => {
      // Log error but don't fail event creation if notifications fail
      console.error('Error scheduling milestone notifications:', error);
    });
  }
  
  return {
    id,
    title: newEvent.title,
    description: newEvent.description,
    startDate,
    showTimeAs: newEvent.showTimeAs,
    color: newEvent.color,
    icon: newEvent.icon,
    isPinned: newEvent.isPinned,
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * Update an existing event
 */
export const updateEvent = async (id: string, input: UpdateEventInput): Promise<Event | null> => {
  const db = getDb();
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  const existing = await getEventById(id);
  
  if (!existing) {
    return null;
  }
  
  const updateData: Partial<typeof events.$inferInsert> = {
    updatedAt: new Date(), // Pass Date object for mode: 'timestamp'
  };
  
  if (input.title !== undefined) updateData.title = input.title;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.startDate !== undefined) {
    // Ensure startDate is a Date object
    let startDate: Date;
    if (input.startDate instanceof Date) {
      startDate = input.startDate;
    } else if (typeof input.startDate === 'string' || typeof input.startDate === 'number') {
      startDate = new Date(input.startDate);
    } else {
      throw new Error(`Invalid start date type: ${typeof input.startDate}`);
    }
    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
      throw new Error(`Invalid start date: ${startDate}`);
    }
    updateData.startDate = startDate; // Pass Date object for mode: 'timestamp'
  }
  if (input.showTimeAs !== undefined) updateData.showTimeAs = input.showTimeAs;
  if (input.color !== undefined) updateData.color = input.color;
  if (input.icon !== undefined) updateData.icon = input.icon;
  if (input.isPinned !== undefined) updateData.isPinned = input.isPinned;
  
  await db.update(events).set(updateData).where(eq(events.id, id));
  
  return getEventById(id);
};

/**
 * Delete an event by ID
 */
export const deleteEvent = async (id: string): Promise<boolean> => {
  const db = getDb();
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  await db.delete(events).where(eq(events.id, id));
  
  // Verify deletion by checking if event still exists
  const exists = await getEventById(id);
  return exists === null;
};

