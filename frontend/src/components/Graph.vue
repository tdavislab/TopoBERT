<template>
  <div class="col-8">
    <div id="graph" class="border rounded" style="position: relative">
      <Minimap></Minimap>
      <svg id="mapper-graph" v-bind:width="width" v-bind:height="height"></svg>
    </div>
    <div class="overlay h-100 w-100 justify-content-center align-items-center">
      <div id="spinner-holder" class="mt-3 text-center" style="display:none">
        <div id="spinner" class="spinner-border text-light">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import ForceGraph from "./ForceGraph";
import Minimap from "@/components/Minimap";

export default {
  name: "Graph",
  components: {Minimap},
  data() {
    return {
      width: "100%",
      height: "100%",
      graph: "",
      graphData: "",
    };
  },
  mounted: function () {
    this.$store.commit(
        "setGraph",
        new ForceGraph("#mapper-graph", this.width, this.height)
    );
    this.$store.dispatch("drawGraph");
  },
  watch: {
    "$store.state.graphData": function () {
      this.$store.dispatch("drawGraph");
    },
  },
  methods: {},
};
</script>

<style scoped>
#graph {
  margin-top: 0.5rem;
  height: 90vh;
}

.overlay {
  background: #000000;
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0.5;
}

@keyframes spinner {
  from {
    -moz-transform: scale(1.0);
    -ms-transform: scale(1.0);
    transform: scale(1.0);
  }
  to {
    -moz-transform: scale(1.2);
    -ms-transform: scale(1.2);
    transform: scale(1.2);
  }
}
</style>