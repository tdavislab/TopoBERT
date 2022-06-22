<script lang="ts" setup>
  import { ref } from 'vue';
  import MetadataTable from '../MetadataTable.vue';
  import Projection from '../Projection.vue';

  let showInputDataPanel = ref(true);

  function toggleInputDataPanel() {
    showInputDataPanel.value = !showInputDataPanel.value;
  }
</script>

<template>
  <div class="grid gap-3 border rounded p-3 transition-all">
    <div class="text-xl flex justify-between">
      <span class="cursor-pointer" @click="toggleInputDataPanel()">
        <span class="mr-2">Input Data Panel</span>
        <font-awesome-icon :icon="showInputDataPanel ? 'chevron-up' : 'chevron-down'"></font-awesome-icon>
      </span>
    </div>
    <div v-show="showInputDataPanel" class="grid gap-2">
      <MetadataTable></MetadataTable>
      <Projection></Projection>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
