// proto/visualization-engine/src/sinks/NetworkGraphSink.ts
import { DataSink, DataFrame, PipelineContext } from '../types';

export interface GraphNode {
  id: string;
  label: string;
  size: number;
  group: string;
}

export interface GraphLink {
  source: string;
  target: string;
  weight: number;
}

export interface NetworkGraphOutput {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface NetworkGraphConfig {
  /** Field containing the token array (string[]) */
  tokenField: string;
  /** Optional string attribute fields to include as co-occurring nodes */
  attributeFields?: string[];
}

export class NetworkGraphSink implements DataSink<NetworkGraphOutput> {
  constructor(private config: NetworkGraphConfig) {}

  async consume(
    data: DataFrame,
    _context: PipelineContext
  ): Promise<NetworkGraphOutput> {
    const nodeFrequency = new Map<string, { count: number; group: string }>();
    const linkWeights = new Map<string, number>();

    for (const point of data) {
      const rawTokens = point.attributes[this.config.tokenField];
      if (!Array.isArray(rawTokens) || rawTokens.length === 0) continue;

      const tokens = [...new Set(rawTokens as string[])];

      // Count token frequencies
      for (const token of tokens) {
        const existing = nodeFrequency.get(token);
        if (existing) {
          existing.count++;
        } else {
          nodeFrequency.set(token, { count: 1, group: 'token' });
        }
      }

      // Collect attribute values as nodes
      const attrValues: { value: string; group: string }[] = [];
      if (this.config.attributeFields) {
        for (const field of this.config.attributeFields) {
          const val = point.attributes[field];
          if (typeof val === 'string') {
            attrValues.push({ value: val, group: field });

            const existing = nodeFrequency.get(val);
            if (existing) {
              existing.count++;
              // Attribute-derived group takes priority over "token"
              if (existing.group === 'token') {
                existing.group = field;
              }
            } else {
              nodeFrequency.set(val, { count: 1, group: field });
            }
          }
        }
      }

      // Generate token-to-token links
      for (let i = 0; i < tokens.length; i++) {
        for (let j = i + 1; j < tokens.length; j++) {
          const key = this.linkKey(tokens[i], tokens[j]);
          linkWeights.set(key, (linkWeights.get(key) ?? 0) + 1);
        }

        // Generate token-to-attribute links
        for (const attr of attrValues) {
          if (attr.value !== tokens[i]) {
            const key = this.linkKey(tokens[i], attr.value);
            linkWeights.set(key, (linkWeights.get(key) ?? 0) + 1);
          }
        }
      }
    }

    // Build output
    const nodes: GraphNode[] = Array.from(nodeFrequency.entries()).map(
      ([id, info]) => ({
        id,
        label: id,
        size: info.count,
        group: info.group,
      })
    );

    const links: GraphLink[] = Array.from(linkWeights.entries()).map(
      ([key, weight]) => {
        const [source, target] = key.split('\0');
        return { source, target, weight };
      }
    );

    return { nodes, links };
  }

  /** Create a consistent link key by sorting node IDs */
  private linkKey(a: string, b: string): string {
    return a < b ? `${a}\0${b}` : `${b}\0${a}`;
  }
}
