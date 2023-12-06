import {UserApiService} from './user';
import {ApiResult} from './types';

export namespace ApiService {
  export function handleApiResult<T>(res: ApiResult<T>): Promise<T> {
    return (res.success ? res.data : Promise.reject(res)) as Promise<T>;
  }

  export const User = UserApiService;
}
