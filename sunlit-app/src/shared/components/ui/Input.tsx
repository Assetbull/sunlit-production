import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Sunlit Visual DNA 2.1 — Canonical Enterprise Input
 * - Radius: 12px (rounded-xl / rounded-md)
 * - Label: label-sm Manrope (14px, font-semibold, letter-spacing 0.02em)
 * - Field: Minimalist with light Stone fill (#F5F5F4) and bottom border
 * - Focus State: 2px Veridian Green (#0F631B) bottom border + subtle outline
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      className = '',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="font-headline text-sm font-semibold text-[#1f1b17] tracking-[0.02em]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-[#707a6c] pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`w-full bg-[#f5f5f4] text-[#1f1b17] placeholder-[#707a6c] text-base rounded-[12px] border border-transparent border-b-[#bfcaba] py-3 px-4 transition-all duration-150 ease-[cubic-bezier(0.2,0,0,1)] focus:outline-none focus:bg-white focus:border-b-2 focus:border-b-[#0f631b] focus:ring-2 focus:ring-[#0f631b]/10 disabled:opacity-50 disabled:cursor-not-allowed ${
              leftIcon ? 'pl-10' : ''
            } ${rightIcon ? 'pr-10' : ''} ${
              error ? 'border-b-2 border-b-[#ba1a1a] focus:border-b-[#ba1a1a] focus:ring-[#ba1a1a]/10' : ''
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-[#707a6c] flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-[#ba1a1a] font-medium mt-1">{error}</p>
        )}
        {!error && helperText && (
          <p className="text-[13.5px] sm:text-sm text-[#40493d] mt-1 leading-snug">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
