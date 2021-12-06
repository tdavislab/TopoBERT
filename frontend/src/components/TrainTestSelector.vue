<template>
  <div class="traintest-selector-div">
    <div class="input-group">
      <div class="input-group-prepend">
        <label for="traintest-selector" class="input-group-text w-100">Data split</label>
      </div>
      <select id="traintest-selector" class="custom-select w-50" v-model="localDatasplit" v-on:change="datasplitChanged()">
        <option disabled value="">Select data split</option>
        <option value="train" selected>Train</option>
        <option value="test">Test</option>
        <option value="trainutest">Train ∪ Test</option>
        <option value="trainknntest">Train + Test (knn)</option>
      </select>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: "TrainTestSelector",
  data() {
    return {
      localDatasplit: "train",
    };
  },
  computed: mapState({
    datasplit: state => state.datasplit,
  }),
  methods: {
    datasplitChanged: function() {
      console.log(this.localDatasplit);
      this.$store.commit('setDataSplit', this.localDatasplit);
      this.$store.dispatch('loadIterationFile', this.$store.state.currentIteration);
    },
  },
  // computed: mapState({
  //   intervalList: (state) => state.datasetConfigs.intervals,
  //   overlapList: (state) => state.datasetConfigs.overlaps,
  // }),
}
</script>

<style scoped>
.train-test-label {
  color: white;
  padding-right: 1em;
}

#traintest-selector-div {
  margin: 0.5rem;
  display: grid;
  grid-gap: 1rem;
  grid-template: 1fr 1fr / 1fr 1fr;
}
</style>