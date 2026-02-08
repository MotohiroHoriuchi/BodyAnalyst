// proto/visualization-engine/src/components/NetworkGraph/networkGraphAdapter.ts
import type { NetworkGraphOutput } from '../../sinks/NetworkGraphSink';
import type {
  AdapterConfig,
  AdapterResult,
  ForceGraphNodeObject,
  ForceGraphLinkObject,
  GroupColorMap,
} from './networkGraphAdapter.types';

const DEFAULT_MIN_NODE_VAL = 2;
const DEFAULT_MAX_NODE_VAL = 20;
const DEFAULT_MIN_LINK_WIDTH = 1;
const DEFAULT_MAX_LINK_WIDTH = 5;
const LINK_COLOR = 'rgba(156, 163, 175, 0.5)';

const COLOR_PALETTE = [
  '#6366F1', // indigo (token default)
  '#F59E0B', // amber
  '#10B981', // emerald
  '#EF4444', // red
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange
];

function scaleLinear(
  value: number,
  domain: [number, number],
  range: [number, number]
): number {
  const [dMin, dMax] = domain;
  const [rMin, rMax] = range;

  if (dMin === dMax) {
    return (rMin + rMax) / 2;
  }

  return rMin + ((value - dMin) / (dMax - dMin)) * (rMax - rMin);
}

function buildGroupColorMap(
  groups: string[],
  overrides?: { [group: string]: string }
): GroupColorMap {
  const colorMap: GroupColorMap = {};

  // Ensure 'token' is always first
  const sortedGroups = [...groups].sort((a, b) => {
    if (a === 'token') return -1;
    if (b === 'token') return 1;
    return a.localeCompare(b);
  });

  for (let i = 0; i < sortedGroups.length; i++) {
    const group = sortedGroups[i];
    colorMap[group] = COLOR_PALETTE[i % COLOR_PALETTE.length];
  }

  // Apply overrides
  if (overrides) {
    for (const [group, color] of Object.entries(overrides)) {
      colorMap[group] = color;
    }
  }

  return colorMap;
}

export function adaptNetworkGraphOutput(
  output: NetworkGraphOutput,
  config?: AdapterConfig
): AdapterResult {
  const minNodeVal = config?.minNodeVal ?? DEFAULT_MIN_NODE_VAL;
  const maxNodeVal = config?.maxNodeVal ?? DEFAULT_MAX_NODE_VAL;
  const minLinkWidth = config?.minLinkWidth ?? DEFAULT_MIN_LINK_WIDTH;
  const maxLinkWidth = config?.maxLinkWidth ?? DEFAULT_MAX_LINK_WIDTH;

  if (output.nodes.length === 0) {
    return {
      graphData: { nodes: [], links: [] },
      colorMap: {},
    };
  }

  // Collect unique groups and build color map
  const groups = [...new Set(output.nodes.map((n) => n.group))];
  const colorMap = buildGroupColorMap(groups, config?.colorOverrides);

  // Compute size domain
  const sizes = output.nodes.map((n) => n.size);
  const sizeMin = Math.min(...sizes);
  const sizeMax = Math.max(...sizes);

  // Convert nodes
  const nodes: ForceGraphNodeObject[] = output.nodes.map((n) => ({
    id: n.id,
    label: n.label,
    size: n.size,
    val: scaleLinear(n.size, [sizeMin, sizeMax], [minNodeVal, maxNodeVal]),
    color: colorMap[n.group],
    group: n.group,
  }));

  // Compute weight domain
  const weights = output.links.map((l) => l.weight);
  const weightMin = weights.length > 0 ? Math.min(...weights) : 0;
  const weightMax = weights.length > 0 ? Math.max(...weights) : 0;

  // Convert links
  const links: ForceGraphLinkObject[] = output.links.map((l) => ({
    source: l.source,
    target: l.target,
    weight: l.weight,
    width: scaleLinear(
      l.weight,
      [weightMin, weightMax],
      [minLinkWidth, maxLinkWidth]
    ),
    color: LINK_COLOR,
  }));

  return { graphData: { nodes, links }, colorMap };
}
