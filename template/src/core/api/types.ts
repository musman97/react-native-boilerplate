import {AxiosError, AxiosResponse} from 'axios';
import {SuccessResult, FailureResult} from '~/types';
import {HttpMethod} from './constants';

type ApiRequestConfigBase = {
  endpoint: string;
  method: HttpMethod;
  withAuth?: boolean;
  accessToken?: string;
  query?: Record<string, string>;
  rejectOnError?: boolean;
};

export type ApiRequestConfig<D> = D extends undefined
  ? ApiRequestConfigBase & {data?: D}
  : ApiRequestConfigBase & {data: D};

export type ApiSuccessResult<D> = SuccessResult<D, number> & {
  code: number;
  meta: AxiosResponse;
  [key: symbol]: true;
};

export type ApiFailureResult = FailureResult<
  number,
  undefined | AxiosError | Error
> & {
  [key: symbol]: true;
};

export type ApiResult<R> = ApiSuccessResult<R> | ApiFailureResult;

export type GeneralApiResponseData = {message?: string};

export type GeneralApiResponse<D = unknown> = {
  error?: string;
  message?: string;
  data?: D;
};

interface BaseCreateApiHandlerConfig {
  baseUrl: string;
  baseHeaders?: Record<string, string>;
  rejectOnError?: boolean;
}
interface ConfigWithoutAuthHeaderInterceptor
  extends BaseCreateApiHandlerConfig {
  addAuthHeader: false;
}
interface ConfigWithAuthHeaderInterceptor extends BaseCreateApiHandlerConfig {
  addAuthHeader: true;
  authHeaderKey?: string;
  getAuthHeaderValue?: () => string;
}
export type CreateApiHandlerConfig =
  | ConfigWithoutAuthHeaderInterceptor
  | ConfigWithAuthHeaderInterceptor;
