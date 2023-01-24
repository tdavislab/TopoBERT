<script lang="ts" setup>
  import { useStore } from '../../../../store/store';
  import { computed } from 'vue';

  const store = useStore();
  const mapperParams = computed(() => store.state.mapperParams);
</script>

<template>
  <div id="param-metric-div" class="grid grid-cols-3">
    <label for="metric-select">Metric</label>
    <select name="metric-select" id="metric-select" class="col-span-2" v-model="mapperParams.metric.selected">
      <option disabled>Select metric</option>
      <option v-for="metric in mapperParams.metric.paramList" :value="metric.value">
        {{ metric.name }}
      </option>
    </select>
  </div>
</template>

<style lang="postcss" scoped></style>
