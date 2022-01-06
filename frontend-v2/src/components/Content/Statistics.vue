<script lang="ts" setup>
  import { ref } from 'vue';

  let showStats = ref(false);

  function toggleStats() {
    showStats.value = !showStats.value;
    console.log(showStats);
  }
</script>

<template>
  <div class="grid gap-3 border rounded p-3 bg-gray-50 cursor-pointer transition-all" @click="toggleStats()">
    <h1 class="text-xl flex justify-between">
      <span>Statistics</span>
      <font-awesome-icon :icon="showStats ? 'chevron-up' : 'chevron-down'"></font-awesome-icon>
    </h1>
    <div v-show="showStats">Stats placeholder</div>
  </div>
</template>

<style lang="postcss" scoped></style>
