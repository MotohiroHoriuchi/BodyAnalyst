import { TimeGrouping } from '../types';
import { format, startOfWeek, startOfMonth } from 'date-fns';

/**
 * Group data by time period
 */
export function aggregateByTime<T extends { date: string | Date }>(
  data: T[],
  grouping: TimeGrouping,
  aggregateFn: (group: T[]) => any
): Array<{ date: string; [key: string]: any }> {
  const groups = new Map<string, T[]>();

  data.forEach(item => {
    const itemDate = typeof item.date === 'string' ? new Date(item.date) : item.date;
    const key = getGroupKey(itemDate, grouping);

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(item);
  });

  return Array.from(groups.entries())
    .map(([date, items]) => ({
      date,
      ...aggregateFn(items),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Get group key based on time grouping
 */
function getGroupKey(date: Date, grouping: TimeGrouping): string {
  switch (grouping) {
    case 'week':
      return format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
    case 'month':
      return format(startOfMonth(date), 'yyyy-MM');
    case 'day':
    default:
      return format(date, 'yyyy-MM-dd');
  }
}

/**
 * Calculate average of numeric values
 */
export function average(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return Math.round((sum / values.length) * 10) / 10;
}

/**
 * Calculate sum of numeric values
 */
export function sum(values: number[]): number {
  return values.reduce((acc, val) => acc + val, 0);
}
