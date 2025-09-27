import { useEffect, useRef, useState } from 'react';
import { Input } from 'antd';
import type { InputProps } from 'antd';

interface AsteriskPasswordInputProps
  extends Omit<InputProps, 'type' | 'value' | 'onChange'> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function AsteriskPasswordInput({
  value,
  defaultValue = '',
  onChange,
  className = '',
  ...rest
}: AsteriskPasswordInputProps) {
  const [realValue, setRealValue] = useState<string>(
    value ?? defaultValue ?? ''
  );
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pendingSelection = useRef<number | null>(null);
  const composing = useRef(false);

  useEffect(() => {
    if (typeof value === 'string' && value !== realValue) setRealValue(value);
  }, [value]);

  useEffect(() => {
    onChange?.(realValue);
  }, [realValue, onChange]);

  const updateReal = (next: string, caret?: number) => {
    setRealValue(next);
    if (typeof caret === 'number') pendingSelection.current = caret;
  };

  const handleBeforeInput = (e: React.FormEvent<HTMLInputElement>) => {
    const ev = e.nativeEvent;
    const el = e.currentTarget;
    const start = el.selectionStart ?? realValue.length;
    const end = el.selectionEnd ?? start;
    const data = (ev as any).data ?? '';

    const next = realValue.slice(0, start) + data + realValue.slice(end);
    updateReal(next, start + (data ? data.length : 0));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (composing.current) return;

    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      const el = e.currentTarget as HTMLInputElement;
      let start = el.selectionStart ?? 0;
      let end = el.selectionEnd ?? start;

      if (start !== end) {
        const next = realValue.slice(0, start) + realValue.slice(end);
        updateReal(next, start);
        return;
      }

      if (e.key === 'Backspace') {
        if (start === 0) return;
        const next = realValue.slice(0, start - 1) + realValue.slice(start);
        updateReal(next, start - 1);
      } else {
        if (start >= realValue.length) return;
        const next = realValue.slice(0, start) + realValue.slice(start + 1);
        updateReal(next, start);
      }
    }
  };

  const displayValue = '*'.repeat(realValue.length);

  return (
    <Input
      {...rest}
      ref={inputRef as any}
      value={displayValue}
      onBeforeInput={handleBeforeInput as any}
      onKeyDown={handleKeyDown}
      className={className}
      autoComplete="current-password"
      inputMode="text"
      role="textbox"
      aria-autocomplete="none"
      aria-invalid={false}
    />
  );
}
