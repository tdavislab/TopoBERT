import {createStore} from 'vuex';
import layerData from '../../public/static/data/layerData.json';
import labels from '../../public/static/data/labels.json'
import graphData from '../../public/static/mapper_graphs/euclidean_l2_50_50/0.json';
import sentData from '../../public/static/sentences.json';

import $ from 'jquery';
import * as d3 from "d3";

function updateTable(node, context) {
  let rawRowData = node.datum().membership.metadata;
  let rowData = rawRowData.map(d => [...d.slice(0, 4), d[4].toFixed(2)]);
  context.commit('updateTableRows', rowData);
  let newStats = {
    nodeName: node.datum().id,
    numMembers: node.datum().membership.metadata.length,
    avgNorm: node.datum().l2avg.toFixed(2)
  }
  context.commit('updateStats', newStats);
}

function nodeClickDecoration(clickedNode, allNodes) {
  allNodes.attr('stroke-width', '1px');
  clickedNode.attr('stroke-width', '3px');
}

function dismissClickSelection(clickEvent, context) {
  if (clickEvent.target.id === 'mapper-graph') {
    context.state.graph.nodes.attr('stroke-width', '1px');
    context.commit('resetTableRows');
    context.commit('resetStats');
  }
}

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
    },
    labels: labels.labels
  },
  mutations: {
    toggleLabelSelection(state, selectedLabel) {
      state.labels.forEach(function (labelItem) {
        if (labelItem.label === selectedLabel) {
          labelItem.selected = !labelItem.selected;
        }
      });
    },
    resetLabelSelection(state) {
      state.labels.forEach(function (label) {
        label.selected = false;
      });
    },
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
      context.dispatch('loadIterationFile', context.state.currentIteration);
    },
    filterJaccard(context, newJaccard) {
      if (newJaccard !== -1.0) {
        context.commit('changeJaccard', newJaccard);
      }
      context.state.graph.links.attr('visibility', 'visible');
      context.state.graph.links.filter(d => d.intersection <= context.state.jaccardFilter).attr('visibility', 'hidden');
    },
    filterLabel(context, label) {
      function labelCriteria(metadata, activeLabels) {
        let total = metadata.length;
        let overlap = metadata.filter(d => activeLabels.includes(d[3]));
        return overlap.length > 0;
      }

      if (label === -1) {
        context.commit('resetLabelSelection');
        context.state.graph.nodes.attr('opacity', '1');
        context.state.graph.links.attr('opacity', '1');
      } else {
        context.commit('toggleLabelSelection', label);
        let activeLabels = context.state.labels.filter(d => d.selected === true).map(d => d.label);
        if (activeLabels.length === 0) {
          context.state.graph.nodes.attr('opacity', '1');
          context.state.graph.links.attr('opacity', '1');
        } else {
          context.state.graph.nodes.filter(d => !labelCriteria(d.membership.metadata, activeLabels)).attr('opacity', '0.3');
          context.state.graph.nodes.filter(d => labelCriteria(d.membership.metadata, activeLabels)).attr('opacity', '1');
          context.state.graph.links.attr('opacity', '0.3');
        }
      }
    },
    drawGraph(context) {
      // Draw graph using the layout parameter
      if (context.state.graphType === 'force') {
        context.state.graph.graphDataForce(context.state.graphData);
      } else if (context.state.graphType === 'pca') {
        context.state.graph.graphDataPCA(context.state.graphData);
      }

      context.state.graph.svg.on('click', function (clickEvent) {
        dismissClickSelection(clickEvent, context)
      });

      context.state.graph.nodes.on('click', function (clickEvent) {
        let node = d3.select(this);
        updateTable(node, context);
        nodeClickDecoration(node, context.state.graph.nodes);
      });

      context.dispatch('filterJaccard', context.state.jaccardFilter);
      context.dispatch('filterLabel', null);
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
