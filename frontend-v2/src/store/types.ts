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

type Epochs = Array<number>;

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
}
