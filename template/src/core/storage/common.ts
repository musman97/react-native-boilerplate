import {MMKV} from 'react-native-mmkv';
import {
  getGenericPassword,
  resetGenericPassword,
  setGenericPassword,
} from 'react-native-keychain';
import {AccessTokenKey, StorageKey} from './types';
import {
  createStorageSuccessResult,
  formatErrorMessage,
  handleError,
} from './utils';

const storage = new MMKV();

export const StorageService = {
  get storageInstance() {
    return storage;
  },

  Keys: StorageKey,

  /**
   * Implementation inspired from:
   * https://github.com/oblador/react-native-keychain/issues/291#issuecomment-682460091
   */

  async setAccessToken(key: AccessTokenKey, token: string) {
    try {
      await setGenericPassword('jwtToken', token, {
        service: key,
      });

      return createStorageSuccessResult();
    } catch (error) {
      return handleError(error, 'Unable to set access token to keychain');
    }
  },
  async getAccessToken(key: AccessTokenKey) {
    try {
      const creds = await getGenericPassword({service: key});

      if (creds) {
        return createStorageSuccessResult(creds.password);
      } else {
        return createStorageSuccessResult(null);
      }
    } catch (error) {
      return handleError(error, 'Unable to get access token from keychain');
    }
  },
  async clearAccessToken(key: AccessTokenKey) {
    try {
      const success = await resetGenericPassword({service: key});

      if (!success) {
        throw new Error('Promise was resolved to false');
      }

      return createStorageSuccessResult();
    } catch (error) {
      return handleError(error, 'Unable to clear access token from keychain');
    }
  },

  setBoolean(key: StorageKey, value: boolean) {
    try {
      storage.set(key, value);
      return createStorageSuccessResult();
    } catch (error) {
      return handleError(error, formatErrorMessage(key, 'set', value));
    }
  },
  getBoolean(key: StorageKey) {
    try {
      const booleanFromStorage = storage.getBoolean(key);

      return createStorageSuccessResult(booleanFromStorage);
    } catch (error) {
      return handleError(error, formatErrorMessage(key, 'get'));
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

      return createStorageSuccessResult(stringFromStorage);
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
        return createStorageSuccessResult(obj);
      } else {
        return createStorageSuccessResult(null);
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
