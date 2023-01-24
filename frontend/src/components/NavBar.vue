<script lang="ts" setup>
  import TitleText from './NavBar/TitleText.vue';
  // import DatasetSelector from './NavBar/DatasetSelector.vue';
  import SearchBar from './NavBar/SearchBar.vue';
  // import LayerSelector from './NavBar/LayerSelector.vue';
  import ColorSchemeDesigner from './NavBar/ColorSchemeDesigner.vue';
</script>

<template>
  <div class="bg-slate-700 text-gray-50 p-4 w-full">
    <!-- <LayerSelector></LayerSelector> -->
    <!-- <DatasetSelector></DatasetSelector> -->
    <div class="grid grid-cols-8 gap-x-3">
      <div class="col-span-2">
        <TitleText></TitleText>
      </div>
      <div class="col-span-5"></div>
      <!-- <div class="col-span-1">
        <SearchBar></SearchBar>
      </div> -->
      <!-- <div class="col-span-1"></div> -->
      <div class="col-span-1">
        <ColorSchemeDesigner></ColorSchemeDesigner>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
