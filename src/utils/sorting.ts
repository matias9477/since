import type { Event } from '@/features/events/types';

/**
 * Available sort options for events
 */
export type SortOption = 'alphabetical' | 'dateAscending' | 'dateDescending';

/**
 * Sorts events based on the selected sort option
 * @param events - Array of events to sort
 * @param sortOption - The sort option to apply
 * @returns Sorted array of events
 */
export const sortEvents = (events: Event[], sortOption: SortOption): Event[] => {
  const sorted = [...events];

  switch (sortOption) {
    case 'alphabetical':
      return sorted.sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        if (titleA < titleB) return -1;
        if (titleA > titleB) return 1;
        return 0;
      });

    case 'dateAscending':
      return sorted.sort((a, b) => {
        const dateA = a.startDate.getTime();
        const dateB = b.startDate.getTime();
        return dateA - dateB;
      });

    case 'dateDescending':
      return sorted.sort((a, b) => {
        const dateA = a.startDate.getTime();
        const dateB = b.startDate.getTime();
        return dateB - dateA;
      });

    default:
      return sorted;
  }
};

/**
 * Gets the display label for a sort option
 * @param sortOption - The sort option
 * @returns Human-readable label
 */
export const getSortOptionLabel = (sortOption: SortOption): string => {
  switch (sortOption) {
    case 'alphabetical':
      return 'Alphabetically';
    case 'dateAscending':
      return 'Date (Oldest First)';
    case 'dateDescending':
      return 'Date (Newest First)';
    default:
      return 'Alphabetically';
  }
};

