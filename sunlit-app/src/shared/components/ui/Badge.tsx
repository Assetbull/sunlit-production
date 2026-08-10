import React from 'react';

export type ValidationStatus = 'PASS' | 'WARNING' | 'BLOCKED' | 'INVALID' | 'REQUIRES_REVIEW' | 'ENERGY' | 'NEUTRAL';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: ValidationStatus;
  label?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Sunlit Visual DNA 2.1 — Canonical Enterprise Chip & Tag
 * - Shape: Pill (rounded-full / 9999px)
 * - Fill: Low-contrast 10% opacity status background
 * - Text: High-contrast status text
 * - Semantic Roles: PASS, WARNING, BLOCKED, INVALID, REQUIRES_REVIEW, ENERGY, NEUTRAL
 */
export const Badge: React.FC<BadgeProps> = ({
  status = 'NEUTRAL',
  label,
  icon,
  children,
  className = '',
  ...props
}) => {
  const statusStyles: Record<ValidationStatus, { bg: string; text: string; dot: string; defaultLabel: string }> = {
    PASS: {
      bg: 'bg-[#179d5b]/10',
      text: 'text-[#179d5b]',
      dot: 'bg-[#179d5b]',
      defaultLabel: 'PASS',
    },
    WARNING: {
      bg: 'bg-[#e4a11b]/10',
      text: 'text-[#b57a07]',
      dot: 'bg-[#e4a11b]',
      defaultLabel: 'WARNING',
    },
    BLOCKED: {
      bg: 'bg-[#ba1a1a]/10',
      text: 'text-[#ba1a1a]',
      dot: 'bg-[#ba1a1a]',
      defaultLabel: 'BLOCKED',
    },
    INVALID: {
      bg: 'bg-[#d84b43]/10',
      text: 'text-[#d84b43]',
      dot: 'bg-[#d84b43]',
      defaultLabel: 'INVALID',
    },
    REQUIRES_REVIEW: {
      bg: 'bg-[#3177f5]/10',
      text: 'text-[#3177f5]',
      dot: 'bg-[#3177f5]',
      defaultLabel: 'REQUIRES REVIEW',
    },
    ENERGY: {
      bg: 'bg-[#d9f99d]/60',
      text: 'text-[#2e4303]',
      dot: 'bg-[#0f631b]',
      defaultLabel: 'ENERGY',
    },
    NEUTRAL: {
      bg: 'bg-[#f5f5f4]',
      text: 'text-[#5d6361]',
      dot: 'bg-[#707a6c]',
      defaultLabel: 'STATUS',
    },
  };

  const style = statusStyles[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-body text-[13px] font-semibold uppercase tracking-wider select-none ${style.bg} ${style.text} ${className}`}
      {...props}
    >
      {icon ? (
        icon
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot} flex-shrink-0`} />
      )}
      <span>{children || label || style.defaultLabel}</span>
    </span>
  );
};

export const Chip = Badge;

export default Badge;
