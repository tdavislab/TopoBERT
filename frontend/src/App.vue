<template>
  <div>
    <nav
        id="header"
        class="
        navbar navbar-static-top navbar-dark
        bg-dark
        justify-content-between
      "
    >
      <h1 id="header-text" class="navbar-brand">TopoBERT</h1>
      <WordSearch></WordSearch>
                  <Layers></Layers>

      <ColorSchemeDesigner></ColorSchemeDesigner>
    </nav>


    <div id="app-body" class="container-fluid">
      <div class="row">
        <Graph class="col-8"></Graph>
        <div id="controls" class="col-4">
          <div>
            <DatasetSelector></DatasetSelector>
            <AddParamConfig></AddParamConfig>
            <Projection></Projection>
            <NodePurities></NodePurities>
            <IterationSlider></IterationSlider>
          </div>
          <JaccardFilter></JaccardFilter>
          <NodeSizeToggle></NodeSizeToggle>
          <Stats></Stats>
          <LabelFilter></LabelFilter>
          <Table></Table>
        </div>
      </div>
      <div class="row">
        <div id="projection" class="col-8">
          <canvas id="projection-canvas" width="100%" height="100%"></canvas>
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
import WordSearch from "./components/WordSearch";
import NodeSizeToggle from "./components/NodeSizeToggle";
import ColorSchemeDesigner from "./components/ColorSchemeDesigner";
import AddParamConfig from "./components/AddParamConfig";
import Projection from "./components/Projection";
import NodePurities from "./components/NodePurities";

export default {
  name: "App",
  components: {
    NodePurities,
    Projection,
    AddParamConfig,
    ColorSchemeDesigner,
    NodeSizeToggle,
    WordSearch,
    LabelFilter,
    Layers,
    DatasetSelector,
    IterationSlider,
    Graph,
    Stats,
    Table,
    JaccardFilter,
  },
  data() {
    return {};
  },
  methods: {
    clickLayer(layerId) {
      this.layers.forEach((layerElement) => {
        layerElement.selected = layerId === layerElement.id;
      });
    },
  },
};
</script>

<style lang="scss">
@import "./assets/styles/variables.scss";

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
