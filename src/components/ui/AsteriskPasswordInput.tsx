import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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

  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    if (pendingSelection.current != null) {
      try {
        el.setSelectionRange(
          pendingSelection.current,
          pendingSelection.current
        );
      } catch (e) {}
      pendingSelection.current = null;
    }
  }, [realValue]);

  const updateReal = (next: string, caret?: number) => {
    setRealValue(next);
    if (typeof caret === 'number') pendingSelection.current = caret;
  };

  const handleBeforeInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (composing.current) return;

    const ev = e.nativeEvent as InputEvent;
    const el = e.currentTarget as HTMLInputElement;
    const start = el.selectionStart ?? realValue.length;
    const end = el.selectionEnd ?? start;
    const data = (ev as any).data ?? '';

    const next = realValue.slice(0, start) + data + realValue.slice(end);
    updateReal(next, start + (data ? data.length : 0));

    e.preventDefault();
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

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    const el = e.currentTarget;
    const start = el.selectionStart ?? realValue.length;
    const end = el.selectionEnd ?? start;
    const next = realValue.slice(0, start) + pasted + realValue.slice(end);
    updateReal(next, start + pasted.length);
  };

  const handleCut = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const el = e.currentTarget;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? start;
    const cutText = realValue.slice(start, end);
    e.clipboardData.setData('text/plain', cutText);
    const next = realValue.slice(0, start) + realValue.slice(end);
    updateReal(next, start);
  };

  const handleCompositionStart = () => {
    composing.current = true;
  };
  const handleCompositionEnd = (
    e: React.CompositionEvent<HTMLInputElement>
  ) => {
    composing.current = false;

    const el = e.currentTarget;
    const data = e.data ?? '';
    const start = el.selectionStart ?? realValue.length;
    const end = el.selectionEnd ?? start;
    const next =
      realValue.slice(0, start - data.length) + data + realValue.slice(end);
    updateReal(next, start);
  };

  const displayValue = '*'.repeat(realValue.length);

  return (
    <Input
      {...rest}
      ref={inputRef as any}
      value={displayValue}
      onBeforeInput={handleBeforeInput as any}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onCut={handleCut}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      className={className}
    />
  );
}
