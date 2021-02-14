<template>
  <div id="dataset-selector-div">
    <label for="dataset-selector" style="display:inline-block">Dataset:</label>
    <select id="dataset-selector" style="display: inline-block" class="form-select" v-model="selection" v-on:change="changeDataset(selection)">
<!--      <option disabled value="" selected>Select a dataset</option>-->
      <option value="euclidean_l2_50">Euclidean - L2 - 50intervals</option>
      <option value="euclidean_l2_100">Euclidean - L2 - 100intervals</option>
    </select>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "DatasetSelector",
  data() {
    return {
      selection: 'euclidean_l2_50'
    }
  },
  computed: mapState({
    selection: state => state.currentDataset,
  }),
  methods: {
    changeDataset(newDataset) {
      console.log(newDataset)
      this.$store.dispatch('changeDataset', newDataset);
    }
  }
}
</script>

<style scoped>

</style>