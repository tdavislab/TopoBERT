<script lang="ts" setup>
  import { useStore } from '../../../../store/store';
  import { computed, ref } from 'vue';

  const showModal = ref(false);
  const store = useStore();
  const intervals = ref('');
  const overlap = ref('');
  const minSamples = ref('');

  function toggleModal() {
    showModal.value = !showModal.value;
  }

  function addNewParamConfig() {
    showModal.value = false;
    if (intervals.value !== '') {
      store.state.mapperParams.intervals.paramList.push({ name: intervals.value, value: parseInt(intervals.value) });
    }
    if (overlap.value !== '') {
      store.state.mapperParams.overlap.paramList.push({ name: overlap.value, value: parseInt(overlap.value) });
    }
    if (minSamples.value !== '') {
      store.state.mapperParams.minSamples.paramList.push({ name: minSamples.value, value: parseInt(minSamples.value) });
    }
  }
</script>

<template>
  <button @click="toggleModal">Add New Parameter Values</button>

  <div v-show="showModal" class="fixed z-10 overflow-y-auto top-0 w-full left-0" id="modal">
    <div class="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-900 opacity-75" @click="toggleModal"></div>
      </div>

      <span class="hidden align-middle smh-screen">&#8203;</span>
      <div
        class="inline-block text-black rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 align-middle max-w-lg w-full"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div class="bg-white p-4 grid grid-cols-6">
          <label class="col-span-2">Intervals</label>
          <input class="col-span-4" type="text" v-model="intervals" placeholder="Enter integer greater than 0" />
        </div>
        <div class="bg-white p-4 grid grid-cols-6">
          <label class="col-span-2">Overlap %</label>
          <input class="col-span-4" type="text" v-model="overlap" placeholder="Enter integer in range [0, 99]" />
        </div>
        <div class="bg-white p-4 grid grid-cols-6">
          <label class="col-span-2">DBSCAN min samples</label>
          <input class="col-span-4" type="text" v-model="minSamples" placeholder="Enter integer integer greater than 0" />
        </div>
        <div class="bg-gray-200 p-4 text-right">
          <button type="button" @click="addNewParamConfig">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  button {
    @apply font-semibold bg-indigo-500 p-2 px-3 rounded hover:bg-indigo-600 transition-all text-white;
  }

  label {
    @apply bg-gray-300 rounded-l text-gray-600 p-2;
  }

  input {
    @apply text-gray-600 p-2 bg-gray-50 rounded-r  hover:bg-gray-100 focus:outline focus:outline-2 focus:outline-blue-300;
  }
</style>
