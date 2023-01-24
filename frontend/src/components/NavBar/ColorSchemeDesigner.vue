<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { useStore } from '../../store/store';
  import Picker from 'vanilla-picker';

  const showModal = ref(false);
  const store = useStore();

  function toggleModal() {
    showModal.value = !showModal.value;
  }

  function saveNewColorScheme() {
    showModal.value = false;
    store.dispatch('updateGraph');
  }

  onMounted(() => {
    Object.keys(store.state.colorMap).forEach((label, index) => {
      const parent = <HTMLElement>document.querySelector(`#label-${label.replace('.', '\\.')}`);

      const picker = new Picker({
        parent: parent,
        color: store.state.colorMap[label].color,
        popup: 'top',
        // alpha: true,
        onDone: (color) => {
          store.state.colorMap[label].color = color.rgbaString;
          store.dispatch('updateGraph');
        },
      });
    });
  });
</script>

<template>
  <div><button class="w-full" @click="toggleModal()">Change Color Scheme</button></div>

  <!-- <div v-show="showModal" class="fixed z-10 top-0 w-full left-0" id="modal">
    <div class="flex items-center justify-center pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-900 opacity-75" @click="toggleModal"></div>
      </div>

      <span class="hidden align-middle sm:h-screen">&#8203;</span>
      <div class="inline-block text-black rounded-lg text-left shadow-xl transform transition-all my-8 align-middle max-w-lg w-full" role="dialog">
        <div class="bg-white p-4">
          <span v-for="(color, label) in { ...store.state.colorMap }" class="grid grid-cols-3">
            <div class="col-span-2">{{ label }}</div>
            <input type="color" v-model="color.color" />
            <a href="#" :id="'label-' + label" :style="{ backgroundColor: color.color }"></a>
          </span>
        </div>
        <div class="bg-gray-200 p-4 text-right">
          <button type="button" @click="saveNewColorScheme()">Save</button>
        </div>
      </div>
    </div>
  </div> -->
  <div id="modal" v-show="showModal" class="fixed z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4">
    <div class="relative top-10 bottom-10 mx-auto shadow-lg rounded-md bg-white max-w-md">
      <!-- Modal header -->
      <!-- <div class="flex justify-between items-center bg-green-500 text-white text-xl rounded-t-md px-4 py-2">
        <h3>Modal header</h3>
        <button onclick="toggleModal()">x</button>
      </div> -->

      <!-- Modal body -->
      <div class="bg-white text-black p-4">
        <span v-for="(color, label) in { ...store.state.colorMap }" class="grid grid-cols-3">
          <div class="col-span-2">{{ label }}</div>
          <input type="color" v-model="color.color" />
          <!-- <a href="#" :id="'label-' + label" :style="{ backgroundColor: color.color }"></a> -->
        </span>
      </div>

      <!-- Modal footer -->
      <div class="px-4 py-2 border-t border-t-gray-500 flex justify-end items-center space-x-4">
        <button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition" @click="saveNewColorScheme()">Close</button>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  button {
    @apply font-semibold bg-indigo-500 p-2 px-3 rounded hover:bg-indigo-600 transition-all text-white;
  }
</style>
