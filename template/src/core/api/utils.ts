import Axios, {AxiosRequestConfig} from 'axios';
import {isError, isObjectNotEmpty} from '~/utils';
import {ApiErrorMessage, NetworkErrorMessage} from './constants';
import {
  ApiFailureResult,
  ApiRequestConfig,
  ApiSuccessResult,
  GeneralApiResponseData,
} from './types';

export function createRequestConfig<D>(requestConfig: ApiRequestConfig<D>) {
  const axiosReqConfig: AxiosRequestConfig = {};

  if (requestConfig.query) {
    axiosReqConfig.params = requestConfig.query;
  }

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
  value: data,
  cause: null,
});

export const createApiFailureResult = (
  result?: Partial<ApiFailureResult>,
): ApiFailureResult => ({
  success: false,
  failure: true,
  value: null,
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
