import {UserReducerName} from './constants';
import type {RootState} from '../store';

const selectState = (state: RootState) => state[UserReducerName];

export const UserSelectors = {
  selectState,
  selectSplashLoading: (state: RootState) => selectState(state).splashLoading,
  selectLoggedIn: (state: RootState) => selectState(state).loggedIn,
  selectDetails: (state: RootState) => selectState(state).details,
  selectMessage: (state: RootState) => selectState(state).message,
};
