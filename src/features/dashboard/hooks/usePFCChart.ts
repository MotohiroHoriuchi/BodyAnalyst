import { useMemo } from 'react';
import { useMeal } from '../../meal/hooks/useMeal';
import { pfcTransformer } from '../engine/transformers/pfcTransformer';
import { CHART_CONFIGS } from './useChartConfig';
import type { VisConfig } from '../engine/types';

export function usePFCChart(config?: Partial<VisConfig>) {
  const { records, loading, error } = useMeal();

  const chartData = useMemo(() => {
    if (!records || records.length === 0) {
      return null;
    }

    try {
      const finalConfig = { ...CHART_CONFIGS.PFC_BALANCE, ...config };
      return pfcTransformer(records, finalConfig);
    } catch (err) {
      console.error('Error transforming PFC data:', err);
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
