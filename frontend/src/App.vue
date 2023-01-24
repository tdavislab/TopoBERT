<script setup lang="ts">
  import NavBar from './components/NavBar.vue';
  import Content from './components/Content.vue';
</script>

<template>
  <NavBar></NavBar>
  <Content></Content>
</template>

<style>
  #app {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
</style>
