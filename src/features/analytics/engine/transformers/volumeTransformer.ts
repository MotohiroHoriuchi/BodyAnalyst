import { TransformFn, VisConfig, RechartsProps } from '../types';
import { WorkoutSession } from '../../../../types/workout';
import { filterByDateRange } from '../core/filter';
import { aggregateByTime, sum } from '../core/aggregator';
import { createDateTickFormatter } from '../core/timeUtils';

const DEFAULT_COLORS = ['#8b5cf6', '#ec4899'];

export const volumeTransformer: TransformFn<WorkoutSession> = (data, config) => {
  // 1. Filter by date range
  let filtered = filterByDateRange(data, config.range);

  // 2. Aggregate if grouping is specified
  if (config.grouping && config.grouping !== 'day') {
    filtered = aggregateByTime(filtered, config.grouping, items => ({
      totalVolume: sum(items.map(i => i.totalVolume)),
      sessionCount: items.length,
    })) as any[];
  } else {
    // Add session count for daily data
    filtered = filtered.map(item => ({
      ...item,
      sessionCount: 1,
    })) as any[];
  }

  // 3. Map to chart data format
  const chartData = filtered.map(session => ({
    date: session.date,
    totalVolume: session.totalVolume,
    sessionCount: (session as any).sessionCount,
  }));

  // 4. Determine which series to show
  const yFields = Array.isArray(config.mapping.y) ? config.mapping.y : [config.mapping.y];
  const colors = config.colors || DEFAULT_COLORS;

  const series = yFields.map((field, index) => ({
    type: config.type,
    dataKey: field,
    name: getFieldLabel(field),
    color: colors[index % colors.length],
    fill: config.type === 'area' ? colors[index % colors.length] : undefined,
  }));

  // 5. Compose final props
  return {
    data: chartData,
    xAxis: {
      dataKey: config.mapping.x,
      tickFormatter: createDateTickFormatter(config.grouping),
      label: 'Date',
    },
    yAxis: {
      domain: [0, 'auto'] as [0, 'auto'],
      label: 'Volume (kg)',
    },
    series,
  };
};

function getFieldLabel(field: string): string {
  const labels: Record<string, string> = {
    totalVolume: 'Total Volume (kg)',
    sessionCount: 'Session Count',
  };
  return labels[field] || field;
}
