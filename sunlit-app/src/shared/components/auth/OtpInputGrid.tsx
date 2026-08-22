'use client';

import React, { useRef, useEffect } from 'react';

interface OtpInputGridProps {
  length?: number;
  value: string[];
  onChange: (value: string[]) => void;
  onComplete?: (code: string) => void;
  disabled?: boolean;
  hasError?: boolean;
}

export function OtpInputGrid({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  hasError = false,
}: OtpInputGridProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first empty input on mount
  useEffect(() => {
    const firstEmptyIndex = value.findIndex((val) => !val);
    const targetIndex = firstEmptyIndex === -1 ? 0 : firstEmptyIndex;
    inputRefs.current[targetIndex]?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    const char = rawVal.slice(-1);
    const updated = [...value];
    updated[index] = char;
    onChange(updated);

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (updated.every((d) => d !== '') && onComplete) {
      onComplete(updated.join(''));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasteData) return;

    const digits = pasteData.split('');
    const updated = Array(length).fill('');
    digits.forEach((d, i) => {
      if (i < length) updated[i] = d;
    });

    onChange(updated);

    const nextIndex = Math.min(digits.length, length - 1);
    inputRefs.current[nextIndex]?.focus();

    if (updated.every((d) => d !== '') && onComplete) {
      onComplete(updated.join(''));
    }
  };

  return (
    <div
      className="flex gap-2 sm:gap-3.5 justify-center items-center w-full"
      onPaste={handlePaste}
    >
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          disabled={disabled}
          aria-label={`Digit ${i + 1} of ${length}`}
          className={`w-11 h-14 sm:w-14 sm:h-16 text-center font-headline text-2xl font-bold rounded-lg border-2 transition-all duration-300 outline-none
            ${
              hasError
                ? 'border-error bg-error-container/20 text-error focus:border-error'
                : value[i]
                ? 'border-primary-container bg-surface-container-low text-primary-container shadow-sm'
                : 'border-outline-variant/60 bg-surface-container-low/50 text-on-surface hover:border-outline-variant focus:border-primary-container focus:bg-surface-container-low'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
      ))}
    </div>
  );
}
