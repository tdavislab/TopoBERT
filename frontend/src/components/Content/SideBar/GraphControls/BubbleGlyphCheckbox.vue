<script lang="ts" setup>
  import { computed } from 'vue';
  import { useStore } from '../../../../store/store';

  const store = useStore();
  const bubbleGlyphMode: any = computed({
    get() {
      return store.state.bubbleGlyph;
    },
    set(value) {
      store.commit('setBubbleGlyph', value);
    },
  });
</script>

<template>
  <div class="grid grid-cols-2" title="Set tracking mode">
    <label for="bubble-checkbox">Bubble Glyph</label>
    <input id="bubble-checkbox" type="checkbox" v-model="bubbleGlyphMode" />
  </div>
</template>

<style lang="postcss" scoped></style>
