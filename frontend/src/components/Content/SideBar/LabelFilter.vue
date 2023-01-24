<script lang="ts" setup>
  import { useStore } from '../../../store/store';
  import { computed, ref } from 'vue';
  import { Label } from '../../../store/types';

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

  function filterClickHandler(labelInfo: Label) {
    labelInfo.selected = !labelInfo.selected;

    // compute a selection of nodes in the graph based on the label selection
    store.dispatch('highlightFilteredLabelNodes');
  }

  function clearLabelSelection() {
    store.commit('clearLabelSelection');
  }

  function processLabel(labelName: string) {
    if (labelName.startsWith('p.')) {
      return labelName.split('.')[1];
    }
    return labelName;
  }
</script>

<template>
  <div class="grid gap-3 border rounded p-3 transition-all bg-gray-50">
    <div class="text-xl flex justify-between">
      <span class="cursor-pointer" @click="toggleLabelFilter()">
        <span class="mr-2">Highlight Classes in graph</span>
        <font-awesome-icon :icon="showLabelFilter ? 'chevron-up' : 'chevron-down'"></font-awesome-icon>
      </span>
      <div class="flex">
        <div>
          <span class="mr-2 text-base">Selected classes: {{ numSelected }}</span>
          <font-awesome-icon icon="times-circle" class="cursor-pointer" title="Clear selection" @click="clearLabelSelection()"></font-awesome-icon>
        </div>
      </div>
    </div>

    <div v-show="showLabelFilter">
      <div
        v-for="(labelInfo, labelName) in { ...store.state.colorMap }"
        class="label-tag"
        :style="borderColor(labelInfo.color)"
        :class="{ 'label-selected': labelInfo.selected }"
        @click="filterClickHandler(labelInfo)"
      >
        {{ processLabel(labelName) }}
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  .label-tag {
    @apply inline-block cursor-pointer m-1 text-sm font-semibold p-2 rounded-lg border-4 hover:bg-slate-500 hover:shadow-lg transition-all;
  }
  .label-selected {
    @apply bg-slate-500 text-white;
  }
</style>
