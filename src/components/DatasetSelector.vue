<template>
  <div id="dataset-selector-div">
    <label for="dataset-selector" style="display:inline-block">Dataset:</label>
    <select id="dataset-selector" style="display: inline-block" class="form-select" v-model="selection" v-on:change="changeDataset(selection)">
      <option disabled value="" selected>Select a dataset</option>
      <option value="euclidean_l2_50_50">Euclidean - L2 - 50intervals - overlap 50</option>
      <option value="euclidean_l2_100_50">Euclidean - L2 - 100intervals - overlap 50</option>
      <option value="euclidean_l2_50_75">Euclidean - L2 - 50intervals - overlap 75</option>
      <option value="euclidean_l2_100_75">Euclidean - L2 - 100intervals - overlap 75</option>
      <option value="cosine_l2_50_50">Cosine - L2 - 50intervals</option>
      <option value="cosine_l2_100_50">Cosine - L2 - 100intervals</option>
      <option value="cosine_l2_50_75">Cosine - L2 - 50intervals</option>
      <option value="cosine_l2_100_75">Cosine - L2 - 100intervals</option>
    </select>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "DatasetSelector",
  data() {
    return {
      selection: 'euclidean_l2_50_50'
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