import type { MilestoneConfig } from './types';

/**
 * Predefined milestones that are automatically created for each event
 * These represent common celebration points including all popular milestones
 */
export const PREDEFINED_MILESTONES: Omit<MilestoneConfig, 'isPredefined'>[] = [
  // Time-based milestones
  { label: '1 Week', targetAmount: 1, targetUnit: 'weeks' },
  { label: '1 Month', targetAmount: 1, targetUnit: 'months' },
  { label: '3 Months', targetAmount: 3, targetUnit: 'months' },
  { label: '6 Months', targetAmount: 6, targetUnit: 'months' },
  { label: '1 Year', targetAmount: 1, targetUnit: 'years' },
  { label: '2 Years', targetAmount: 2, targetUnit: 'years' },
  { label: '5 Years', targetAmount: 5, targetUnit: 'years' },
  { label: '10 Years', targetAmount: 10, targetUnit: 'years' },
  // Day-based milestones
  { label: '100 Days', targetAmount: 100, targetUnit: 'days' },
  { label: '500 Days', targetAmount: 500, targetUnit: 'days' },
  { label: '1000 Days', targetAmount: 1000, targetUnit: 'days' },
  { label: '1500 Days', targetAmount: 1500, targetUnit: 'days' },
  { label: '2000 Days', targetAmount: 2000, targetUnit: 'days' },
];

/**
 * Checks if a milestone has been reached based on the event start date
 */
export const isMilestoneReached = (
  milestone: MilestoneConfig,
  eventStartDate: Date
): boolean => {
  const now = new Date();
  const daysSince = Math.floor((now.getTime() - eventStartDate.getTime()) / (1000 * 60 * 60 * 24));
  
  let targetDays: number;
  
  switch (milestone.targetUnit) {
    case 'days':
      targetDays = milestone.targetAmount;
      break;
    case 'weeks':
      targetDays = milestone.targetAmount * 7;
      break;
    case 'months':
      // Approximate: 30.44 days per month
      targetDays = milestone.targetAmount * 30.44;
      break;
    case 'years':
      // Approximate: 365.25 days per year
      targetDays = milestone.targetAmount * 365.25;
      break;
    default:
      return false;
  }
  
  return daysSince >= targetDays;
};

