<script lang="ts" setup></script>

<template>
  <div class="rounded">
    <span class="name-label">Data Split</span>
    <select name="data-split-select" id="data-split-select" class="">
      <option disabled>Select Data Split</option>
      <option value="train" selected>Train</option>
      <option value="test">Test</option>
      <option value="trainutest">Train ∪ Test</option>
      <option value="trainknntest">Train + Test (knn)</option>
    </select>
  </div>
</template>

<style lang="postcss" scoped>
  .name-label {
    @apply bg-gray-200 rounded-l text-gray-500 p-2;
  }
  select {
    @apply text-gray-600 p-2 bg-gray-50 rounded-r focus:outline focus:outline-2 focus:outline-blue-300;
  }
</style>
