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
  <div class="grid grid-cols-12" title="Set tracking mode">
    <div class="col-span-3">Bubble Glyph</div>
    <input class="col-span-1" type="checkbox" v-model="bubbleGlyphMode" />
  </div>
</template>

<style lang="postcss" scoped></style>
