import {AxiosRequestConfig, AxiosResponse} from 'axios';
import {isObjectNotEmpty} from '~/utils';
import {ApiErrorMessage} from './constants';
import {ApiFailureResult, ApiRequestConfig, ApiSuccessResult} from './types';

export const SuccessResultSymbol = Symbol('success');
export const FailureResultSymbol = Symbol('failure');

export function createRequestConfig<D>(requestConfig: ApiRequestConfig<D>) {
  const axiosReqConfig: AxiosRequestConfig = {};

  if (requestConfig.query) {
    axiosReqConfig.params = requestConfig.query;
  }

  axiosReqConfig.withAuth = requestConfig.withAuth ?? true;
  axiosReqConfig.accessToken = requestConfig.accessToken;

  if (requestConfig.data && isObjectNotEmpty(requestConfig.data)) {
    axiosReqConfig.data = requestConfig.data;
  }

  return axiosReqConfig;
}

export const createApiSuccessResult = <D>(
  data: D,
  response: AxiosResponse,
  code: number = 200,
): ApiSuccessResult<D> => ({
  success: true,
  failure: false,
  code: code ?? 200,
  value: data,
  cause: null,
  meta: response,
  [SuccessResultSymbol]: true,
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
  [FailureResultSymbol]: true,
});

export const isApiSuccessResult = <D>(
  value: any,
): value is ApiSuccessResult<D> => value?.[SuccessResultSymbol] === true;
export const isApiFailureResult = (value: any): value is ApiFailureResult =>
  value?.[FailureResultSymbol] === true;
