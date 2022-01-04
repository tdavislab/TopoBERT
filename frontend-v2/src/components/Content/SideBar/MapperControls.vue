<script lang="ts" setup>
  import { computed } from 'vue';
  import { useStore } from '../../../store/store';

  const store = useStore();
  const mapperParams = computed(() => store.state.mapperParams);

  function paramUpdate() {
    console.log(mapperParams.value);
  }
</script>

<template>
  <div class="grid gap-2 grid-cols-2">
    <div id="param-data-split-div" class="grid grid-cols-3">
      <label for="data-split-select">Split</label>
      <select
        name="data-split-select"
        id="data-split-select"
        class="col-span-2"
        v-model="mapperParams.dataSplit.selected"
        v-on:change="paramUpdate()"
      >
        <option disabled>Select Data Split</option>
        <option v-for="dataSplit in mapperParams.dataSplit.paramList" :value="dataSplit.value">
          {{ dataSplit.name }}
        </option>
      </select>
    </div>

    <div id="param-metric-div" class="grid grid-cols-3">
      <label for="metric-select">Metric</label>
      <select name="metric-select" id="metric-select" class="col-span-2" v-model="mapperParams.metric.selected">
        <option disabled>Select metric</option>
        <option v-for="metric in mapperParams.metric.paramList" :value="metric.value">
          {{ metric.name }}
        </option>
      </select>
    </div>

    <div id="param-filter-div" class="grid grid-cols-3">
      <label for="filter-select">Filter</label>
      <select name="filter-select" id="filter-select" class="col-span-2" v-model="mapperParams.filter.selected">
        <option disabled>Select filter</option>
        <option v-for="filter in mapperParams.filter.paramList" :value="filter.value">
          {{ filter.name }}
        </option>
      </select>
    </div>

    <div id="param-interval-div" class="grid grid-cols-3">
      <label for="interval-select">Intervals</label>
      <select name="interval-select" id="interval-select" class="col-span-2" v-model="mapperParams.intervals.selected">
        <option disabled>Select intervals</option>
        <option v-for="interval in mapperParams.intervals.paramList" :value="interval.value">
          {{ interval.name }}
        </option>
      </select>
    </div>

    <div id="param-overlap-div" class="grid grid-cols-3">
      <label for="overlap-select">Overlap %</label>
      <select name="overlap-select" id="overlap-select" class="col-span-2" v-model="mapperParams.overlap.selected">
        <option disabled>Select overlap</option>
        <option v-for="overlap in mapperParams.overlap.paramList" :value="overlap.value">
          {{ overlap.name }}
        </option>
      </select>
    </div>

    <div id="param-layout-div" class="grid grid-cols-3">
      <label for="layout-select">Layout</label>
      <select name="layout-select" id="layout-select" class="col-span-2" v-model="mapperParams.layout.selected">
        <option disabled>Select layout</option>
        <option v-for="layout in mapperParams.layout.paramList" :value="layout.value">
          {{ layout.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  label {
    @apply bg-gray-200 rounded-l text-gray-600 p-2;
  }
  select {
    @apply text-gray-600 p-2 bg-gray-50 rounded-r focus:outline focus:outline-2 focus:outline-blue-300;
  }
</style>
