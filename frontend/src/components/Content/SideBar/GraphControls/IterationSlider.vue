<script lang="ts" setup>
  import { useStore } from '../../../../store/store';

  const store = useStore();
</script>

<template>
  <div class="grid grid-cols-12" title="Set the epoch for which the graph is shown">
    <div class="col-span-2">Fine-tuning Updates: {{ store.getters.epochIndex }}</div>
    <input class="col-span-10" type="range" min="0" :max="store.state.epochs.length - 1" v-model="store.state.currentEpochIndex" />
  </div>
</template>

<style lang="postcss" scoped></style>
