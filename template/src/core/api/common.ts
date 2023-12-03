import Axios, {AxiosRequestConfig} from 'axios';
import {ApiErrorMessage, HttpMethod} from './constants';
import {isError, isObjectNotEmpty} from '~/utils';
import {BaseUrl} from './constants';
import {
  ApiFailureResult,
  ApiRequestConfig,
  ApiResult,
  ApiSuccessResult,
  CustomErrorHandler,
  GeneralApiResponse,
  GeneralApiResponseData,
} from './types';
import {store} from '~/state';

const axios = Axios.create({
  baseURL: BaseUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const headersWithAuth = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

axios.interceptors.request.use(req => {
  if (req.withAuth) {
    const accessToken = req.accessToken
      ? req.accessToken
      : store.getState().user.accessToken;

    if (accessToken && accessToken.trim() !== '') {
      req.headers = headersWithAuth(accessToken);
    } else {
      throw new Axios.Cancel(
        'Looks like you forgot to set valid value for access token',
      );
    }
  }

  return req;
});
axios.interceptors.response.use(({data}) => data);

function createRequestConfig<D>(requestConfig: ApiRequestConfig<D>) {
  const axiosReqConfig: AxiosRequestConfig = {};

  axiosReqConfig.withAuth = requestConfig.withAuth;
  axiosReqConfig.accessToken = requestConfig.accessToken;

  if (requestConfig.data && isObjectNotEmpty(requestConfig.data)) {
    axiosReqConfig.data = requestConfig.data;
  }

  return axiosReqConfig;
}

export const createApiSuccessResult = <D = undefined>(
  result?: Partial<ApiSuccessResult<D>>,
): ApiSuccessResult<D> => ({
  success: true,
  failure: false,
  code: result?.code ?? 200,
  data: result?.data,
});

export const createApiFailureResult = (
  result?: Partial<ApiFailureResult>,
): ApiFailureResult => ({
  success: false,
  failure: true,
  message: result?.message ?? ApiErrorMessage.General,
  code: result?.code ?? -1,
  cause: result?.cause,
});

export function handlerError(error: unknown): ApiFailureResult {
  if (Axios.isAxiosError(error)) {
    const failureResult = createApiFailureResult({cause: error});
    const statusCode = error.response?.status;

    if (statusCode === 0) {
      failureResult.message = ApiErrorMessage.Network;
      failureResult.code = statusCode;
    } else if (statusCode) {
      const data = error.response?.data as GeneralApiResponseData;
      failureResult.message = data?.message || ApiErrorMessage.General;
      failureResult.code = statusCode;
    } else {
      failureResult.message = ApiErrorMessage.UnableToSendRequest;
      failureResult.code = -1;
    }

    return failureResult;
  }
  if (isError(error)) {
    return createApiFailureResult({
      message: ApiErrorMessage.UnableToSendRequest,
      code: -1,
      cause: error,
    });
  } else {
    return createApiFailureResult({
      message: ApiErrorMessage.UnableToSendRequest,
      code: -1,
    });
  }
}

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

async function _doApiRequest<D, R>(
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

    return createApiSuccessResult({data});
  } catch (error) {
    return errorHandler ? errorHandler(error) : handlerError(error);
  }
}

export const doApiRequest = <R extends GeneralApiResponse = GeneralApiResponse>(
  requestConfig: ApiRequestConfig<undefined>,
  errorHandler?: CustomErrorHandler,
) => _doApiRequest<undefined, R>(requestConfig, errorHandler);

export const doApiRequestWithBody = <
  D,
  R extends GeneralApiResponse = GeneralApiResponse,
>(
  requestConfig: ApiRequestConfig<D>,
  errorHandler?: CustomErrorHandler,
) => _doApiRequest<D, R>(requestConfig, errorHandler);
