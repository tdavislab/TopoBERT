<script lang="ts" setup>
  import MapperControls from './SideBar/MapperControls.vue';
  import GraphControls from './SideBar/GraphControls.vue';
  import Statistics from './Statistics.vue';
</script>

<template>
  <div class="sidebar">
    <MapperControls></MapperControls>
    <GraphControls> </GraphControls>
    <Statistics></Statistics>
  </div>
</template>

<style lang="postcss" scoped>
  .sidebar {
    /* @apply p-2; */
  }
</style>
