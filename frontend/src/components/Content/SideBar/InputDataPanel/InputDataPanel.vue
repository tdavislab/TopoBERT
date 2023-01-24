<script lang="ts" setup>
  import { ref } from 'vue';
  import MetadataTable from '../MetadataTable.vue';
  import Projection from '../Projection.vue';
  import FilterDistribution from '../FilterDistribution.vue';
  import { useStore } from '../../../../store/store';
  import { computed } from 'vue';

  const store = useStore();

  let showInputDataPanel = ref(true);
  let numSelected = computed(() => store.state.selectedNodes.length);
  function toggleInputDataPanel() {
    showInputDataPanel.value = !showInputDataPanel.value;
  }
</script>

<template>
  <div class="grid gap-3 border rounded p-3 transition-all">
    <div class="text-xl flex justify-between">
      <span class="cursor-pointer" @click="toggleInputDataPanel()">
        <span class="mr-2">Selected Nodes Panel</span>
        <font-awesome-icon :icon="showInputDataPanel ? 'chevron-up' : 'chevron-down'"></font-awesome-icon>
      </span>
      <span class="text-base">Number of selected nodes: {{ numSelected }}</span>
    </div>
    <div v-show="showInputDataPanel" class="grid gap-2">
      <MetadataTable></MetadataTable>
      <FilterDistribution></FilterDistribution>
      <!-- <Projection></Projection> -->
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
