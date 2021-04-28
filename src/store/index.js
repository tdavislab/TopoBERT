import {createStore} from 'vuex'
import layerData from '../../public/static/data/layerData.json'
import graphData from '../../public/static/mapper_graphs/euclidean_l2_50_50/0.json'
import sentData from '../../public/static/sentences.json'

import $ from 'jquery'

export default createStore({
  state: {
    layers: layerData.layerData,
    graph: [],
    graphData: graphData,
    graphType: 'force',
    sentData: sentData,
    dataset: 'euclidean_l2_50_50',
    currentIteration: 0,
    jaccardFilter: 0.0,
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
    setGraph(state, forceGraphObj) {
      state.graph = forceGraphObj;
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
    },
    changeJaccard(state, newJaccardVal) {
      state.jaccardFilter = newJaccardVal;
    },
    changeGraphType(state, newGraphType) {
      state.graphType = newGraphType;
    },
    resetTableRows(state) {
      state.tableData.rows = [];
    },
    resetStats(state) {
      state.stats = {
        nodeName: '...',
        numMembers: '...',
        avgNorm: '...'
      }
    },
  },
  actions: {
    loadIterationFile(context, newIterationNum) {
      context.commit('changeCurrentIteration', newIterationNum);
      context.commit('resetTableRows');
      context.commit('resetStats');
      $.getJSON(`static/mapper_graphs/${context.state.dataset}/${context.state.currentIteration}.json`, function (newGraphData) {
        context.commit('updateGraphData', newGraphData);
        context.commit('changeGraphType', context.state.graphType);
      })
        .done(function () {
          console.log('Loaded iteration = ', context.state.dataset, context.state.currentIteration);
        })
        .fail(function () {
          $.getJSON(process.env.VUE_APP_ROOT_API + 'get_graph',
            {dataset: context.state.dataset, iteration: context.state.currentIteration},
            function (response) {
              console.log(response);
            })
        })
    },
    changeDataset(context, newDataset) {
      context.commit('changeDataset', newDataset);
      context.dispatch('loadIterationFile', 0);
    },
    filterJaccard(context, newJaccard) {
      if (newJaccard !== -1.0) {
        context.commit('changeJaccard', newJaccard);
      }
      context.state.graph.links.attr('visibility', 'visible');
      context.state.graph.links.filter(d => d.intersection <= context.state.jaccardFilter).attr('visibility', 'hidden');
    },
    drawGraph(context) {
      if (context.state.graphType === 'force') {
        context.state.graph.graphDataForce(context.state.graphData);
      }
      else if (context.state.graphType === 'pca') {
        context.state.graph.graphDataPCA(context.state.graphData);
      }
      context.dispatch('filterJaccard', context.state.jaccardFilter);
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
