<script lang="ts" setup>
  import { computed, onMounted, watch } from 'vue';
  import { useStore } from '../../store/store';
  import GraphMinimap from './GraphMinimap.vue';

  const store = useStore();

  onMounted(() => {
    store.dispatch('updateGraph').then(() => {});
  });
</script>

<template>
  <div id="svg-container" class="h-full grid grid-cols-1">
    <svg id="graph-svg" width="100%" height="100%" viewBox="0 0 4000 2500">
      <g>
        <g class="link_group"></g>
        <g class="node_group"></g>
      </g>
    </svg>

    <svg id="new-svg" width="100%" height="100%" class="hidden" viewPort="0 0 4000 2500">
      <g>
        <g class="link_group"></g>
        <g class="node_group"></g>
      </g>
    </svg>
    <GraphMinimap></GraphMinimap>
  </div>
</template>

<style lang="postcss" scoped></style>
