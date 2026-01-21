// proto/visualization-engine/src/Pipeline.ts
import { DataFrame, DataFilter, DataSource, DataSink, PipelineContext } from './types';

export class PipelineEngine<TOutput = any> {
  private source: DataSource;
  private filters: DataFilter[] = [];
  private sink: DataSink<TOutput>;

  constructor(source: DataSource, sink: DataSink<TOutput>) {
    this.source = source;
    this.sink = sink;
  }

  public addFilter(filter: DataFilter): this {
    this.filters.push(filter);
    return this;
  }

  public async execute(context?: Partial<PipelineContext>): Promise<TOutput> {
    const pipelineContext: PipelineContext = {
      executionId: crypto.randomUUID(),
      ...context,
    };

    // 1. Fetch Data
    let data: DataFrame = await this.source.fetch(pipelineContext);

    // 2. Apply Filters
    for (const filter of this.filters) {
      data = await filter.execute(data, pipelineContext);
    }

    // 3. Sink (Format)
    return this.sink.consume(data, pipelineContext);
  }
}
