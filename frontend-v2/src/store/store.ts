// store.ts
import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import { RootState } from './types';

// define injection key
export const key: InjectionKey<Store<RootState>> = Symbol();

// set state
const state: RootState = {
  count: 0,
  layerObj: { layers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], selected: 0 },
};

const mutations = {
  increment(state: RootState) {
    state.count++;
  },
  decrement(state: RootState) {
    state.count--;
  },
  setLayer(state: RootState, layer: number) {
    state.layerObj.selected = layer;
  },
};

const actions = {};

const getters = {};

export const store = createStore<RootState>({
  state,
  mutations,
  actions,
  getters,
});

export function useStore() {
  return baseUseStore(key);
}
