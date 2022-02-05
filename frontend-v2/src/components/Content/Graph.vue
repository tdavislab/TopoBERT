<script lang="ts" setup>
  import { computed, onMounted, watch } from 'vue';
  import { useStore } from '../../store/store';
  import GraphMinimap from './GraphMinimap.vue';

  const store = useStore();

  onMounted(() => {
    store.dispatch('updateGraph');
  });
</script>

<template>
  <div class="h-full grid grid-cols-1">
    <GraphMinimap></GraphMinimap>

    <svg id="graph-svg" class="row-start-1" width="100%" height="100%">
      <g>
        <g id="link_group"></g>
        <g id="node_group"></g>
      </g>
    </svg>
  </div>
</template>

<style lang="postcss" scoped></style>
