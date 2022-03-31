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
  <div class="grid grid-cols-12" title="Set tracking mode">
    <div class="col-span-3">Tracking</div>
    <input class="col-span-1" type="checkbox" v-model="trackingMode" />
  </div>
</template>

<style lang="postcss" scoped></style>
