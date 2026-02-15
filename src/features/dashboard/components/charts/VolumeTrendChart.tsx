import { BaseChart } from './BaseChart';
import type { RechartsProps } from '../../engine/types';

interface VolumeTrendChartProps {
  data: RechartsProps;
  blockSize?: '1x1' | '2x1' | '2x2';
  height?: number | string;
}

export function VolumeTrendChart({ data, blockSize = '2x1', height }: VolumeTrendChartProps) {
  return <BaseChart data={data} blockSize={blockSize} height={height} />;
}
