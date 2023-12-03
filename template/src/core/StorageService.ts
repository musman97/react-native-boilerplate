import AsyncStorage from '@react-native-async-storage/async-storage';
import {SuccessResult, FailureResult} from '~/types';
import {isError} from '~/utils';

const GeneralErrorMessage = 'Unable to set/get value to/from Local storage';

const formatErrorMessage = (key: string, type: 'set' | 'get', value?: any) =>
  type === 'get'
    ? `Unable to get for key: ${key}`
    : `Unable to set value: ${value} for key: ${key}`;

export type StorageSuccessResult<D = undefined> = SuccessResult<D>;

export type StorageFailureResult<E = Error | undefined> = Omit<
  FailureResult<undefined, E>,
  'code'
>;

const createStorageSuccessResult = <D = undefined>(
  result?: Partial<StorageSuccessResult<D>>,
): StorageSuccessResult<D> => ({
  success: true,
  failure: false,
  data: result?.data,
});

const createStorageFailureResult = <E>(
  result?: Partial<StorageFailureResult<E>>,
): StorageFailureResult<E> => ({
  success: false,
  failure: true,
  message: result?.message ?? GeneralErrorMessage,
  cause: result?.cause,
});

const handleError = (error: unknown, message: string): StorageFailureResult => {
  if (isError(error)) {
    return createStorageFailureResult({cause: error, message});
  } else {
    return createStorageFailureResult({message});
  }
};

export enum AsyncStorageKey {
  UserDetails = 'user/details',
}

export const StorageService = {
  async setString(key: AsyncStorageKey, value: string) {
    try {
      await AsyncStorage.setItem(key, value);

      return createStorageSuccessResult();
    } catch (error) {
      return handleError(error, formatErrorMessage(key, 'set', value));
    }
  },
  async getString(key: AsyncStorageKey) {
    try {
      const stringFromStorage = await AsyncStorage.getItem(key);

      return createStorageSuccessResult({data: stringFromStorage});
    } catch (error) {
      return handleError(error, formatErrorMessage(key, 'get'));
    }
  },
  async setObject<T extends object>(key: AsyncStorageKey, value: T) {
    try {
      const objectJson = JSON.stringify(value);
      await AsyncStorage.setItem(key, objectJson);

      return createStorageSuccessResult();
    } catch (error) {
      return handleError(error, formatErrorMessage(key, 'set', value));
    }
  },
  async getObject<T extends object>(key: AsyncStorageKey) {
    try {
      const objectJson = await AsyncStorage.getItem(key);

      if (objectJson) {
        const obj = JSON.parse(objectJson) as T;
        return createStorageSuccessResult({data: obj});
      } else {
        return createStorageSuccessResult({data: null});
      }
    } catch (error) {
      return handleError(error, formatErrorMessage(key, 'get'));
    }
  },
  async clearKey(key: AsyncStorageKey) {
    try {
      await AsyncStorage.removeItem(key);

      return createStorageSuccessResult();
    } catch (error) {
      return handleError(error, `Unable to clear key: ${key}`);
    }
  },
  async clearAll() {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(allKeys);

      return createStorageSuccessResult();
    } catch (error) {
      return handleError(error, 'Unable to clear all storage');
    }
  },
};
