import { create } from 'zustand';
import type { Event, CreateEventInput, UpdateEventInput } from './types';
import * as eventsService from './eventsService';

interface EventsState {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  loadEvents: () => Promise<void>;
  createEvent: (input: CreateEventInput) => Promise<Event | null>;
  updateEvent: (id: string, input: UpdateEventInput) => Promise<Event | null>;
  deleteEvent: (id: string) => Promise<boolean>;
  getEventById: (id: string) => Event | undefined;
}

/**
 * Zustand store for managing events state
 */
export const useEventsStore = create<EventsState>((set, get) => ({
  events: [],
  isLoading: false,
  error: null,

  /**
   * Load all events from the database
   */
  loadEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const events = await eventsService.getAllEvents();
      set({ events, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load events',
        isLoading: false,
      });
    }
  },

  /**
   * Create a new event
   */
  createEvent: async (input: CreateEventInput) => {
    set({ error: null });
    try {
      const newEvent = await eventsService.createEvent(input);
      set((state) => ({
        events: [...state.events, newEvent],
      }));
      return newEvent;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create event';
      console.error('Error creating event:', error);
      set({
        error: errorMessage,
      });
      return null;
    }
  },

  /**
   * Update an existing event
   */
  updateEvent: async (id: string, input: UpdateEventInput) => {
    set({ error: null });
    try {
      const updatedEvent = await eventsService.updateEvent(id, input);
      if (updatedEvent) {
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? updatedEvent : event
          ),
        }));
      }
      return updatedEvent;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update event',
      });
      return null;
    }
  },

  /**
   * Delete an event
   */
  deleteEvent: async (id: string) => {
    set({ error: null });
    try {
      const success = await eventsService.deleteEvent(id);
      if (success) {
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        }));
      }
      return success;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete event',
      });
      return false;
    }
  },

  /**
   * Get an event by ID from the store
   */
  getEventById: (id: string) => {
    return get().events.find((event) => event.id === id);
  },
}));

