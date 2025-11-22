import { create } from 'zustand';
import * as remindersService from './remindersService';
import type { Reminder, CreateReminderInput, UpdateReminderInput } from './types';

interface RemindersState {
  reminders: Reminder[];
  isLoading: boolean;
  error: string | null;

  loadReminders: (eventId: string) => Promise<void>;
  createReminder: (input: CreateReminderInput) => Promise<Reminder | null>;
  updateReminder: (id: string, input: UpdateReminderInput) => Promise<Reminder | null>;
  deleteReminder: (id: string) => Promise<boolean>;
  getRemindersByEventId: (eventId: string) => Reminder[];
  getReminderById: (id: string) => Reminder | undefined;
}

/**
 * Zustand store for managing reminders state
 */
export const useRemindersStore = create<RemindersState>((set, get) => ({
  reminders: [],
  isLoading: false,
  error: null,

  /**
   * Load all reminders for an event
   */
  loadReminders: async (eventId: string) => {
    set({ isLoading: true, error: null });
    try {
      const reminders = await remindersService.getRemindersByEventId(eventId);
      set({ reminders, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load reminders',
        isLoading: false,
      });
    }
  },

  /**
   * Create a new reminder
   */
  createReminder: async (input: CreateReminderInput) => {
    set({ error: null });
    try {
      const newReminder = await remindersService.createReminder(input);
      set((state) => ({
        reminders: [...state.reminders, newReminder],
      }));
      return newReminder;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create reminder';
      console.error('Error creating reminder:', error);
      set({ error: errorMessage });
      return null;
    }
  },

  /**
   * Update an existing reminder
   */
  updateReminder: async (id: string, input: UpdateReminderInput) => {
    set({ error: null });
    try {
      const updatedReminder = await remindersService.updateReminder(id, input);
      if (updatedReminder) {
        set((state) => ({
          reminders: state.reminders.map((reminder) =>
            reminder.id === id ? updatedReminder : reminder
          ),
        }));
      }
      return updatedReminder;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update reminder',
      });
      return null;
    }
  },

  /**
   * Delete a reminder
   */
  deleteReminder: async (id: string) => {
    set({ error: null });
    try {
      const success = await remindersService.deleteReminder(id);
      if (success) {
        set((state) => ({
          reminders: state.reminders.filter((reminder) => reminder.id !== id),
        }));
      }
      return success;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete reminder',
      });
      return false;
    }
  },

  /**
   * Get reminders by event ID from store
   */
  getRemindersByEventId: (eventId: string) => {
    return get().reminders.filter((r) => r.eventId === eventId);
  },

  /**
   * Get reminder by ID from store
   */
  getReminderById: (id: string) => {
    return get().reminders.find((r) => r.id === id);
  },
}));

