<script lang="ts" setup>
  import TitleText from './TitleText.vue';
  import DataSplitSelector from './DataSplitSelector.vue';
  import SearchBar from './SearchBar.vue';
  import LayerSelector from './LayerSelector.vue';
  import ColorSchemeDesigner from './ColorSchemeDesigner.vue';
</script>

<template>
  <div class="flex justify-between align-middle bg-slate-700 text-gray-50 p-4">
    <TitleText></TitleText>
    <DataSplitSelector></DataSplitSelector>
    <SearchBar></SearchBar>
    <LayerSelector></LayerSelector>
    <ColorSchemeDesigner></ColorSchemeDesigner>
  </div>
</template>

<style lang="postcss" scoped></style>
