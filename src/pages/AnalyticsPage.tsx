import { ChartBlock } from '../features/analytics/components/ui/ChartBlock';
import { BaseChart } from '../features/analytics/components/charts/BaseChart';
import { WeightTrendChart } from '../features/analytics/components/charts/WeightTrendChart';
import { VolumeTrendChart } from '../features/analytics/components/charts/VolumeTrendChart';
import { DashboardGrid } from '../features/analytics/components/DashboardGrid';
import { useWeightChart } from '../features/analytics/hooks/useWeightChart';
import { useVolumeChart } from '../features/analytics/hooks/useVolumeChart';
import { usePFCChart } from '../features/analytics/hooks/usePFCChart';
import { useCalorieChart } from '../features/analytics/hooks/useCalorieChart';

export function AnalyticsPage() {
  const weightChart = useWeightChart();
  const volumeChart = useVolumeChart();
  const pfcChart = usePFCChart();
  const calorieChart = useCalorieChart();

  return (
    <DashboardGrid>
      {/* Weight Trend Block */}
      <ChartBlock
        title="体重推移"
        size="2x1"
        loading={weightChart.loading}
        error={weightChart.error || undefined}
        isEmpty={weightChart.isEmpty}
      >
        {weightChart.chartData && (
          <WeightTrendChart data={weightChart.chartData} blockSize="2x1" height={280} />
        )}
      </ChartBlock>

      {/* Volume Trend Block */}
      <ChartBlock
        title="トレーニングボリューム"
        size="2x1"
        loading={volumeChart.loading}
        error={volumeChart.error || undefined}
        isEmpty={volumeChart.isEmpty}
      >
        {volumeChart.chartData && (
          <VolumeTrendChart data={volumeChart.chartData} blockSize="2x1" height={280} />
        )}
      </ChartBlock>

      {/* Calorie Trend Block */}
      <ChartBlock
        title="カロリー推移"
        size="2x1"
        loading={calorieChart.loading}
        error={calorieChart.error || undefined}
        isEmpty={calorieChart.isEmpty}
      >
        {calorieChart.chartData && (
          <BaseChart data={calorieChart.chartData} blockSize="2x1" height={280} />
        )}
      </ChartBlock>

      {/* PFC Trend Block */}
      <ChartBlock
        title="PFC推移"
        size="2x1"
        loading={pfcChart.loading}
        error={pfcChart.error || undefined}
        isEmpty={pfcChart.isEmpty}
      >
        {pfcChart.chartData && (
          <BaseChart data={pfcChart.chartData} blockSize="2x1" height={280} />
        )}
      </ChartBlock>
    </DashboardGrid>
  );
}
