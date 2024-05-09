import {AppEnv, SelectedAppEnv} from '~/constants';

const BaseUrls = {
  [AppEnv.Staging]: 'www.expamle-staging.com/',
  [AppEnv.Prod]: 'www.example-prod.com/',
};

export enum ApiErrorMessage {
  General = 'Something went wrong',
  Network = 'Network error',
  RequestAlreadyExists = 'Request already exists',
  UnableToSendRequest = 'Unable to send request',
  BadRequest = 'The data entered is invalid',
}

export enum HttpMethod {
  Get = 'Get',
  Post = 'Post',
  Put = 'Put',
  Patch = 'Patch',
  Delete = 'Delete',
}

export enum ApiState {
  Idle = 'Idle',
  Pending = 'Pending',
  Success = 'Success',
  Failure = 'Failure',
}

export const ApiEndpoints = {
  User: {
    Login: 'auth/login',
  },
};

export const BaseUrl = BaseUrls[SelectedAppEnv];

export const NetworkErrorMessage = 'Network Error';
