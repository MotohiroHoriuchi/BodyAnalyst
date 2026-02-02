import { useMemo } from 'react';
import { BaseChart } from './charts/BaseChart';
import { PieChartBlock } from './charts/PieChartBlock';
import { ChartBlock } from './ui/ChartBlock';
import type { VisConfig, RechartsProps } from '../engine/types';
import { weightTransformer } from '../engine/transformers/weightTransformer';
import { volumeTransformer } from '../engine/transformers/volumeTransformer';
import { pfcTransformer } from '../engine/transformers/pfcTransformer';

interface VisualizationBlockProps<T = any> {
  data: T[];
  config: VisConfig;
  loading?: boolean;
  error?: string;
  blockSize?: '1x1' | '2x1' | '2x2';
  height?: number;
}

/**
 * Main entry component for the Analytics/Visualization Engine.
 *
 * Accepts raw domain data and a VisConfig, dynamically selects the appropriate
 * Transformer based on config, and renders the transformed data using BaseChart.
 *
 * This is the central extension point for the analytics module.
 */
export function VisualizationBlock<T = any>({
  data,
  config,
  loading = false,
  error,
  blockSize = '2x1',
  height = 300,
}: VisualizationBlockProps<T>) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return null;
    }

    try {
      // Select transformer based on config type or mapping
      const transformer = selectTransformer(config);
      if (!transformer) {
        console.error('No transformer found for config:', config);
        return null;
      }

      return transformer(data, config);
    } catch (err) {
      console.error('Error transforming data:', err);
      return null;
    }
  }, [data, config]);

  const isEmpty = !data || data.length === 0;
  const hasError = error || (chartData === null && !isEmpty);

  // Select appropriate chart component based on type
  const ChartComponent = config.type === 'pie' ? PieChartBlock : BaseChart;

  return (
    <ChartBlock
      title={config.title || 'Chart'}
      size={blockSize}
      loading={loading}
      error={hasError ? error || 'データの変換に失敗しました' : undefined}
      isEmpty={isEmpty}
    >
      {chartData && <ChartComponent data={chartData} blockSize={blockSize} height={height} />}
    </ChartBlock>
  );
}

/**
 * Selects the appropriate transformer based on the VisConfig.
 *
 * This is the registry/mapping logic that connects config to transformers.
 * Extension point: Add new transformers here as features are added.
 */
function selectTransformer(config: VisConfig): ((data: any[], config: VisConfig) => RechartsProps) | null {
  // Strategy 1: Use explicit transformer type if provided
  if ('transformerType' in config) {
    const transformerType = (config as any).transformerType;
    switch (transformerType) {
      case 'weight':
        return weightTransformer;
      case 'volume':
        return volumeTransformer;
      case 'pfc':
      case 'calorie':
        return pfcTransformer;
      default:
        return null;
    }
  }

  // Strategy 2: Infer from mapping.y field names
  const yFields = Array.isArray(config.mapping.y) ? config.mapping.y : [config.mapping.y];

  // Weight-related fields
  if (yFields.some(f => ['weight', 'bodyFatPercentage', 'muscleMass'].includes(f))) {
    return weightTransformer;
  }

  // Volume-related fields
  if (yFields.some(f => ['volume', 'totalVolume'].includes(f))) {
    return volumeTransformer;
  }

  // PFC/Calorie-related fields
  if (yFields.some(f => ['protein', 'fat', 'carbs', 'calories'].includes(f))) {
    return pfcTransformer;
  }

  // Default fallback
  console.warn('Could not infer transformer from config, using weightTransformer as fallback');
  return weightTransformer;
}
