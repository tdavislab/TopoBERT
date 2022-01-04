<script lang="ts" setup></script>

<template>
  <div class="rounded">
    <input type="search" placeholder="Search by word" />
    <button>🔍</button>
  </div>
</template>

<style lang="postcss" scoped>
  input {
    @apply rounded-l p-2 text-gray-600 outline-none focus:outline focus:outline-2 focus:outline-blue-300 focus:outline-offset-0;
  }
  button {
    @apply bg-gray-300 p-2 rounded-r hover:bg-gray-400 transition-all;
  }
</style>
