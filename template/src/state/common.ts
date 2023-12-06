import {GlobalState} from './types';

const createStateSelector =
  <State extends object, Key extends keyof State>(stateKey: Key) =>
  (state: State) =>
    state[stateKey];

export const createGlobalStateSelector = <Key extends keyof GlobalState>(
  stateKey: Key,
) => createStateSelector<GlobalState, typeof stateKey>(stateKey);
