// proto/visualization-engine/src/components/NetworkGraph/networkGraphAdapter.types.ts

export interface ForceGraphNodeObject {
  id: string;
  label: string;
  size: number;
  val: number;
  color: string;
  group: string;
}

export interface ForceGraphLinkObject {
  source: string;
  target: string;
  weight: number;
  width: number;
  color: string;
}

export interface ForceGraphData {
  nodes: ForceGraphNodeObject[];
  links: ForceGraphLinkObject[];
}

export type GroupColorMap = { [group: string]: string };

export interface AdapterConfig {
  minNodeVal?: number;
  maxNodeVal?: number;
  minLinkWidth?: number;
  maxLinkWidth?: number;
  colorOverrides?: { [group: string]: string };
}

export interface AdapterResult {
  graphData: ForceGraphData;
  colorMap: GroupColorMap;
}
