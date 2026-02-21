// proto/visualization-engine/tests/tokenizer-filter.test.ts
// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { TokenizerFilter, TokenizerConfig } from '../src/filters/TokenizerFilter';
import { DataFrame, PipelineContext } from '../src/types';

const ctx: PipelineContext = { executionId: 'test-tokenizer' };

describe('TokenizerFilter', () => {
  describe('whitespace method', () => {
    const config: TokenizerConfig = {
      sourceField: 'note',
      targetField: 'tokens',
      method: 'whitespace',
    };

    it('should split text by whitespace and commas', async () => {
      const data: DataFrame = [
        { timestamp: 1, attributes: { note: '腰痛 肩こり 集中力高' } },
      ];

      const filter = new TokenizerFilter(config);
      const result = await filter.execute(data, ctx);

      expect(result[0].attributes.tokens).toEqual(['腰痛', '肩こり', '集中力高']);
    });

    it('should handle comma-separated values', async () => {
      const data: DataFrame = [
        { timestamp: 1, attributes: { note: '膝痛,腰痛, 肩こり' } },
      ];

      const filter = new TokenizerFilter(config);
      const result = await filter.execute(data, ctx);

      expect(result[0].attributes.tokens).toEqual(['膝痛', '腰痛', '肩こり']);
    });

    it('should produce empty array for empty string', async () => {
      const data: DataFrame = [
        { timestamp: 1, attributes: { note: '' } },
      ];

      const filter = new TokenizerFilter(config);
      const result = await filter.execute(data, ctx);

      expect(result[0].attributes.tokens).toEqual([]);
    });

    it('should produce empty array when source field is null', async () => {
      const data: DataFrame = [
        { timestamp: 1, attributes: { note: null } },
      ];

      const filter = new TokenizerFilter(config);
      const result = await filter.execute(data, ctx);

      expect(result[0].attributes.tokens).toEqual([]);
    });

    it('should produce empty array when source field is missing', async () => {
      const data: DataFrame = [
        { timestamp: 1, attributes: {} },
      ];

      const filter = new TokenizerFilter(config);
      const result = await filter.execute(data, ctx);

      expect(result[0].attributes.tokens).toEqual([]);
    });

    it('should preserve other attributes', async () => {
      const data: DataFrame = [
        { timestamp: 1, attributes: { note: '腰痛 肩こり', body_weight: 70 } },
      ];

      const filter = new TokenizerFilter(config);
      const result = await filter.execute(data, ctx);

      expect(result[0].attributes.body_weight).toBe(70);
      expect(result[0].attributes.note).toBe('腰痛 肩こり');
    });
  });

  describe('hashtag method', () => {
    const config: TokenizerConfig = {
      sourceField: 'note',
      targetField: 'tags',
      method: 'hashtag',
    };

    it('should extract hashtags from text', async () => {
      const data: DataFrame = [
        { timestamp: 1, attributes: { note: '今日は #腰痛 があったが #PR更新 できた' } },
      ];

      const filter = new TokenizerFilter(config);
      const result = await filter.execute(data, ctx);

      expect(result[0].attributes.tags).toEqual(['腰痛', 'PR更新']);
    });

    it('should handle multiple hashtags including English', async () => {
      const data: DataFrame = [
        { timestamp: 1, attributes: { note: '#BenchPress #カフェイン #集中力高' } },
      ];

      const filter = new TokenizerFilter(config);
      const result = await filter.execute(data, ctx);

      expect(result[0].attributes.tags).toEqual(['BenchPress', 'カフェイン', '集中力高']);
    });

    it('should return empty array when no hashtags', async () => {
      const data: DataFrame = [
        { timestamp: 1, attributes: { note: '普通のメモです' } },
      ];

      const filter = new TokenizerFilter(config);
      const result = await filter.execute(data, ctx);

      expect(result[0].attributes.tags).toEqual([]);
    });
  });

  describe('segmenter method', () => {
    const config: TokenizerConfig = {
      sourceField: 'note',
      targetField: 'tokens',
      method: 'segmenter',
    };

    it('should segment Japanese text into words', async () => {
      const data: DataFrame = [
        { timestamp: 1, attributes: { note: '今日は膝が痛い' } },
      ];

      const filter = new TokenizerFilter(config);
      const result = await filter.execute(data, ctx);

      const tokens = result[0].attributes.tokens as string[];
      // Intl.Segmenter should split into word-like segments
      expect(tokens.length).toBeGreaterThan(1);
      expect(tokens).toContain('今日');
      expect(tokens).toContain('膝');
      expect(tokens).toContain('痛い');
    });

    it('should handle mixed Japanese and English text', async () => {
      const data: DataFrame = [
        { timestamp: 1, attributes: { note: 'ベンチプレスでPR更新した' } },
      ];

      const filter = new TokenizerFilter(config);
      const result = await filter.execute(data, ctx);

      const tokens = result[0].attributes.tokens as string[];
      expect(tokens.length).toBeGreaterThan(1);
    });
  });

  describe('minTokenLength option', () => {
    it('should filter out tokens shorter than minTokenLength', async () => {
      const config: TokenizerConfig = {
        sourceField: 'note',
        targetField: 'tokens',
        method: 'whitespace',
        minTokenLength: 2,
      };

      const data: DataFrame = [
        { timestamp: 1, attributes: { note: '腰痛 あ 肩こり い 集中力高' } },
      ];

      const filter = new TokenizerFilter(config);
      const result = await filter.execute(data, ctx);

      expect(result[0].attributes.tokens).toEqual(['腰痛', '肩こり', '集中力高']);
    });
  });

  describe('excludeTokens option', () => {
    it('should exclude specified tokens', async () => {
      const config: TokenizerConfig = {
        sourceField: 'note',
        targetField: 'tokens',
        method: 'whitespace',
        excludeTokens: ['は', 'の', 'が'],
      };

      const data: DataFrame = [
        { timestamp: 1, attributes: { note: '腰痛 は 肩こり が 辛い' } },
      ];

      const filter = new TokenizerFilter(config);
      const result = await filter.execute(data, ctx);

      expect(result[0].attributes.tokens).toEqual(['腰痛', '肩こり', '辛い']);
    });
  });

  describe('combined options', () => {
    it('should apply both minTokenLength and excludeTokens', async () => {
      const config: TokenizerConfig = {
        sourceField: 'note',
        targetField: 'tokens',
        method: 'whitespace',
        minTokenLength: 2,
        excludeTokens: ['肩こり'],
      };

      const data: DataFrame = [
        { timestamp: 1, attributes: { note: '腰痛 あ 肩こり 集中力高' } },
      ];

      const filter = new TokenizerFilter(config);
      const result = await filter.execute(data, ctx);

      expect(result[0].attributes.tokens).toEqual(['腰痛', '集中力高']);
    });
  });

  describe('immutability', () => {
    it('should not mutate the original data', async () => {
      const config: TokenizerConfig = {
        sourceField: 'note',
        targetField: 'tokens',
        method: 'whitespace',
      };

      const data: DataFrame = [
        { timestamp: 1, attributes: { note: '腰痛 肩こり' } },
      ];

      const originalAttributes = { ...data[0].attributes };
      const filter = new TokenizerFilter(config);
      await filter.execute(data, ctx);

      expect(data[0].attributes).toEqual(originalAttributes);
      expect(data[0].attributes).not.toHaveProperty('tokens');
    });
  });

  describe('multiple data points', () => {
    it('should process all data points independently', async () => {
      const config: TokenizerConfig = {
        sourceField: 'note',
        targetField: 'tokens',
        method: 'whitespace',
      };

      const data: DataFrame = [
        { timestamp: 1, attributes: { note: '腰痛' } },
        { timestamp: 2, attributes: { note: '肩こり 膝痛' } },
        { timestamp: 3, attributes: { note: null } },
      ];

      const filter = new TokenizerFilter(config);
      const result = await filter.execute(data, ctx);

      expect(result).toHaveLength(3);
      expect(result[0].attributes.tokens).toEqual(['腰痛']);
      expect(result[1].attributes.tokens).toEqual(['肩こり', '膝痛']);
      expect(result[2].attributes.tokens).toEqual([]);
    });
  });
});
