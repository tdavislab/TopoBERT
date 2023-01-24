<script lang="ts" setup>
  import { useStore } from '../../../../store/store';
  import { computed } from 'vue';

  const store = useStore();
  const mapperParams = computed(() => store.state.mapperParams);

  function changeLayout() {
    // get the current layout

    const layout = mapperParams.value.layout.selected;
    store.state.graphRenderer.convertToLayout(layout);
  }
</script>

<template>
  <div id="param-layout-div" class="grid grid-cols-3">
    <label for="layout-select">Layout</label>
    <select name="layout-select" id="layout-select" class="col-span-2" v-model="mapperParams.layout.selected" @change="changeLayout">
      <option disabled>Select layout</option>
      <option v-for="layout in mapperParams.layout.paramList" :value="layout.value">
        {{ layout.name }}
      </option>
    </select>
  </div>
</template>

<style lang="postcss" scoped></style>
