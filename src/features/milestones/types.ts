import type { TimeUnit } from '@/config/types';

/**
 * Milestone entity type matching the database schema
 */
export interface Milestone {
  id: string;
  eventId: string;
  label: string;
  targetAmount: number;
  targetUnit: TimeUnit;
  reachedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input type for creating a new milestone
 */
export interface CreateMilestoneInput {
  eventId: string;
  label: string;
  targetAmount: number;
  targetUnit: TimeUnit;
}

/**
 * Input type for updating an existing milestone
 */
export interface UpdateMilestoneInput {
  label?: string;
  targetAmount?: number;
  targetUnit?: TimeUnit;
}

