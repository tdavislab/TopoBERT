// store.ts
import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import { RootState } from './types';
import { defaults } from './defaults';
import { actions } from './actions';
import { mutations } from './mutations';

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
  colorMap: defaults.defaultColorScheme,
  mTable: defaults.defaultTable,
  graph: defaults.defaultGraph,
  minLinkStrength: 1,
  nodeSize: 'constant',
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
