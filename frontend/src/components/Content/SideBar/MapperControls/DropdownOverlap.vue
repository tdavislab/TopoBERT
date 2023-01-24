<script lang="ts" setup>
  import { useStore } from '../../../../store/store';
  import { computed } from 'vue';

  const store = useStore();
  const mapperParams = computed(() => store.state.mapperParams);
</script>

<template>
  <div id="param-overlap-div" class="grid grid-cols-3">
    <label for="overlap-select">Overlap %</label>
    <select name="overlap-select" id="overlap-select" class="col-span-2" v-model="mapperParams.overlap.selected">
      <option disabled>Select overlap</option>
      <option v-for="overlap in mapperParams.overlap.paramList" :value="overlap.value">
        {{ overlap.name }}
      </option>
    </select>
  </div>
</template>

<style lang="postcss" scoped></style>
