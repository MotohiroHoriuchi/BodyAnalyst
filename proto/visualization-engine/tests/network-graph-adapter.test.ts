// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { adaptNetworkGraphOutput } from '../src/components/NetworkGraph/networkGraphAdapter';
import type { NetworkGraphOutput } from '../src/sinks/NetworkGraphSink';
import type {
  ForceGraphNodeObject,
  ForceGraphLinkObject,
} from '../src/components/NetworkGraph/networkGraphAdapter.types';

const LINK_COLOR = 'rgba(156, 163, 175, 0.5)';

describe('adaptNetworkGraphOutput', () => {
  // Test 1: Empty input
  it('returns empty data and colorMap for empty input', () => {
    const input: NetworkGraphOutput = { nodes: [], links: [] };
    const result = adaptNetworkGraphOutput(input);

    expect(result.graphData.nodes).toEqual([]);
    expect(result.graphData.links).toEqual([]);
    expect(result.colorMap).toEqual({});
  });

  // Test 2: Single node
  it('converts a single node with correct color and mid-range val', () => {
    const input: NetworkGraphOutput = {
      nodes: [{ id: 'A', label: 'A', size: 5, group: 'token' }],
      links: [],
    };
    const result = adaptNetworkGraphOutput(input);

    expect(result.graphData.nodes).toHaveLength(1);
    const node = result.graphData.nodes[0];
    expect(node.id).toBe('A');
    expect(node.label).toBe('A');
    expect(node.group).toBe('token');
    expect(node.color).toBe(result.colorMap['token']);
    // Single node → mid-range val (default min=2, max=20, mid=11)
    expect(node.val).toBe(11);
  });

  // Test 3: Same group, different sizes → linear scaling
  it('scales node val linearly for nodes in the same group with different sizes', () => {
    const input: NetworkGraphOutput = {
      nodes: [
        { id: 'A', label: 'A', size: 1, group: 'token' },
        { id: 'B', label: 'B', size: 5, group: 'token' },
        { id: 'C', label: 'C', size: 3, group: 'token' },
      ],
      links: [],
    };
    const result = adaptNetworkGraphOutput(input);

    const nodeA = result.graphData.nodes.find((n) => n.id === 'A')!;
    const nodeB = result.graphData.nodes.find((n) => n.id === 'B')!;
    const nodeC = result.graphData.nodes.find((n) => n.id === 'C')!;

    // size 1 → min val (2), size 5 → max val (20)
    expect(nodeA.val).toBe(2);
    expect(nodeB.val).toBe(20);
    // size 3 → linearly between: 2 + (3-1)/(5-1) * (20-2) = 2 + 0.5 * 18 = 11
    expect(nodeC.val).toBe(11);
  });

  // Test 4: Multiple groups get different colors, token is always palette[0]
  it('assigns different colors to different groups, token always first', () => {
    const input: NetworkGraphOutput = {
      nodes: [
        { id: 'A', label: 'A', size: 1, group: 'token' },
        { id: 'B', label: 'B', size: 1, group: 'condition' },
        { id: 'C', label: 'C', size: 1, group: 'bodyPart' },
      ],
      links: [],
    };
    const result = adaptNetworkGraphOutput(input);

    const { colorMap } = result;
    // token is always first palette color
    expect(colorMap['token']).toBe('#6366F1');
    // Other groups get different colors
    expect(colorMap['condition']).toBeDefined();
    expect(colorMap['bodyPart']).toBeDefined();
    expect(colorMap['condition']).not.toBe(colorMap['token']);
    expect(colorMap['bodyPart']).not.toBe(colorMap['token']);
    expect(colorMap['condition']).not.toBe(colorMap['bodyPart']);
  });

  // Test 5: All same size → all get mid-range val
  it('assigns mid-range val when all nodes have the same size', () => {
    const input: NetworkGraphOutput = {
      nodes: [
        { id: 'A', label: 'A', size: 3, group: 'token' },
        { id: 'B', label: 'B', size: 3, group: 'token' },
      ],
      links: [],
    };
    const result = adaptNetworkGraphOutput(input);

    for (const node of result.graphData.nodes) {
      expect(node.val).toBe(11); // mid value of default range [2, 20]
    }
  });

  // Test 6: Link width scaling
  it('scales link width linearly based on weight', () => {
    const input: NetworkGraphOutput = {
      nodes: [
        { id: 'A', label: 'A', size: 1, group: 'token' },
        { id: 'B', label: 'B', size: 1, group: 'token' },
        { id: 'C', label: 'C', size: 1, group: 'token' },
      ],
      links: [
        { source: 'A', target: 'B', weight: 1 },
        { source: 'B', target: 'C', weight: 5 },
        { source: 'A', target: 'C', weight: 3 },
      ],
    };
    const result = adaptNetworkGraphOutput(input);

    const linkAB = result.graphData.links.find(
      (l) => l.source === 'A' && l.target === 'B'
    )!;
    const linkBC = result.graphData.links.find(
      (l) => l.source === 'B' && l.target === 'C'
    )!;
    const linkAC = result.graphData.links.find(
      (l) => l.source === 'A' && l.target === 'C'
    )!;

    // weight 1 → min width (1), weight 5 → max width (5)
    expect(linkAB.width).toBe(1);
    expect(linkBC.width).toBe(5);
    // weight 3 → 1 + (3-1)/(5-1) * (5-1) = 1 + 2 = 3
    expect(linkAC.width).toBe(3);
  });

  // Test 7: All links same weight → mid-range width
  it('assigns mid-range width when all links have the same weight', () => {
    const input: NetworkGraphOutput = {
      nodes: [
        { id: 'A', label: 'A', size: 1, group: 'token' },
        { id: 'B', label: 'B', size: 1, group: 'token' },
      ],
      links: [{ source: 'A', target: 'B', weight: 3 }],
    };
    const result = adaptNetworkGraphOutput(input);

    expect(result.graphData.links[0].width).toBe(3); // mid of [1, 5]
  });

  // Test 8: Link color is semi-transparent gray
  it('sets all link colors to semi-transparent gray', () => {
    const input: NetworkGraphOutput = {
      nodes: [
        { id: 'A', label: 'A', size: 1, group: 'token' },
        { id: 'B', label: 'B', size: 1, group: 'token' },
      ],
      links: [{ source: 'A', target: 'B', weight: 1 }],
    };
    const result = adaptNetworkGraphOutput(input);

    expect(result.graphData.links[0].color).toBe(LINK_COLOR);
  });

  // Test 9: Custom config (min/max values)
  it('respects custom minNodeVal, maxNodeVal, minLinkWidth, maxLinkWidth', () => {
    const input: NetworkGraphOutput = {
      nodes: [
        { id: 'A', label: 'A', size: 1, group: 'token' },
        { id: 'B', label: 'B', size: 10, group: 'token' },
      ],
      links: [{ source: 'A', target: 'B', weight: 3 }],
    };
    const result = adaptNetworkGraphOutput(input, {
      minNodeVal: 5,
      maxNodeVal: 50,
      minLinkWidth: 2,
      maxLinkWidth: 10,
    });

    const nodeA = result.graphData.nodes.find((n) => n.id === 'A')!;
    const nodeB = result.graphData.nodes.find((n) => n.id === 'B')!;
    expect(nodeA.val).toBe(5);
    expect(nodeB.val).toBe(50);

    // Single link → mid width: (2 + 10) / 2 = 6
    expect(result.graphData.links[0].width).toBe(6);
  });

  // Test 10: colorOverrides
  it('applies colorOverrides for specified groups', () => {
    const input: NetworkGraphOutput = {
      nodes: [
        { id: 'A', label: 'A', size: 1, group: 'token' },
        { id: 'B', label: 'B', size: 1, group: 'condition' },
      ],
      links: [],
    };
    const result = adaptNetworkGraphOutput(input, {
      colorOverrides: { token: '#FF0000', condition: '#00FF00' },
    });

    expect(result.colorMap['token']).toBe('#FF0000');
    expect(result.colorMap['condition']).toBe('#00FF00');
    expect(result.graphData.nodes.find((n) => n.id === 'A')!.color).toBe(
      '#FF0000'
    );
    expect(result.graphData.nodes.find((n) => n.id === 'B')!.color).toBe(
      '#00FF00'
    );
  });

  // Test 11: Structural completeness
  it('ensures all required fields exist on nodes and links', () => {
    const input: NetworkGraphOutput = {
      nodes: [
        { id: 'A', label: 'A', size: 2, group: 'token' },
        { id: 'B', label: 'B', size: 3, group: 'condition' },
      ],
      links: [{ source: 'A', target: 'B', weight: 1 }],
    };
    const result = adaptNetworkGraphOutput(input);

    for (const node of result.graphData.nodes) {
      expect(node).toHaveProperty('id');
      expect(node).toHaveProperty('label');
      expect(node).toHaveProperty('size');
      expect(node).toHaveProperty('val');
      expect(node).toHaveProperty('color');
      expect(node).toHaveProperty('group');
    }

    for (const link of result.graphData.links) {
      expect(link).toHaveProperty('source');
      expect(link).toHaveProperty('target');
      expect(link).toHaveProperty('weight');
      expect(link).toHaveProperty('width');
      expect(link).toHaveProperty('color');
    }
  });

  // Test 12: Japanese node IDs are preserved
  it('preserves Japanese node IDs and labels through conversion', () => {
    const input: NetworkGraphOutput = {
      nodes: [
        { id: '腰痛', label: '腰痛', size: 3, group: 'token' },
        { id: '肩こり', label: '肩こり', size: 2, group: 'token' },
      ],
      links: [{ source: '腰痛', target: '肩こり', weight: 1 }],
    };
    const result = adaptNetworkGraphOutput(input);

    const node1 = result.graphData.nodes.find((n) => n.id === '腰痛');
    const node2 = result.graphData.nodes.find((n) => n.id === '肩こり');
    expect(node1).toBeDefined();
    expect(node1!.label).toBe('腰痛');
    expect(node2).toBeDefined();
    expect(node2!.label).toBe('肩こり');

    const link = result.graphData.links[0];
    expect(link.source).toBe('腰痛');
    expect(link.target).toBe('肩こり');
  });
});
