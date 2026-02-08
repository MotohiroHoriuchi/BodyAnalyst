// proto/visualization-engine/src/components/NetworkGraph/NetworkGraph.tsx
import { useRef, useMemo, useCallback, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import type { NetworkGraphOutput } from '../../sinks/NetworkGraphSink';
import type { AdapterConfig } from './networkGraphAdapter.types';
import { adaptNetworkGraphOutput } from './networkGraphAdapter';
import { NetworkGraphLegend } from './NetworkGraphLegend';

interface NetworkGraphProps {
  data: NetworkGraphOutput;
  width: number;
  height: number;
  showLegend?: boolean;
  adapterConfig?: AdapterConfig;
  onNodeClick?: (nodeId: string) => void;
}

export function NetworkGraph({
  data,
  width,
  height,
  showLegend = true,
  adapterConfig,
  onNodeClick,
}: NetworkGraphProps) {
  const graphRef = useRef<any>(null);

  const { graphData, colorMap } = useMemo(
    () => adaptNetworkGraphOutput(data, adapterConfig),
    [data, adapterConfig]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      graphRef.current?.zoomToFit(400, 50);
    }, 500);
    return () => clearTimeout(timer);
  }, [graphData]);

  const handleNodeClick = useCallback(
    (node: any) => {
      if (onNodeClick && node.id) {
        onNodeClick(node.id as string);
      }
    },
    [onNodeClick]
  );

  const nodeLabel = useCallback(
    (node: any) => `${node.label} (${node.size})`,
    []
  );

  return (
    <div data-testid="network-graph-container" className="relative">
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={width}
        height={height}
        nodeId="id"
        nodeVal="val"
        nodeColor="color"
        nodeLabel={nodeLabel}
        linkWidth="width"
        linkColor="color"
        onNodeClick={handleNodeClick}
        cooldownTicks={100}
        enableNodeDrag={true}
      />
      {showLegend && <NetworkGraphLegend colorMap={colorMap} />}
    </div>
  );
}
