// store.ts
import { InjectionKey } from 'vue';
import {
  createStore,
  useStore as baseUseStore,
  Store,
  MutationTree,
  ActionContext,
  ActionTree,
  GetterTree,
} from 'vuex';
import {
  State,
  MutationTypes,
  ActionTypes,
  Mutations,
  GetterTypes,
} from './types';

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

// set state
const state = {
  count: 0,
};

const mutations = {
  increment(state: State) {
    state.count++;
  },
  decrement(state: State) {
    state.count--;
  },
};

export const store = createStore<State>({
  state,
  mutations,
  actions: {},
  getters: {},
});

export function useStore() {
  return baseUseStore(key);
}
