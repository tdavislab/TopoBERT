<script lang="ts" setup>
  import LayerSelector from './GraphControls/LayerSelector.vue';
  import IterationSlider from './GraphControls/IterationSlider.vue';
  import DatasetSelector from './MapperControls/DatasetSelector.vue';
  import DropdownDataSplit from './MapperControls/DropdownDataSplit.vue';
  import { ref } from 'vue';

  let showDataControls = ref(true);

  function toggleDataControls() {
    showDataControls.value = !showDataControls.value;
  }
</script>

<template>
  <div class="grid gap-3 border rounded p-3 transition-all">
    <div class="text-xl flex justify-between">
      <span class="cursor-pointer" @click="toggleDataControls()">
        <span class="mr-2">Data Source Parameters</span>
        <font-awesome-icon :icon="showDataControls ? 'chevron-up' : 'chevron-down'"></font-awesome-icon>
      </span>
    </div>

    <div v-show="showDataControls" class="grid gap-y-4">
      <DatasetSelector></DatasetSelector>
      <DropdownDataSplit></DropdownDataSplit>
      <LayerSelector></LayerSelector>
      <IterationSlider></IterationSlider>
      <!-- <AddParamConfig></AddParamConfig> -->
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  :deep() label {
    @apply bg-gray-200 rounded-l text-gray-600 p-2;
  }

  :deep() select {
    @apply text-gray-600 p-2 bg-gray-100 rounded-r  hover:bg-gray-200 focus:outline focus:outline-2 focus:outline-blue-300;
  }
</style>

<!-- summary of chapters - what is impact - how they can go from here from a high-level point of view. tools and techniques for furthering and expanding -->
