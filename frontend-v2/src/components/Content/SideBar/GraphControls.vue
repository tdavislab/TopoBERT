<script lang="ts" setup>
  import IterationSlider from './GraphControls/IterationSlider.vue';
  import JaccardFilter from './GraphControls/JaccardFilter.vue';
  import NodeSizeToggle from './GraphControls/NodeSizeToggle.vue';
</script>

<template>
  <div class="grid gap-4 border rounded p-3 bg-gray-50">
    <IterationSlider></IterationSlider>
    <JaccardFilter></JaccardFilter>
    <NodeSizeToggle></NodeSizeToggle>
  </div>
</template>

<style lang="postcss" scoped></style>
