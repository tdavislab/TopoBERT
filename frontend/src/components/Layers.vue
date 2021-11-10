<template>
  <div style="display: inline-block">
    <span class="d-inline-block" style="color: white">Select layer</span>
    <span v-for="layer in layers" v-bind:key="layer.id" class="layer-container">
      <span
          class="layer-button m-2"
          v-bind:class="{ 'layer-selected': layer.selected }"
          v-on:click="layerClicked(layer.id)"
      >
        {{ layer.id }}
      </span>
    </span>
  </div>
</template>

<script>
import {mapState, mapMutations} from "vuex";

export default {
  name: "Layers",
  data() {
    this.layers = this.$store.state.layers;
  },
  computed: mapState({
    layers: (state) => state.layers,
    currentLayer: (state) => state.currentLayer,
  }),
  methods: {
    layerClicked(layerId) {
      this.$store.commit("setActiveLayer", layerId);
      this.$store.dispatch("loadIterationFile", this.$store.state.currentIteration);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/variables.scss";

.layer-container {
  display: inline-block;
}

.layer-button {
  width: 3em;
  text-align: center;
  display: inline-block;
  padding: 0.5em 1em 0.5em 1em;
  border-radius: 7px;
  background-color: $layer-bg-color;
  color: $layer-text-color;
  font-weight: bolder;
  box-shadow: 1px 1px 10px -2px rgba(0, 0, 0, 0.5);
  -webkit-box-shadow: 1px 1px 10px -2px rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.layer-button:hover {
  background-color: $layer-bg-color-hover;
  box-shadow: 1px 1px 10px -2px rgba(0, 0, 0, 1);
  -webkit-box-shadow: 1px 1px 10px -2px rgba(0, 0, 0, 1);
  transition: 0.5s ease all;
}

.layer-selected {
  background-color: $layer-bg-color-selected;
}
</style>