import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'stone' | 'ai';
  aiBadgeText?: string;
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Sunlit Visual DNA 2.1 — Canonical Enterprise Card
 * - Radius: 20px (rounded-[20px] / rounded-xl)
 * - Border: 1px subtle Stone-200 border (#E7E5E4)
 * - Shadow: Restrained Ambient Shadow (0 8px 24px rgba(0,0,0,0.06))
 * - Glassmorphism: 24px backdrop blur + 80% opacity surface white
 * - AI Card Header: 24px glassmorphism blur on header slot
 */
export const Card: React.FC<CardProps> = ({
  variant = 'default',
  aiBadgeText,
  headerSlot,
  footerSlot,
  children,
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border border-[#e7e5e4] shadow-[0_8px_24px_rgba(0,0,0,0.06)]',
    glass: 'bg-white/80 backdrop-blur-[24px] border border-white/60 shadow-[0_8px_24px_rgba(0,0,0,0.06)]',
    stone: 'bg-[#fafaf9] border border-[#e7e5e4]',
    ai: 'bg-white border border-[#88d982]/30 shadow-[0_8px_24px_rgba(0,0,0,0.06)] overflow-hidden',
  }[variant];

  return (
    <div
      className={`rounded-[20px] transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)] ${variantStyles} ${className}`}
      {...props}
    >
      {/* AI Card Header */}
      {variant === 'ai' && (
        <div className="bg-white/85 backdrop-blur-[24px] px-6 py-4 border-b border-[#e7e5e4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0f631b] animate-pulse" />
            <span className="font-headline text-xs font-semibold uppercase tracking-wider text-[#0f631b]">
              {aiBadgeText || 'Engineered AI Insight'}
            </span>
          </div>
          {headerSlot}
        </div>
      )}

      {/* Standard Header Slot */}
      {variant !== 'ai' && headerSlot && (
        <div className="px-6 pt-6 pb-2 border-b border-[#e7e5e4]/50">
          {headerSlot}
        </div>
      )}

      {/* Card Content */}
      <div className="p-6">{children}</div>

      {/* Footer Slot */}
      {footerSlot && (
        <div className="px-6 py-4 bg-[#fafaf9]/60 border-t border-[#e7e5e4] rounded-b-[20px]">
          {footerSlot}
        </div>
      )}
    </div>
  );
};

export default Card;
