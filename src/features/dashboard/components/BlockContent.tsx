import { ChartBlock } from '../../analytics/components/ui/ChartBlock';
import { BaseChart } from '../../analytics/components/charts/BaseChart';
import { WeightTrendChart } from '../../analytics/components/charts/WeightTrendChart';
import { VolumeTrendChart } from '../../analytics/components/charts/VolumeTrendChart';
import { useWeightChart } from '../../analytics/hooks/useWeightChart';
import { useVolumeChart } from '../../analytics/hooks/useVolumeChart';
import { usePFCChart } from '../../analytics/hooks/usePFCChart';
import { useCalorieChart } from '../../analytics/hooks/useCalorieChart';
import type { BlockType, BlockSize } from '../types';

interface BlockContentProps {
  type: BlockType;
  size: BlockSize;
  title?: string;
}

export function BlockContent({ type, size, title }: BlockContentProps) {
  switch (type) {
    case 'weight_trend':
      return <WeightTrendBlock size={size} title={title} />;
    case 'volume_trend':
      return <VolumeTrendBlock size={size} title={title} />;
    case 'calorie_trend':
      return <CalorieTrendBlock size={size} title={title} />;
    case 'pfc_trend':
      return <PFCTrendBlock size={size} title={title} />;
    case 'pfc_balance':
      return <PFCBalanceBlock size={size} title={title} />;
    default:
      return <EmptyBlock />;
  }
}

function WeightTrendBlock({
  size,
  title,
}: {
  size: BlockSize;
  title?: string;
}) {
  const weightChart = useWeightChart();

  return (
    <ChartBlock
      title={title || '体重推移'}
      size={size}
      loading={weightChart.loading}
      error={weightChart.error || undefined}
      isEmpty={weightChart.isEmpty}
    >
      {weightChart.chartData && (
        <div className="h-full">
          <WeightTrendChart data={weightChart.chartData} blockSize={size} height="100%" />
        </div>
      )}
    </ChartBlock>
  );
}

function VolumeTrendBlock({
  size,
  title,
}: {
  size: BlockSize;
  title?: string;
}) {
  const volumeChart = useVolumeChart();

  return (
    <ChartBlock
      title={title || 'トレーニングボリューム'}
      size={size}
      loading={volumeChart.loading}
      error={volumeChart.error || undefined}
      isEmpty={volumeChart.isEmpty}
    >
      {volumeChart.chartData && (
        <div className="h-full">
          <VolumeTrendChart data={volumeChart.chartData} blockSize={size} height="100%" />
        </div>
      )}
    </ChartBlock>
  );
}

function CalorieTrendBlock({
  size,
  title,
}: {
  size: BlockSize;
  title?: string;
}) {
  const calorieChart = useCalorieChart();

  return (
    <ChartBlock
      title={title || 'カロリー推移'}
      size={size}
      loading={calorieChart.loading}
      error={calorieChart.error || undefined}
      isEmpty={calorieChart.isEmpty}
    >
      {calorieChart.chartData && (
        <div className="h-full">
          <BaseChart data={calorieChart.chartData} blockSize={size} height="100%" />
        </div>
      )}
    </ChartBlock>
  );
}

function PFCTrendBlock({
  size,
  title,
}: {
  size: BlockSize;
  title?: string;
}) {
  const pfcChart = usePFCChart();

  return (
    <ChartBlock
      title={title || 'PFC推移'}
      size={size}
      loading={pfcChart.loading}
      error={pfcChart.error || undefined}
      isEmpty={pfcChart.isEmpty}
    >
      {pfcChart.chartData && (
        <div className="h-full">
          <BaseChart data={pfcChart.chartData} blockSize={size} height="100%" />
        </div>
      )}
    </ChartBlock>
  );
}

function PFCBalanceBlock({
  size,
  title,
}: {
  size: BlockSize;
  title?: string;
}) {
  const pfcChart = usePFCChart({ type: 'pie' });

  return (
    <ChartBlock
      title={title || 'PFCバランス'}
      size={size}
      loading={pfcChart.loading}
      error={pfcChart.error || undefined}
      isEmpty={pfcChart.isEmpty}
    >
      {pfcChart.chartData && (
        <div className="h-full">
          <BaseChart data={pfcChart.chartData} blockSize={size} height="100%" />
        </div>
      )}
    </ChartBlock>
  );
}

function EmptyBlock() {
  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-xl shadow-lg p-6 h-full flex items-center justify-center">
      <p className="text-gray-500 dark:text-gray-400">Unknown block type</p>
    </div>
  );
}
