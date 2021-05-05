<template>
  <div class="col-8">
    <div id="graph" class="border rounded" style="position:relative;">
      <Minimap></Minimap>
      <svg id="mapper-graph" v-bind:width="width" v-bind:height="height"></svg>
    </div>
  </div>
</template>

<script>
import ForceGraph from './ForceGraph';
import Minimap from "@/components/Minimap";

export default {
  name: "Graph",
  components: {Minimap},
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
    this.$store.dispatch('drawGraph');
    // parent.graph.svg.on('click', function (e) {
    //   dismissClickSelection(e, parent);
    // })
    //
    // parent.graph.nodes.on('click', function (d) {
    //   let node = d3.select(this);
    //   updateTable(node, parent.$store);
    //   nodeClickDecoration(node, parent.graph.nodes);
    // });
  },
  watch: {
    '$store.state.graphData': function () {
      this.$store.dispatch('drawGraph');
      // parent.graph.svg.on('click', function (e) {
      //   dismissClickSelection(e, parent);
      // })
      // parent.graph.nodes.on('click', function (d) {
      //   let node = d3.select(this);
      //   updateTable(node, parent.$store);
      //   nodeClickDecoration(node, parent.graph.nodes);
      // });
      // this.$store.dispatch('filterJaccard', -1.0);
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