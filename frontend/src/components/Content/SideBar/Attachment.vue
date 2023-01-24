<script lang="ts" setup>
  import { ref } from 'vue';

  let showAttachment = ref(false);

  function toggleStats() {
    showAttachment.value = !showAttachment.value;
  }
</script>

<template>
  <div class="grid gap-3 border rounded p-3 bg-gray-50 transition-all">
    <div class="text-xl flex justify-between">
      <span class="cursor-pointer" @click="toggleStats()">
        <span class="mr-2">Attachments</span>
        <font-awesome-icon :icon="showAttachment ? 'chevron-up' : 'chevron-down'"></font-awesome-icon>
      </span>
    </div>
    <svg v-show="showAttachment" id="attachment-svg" class="bg-white" width="100%" height="1000">
      <g id="attachment-svg-g"></g>
    </svg>
  </div>
</template>

<style lang="postcss" scoped></style>
