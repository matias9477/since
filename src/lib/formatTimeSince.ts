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
      unitLabel = value === 1 ? 'day' : 'days';
      break;
    }
    case 'weeks': {
      const days = differenceInDays(now, startDate);
      value = Math.round((days / 7) * 10) / 10; // Round to 1 decimal place
      unitLabel = value === 1 ? 'week' : 'weeks';
      break;
    }
    case 'months': {
      const days = differenceInDays(now, startDate);
      value = Math.round((days / 30.44) * 10) / 10; // Average days per month
      unitLabel = value === 1 ? 'month' : 'months';
      break;
    }
    case 'years': {
      const years = differenceInYears(now, startDate);
      const remainingMonths = differenceInMonths(now, startDate) % 12;
      
      if (remainingMonths === 0) {
        value = years;
        unitLabel = years === 1 ? 'year' : 'years';
      } else {
        // Format as "X years Y months"
        return `${years} ${years === 1 ? 'year' : 'years'} ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
      }
      break;
    }
    default: {
      const days = differenceInDays(now, startDate);
      value = days;
      unitLabel = value === 1 ? 'day' : 'days';
    }
  }

  return `${value} ${unitLabel}`;
};

