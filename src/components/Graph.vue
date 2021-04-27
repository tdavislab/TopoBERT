<template>
  <div class="col-8">
    <div id="graph" class="border rounded">
      <svg id="mapper-graph" v-bind:width="width" v-bind:height="height"></svg>
    </div>
  </div>
</template>

<script>
import ForceGraph from './ForceGraph';
import * as d3 from "d3";

function updateTable(node, store) {
  let rawRowData = node.datum().membership.metadata;
  let rowData = rawRowData.map(d => [...d.slice(0, 4), d[4].toFixed(2)]);
  store.commit('updateTableRows', rowData);
  let newStats = {
    nodeName: node.datum().id,
    numMembers: node.datum().membership.metadata.length,
    avgNorm: node.datum().l2avg.toFixed(2)
  }
  store.commit('updateStats', newStats);
}

function nodeClickDecoration(clickedNode, allNodes) {
  allNodes.attr('stroke-width', '1px');
  clickedNode.attr('stroke-width', '3px');
}

function dismissClickSelection(clickEvent, app) {
  if (clickEvent.target.id === 'mapper-graph') {
    app.graph.nodes.attr('stroke-width', '1px');
    app.$store.commit('resetTableRows');
    app.$store.commit('resetStats');
  }
}

export default {
  name: "Graph",
  data() {
    return {
      width: "100%",
      height: "100%",
      graph: '',
      graphData: '',
    }
  },
  mounted: function () {
    this.$store.commit('setGraph', new ForceGraph('#mapper-graph', this.width, this.height));
    this.graph = this.$store.state.graph;
    this.graph.graphDataBackup(this.$store.state.graphData);
    const parent = this;
    parent.graph.svg.on('click', function (e) {
      dismissClickSelection(e, parent);
    })

    parent.graph.nodes.on('click', function (d) {
      console.log('d', d);
      let node = d3.select(this);
      updateTable(node, parent.$store);
      nodeClickDecoration(node, parent.graph.nodes);
    });
  },
  watch: {
    '$store.state.graphData': function () {
      this.graph.graphDataBackup(this.$store.state.graphData);
      const parent = this;
      parent.graph.svg.on('click', function (e) {
        dismissClickSelection(e, parent);
      })
      parent.graph.nodes.on('click', function (d) {
        let node = d3.select(this);
        updateTable(node, parent.$store);
        nodeClickDecoration(node, parent.graph.nodes);
      });
      this.$store.dispatch('filterJaccard', -1.0);
    }
  },
  methods: {}
}
</script>

<style scoped>
#graph {
  /*margin-left: 0.8em;*/
  /*margin-right: 0.8em;*/
  /*background: #dddddd;*/
  margin-top: 0.5rem;
  height: 90vh;
}

</style>