<template>
  <div class="counter">{{ store.state.count }}</div>
  <div class="buttons">
    <div class="inline-flex">
      <button @click="decrement()" class="btn-primary rounded-l">-</button>
      <button @click="increment()" class="btn-primary rounded-r">+</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useStore } from '../store/store';

  const store = useStore();
  console.log(store);

  function increment() {
    store.commit('increment');
  }

  function decrement() {
    store.commit('decrement');
  }
</script>

<style lang="postcss" scoped>
  .btn-primary {
    @apply bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4;
  }
</style>
