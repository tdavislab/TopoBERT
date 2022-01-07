<script lang="ts" setup>
  import { useStore } from '../../../store/store';
  import { computed, ref } from 'vue';

  const store = useStore();
  const colorMap = store.state.colorMap;

  let numSelected = computed(() => Object.keys(colorMap).filter((c) => colorMap[c].selected).length);
  let showLabelFilter = ref(false);

  function toggleLabelFilter() {
    showLabelFilter.value = !showLabelFilter.value;
  }

  function borderColor(color: string) {
    return { border: '5px solid ' + color };
  }

  function clearLabelSelection() {
    store.commit('clearLabelSelection');
  }
</script>

<template>
  <div class="grid gap-3 border rounded p-3 bg-gray-50 transition-all">
    <div class="text-xl flex justify-between">
      <span class="cursor-pointer" @click="toggleLabelFilter()">
        <span class="mr-2">Filter Labels</span>
        <font-awesome-icon :icon="showLabelFilter ? 'chevron-up' : 'chevron-down'"></font-awesome-icon>
      </span>
      <div class="flex">
        <div>
          <span class="mr-2">Selected: {{ numSelected }}</span>
          <font-awesome-icon icon="times-circle" class="cursor-pointer" title="Clear selection" @click="clearLabelSelection()"></font-awesome-icon>
        </div>
      </div>
    </div>

    <div v-show="showLabelFilter">
      <div
        v-for="(labelInfo, labelName) in colorMap"
        class="label-tag"
        :style="borderColor(labelInfo.color)"
        :class="{ 'label-selected': labelInfo.selected }"
        @click="labelInfo.selected = !labelInfo.selected"
      >
        {{ labelName }}
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  .label-tag {
    @apply inline-block cursor-pointer m-1 text-sm font-semibold p-2 rounded-lg border-4 hover:bg-gray-200 transition-all;
  }
  .label-selected {
    @apply bg-gray-400;
  }
</style>
