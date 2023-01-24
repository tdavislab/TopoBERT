<script lang="ts" setup>
  import { computed, onMounted, watch } from 'vue';
  import { useStore } from '../../store/store';
  import GraphMinimap from './GraphMinimap.vue';

  const store = useStore();

  const numNodes = computed(() => {
    return store.state.graph.nodes.length;
  });
  const numEdges = computed(() => {
    return store.state.graph.links.length;
  });

  onMounted(() => {
    store.dispatch('updateGraph');
  });
</script>

<template>
  <div class="relative h-full">
    <div class="absolute right-0 m-2 text-gray-500 text-sm">{{ numNodes }} nodes, {{ numEdges }} edges</div>

    <div id="svg-container" class="grid h-full">
      <svg id="new-svg" width="100%" height="100%" class="h-0 absolute w-0" viewBox="-2000 -1250 4000 2500">
        <g id="new-svg-g">
          <g class="link_group"></g>
          <g class="node_group"></g>
        </g>
      </svg>

      <svg id="graph-svg" width="100%" height="100%" viewBox="-2000 -1250 4000 2500">
        <g id="graph-svg-g">
          <g class="link_group"></g>
          <g class="node_group"></g>
        </g>
      </svg>

      <GraphMinimap></GraphMinimap>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
