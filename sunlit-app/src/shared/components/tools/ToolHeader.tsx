import Link from 'next/link';
import { ArrowLeft, Cpu } from 'lucide-react';

interface ToolHeaderProps {
  title: string;
  category: string;
  description: string;
}

export function ToolHeader({ title, category, description }: ToolHeaderProps) {
  return (
    <header
      style={{
        background: 'linear-gradient(180deg, #f4f4f1 0%, #fff8f5 100%)',
        borderBottom: '1px solid rgba(191, 202, 186, 0.3)',
        padding: '48px 20px',
      }}
    >
      <div className="sunlit-container">
        <Link
          href="/tools"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '12px',
            color: '#00490e',
            textDecoration: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '20px',
          }}
        >
          <ArrowLeft size={14} /> Back to All Engineering Tools
        </Link>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            background: 'rgba(0, 73, 14, 0.08)',
            borderRadius: '9999px',
            marginBottom: '16px',
            width: 'fit-content',
          }}
        >
          <Cpu size={14} style={{ color: '#00490e' }} />
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '11px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#00490e',
            }}
          >
            {category}
          </span>
        </div>
        <h1
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(28px, 3.5vw, 44px)',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: '#1f1b17',
            marginBottom: '12px',
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            lineHeight: 1.65,
            color: '#40493d',
            maxWidth: '680px',
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
    </header>
  );
}
