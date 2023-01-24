<script lang="ts" setup>
  import { computed } from 'vue';
  import { useStore } from '../../../../store/store';

  const store = useStore();
  const datasetList = computed(() => store.state.datasetList);

  function datasetUpdate() {
    store.dispatch('datasetUpdate');
  }
</script>

<template>
  <div class="grid grid-cols-4">
    <label for="dataset-select">Dataset</label>
    <select name="dataset-select" id="dataset-select" class="col-span-3" v-model="datasetList.selected" v-on:change="datasetUpdate()">
      <option disabled>Select Dataset</option>
      <option v-for="dataset in datasetList.datasets" :value="dataset.value">
        {{ dataset.name }}
      </option>
    </select>
  </div>
</template>

<style lang="postcss" scoped>
  /* label {
    @apply bg-gray-200 rounded-l text-gray-500 p-2;
  }
  select {
    @apply text-gray-600 p-2 bg-gray-50 rounded-r hover:bg-gray-100 focus:outline focus:outline-2 focus:outline-blue-300;
  } */
</style>
