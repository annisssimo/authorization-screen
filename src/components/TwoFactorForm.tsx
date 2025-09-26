import { useState, useEffect, useCallback } from 'react';
import { Input, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useTwoFactorVerification, useRequestNewCode } from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/utils';
import { CompanyLogo } from './ui/CompanyLogo';
import { Button } from '@/components/ui/Button';

interface TwoFactorFormProps {
  tempToken: string;
  onSuccess: () => void;
  onBack: () => void;
}

export const TwoFactorForm = ({
  tempToken,
  onSuccess,
  onBack,
}: TwoFactorFormProps) => {
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyMutation = useTwoFactorVerification();
  const requestNewCodeMutation = useRequestNewCode();

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
        if (
          result.error.code === 'INVALID_2FA_CODE' ||
          result.error.code === 'EXPIRED_2FA_CODE'
        ) {
          setError('Invalid code');
        }
        message.error(getErrorMessage(result.error.code || 'UNKNOWN_ERROR'));
      }
    } catch (error) {
      console.error('2FA verification error:', error);
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

  return (
    <div
      className="w-[440px] bg-white rounded-md shadow-lg p-8 pt-10 flex flex-col items-center"
      role="main"
      aria-labelledby="two-factor-title"
    >
      <div className="w-full flex justify-start">
        <Button
          variant="ghost"
          onClick={onBack}
          disabled={verifyMutation.isPending}
          className="h-2 shadow-none !border-none hover:!border-none [&_.anticon]:!text-gray-600 [&_.anticon]:hover:!text-gray-600"
          aria-label="Go back to login"
        >
          <ArrowLeftOutlined aria-hidden="true" />
        </Button>
      </div>

      <CompanyLogo />
      <div className=" my-6">
        <h1
          id="two-factor-title"
          className="text-center text-2xl font-semibold text-gray-900"
        >
          Two-Factor Authentication
        </h1>
        <p className="text-center text-base text-gray-600 leading-relaxed">
          Enter the 6-digit code from the Google
          <br />
          Authenticator app
        </p>
      </div>

      <div className="w-full" role="group" aria-labelledby="otp-label">
        <div id="otp-label" className="sr-only">
          Enter 6-digit verification code
        </div>
        <Input.OTP
          size="large"
          length={6}
          value={code}
          onChange={handleCodeChange}
          disabled={verifyMutation.isPending}
          formatter={(str) => str.replace(/\D/g, '')}
          inputMode="numeric"
          status={error ? 'error' : undefined}
        />
      </div>

      <div className="w-full">
        {error && (
          <div
            id="otp-error"
            className="mt-2 mb-4 text-red-500 text-sm"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}
        <div id="otp-instructions" className="sr-only">
          Enter all 6 digits to continue
        </div>
      </div>

      <div className="text-center w-full">
        {code.length === 6 ? (
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={verifyMutation.isPending}
            disabled={!!error || verifyMutation.isPending}
            size="large"
            block
            className="font-light mt-4"
            aria-describedby={error ? 'otp-error' : undefined}
          >
            {verifyMutation.isPending ? 'Verifying...' : 'Continue'}
          </Button>
        ) : (
          <div className="h-12 flex items-center justify-center">
            {!canResend ? (
              <p
                className="text-base text-gray-500"
                aria-live="polite"
                aria-label={`Get a new code in ${String(
                  Math.floor(countdown / 60)
                ).padStart(2, '0')} minutes and ${String(
                  countdown % 60
                ).padStart(2, '0')} seconds`}
              >
                Get a new code in{' '}
                <span aria-hidden="true">
                  {String(Math.floor(countdown / 60)).padStart(2, '0')}:
                  {String(countdown % 60).padStart(2, '0')}
                </span>
              </p>
            ) : (
              <Button
                variant="primary"
                onClick={handleRequestNewCode}
                loading={requestNewCodeMutation.isPending}
                size="large"
                block
                className="font-light mt-4"
                aria-label="Request new verification code"
              >
                {requestNewCodeMutation.isPending
                  ? 'Sending...'
                  : 'Get new code'}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
