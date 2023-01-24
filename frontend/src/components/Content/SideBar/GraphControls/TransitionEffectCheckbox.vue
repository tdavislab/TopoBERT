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
  <div class="grid grid-cols-2" title="Set tracking mode">
    <label for="transition-checkbox">Transition</label>
    <input id="transition-checkbox" type="checkbox" v-model="transitionEffect" />
  </div>
</template>

<style lang="postcss" scoped></style>
