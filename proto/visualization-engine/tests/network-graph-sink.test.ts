// proto/visualization-engine/tests/network-graph-sink.test.ts
// @vitest-environment node
import { describe, it, expect } from 'vitest';
import {
  NetworkGraphSink,
  NetworkGraphConfig,
  NetworkGraphOutput,
} from '../src/sinks/NetworkGraphSink';
import { DataFrame, PipelineContext } from '../src/types';

const ctx: PipelineContext = { executionId: 'test-graph' };

describe('NetworkGraphSink', () => {
  describe('node generation', () => {
    it('should create nodes from unique tokens', async () => {
      const config: NetworkGraphConfig = {
        tokenField: 'tokens',
      };

      const data: DataFrame = [
        { timestamp: 1, attributes: { tokens: ['腰痛', '肩こり'] } },
        { timestamp: 2, attributes: { tokens: ['腰痛', '膝痛'] } },
      ];

      const sink = new NetworkGraphSink(config);
      const result = await sink.consume(data, ctx);

      expect(result.nodes).toHaveLength(3);

      const nodeIds = result.nodes.map((n) => n.id);
      expect(nodeIds).toContain('腰痛');
      expect(nodeIds).toContain('肩こり');
      expect(nodeIds).toContain('膝痛');
    });

    it('should set node size based on frequency', async () => {
      const config: NetworkGraphConfig = {
        tokenField: 'tokens',
      };

      const data: DataFrame = [
        { timestamp: 1, attributes: { tokens: ['腰痛', '肩こり'] } },
        { timestamp: 2, attributes: { tokens: ['腰痛', '膝痛'] } },
        { timestamp: 3, attributes: { tokens: ['腰痛'] } },
      ];

      const sink = new NetworkGraphSink(config);
      const result = await sink.consume(data, ctx);

      const backPainNode = result.nodes.find((n) => n.id === '腰痛');
      const shoulderNode = result.nodes.find((n) => n.id === '肩こり');

      expect(backPainNode!.size).toBe(3); // appears in 3 records
      expect(shoulderNode!.size).toBe(1); // appears in 1 record
    });

    it('should assign group "token" to token-derived nodes', async () => {
      const config: NetworkGraphConfig = {
        tokenField: 'tokens',
      };

      const data: DataFrame = [
        { timestamp: 1, attributes: { tokens: ['腰痛'] } },
      ];

      const sink = new NetworkGraphSink(config);
      const result = await sink.consume(data, ctx);

      expect(result.nodes[0].group).toBe('token');
    });
  });

  describe('link generation (token-to-token co-occurrence)', () => {
    it('should create links between tokens co-occurring in the same record', async () => {
      const config: NetworkGraphConfig = {
        tokenField: 'tokens',
      };

      const data: DataFrame = [
        { timestamp: 1, attributes: { tokens: ['腰痛', '肩こり', '疲労'] } },
      ];

      const sink = new NetworkGraphSink(config);
      const result = await sink.consume(data, ctx);

      // 3 tokens => C(3,2) = 3 links
      expect(result.links).toHaveLength(3);

      const linkPairs = result.links.map((l) => [l.source, l.target].sort().join('-'));
      expect(linkPairs).toContain('肩こり-腰痛');
      expect(linkPairs).toContain('疲労-腰痛');
      expect(linkPairs).toContain('疲労-肩こり');
    });

    it('should accumulate weight for repeated co-occurrences', async () => {
      const config: NetworkGraphConfig = {
        tokenField: 'tokens',
      };

      const data: DataFrame = [
        { timestamp: 1, attributes: { tokens: ['腰痛', '肩こり'] } },
        { timestamp: 2, attributes: { tokens: ['腰痛', '肩こり'] } },
        { timestamp: 3, attributes: { tokens: ['腰痛', '膝痛'] } },
      ];

      const sink = new NetworkGraphSink(config);
      const result = await sink.consume(data, ctx);

      const findLink = (a: string, b: string) =>
        result.links.find(
          (l) =>
            (l.source === a && l.target === b) ||
            (l.source === b && l.target === a)
        );

      const backShoulderLink = findLink('腰痛', '肩こり');
      const backKneeLink = findLink('腰痛', '膝痛');

      expect(backShoulderLink!.weight).toBe(2);
      expect(backKneeLink!.weight).toBe(1);
    });

    it('should not create self-links', async () => {
      const config: NetworkGraphConfig = {
        tokenField: 'tokens',
      };

      const data: DataFrame = [
        { timestamp: 1, attributes: { tokens: ['腰痛', '腰痛'] } },
      ];

      const sink = new NetworkGraphSink(config);
      const result = await sink.consume(data, ctx);

      expect(result.links).toHaveLength(0);
      // Node should exist with deduplicated count
      expect(result.nodes).toHaveLength(1);
    });
  });

  describe('attributeFields (token-to-attribute co-occurrence)', () => {
    it('should create nodes and links for string attribute fields', async () => {
      const config: NetworkGraphConfig = {
        tokenField: 'tokens',
        attributeFields: ['exercise'],
      };

      const data: DataFrame = [
        {
          timestamp: 1,
          attributes: {
            tokens: ['腰痛'],
            exercise: 'スクワット',
          },
        },
      ];

      const sink = new NetworkGraphSink(config);
      const result = await sink.consume(data, ctx);

      // Nodes: "腰痛" (token) + "スクワット" (attribute)
      expect(result.nodes).toHaveLength(2);

      const exerciseNode = result.nodes.find((n) => n.id === 'スクワット');
      expect(exerciseNode!.group).toBe('exercise');

      // Link between token and attribute value
      expect(result.links).toHaveLength(1);
      const link = result.links[0];
      expect([link.source, link.target].sort()).toEqual(['スクワット', '腰痛']);
    });

    it('should handle multiple attribute fields', async () => {
      const config: NetworkGraphConfig = {
        tokenField: 'tokens',
        attributeFields: ['exercise', 'bodypart'],
      };

      const data: DataFrame = [
        {
          timestamp: 1,
          attributes: {
            tokens: ['腰痛'],
            exercise: 'スクワット',
            bodypart: '脚',
          },
        },
      ];

      const sink = new NetworkGraphSink(config);
      const result = await sink.consume(data, ctx);

      // Nodes: "腰痛", "スクワット", "脚"
      expect(result.nodes).toHaveLength(3);
      // Links: 腰痛-スクワット, 腰痛-脚
      expect(result.links).toHaveLength(2);
    });

    it('should prioritize attribute group over token group for same value', async () => {
      const config: NetworkGraphConfig = {
        tokenField: 'tokens',
        attributeFields: ['exercise'],
      };

      // "スクワット" appears as both a token and an attribute value
      const data: DataFrame = [
        {
          timestamp: 1,
          attributes: {
            tokens: ['スクワット', '腰痛'],
            exercise: 'スクワット',
          },
        },
      ];

      const sink = new NetworkGraphSink(config);
      const result = await sink.consume(data, ctx);

      // "スクワット" should have group "exercise" (attribute takes priority)
      const squatNode = result.nodes.find((n) => n.id === 'スクワット');
      expect(squatNode!.group).toBe('exercise');
    });

    it('should skip numeric and null attribute values', async () => {
      const config: NetworkGraphConfig = {
        tokenField: 'tokens',
        attributeFields: ['exercise', 'weight'],
      };

      const data: DataFrame = [
        {
          timestamp: 1,
          attributes: {
            tokens: ['腰痛'],
            exercise: 'デッドリフト',
            weight: 80, // numeric - should be skipped
          },
        },
      ];

      const sink = new NetworkGraphSink(config);
      const result = await sink.consume(data, ctx);

      // Only token + string attribute nodes
      expect(result.nodes).toHaveLength(2);
      expect(result.links).toHaveLength(1);
    });
  });

  describe('edge cases', () => {
    it('should handle empty data', async () => {
      const config: NetworkGraphConfig = {
        tokenField: 'tokens',
      };

      const sink = new NetworkGraphSink(config);
      const result = await sink.consume([], ctx);

      expect(result.nodes).toEqual([]);
      expect(result.links).toEqual([]);
    });

    it('should handle data points with empty token arrays', async () => {
      const config: NetworkGraphConfig = {
        tokenField: 'tokens',
      };

      const data: DataFrame = [
        { timestamp: 1, attributes: { tokens: [] } },
        { timestamp: 2, attributes: { tokens: [] } },
      ];

      const sink = new NetworkGraphSink(config);
      const result = await sink.consume(data, ctx);

      expect(result.nodes).toEqual([]);
      expect(result.links).toEqual([]);
    });

    it('should handle data points with missing token field', async () => {
      const config: NetworkGraphConfig = {
        tokenField: 'tokens',
      };

      const data: DataFrame = [
        { timestamp: 1, attributes: { note: 'some text' } },
      ];

      const sink = new NetworkGraphSink(config);
      const result = await sink.consume([], ctx);

      expect(result.nodes).toEqual([]);
      expect(result.links).toEqual([]);
    });

    it('should handle single-token records (no links)', async () => {
      const config: NetworkGraphConfig = {
        tokenField: 'tokens',
      };

      const data: DataFrame = [
        { timestamp: 1, attributes: { tokens: ['腰痛'] } },
      ];

      const sink = new NetworkGraphSink(config);
      const result = await sink.consume(data, ctx);

      expect(result.nodes).toHaveLength(1);
      expect(result.links).toHaveLength(0);
    });
  });

  describe('output structure', () => {
    it('should include label matching id for nodes', async () => {
      const config: NetworkGraphConfig = {
        tokenField: 'tokens',
      };

      const data: DataFrame = [
        { timestamp: 1, attributes: { tokens: ['腰痛'] } },
      ];

      const sink = new NetworkGraphSink(config);
      const result = await sink.consume(data, ctx);

      expect(result.nodes[0]).toEqual({
        id: '腰痛',
        label: '腰痛',
        size: 1,
        group: 'token',
      });
    });
  });
});
