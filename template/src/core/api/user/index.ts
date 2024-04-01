import {createApiSuccessResult, makeApiRequest, handlerError} from '../common';
import {ApiEndpoints, HttpMethod} from '../constants';
import type {LoginApiResponse} from './types';

export const UserApiService = {
  async login(email: string, password: string) {
    const loginRes = await makeApiRequest<
      {email: string; password: string},
      LoginApiResponse
    >({
      endpoint: ApiEndpoints.User.Login,
      method: HttpMethod.Post,
      withAuth: false,
      data: {
        email,
        password,
      },
    });

    if (loginRes.success) {
      return createApiSuccessResult({data: loginRes.data?.data});
    } else {
      return handlerError(loginRes);
    }
  },
};
