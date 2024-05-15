import Axios, {AxiosRequestConfig} from 'axios';
import {ApiErrorMessage, HttpMethod, NetworkErrorMessage} from './constants';
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
import {useGlobalStore} from '~/state';

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

function createRequestConfig<D>(requestConfig: ApiRequestConfig<D>) {
  const axiosReqConfig: AxiosRequestConfig = {};

  axiosReqConfig.withAuth = requestConfig.withAuth;
  axiosReqConfig.accessToken = requestConfig.accessToken;

  if (requestConfig.data && isObjectNotEmpty(requestConfig.data)) {
    axiosReqConfig.data = requestConfig.data;
  }

  return axiosReqConfig;
}

export const createApiSuccessResult = <D>(
  data: D,
  code: number = 200,
): ApiSuccessResult<D> => ({
  success: true,
  failure: false,
  code: code ?? 200,
  data,
  cause: null,
});

export const createApiFailureResult = (
  result?: Partial<ApiFailureResult>,
): ApiFailureResult => ({
  success: false,
  failure: true,
  data: null,
  message: result?.message ?? ApiErrorMessage.General,
  code: result?.code ?? -1,
  cause: result?.cause,
});

export function handlerError(error: unknown): ApiFailureResult {
  if (Axios.isAxiosError(error)) {
    const failureResult = createApiFailureResult({cause: error});
    const statusCode = error.response?.status;

    /**
     * Condition copied from
     * https://github.com/infinitered/apisauce/blob/a9e015a1c6ae649dc521490c41d1054b091f6639/lib/apisauce.ts#L83
     */
    if (error.message === NetworkErrorMessage) {
      failureResult.message = ApiErrorMessage.Network;
      failureResult.code = 0;
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
