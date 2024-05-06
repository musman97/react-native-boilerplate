import {makeApiRequest} from '../common';
import {ApiEndpoints, HttpMethod} from '../constants';
import type {LoginApiResponse} from './types';

export const UserApiService = {
  login: (email: string, password: string) =>
    makeApiRequest<LoginApiResponse, {email: string; password: string}>({
      endpoint: ApiEndpoints.User.Login,
      method: HttpMethod.Post,
      withAuth: false,
      data: {
        email,
        password,
      },
    }),
};
