import { eq } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { milestones } from '@/db/schema';
import { generateId } from '@/lib/id';
import type { Milestone, CreateMilestoneInput, UpdateMilestoneInput } from './types';

/**
 * Get all milestones for an event
 */
export const getMilestonesByEventId = async (eventId: string): Promise<Milestone[]> => {
  const db = getDb();
  if (!db) {
    throw new Error('Database not initialized');
  }

  const results = await db
    .select()
    .from(milestones)
    .where(eq(milestones.eventId, eventId));

  return results.map((row) => ({
    id: row.id,
    eventId: row.eventId,
    label: row.label,
    targetAmount: row.targetAmount,
    targetUnit: row.targetUnit,
    reachedAt: row.reachedAt ? new Date(row.reachedAt) : null,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  }));
};

/**
 * Get a milestone by ID
 */
export const getMilestoneById = async (id: string): Promise<Milestone | null> => {
  const db = getDb();
  if (!db) {
    throw new Error('Database not initialized');
  }

  const results = await db
    .select()
    .from(milestones)
    .where(eq(milestones.id, id))
    .limit(1);

  if (results.length === 0) {
    return null;
  }

  const row = results[0];
  return {
    id: row.id,
    eventId: row.eventId,
    label: row.label,
    targetAmount: row.targetAmount,
    targetUnit: row.targetUnit,
    reachedAt: row.reachedAt ? new Date(row.reachedAt) : null,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
};

/**
 * Create a new milestone
 */
export const createMilestone = async (input: CreateMilestoneInput): Promise<Milestone> => {
  const db = getDb();
  if (!db) {
    throw new Error('Database not initialized');
  }

  const now = new Date();
  const id = generateId();

  const newMilestone = {
    id,
    eventId: input.eventId,
    label: input.label,
    targetAmount: input.targetAmount,
    targetUnit: input.targetUnit,
    reachedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(milestones).values(newMilestone);

  return {
    id,
    eventId: newMilestone.eventId,
    label: newMilestone.label,
    targetAmount: newMilestone.targetAmount,
    targetUnit: newMilestone.targetUnit,
    reachedAt: null,
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * Create multiple milestones at once
 */
export const createMilestones = async (inputs: CreateMilestoneInput[]): Promise<Milestone[]> => {
  const db = getDb();
  if (!db) {
    throw new Error('Database not initialized');
  }

  const now = new Date();
  const newMilestones = inputs.map((input) => ({
    id: generateId(),
    eventId: input.eventId,
    label: input.label,
    targetAmount: input.targetAmount,
    targetUnit: input.targetUnit,
    reachedAt: null,
    createdAt: now,
    updatedAt: now,
  }));

  await db.insert(milestones).values(newMilestones);

  return newMilestones.map((m) => ({
    id: m.id,
    eventId: m.eventId,
    label: m.label,
    targetAmount: m.targetAmount,
    targetUnit: m.targetUnit,
    reachedAt: null,
    createdAt: now,
    updatedAt: now,
  }));
};

/**
 * Update an existing milestone
 */
export const updateMilestone = async (
  id: string,
  input: UpdateMilestoneInput
): Promise<Milestone | null> => {
  const db = getDb();
  if (!db) {
    throw new Error('Database not initialized');
  }

  const existing = await getMilestoneById(id);
  if (!existing) {
    return null;
  }

  const updateData: Partial<typeof milestones.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (input.label !== undefined) updateData.label = input.label;
  if (input.targetAmount !== undefined) updateData.targetAmount = input.targetAmount;
  if (input.targetUnit !== undefined) updateData.targetUnit = input.targetUnit;

  await db.update(milestones).set(updateData).where(eq(milestones.id, id));

  return getMilestoneById(id);
};

/**
 * Mark a milestone as reached
 */
export const markMilestoneReached = async (id: string): Promise<Milestone | null> => {
  const db = getDb();
  if (!db) {
    throw new Error('Database not initialized');
  }

  const existing = await getMilestoneById(id);
  if (!existing) {
    return null;
  }

  // Only mark as reached if not already reached
  if (!existing.reachedAt) {
    await db
      .update(milestones)
      .set({ reachedAt: new Date(), updatedAt: new Date() })
      .where(eq(milestones.id, id));
  }

  return getMilestoneById(id);
};

/**
 * Delete a milestone
 */
export const deleteMilestone = async (id: string): Promise<boolean> => {
  const db = getDb();
  if (!db) {
    throw new Error('Database not initialized');
  }

  try {
    await db.delete(milestones).where(eq(milestones.id, id));
    return true;
  } catch (error) {
    console.error('Error deleting milestone:', error);
    return false;
  }
};

/**
 * Delete all milestones for an event
 */
export const deleteMilestonesByEventId = async (eventId: string): Promise<boolean> => {
  const db = getDb();
  if (!db) {
    throw new Error('Database not initialized');
  }

  try {
    await db.delete(milestones).where(eq(milestones.eventId, eventId));
    return true;
  } catch (error) {
    console.error('Error deleting milestones:', error);
    return false;
  }
};

