export interface SuccessResult<D, C> {
  success: true;
  failure: false;
  data?: D;
  code?: C;
  cause: null;
}

export interface FailureResult<C, E> {
  success: false;
  failure: true;
  message: string;
  data: null;
  code: C;
  cause?: E;
}

export type Result<D, C, E> = SuccessResult<D, C> | FailureResult<C, E>;

export type Nullable<T> = T | null;

export type ArgumentTypes<F extends (...args: any[]) => any> = F extends (
  ...args: infer A
) => any
  ? A
  : never;
