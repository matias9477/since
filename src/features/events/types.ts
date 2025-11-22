import type { TimeUnit } from '@/config/types';

/**
 * Event entity type matching the database schema
 */
export interface Event {
  id: string;
  title: string;
  description: string | null;
  startDate: Date;
  showTimeAs: TimeUnit;
  color: string | null;
  icon: string | null;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input type for creating a new event
 */
export interface CreateEventInput {
  title: string;
  description?: string;
  startDate: Date;
  showTimeAs?: TimeUnit;
  color?: string;
  icon?: string;
  isPinned?: boolean;
}

/**
 * Input type for updating an existing event
 */
export interface UpdateEventInput {
  title?: string;
  description?: string;
  startDate?: Date;
  showTimeAs?: TimeUnit;
  color?: string;
  icon?: string;
  isPinned?: boolean;
}

