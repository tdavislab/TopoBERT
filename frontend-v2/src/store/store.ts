// store.ts
import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import { RootState, NodeSize } from './types';
import { ActionContext } from 'vuex';
import { defaults } from './defaults';

// define injection key
export const key: InjectionKey<Store<RootState>> = Symbol();

// set state
const state: RootState = {
  count: 0,
  currentEpochIndex: 0,
  epochs: defaults.defaultEpochs,
  layerObj: defaults.defaultLayerObj,
  datasetList: defaults.defaultDatasetList,
  mapperParams: defaults.defaultMapperParams,
  minLinkStrength: 1,
  nodeSize: 'constant',
};

const mutations = {
  setLayer(state: RootState, layer: number) {
    state.layerObj.selected = layer;
  },
  setNodeSize(state: RootState, size: NodeSize) {
    state.nodeSize = size;
  },
};

const actions = {
  updateGraph(context: ActionContext<RootState, RootState>) {
    console.table(context.state.mapperParams);
  },
  datasetUpdate(context: ActionContext<RootState, RootState>) {
    console.log(`Updating to ${context.state.datasetList.selected}`);
  },
  toggleNodeSize(context: ActionContext<RootState, RootState>, updatedNodeSize: NodeSize) {
    if (updatedNodeSize === context.state.nodeSize) return;
    context.commit('setNodeSize', updatedNodeSize);
  },
};

const getters = {
  epochIndex(state: RootState) {
    return state.epochs[state.currentEpochIndex];
  },
};

export const store = createStore<RootState>({
  state,
  mutations,
  actions,
  getters,
});

export function useStore() {
  return baseUseStore(key);
}
