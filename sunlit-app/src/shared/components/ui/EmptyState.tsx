import React from 'react';
import Button from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

/**
 * Sunlit Enterprise UX Standard — Canonical Empty State
 * - Informative explanation + appropriate next action
 * - Domain-specific visual cues
 * - Never an empty white canvas
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-12 text-center bg-white rounded-[20px] border border-dashed border-[#bfcaba] shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
      <div className="w-14 h-14 rounded-full bg-[#f6ece6] flex items-center justify-center text-[#0f631b] mb-4">
        {icon || (
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
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        )}
      </div>
      <h3 className="font-headline text-xl font-bold text-[#1f1b17] mb-1.5">
        {title}
      </h3>
      <p className="text-[15px] sm:text-base text-[#40493d] max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      <div className="flex items-center gap-3">
        {secondaryActionLabel && onSecondaryAction && (
          <Button variant="ghost" size="sm" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
        {actionLabel && onAction && (
          <Button variant="primary" size="md" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
