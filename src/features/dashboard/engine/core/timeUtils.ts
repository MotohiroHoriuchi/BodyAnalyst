import { format } from 'date-fns';
import { TimeGrouping } from '../types';

/**
 * Format date for display based on grouping
 */
export function formatDateForDisplay(date: string, grouping: TimeGrouping = 'day'): string {
  const dateObj = new Date(date);

  switch (grouping) {
    case 'month':
      return format(dateObj, 'MMM yyyy');
    case 'week':
      return format(dateObj, 'MMM d');
    case 'day':
    default:
      return format(dateObj, 'MM/dd');
  }
}

/**
 * Create a tick formatter for charts
 */
export function createDateTickFormatter(grouping: TimeGrouping = 'day') {
  return (value: string) => formatDateForDisplay(value, grouping);
}
