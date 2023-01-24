<script lang="ts" setup>
  import { ref } from 'vue';
  import LabelFilter from './LabelFilter.vue';
  import SearchBar from '../../NavBar/SearchBar.vue';
  import FilterDistribution from './FilterDistribution.vue';

  let showMapperControls = ref(false);

  function toggleMapperControls() {
    showMapperControls.value = !showMapperControls.value;
  }
</script>

<template>
  <div class="grid gap-3 border rounded p-3 transition-all">
    <div class="text-xl flex justify-between">
      <span class="cursor-pointer" @click="toggleMapperControls()">
        <span class="mr-2">Search and Highlight</span>
        <font-awesome-icon :icon="showMapperControls ? 'chevron-up' : 'chevron-down'"></font-awesome-icon>
      </span>
    </div>
    <div v-show="showMapperControls" class="grid gap-2">
      <LabelFilter></LabelFilter>
      <SearchBar></SearchBar>
      <!-- <FilterDistribution></FilterDistribution> -->
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
