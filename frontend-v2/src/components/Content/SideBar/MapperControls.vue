<script lang="ts" setup>
  import { computed } from 'vue';
  import { useStore } from '../../../store/store';
  import AddParamConfig from './MapperControls/AddParamConfig.vue';
  import UpdateGraph from './MapperControls/UpdateGraph.vue';
  import DropdownDataSplit from './MapperControls/DropdownDataSplit.vue';
  import DropdownMetric from './MapperControls/DropdownMetric.vue';
  import DropdownFilter from './MapperControls/DropdownFilter.vue';
  import DropdownIntervals from './MapperControls/DropdownIntervals.vue';
  import DropdownOverlap from './MapperControls/DropdownOverlap.vue';
  import DropdownLayout from './MapperControls/DropdownLayout.vue';
  import DropdownMinSamples from './MapperControls/DropdownMinSamples.vue';

  const store = useStore();
  const mapperParams = computed(() => store.state.mapperParams);

  function updateParams() {
    store.dispatch('updateGraph');
  }
</script>

<template>
  <div class="grid gap-2 grid-cols-2">
    <DropdownDataSplit></DropdownDataSplit>
    <DropdownMetric></DropdownMetric>
    <DropdownFilter></DropdownFilter>
    <DropdownIntervals></DropdownIntervals>
    <DropdownOverlap></DropdownOverlap>
    <DropdownLayout></DropdownLayout>
    <DropdownMinSamples></DropdownMinSamples>
  </div>
  <div class="grid gap-2 grid-cols-2">
    <UpdateGraph></UpdateGraph>
    <AddParamConfig></AddParamConfig>
  </div>
</template>

<style lang="postcss" scoped>
  button {
    @apply font-semibold text-gray-50 bg-indigo-500 p-2 rounded hover:bg-indigo-600 transition-all;
  }

  :deep() label {
    @apply bg-gray-200 rounded-l text-gray-600 p-2;
  }

  :deep() select {
    @apply text-gray-600 p-2 bg-gray-50 rounded-r  hover:bg-gray-100 focus:outline focus:outline-2 focus:outline-blue-300;
  }
</style>
