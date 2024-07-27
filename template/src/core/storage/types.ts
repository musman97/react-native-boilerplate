import {FailureResult, SuccessResult} from '~/types';

export type StorageSuccessResult<D> = SuccessResult<D, never>;

export type StorageFailureResult<E = Error | undefined> = Omit<
  FailureResult<undefined, E>,
  'code'
>;

export enum AccessTokenKey {
  AccessToken = 'user/access_token',
  Refresh = 'user/refresh_token',
}

export enum StorageKey {
  UserDetails = 'user/details',
  Theme = 'user/theme',
  OnboardingSeen = 'user/onboarding_shown',
}
