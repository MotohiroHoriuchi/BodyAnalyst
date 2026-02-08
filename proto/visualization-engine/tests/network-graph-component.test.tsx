import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock react-force-graph-2d (Canvas-based, cannot work in jsdom)
vi.mock('react-force-graph-2d', async () => {
  const React = await import('react');
  return {
    default: React.forwardRef((props: any, _ref: any) =>
      React.createElement('div', { 'data-testid': 'force-graph-mock' })
    ),
  };
});

import { NetworkGraph } from '../src/components/NetworkGraph';
import type { NetworkGraphOutput } from '../src/sinks/NetworkGraphSink';

const emptyData: NetworkGraphOutput = { nodes: [], links: [] };

const sampleData: NetworkGraphOutput = {
  nodes: [
    { id: 'トークン1', label: 'トークン1', size: 3, group: 'token' },
    { id: '肩こり', label: '肩こり', size: 2, group: 'condition' },
  ],
  links: [{ source: 'トークン1', target: '肩こり', weight: 1 }],
};

describe('NetworkGraph component', () => {
  // Test 1: Renders without error
  it('renders the container element', () => {
    render(<NetworkGraph data={sampleData} width={800} height={600} />);
    expect(screen.getByTestId('network-graph-container')).toBeDefined();
  });

  // Test 2: Empty data renders without error
  it('renders without error with empty data', () => {
    render(<NetworkGraph data={emptyData} width={800} height={600} />);
    expect(screen.getByTestId('network-graph-container')).toBeDefined();
  });

  // Test 3: Legend is shown by default
  it('shows legend by default', () => {
    render(<NetworkGraph data={sampleData} width={800} height={600} />);
    expect(screen.getByTestId('network-graph-legend')).toBeDefined();
  });

  // Test 4: Legend can be hidden
  it('hides legend when showLegend is false', () => {
    render(
      <NetworkGraph
        data={sampleData}
        width={800}
        height={600}
        showLegend={false}
      />
    );
    expect(screen.queryByTestId('network-graph-legend')).toBeNull();
  });

  // Test 5: Legend shows Japanese group names
  it('displays Japanese group names in legend', () => {
    render(<NetworkGraph data={sampleData} width={800} height={600} />);
    expect(screen.getByText('token')).toBeDefined();
    expect(screen.getByText('condition')).toBeDefined();
  });
});
