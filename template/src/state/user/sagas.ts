import {all, call, put, takeLatest} from 'redux-saga/effects';
import {ApiService} from '~/core/api/ApiService';
import {UserActions} from './slice';
import {PayloadAction} from '@reduxjs/toolkit';
import {ApiResult, User} from '~/core';

function* loginRequest({
  payload: {email, password},
}: PayloadAction<{email: string; password: string}>) {
  const response: Awaited<ApiResult<User>> = yield call(
    ApiService.User.doLogin,
    email,
    password,
  );

  if (response.success) {
    put(UserActions.loginSuccess(response.data));
  } else if (response.failure) {
    put(UserActions.loginFailure(response.message));
  }
}

export function* userWatcher() {
  yield all([takeLatest(UserActions.loginRequest, loginRequest)]);
}
