import Axios from 'axios';
import {useGlobalStore} from '~/state';
import {BaseUrl, HttpMethod} from './constants';
import {
  ApiRequestConfig,
  ApiResult,
  CustomErrorHandler,
  GeneralApiResponse,
} from './types';
import {
  createApiSuccessResult,
  createRequestConfig,
  handlerError,
} from './utils';

const axios = Axios.create({
  baseURL: BaseUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axios.interceptors.request.use(req => {
  if (req.withAuth) {
    const accessToken = req.accessToken
      ? req.accessToken
      : useGlobalStore.getState().accessToken;

    if (accessToken && accessToken.trim() !== '') {
      req.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      throw new Axios.Cancel(
        'Looks like you forgot to set valid value for access token',
      );
    }
  }

  return req;
});
axios.interceptors.response.use(({data}) => data);

export function doGet<R, D>(requestConfig: ApiRequestConfig<D>) {
  const config = createRequestConfig(requestConfig);
  return axios.get<unknown, R>(requestConfig.endpoint, config);
}

export function doPost<R, D>(requestConfig: ApiRequestConfig<D>) {
  const config = createRequestConfig(requestConfig);
  return axios.post<unknown, R>(
    requestConfig.endpoint,
    requestConfig.data,
    config,
  );
}

export function doPut<R, D>(requestConfig: ApiRequestConfig<D>) {
  const config = createRequestConfig(requestConfig);
  return axios.put<unknown, R>(
    requestConfig.endpoint,
    requestConfig.data,
    config,
  );
}

export function doPatch<R, D>(requestConfig: ApiRequestConfig<D>) {
  const config = createRequestConfig(requestConfig);
  return axios.patch<unknown, R>(
    requestConfig.endpoint,
    requestConfig.data,
    config,
  );
}

export function doDelete<R, D>(requestConfig: ApiRequestConfig<D>) {
  const config = createRequestConfig(requestConfig);
  return axios.delete<unknown, R>(requestConfig.endpoint, config);
}

async function _makeApiRequest<D, R>(
  requestConfig: ApiRequestConfig<D>,
  errorHandler?: CustomErrorHandler,
): Promise<ApiResult<R>> {
  try {
    let data: R;

    switch (requestConfig.method) {
      case HttpMethod.Get:
        data = await doGet<R, D>(requestConfig);
        break;
      case HttpMethod.Post:
        data = await doPost<R, D>(requestConfig);
        break;
      case HttpMethod.Put:
        data = await doPut<R, D>(requestConfig);
        break;
      case HttpMethod.Patch:
        data = await doPatch<R, D>(requestConfig);
        break;
      case HttpMethod.Delete:
        data = await doDelete<R, D>(requestConfig);
        break;
      default:
        throw new Error('Invalid Http Method');
    }

    return createApiSuccessResult(data);
  } catch (error) {
    return errorHandler ? errorHandler(error) : handlerError(error);
  }
}

export const makeApiRequest = <
  R extends GeneralApiResponse = GeneralApiResponse,
  D = undefined,
>(
  requestConfig: ApiRequestConfig<D>,
  errorHandler?: CustomErrorHandler,
) => _makeApiRequest<D, R>(requestConfig, errorHandler);
