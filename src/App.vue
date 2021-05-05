<template>
  <div>
    <nav id="header" class="navbar navbar-static-top navbar-dark bg-dark">
      <h1 id="header-text" class="navbar-brand">TopoBERT</h1>
    </nav>

    <div id="app-body" class="container-fluid">
      <div class="row">
        <Graph class="col-8"></Graph>
        <div class="col-4">
          <div>
            <!-- <Layers v-bind:layers="layers" v-on:layerClicked="clickLayer" class="col-2"></Layers> -->
            <DatasetSelector></DatasetSelector>
            <IterationSlider></IterationSlider>
          </div>
          <JaccardFilter></JaccardFilter>
          <Stats></Stats>
          <LabelFilter></LabelFilter>
          <Table></Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Layers from "./components/Layers";
import Graph from "./components/Graph";
import IterationSlider from "./components/IterationSlider";
import Table from "./components/Table";
import Stats from "./components/Stats";
import DatasetSelector from "./components/DatasetSelector";
import JaccardFilter from "./components/JaccardFilter";
import LabelFilter from "./components/LabelFilter";

export default {
  name: 'App',
  components: {
    LabelFilter,
    // Layers,
    DatasetSelector,
    IterationSlider,
    Graph,
    Stats,
    Table,
    JaccardFilter
  },
  data() {
    return {};
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
