export type ApiError = {
  code: string;
  details?: unknown;
};

export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };

export type AuthUser = {
  id: string;
  email: string;
  username: string;
};

export type LoginSuccess = {
  user: AuthUser;
};

export type SignupSuccess = {
  user: AuthUser;
};

export type TestResult = {
  name: string;
  ok: boolean;
  message?: string;
};
