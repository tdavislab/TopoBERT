<script lang="ts" setup>
  import { computed, onMounted, watch } from 'vue';
  import { useStore } from '../../store/store';
  import * as d3 from 'd3';
  import GraphRenderer from './Graph/GraphRender';

  const store = useStore();
  const graph = computed(() => store.state.graph);

  onMounted(() => {
    store.dispatch('updateGraph');
  });
</script>

<template>
  <div class="h-full">
    <svg id="graph-svg" width="100%" height="100%">
      <g>
        <g id="link_group"></g>
        <g id="node_group"></g>
      </g>
    </svg>
  </div>
</template>

<style lang="postcss" scoped></style>
