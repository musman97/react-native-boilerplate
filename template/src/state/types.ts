import {
  CaseReducerActions,
  Slice as RtkSlice,
  SliceCaseReducers,
} from '@reduxjs/toolkit';
import {ApiState} from '~/core';

type StateWithApiState = {
  [key: string]: ApiState;
};

export type Slice<State, Name extends string> = RtkSlice<
  State,
  SliceCaseReducers<State>,
  Name
>;

export type SliceActions<State> = CaseReducerActions<SliceCaseReducers<State>>;

export type SliceStateWithApiState<State> = State & StateWithApiState;
