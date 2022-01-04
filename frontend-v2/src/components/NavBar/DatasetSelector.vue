<script lang="ts" setup></script>

<template>
  <div class="rounded">
    <label for="dataset-select">Dataset</label>
    <select name="dataset-select" id="dataset-select" class="">
      <option disabled>Select Dataset</option>
      <option value="ssrole" selected>SuperSense Role</option>
      <option value="ssfunc">SuperSense Function</option>
      <option value="pos">Part of Speech</option>
      <option value="dep">Dependency</option>
    </select>
  </div>
</template>

<style lang="postcss" scoped>
  label {
    @apply bg-gray-200 rounded-l text-gray-500 p-2;
  }
  select {
    @apply text-gray-600 p-2 bg-gray-50 rounded-r focus:outline focus:outline-2 focus:outline-blue-300;
  }
</style>
