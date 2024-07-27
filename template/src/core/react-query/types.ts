import '@tanstack/react-query';
import {ApiFailureResult} from '../api';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiFailureResult;
  }
}
