import {createGlobalStateSelector} from './common';

export const GlobalSelectors = {
  selectSplashLodaing: createGlobalStateSelector('splashLoading'),
  selectLoggedIn: createGlobalStateSelector('loggedIn'),
};
