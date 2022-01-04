<script lang="ts" setup>
  import MapperControls from './SideBar/MapperControls.vue';
</script>

<template>
  <div class="sidebar">
    <MapperControls></MapperControls>
  </div>
</template>

<style lang="postcss" scoped>
  .sidebar {
    @apply p-2 border rounded;
  }
</style>
