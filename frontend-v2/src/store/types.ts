// define your typings for the store state
export type State = {
  count: number;
};

// Typings for Mutations
export enum MutationTypes {
  INC_COUNTER = 'INC_COUNTER',
  DEC_COUNTER = 'DEC_COUNTER',
}

export type Mutations<S = State> = {
  [MutationTypes.INC_COUNTER](state: S): void;
};

// Typings for Actions
export enum ActionTypes {
  INC_COUNTER = 'INC_COUNTER',
  DEC_COUNTER = 'DEC_COUNTER',
}

// Typings for Getters
export type GetterTypes = {
  doubleCounter(state: State): number;
};
