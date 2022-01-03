// define your typings for the store state
export type LayerType = {
  layers: Array<number>;
  selected: number;
};
export interface RootState {
  count: number;
  layerObj: LayerType;
}
