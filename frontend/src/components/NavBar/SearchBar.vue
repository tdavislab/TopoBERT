<script lang="ts" setup>
  import { ref } from 'vue';
  import { useStore } from '../../store/store';

  const store = useStore();

  const searchTerm = ref('');

  function filterWord() {
    // split the search term into words on commas and remove whitespace
    const words = searchTerm.value.split(',').map((w) => w.trim());

    if (words.length === 1 && words[0] === '') {
      store.commit('resetSelectedNodes');
    } else {
      // convert to set
      const wordSet = new Set(words);
      console.log(wordSet);

      // disptach the filter action
      store.dispatch('highlightWordNodes', wordSet);
    }
  }
</script>

<template>
  <div class="rounded grid grid-cols-12 border p-3 items-center bg-gray-50">
    <label class="col-span-4">Search word in graph:</label>
    <input class="col-span-6 bg-gray-200" type="search" placeholder="" v-model="searchTerm" v-on:keyup.enter="filterWord()" />
    <button @click="filterWord()" class="col-span-2 text-white rounded">
      <font-awesome-icon icon="search"></font-awesome-icon>
    </button>
  </div>
</template>

<style lang="postcss" scoped>
  input {
    @apply rounded-l p-2 text-gray-600 outline-none focus:outline focus:outline-2 focus:outline-blue-300 focus:outline-offset-0;
  }
  button {
    @apply p-2 px-3 rounded-r bg-indigo-500 hover:bg-indigo-600 transition-all;
  }
</style>
