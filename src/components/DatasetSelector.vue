<template>
  <div id="dataset-selector-div">
    <div class="input-group">
      <div class="input-group-prepend">
        <label for="param-metric" class="input-group-text">Metric</label>
      </div>
      <select id="param-metric" class="form-select" v-model="params.metric" v-on:change="paramChanged()">
        <option disabled value="" selected>Distance metric</option>
        <option value="euclidean">Euclidean</option>
        <option value="cosine">Cosine</option>
      </select>
    </div>

    <div class="input-group">
      <div class="input-group-prepend">
        <label for="param-filter" class="input-group-text">Filter</label>
      </div>
      <select id="param-filter" class="form-select" v-model="params.filter" v-on:change="paramChanged()">
        <option disabled value="" selected>Filter function</option>
        <option value="l2">L2</option>
      </select>
    </div>

    <div class="input-group">
      <div class="input-group-prepend">
        <label for="param-intervals" class="input-group-text">Intervals</label>
      </div>
      <select id="param-intervals" class="form-select" v-model="params.intervals" v-on:change="paramChanged()">
        <option disabled value="" selected>Intervals</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>

    <div class="input-group">
      <div class="input-group-prepend">
        <label for="param-overlap" class="input-group-text">Overlap</label>
      </div>
      <select id="param-overlap" class="form-select" v-model="params.overlap" v-on:change="paramChanged()">
        <option disabled value="" selected>Overlap</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="75">75</option>
      </select>
    </div>

    <button id="run-btn" class="btn btn-primary" v-on:click="changeDataset()">Update graph</button>
  </div>
</template>

<script>
import {mapState} from "vuex";
import $ from "jquery";

export default {
  name: "DatasetSelector",
  data() {
    this.params = {
      metric: 'euclidean',
      filter: 'l2',
      intervals: '50',
      overlap: '50',
    }
  },
  methods: {
    changeDataset() {
      let {metric, filter, intervals, overlap} = this.params;
      let newDataset = `${metric}_${filter}_${intervals}_${overlap}`;
      this.$store.dispatch('changeDataset', newDataset);
    },
    paramChanged() {
      $('#run-btn').prop('disabled', false);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/variables.scss';

.input-group-prepend {
  width: 35%;
}

#dataset-selector-div {
  margin: 0.5rem;
  display: grid;
  grid-gap: 1rem;
  grid-template: 1fr 1fr / 1fr 1fr;
}

</style>