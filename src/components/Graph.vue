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
  },
  watch: {
    '$store.state.graphData': function () {
      this.$store.dispatch('drawGraph');
    }
  },
  methods: {}
}
</script>

<style scoped>
#graph {
  margin-top: 0.5rem;
  height: 90vh;
}

</style>