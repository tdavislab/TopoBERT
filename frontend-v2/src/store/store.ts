// store.ts
import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import { RootState, NodeSize, Graph } from './types';
import { ActionContext } from 'vuex';
import { defaults } from './defaults';
import axios, { AxiosRequestConfig } from 'axios';
import GraphRenderer from '../components/Content/Graph/GraphRender';

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
  graphRenderer: new GraphRenderer(),
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
  setGraph(state: RootState, graph: Graph) {
    state.graph = graph;
  },
  clearLabelSelection(state: RootState) {
    for (const label in state.colorMap) {
      state.colorMap[label].selected = false;
    }
  },
};

const actions = {
  updateGraph(context: ActionContext<RootState, RootState>) {
    const url = import.meta.env.VITE_API + '/graph';
    const options: AxiosRequestConfig = {
      url: '/graph',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        dataset: context.state.datasetList.selected,
        epoch: context.getters.epochIndex,
        layer: context.state.layerObj.selected,
        dataSplit: context.state.mapperParams.dataSplit.selected,
        metric: context.state.mapperParams.metric.selected,
        filter: context.state.mapperParams.filter.selected,
        overlap: context.state.mapperParams.overlap.selected,
        intervals: context.state.mapperParams.intervals.selected,
      },
    };

    axios
      .get(url, options)
      .then((response) => {
        console.log(response.data.graph);

        const graph = response.data.graph as Graph;
        context.commit('setGraph', graph);
        context.state.graphRenderer.draw(graph, '#graph-svg');
      })
      .catch((error) => {
        console.log(error);
      });
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
