// proto/visualization-engine/src/filters/DateRangeFilter.ts
import { DataFilter, DataFrame, PipelineContext } from '../types';

export class DateRangeFilter implements DataFilter {
  constructor(
    private startDate: number,
    private endDate: number
  ) {}

  async execute(data: DataFrame, _context: PipelineContext): Promise<DataFrame> {
    return data.filter(point => 
      point.timestamp >= this.startDate && point.timestamp <= this.endDate
    );
  }
}
