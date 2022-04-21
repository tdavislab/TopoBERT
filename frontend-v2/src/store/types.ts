import GraphRenderer from '../components/Content/Renderers/GraphRender';
import ProjectionRenderer from '../components/Content/Renderers/ProjectionRenderer';

export interface LayerType {
  layers: Array<number>;
  selected: number;
}

export interface Parameter {
  name: string;
  value: number | string;
}

export interface DatasetList {
  datasets: Array<Parameter>;
  selected: string;
}

export interface ParamList {
  paramList: Array<Parameter>;
  selected: number | string;
}

export interface Label {
  color: string;
  selected: boolean;
}

export interface MTable {
  header: Array<string>;
  rows: Array<Array<string>>;
}
export interface Graph {
  nodes: Array<NodeEntity>;
  links: Array<LinkEntity>;
}

export type ProjectionData = Array<ProjectionRow>;
export interface ProjectionRow {
  x: number;
  y: number;
  label: string;
  word: string;
  datatype: string;
  index: number;
}

export interface NodeEntity {
  id: string;
  name: string;
  avgFilterValue: number;
  x_pca: number;
  y_pca: number;
  x: number;
  y: number;
  fx?: number | null;
  fy?: number | null;
  memberPoints: Array<MemberPoints>;
}
export interface MemberPoints {
  memberId: number;
  word: string;
  classLabel: string;
  sentId?: number;
  wordId?: number;
}

export interface LinkEntity {
  source: string;
  target: string;
  intersection: number;
}

export type ColorMap = {
  [classLabel: string]: Label;
};

export type Epochs = Array<number>;

export type NodeSize = 'constant' | 'scaled';

export type MapperParams = {
  dataSplit: ParamList;
  metric: ParamList;
  filter: ParamList;
  intervals: ParamList;
  overlap: ParamList;
  layout: ParamList;
};

export interface RootState {
  count: number;
  currentEpochIndex: number;
  layerObj: LayerType;
  datasetList: DatasetList;
  mapperParams: MapperParams;
  epochs: Epochs;
  minLinkStrength: number;
  nodeSize: NodeSize;
  colorMap: ColorMap;
  mTable: MTable;
  graph: Graph;
  projectionData: ProjectionData;
  graphRenderer: GraphRenderer;
  projectionRenderer: ProjectionRenderer;
  trackingMode: boolean;
  bubbleGlyph: boolean;
  transitionEffect: boolean;
  selectedNodes: NodeEntity[];
}
