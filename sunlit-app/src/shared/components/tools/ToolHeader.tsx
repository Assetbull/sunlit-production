import React from 'react';
import { ContextualBackNav } from '@/shared/components/navigation/ContextualBackNav';
import { Cpu } from 'lucide-react';

interface ToolHeaderProps {
  title: string;
  category: string;
  description: string;
}

export function ToolHeader({ title, category, description }: ToolHeaderProps) {
  return (
    <header className="bg-surface grid-bg border-b border-outline-variant/40 py-10 md:py-14">
      <div className="sunlit-container">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <ContextualBackNav
            href="/tools"
            label="All Engineering Tools"
            maxWidth="none"
            padding="0"
          />
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
            <Cpu size={14} className="text-primary" />
            <span className="font-label-caps text-label-caps text-primary">
              {category}
            </span>
          </div>
        </div>

        <h1 className="font-display-lg text-headline-md md:text-display-lg font-extrabold text-on-surface tracking-tight mb-3">
          {title}
        </h1>
        <p className="font-body-lg text-body-md md:text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
          {description}
        </p>
      </div>
    </header>
  );
}
