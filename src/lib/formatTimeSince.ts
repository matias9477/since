import { differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears } from 'date-fns';
import type { TimeUnit } from '@/config/types';

/**
 * Formats the time elapsed since a given start date in the specified unit
 *
 * @param startDate - The start date to calculate time from
 * @param unit - The unit to display (days, weeks, months, years)
 * @returns A formatted string representing the time elapsed (e.g., "123 days", "3.5 weeks")
 */
export const formatTimeSince = (startDate: Date, unit: TimeUnit): string => {
  const now = new Date();
  let value: number;
  let unitLabel: string;

  switch (unit) {
    case 'days': {
      value = differenceInDays(now, startDate);
      // TODO: Replace hardcoded unit labels with i18n translations
      unitLabel = value === 1 ? 'day' : 'days';
      break;
    }
    case 'weeks': {
      const days = differenceInDays(now, startDate);
      // TODO: Make decimal precision configurable (currently hardcoded to 1 decimal place)
      value = Math.round((days / 7) * 10) / 10; // Round to 1 decimal place
      // TODO: Replace hardcoded unit labels with i18n translations
      unitLabel = value === 1 ? 'week' : 'weeks';
      break;
    }
    case 'months': {
      const days = differenceInDays(now, startDate);
      // TODO: Make average days per month configurable or use more accurate calculation (currently hardcoded to 30.44)
      value = Math.round((days / 30.44) * 10) / 10; // Average days per month
      // TODO: Replace hardcoded unit labels with i18n translations
      unitLabel = value === 1 ? 'month' : 'months';
      break;
    }
    case 'years': {
      const years = differenceInYears(now, startDate);
      const remainingMonths = differenceInMonths(now, startDate) % 12;
      
      if (remainingMonths === 0) {
        value = years;
        // TODO: Replace hardcoded unit labels with i18n translations
        unitLabel = years === 1 ? 'year' : 'years';
      } else {
        // Format as "X years Y months"
        // TODO: Replace hardcoded unit labels with i18n translations
        return `${years} ${years === 1 ? 'year' : 'years'} ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
      }
      break;
    }
    default: {
      const days = differenceInDays(now, startDate);
      value = days;
      // TODO: Replace hardcoded unit labels with i18n translations
      unitLabel = value === 1 ? 'day' : 'days';
    }
  }

  return `${value} ${unitLabel}`;
};

