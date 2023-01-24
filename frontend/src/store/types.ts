import AttachmentRenderer from '../components/Content/Renderers/AttachmentRenderer';
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
  type: 'train' | 'test';
}
export interface MemberPoints {
  l2norm: number;
  memberId: number;
  word: string;
  classLabel: string;
  sentId?: number;
  wordId?: number;
  sentence?: string;
}

export interface LinkEntity {
  source: NodeEntity;
  target: NodeEntity;
  intersection: number;
}

export type ColorMap = {
  [classLabel: string]: Label;
};

export type AttachmentDist = {
  [classLabel: string]: number;
};

export type Attachment = {
  [classLabel: string]: AttachmentDist;
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
  minSamples: ParamList;
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
  attachmentRenderer: AttachmentRenderer;
  trackingMode: boolean;
  bubbleGlyph: boolean;
  transitionEffect: boolean;
  selectedNodes: NodeEntity[];
  isLoading: boolean;
}
