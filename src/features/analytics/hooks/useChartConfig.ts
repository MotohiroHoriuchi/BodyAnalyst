import { subDays } from 'date-fns';
import { VisConfig } from '../engine/types';

export const CHART_CONFIGS: Record<string, VisConfig> = {
  WEIGHT_TREND: {
    type: 'area',
    grouping: 'day',
    range: {
      start: subDays(new Date(), 30),
      end: new Date(),
    },
    mapping: {
      x: 'date',
      y: ['weight', 'bodyFatPercentage'],
    },
    colors: ['#3b82f6', '#f59e0b'],
  },
  VOLUME_TREND: {
    type: 'bar',
    grouping: 'week',
    range: {
      start: subDays(new Date(), 60),
      end: new Date(),
    },
    mapping: {
      x: 'date',
      y: 'totalVolume',
    },
    colors: ['#8b5cf6'],
  },
  PFC_BALANCE: {
    type: 'pie',
    grouping: 'day',
    range: {
      start: subDays(new Date(), 7),
      end: new Date(),
    },
    mapping: {
      x: 'date',
      y: ['protein', 'fat', 'carbs'],
    },
    colors: ['#ef4444', '#f59e0b', '#10b981'],
  },
  CALORIE_TREND: {
    type: 'line',
    grouping: 'day',
    range: {
      start: subDays(new Date(), 30),
      end: new Date(),
    },
    mapping: {
      x: 'date',
      y: 'calories',
    },
    colors: ['#3b82f6'],
  },
  PFC_TREND: {
    type: 'line',
    grouping: 'day',
    range: {
      start: subDays(new Date(), 30),
      end: new Date(),
    },
    mapping: {
      x: 'date',
      y: ['protein', 'fat', 'carbs'],
    },
    colors: ['#ef4444', '#f59e0b', '#10b981'],
  },
};

export function useChartConfig() {
  return CHART_CONFIGS;
}
