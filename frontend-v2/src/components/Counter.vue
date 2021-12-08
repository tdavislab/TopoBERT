<template>
  <div class="counter">{{ store.state.count }}</div>
  <div class="buttons">
    <button class="btn" @click="decrement()">-</button>
    <button class="btn" @click="increment()">+</button>
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

<style scoped></style>
