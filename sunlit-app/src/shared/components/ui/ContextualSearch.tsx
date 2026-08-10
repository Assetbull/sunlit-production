import React, { useState } from 'react';
import Badge from './Badge';

export interface SearchFilter {
  id: string;
  label: string;
}

export interface ContextualSearchProps {
  placeholder?: string;
  filters?: SearchFilter[];
  activeFilter?: string;
  onFilterChange?: (filterId: string) => void;
  onSearch: (query: string) => void;
  shortcutKey?: string;
}

/**
 * Sunlit Enterprise UX Standard — Canonical Contextual Search
 * - Search only when information volume and workflow justify it
 * - Integrated filter pills & keyboard shortcut indicator (Cmd+K / Ctrl+K)
 * - Clean 12px / pill shape language & quiet visual treatment
 */
export const ContextualSearch: React.FC<ContextualSearchProps> = ({
  placeholder = 'Search operational records, equipment, or contracts...',
  filters = [],
  activeFilter,
  onFilterChange,
  onSearch,
  shortcutKey = '⌘K',
}) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-[#707a6c] pointer-events-none flex items-center">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full bg-[#f5f5f4] text-[#1f1b17] placeholder-[#707a6c] text-sm rounded-full border border-transparent border-b-[#bfcaba] py-3.5 pl-12 pr-16 transition-all duration-150 ease-[cubic-bezier(0.2,0,0,1)] focus:outline-none focus:bg-white focus:border-b-2 focus:border-b-[#0f631b] focus:ring-2 focus:ring-[#0f631b]/10"
        />

        {shortcutKey && (
          <div className="absolute right-4 pointer-events-none">
            <kbd className="font-mono text-[11px] font-semibold text-[#707a6c] bg-white px-2 py-1 rounded border border-[#e7e5e4] shadow-sm">
              {shortcutKey}
            </kbd>
          </div>
        )}
      </div>

      {filters.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-[#707a6c] uppercase tracking-wider pl-1">
            Filter:
          </span>
          {filters.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => onFilterChange && onFilterChange(filter.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 select-none ${
                  isActive
                    ? 'bg-[#0f631b] text-white shadow-sm'
                    : 'bg-[#f5f5f4] text-[#5d6361] hover:bg-[#e7e5e4]'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContextualSearch;
