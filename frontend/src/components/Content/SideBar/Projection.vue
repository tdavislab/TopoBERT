<script lang="ts" setup>
  import { ref } from 'vue';

  let showProjection = ref(false);

  function toggleStats() {
    showProjection.value = !showProjection.value;
  }
</script>

<template>
  <div class="grid gap-3 border rounded p-3 transition-all">
    <div class="text-xl flex justify-between">
      <span class="cursor-pointer" @click="toggleStats()">
        <span class="mr-2">Dataset PCA Projection</span>
        <font-awesome-icon :icon="showProjection ? 'chevron-up' : 'chevron-down'"></font-awesome-icon>
      </span>
    </div>
    <svg v-show="showProjection" id="projection-svg" class="bg-white border" width="100%" height="450" viewBox="0 0 100 100">
      <g id="projection-svg-g"></g>
    </svg>
  </div>
</template>

<style lang="postcss" scoped></style>
