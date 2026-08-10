import React from 'react';
import Button from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  errorCode?: string;
  onRetry?: () => void;
  onContactSupport?: () => void;
}

/**
 * Sunlit Enterprise UX Standard — Canonical Error State
 * - Human-readable error
 * - Retry / recovery action
 * - System status & support routing where appropriate
 * - Never expose raw stack traces to the user
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Operation Encountered an Error',
  message,
  errorCode,
  onRetry,
  onContactSupport,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-12 text-center bg-white rounded-[20px] border border-[#ffdad6] shadow-[0_8px_24px_rgba(186,26,26,0.06)]">
      <div className="w-14 h-14 rounded-full bg-[#ffdad6]/50 flex items-center justify-center text-[#ba1a1a] mb-4">
        <svg
          className="w-7 h-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      {errorCode && (
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#ba1a1a] bg-[#ffdad6]/40 px-2.5 py-0.5 rounded-full mb-2">
          {errorCode}
        </span>
      )}

      <h3 className="font-headline text-lg font-bold text-[#1f1b17] mb-1">
        {title}
      </h3>
      <p className="text-sm text-[#5d6361] max-w-md mb-6 leading-relaxed">
        {message}
      </p>

      <div className="flex items-center gap-3">
        {onContactSupport && (
          <Button variant="ghost" size="sm" onClick={onContactSupport}>
            Contact Support
          </Button>
        )}
        {onRetry && (
          <Button variant="primary" size="md" onClick={onRetry}>
            Retry Operation
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
