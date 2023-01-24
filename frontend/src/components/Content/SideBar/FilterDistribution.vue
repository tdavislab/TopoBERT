<script lang="ts" setup>
  import { computed, ref, watch, watchEffect } from 'vue';
  import { useStore } from '../../../store/store';
  import FilterDistRenderer from '../Renderers/FilterDistRenderer';

  const store = useStore();

  let showFilterDistribution = ref(false);

  const filterDistRenderer = new FilterDistRenderer();
  const selectedNodes = computed(() => store.state.selectedNodes);
  let numSelected = computed(() => store.state.selectedNodes.length);

  watch(selectedNodes, () => filterDistRenderer.draw(store.state.selectedNodes), { deep: true });

  function toggleStats() {
    showFilterDistribution.value = !showFilterDistribution.value;
  }
</script>

<template>
  <div class="grid gap-3 border rounded p-3 transition-all bg-gray-50">
    <div class="text-xl flex justify-between">
      <span class="cursor-pointer" @click="toggleStats()">
        <span class="mr-2">Lens (Filter Function) Distribution</span>
        <font-awesome-icon :icon="showFilterDistribution ? 'chevron-up' : 'chevron-down'"></font-awesome-icon>
      </span>
      <!-- <span class="text-base">Number of selected nodes: {{ numSelected }}</span> -->
    </div>
    <svg v-show="showFilterDistribution" id="filter-dist-svg" class="bg-white" width="100%" height="300" viewBox="0 0 1000 500">
      <g id="filter-dist-svg-g">
        <g class="x-axis"></g>
        <g class="y-axis"></g>
        <g class="filterValues"></g>
      </g>
    </svg>
  </div>
</template>

<style lang="postcss" scoped>
  .tick > text {
    font-size: 16px;
  }
</style>
