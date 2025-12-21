import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, addDays, isToday, isYesterday } from 'date-fns';
import { ja } from 'date-fns/locale';

export function formatDate(date: string | Date, formatStr: string = 'yyyy/MM/dd'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr, { locale: ja });
}

export function formatDateWithDay(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy/MM/dd (E)', { locale: ja });
}

export function getToday(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getRelativeDateLabel(date: string): string {
  const d = parseISO(date);
  if (isToday(d)) return '今日';
  if (isYesterday(d)) return '昨日';
  return formatDate(date, 'M/d (E)');
}

export function getWeekRange(date: Date = new Date()): { start: Date; end: Date } {
  return {
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 })
  };
}

export function getMonthRange(date: Date = new Date()): { start: Date; end: Date } {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date)
  };
}

export function getDateRange(days: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    dates.push(format(subDays(today, i), 'yyyy-MM-dd'));
  }
  return dates;
}

export function addDaysToDate(date: string, days: number): string {
  return format(addDays(parseISO(date), days), 'yyyy-MM-dd');
}

export function parseISODate(date: string): Date {
  return parseISO(date);
}
