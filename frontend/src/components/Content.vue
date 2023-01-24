<script lang="ts" setup>
  import Graph from './Content/Graph.vue';
  import SideBar from './Content/SideBar.vue';
</script>

<template>
  <div class="p-2 h-full overflow-scroll">
    <div class="grid grid-cols-12 gap-x-3 h-full">
      <div class="col-span-8 border rounded">
        <Graph></Graph>
      </div>
      <div class="col-span-4 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100;">
        <SideBar></SideBar>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
