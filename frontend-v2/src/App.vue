<script setup lang="ts">
  import Counter from './components/Counter.vue';
</script>

<template>
  <Counter></Counter>
</template>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  .buttons {
    margin: 0 10px;
    font-size: 40px;
  }

  .btn {
    font-size: 40px;
    margin: 0 10px;
    width: 100px;
  }

  .counter {
    font-size: 5em;
    margin: 1em;
  }
</style>
