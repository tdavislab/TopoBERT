<script lang="ts" setup></script>

<template>
  <div class="rounded">
    <input type="search" placeholder="Search by word" />
    <button>
      <font-awesome-icon icon="search"></font-awesome-icon>
    </button>
  </div>
</template>

<style lang="postcss" scoped>
  input {
    @apply rounded-l p-2 text-gray-600 outline-none focus:outline focus:outline-2 focus:outline-blue-300 focus:outline-offset-0;
  }
  button {
    @apply p-2 px-3 rounded-r bg-indigo-500 rounded hover:bg-indigo-600 transition-all;
  }
</style>
