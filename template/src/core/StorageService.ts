import {MMKV} from 'react-native-mmkv';
import {
  getGenericPassword,
  resetGenericPassword,
  setGenericPassword,
} from 'react-native-keychain';
import {SuccessResult, FailureResult} from '~/types';
import {isError} from '~/utils';

const AccessTokenKey = 'user/access_token';
const storage = new MMKV();

const GeneralErrorMessage = 'Unable to set/get value to/from Local storage';

const formatErrorMessage = (key: string, type: 'set' | 'get', value?: any) =>
  type === 'get'
    ? `Unable to get for key: ${key}`
    : `Unable to set value: ${value} for key: ${key}`;

export type StorageSuccessResult<D> = SuccessResult<D, never>;

export type StorageFailureResult<E = Error | undefined> = Omit<
  FailureResult<undefined, E>,
  'code'
>;

const createStorageSuccessResult = <D = undefined>(
  data?: D,
): StorageSuccessResult<D> => ({
  success: true,
  failure: false,
  cause: null,
  value: data,
});

const createStorageFailureResult = <E>(
  message?: string,
  cause?: E,
): StorageFailureResult<E> => ({
  success: false,
  failure: true,
  value: null,
  message: message ?? GeneralErrorMessage,
  cause,
});

const handleError = (error: unknown, message: string): StorageFailureResult => {
  if (isError(error)) {
    return createStorageFailureResult(message, error);
  } else {
    return createStorageFailureResult(message);
  }
};

enum StorageKey {
  UserDetails = 'user/details',
}

export const StorageService = {
  Keys: StorageKey,

  /**
   * Implementation inspired from:
   * https://github.com/oblador/react-native-keychain/issues/291#issuecomment-682460091
   */

  async setAccessToken(accessToken: string) {
    try {
      await setGenericPassword('jwtToken', accessToken, {
        service: AccessTokenKey,
      });
    } catch (error) {
      return handleError(error, 'Unable to set access token to keychain');
    }
  },
  async getAccessToken() {
    try {
      const creds = await getGenericPassword({service: AccessTokenKey});

      if (creds) {
        return creds.password;
      } else {
        return createStorageSuccessResult({data: null});
      }
    } catch (error) {
      return handleError(error, 'Unable to get access token from keychain');
    }
  },
  async clearAccessToken() {
    try {
      const success = await resetGenericPassword({service: AccessTokenKey});

      if (!success) {
        throw new Error('Promise was resolved to false');
      }
    } catch (error) {
      return handleError(error, 'Unable to clear access token from keychain');
    }
  },

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
