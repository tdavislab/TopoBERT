<script lang="ts" setup>
  import { useStore } from '../../../../store/store';
  import { computed } from 'vue';

  const store = useStore();
  const mapperParams = computed(() => store.state.mapperParams);
</script>

<template>
  <div id="param-interval-div" class="grid grid-cols-3">
    <label for="interval-select">Intervals</label>
    <select name="interval-select" id="interval-select" class="col-span-2" v-model="mapperParams.intervals.selected">
      <option disabled>Select intervals</option>
      <option v-for="interval in mapperParams.intervals.paramList" :value="interval.value">
        {{ interval.name }}
      </option>
    </select>
  </div>
</template>

<style lang="postcss" scoped></style>
