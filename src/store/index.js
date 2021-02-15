import {createStore} from 'vuex'
import layerData from '../../public/static/data/layerData.json'
import graphData from '../../public/static/mapper_graphs/euclidean_l2_50/0.json'
import sentData from '../../public/static/sentences.json'

import $ from 'jquery'

export default createStore({
  state: {
    layers: layerData.layerData,
    graphData: graphData,
    sentData: sentData,
    dataset: 'euclidean_l2_50',
    currentIteration: 0,
    tableData: {
      header: ['sent_id', 'word_id', 'word', 'label', 'L2 norm'],
      rows: []
    },
    stats: {
      nodeName: '...',
      numMembers: '...',
      avgNorm: '...'
    }
  },
  mutations: {
    setActiveLayer(state, layerId) {
      state.layers.forEach(function (layer) {
        layer.selected = layer.id === layerId;
      })
    },
    updateGraphData(state, newGraphData) {
      state.graphData = newGraphData;
    },
    updateTableRows(state, newTableRows) {
      state.tableData.rows = newTableRows;
    },
    updateStats(state, newStats) {
      state.stats = newStats;
    },
    changeCurrentIteration(state, newIterationNum) {
      state.currentIteration = newIterationNum
    },
    changeDataset(state, newDataset) {
      state.dataset = newDataset;
    }
  },
  actions: {
    loadIterationFile(context, newIterationNum) {
      context.commit('changeCurrentIteration', newIterationNum);
      $.getJSON(`static/mapper_graphs/${context.state.dataset}/${context.state.currentIteration}.json`, function (newGraphData) {
        context.commit('updateGraphData', newGraphData);
        console.log('Loaded iteration = ', context.state.dataset, context.state.currentIteration)
      });
    },
    changeDataset(context, newDataset) {
      context.commit('changeDataset', newDataset);
      context.dispatch('loadIterationFile', 0);
    }
  },
  modules: {},
  getters: {
    getLayers: state => state.layers,
    getCurrentLayer: state => {
      for (let layer in state.layers) {
        if (layer.selected === true) {
          return layer.id;
        }
      }
    }
  }
})
