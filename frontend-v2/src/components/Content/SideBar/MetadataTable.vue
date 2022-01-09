<script lang="ts" setup>
  import { ref } from 'vue';
  import { store } from '../../../store/store';

  let showTable = ref(false);
  const metadataTable = store.state.mTable;

  function toggleTable() {
    showTable.value = !showTable.value;
  }

  function bgColorPicker(backgroundColor: string, lightColor = 'white', darkColor = 'black') {
    let color = backgroundColor.charAt(0) === '#' ? backgroundColor.substring(1, 7) : backgroundColor;
    let r = parseInt(color.substring(0, 2), 16); // hexToR
    let g = parseInt(color.substring(2, 4), 16); // hexToG
    let b = parseInt(color.substring(4, 6), 16); // hexToB
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? darkColor : lightColor;
  }
</script>

<template>
  <div class="grid gap-3 border rounded p-3 bg-gray-50 transition-all">
    <div class="text-xl flex justify-between">
      <span class="cursor-pointer" @click="toggleTable()">
        <span class="mr-2">Node member data</span>
        <font-awesome-icon :icon="showTable ? 'chevron-up' : 'chevron-down'"></font-awesome-icon>
      </span>
    </div>
    <div v-show="showTable" class="flex flex-col">
      <table class="w-full border-collapse border-b shadow">
        <thead class="bg-slate-500 text-gray-50">
          <th class="border text-left px-2" v-for="headerItem in metadataTable.header">{{ headerItem }}</th>
        </thead>
        <tbody>
          <tr v-for="row in metadataTable.rows">
            <td class="border-b px-2" v-for="cell in row">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
