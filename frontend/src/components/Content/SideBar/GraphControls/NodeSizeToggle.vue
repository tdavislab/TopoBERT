<script lang="ts" setup>
  import { useStore } from '../../../../store/store';

  const store = useStore();
</script>

<template>
  <div class="grid grid-cols-12" title="Set the epoch for which the graph is shown">
    <div class="col-span-3">Node Size</div>
    <div class="col-span-6 grid grid-cols-2">
      <label class="cursor-pointer" v-on:click="store.dispatch('toggleNodeSize', 'constant')">
        <input type="radio" id="constant" name="linkStrength" v-model="store.state.nodeSize" value="constant" />
        <span class="ml-2" for="constant">Constant</span>
      </label>
      <label class="cursor-pointer" v-on:click="store.dispatch('toggleNodeSize', 'scaled')">
        <input type="radio" id="scaled" name="linkStrength" v-model="store.state.nodeSize" value="scaled" />
        <span class="ml-2" for="scaled">Scaled to cluster size</span>
      </label>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
