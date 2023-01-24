<script lang="ts" setup>
  import { useStore } from '../../../../store/store';
  import { computed } from 'vue';

  const store = useStore();
  const layers = computed(() => store.state.layerObj.layers);
  const selectedLayer = computed(() => store.state.layerObj.selected);

  function changeLayer(layerId: number) {
    store.commit('setLayer', layerId);
  }
</script>

<template>
  <div class="grid grid-cols-12 items-center">
    <span class="col-span-2 my-2">Layer:</span>
    <div class="col-span-10">
      <div v-for="layerId in layers" class="layer-btn" :class="{ selectedlayer: selectedLayer === layerId }" @click="changeLayer(layerId)">
        {{ layerId }}
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  .layer-btn {
    @apply inline-block p-2 mx-2 my-2 rounded font-semibold text-gray-800 bg-gray-200 hover:bg-gray-500 hover:text-gray-50 transition-all cursor-pointer w-10 text-center;
  }
  .selectedlayer {
    @apply bg-gray-500 text-gray-50;
  }
</style>
