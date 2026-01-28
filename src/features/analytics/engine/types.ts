// Visualization Engine Type Definitions

export type ChartType = 'line' | 'bar' | 'area' | 'pie';

export type TimeGrouping = 'day' | 'week' | 'month';

export interface DateRange {
  start: Date;
  end: Date;
}

export interface VisConfig {
  type: ChartType;
  title?: string;
  grouping?: TimeGrouping;
  range?: DateRange;
  mapping: {
    x: string;
    y: string | string[];
  };
  colors?: string[];
}

export interface ChartDataPoint {
  [key: string]: any;
}

export interface RechartsProps {
  data: ChartDataPoint[];
  xAxis: {
    dataKey: string;
    tickFormatter?: (value: any) => string;
    label?: string;
  };
  yAxis: {
    domain?: [number | 'auto', number | 'auto'];
    tickFormatter?: (value: any) => string;
    label?: string;
  };
  series: Array<{
    type: ChartType;
    dataKey: string;
    name?: string;
    color: string;
    fill?: string;
  }>;
}

export type TransformFn<T> = (data: T[], config: VisConfig) => RechartsProps;
