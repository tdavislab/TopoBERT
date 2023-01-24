<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { store } from '../../../store/store';
  import Projection from './Projection.vue';

  let showTable = ref(true);
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

  function renderCell(row: string[], idx: number) {
    if (idx !== 4) {
      if (idx === 3 && row[idx].startsWith('p.')) {
        return row[idx].split('.')[1];
      }
      return row[idx];
    } else {
      const word_idx = parseInt(row[1]) - 1;
      const sentence = row[4];
      // underline word at word_idx in sentence
      const sentence_split = sentence.split(' ');
      const sentence_split_len = sentence_split.length;
      let sentence_split_str = '';
      for (let i = 0; i < sentence_split_len; i++) {
        if (i === word_idx) {
          sentence_split_str += `<span class="font-bold" style="text-decoration: underline">${sentence_split[i]}</span>`;
        } else {
          sentence_split_str += sentence_split[i];
        }
        if (i !== sentence_split_len - 1) {
          sentence_split_str += ' ';
        }
      }
      return sentence_split_str;
    }
  }
</script>

<template>
  <div class="grid gap-3 border rounded p-3 transition-all bg-gray-50">
    <div class="text-xl flex justify-between">
      <span class="cursor-pointer" @click="toggleTable()">
        <span class="mr-2">Sentence Data</span>
        <font-awesome-icon :icon="showTable ? 'chevron-up' : 'chevron-down'"></font-awesome-icon>
      </span>
    </div>
    <div v-show="showTable" class="flex flex-col overflow-y-scroll" style="max-height: 500px">
      <table class="w-full border-collapse border-b shadow">
        <thead class="bg-slate-500 text-gray-50">
          <tr>
            <th class="border text-left px-2 sticky top-0 bg-slate-500" v-for="headerItem in metadataTable.header">{{ headerItem }}</th>
          </tr>
        </thead>
        <tbody style="height: 20px">
          <tr v-for="row in metadataTable.rows" :style="{ 'background-color': bgColor(row[3]), color: fgColor(bgColor(row[3])) }">
            <td class="border-b px-2" v-for="(cell, idx) in row"><span v-html="renderCell(row, idx)"></span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
