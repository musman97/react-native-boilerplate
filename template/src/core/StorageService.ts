import {MMKV} from 'react-native-mmkv';
import {initializeMMKVFlipper} from 'react-native-mmkv-flipper-plugin';
import {SuccessResult, FailureResult} from '~/types';
import {isError} from '~/utils';

const storage = new MMKV();

if (__DEV__) {
  initializeMMKVFlipper({default: storage});
}

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

enum StorageKey {
  UserDetails = 'user/details',
}

export const StorageService = {
  Keys: StorageKey,

  setString(key: StorageKey, value: string) {
    try {
      storage.set(key, value);
      return createStorageSuccessResult();
    } catch (error) {
      return handleError(error, formatErrorMessage(key, 'set', value));
    }
  },
  getString(key: StorageKey) {
    try {
      const stringFromStorage = storage.getString(key);

      return createStorageSuccessResult({data: stringFromStorage});
    } catch (error) {
      return handleError(error, formatErrorMessage(key, 'get'));
    }
  },
  setObject<T extends object>(key: StorageKey, value: T) {
    try {
      const objectJson = JSON.stringify(value);
      storage.set(key, objectJson);

      return createStorageSuccessResult();
    } catch (error) {
      return handleError(error, formatErrorMessage(key, 'set', value));
    }
  },
  getObject<T extends object>(key: StorageKey) {
    try {
      const objectJson = storage.getString(key);

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
  clearKey(key: StorageKey) {
    try {
      storage.delete(key);

      return createStorageSuccessResult();
    } catch (error) {
      return handleError(error, `Unable to clear key: ${key}`);
    }
  },
  clearAll() {
    try {
      storage.clearAll();

      return createStorageSuccessResult();
    } catch (error) {
      return handleError(error, 'Unable to clear all storage');
    }
  },
};
