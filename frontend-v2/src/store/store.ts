// store.ts
import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import { RootState, NodeSize } from './types';
import { ActionContext } from 'vuex';

// define injection key
export const key: InjectionKey<Store<RootState>> = Symbol();

// set state
const state: RootState = {
  count: 0,
  currentEpochIndex: 0,
  layerObj: {
    layers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    selected: 0,
  },
  datasetList: {
    datasets: [
      { name: 'SuperSense Role', value: 'ss-role' },
      { name: 'SuperSense Function', value: 'ss-func' },
      { name: 'Part of Speech', value: 'pos' },
      { name: 'Dependency', value: 'dep' },
    ],
    selected: 'ss-role',
  },
  mapperParams: {
    dataSplit: {
      paramList: [
        { name: 'Train', value: 'train' },
        { name: 'Test', value: 'test' },
        { name: 'Train ∪ Test', value: 'trainutest' },
        { name: 'Train + Test (knn)', value: 'trainknntest' },
      ],
      selected: 'train',
    },
    metric: {
      paramList: [
        { name: 'Euclidean', value: 'euclidean' },
        { name: 'Cosine', value: 'cosine' },
      ],
      selected: 'euclidean',
    },
    filter: {
      paramList: [
        { name: 'L1', value: 'l1' },
        { name: 'L2', value: 'l2' },
        { name: 'Average KNN-5', value: 'knn' },
      ],
      selected: 'l1',
    },
    intervals: {
      paramList: [
        { name: '50', value: 50 },
        { name: '100', value: 100 },
      ],
      selected: 50,
    },
    overlap: {
      paramList: [
        { name: '25', value: 25 },
        { name: '50', value: 50 },
        { name: '100', value: 100 },
      ],
      selected: 50,
    },
    layout: {
      paramList: [
        { name: 'Force Directed', value: 'force' },
        { name: 'PCA', value: 'pca' },
      ],
      selected: 'force',
    },
  },
  minLinkStrength: 1,
  nodeSize: 'constant',
  epochs: [
    0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160,
    165, 170, 175, 176,
  ],
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
