// proto/visualization-engine/tests/text-analysis-pipeline.test.ts
// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { PipelineEngine } from '../src/Pipeline';
import { MockDataSource } from '../src/sources/MockDataSource';
import { TokenizerFilter } from '../src/filters/TokenizerFilter';
import { NetworkGraphSink, NetworkGraphOutput } from '../src/sinks/NetworkGraphSink';
import { DataFrame } from '../src/types';

describe('Text Analysis Pipeline (Integration)', () => {
  // Simulate workout notes with free text
  const baseTime = new Date('2024-01-01').getTime();
  const day = 86400000;

  const rawData: DataFrame = [
    {
      timestamp: baseTime,
      attributes: {
        workout_note: '今日は腰痛があったがスクワットは好調',
        exercise: 'スクワット',
        performance: '好調',
      },
    },
    {
      timestamp: baseTime + day,
      attributes: {
        workout_note: '肩こりが気になる ベンチプレスで腰痛',
        exercise: 'ベンチプレス',
        performance: '不調',
      },
    },
    {
      timestamp: baseTime + day * 2,
      attributes: {
        workout_note: 'カフェイン摂取後 集中力が高い ベンチプレスPR更新',
        exercise: 'ベンチプレス',
        performance: '好調',
      },
    },
    {
      timestamp: baseTime + day * 3,
      attributes: {
        workout_note: '腰痛は回復 デッドリフトも好調',
        exercise: 'デッドリフト',
        performance: '好調',
      },
    },
  ];

  it('should produce a network graph from workout notes using whitespace tokenization', async () => {
    const source = new MockDataSource(rawData);
    const sink = new NetworkGraphSink({
      tokenField: 'note_tokens',
      attributeFields: ['exercise', 'performance'],
    });

    const engine = new PipelineEngine<NetworkGraphOutput>(source, sink);

    engine.addFilter(
      new TokenizerFilter({
        sourceField: 'workout_note',
        targetField: 'note_tokens',
        method: 'whitespace',
        minTokenLength: 2, // Filter out single-char particles
      })
    );

    const result = await engine.execute();

    // Verify nodes exist
    expect(result.nodes.length).toBeGreaterThan(0);
    expect(result.links.length).toBeGreaterThan(0);

    // Check that token nodes have group "token"
    const tokenNodes = result.nodes.filter((n) => n.group === 'token');
    expect(tokenNodes.length).toBeGreaterThan(0);

    // Check that exercise attribute nodes exist
    const exerciseNodes = result.nodes.filter((n) => n.group === 'exercise');
    expect(exerciseNodes.length).toBeGreaterThan(0);

    const exerciseNames = exerciseNodes.map((n) => n.id);
    expect(exerciseNames).toContain('スクワット');
    expect(exerciseNames).toContain('ベンチプレス');
    expect(exerciseNames).toContain('デッドリフト');

    // Check performance attribute nodes
    const perfNodes = result.nodes.filter((n) => n.group === 'performance');
    expect(perfNodes.length).toBeGreaterThan(0);
    const perfNames = perfNodes.map((n) => n.id);
    expect(perfNames).toContain('好調');
    expect(perfNames).toContain('不調');

    // "好調" appears in 3 records → size=3
    const goodPerfNode = result.nodes.find((n) => n.id === '好調');
    expect(goodPerfNode!.size).toBe(3);

    // "ベンチプレス" appears in 2 records → size=2
    const benchNode = result.nodes.find((n) => n.id === 'ベンチプレス');
    expect(benchNode!.size).toBe(2);
  });

  it('should produce a network graph using hashtag tokenization', async () => {
    const hashtagData: DataFrame = [
      {
        timestamp: baseTime,
        attributes: {
          workout_note: '#腰痛 あったが #スクワット は #好調',
          exercise: 'スクワット',
        },
      },
      {
        timestamp: baseTime + day,
        attributes: {
          workout_note: '#肩こり が気になる #ベンチプレス で #腰痛',
          exercise: 'ベンチプレス',
        },
      },
    ];

    const source = new MockDataSource(hashtagData);
    const sink = new NetworkGraphSink({
      tokenField: 'tags',
      attributeFields: ['exercise'],
    });

    const engine = new PipelineEngine<NetworkGraphOutput>(source, sink);

    engine.addFilter(
      new TokenizerFilter({
        sourceField: 'workout_note',
        targetField: 'tags',
        method: 'hashtag',
      })
    );

    const result = await engine.execute();

    // Verify all expected nodes exist (regardless of group)
    const allNodeIds = result.nodes.map((n) => n.id);
    expect(allNodeIds).toContain('腰痛');
    expect(allNodeIds).toContain('スクワット');
    expect(allNodeIds).toContain('好調');
    expect(allNodeIds).toContain('肩こり');
    expect(allNodeIds).toContain('ベンチプレス');

    // "スクワット" and "ベンチプレス" appear as both tokens and attributes,
    // so their group should be promoted to the attribute field name
    const squatNode = result.nodes.find((n) => n.id === 'スクワット');
    expect(squatNode!.group).toBe('exercise');
    const benchNode = result.nodes.find((n) => n.id === 'ベンチプレス');
    expect(benchNode!.group).toBe('exercise');

    // Pure token nodes should keep group "token"
    const backPainNode = result.nodes.find((n) => n.id === '腰痛');
    expect(backPainNode!.group).toBe('token');
    expect(backPainNode!.size).toBe(2);

    // Co-occurrence: "腰痛" and "スクワット" appear together in record 1
    const findLink = (a: string, b: string) =>
      result.links.find(
        (l) =>
          (l.source === a && l.target === b) ||
          (l.source === b && l.target === a)
      );

    // "腰痛" and "スクワット" co-occur as tokens AND as token-to-attribute → weight=2
    const backPainSquatLink = findLink('腰痛', 'スクワット');
    expect(backPainSquatLink).toBeDefined();
    expect(backPainSquatLink!.weight).toBe(2);
  });

  it('should produce a network graph using segmenter tokenization', async () => {
    const source = new MockDataSource(rawData);
    const sink = new NetworkGraphSink({
      tokenField: 'note_tokens',
    });

    const engine = new PipelineEngine<NetworkGraphOutput>(source, sink);

    engine.addFilter(
      new TokenizerFilter({
        sourceField: 'workout_note',
        targetField: 'note_tokens',
        method: 'segmenter',
        minTokenLength: 2,
        excludeTokens: ['今日', 'あった', 'できた'],
      })
    );

    const result = await engine.execute();

    // Verify the pipeline produces a non-trivial graph
    expect(result.nodes.length).toBeGreaterThan(3);
    expect(result.links.length).toBeGreaterThan(0);

    // All nodes should have positive size
    for (const node of result.nodes) {
      expect(node.size).toBeGreaterThan(0);
    }

    // All links should have positive weight
    for (const link of result.links) {
      expect(link.weight).toBeGreaterThan(0);
    }
  });
});
