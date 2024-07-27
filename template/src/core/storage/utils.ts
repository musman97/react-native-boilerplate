import {isError} from '~/utils';
import {StorageFailureResult, StorageSuccessResult} from './types';

const GeneralErrorMessage = 'Unable to set/get value to/from Local storage';

export const formatErrorMessage = (
  key: string,
  type: 'set' | 'get',
  value?: any,
) =>
  type === 'get'
    ? `Unable to get for key: ${key}`
    : `Unable to set value: ${value} for key: ${key}`;

export const createStorageSuccessResult = <D = undefined>(
  data?: D,
): StorageSuccessResult<D> => ({
  success: true,
  failure: false,
  cause: null,
  value: data,
});

export const createStorageFailureResult = <E>(
  message?: string,
  cause?: E,
): StorageFailureResult<E> => ({
  success: false,
  failure: true,
  value: null,
  message: message ?? GeneralErrorMessage,
  cause,
});

export const handleError = (
  error: unknown,
  message: string,
): StorageFailureResult => {
  if (isError(error)) {
    return createStorageFailureResult(message, error);
  } else {
    return createStorageFailureResult(message);
  }
};
