import {
  createApiSuccessResult,
  doApiRequestWithBody,
  handlerError,
} from '../common';
import {ApiEndpoints, HttpMethod} from '../constants';
import type {LoginApiResponse} from './types';

export const UserApiService = {
  async doLogin(email: string, password: string) {
    const loginRes = await doApiRequestWithBody<
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
