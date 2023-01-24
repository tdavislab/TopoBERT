<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { useStore } from '../../../store/store';
  import AddParamConfig from './MapperControls/AddParamConfig.vue';
  import DropdownMetric from './MapperControls/DropdownMetric.vue';
  import DropdownFilter from './MapperControls/DropdownFilter.vue';
  import DropdownIntervals from './MapperControls/DropdownIntervals.vue';
  import DropdownOverlap from './MapperControls/DropdownOverlap.vue';
  import DropdownLayout from './MapperControls/DropdownLayout.vue';
  import DropdownMinSamples from './MapperControls/DropdownMinSamples.vue';

  const store = useStore();
  let showMapperControls = ref(false);

  function toggleMapperControls() {
    showMapperControls.value = !showMapperControls.value;
  }
</script>

<template>
  <div class="grid gap-3 border rounded p-3 transition-all">
    <div class="text-xl flex justify-between">
      <span class="cursor-pointer" @click="toggleMapperControls()">
        <span class="mr-2">Mapper Parameters</span>
        <font-awesome-icon :icon="showMapperControls ? 'chevron-up' : 'chevron-down'"></font-awesome-icon>
      </span>
    </div>
    <div v-show="showMapperControls" class="grid gap-2">
      <DropdownMetric></DropdownMetric>
      <DropdownFilter></DropdownFilter>
      <DropdownIntervals></DropdownIntervals>
      <DropdownOverlap></DropdownOverlap>
      <DropdownMinSamples></DropdownMinSamples>
      <DropdownLayout></DropdownLayout>
      <AddParamConfig></AddParamConfig>
    </div>
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
