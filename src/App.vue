<template>
  <nav id="header" class="navbar navbar-static-top navbar-dark bg-dark">
    <h1 id="header-text" class="navbar-brand">Probing with TopoAct</h1>
  </nav>

  <div id="app-body" class="container-fluid">
    <div class="row pt-2">
      <Layers v-bind:layers="layers" v-on:layerClicked="clickLayer" class="col-6"></Layers>
      <DatasetSelector class="col-2"></DatasetSelector>
      <IterationSlider class="col-4"></IterationSlider>
    </div>

    <div class="row">
      <Graph class="col-8"></Graph>
      <div class="col-4">
        <Stats></Stats>
        <Table></Table>
      </div>
    </div>
  </div>
</template>

<script>
import store from "./store/index.js";
import Layers from "./components/Layers";
import Graph from "./components/Graph";
import IterationSlider from "./components/IterationSlider";
import Table from "./components/Table";
import Stats from "./components/Stats";
import DatasetSelector from "./components/DatasetSelector";

export default {
  name: 'App',
  components: {
    Layers,
    DatasetSelector,
    IterationSlider,
    Graph,
    Stats,
    Table
  },
  data() {

  },
  methods: {
    clickLayer(layerId) {
      this.layers.forEach(layerElement => {
        layerElement.selected = (layerId === layerElement.id);
      })
    }
  }
}
</script>

<style lang="scss">
@import './assets/styles/variables.scss';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

#app-body {
  padding-right: 1.5em;
  padding-left: 1.5em;
  //background: $master-bg-color;
  //color: white
}

#header-text {
  padding-left: 1em;
}

</style>
