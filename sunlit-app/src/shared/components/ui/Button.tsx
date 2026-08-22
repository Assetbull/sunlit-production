import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Sunlit Visual DNA 2.1 — Canonical Enterprise Button
 * - Shape: Ultra-rounded Pill (9999px)
 * - Primary: Veridian Green (#0F631B) with white text
 * - Secondary: Soft Lime (#D9F99D) with dark slate text (#1F1B17)
 * - Ghost: Subtle 1px stone border (#E7E5E4) with light stone hover
 * - Danger: Enterprise Red (#BA1A1A) with white text
 * - Motion: Calibrated engineered glide (cubic-bezier(0.2, 0, 0, 1))
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm font-semibold',
    md: 'px-6 py-3 text-[15px] font-semibold',
    lg: 'px-8 py-4 text-base font-semibold',
  }[size];

  const variantClasses = {
    primary: 'bg-[#0f631b] hover:bg-[#00490e] text-white shadow-[0_4px_12px_rgba(15,99,27,0.25)] hover:shadow-[0_6px_20px_rgba(15,99,27,0.35)] active:shadow-[0_2px_8px_rgba(15,99,27,0.2)]',
    secondary: 'bg-[#d9f99d] hover:bg-[#ceee93] text-[#1f1b17] border border-[#ceee93]',
    ghost: 'bg-transparent hover:bg-[#f5f5f4] text-[#1f1b17] border border-[#e7e5e4]',
    danger: 'bg-[#ba1a1a] hover:bg-[#93000a] text-white shadow-[0_4px_12px_rgba(186,26,26,0.25)]',
  }[variant];

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-body transition-all duration-150 ease-[cubic-bezier(0.2,0,0,1)] select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[#0f631b] focus-visible:outline-offset-2 ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};

export default Button;
