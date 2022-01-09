import { RootState, NodeSize } from './types';

export const mutations = {
  setLayer(state: RootState, layer: number) {
    state.layerObj.selected = layer;
  },
  setNodeSize(state: RootState, size: NodeSize) {
    state.nodeSize = size;
  },
  clearLabelSelection(state: RootState) {
    for (const label in state.colorMap) {
      state.colorMap[label].selected = false;
    }
  },
};
