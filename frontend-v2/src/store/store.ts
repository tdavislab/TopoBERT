// store.ts
import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import { RootState } from './types';

// define injection key
export const key: InjectionKey<Store<RootState>> = Symbol();

// set state
const state: RootState = {
  count: 0,
};

const mutations = {
  increment(state: RootState) {
    state.count++;
  },
  decrement(state: RootState) {
    state.count--;
  },
};

export const store = createStore<RootState>({
  state,
  mutations,
  actions: {},
  getters: {},
});

export function useStore() {
  return baseUseStore(key);
}
