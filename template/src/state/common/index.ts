import {ActionReducerMapBuilder} from '@reduxjs/toolkit';
import {CommonActionTypes} from './actionTypes';
import {CommonActions} from './actions';
import {ApiState} from '~/core';
import type {RootState} from '../store';

const resetApiStateExtraReducer = (
  builder: ActionReducerMapBuilder<RootState[keyof RootState]>,
) => {
  builder.addCase(CommonActions.resetApiState, (state, action) => {
    if (action.payload) {
      state[action.payload] = ApiState.Idle;
    }
  });
};

export {CommonActionTypes, CommonActions, resetApiStateExtraReducer};
