import GraphRenderer from '../components/Content/Renderers/GraphRender';

interface LayerType {
  layers: Array<number>;
  selected: number;
}

interface Parameter {
  name: string;
  value: number | string;
}

interface DatasetList {
  datasets: Array<Parameter>;
  selected: string;
}

interface ParamList {
  paramList: Array<Parameter>;
  selected: number | string;
}

interface Label {
  color: string;
  selected: boolean;
}

interface MTable {
  header: Array<string>;
  rows: Array<Array<string>>;
}
export interface Graph {
  nodes: Array<NodeEntity>;
  links: Array<LinkEntity>;
}

export interface NodeEntity {
  id: string;
  name: string;
  avgFilterValue: number;
  x: number;
  y: number;
  memberPoints: Array<MemberPoints>;
}

interface MemberPoints {
  memberId: number;
  word: string;
  classLabel: string;
  sentId?: number;
  wordId?: number;
}

interface LinkEntity {
  source: string;
  target: string;
  intersection: number;
}

type ColorMap = {
  [classLabel: string]: Label;
};

type Epochs = Array<number>;

export type NodeSize = 'constant' | 'scaled';

type MapperParams = {
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
  graphRenderer: GraphRenderer;
  selectedNodes: NodeEntity[];
}
