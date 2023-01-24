<script lang="ts" setup>
  import { useStore } from '../../../../store/store';

  const store = useStore();
</script>

<template>
  <div class="grid grid-cols-12" title="Filter all edges with strength below this threshold">
    <div class="col-span-3">Min Link Strength: {{ store.state.minLinkStrength }}</div>
    <input class="col-span-9" type="range" min="0" max="1" step="0.01" v-model="store.state.minLinkStrength" />
  </div>
</template>

<style lang="postcss" scoped></style>
