<script lang="ts" setup>
  import { ref } from 'vue';

  let showTable = ref(false);

  function toggleTable() {
    showTable.value = !showTable.value;
    console.log(showTable);
  }
</script>

<template>
  <div class="grid gap-3 border rounded p-3 bg-gray-50 cursor-pointer transition-all" @click="toggleTable()">
    <div class="text-xl flex justify-between">
      <span>
        <span class="mr-2">Table</span>
        <font-awesome-icon :icon="showTable ? 'chevron-up' : 'chevron-down'"></font-awesome-icon>
      </span>
    </div>
    <div v-show="showTable">Stats placeholder</div>
  </div>
</template>

<style lang="postcss" scoped></style>
