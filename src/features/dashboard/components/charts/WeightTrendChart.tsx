import { BaseChart } from './BaseChart';
import type { RechartsProps } from '../../engine/types';

interface WeightTrendChartProps {
  data: RechartsProps;
  blockSize?: '1x1' | '2x1' | '2x2';
  height?: number | string;
}

export function WeightTrendChart({ data, blockSize = '2x1', height }: WeightTrendChartProps) {
  return <BaseChart data={data} blockSize={blockSize} height={height} />;
}
