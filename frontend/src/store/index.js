import {createStore} from 'vuex';
import layerData from '../assets/data/layerData.json';
import labels from '../assets/data/labels.json'
import pointLabels from '../assets/data/point_data_labels.json'
import graphData from '../../public/static/mapper_graphs/euclidean_l2_50_50/0.json';
import sentData from '../assets/data/sentences.json';
import {colorScale} from '../assets/data/colorScale.js';

import $ from 'jquery';
import * as d3 from 'd3';

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

// let handTunedColorScale = colorScale;

export default createStore({
  state: {
    showTest: true,
    dataSplit: 'train',
    layers: layerData.layerData,
    graph: [],
    graphData: graphData,
    projectionData: {
      type: "scatter",
      data: {
        labels: ['All data'],
        datasets: [
          {
            label: '',
            data: []
          }
        ]
      },
      width: 800,
      height: 400,
      options: {
        responsive: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: x => '',
              footer: x => ''
            }
          }
        }
      }
    },
    projChartRef: null,
    purityChartRef: null,
    purityData: {
      type: "line",
      data: {
        labels: Array.from({length: 177}, (v, x) => x),
        datasets: [
          {
            label: "",
            data: [],
          },
        ],
      },
      width: 800,
      height: 400,
      options: {
        responsive: false,
        pan: {
          enabled: true,
          mode: 'x',
        },
      }
    },
    purityHists: {
      "p.Accompanier": [],
      "p.Agent": [],
      "p.Approximator": [],
      "p.Beneficiary": [],
      "p.Causer": [],
      "p.Characteristic": [],
      "p.Circumstance": [],
      "p.Co-Agent": [],
      "p.Co-Theme": [],
      "p.ComparisonRef": [],
      "p.Cost": [],
      "p.Direction": [],
      "p.Duration": [],
      "p.EndTime": [],
      "p.Experiencer": [],
      "p.Explanation": [],
      "p.Extent": [],
      "p.Frequency": [],
      "p.Gestalt": [],
      "p.Goal": [],
      "p.Identity": [],
      "p.Instrument": [],
      "p.Interval": [],
      "p.Locus": [],
      "p.Manner": [],
      "p.Means": [],
      "p.OrgRole": [],
      "p.Originator": [],
      "p.PartPortion": [],
      "p.Path": [],
      "p.Possession": [],
      "p.Possessor": [],
      "p.Purpose": [],
      "p.Quantity": [],
      "p.RateUnit": [],
      "p.Recipient": [],
      "p.SocialRel": [],
      "p.Source": [],
      "p.Species": [],
      "p.StartTime": [],
      "p.Stimulus": [],
      "p.Stuff": [],
      "p.Theme": [],
      "p.Time": [],
      "p.Topic": [],
      "p.Whole": []
    },
    histCharRef: null,
    graphType: 'force',
    sentData: sentData,
    param_str: 'ss-role_euclidean_l2_50_50',
    datasetConfigs: {
      intervals: [25, 50, 100],
      overlaps: [25, 50, 75]
    },
    currentIteration: 0,
    currentProjection: 'PCA',
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
    colorScale: colorScale,
    selectedMemberIds: [],
    // nodeColorScale: d3.scaleOrdinal().domain(labels.labels.map(d => d.label)).range(labels.labels.map(d => handTunedColorScale[d.label]).concat(handTunedColorScale['Others'])),
    labelThreshold: 0,
  },
  getters: {
    getLayers: state => state.layers,
    getCurrentLayer: state => {
      for (let layer in state.layers) {
        if (layer.selected === true) {
          return layer.id;
        }
      }
    },
    nodeColorMap: state => d3.scaleOrdinal().domain(state.labels.map(d => d.label)).range(state.labels.map(d => state.colorScale[d.label]))
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
    setSelectedMemberIds(state, memberIds) {
      state.selectedMemberIds = memberIds
    },
    setGraph(state, forceGraphObj) {
      state.graph = forceGraphObj;
    },
    updateGraphData(state, newGraphData) {
      state.graphData = newGraphData;
    },
    updatePurityHists(state, newPurityData) {
      state.purityHists = newPurityData;
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
    updateColorMap(state, newColorMap) {
      state.colorScale = newColorMap;
    },
    updateCurrentProjection(state, newProjMethod) {
      state.currentProjection = newProjMethod;
    },
    updateProjectionData(state, {processedData, proj}) {
      state.projectionData.data.datasets[0].data = processedData;
      if (state.selectedMemberIds.length === 0) {
        state.projectionData.data.datasets[0].backgroundColor = processedData.map(d => state.colorScale[d.label]);
      } else {
        state.projectionData.data.datasets[0].backgroundColor = processedData.map(d =>
          state.selectedMemberIds.includes(d.index) ? state.colorScale[d.label] : 'rgb(144,144,144, 0.1)')
      }
      state.projectionData.data.datasets[0].label = proj;
    },
    addDataSetConfig(state, newConfig) {
      let {interval, overlap} = newConfig;
      if (interval !== '') {
        let intervalArr = state.datasetConfigs.intervals;
        console.log(intervalArr);
        if (!intervalArr.includes(interval)) {
          intervalArr.push(parseInt(interval));
          state.datasetConfigs.intervals.sort(function (a, b) {
            return a - b;
          });
        }

        // state.datasetConfigs.intervals.push(parseInt(interval));
      }
      if (overlap !== '') {
        let overlapArr = state.datasetConfigs.overlaps;
        if (!overlapArr.includes(overlap)) {
          overlapArr.push(parseInt(overlap));
          state.datasetConfigs.overlaps.sort(function (a, b) {
            return a - b;
          });
        }
        // state.datasetConfigs.overlaps.push(parseInt(overlap));
      }
    },
    changeCurrentIteration(state, newIterationNum) {
      state.currentIteration = newIterationNum
    },
    changeDataset(state, newDataset) {
      state.param_str = newDataset;
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
    },
    setDataSplit(state, newSplit) {
      state.dataSplit = newSplit;
    },
  },
  actions: {
    loadIterationFile(context, newIterationNum) {
      context.commit('changeCurrentIteration', newIterationNum);
      context.commit('resetTableRows');
      context.commit('resetStats');

      // $.getJSON(`static/mapper_graphs/${context.state.dataset}/${context.state.currentIteration}.json`, updateGraph)
      //   .done(function () {
      //     console.log('Loaded iteration = ', context.state.param_str, context.state.currentIteration);
      //   })
      //   .fail(function () {
      //     $.getJSON(process.env.VUE_APP_ROOT_API + 'get_graph',
      //       {dataset: context.state.param_str, iteration: context.state.currentIteration},
      //       function (response) {
      //         console.log('success', response);
      //         $.getJSON(`static/mapper_graphs/${context.state.dataset}/${context.state.currentIteration}.json`, updateGraph);
      //       })
      //       .fail((response) => {
      //         console.log('failure', response)
      //       });
      //   })

      // make ajax call to get graph data
      // let url = process.env.VUE_APP_ROOT_API + 'graph';
      let url;
      if (context.state.dataSplit === 'trainknntest') {
        url = process.env.VUE_APP_ROOT_API + 'show_test';
      } else {
        url = process.env.VUE_APP_ROOT_API + 'graph';
      }

      $.ajax({
        url: url,
        type: 'GET',
        data: {
          params: context.state.param_str,
          iteration: context.state.currentIteration,
          layer: context.state.layers.filter(layer => layer.selected)[0].id,
          datasplit: context.state.dataSplit
        },
        beforeSend: function () {
          $('.overlay').addClass('d-flex').show();
          $('#spinner-holder').show();
        },
        success: function (response) {
          updateGraph(response.graph);
          updatePurityHists(response.purities);
          // console.log(context.state.purityHists);
        },
        complete: function () {
          $('.overlay').removeClass('d-flex').hide();
          $('#spinner-holder').hide();
        },
        error: function (response) {
          console.log('failure', response)
        }
      });

      function updateGraph(newGraphData) {
        context.commit('updateGraphData', newGraphData);
        context.commit('changeGraphType', context.state.graphType);
      }

      function updatePurityHists(newPurityData) {
        context.commit('updatePurityHists', newPurityData);
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
      graph.graphData(state.graphData, state.graphType, context.getters.nodeColorMap);

      graph.svg.on('click', function (clickEvent) {
        context.commit('setSelectedMemberIds', []);
        // let processedData = context.state.projectionData.data.datasets[0].data;
        // let proj = context.state.projectionData.data.datasets[0].label;
        // context.commit('updateProjectionData', {processedData, proj})
        // context.state.chartRef.update();
        dismissClickSelection(clickEvent, context)
      });

      graph.nodes.on('click', function (clickEvent) {
        let node = d3.select(this);
        console.log(node)
        updateTable(node, context);
        let node_member_ids = node.datum().membership.membership_ids;
        context.commit('setSelectedMemberIds', node_member_ids);
        let processedData = context.state.projectionData.data.datasets[0].data;
        let proj = context.state.projectionData.data.datasets[0].label;
        context.commit('updateProjectionData', {processedData, proj})
        context.state.projChartRef.update();
        nodeClickDecoration(node, state.graph.nodes, state);
        context.dispatch('drawNodePurities', node_member_ids);
      });

      // graph.colorNodesByLabel(state.labels.map(d => d.label), state.nodeColorScale);
      context.dispatch('filterJaccard', context.state.jaccardFilter);
      context.dispatch('filterLabel', null);
      if (context.state.labels.filter(d => d.selected === true).length === 0) {
        // If no active filtering then apply search word
        context.dispatch('searchWord', $('#searchBar').val());
      }
      context.dispatch('drawProjection', context.state.currentProjection);
    },
    toggleNodeSize(context, nodeSizeType) {
      context.state.graph.toggleNodeSize(nodeSizeType);
    },
    drawProjection(context, proj) {
      context.commit('updateCurrentProjection', proj);

      $('.loader').prop('hidden', null);
      let url = process.env.VUE_APP_ROOT_API + 'projection';
      // make ajax request to projection endpoint on the server to compute the projection
      $.ajax({
        url: url,
        type: 'GET',
        data: {
          proj_type: proj
        },
        beforeSend: function () {
          $('.loader').prop('hidden', null);
        },
        success: function (data) {
          let processedData = data.projection.map(d => {
            return {
              x: parseFloat(d.x), y: parseFloat(d.y),
              index: parseInt(d.index), word: d.word, label: d.label,
            }
          });
          context.commit('updateProjectionData', {processedData, proj});
          context.state.projChartRef.update();
        },
        error: function (error) {
          console.log(error);
        },
        complete: function () {
          $('.loader').prop('hidden', true);
        }
      });

      // d3.csv(`static/projections/${context.state.currentProjection}/${context.state.currentIteration}.csv`).then(function (data) {
      //   let processedData = data.map(d => {
      //     return {
      //       x: parseFloat(d.x), y: parseFloat(d.y),
      //       index: parseInt(d.index), word: d.word, label: d.label,
      //     }
      //   })
      //
      //   context.commit('updateProjectionData', {processedData, proj});
      //
      //   context.state.projectionData.options.plugins.tooltip.callbacks.footer = (toolTipItems) => {
      //     return toolTipItems.map(d => `${d.raw.label}-${d.raw.word}`);
      //   }
      //
      //   $('.loader').prop('hidden', true);
      //   context.state.projChartRef.update();
      // });
    },
    drawNodePurities(context, pointIds) {
      d3.csv('static/mapper_graphs/euclidean_l2_50_50/node_purities.csv').then(function (data) {
          // let pointIds = [0, 1, 2];
          pointIds = pointIds.slice(0, 20)
          // context.state.purityData.data.labels = Array.from({length: 177}, (v, x) => x);
          context.state.purityData.data.datasets = []
          for (let idx = 0; idx < pointIds.length; idx++) {
            let pointId = pointIds[idx];
            let pointData = data[pointId];
            context.state.purityData.data.datasets.push({label: `Point ${pointId} (${pointLabels[pointId][3]})`, data: [], borderColor: "#41B883"});
            for (let i = 0; i < 177; i++) {
              let keyName = `epoch_${i}_purity`;
              context.state.purityData.data.datasets[idx].data.push(pointData[keyName]);
            }
          }
          context.state.purityChartRef.update();
          // console.log(context.state.purityData)
          // let pointId = 0;
          // let pointData = data[pointId]
          // context.state.purityData.data.datasets[pointId].label = "Point 0";
          // context.state.purityData.data.datasets[pointId].data = [];
          // for (let i = 0; i < 177; i++) {
          //   let keyName = `epoch_${i}_purity`;
          //   context.state.purityData.data.datasets[pointId].data.push(pointData[keyName]);
          // }
          // console.log(context.state.purityData)
        }
      );
    },
  },
  modules: {}
})

// Projection data updated to reflect gray labels for non-selected points