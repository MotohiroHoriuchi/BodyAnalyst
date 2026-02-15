import { useState, useEffect, useMemo } from 'react';
import { useWorkout } from '../../workout/hooks/useWorkout';
import { transformWorkoutSessionsToDataFrame } from '../engine/transformers/workoutMemoTransformer';
import { PipelineEngine } from '../../../../proto/visualization-engine/src/Pipeline';
import { MockDataSource } from '../../../../proto/visualization-engine/src/sources/MockDataSource';
import { TokenizerFilter } from '../../../../proto/visualization-engine/src/filters/TokenizerFilter';
import {
  NetworkGraphSink,
  type NetworkGraphOutput,
} from '../../../../proto/visualization-engine/src/sinks/NetworkGraphSink';

export function useWorkoutMemoNetwork() {
  const { sessions, loading: sessionsLoading, error: sessionsError } = useWorkout();
  const [graphOutput, setGraphOutput] = useState<NetworkGraphOutput | null>(null);
  const [pipelineError, setPipelineError] = useState<string | null>(null);
  const [pipelineLoading, setPipelineLoading] = useState(false);

  const dataFrame = useMemo(
    () => transformWorkoutSessionsToDataFrame(sessions),
    [sessions]
  );

  useEffect(() => {
    if (dataFrame.length === 0) {
      setGraphOutput(null);
      return;
    }

    let cancelled = false;

    const runPipeline = async () => {
      setPipelineLoading(true);
      setPipelineError(null);

      try {
        const source = new MockDataSource(dataFrame);
        const sink = new NetworkGraphSink({
          tokenField: 'tokens',
        });

        const pipeline = new PipelineEngine<NetworkGraphOutput>(source, sink);
        pipeline.addFilter(
          new TokenizerFilter({
            sourceField: 'notes',
            targetField: 'tokens',
            method: 'whitespace',
            minTokenLength: 2,
          })
        );

        const result = await pipeline.execute();
        if (!cancelled) {
          setGraphOutput(result);
        }
      } catch (err) {
        if (!cancelled) {
          setPipelineError(
            err instanceof Error ? err.message : 'パイプライン実行エラー'
          );
        }
      } finally {
        if (!cancelled) {
          setPipelineLoading(false);
        }
      }
    };

    runPipeline();

    return () => {
      cancelled = true;
    };
  }, [dataFrame]);

  return {
    graphOutput,
    loading: sessionsLoading || pipelineLoading,
    error: sessionsError || pipelineError,
    isEmpty: !sessionsLoading && dataFrame.length === 0,
  };
}
