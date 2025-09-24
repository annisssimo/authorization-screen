import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function generateRandomCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

export function getErrorMessage(code: string): string {
  const errorMessages: Record<string, string> = {
    INVALID_CREDENTIALS: 'Invalid email or password. Please check your credentials and try again.',
    USER_NOT_FOUND: 'No account found with this email address.',
    ACCOUNT_LOCKED: 'Your account has been temporarily locked due to multiple failed login attempts.',
    ACCOUNT_SUSPENDED: 'Your account has been suspended. Please contact support for assistance.',
    EMAIL_NOT_VERIFIED: 'Please verify your email address before logging in.',
    INVALID_2FA_CODE: 'Invalid verification code. Please check the code and try again.',
    EXPIRED_2FA_CODE: 'Verification code has expired. Please request a new code.',
    TOO_MANY_ATTEMPTS: 'Too many failed attempts. Please wait before trying again.',
    NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
    SERVER_ERROR: 'Server error occurred. Please try again later.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
  };

  return errorMessages[code] || errorMessages.UNKNOWN_ERROR;
}
