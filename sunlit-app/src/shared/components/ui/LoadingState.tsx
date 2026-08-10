import React from 'react';

export interface LoadingStateProps {
  type?: 'card' | 'table' | 'form' | 'page';
  rows?: number;
  message?: string;
}

/**
 * Sunlit Visual DNA 2.1 — Canonical Enterprise Loading State
 * - Intentional skeletons with Visual DNA tones
 * - Shimmer animation across surface-container levels
 * - Never blank screens
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'card',
  rows = 3,
  message,
}) => {
  if (type === 'card') {
    return (
      <div className="bg-white rounded-[20px] p-6 border border-[#e7e5e4] shadow-[0_8px_24px_rgba(0,0,0,0.06)] flex flex-col gap-4 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#f6ece6]" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-4 w-1/3 bg-[#f6ece6] rounded-md" />
            <div className="h-3 w-1/4 bg-[#fcf2eb] rounded-md" />
          </div>
        </div>
        <div className="h-24 w-full bg-[#fcf2eb] rounded-xl" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-3 w-20 bg-[#f6ece6] rounded-md" />
          <div className="h-8 w-24 bg-[#f6ece6] rounded-full" />
        </div>
        {message && (
          <p className="text-xs text-[#707a6c] text-center pt-2">{message}</p>
        )}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-white rounded-[20px] p-6 border border-[#e7e5e4] shadow-[0_8px_24px_rgba(0,0,0,0.06)] flex flex-col gap-3 animate-pulse">
        <div className="h-6 w-1/4 bg-[#f6ece6] rounded-md mb-2" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3 border-b border-[#fcf2eb] last:border-b-0">
            <div className="h-4 w-1/4 bg-[#f6ece6] rounded-md" />
            <div className="h-4 w-1/3 bg-[#fcf2eb] rounded-md" />
            <div className="h-4 w-1/5 bg-[#f6ece6] rounded-md" />
            <div className="h-6 w-16 bg-[#fcf2eb] rounded-full ml-auto" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-12 gap-4">
      <div className="w-12 h-12 rounded-full border-3 border-[#e7e5e4] border-t-[#0f631b] animate-spin" />
      <p className="text-sm font-medium text-[#1f1b17]">
        {message || 'Loading operational data...'}
      </p>
    </div>
  );
};

export default LoadingState;
