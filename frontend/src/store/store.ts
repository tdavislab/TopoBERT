import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import { RootState, NodeSize, Graph, NodeEntity, ProjectionData, Attachment } from './types';
import { ActionContext } from 'vuex';
import { defaults } from './defaults';
import axios, { AxiosRequestConfig } from 'axios';
import GraphRenderer from '../components/Content/Renderers/GraphRender';
import ProjectionRenderer from '../components/Content/Renderers/ProjectionRenderer';
import AttachmentRenderer from '../components/Content/Renderers/AttachmentRenderer';
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
  projectionData: defaults.defaultProjectionData,
  graphRenderer: new GraphRenderer(),
  projectionRenderer: new ProjectionRenderer(),
  attachmentRenderer: new AttachmentRenderer(),
  trackingMode: defaults.defaultTrackingMode,
  bubbleGlyph: defaults.defaultBubbleGlyph,
  transitionEffect: defaults.defaultTransitionEffect,
  selectedNodes: [],
  minLinkStrength: 1,
  nodeSize: 'constant',
  isLoading: false,
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
  setProjectionData(state: RootState, projectionData: ProjectionData) {
    state.projectionData = projectionData;
  },
  clearLabelSelection(state: RootState) {
    for (const label in state.colorMap) {
      state.colorMap[label].selected = false;
    }
    state.graphRenderer.clearHighlight();
    state.projectionRenderer.clearHighlight();
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
    state.graphRenderer.clearHighlight();
    state.mTable.rows = [['-', '-', '-', '-', '-']];
  },
  setTrackingMode(state: RootState, mode: boolean) {
    state.trackingMode = mode;
  },
  setBubbleGlyph(state: RootState, mode: boolean) {
    state.bubbleGlyph = mode;
    state.graphRenderer.bubbleGlyph(mode);
  },
  setTransitionEffect(state: RootState, mode: boolean) {
    state.transitionEffect = mode;
  },
  setMTable(state: RootState, tableRows: string[][]) {
    state.mTable.rows = tableRows;
  },
  setLoading(state: RootState, loading: boolean) {
    state.isLoading = loading;
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
        minSamples: context.state.mapperParams.minSamples.selected,
      },
    };

    axios.interceptors.request.use(
      (config) => {
        context.commit('setLoading', true);
        return config;
      },
      (error) => {
        context.commit('setLoading', false);
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => {
        context.commit('setLoading', false);
        return response;
      },
      (error) => {
        context.commit('setLoading', false);
        return Promise.reject(error);
      }
    );

    axios
      .get(url, options)
      .then((response) => {
        console.log(response.data);

        const graph = response.data.graph as Graph;
        const projectionData = response.data.projection as ProjectionData;
        const attachments = response.data.attachments as Attachment;

        context.commit('setGraph', graph);
        context.commit('setProjectionData', projectionData);

        context.state.projectionRenderer.draw(projectionData);

        if (context.state.transitionEffect) {
          context.state.graphRenderer.transitionToNewGraph(graph);
        } else {
          context.state.graphRenderer.draw(graph, '#graph-svg', context.getters.pieColorScale);
          context.state.graphRenderer.convertToLayout(context.state.mapperParams.layout.selected);
          context.state.graphRenderer.bubbleGlyph(context.state.bubbleGlyph);
        }

        if (context.state.trackingMode === false) {
          context.commit('resetSelectedNodes');
        } else {
          context.state.graphRenderer.selectionHighlight(context.getters.membersToNodes);
        }

        if (attachments) {
          console.log('found attachments', attachments);
          context.state.attachmentRenderer.draw(attachments);
        }

        context.dispatch('updateMetadataTable');
        context.commit('clearLabelSelection');
      })
      .catch((error) => {
        console.log(error);
      });
  },
  datasetUpdate(context: ActionContext<RootState, RootState>) {
    context.state.colorMap = defaults.defaultColorScheme;
    if (context.state.datasetList.selected === 'berttiny') {
      context.state.epochs = [
        0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345, 360, 375, 390, 405, 420, 435,
        450, 465, 480, 495, 510, 525, 540, 555, 570, 585, 589,
      ];
      context.state.layerObj = {
        layers: [0, 1, 2],
        selected: 2,
      };
    } else {
      context.state.epochs = defaults.defaultEpochs;
      context.state.layerObj = defaults.defaultLayerObj;
    }
    if (context.state.datasetList.selected === 'dep') {
      context.state.epochs = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 74];
      context.state.colorMap = new Proxy(defaults.defaultColorSchemeDep, {
        get: function (target, name) {
          return target.hasOwnProperty(name) ? target[name] : '#cccccc';
        },
      });
    }
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
          return node.memberPoints.map((point) => [point.sentId, point.wordId, point.word, point.classLabel, point.sentence]);
        })
        .flat();
      context.commit('setMTable', newMData);
    }
  },
  highlightFilteredLabelNodes(context: ActionContext<RootState, RootState>) {
    const filteredLabels = Object.keys(context.state.colorMap).filter((label) => context.state.colorMap[label].selected === true);

    if (filteredLabels.length === 0) {
      context.commit('clearLabelSelection');
      context.state.projectionRenderer.clearHighlight();
    } else {
      const filteredLabelsSet = new Set(filteredLabels);

      function filterCriterion(node: NodeEntity) {
        return node.memberPoints.some((point) => filteredLabelsSet.has(point.classLabel));
      }

      const filteredNodes = context.state.graph.nodes.filter(filterCriterion);
      context.state.graphRenderer.filterHighlight(filteredNodes);
      context.state.projectionRenderer.filterLabels(filteredLabelsSet);
    }
  },
  highlightWordNodes(context: ActionContext<RootState, RootState>, wordSet: Set<string>) {
    const filteredNodes = context.state.graph.nodes.filter((node) => node.memberPoints.some((point) => wordSet.has(point.word)));
    context.state.graphRenderer.filterHighlight(filteredNodes);
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

    let filteredNodes = state.graph.nodes.filter(
      (node) =>
        intersect(
          getters.nodeToMembers,
          node.memberPoints.map((point) => point.memberId)
        ).length > 0
    );

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
