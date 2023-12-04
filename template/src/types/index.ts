export interface SuccessResult<D> {
  success: true;
  failure: false;
  data?: D;
}

export interface FailureResult<C, E> {
  success: false;
  failure: true;
  message: string;
  code: C;
  cause?: E;
}

export type Result<D, C, E> = SuccessResult<D> | FailureResult<C, E>;

export type Nullable<T> = T | null;

export type ArgumentTypes<F extends (...args: any[]) => any> = F extends (
  ...args: infer A
) => any
  ? A
  : never;
