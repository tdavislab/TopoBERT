<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { useStore } from '../../../store/store';

  const store = useStore();

  let showStats = ref(false);
  const numNodes = computed(() => {
    return store.state.graph.nodes.length;
  });
  const numEdges = computed(() => {
    return store.state.graph.links.length;
  });

  function toggleStats() {
    showStats.value = !showStats.value;
  }
</script>

<template>
  <div class="grid gap-3 border rounded p-3 bg-gray-50 transition-all">
    <div class="text-xl flex justify-between">
      <span class="cursor-pointer" @click="toggleStats()">
        <span class="mr-2">Graph Statistics</span>
        <font-awesome-icon :icon="showStats ? 'chevron-up' : 'chevron-down'"></font-awesome-icon>
      </span>
    </div>
    <div v-show="showStats">{{ numNodes }} nodes, {{ numEdges }} edges</div>
  </div>
</template>

<style lang="postcss" scoped></style>
