<template>
  <div id="dataset-selector-div">
    <div class="input-group">
      <div class="input-group-prepend w-30">
        <label for="param-metric" class="input-group-text w-100">Dataset</label>
      </div>
      <select
          id="dataset-picker"
          class="custom-select w-50"
          v-model="params.dataset"
          v-on:change="paramChanged()"
      >
        <option disabled value="" selected>Select dataset</option>
        <option value="ss-role">SuperSense-Role</option>
        <option value="ss-func">SuperSense-Function</option>
        <option value="pos">Part of Speech</option>
        <option value="dep">Dependency</option>
      </select>
    </div>

    <div class="input-group">
      <div class="input-group-prepend w-30">
        <label for="param-metric" class="input-group-text w-100">Metric</label>
      </div>
      <select
          id="param-metric"
          class="custom-select w-50"
          v-model="params.metric"
          v-on:change="paramChanged()"
      >
        <option disabled value="" selected>Distance metric</option>
        <option value="euclidean">Euclidean</option>
        <option value="cosine">Cosine</option>
      </select>
    </div>

    <div class="input-group">
      <div class="input-group-prepend w-30">
        <label for="param-filter" class="input-group-text w-100">Filter</label>
      </div>
      <select
          id="param-filter"
          class="custom-select w-50"
          v-model="params.filter"
          v-on:change="paramChanged()"
      >
        <option disabled value="" selected>Filter function</option>
        <option value="l1">L1</option>
        <option value="l2">L2</option>
        <option value="knn5">Average KNN - 5</option>
      </select>
    </div>

    <div class="input-group">
      <div class="input-group-prepend w-30">
        <label for="param-intervals" class="input-group-text w-100"
        >Intervals</label
        >
      </div>
      <select
          id="param-intervals"
          class="custom-select w-50"
          v-model="params.intervals"
          v-on:change="paramChanged()"
      >
        <option disabled value="" selected>Intervals</option>
        <option
            v-for="intervalElem in intervalList"
            v-bind:value="intervalElem"
            v-bind:selected="intervalElem === 50"
        >
          {{ intervalElem }}
        </option>
      </select>
    </div>

    <div class="input-group">
      <div class="input-group-prepend w-30">
        <label for="param-overlap" class="input-group-text w-100"
        >Overlap</label
        >
      </div>
      <select
          id="param-overlap"
          class="custom-select w-50"
          v-model="params.overlap"
          v-on:change="paramChanged()"
      >
        <option disabled value="">Overlap</option>
        <option
            v-for="overlapElem in overlapList"
            v-bind:value="overlapElem"
            v-bind:selected="overlapElem === 50"
        >
          {{ overlapElem }}
        </option>
      </select>
    </div>

    <div class="input-group">
      <div class="input-group-prepend w-30">
        <label for="param-layout" class="input-group-text w-100">Layout</label>
      </div>
      <select
          id="param-layout"
          class="custom-select w-50"
          v-model="params.layout"
          v-on:change="layoutChanged()"
      >
        <option disabled value="" selected>Select graph layout</option>
        <option value="force">Force directed</option>
        <option value="pca">PCA</option>
      </select>
    </div>
    <button id="run-btn" class="btn btn-primary" v-on:click="changeDataset()">
      Update graph
    </button>
  </div>
</template>

<script>
// import {mapState} from "vuex";
import $ from "jquery";
import {mapState} from "vuex";

export default {
  name: "DatasetSelector",
  data() {
    this.params = {
      metric: "euclidean",
      filter: "l2",
      intervals: 50,
      overlap: 50,
      layout: "force",
      dataset: "ss-role"
    };
    return {};
  },
  computed: mapState({
    intervalList: (state) => state.datasetConfigs.intervals,
    overlapList: (state) => state.datasetConfigs.overlaps,
  }),
  methods: {
    changeDataset() {
      let {metric, filter, intervals, overlap} = this.params;
      let newDataset = `${metric}_${filter}_${intervals}_${overlap}`;
      this.$store.dispatch("changeDataset", newDataset);
    },
    paramChanged() {
      $("#run-btn").prop("disabled", false);
    },
    layoutChanged() {
      let layout = this.params.layout;
      this.$store.commit("changeGraphType", layout);
      this.$store.dispatch("drawGraph");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/variables.scss";

.input-group-prepend {
  width: 35%;
}

#run-btn {
  grid-column: 1 / 3;
}

#dataset-selector-div {
  margin: 0.5rem;
  display: grid;
  grid-gap: 1rem;
  grid-template: 1fr 1fr / 1fr 1fr;
}
</style>