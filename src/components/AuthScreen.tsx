import { useState, useEffect } from 'react';
import { AuthStep } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuth';
import { LoginForm } from '@/components/LoginForm';
import { TwoFactorForm } from '@/components/TwoFactorForm';
import { AuthSuccess } from '@/components/AuthSuccess';
import { Spin } from 'antd';

export const AuthScreen = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>(AuthStep.LOGIN);
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const authState = useAuthState();

  useEffect(() => {
    const initializeAuth = () => {
      if (authState.isAuthenticated) {
        setCurrentStep(AuthStep.AUTHENTICATED);
      } else if (authState.requiresTwoFactor && authState.tempToken) {
        setCurrentStep(AuthStep.TWO_FACTOR);
        setTempToken(authState.tempToken);
      } else {
        setCurrentStep(AuthStep.LOGIN);
      }
      setIsLoading(false);
    };

    const timer = setTimeout(initializeAuth, 100);
    return () => clearTimeout(timer);
  }, [authState]);

  const handleLoginSuccess = (
    requiresTwoFactor: boolean,
    tempTokenValue?: string
  ) => {
    if (requiresTwoFactor && tempTokenValue) {
      setTempToken(tempTokenValue);
      setCurrentStep(AuthStep.TWO_FACTOR);
    } else {
      setCurrentStep(AuthStep.AUTHENTICATED);
    }
  };

  const handleTwoFactorSuccess = () => {
    setCurrentStep(AuthStep.AUTHENTICATED);
    setTempToken(null);
  };

  const handleBackToLogin = () => {
    setCurrentStep(AuthStep.LOGIN);
    setTempToken(null);
    sessionStorage.removeItem('tempToken');
  };

  if (isLoading) {
    return (
      <div 
        className="min-h-screen bg-gray-100 flex items-center justify-center"
        role="status"
        aria-live="polite"
        aria-label="Loading authentication"
      >
        <div className="text-center">
          <Spin size="large" className="mb-4" aria-hidden="true" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gray-100 flex items-center justify-center p-4"
      role="application"
      aria-label="Authentication system"
    >
      {currentStep === AuthStep.LOGIN && (
        <LoginForm onSuccess={handleLoginSuccess} />
      )}

      {currentStep === AuthStep.TWO_FACTOR && tempToken && (
        <TwoFactorForm
          tempToken={tempToken}
          onSuccess={handleTwoFactorSuccess}
          onBack={handleBackToLogin}
        />
      )}

      {currentStep === AuthStep.AUTHENTICATED && authState.user && (
        <AuthSuccess user={authState.user} />
      )}
    </div>
  );
};
