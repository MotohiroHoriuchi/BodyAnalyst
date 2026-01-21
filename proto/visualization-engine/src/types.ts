// proto/visualization-engine/src/types.ts

// --- Data Model ---

/**
 * A single point of data flowing through the pipeline.
 * Normalized to decouple from domain entities.
 */
export interface DataPoint {
  /** Unique key representing time (Unix timestamp in milliseconds) */
  timestamp: number;
  /** Dynamic fields (weight, volume, etc.) */
  attributes: {
    [key: string]: number | string | null;
  };
  /** Origin information, etc. */
  metadata?: Record<string, any>;
}

/** The entire dataset flowing through the pipeline */
export type DataFrame = DataPoint[];

// --- Pipeline Interfaces ---

/**
 * Context object passed through the pipeline execution.
 * Can be used to store global metadata or config valid for the run.
 */
export interface PipelineContext {
  executionId: string;
  // Add other shared context if needed
}

/**
 * Source: Origin of data.
 * Fetches data and converts it into a DataFrame.
 */
export interface DataSource {
  fetch(context: PipelineContext): Promise<DataFrame>;
}

/**
 * Filter: Processor of data.
 * Transforms an input DataFrame into an output DataFrame.
 */
export interface DataFilter {
  execute(data: DataFrame, context: PipelineContext): Promise<DataFrame>;
}

/**
 * Sink: Consumer of data.
 * Converts DataFrame into a final output format (e.g., Recharts props).
 */
export interface DataSink<TOutput = any> {
  consume(data: DataFrame, context: PipelineContext): Promise<TOutput>;
}

// --- Configuration Types (for serialization) ---

export type FilterConfig = {
  type: string;
  params: Record<string, any>;
};

export interface PipelineConfig {
  sourceConfig: {
    type: string;
    params?: Record<string, any>;
  };
  filterConfigs: FilterConfig[];
  sinkConfig?: {
    type: string;
    params?: Record<string, any>;
  };
}
