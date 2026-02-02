// Export all transformers
export { weightTransformer } from './weightTransformer';
export { volumeTransformer } from './volumeTransformer';
export { pfcTransformer } from './pfcTransformer';

// Available chart types for configuration UI
// This list defines all supported chart configurations
export const AVAILABLE_CHART_TYPES = [
  {
    id: 'weight_trend',
    name: '体重推移',
    description: '体重・体脂肪率・筋肉量の推移を表示',
    transformerType: 'weight',
    supportedChartTypes: ['line', 'area'] as const,
    defaultConfig: {
      type: 'line' as const,
      grouping: 'day' as const,
      mapping: {
        x: 'date',
        y: ['weight', 'bodyFatPercentage'],
      },
    },
  },
  {
    id: 'volume_trend',
    name: 'トレーニングボリューム',
    description: '日別・週別のトレーニングボリューム推移',
    transformerType: 'volume',
    supportedChartTypes: ['bar', 'line', 'area'] as const,
    defaultConfig: {
      type: 'bar' as const,
      grouping: 'week' as const,
      mapping: {
        x: 'date',
        y: 'volume',
      },
    },
  },
  {
    id: 'pfc_balance',
    name: 'PFCバランス',
    description: 'タンパク質・脂質・炭水化物の比率',
    transformerType: 'pfc',
    supportedChartTypes: ['pie', 'bar'] as const,
    defaultConfig: {
      type: 'pie' as const,
      grouping: 'day' as const,
      mapping: {
        x: 'date',
        y: ['protein', 'fat', 'carbs'],
      },
    },
  },
  {
    id: 'calorie_trend',
    name: 'カロリー推移',
    description: '摂取カロリーの推移と目標ライン',
    transformerType: 'pfc',
    supportedChartTypes: ['line', 'area', 'bar'] as const,
    defaultConfig: {
      type: 'line' as const,
      grouping: 'day' as const,
      mapping: {
        x: 'date',
        y: 'calories',
      },
    },
  },
  {
    id: 'pfc_trend',
    name: 'PFC推移',
    description: 'タンパク質・脂質・炭水化物の摂取量推移',
    transformerType: 'pfc',
    supportedChartTypes: ['line', 'area', 'bar'] as const,
    defaultConfig: {
      type: 'line' as const,
      grouping: 'day' as const,
      mapping: {
        x: 'date',
        y: ['protein', 'fat', 'carbs'],
      },
    },
  },
] as const;

export type ChartTypeId = (typeof AVAILABLE_CHART_TYPES)[number]['id'];
