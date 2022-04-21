<script lang="ts" setup>
  import MapperControls from './SideBar/MapperControls.vue';
  import GraphControls from './SideBar/GraphControls.vue';
  import Statistics from './SideBar/Statistics.vue';
  import LabelFilter from './SideBar/LabelFilter.vue';
  import MetadataTable from './SideBar/MetadataTable.vue';
  import Projection from './SideBar/Projection.vue';
  import Attachment from './SideBar/Attachment.vue';
</script>

<template>
  <div class="grid gap-y-4">
    <MapperControls></MapperControls>
    <GraphControls> </GraphControls>
    <Statistics></Statistics>
    <Projection></Projection>
    <Attachment></Attachment>
    <LabelFilter></LabelFilter>
    <MetadataTable></MetadataTable>
  </div>
</template>

<style lang="postcss" scoped></style>
