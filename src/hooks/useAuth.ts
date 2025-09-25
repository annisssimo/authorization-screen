import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  loginUser,
  verifyTwoFactor,
  requestNewTwoFactorCode,
} from '@/api/auth';
import { TwoFactorCode } from '@/types/auth';

export function useLogin() {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      if (response.success && response.data?.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      if (response.success && response.data?.tempToken) {
        sessionStorage.setItem('tempToken', response.data.tempToken);
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
}

export function useTwoFactorVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tempToken,
      code,
    }: {
      tempToken: string;
      code: TwoFactorCode;
    }) => verifyTwoFactor(tempToken, code),
    onSuccess: (response) => {
      if (response.success && response.data?.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        sessionStorage.removeItem('tempToken');

        queryClient.invalidateQueries({ queryKey: ['auth'] });
      }
    },
    onError: (error) => {
      console.error('2FA verification error:', error);
    },
  });
}

export function useRequestNewCode() {
  return useMutation({
    mutationFn: requestNewTwoFactorCode,
    onError: (error) => {
      console.error('Request new code error:', error);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      sessionStorage.removeItem('tempToken');

      queryClient.clear();

      return Promise.resolve();
    },
    onSuccess: () => {
      window.location.reload();
    },
  });
}

export function useAuthState() {
  const token = localStorage.getItem('authToken');
  const userStr = localStorage.getItem('user');
  const tempToken = sessionStorage.getItem('tempToken');

  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    localStorage.removeItem('user');
  }

  return {
    isAuthenticated: !!token && !!user,
    user,
    token,
    tempToken,
    requiresTwoFactor: !!tempToken && !token,
  };
}
