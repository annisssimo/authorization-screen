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

const OTPInput: React.FC<OTPInputProps> = ({ 
  length, 
  value, 
  onChange, 
  disabled = false,
  error = false 
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(any)[]>([]);

  useEffect(() => {
    // Update internal state when value prop changes
    const newOtp = value.split('').slice(0, length);
    while (newOtp.length < length) {
      newOtp.push('');
    }
    setOtp(newOtp);
  }, [value, length]);

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    onChange(newOtp.join(''));

    // Auto-focus next input
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle paste
    if (e.key === 'v' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, length);
        if (digits.length > 0) {
          const newOtp = Array(length).fill('');
          for (let i = 0; i < Math.min(digits.length, length); i++) {
            newOtp[i] = digits[i];
          }
          setOtp(newOtp);
          onChange(newOtp.join(''));
          
          // Focus the next empty field or last field
          const nextIndex = Math.min(digits.length, length - 1);
          inputRefs.current[nextIndex]?.focus();
        }
      });
    }
  };

  return (
    <div className="flex gap-3 justify-center">
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
            "w-14 h-14 text-center text-lg font-semibold rounded-xl",
            "transition-colors duration-200",
            error 
              ? "border-red-400 focus:border-red-500 hover:border-red-500" 
              : "border-gray-300 focus:border-blue-500 hover:border-blue-400",
            disabled && "bg-gray-50"
          )}
          autoComplete="off"
        />
      ))}
    </div>
  );
};

export default OTPInput;
