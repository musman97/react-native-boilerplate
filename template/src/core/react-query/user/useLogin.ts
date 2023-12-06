import {useMutation} from 'react-query';
import {ApiFailureResult, ApiService} from '~/core/api';
import {User} from '~/core/models';

export const useLogin = () =>
  useMutation<User, ApiFailureResult, {email: string; password: string}>({
    mutationFn: ({email, password}) =>
      ApiService.User.doLogin(email, password).then(ApiService.handleApiResult),
  });
