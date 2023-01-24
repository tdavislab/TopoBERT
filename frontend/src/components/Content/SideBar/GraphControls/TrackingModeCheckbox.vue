<script lang="ts" setup>
  import { computed } from 'vue';
  import { useStore } from '../../../../store/store';

  const store = useStore();
  const trackingMode: any = computed({
    get() {
      return store.state.trackingMode;
    },
    set(value) {
      store.commit('setTrackingMode', value);
    },
  });
</script>

<template>
  <div class="grid grid-cols-2" title="Set tracking mode">
    <label for="transition-checkbox">Tracking</label>
    <input id="transition-checkbox" type="checkbox" v-model="trackingMode" />
  </div>
</template>

<style lang="postcss" scoped></style>
