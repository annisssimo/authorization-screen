import React, { useState, useRef, useEffect } from 'react';
import { Input } from 'antd';
import { cn } from '@/lib/utils';

interface OTPInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

const OTPInput = ({
  length,
  value,
  onChange,
  disabled = false,
  error = false,
}: OTPInputProps) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<any[]>([]);

  useEffect(() => {
    const newOtp = value.split('').slice(0, length);
    while (newOtp.length < length) {
      newOtp.push('');
    }
    setOtp(newOtp);
  }, [value, length]);

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    onChange(newOtp.join(''));

    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === 'v' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, '').slice(0, length);
        if (digits.length > 0) {
          const newOtp = Array(length).fill('');
          for (let i = 0; i < Math.min(digits.length, length); i++) {
            newOtp[i] = digits[i];
          }
          setOtp(newOtp);
          onChange(newOtp.join(''));

          const nextIndex = Math.min(digits.length, length - 1);
          inputRefs.current[nextIndex]?.focus();
        }
      });
    }
  };

  return (
    <div className="flex flex-row items-center gap-[10px] justify-center">
      {otp.map((digit, index) => (
        <Input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          maxLength={1}
          disabled={disabled}
          className={cn(
            'flex flex-row items-center justify-center gap-3',
            'w-[52.67px] h-[60px]',
            'px-[11px] py-0',
            'text-center text-lg font-semibold',
            'bg-white',
            'rounded-[8px]',
            'transition-colors duration-200',
            error
              ? '!border-red-500 focus:border-red-500 hover:border-red-500'
              : 'border-[#D9D9D9] focus:border-blue-500 hover:border-blue-400',
            disabled && 'bg-gray-50',
            '!shadow-none focus:!shadow-none hover:!shadow-none'
          )}
          autoComplete="off"
        />
      ))}
    </div>
  );
};

export default OTPInput;
