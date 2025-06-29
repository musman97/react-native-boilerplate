import {useMutation} from '@tanstack/react-query';
import {
  ApiFailureResult,
  ApiResult,
  ApiService,
  LoginApiResponse,
} from '~/core/api';

export const useLogin = () =>
  useMutation<
    ApiResult<LoginApiResponse>,
    ApiFailureResult,
    {email: string; password: string}
  >({
    mutationFn: ({email, password}) => ApiService.User.login(email, password),
  });
