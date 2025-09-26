export interface LoginCredentials {
  email: string;
  password: string;
}

export interface TwoFactorCode {
  code: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  twoFactorEnabled: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  requiresTwoFactor?: boolean;
  tempToken?: string;
}

export interface ApiError {
  message: string;
  code: string;
  field?: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

export enum AuthStep {
  LOGIN = 'login',
  TWO_FACTOR = 'two-factor',
  AUTHENTICATED = 'authenticated'
}

export enum ErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_SUSPENDED = 'ACCOUNT_SUSPENDED',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  INVALID_2FA_CODE = 'INVALID_2FA_CODE',
  EXPIRED_2FA_CODE = 'EXPIRED_2FA_CODE',
  TOO_MANY_ATTEMPTS = 'TOO_MANY_ATTEMPTS',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}


export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  currentStep: AuthStep;
  tempToken: string | null;
  isLoading: boolean;
  error: ApiError | null;
}

