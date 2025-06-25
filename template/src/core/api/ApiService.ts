import {UserApiService} from './user';

export const ApiService = {
  User: UserApiService,
} as const;
