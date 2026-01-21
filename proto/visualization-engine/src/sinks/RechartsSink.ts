// proto/visualization-engine/src/sinks/RechartsSink.ts
import { DataSink, DataFrame, PipelineContext } from '../types';

export interface RechartsConfig {
  xAxisKey: string;
  series: {
    dataKey: string;
    name?: string;
    color?: string;
  }[];
}

export interface RechartsOutput {
  data: any[];
  xAxis: { dataKey: string };
  series: any[];
}

export class RechartsSink implements DataSink<RechartsOutput> {
  constructor(private config: RechartsConfig) {}

  async consume(data: DataFrame, _context: PipelineContext): Promise<RechartsOutput> {
    const formattedData = data.map(point => {
      const row: any = { ...point.attributes };
      
      // Handle timestamp formatting if the x-axis key is 'date' or 'timestamp'
      // For this prototype, we'll just inject a formatted date string if needed
      if (this.config.xAxisKey === 'dateString') {
        row['dateString'] = new Date(point.timestamp).toISOString().split('T')[0];
      } else {
        // Assume the key exists in attributes or use timestamp
        if (!row[this.config.xAxisKey] && this.config.xAxisKey === 'timestamp') {
             row['timestamp'] = point.timestamp;
        }
      }
      return row;
    });

    return {
      data: formattedData,
      xAxis: { dataKey: this.config.xAxisKey },
      series: this.config.series,
    };
  }
}
