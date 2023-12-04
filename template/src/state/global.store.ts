import {create} from 'zustand';
import {GlobalState} from './types';

export const useGlobalStore = create<GlobalState>(set => ({
  splashLoading: true,
  loggedIn: false,
  accessToken: '',

  setSplashLoading(loading) {
    set({splashLoading: loading});
  },
  setLoggedIn(loggedIn) {
    set({loggedIn});
  },
  setAccessToken(accessToken) {
    set({accessToken});
  },
}));
