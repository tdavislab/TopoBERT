<script lang="ts" setup>
  import { computed } from 'vue';
  import { useStore } from '../../../../store/store';

  const store = useStore();
  const transitionEffect: any = computed({
    get() {
      return store.state.transitionEffect;
    },
    set(value) {
      store.commit('setTransitionEffect', value);
      if (value) {
        store.commit('setBubbleGlyph', true);
      }
    },
  });
</script>

<template>
  <div class="grid grid-cols-12" title="Set tracking mode">
    <div class="col-span-3">Transition</div>
    <input class="col-span-1" type="checkbox" v-model="transitionEffect" />
  </div>
</template>

<style lang="postcss" scoped></style>
