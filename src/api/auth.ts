import {
  LoginCredentials,
  TwoFactorCode,
  AuthResponse,
  ApiResponse,
  ErrorCode,
} from '@/types/auth';
import { delay } from '@/lib/utils';

// Mock database of users
const MOCK_USERS = [
  {
    id: '1',
    email: 'user@example.com',
    password: 'Password123',
    name: 'John Doe',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    twoFactorEnabled: true,
    isLocked: false,
    isSuspended: false,
    isEmailVerified: true,
  },
  {
    id: '2',
    email: 'locked@example.com',
    password: 'Password123',
    name: 'Locked User',
    twoFactorEnabled: false,
    isLocked: true,
    isSuspended: false,
    isEmailVerified: true,
  },
  {
    id: '3',
    email: 'suspended@example.com',
    password: 'Password123',
    name: 'Suspended User',
    twoFactorEnabled: false,
    isLocked: false,
    isSuspended: true,
    isEmailVerified: true,
  },
  {
    id: '4',
    email: 'unverified@example.com',
    password: 'Password123',
    name: 'Unverified User',
    twoFactorEnabled: false,
    isLocked: false,
    isSuspended: false,
    isEmailVerified: false,
  },
];

// Track failed login attempts
const failedAttempts: Record<string, number> = {};
const lastAttemptTime: Record<string, number> = {};

// Valid 2FA codes (in real app, these would be generated and sent via SMS/email)
const VALID_2FA_CODES = ['123456', '654321', '111111'];

class AuthApiError extends Error {
  constructor(public code: ErrorCode, message: string, public field?: string) {
    super(message);
    this.name = 'AuthApiError';
  }
}

// Simulate network delays and potential failures
async function simulateApiCall<T>(
  operation: () => Promise<T>,
  options: {
    delay: number;
    errorRate?: number;
    networkErrorRate?: number;
  } = { delay: 1000 }
): Promise<T> {
  await delay(options.delay);

  // Simulate network errors
  if (options.networkErrorRate && Math.random() < options.networkErrorRate) {
    throw new AuthApiError(
      ErrorCode.NETWORK_ERROR,
      'Network connection failed'
    );
  }

  // Simulate server errors
  if (options.errorRate && Math.random() < options.errorRate) {
    throw new AuthApiError(ErrorCode.SERVER_ERROR, 'Internal server error');
  }

  return operation();
}

export async function loginUser(
  credentials: LoginCredentials
): Promise<ApiResponse<AuthResponse>> {
  try {
    return await simulateApiCall(
      async () => {
        const { email, password } = credentials;

        // Check for too many failed attempts
        const attempts = failedAttempts[email] || 0;
        const lastAttempt = lastAttemptTime[email] || 0;
        const timeSinceLastAttempt = Date.now() - lastAttempt;

        if (attempts >= 5 && timeSinceLastAttempt < 15 * 60 * 1000) {
          // 15 minutes
          throw new AuthApiError(
            ErrorCode.TOO_MANY_ATTEMPTS,
            'Too many failed login attempts. Please try again in 15 minutes.'
          );
        }

        // Find user
        const user = MOCK_USERS.find((u) => u.email === email);
        if (!user) {
          // Increment failed attempts
          failedAttempts[email] = attempts + 1;
          lastAttemptTime[email] = Date.now();

          throw new AuthApiError(
            ErrorCode.USER_NOT_FOUND,
            'No account found with this email address.',
            'email'
          );
        }

        // Check account status
        if (user.isLocked) {
          throw new AuthApiError(
            ErrorCode.ACCOUNT_LOCKED,
            'Your account has been temporarily locked.'
          );
        }

        if (user.isSuspended) {
          throw new AuthApiError(
            ErrorCode.ACCOUNT_SUSPENDED,
            'Your account has been suspended. Please contact support.'
          );
        }

        if (!user.isEmailVerified) {
          throw new AuthApiError(
            ErrorCode.EMAIL_NOT_VERIFIED,
            'Please verify your email address before logging in.'
          );
        }

        // Check password
        if (user.password !== password) {
          // Increment failed attempts
          failedAttempts[email] = attempts + 1;
          lastAttemptTime[email] = Date.now();

          throw new AuthApiError(
            ErrorCode.INVALID_CREDENTIALS,
            'Invalid email or password.',
            'password'
          );
        }

        // Reset failed attempts on successful login
        delete failedAttempts[email];
        delete lastAttemptTime[email];

        const authUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          twoFactorEnabled: user.twoFactorEnabled,
        };

        // If 2FA is enabled, return temp token
        if (user.twoFactorEnabled) {
          return {
            success: true,
            data: {
              user: authUser,
              token: '',
              requiresTwoFactor: true,
              tempToken: `temp_${user.id}_${Date.now()}`,
            },
          };
        }

        // Regular login without 2FA
        return {
          success: true,
          data: {
            user: authUser,
            token: `token_${user.id}_${Date.now()}`,
            requiresTwoFactor: false,
          },
        };
      },
      {
        delay: Math.random() * 1000 + 500, // 500-1500ms
        networkErrorRate: 0.05, // 5% chance of network error
        errorRate: 0.02, // 2% chance of server error
      }
    );
  } catch (error) {
    if (error instanceof AuthApiError) {
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          field: error.field,
        },
      };
    }

    return {
      success: false,
      error: {
        code: ErrorCode.UNKNOWN_ERROR,
        message: 'An unexpected error occurred',
      },
    };
  }
}

export async function verifyTwoFactor(
  tempToken: string,
  twoFactorCode: TwoFactorCode
): Promise<ApiResponse<AuthResponse>> {
  try {
    return await simulateApiCall(
      async () => {
        // Extract user ID from temp token
        const tokenParts = tempToken.split('_');
        if (tokenParts.length < 2 || tokenParts[0] !== 'temp') {
          throw new AuthApiError(
            ErrorCode.INVALID_2FA_CODE,
            'Invalid session. Please login again.'
          );
        }

        const userId = tokenParts[1];
        const user = MOCK_USERS.find((u) => u.id === userId);

        if (!user) {
          throw new AuthApiError(
            ErrorCode.INVALID_2FA_CODE,
            'Invalid session. Please login again.'
          );
        }

        // Check if code is valid
        if (!VALID_2FA_CODES.includes(twoFactorCode.code)) {
          throw new AuthApiError(
            ErrorCode.INVALID_2FA_CODE,
            'Invalid verification code. Please try again.',
            'code'
          );
        }

        // Simulate expired code (codes ending in 1)
        if (twoFactorCode.code.endsWith('1')) {
          throw new AuthApiError(
            ErrorCode.EXPIRED_2FA_CODE,
            'Verification code has expired. Please request a new code.',
            'code'
          );
        }

        const authUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          twoFactorEnabled: user.twoFactorEnabled,
        };

        return {
          success: true,
          data: {
            user: authUser,
            token: `token_${user.id}_${Date.now()}`,
            requiresTwoFactor: false,
          },
        };
      },
      {
        delay: Math.random() * 800 + 300, // 300-1100ms
        networkErrorRate: 0.03,
        errorRate: 0.01,
      }
    );
  } catch (error) {
    if (error instanceof AuthApiError) {
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          field: error.field,
        },
      };
    }

    return {
      success: false,
      error: {
        code: ErrorCode.UNKNOWN_ERROR,
        message: 'An unexpected error occurred',
      },
    };
  }
}

export async function requestNewTwoFactorCode(
  _tempToken: string
): Promise<ApiResponse<{ message: string }>> {
  try {
    return await simulateApiCall(
      async () => {
        // In a real app, this would send a new code via SMS/email
        await delay(500);

        return {
          success: true,
          data: {
            message: 'A new verification code has been sent to your device.',
          },
        };
      },
      {
        delay: 800,
        networkErrorRate: 0.02,
        errorRate: 0.01,
      }
    );
  } catch (error) {
    if (error instanceof AuthApiError) {
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      };
    }

    return {
      success: false,
      error: {
        code: ErrorCode.UNKNOWN_ERROR,
        message: 'Failed to send verification code',
      },
    };
  }
}
