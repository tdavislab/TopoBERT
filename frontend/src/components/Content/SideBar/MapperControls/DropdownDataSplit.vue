<script lang="ts" setup>
  import { useStore } from '../../../../store/store';
  import { computed } from 'vue';

  const store = useStore();
  const mapperParams = computed(() => store.state.mapperParams);
</script>

<template>
  <div id="param-datasplit-div" class="grid grid-cols-4">
    <label for="data-split-select">Split</label>
    <select name="data-split-select" id="data-split-select" class="col-span-3" v-model="mapperParams.dataSplit.selected">
      <option disabled>Select Data Split</option>
      <option v-for="dataSplit in mapperParams.dataSplit.paramList" :value="dataSplit.value">
        {{ dataSplit.name }}
      </option>
    </select>
  </div>
</template>

<style lang="postcss" scoped></style>
