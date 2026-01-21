// proto/visualization-engine/src/sources/MockDataSource.ts
import { DataSource, DataFrame, PipelineContext } from '../types';

export class MockDataSource implements DataSource {
  constructor(private data: DataFrame) {}

  async fetch(_context: PipelineContext): Promise<DataFrame> {
    // Return a deep copy to ensure isolation
    return JSON.parse(JSON.stringify(this.data));
  }
}
