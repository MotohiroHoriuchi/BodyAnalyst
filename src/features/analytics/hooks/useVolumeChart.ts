import { useMemo } from 'react';
import { useWorkout } from '../../workout/hooks/useWorkout';
import { volumeTransformer } from '../engine/transformers/volumeTransformer';
import { CHART_CONFIGS } from './useChartConfig';
import type { VisConfig } from '../engine/types';

export function useVolumeChart(config?: Partial<VisConfig>) {
  const { sessions, loading, error } = useWorkout();

  const chartData = useMemo(() => {
    if (!sessions || sessions.length === 0) {
      return null;
    }

    try {
      const finalConfig = { ...CHART_CONFIGS.VOLUME_TREND, ...config };
      return volumeTransformer(sessions, finalConfig);
    } catch (err) {
      console.error('Error transforming volume data:', err);
      return null;
    }
  }, [sessions, config]);

  return {
    chartData,
    loading,
    error: error || (chartData === null && sessions.length > 0 ? 'データの変換に失敗しました' : null),
    isEmpty: !sessions || sessions.length === 0,
  };
}
