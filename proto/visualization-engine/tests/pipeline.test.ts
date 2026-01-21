// proto/visualization-engine/tests/pipeline.test.ts
import { describe, it, expect } from 'vitest';
import { PipelineEngine } from '../src/Pipeline';
import { MockDataSource } from '../src/sources/MockDataSource';
import { RechartsSink } from '../src/sinks/RechartsSink';
import { ArithmeticFilter } from '../src/filters/ArithmeticFilter';
import { MovingAverageFilter } from '../src/filters/MovingAverageFilter';
import { DataFrame } from '../src/types';

describe('Visualization Engine Prototype', () => {
  // Setup Mock Data
  // Day 1: 70kg, BP 60kg
  // Day 2: 71kg, BP 65kg
  // Day 3: 72kg, BP 70kg
  // Day 4: 70kg, BP 70kg
  // Day 5: 69kg, BP 75kg
  const baseTime = new Date('2024-01-01').getTime();
  const day = 86400000;

  const rawData: DataFrame = [
    { timestamp: baseTime, attributes: { body_weight: 70, bench_press: 60 } },
    { timestamp: baseTime + day, attributes: { body_weight: 71, bench_press: 65 } },
    { timestamp: baseTime + day * 2, attributes: { body_weight: 72, bench_press: 70 } },
    { timestamp: baseTime + day * 3, attributes: { body_weight: 70, bench_press: 70 } },
    { timestamp: baseTime + day * 4, attributes: { body_weight: 69, bench_press: 75 } },
  ];

  it('should execute a pipeline with arithmetic and moving average filters', async () => {
    // 1. Setup Source & Sink
    const source = new MockDataSource(rawData);
    const sink = new RechartsSink({
      xAxisKey: 'dateString',
      series: [
        { dataKey: 'body_weight' },
        { dataKey: 'weight_ratio' },
        { dataKey: 'ma_weight' }
      ]
    });

    // 2. Setup Engine
    const engine = new PipelineEngine(source, sink);

    // 3. Add Filters
    
    // Filter A: Calculate Weight Ratio (Bench Press / Body Weight)
    engine.addFilter(new ArithmeticFilter({
      targetField: 'weight_ratio',
      operation: 'divide',
      operandA: 'bench_press',
      operandB: 'body_weight'
    }));

    // Filter B: Calculate 3-Day Moving Average of Body Weight
    engine.addFilter(new MovingAverageFilter('body_weight', 'ma_weight', 3));

    // 4. Execute
    const result = await engine.execute();

    // 5. Verify Results
    const data = result.data;
    
    expect(data).toHaveLength(5);

    // Check Arithmetic (Day 1)
    // 60 / 70 = 0.857...
    expect(data[0].weight_ratio).toBeCloseTo(0.857, 3);

    // Check Arithmetic (Day 5)
    // 75 / 69 = 1.0869... -> 1.087
    expect(data[4].weight_ratio).toBeCloseTo(1.087, 3);

    // Check Moving Average
    // Day 1 (Window: [70]) -> 70
    expect(data[0].ma_weight).toBe(70);
    
    // Day 2 (Window: [70, 71]) -> 70.5
    expect(data[1].ma_weight).toBe(70.5);

    // Day 3 (Window: [70, 71, 72]) -> 71
    expect(data[2].ma_weight).toBe(71);

    // Day 4 (Window: [71, 72, 70]) -> 71
    expect(data[3].ma_weight).toBe(71);
    
    // Day 5 (Window: [72, 70, 69]) -> 70.333...
    expect(data[4].ma_weight).toBeCloseTo(70.333, 3);

    // Check Sink Formatting
    expect(data[0].dateString).toBe('2024-01-01');
  });
});
