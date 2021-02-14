<template>
  <div class="col-8">
    <div id="graph" class="border rounded">
      <svg id="mapper-graph" v-bind:width="width" v-bind:height="height">
      </svg>
    </div>
  </div>
</template>

<script>
import ForceGraph from './ForceGraph';
import * as d3 from "d3";

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
    this.graphData = this.$store.state.graphData;
    this.graph = new ForceGraph('#mapper-graph', this.width, this.height);
    this.graph.graphData(this.graphData);
    const store = this.$store;
    this.graph.nodes.on('click', function (d) {
      let node = d3.select(this);
      let rawRowData = node.datum().membership.metadata;
      let rowData = rawRowData.map(d => [...d.slice(0, 4), d[4].toFixed(2)]);
      store.commit('updateTableRows', rowData);
      let newStats = {
        nodeName: node.datum().id,
        numMembers: node.datum().membership.metadata.length,
        avgNorm: node.datum().l2avg.toFixed(2)
      }
      store.commit('updateStats', newStats);
    })
  },
  watch: {
    '$store.state.graphData': function () {
      this.graphData = this.$store.state.graphData;
      this.graph.simulation.stop();
      this.graph.graphData(this.graphData);
      const store = this.$store;
      this.graph.nodes.on('click', function (d) {
        let node = d3.select(this);
        let rawRowData = node.datum().membership.metadata;
        let rowData = rawRowData.map(d => [...d.slice(0, 4), d[4].toFixed(2)]);
        store.commit('updateTableRows', rowData);
        let newStats = {
          nodeName: node.datum().id,
          numMembers: node.datum().membership.metadata.length,
          avgNorm: node.datum().l2avg.toFixed(2)
        }
        store.commit('updateStats', newStats);
      })
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
  padding: 0;
  height: 85vh;
}
</style>