import {useGlobalStore} from '~/state';
import {createApiHandler} from './common';
import {BaseUrl} from './constants';

export const ApiHandler = createApiHandler({
  baseUrl: BaseUrl,
  addAuthHeader: true,
  rejectOnError: true,
  getAuthHeaderValue() {
    return useGlobalStore.getState().accessToken;
  },
});
