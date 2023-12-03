import {doApiRequestWithBody} from '../common';
import {ApiEndpoints, HttpMethod} from '../constants';
import type {LoginApiResponse} from './types';

export const UserApiService = {
  doLogin: (email: string, password: string) =>
    doApiRequestWithBody<{email: string; password: string}, LoginApiResponse>({
      endpoint: ApiEndpoints.User.Login,
      method: HttpMethod.Post,
      withAuth: false,
      data: {
        email,
        password,
      },
    }),
};
