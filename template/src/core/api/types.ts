import {AxiosError} from 'axios';
import {SuccessResult, FailureResult} from '~/types';
import {HttpMethod} from './constants';

type ApiRequestConfigBase = {
  endpoint: string;
  method: HttpMethod;
  withAuth: boolean;
  accessToken?: string;
};

export type ApiRequestConfig<D> = D extends undefined
  ? ApiRequestConfigBase & {data?: D}
  : ApiRequestConfigBase & {data: D};

export type ApiSuccessResult<D> = SuccessResult<D> & {code: number};

export type ApiFailureResult = FailureResult<
  number,
  undefined | AxiosError | Error
>;

export type ApiResult<R> = ApiSuccessResult<R> | ApiFailureResult;

export type CustomErrorHandler = (error: unknown) => ApiFailureResult;

export type GeneralApiResponseData = {message?: string};

export type GeneralApiResponse<D = unknown> = {
  error?: string;
  message?: string;
  data?: D;
};
