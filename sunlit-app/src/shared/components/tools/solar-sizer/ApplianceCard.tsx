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
      className={`relative group rounded-[20px] p-5 border text-left transition-all duration-300 flex flex-col justify-between select-none ${
        disabled
          ? 'opacity-50 cursor-not-allowed bg-[#f2f5ec] border-[#c0c9bb]/30'
          : isSelected
          ? 'bg-[#00490e] text-white border-[#00490e] shadow-md -translate-y-0.5'
          : 'bg-white/80 backdrop-blur-md text-[#191d17] border-[#c0c9bb]/40 hover:bg-[#ecefe6]/60 hover:border-[#00490e]/40 hover:-translate-y-0.5 cursor-pointer'
      } ${className}`}
    >
      {/* Top Section: Icon + Selection Badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-colors ${
            isSelected
              ? 'bg-white/20 text-white'
              : 'bg-[#f2f5ec] text-[#00490e] border border-[#c0c9bb]/30'
          }`}
        >
          <SunlitIcon name={icon} size={22} />
        </div>

        {badge && (
          <span
            className={`font-sans text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
              isSelected
                ? 'bg-white/20 text-white'
                : 'bg-[#aef4a5]/40 text-[#00490e] border border-[#00490e]/20'
            }`}
          >
            {badge}
          </span>
        )}

        {isSelected && !onQuantityChange && (
          <div className="text-white">
            <SunlitIcon name="check_circle" size={20} className="text-[#aef4a5]" />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <h4 className="font-headline font-bold text-base leading-snug truncate">{title}</h4>
        {description && (
          <p
            className={`font-sans text-xs mt-1 leading-relaxed line-clamp-2 ${
              isSelected ? 'text-white/80' : 'text-[#41493e]'
            }`}
          >
            {description}
          </p>
        )}
      </div>

      {/* Footer Area: Wattage and/or Quantity Control */}
      {(wattage !== undefined || onQuantityChange) && (
        <div className="mt-4 pt-3 border-t border-current/10 flex items-center justify-between gap-2 shrink-0">
          {wattage !== undefined && (
            <span
              className={`font-sans text-xs font-semibold ${
                isSelected ? 'text-white/90' : 'text-[#717a6d]'
              }`}
            >
              {wattage} W
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
                className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'bg-white/20 text-white hover:bg-white/30 disabled:opacity-30'
                    : 'bg-[#e0e4db] text-[#191d17] hover:bg-[#c0c9bb] disabled:opacity-30'
                }`}
              >
                -
              </button>
              <span className="font-sans text-xs font-bold px-1 min-w-[1.25rem] text-center">
                {quantity}
              </span>
              <button
                type="button"
                aria-label={`Increase quantity of ${title}`}
                disabled={disabled}
                onClick={() => onQuantityChange(1)}
                className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'bg-white text-[#00490e] hover:bg-white/90'
                    : 'bg-[#00490e] text-white hover:bg-[#003006]'
                }`}
              >
                +
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
