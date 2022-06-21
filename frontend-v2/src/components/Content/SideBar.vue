<script lang="ts" setup>
  import MapperControls from './SideBar/MapperControls.vue';
  import GraphControls from './SideBar/GraphControls.vue';
  // import Statistics from './SideBar/Statistics.vue';
  import LabelFilter from './SideBar/LabelFilter.vue';
  import MetadataTable from './SideBar/MetadataTable.vue';
  import Projection from './SideBar/Projection.vue';
  // import Attachment from './SideBar/Attachment.vue';
  import FilterDistribution from './SideBar/FilterDistribution.vue';
  import DatasetControls from './SideBar/DatasetControls.vue';
  import UpdateGraph from './SideBar/MapperControls/UpdateGraph.vue';
</script>

<template>
  <div class="grid gap-y-4">
    <UpdateGraph></UpdateGraph>

    <DatasetControls></DatasetControls>
    <MapperControls></MapperControls>
    <GraphControls> </GraphControls>
    <LabelFilter></LabelFilter>
    <!-- <Statistics></Statistics> -->
    <Projection></Projection>
    <FilterDistribution></FilterDistribution>
    <!-- <Attachment></Attachment> -->
    <MetadataTable></MetadataTable>
  </div>
</template>

<style lang="postcss" scoped></style>
