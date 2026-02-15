import { DateRange } from '../types';

/**
 * Filter data by date range
 */
export function filterByDateRange<T extends { date: string | Date }>(
  data: T[],
  range?: DateRange
): T[] {
  if (!range) {
    return data;
  }

  const { start, end } = range;

  return data.filter(item => {
    const itemDate = typeof item.date === 'string' ? new Date(item.date) : item.date;
    return itemDate >= start && itemDate <= end;
  });
}
