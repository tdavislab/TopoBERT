<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { store } from '../../../store/store';

  let showTable = ref(false);
  const metadataTable = computed(() => {
    let sortedRows = store.state.mTable.rows.sort((a, b) => {
      if (a[3] < b[3]) {
        return -1;
      }
      if (a[3] > b[3]) {
        return 1;
      }
      return 0;
    });

    return { header: store.state.mTable.header, rows: sortedRows };
  });

  console.log(metadataTable.value);

  function toggleTable() {
    showTable.value = !showTable.value;
  }

  function fgColor(backgroundColor: string, lightColor = 'white', darkColor = 'black') {
    let color = backgroundColor.charAt(0) === '#' ? backgroundColor.substring(1, 7) : backgroundColor;
    let r = parseInt(color.substring(0, 2), 16); // hexToR
    let g = parseInt(color.substring(2, 4), 16); // hexToG
    let b = parseInt(color.substring(4, 6), 16); // hexToB
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? darkColor : lightColor;
  }

  function bgColor(classLabel: string) {
    if (classLabel in store.state.colorMap) {
      return store.state.colorMap[classLabel].color;
    }
    return '#ffffff';
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
    <div v-show="showTable" class="flex flex-col overflow-y-scroll" style="height: 25vh">
      <table class="w-full border-collapse border-b shadow">
        <thead class="bg-slate-500 text-gray-50">
          <th class="border text-left px-2" v-for="headerItem in metadataTable.header">{{ headerItem }}</th>
        </thead>
        <tbody style="height: 20px">
          <tr v-for="row in metadataTable.rows" :style="{ 'background-color': bgColor(row[3]), color: fgColor(bgColor(row[3])) }">
            <td class="border-b px-2" v-for="cell in row">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
