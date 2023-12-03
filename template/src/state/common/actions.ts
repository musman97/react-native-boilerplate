import {createAction} from '@reduxjs/toolkit';
import {CommonActionTypes} from './actionTypes';

export const CommonActions = {
  resetApiState: createAction(
    CommonActionTypes.RESET_API_STATE,
    (stateKey: string) => ({
      payload: stateKey,
    }),
  ),
};
