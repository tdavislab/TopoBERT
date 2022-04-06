// store.ts
import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import { RootState, NodeSize, Graph, NodeEntity } from './types';
import { ActionContext } from 'vuex';
import { defaults } from './defaults';
import axios, { AxiosRequestConfig } from 'axios';
import GraphRenderer from '../components/Content/Renderers/GraphRender';
import * as d3 from 'd3';

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
  trackingMode: defaults.defaultTrackingMode,
  selectedNodes: [],
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
  addSelectedNode(state: RootState, node: NodeEntity) {
    // if already selected, remove
    const index = state.selectedNodes.findIndex((n) => n.id === node.id);
    if (index > -1) {
      state.selectedNodes.splice(index, 1);
    } else {
      state.selectedNodes.push(node);
    }
  },
  resetSelectedNodes(state: RootState) {
    state.selectedNodes = [];
  },
  setTrackingMode(state: RootState, mode: boolean) {
    state.trackingMode = mode;
  },
  setMTable(state: RootState, tableRows: string[][]) {
    state.mTable.rows = tableRows;
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
        const graph = response.data.graph as Graph;
        context.commit('setGraph', graph);
        context.state.graphRenderer.draw(graph, '#graph-svg', context.getters.pieColorScale);
        if (context.state.trackingMode === false) {
          context.commit('resetSelectedNodes');
        } else {
          context.state.graphRenderer.highlight(context.getters.membersToNodes);
        }
        context.dispatch('updateMetadataTable');
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
  updateMetadataTable(context: ActionContext<RootState, RootState>) {
    if (context.state.selectedNodes.length === 0) {
      context.commit('setMTable', [[]]);
    } else {
      const newMData = context.state.selectedNodes
        .map((node) => {
          return node.memberPoints.map((point) => [point.sentId, point.wordId, point.word, point.classLabel]);
        })
        .flat();
      context.commit('setMTable', newMData);
    }
  },
};

const getters = {
  epochIndex(state: RootState) {
    return state.epochs[state.currentEpochIndex];
  },
  pieColorScale(state: RootState) {
    return d3
      .scaleOrdinal<string, string>()
      .domain(Object.keys(state.colorMap))
      .range(Object.values(state.colorMap).map((color) => color.color));
  },
  nodeToMembers(state: RootState) {
    const memberIds = state.selectedNodes.map((node) => node.memberPoints.map((point) => point.memberId)).flat();
    return [...new Set(memberIds)];
  },
  membersToNodes(state: RootState, getters: any) {
    function intersect(a: any[], b: any[]) {
      const setA = new Set(a);
      const setB = new Set(b);
      const intersection = new Set([...setA].filter((x) => setB.has(x)));
      return Array.from(intersection);
    }
    console.log(
      state.graph.nodes.map((node) =>
        intersect(
          node.memberPoints.map((point) => point.memberId),
          getters.nodeToMembers
        )
      )
    );

    let filteredNodes = state.graph.nodes.filter(
      (node) =>
        intersect(
          getters.nodeToMembers,
          node.memberPoints.map((point) => point.memberId)
        ).length > 0
    );
    console.log('membersToNodes', getters.nodeToMembers);
    console.log('filteredNodes', filteredNodes);
    return filteredNodes;
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

// TODO:
// 1. [DONE] Show information about selected member IDs in table
// 2. Fix minimap
