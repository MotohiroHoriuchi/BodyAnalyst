import { useMemo } from 'react';
import { useWeight } from '../../weight/hooks/useWeight';
import { weightTransformer } from '../engine/transformers/weightTransformer';
import { CHART_CONFIGS } from './useChartConfig';
import type { VisConfig } from '../engine/types';

export function useWeightChart(config?: Partial<VisConfig>) {
  const { records, loading, error } = useWeight();

  const chartData = useMemo(() => {
    if (!records || records.length === 0) {
      return null;
    }

    try {
      const finalConfig = { ...CHART_CONFIGS.WEIGHT_TREND, ...config };
      return weightTransformer(records, finalConfig);
    } catch (err) {
      console.error('Error transforming weight data:', err);
      return null;
    }
  }, [records, config]);

  return {
    chartData,
    loading,
    error: error || (chartData === null && records.length > 0 ? 'データの変換に失敗しました' : null),
    isEmpty: !records || records.length === 0,
  };
}
