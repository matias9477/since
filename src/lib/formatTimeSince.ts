import { differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';
import type { TimeUnit } from '@/config/types';

/**
 * Formats a number with commas for better readability
 * Example: 1000000 -> "1,000,000"
 */
const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

/**
 * Formats the time elapsed since a given start date in the specified unit
 * Uses compound units (e.g., "1 week and 1 day" instead of "1.1 weeks")
 * Numbers are formatted with commas for better readability
 *
 * @param startDate - The start date to calculate time from
 * @param unit - The unit to display (days, weeks, months, years)
 * @returns A formatted string representing the time elapsed (e.g., "123 days", "1 week and 1 day")
 */
export const formatTimeSince = (startDate: Date, unit: TimeUnit): string => {
  const now = new Date();
  const totalDays = differenceInDays(now, startDate);

  switch (unit) {
    case 'days': {
      // TODO: Replace hardcoded unit labels with i18n translations
      const unitLabel = totalDays === 1 ? 'day' : 'days';
      return `${formatNumber(totalDays)} ${unitLabel}`;
    }

    case 'weeks': {
      const weeks = Math.floor(totalDays / 7);
      const remainingDays = totalDays % 7;

      // TODO: Replace hardcoded unit labels with i18n translations
      if (weeks === 0) {
        const unitLabel = remainingDays === 1 ? 'day' : 'days';
        return `${formatNumber(remainingDays)} ${unitLabel}`;
      }
      if (remainingDays === 0) {
        const unitLabel = weeks === 1 ? 'week' : 'weeks';
        return `${formatNumber(weeks)} ${unitLabel}`;
      }
      const weeksLabel = weeks === 1 ? 'week' : 'weeks';
      const daysLabel = remainingDays === 1 ? 'day' : 'days';
      return `${formatNumber(weeks)} ${weeksLabel} and ${formatNumber(remainingDays)} ${daysLabel}`;
    }

    case 'months': {
      const totalMonths = differenceInMonths(now, startDate);
      
      // Calculate remaining days after full months
      const monthsStartDate = new Date(startDate);
      monthsStartDate.setMonth(monthsStartDate.getMonth() + totalMonths);
      const remainingDays = differenceInDays(now, monthsStartDate);

      // TODO: Replace hardcoded unit labels with i18n translations
      if (totalMonths === 0) {
        // Less than a month, show days
        const daysLabel = remainingDays === 1 ? 'day' : 'days';
        return `${formatNumber(remainingDays)} ${daysLabel}`;
      }
      if (remainingDays === 0) {
        // Exact months, no remaining days
        const monthsLabel = totalMonths === 1 ? 'month' : 'months';
        return `${formatNumber(totalMonths)} ${monthsLabel}`;
      }
      
      // Months and days
      const monthsLabel = totalMonths === 1 ? 'month' : 'months';
      const daysLabel = remainingDays === 1 ? 'day' : 'days';
      return `${formatNumber(totalMonths)} ${monthsLabel} and ${formatNumber(remainingDays)} ${daysLabel}`;
    }

    case 'years': {
      const years = differenceInYears(now, startDate);
      const totalMonths = differenceInMonths(now, startDate);
      const remainingMonths = totalMonths % 12;
      
      // TODO: Replace hardcoded unit labels with i18n translations
      if (remainingMonths === 0) {
        const unitLabel = years === 1 ? 'year' : 'years';
        return `${formatNumber(years)} ${unitLabel}`;
      }
      
      // Format as "X years and Y months"
      const yearsLabel = years === 1 ? 'year' : 'years';
      const monthsLabel = remainingMonths === 1 ? 'month' : 'months';
      return `${formatNumber(years)} ${yearsLabel} and ${formatNumber(remainingMonths)} ${monthsLabel}`;
    }

    default: {
      // TODO: Replace hardcoded unit labels with i18n translations
      const unitLabel = totalDays === 1 ? 'day' : 'days';
      return `${formatNumber(totalDays)} ${unitLabel}`;
    }
  }
};

