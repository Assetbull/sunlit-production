'use client';

import React from 'react';
import { SunlitIcon, SunlitIconName } from '@/shared/components/ui/SunlitIcon';

export interface ApplianceCardProps {
  id?: string;
  icon: SunlitIconName | string;
  title: string;
  description?: string;
  wattage?: number;
  quantity?: number;
  isSelected?: boolean;
  disabled?: boolean;
  badge?: string;
  onClick?: () => void;
  onQuantityChange?: (delta: number) => void;
  className?: string;
}

export function ApplianceCard({
  icon,
  title,
  description,
  wattage,
  quantity = 0,
  isSelected = false,
  disabled = false,
  badge,
  onClick,
  onQuantityChange,
  className = '',
}: ApplianceCardProps) {
  return (
    <div
      onClick={() => !disabled && onClick && onClick()}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick && !disabled) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`relative group rounded-2xl p-4.5 border text-left transition-all duration-300 flex flex-col justify-between select-none ${
        disabled
          ? 'opacity-50 cursor-not-allowed bg-[#fcf2eb] border-[#bfcaba]/30'
          : isSelected
          ? 'bg-[#00490e] text-white border-[#00490e] shadow-md -translate-y-0.5'
          : 'bg-white/90 backdrop-blur-md text-[#1f1b17] border-[#bfcaba]/40 hover:bg-[#f6ece6]/60 hover:border-[#00490e]/40 hover:-translate-y-0.5 cursor-pointer'
      } ${className}`}
    >
      {/* Top Section: Icon Container + Title/Description + Selection Indicator */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              isSelected
                ? 'bg-white/20 text-white'
                : 'bg-[#fcf2eb] text-[#00490e] border border-[#bfcaba]/30'
            }`}
          >
            <SunlitIcon name={icon} size={20} />
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="font-headline font-bold text-sm sm:text-base leading-snug truncate">
              {title}
            </h4>
            {description && (
              <p
                className={`font-sans text-xs mt-0.5 leading-relaxed line-clamp-2 ${
                  isSelected ? 'text-white/80' : 'text-[#40493d]'
                }`}
              >
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Selection Indicator or Custom Badge */}
        <div className="shrink-0 flex items-center gap-1.5 pt-0.5">
          {badge && (
            <span
              className={`font-sans text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isSelected
                  ? 'bg-white/20 text-white'
                  : 'bg-[#ceee93]/40 text-[#00490e] border border-[#00490e]/20'
              }`}
            >
              {badge}
            </span>
          )}

          <SunlitIcon
            name={isSelected ? 'check_circle' : 'radio_button_unchecked'}
            size={20}
            className={isSelected ? 'text-[#8cdd86]' : 'text-[#bfcaba]'}
          />
        </div>
      </div>

      {/* Footer Area: Wattage and Quantity Control */}
      {(wattage !== undefined || onQuantityChange) && (
        <div className="pt-3 border-t border-current/10 flex items-center justify-between gap-2 shrink-0 text-xs">
          {wattage !== undefined && (
            <span
              className={`font-sans font-bold ${
                isSelected ? 'text-white/90' : 'text-[#00490e]'
              }`}
            >
              {wattage} Watts
            </span>
          )}

          {onQuantityChange && (
            <div
              className="flex items-center gap-2 ml-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label={`Decrease quantity of ${title}`}
                disabled={quantity <= 0 || disabled}
                onClick={() => onQuantityChange(-1)}
                className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-white/20 text-white hover:bg-white/30 disabled:opacity-30'
                    : 'bg-[#f0e6e0] text-[#1f1b17] hover:bg-[#eae1da] disabled:opacity-30'
                }`}
              >
                <SunlitIcon name="remove" size={14} />
              </button>
              <span className="font-headline font-bold text-xs min-w-[1.25rem] text-center">
                {quantity}
              </span>
              <button
                type="button"
                aria-label={`Increase quantity of ${title}`}
                disabled={disabled}
                onClick={() => onQuantityChange(1)}
                className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-white text-[#00490e] hover:bg-white/90'
                    : 'bg-[#00490e] text-white hover:bg-[#0f631b]'
                }`}
              >
                <SunlitIcon name="add" size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
