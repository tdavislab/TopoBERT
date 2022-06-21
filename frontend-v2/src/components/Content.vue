<script lang="ts" setup>
  import Graph from './Content/Graph.vue';
  import SideBar from './Content/SideBar.vue';
</script>

<template>
  <div class="p-2">
    <div class="grid grid-cols-12 gap-x-3">
      <div class="col-span-9 border rounded">
        <Graph></Graph>
      </div>
      <div class="col-span-3 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100;">
        <SideBar></SideBar>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
