<script lang="ts" setup>
  import IterationSlider from './GraphControls/IterationSlider.vue';
  import JaccardFilter from './GraphControls/JaccardFilter.vue';
  import NodeSizeToggle from './GraphControls/NodeSizeToggle.vue';
</script>

<template>
  <div class="grid gap-2 my-2 border rounded p-2 bg-gray-50">
    <IterationSlider></IterationSlider>
    <JaccardFilter></JaccardFilter>
    <NodeSizeToggle></NodeSizeToggle>
  </div>
</template>

<style lang="postcss" scoped></style>
