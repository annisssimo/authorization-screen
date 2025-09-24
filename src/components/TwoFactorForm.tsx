import React, { useState, useEffect, useCallback } from 'react';
import { Button, message } from 'antd';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { useTwoFactorVerification, useRequestNewCode } from '@/hooks/useAuth';
import { getErrorMessage, cn } from '@/lib/utils';
import OTPInput from '@/components/ui/OTPInput';

interface TwoFactorFormProps {
  tempToken: string;
  onSuccess: () => void;
  onBack: () => void;
}

const TwoFactorForm: React.FC<TwoFactorFormProps> = ({ 
  tempToken, 
  onSuccess, 
  onBack 
}) => {
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyMutation = useTwoFactorVerification();
  const requestNewCodeMutation = useRequestNewCode();

  // Countdown timer for resend code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleSubmit = useCallback(async () => {
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setError(null);
    try {
      const result = await verifyMutation.mutateAsync({
        tempToken,
        code: { code },
      });

      if (result.success) {
        onSuccess();
      } else if (result.error) {
        setError(result.error.message);
        message.error(getErrorMessage(result.error.code || 'UNKNOWN_ERROR'));
      }
    } catch (error) {
      console.error('2FA verification error:', error);
      setError('An unexpected error occurred');
      message.error('An unexpected error occurred');
    }
  }, [code, tempToken, verifyMutation, onSuccess]);

  const handleRequestNewCode = async () => {
    try {
      const result = await requestNewCodeMutation.mutateAsync(tempToken);
      
      if (result.success) {
        message.success('A new verification code has been sent');
        setCountdown(45);
        setCanResend(false);
        setCode('');
        setError(null);
      } else if (result.error) {
        message.error(getErrorMessage(result.error.code || 'UNKNOWN_ERROR'));
      }
    } catch (error) {
      console.error('Request new code error:', error);
      message.error('Failed to send new code');
    }
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
    setError(null);
  };

  // Auto-submit when 6 digits are entered
  useEffect(() => {
    if (code.length === 6) {
      const timer = setTimeout(() => {
        handleSubmit();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [code, handleSubmit]);

  return (
    <div className="w-full space-y-8">
      {/* Back Button */}
      <div className="text-left">
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={onBack}
          disabled={verifyMutation.isPending}
          className="p-0 mb-8 text-base hover:text-blue-500"
        >
          Back
        </Button>
      </div>

      {/* Company Logo and Brand */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <HomeOutlined className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 m-0">Company</h2>
        </div>
        
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">
          Two-Factor Authentication
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Enter the 6-digit code from the Google<br />Authenticator app
        </p>
      </div>

      {/* OTP Input */}
      <div className="text-center">
        <OTPInput
          length={6}
          value={code}
          onChange={handleCodeChange}
          disabled={verifyMutation.isPending}
          error={!!error}
        />
        
        {error && (
          <div className="mt-4 text-red-500 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Continue Button or Countdown */}
      <div className="text-center">
        {code.length === 6 ? (
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={verifyMutation.isPending}
            className={cn(
              "w-full h-12 rounded-xl text-base font-medium",
              "bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600",
              "transition-colors duration-200"
            )}
          >
            Continue
          </Button>
        ) : (
          <div className="h-12 flex items-center justify-center">
            {!canResend ? (
              <p className="text-base text-gray-500">
                Get a new code in {String(Math.floor(countdown / 60)).padStart(2, '0')}:{String(countdown % 60).padStart(2, '0')}
              </p>
            ) : (
              <Button
                type="primary"
                onClick={handleRequestNewCode}
                loading={requestNewCodeMutation.isPending}
                className={cn(
                  "w-full h-12 rounded-xl text-base font-medium",
                  "bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600",
                  "transition-colors duration-200"
                )}
              >
                Get new
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export { TwoFactorForm };
