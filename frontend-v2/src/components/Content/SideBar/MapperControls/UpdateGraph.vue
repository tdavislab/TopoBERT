<script lang="ts" setup>
  import { useStore } from '../../../../store/store';

  const store = useStore();
</script>

<template>
  <button v-on:click="store.dispatch('updateGraph')">Update Graph</button>
</template>

<style lang="postcss" scoped></style>
