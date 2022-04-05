<script lang="ts" setup>
  import { computed } from 'vue';
  import { useStore } from '../../store/store';

  const store = useStore();
  const showMinimap = computed(() => store.state.selectedNodes.length > 0);
  const nodeData = computed(() => store.state.selectedNodes);
</script>

<template>
  <!-- <span id="minimap" class="shadow border border-r-4 inline-block"><svg></svg></span> -->
  <svg id="minimap-svg" class="row-start-1 border rounded shadow" :class="showMinimap ? 'visible' : 'invisible'"></svg>
</template>

<style lang="postcss" scoped>
  /* #minimap-svg { */
  /* border-radius: 5px; */
  /* background-color: #020202; */
  /* position: absolute; */
  /* bottom: 10px; */
  /* right: 10px; */
  /* box-shadow: 5px 5px 10px #a0a0a0; */
  /* } */
</style>
