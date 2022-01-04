type LayerType = {
  layers: Array<number>;
  selected: number;
};

type Parameter = {
  name: string;
  value: number | string;
};

type ParamList = {
  paramList: Array<Parameter>;
  selected: number | string;
};

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
  layerObj: LayerType;
  mapperParams: MapperParams;
}
