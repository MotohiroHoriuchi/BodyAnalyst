import { TransformFn, VisConfig, RechartsProps } from '../types';
import { MealRecord } from '../../../../types/meal';
import { filterByDateRange } from '../core/filter';
import { aggregateByTime, sum } from '../core/aggregator';
import { createDateTickFormatter } from '../core/timeUtils';

const DEFAULT_COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'];

export const pfcTransformer: TransformFn<MealRecord> = (data, config) => {
  // 1. Group by date first (meals can have multiple entries per day)
  const groupedByDate = new Map<string, MealRecord[]>();
  data.forEach(meal => {
    if (!groupedByDate.has(meal.date)) {
      groupedByDate.set(meal.date, []);
    }
    groupedByDate.get(meal.date)!.push(meal);
  });

  // Convert to daily totals
  let dailyData = Array.from(groupedByDate.entries()).map(([date, meals]) => ({
    date,
    totalCalories: sum(meals.map(m => m.totalCalories)),
    totalProtein: sum(meals.map(m => m.totalProtein)),
    totalFat: sum(meals.map(m => m.totalFat)),
    totalCarbs: sum(meals.map(m => m.totalCarbs)),
  }));

  // 2. Filter by date range
  let filtered = filterByDateRange(dailyData, config.range);

  // 3. Aggregate if grouping is specified
  if (config.grouping && config.grouping !== 'day') {
    filtered = aggregateByTime(filtered, config.grouping, items => ({
      totalCalories: Math.round(sum(items.map(i => i.totalCalories)) / items.length),
      totalProtein: Math.round(sum(items.map(i => i.totalProtein)) / items.length),
      totalFat: Math.round(sum(items.map(i => i.totalFat)) / items.length),
      totalCarbs: Math.round(sum(items.map(i => i.totalCarbs)) / items.length),
    })) as any[];
  }

  // 4. Map to chart data format
  const chartData = filtered.map(item => ({
    date: item.date,
    calories: item.totalCalories,
    protein: item.totalProtein,
    fat: item.totalFat,
    carbs: item.totalCarbs,
  }));

  // 5. Determine which series to show
  const yFields = Array.isArray(config.mapping.y) ? config.mapping.y : [config.mapping.y];
  const colors = config.colors || DEFAULT_COLORS;

  const series = yFields.map((field, index) => ({
    type: config.type,
    dataKey: field,
    name: getFieldLabel(field),
    color: colors[index % colors.length],
    fill: config.type === 'area' ? colors[index % colors.length] : undefined,
  }));

  // 6. Compose final props
  return {
    data: chartData,
    xAxis: {
      dataKey: config.mapping.x,
      tickFormatter: createDateTickFormatter(config.grouping),
      label: 'Date',
    },
    yAxis: {
      domain: [0, 'auto'] as [0, 'auto'],
      label: yFields.includes('calories') ? 'Calories' : 'Grams',
    },
    series,
  };
};

function getFieldLabel(field: string): string {
  const labels: Record<string, string> = {
    calories: 'Calories',
    protein: 'Protein (g)',
    fat: 'Fat (g)',
    carbs: 'Carbs (g)',
  };
  return labels[field] || field;
}
