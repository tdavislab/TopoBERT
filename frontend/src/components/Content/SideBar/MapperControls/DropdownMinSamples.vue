<script lang="ts" setup>
  import { useStore } from '../../../../store/store';
  import { computed } from 'vue';

  const store = useStore();
  const mapperParams = computed(() => store.state.mapperParams);
</script>

<template>
  <div id="param-overlap-div" class="grid grid-cols-3">
    <label for="overlap-select">DBSCAN Min Samples</label>
    <select name="overlap-select" id="overlap-select" class="col-span-2" v-model="mapperParams.minSamples.selected">
      <option disabled>Select DBSCAN min_samples</option>
      <option v-for="minSample in mapperParams.minSamples.paramList" :value="minSample.value">
        {{ minSample.name }}
      </option>
    </select>
  </div>
</template>

<style lang="postcss" scoped></style>
