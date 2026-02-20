export type ApiMeta = {
  requestId?: string;
};

export type ApiSuccess<T> = {
  ok: true;
  data: T;
};

export type ApiErrorShape<Code extends string = string, Details = unknown> = {
  code: Code;
  details?: Details;
};

export type ApiError<Code extends string = string, Details = unknown> = {
  ok: false;
  error: ApiErrorShape<Code, Details>;
};

export type ApiResponse<T, Code extends string = string, Details = unknown> =
  | ApiSuccess<T>
  | ApiError<Code, Details>;
