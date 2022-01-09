<script lang="ts" setup>
  import { ref } from 'vue';

  let showStats = ref(false);

  function toggleStats() {
    showStats.value = !showStats.value;
  }
</script>

<template>
  <div class="grid gap-3 border rounded p-3 bg-gray-50 transition-all">
    <div class="text-xl flex justify-between">
      <span class="cursor-pointer" @click="toggleStats()">
        <span class="mr-2">Statistics</span>
        <font-awesome-icon :icon="showStats ? 'chevron-up' : 'chevron-down'"></font-awesome-icon>
      </span>
    </div>
    <div v-show="showStats">Stats placeholder</div>
  </div>
</template>

<style lang="postcss" scoped></style>
