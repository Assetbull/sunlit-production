import Link from 'next/link';
import { ArrowLeft, Cpu } from 'lucide-react';

interface ToolHeaderProps {
  title: string;
  category: string;
  description: string;
}

export function ToolHeader({ title, category, description }: ToolHeaderProps) {
  return (
    <header className="bg-surface-container-low border-b border-surface-container-highest py-12 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max mx-auto">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline mb-6 uppercase tracking-wider"
        >
          <ArrowLeft size={14} /> Back to All Engineering Tools
        </Link>
        <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full w-fit mb-4">
          <Cpu size={14} className="text-primary" />
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            {category}
          </span>
        </div>
        <h1 className="text-display-lg-mobile md:text-headline-xl font-extrabold text-on-surface tracking-tight mb-3">
          {title}
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>
    </header>
  );
}
