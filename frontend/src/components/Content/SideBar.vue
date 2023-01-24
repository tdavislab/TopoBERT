<script lang="ts" setup>
  import MapperControls from './SideBar/MapperControls.vue';
  import GraphControls from './SideBar/GraphControls.vue';
  import Projection from './SideBar/Projection.vue';
  import DatasetControls from './SideBar/DatasetControls.vue';
  import UpdateGraph from './SideBar/MapperControls/UpdateGraph.vue';
  import InputDataPanel from './SideBar/InputDataPanel/InputDataPanel.vue';
</script>

<template>
  <div class="border rounded p-2 min-h-full">
    <div class="grid gap-y-4">
      <UpdateGraph></UpdateGraph>
      <DatasetControls></DatasetControls>
      <InputDataPanel></InputDataPanel>
      <MapperControls></MapperControls>
      <GraphControls> </GraphControls>
      <Projection></Projection>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
