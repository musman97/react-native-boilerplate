import {SliceStateWithApiState} from '../types';
import type {User} from '~/core';

export type TUserReducerName = 'user';

export type UserState = SliceStateWithApiState<{
  splashLoading: boolean;
  loggedIn: boolean;
  accessToken?: string;
  details?: User;
  message: string;
}>;
