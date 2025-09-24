import React, { useState, useEffect } from 'react';
import { AuthStep } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuth';
import { LoginForm } from '@/components/LoginForm';
import { TwoFactorForm } from '@/components/TwoFactorForm';
import { AuthSuccess } from '@/components/AuthSuccess';
import { Spin } from 'antd';

const AuthScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>(AuthStep.LOGIN);
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const authState = useAuthState();

  // Initialize auth state on mount
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

    // Small delay to prevent flash
    const timer = setTimeout(initializeAuth, 100);
    return () => clearTimeout(timer);
  }, [authState]);

  const handleLoginSuccess = (requiresTwoFactor: boolean, tempTokenValue?: string) => {
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
    // Clear temp token from session storage
    sessionStorage.removeItem('tempToken');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" className="mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Auth Forms Container - точные размеры как на фото */}
      <div className="w-[440px] min-h-[372px] bg-white rounded-lg shadow-lg px-8 py-8 flex flex-col justify-center">
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
    </div>
  );
};

export { AuthScreen };

