<script lang="ts" setup>
  import TitleText from './NavBar/TitleText.vue';
  // import DatasetSelector from './NavBar/DatasetSelector.vue';
  import SearchBar from './NavBar/SearchBar.vue';
  // import LayerSelector from './NavBar/LayerSelector.vue';
  import ColorSchemeDesigner from './NavBar/ColorSchemeDesigner.vue';
</script>

<template>
  <div class="flex justify-between align-middle bg-slate-700 text-gray-50 p-4">
    <!-- <LayerSelector></LayerSelector> -->
    <!-- <DatasetSelector></DatasetSelector> -->
    <TitleText></TitleText>
    <SearchBar></SearchBar>
    <ColorSchemeDesigner></ColorSchemeDesigner>
  </div>
</template>

<style lang="postcss" scoped></style>
