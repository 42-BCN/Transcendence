export const TRANSPORT_ERROR = {
  FETCH_FAILED: 'FETCH_FAILED',
} as const;

export type TransportErrorCode = (typeof TRANSPORT_ERROR)[keyof typeof TRANSPORT_ERROR];

export type ApiSuccess<T> = {
  ok: true;
  data: T;
};

export type ApiErrorShape<Code extends string = string, Details = unknown> = {
  code: Code | TransportErrorCode;
  details?: Details;
};

export type ApiReqError<Code extends string = string, Details = unknown> = {
  ok: false;
  error: ApiErrorShape<Code, Details>;
};

export type ApiResponse<T, Code extends string = string, Details = unknown> =
  | ApiSuccess<T>
  | ApiReqError<Code, Details>;
