import {createStore} from 'vuex';
import layerData from '../../public/static/data/layerData.json';
import labels from '../../public/static/data/labels.json'
import graphData from '../../public/static/mapper_graphs/euclidean_l2_50_50/0.json';
import sentData from '../../public/static/sentences.json';

import $ from 'jquery';
import * as d3 from "d3";
import {colorScale} from "../public/static/colorScale.js"

function updateTable(node, context) {
  let rawRowData = node.datum().membership.metadata;
  let sortingArr = [...d3.rollup(rawRowData, v => v.length, d => d[3]).entries()].sort((x, y) => y[1] - x[1]).map(d => d[0]);
  let rowData = rawRowData.map(d => [...d.slice(0, 4), d[4].toFixed(2)]);
  rowData.sort((a, b) => sortingArr.indexOf(a[3]) - sortingArr.indexOf(b[3]));

  context.commit('updateTableRows', rowData);
  let newStats = {
    nodeName: node.datum().id,
    numMembers: node.datum().membership.metadata.length,
    avgNorm: node.datum().l2avg.toFixed(2)
  }
  context.commit('updateStats', newStats);
}

function nodeClickDecoration(clickedNode, allNodes, state) {
  // allNodes.attr('stroke-width', '1px');
  // clickedNode.attr('stroke-width', '3px');
  // allNodes.selectAll('path').attr('stroke-width', '0.4px');
  // clickedNode.selectAll('path').attr('stroke-width', '1.5px');

  allNodes.selectAll('.outline').remove();
  clickedNode.insert('circle', ':first-child')
    .attr('class', 'outline')
    .attr('r', state.graph.nodeSizeScale(clickedNode.datum()["membership"]["membership_ids"].length) + 2)
    .attr('cx', 0)
    .attr('cy', 0);
}

function dismissClickSelection(clickEvent, context) {
  if (clickEvent.target.id === 'mapper-graph') {
    // context.state.graph.nodes.attr('stroke-width', '1px');
    context.state.graph.nodes.selectAll('.outline').remove();
    context.state.graph.nodes.attr('opacity', '1');
    context.state.graph.links.attr('opacity', '1');
    context.commit('resetTableRows');
    context.commit('resetStats');
    context.commit('resetLabelSelection');
    context.commit('resetLabelThreshold');
  }
}

let handTunedColorScale = colorScale;

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
    labels: labels.labels,
    nodeColorScale: d3.scaleOrdinal().domain(labels.labels.map(d => d.label)).range(labels.labels.map(d => handTunedColorScale[d.label])),
    labelThreshold: 0
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
    updateThreshold(state, newThreshold) {
      state.labelThreshold = newThreshold;
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
    resetLabelThreshold(state) {
      state.labelThreshold = 0;
      $('#threshold-slider').val(0);
    }
  },
  actions: {
    loadIterationFile(context, newIterationNum) {
      context.commit('changeCurrentIteration', newIterationNum);
      context.commit('resetTableRows');
      context.commit('resetStats');
      $.getJSON(`static/mapper_graphs/${context.state.dataset}/${context.state.currentIteration}.json`, updateGraph)
        .done(function () {
          console.log('Loaded iteration = ', context.state.dataset, context.state.currentIteration);
        })
        .fail(function () {
          $.getJSON(process.env.VUE_APP_ROOT_API + 'get_graph',
            {dataset: context.state.dataset, iteration: context.state.currentIteration},
            function (response) {
              console.log('success', response);
              $.getJSON(`static/mapper_graphs/${context.state.dataset}/${context.state.currentIteration}.json`, updateGraph);
            })
            .fail((response) => {
              console.log('failure', response)
            });
        })

      function updateGraph(newGraphData) {
        context.commit('updateGraphData', newGraphData);
        context.commit('changeGraphType', context.state.graphType);
      }
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
      function labelCriteria(metadata, activeLabels, labelThreshold) {
        function majorityLabel(dataarray) {
          let arr = dataarray.map(d => d[3]);
          return arr.sort((a, b) => arr.filter(v => v === a).length - arr.filter(v => v === b).length).pop();
        }

        if (0 < labelThreshold && labelThreshold < 100) {
          // Fractional filtering
          let overlap = metadata.filter(d => activeLabels.includes(d[3]));
          return (overlap.length / metadata.length) > labelThreshold / 100;
        } else if (100 <= labelThreshold && labelThreshold <= 200) {
          let overlap = metadata.filter(d => activeLabels.includes(d[3]));
          return overlap.length >= labelThreshold - 100;
        }
        return activeLabels.includes(majorityLabel(metadata));
      }

      let labelThreshold = context.state.labelThreshold;

      if (label === -1) {
        context.commit('resetLabelSelection');
        context.commit('resetLabelThreshold');
        context.state.graph.nodes.attr('opacity', '1');
        context.state.graph.links.attr('opacity', '1');
      } else {
        context.commit('toggleLabelSelection', label);
        let activeLabels = context.state.labels.filter(d => d.selected === true).map(d => d.label);
        if (activeLabels.length === 0) {
          context.state.graph.nodes.attr('opacity', '1');
          context.state.graph.links.attr('opacity', '1');
        } else {
          context.state.graph.nodes.filter(d => !labelCriteria(d.membership.metadata, activeLabels, labelThreshold)).attr('opacity', '0.05');
          context.state.graph.nodes.filter(d => labelCriteria(d.membership.metadata, activeLabels, labelThreshold)).attr('opacity', '1');
          context.state.graph.links.attr('opacity', '0.05');
        }
      }
    },
    searchWord(context, searchTerm) {
      function searchCriteria(metadata, searchTerm) {
        let words = metadata.map(d => d[2]);
        return words.includes(searchTerm);
      }

      if (searchTerm === '') {
        context.state.graph.nodes.attr('opacity', '1');
        context.state.graph.links.attr('opacity', '1');
      } else {
        context.state.graph.nodes.filter(d => !searchCriteria(d.membership.metadata, searchTerm)).attr('opacity', '0.05');
        context.state.graph.nodes.filter(d => searchCriteria(d.membership.metadata, searchTerm)).attr('opacity', '1');
        context.state.graph.links.attr('opacity', '0.05');
      }
    },
    thresholdChanged(context, newThreshold) {
      context.commit('updateThreshold', newThreshold);
      context.dispatch('filterLabel', newThreshold);
    },
    drawGraph(context) {
      // Draw graph using the layout parameter
      // if (context.state.graphType === 'force') {
      //   context.state.graph.graphDataForce(context.state.graphData);
      // } else if (context.state.graphType === 'pca') {
      //   context.state.graph.graphDataPCA(context.state.graphData);
      // }

      let state = context.state;
      let graph = state.graph;
      graph.graphData(state.graphData, state.graphType, state.nodeColorScale);

      graph.svg.on('click', function (clickEvent) {
        dismissClickSelection(clickEvent, context)
      });

      graph.nodes.on('click', function (clickEvent) {
        let node = d3.select(this);
        updateTable(node, context);
        nodeClickDecoration(node, state.graph.nodes, state);
      });

      // graph.colorNodesByLabel(state.labels.map(d => d.label), state.nodeColorScale);
      context.dispatch('filterJaccard', context.state.jaccardFilter);
      context.dispatch('filterLabel', null);
      // context.dispatch('searchWord', $('#searchBar').val());
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
    },
  }
})
