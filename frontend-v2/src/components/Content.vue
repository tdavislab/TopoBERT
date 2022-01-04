<script lang="ts" setup>
  import Graph from './Content/Graph.vue';
  import SideBar from './Content/SideBar.vue';
</script>

<template>
  <div class="w-screen h-full p-2">
    <div class="grid grid-cols-12 gap-1">
      <div class="col-span-8">
        <Graph></Graph>
      </div>
      <div class="col-span-4">
        <SideBar></SideBar>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
