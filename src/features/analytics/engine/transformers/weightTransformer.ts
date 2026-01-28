import { TransformFn, VisConfig, RechartsProps } from '../types';
import { WeightRecord } from '../../../../types/weight';
import { filterByDateRange } from '../core/filter';
import { aggregateByTime, average } from '../core/aggregator';
import { createDateTickFormatter } from '../core/timeUtils';

const DEFAULT_COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

export const weightTransformer: TransformFn<WeightRecord> = (data, config) => {
  // 1. Filter by date range
  let filtered = filterByDateRange(data, config.range);

  // 2. Aggregate if grouping is specified
  if (config.grouping && config.grouping !== 'day') {
    filtered = aggregateByTime(filtered, config.grouping, items => ({
      weight: average(items.map(i => i.weight)),
      bodyFatPercentage: average(
        items.filter(i => i.bodyFatPercentage !== undefined).map(i => i.bodyFatPercentage!)
      ),
      muscleMass: average(
        items.filter(i => i.muscleMass !== undefined).map(i => i.muscleMass!)
      ),
    })) as any[];
  }

  // 3. Map to chart data format
  const chartData = filtered.map(record => ({
    date: record.date,
    weight: record.weight,
    bodyFatPercentage: record.bodyFatPercentage,
    muscleMass: record.muscleMass,
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
      domain: ['auto', 'auto'] as ['auto', 'auto'],
      label: 'Value',
    },
    series,
  };
};

function getFieldLabel(field: string): string {
  const labels: Record<string, string> = {
    weight: 'Weight (kg)',
    bodyFatPercentage: 'Body Fat (%)',
    muscleMass: 'Muscle Mass (kg)',
  };
  return labels[field] || field;
}
