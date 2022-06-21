<script lang="ts" setup>
  import IterationSlider from './GraphControls/IterationSlider.vue';
  import JaccardFilter from './GraphControls/JaccardFilter.vue';
  import NodeSizeToggle from './GraphControls/NodeSizeToggle.vue';
  import TrackingModeCheckbox from './GraphControls/TrackingModeCheckbox.vue';
  import BubbleGlyphCheckbox from './GraphControls/BubbleGlyphCheckbox.vue';
  import TransitionEffectCheckbox from './GraphControls/TransitionEffectCheckbox.vue';
  import LayerSelector from './GraphControls/LayerSelector.vue';
  import { ref } from 'vue';
  import LabelFilter from './LabelFilter.vue';
  import SearchBar from '../../NavBar/SearchBar.vue';
  import FilterDistribution from './FilterDistribution.vue';

  let showMapperControls = ref(false);

  function toggleMapperControls() {
    showMapperControls.value = !showMapperControls.value;
  }
</script>

<template>
  <div class="grid gap-3 border rounded p-3 transition-all">
    <div class="text-xl flex justify-between">
      <span class="cursor-pointer" @click="toggleMapperControls()">
        <span class="mr-2">Graph Panel</span>
        <font-awesome-icon :icon="showMapperControls ? 'chevron-up' : 'chevron-down'"></font-awesome-icon>
      </span>
    </div>
    <div v-show="showMapperControls" class="grid gap-2">
      <LabelFilter></LabelFilter>
      <SearchBar></SearchBar>
      <FilterDistribution></FilterDistribution>
    </div>
  </div>
  <!-- <div class="grid gap-4 border rounded p-3 bg-gray-50"> -->
  <!-- <LayerSelector></LayerSelector> -->
  <!-- </div> -->
  <!-- <div class="grid gap-4 border rounded p-3 bg-gray-50"> -->
  <!-- <IterationSlider></IterationSlider> -->
  <!-- <JaccardFilter></JaccardFilter> -->
  <!-- <NodeSizeToggle></NodeSizeToggle> -->
  <!-- </div> -->

  <!-- <div class="grid gap-4 border rounded p-3 bg-gray-50">
    <div class="grid grid-cols-3">
      <TrackingModeCheckbox></TrackingModeCheckbox>
      <BubbleGlyphCheckbox></BubbleGlyphCheckbox>
      <TransitionEffectCheckbox></TransitionEffectCheckbox>
    </div>
  </div> -->
</template>

<style lang="postcss" scoped></style>
