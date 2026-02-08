// proto/visualization-engine/src/components/NetworkGraph/NetworkGraphLegend.tsx
import type { GroupColorMap } from './networkGraphAdapter.types';

interface NetworkGraphLegendProps {
  colorMap: GroupColorMap;
}

export function NetworkGraphLegend({ colorMap }: NetworkGraphLegendProps) {
  const entries = Object.entries(colorMap);

  if (entries.length === 0) return null;

  return (
    <div
      data-testid="network-graph-legend"
      className="absolute top-3 right-3 bg-white/90 border border-neutral-200 rounded-sm p-3 text-sm shadow-sm"
    >
      <div className="font-semibold text-neutral-700 mb-2">凡例</div>
      <ul className="space-y-1">
        {entries.map(([group, color]) => (
          <li key={group} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-neutral-600">{group}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
