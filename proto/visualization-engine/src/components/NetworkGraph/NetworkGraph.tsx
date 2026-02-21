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

/** nodeVal → 描画半径（react-force-graph-2d のデフォルト計算式） */
const NODE_REL_SIZE = 4;
function valToRadius(val: number): number {
  return Math.sqrt(val) * NODE_REL_SIZE;
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
    const fg = graphRef.current;
    if (!fg) return;

    // ノード間の反発力を強化してラベルが重ならないようにする
    fg.d3Force('charge')?.strength(-150)?.distanceMax(200);

    const timer = setTimeout(() => {
      fg.zoomToFit(400, 50);
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

  const nodeCanvasObject = useCallback(
    (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const radius = valToRadius(node.val ?? 1);
      const x = node.x ?? 0;
      const y = node.y ?? 0;

      // ノード円を描画
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = node.color || '#6366F1';
      ctx.fill();

      // ラベルテキスト描画（ズームに応じてスケーリング）
      const fontSize = Math.max(10 / globalScale, 2);
      ctx.font = `${fontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#374151';
      ctx.fillText(node.label, x, y + radius + 1);
    },
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
        nodeCanvasObject={nodeCanvasObject}
        nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
          const radius = valToRadius(node.val ?? 1);
          ctx.beginPath();
          ctx.arc(node.x ?? 0, node.y ?? 0, radius, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
        }}
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
