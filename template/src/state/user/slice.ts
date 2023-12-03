import {PayloadAction, Reducer, createSlice} from '@reduxjs/toolkit';
import {resetApiStateExtraReducer} from '../common';
import {UserApiStateKeys, UserReducerName} from './constants';
import {UserState} from './types';
import {User} from '~/core';
import {ApiState} from '~/core';

const initialState = {
  splashLoading: true,
  loggedIn: false,
  details: {},
  message: '',
} as UserState;

const userSlice = createSlice({
  name: UserReducerName,
  initialState,
  reducers: {
    setSplashLoading(state, action) {
      state.splashLoading = action.payload;
    },
    setLoggedIn(state, action) {
      state.loggedIn = action.payload;
    },
    loginRequest: {
      reducer(state) {
        state[UserApiStateKeys.LoginRequestApiState] = ApiState.Pending;
      },
      prepare(loginParams: {email: string; password: string}) {
        return {payload: loginParams};
      },
    },
    loginSuccess(state, action: PayloadAction<User | undefined>) {
      state[UserApiStateKeys.LoginRequestApiState] = ApiState.Success;
      state.details = action.payload;
    },
    loginFailure(state, action) {
      state[UserApiStateKeys.LoginRequestApiState] = ApiState.Failure;
      state.message = action.payload;
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
  },
  extraReducers: resetApiStateExtraReducer,
});

export const UserActions = userSlice.actions;
export const userReducer: Reducer<UserState> = userSlice.reducer;
