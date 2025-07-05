import Axios, {AxiosResponse} from 'axios';
import {isError} from '~/utils';
import {
  AbortErrorName,
  AbortReason,
  ApiErrorMessage,
  AuthorizationHeaderKey,
  BaseHeaders,
  HttpMethod,
  NetworkErrorMessage,
} from './constants';
import {
  ApiFailureResult,
  ApiRequestConfig,
  ApiResult,
  CreateApiHandlerConfig,
  GeneralApiResponse,
  GeneralApiResponseData,
} from './types';
import {
  createApiFailureResult,
  createApiSuccessResult,
  createRequestConfig,
} from './utils';

export function createApiHandler(createConfig: CreateApiHandlerConfig) {
  const {baseUrl, baseHeaders} = createConfig;

  const axios = Axios.create({
    baseURL: baseUrl,
    headers: baseHeaders ? baseHeaders : BaseHeaders,
  });

  if (createConfig.addAuthHeader) {
    createConfig;
    axios.interceptors.request.use(req => {
      if (req.withAuth) {
        const abortController = new AbortController();

        req.signal = abortController.signal;

        const authHeaderValue =
          req.accessToken ?? createConfig.getAuthHeaderValue?.() ?? '';

        if (authHeaderValue) {
          req.headers[
            createConfig.authHeaderKey
              ? createConfig.authHeaderKey
              : AuthorizationHeaderKey
          ] = authHeaderValue;
        } else {
          abortController.abort();
        }
      }

      return req;
    });
  }

  function doGet<R, D>(requestConfig: ApiRequestConfig<D>) {
    const config = createRequestConfig(requestConfig);
    return axios.get<unknown, R>(requestConfig.endpoint, config);
  }

  function doPost<R, D>(requestConfig: ApiRequestConfig<D>) {
    const config = createRequestConfig(requestConfig);
    return axios.post<unknown, R>(
      requestConfig.endpoint,
      requestConfig.data,
      config,
    );
  }

  function doPut<R, D>(requestConfig: ApiRequestConfig<D>) {
    const config = createRequestConfig(requestConfig);
    return axios.put<unknown, R>(
      requestConfig.endpoint,
      requestConfig.data,
      config,
    );
  }

  function doPatch<R, D>(requestConfig: ApiRequestConfig<D>) {
    const config = createRequestConfig(requestConfig);
    return axios.patch<unknown, R>(
      requestConfig.endpoint,
      requestConfig.data,
      config,
    );
  }

  function doDelete<R, D>(requestConfig: ApiRequestConfig<D>) {
    const config = createRequestConfig(requestConfig);
    return axios.delete<unknown, R>(requestConfig.endpoint, config);
  }

  async function _makeApiRequest<D, R>(
    requestConfig: ApiRequestConfig<D>,
  ): Promise<ApiResult<R>> {
    try {
      let response: AxiosResponse<R>;

      switch (requestConfig.method) {
        case HttpMethod.Get:
          response = await doGet<AxiosResponse<R>, D>(requestConfig);
          break;
        case HttpMethod.Post:
          response = await doPost<AxiosResponse<R>, D>(requestConfig);
          break;
        case HttpMethod.Put:
          response = await doPut<AxiosResponse<R>, D>(requestConfig);
          break;
        case HttpMethod.Patch:
          response = await doPatch<AxiosResponse<R>, D>(requestConfig);
          break;
        case HttpMethod.Delete:
          response = await doDelete<AxiosResponse<R>, D>(requestConfig);
          break;
        default:
          throw new Error('Invalid Http Method');
      }

      return createApiSuccessResult(response.data, response);
    } catch (error) {
      let failureResult: ApiFailureResult;

      if (Axios.isAxiosError(error)) {
        failureResult = createApiFailureResult({cause: error});
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
      }
      if (isError(error)) {
        failureResult = failureResult = createApiFailureResult({
          message: '',
          code: -1,
          cause: error,
        });

        if (error.name === AbortErrorName) {
          failureResult.message = AbortReason;
          failureResult.code = -2;
        } else {
          failureResult.message = ApiErrorMessage.UnableToSendRequest;
        }
      } else {
        failureResult = createApiFailureResult({
          message: ApiErrorMessage.UnableToSendRequest,
          code: -1,
        });
      }

      if (requestConfig.rejectOnError ?? createConfig.rejectOnError ?? false) {
        return Promise.reject(failureResult);
      }

      return failureResult;
    }
  }

  const makeApiRequest = <
    R extends GeneralApiResponse = GeneralApiResponse,
    D = undefined,
  >(
    requestConfig: ApiRequestConfig<D>,
  ) => _makeApiRequest<D, R>(requestConfig);

  return {
    makeApiRequest,
  };
}
