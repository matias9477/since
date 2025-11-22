import { create } from 'zustand';
import * as milestonesService from './milestonesService';
import type { Milestone, CreateMilestoneInput, UpdateMilestoneInput } from './types';

interface MilestonesState {
  milestones: Milestone[];
  isLoading: boolean;
  error: string | null;

  loadMilestones: (eventId: string) => Promise<void>;
  createMilestone: (input: CreateMilestoneInput) => Promise<Milestone | null>;
  createMilestones: (inputs: CreateMilestoneInput[]) => Promise<Milestone[]>;
  updateMilestone: (id: string, input: UpdateMilestoneInput) => Promise<Milestone | null>;
  markMilestoneReached: (id: string) => Promise<Milestone | null>;
  deleteMilestone: (id: string) => Promise<boolean>;
  getMilestonesByEventId: (eventId: string) => Milestone[];
  getMilestoneById: (id: string) => Milestone | undefined;
}

/**
 * Zustand store for managing milestones state
 */
export const useMilestonesStore = create<MilestonesState>((set, get) => ({
  milestones: [],
  isLoading: false,
  error: null,

  /**
   * Load all milestones for an event
   */
  loadMilestones: async (eventId: string) => {
    set({ isLoading: true, error: null });
    try {
      const milestones = await milestonesService.getMilestonesByEventId(eventId);
      set({ milestones, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load milestones',
        isLoading: false,
      });
    }
  },

  /**
   * Create a new milestone
   */
  createMilestone: async (input: CreateMilestoneInput) => {
    set({ error: null });
    try {
      const newMilestone = await milestonesService.createMilestone(input);
      set((state) => ({
        milestones: [...state.milestones, newMilestone],
      }));
      return newMilestone;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create milestone';
      console.error('Error creating milestone:', error);
      set({ error: errorMessage });
      return null;
    }
  },

  /**
   * Create multiple milestones
   */
  createMilestones: async (inputs: CreateMilestoneInput[]) => {
    set({ error: null });
    try {
      const newMilestones = await milestonesService.createMilestones(inputs);
      set((state) => ({
        milestones: [...state.milestones, ...newMilestones],
      }));
      return newMilestones;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create milestones';
      console.error('Error creating milestones:', error);
      set({ error: errorMessage });
      return [];
    }
  },

  /**
   * Update an existing milestone
   */
  updateMilestone: async (id: string, input: UpdateMilestoneInput) => {
    set({ error: null });
    try {
      const updatedMilestone = await milestonesService.updateMilestone(id, input);
      if (updatedMilestone) {
        set((state) => ({
          milestones: state.milestones.map((milestone) =>
            milestone.id === id ? updatedMilestone : milestone
          ),
        }));
      }
      return updatedMilestone;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update milestone',
      });
      return null;
    }
  },

  /**
   * Mark a milestone as reached
   */
  markMilestoneReached: async (id: string) => {
    set({ error: null });
    try {
      const updatedMilestone = await milestonesService.markMilestoneReached(id);
      if (updatedMilestone) {
        set((state) => ({
          milestones: state.milestones.map((milestone) =>
            milestone.id === id ? updatedMilestone : milestone
          ),
        }));
      }
      return updatedMilestone;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to mark milestone as reached',
      });
      return null;
    }
  },

  /**
   * Delete a milestone
   */
  deleteMilestone: async (id: string) => {
    set({ error: null });
    try {
      const success = await milestonesService.deleteMilestone(id);
      if (success) {
        set((state) => ({
          milestones: state.milestones.filter((milestone) => milestone.id !== id),
        }));
      }
      return success;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete milestone',
      });
      return false;
    }
  },

  /**
   * Get milestones by event ID from store
   */
  getMilestonesByEventId: (eventId: string) => {
    return get().milestones.filter((m) => m.eventId === eventId);
  },

  /**
   * Get milestone by ID from store
   */
  getMilestoneById: (id: string) => {
    return get().milestones.find((m) => m.id === id);
  },
}));

