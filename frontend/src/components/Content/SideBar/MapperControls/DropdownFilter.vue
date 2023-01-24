<script lang="ts" setup>
  import { useStore } from '../../../../store/store';
  import { computed } from 'vue';

  const store = useStore();
  const mapperParams = computed(() => store.state.mapperParams);
</script>

<template>
  <div id="param-filter-div" class="grid grid-cols-3">
    <label for="filter-select">Lens (Filter) Function</label>
    <select name="filter-select" id="filter-select" class="col-span-2" v-model="mapperParams.filter.selected">
      <option disabled>Select filter</option>
      <option v-for="filter in mapperParams.filter.paramList" :value="filter.value">
        {{ filter.name }}
      </option>
    </select>
  </div>
</template>

<style lang="postcss" scoped></style>
