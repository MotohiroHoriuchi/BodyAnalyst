// proto/visualization-engine/src/filters/TokenizerFilter.ts
import { DataFilter, DataFrame, PipelineContext } from '../types';

export type TokenizerMethod = 'whitespace' | 'hashtag' | 'segmenter';

export interface TokenizerConfig {
  /** Source field containing text to tokenize */
  sourceField: string;
  /** Target field to store the resulting token array */
  targetField: string;
  /** Tokenization method */
  method: TokenizerMethod;
  /** Minimum token length to include (default: 1) */
  minTokenLength?: number;
  /** Tokens to exclude from the result */
  excludeTokens?: string[];
}

export class TokenizerFilter implements DataFilter {
  constructor(private config: TokenizerConfig) {}

  async execute(data: DataFrame, _context: PipelineContext): Promise<DataFrame> {
    return data.map((point) => {
      const rawValue = point.attributes[this.config.sourceField];
      const text = typeof rawValue === 'string' ? rawValue : '';

      let tokens = this.tokenize(text);
      tokens = this.applyFilters(tokens);

      return {
        ...point,
        attributes: {
          ...point.attributes,
          [this.config.targetField]: tokens,
        },
      };
    });
  }

  private tokenize(text: string): string[] {
    if (text.length === 0) return [];

    switch (this.config.method) {
      case 'whitespace':
        return this.tokenizeWhitespace(text);
      case 'hashtag':
        return this.tokenizeHashtag(text);
      case 'segmenter':
        return this.tokenizeSegmenter(text);
    }
  }

  private tokenizeWhitespace(text: string): string[] {
    return text
      .split(/[\s,、]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  }

  private tokenizeHashtag(text: string): string[] {
    const matches = text.match(/#([^\s#,、]+)/g);
    if (!matches) return [];
    return matches.map((m) => m.slice(1));
  }

  private tokenizeSegmenter(text: string): string[] {
    const segmenter = new Intl.Segmenter('ja', { granularity: 'word' });
    const segments = segmenter.segment(text);

    return Array.from(segments)
      .filter((seg) => seg.isWordLike)
      .map((seg) => seg.segment);
  }

  private applyFilters(tokens: string[]): string[] {
    const minLen = this.config.minTokenLength ?? 1;
    const excludeSet = new Set(this.config.excludeTokens ?? []);

    return tokens.filter(
      (token) => token.length >= minLen && !excludeSet.has(token)
    );
  }
}
