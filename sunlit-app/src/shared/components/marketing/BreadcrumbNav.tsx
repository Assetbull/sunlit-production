'use client';

/**
 * BreadcrumbNav — Canonical Marketing Breadcrumb Component
 *
 * Shared component for all marketing/service/detail pages.
 * Renders a transparent back-arrow button + hierarchical breadcrumb trail.
 *
 * Back behavior:
 *   - Calls router.back() (uses browser history stack).
 *   - Fallback: navigates to the second-to-last item's href if no history.
 *
 * Visual spec:
 *   - Background: #f6f3eb (matches location and service page breadcrumb bar)
 *   - Separator: "/" — matches existing inline implementations
 *   - Back arrow: ArrowLeft 16px, transparent button, no background on hover
 *   - Color: #707a6c (muted) → #00490e on hover (Sunlit green accent)
 *   - Accessible: aria-label on button, nav aria-label on wrapper
 */

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface BreadcrumbItem {
  /** Display label for this breadcrumb step. */
  label: string;
  /**
   * Href for the breadcrumb link. Omit on the last (current) item —
   * it will render as a non-interactive span.
   */
  href?: string;
}

interface BreadcrumbNavProps {
  /** Ordered array from root → current page. */
  items: BreadcrumbItem[];
  /**
   * Optional CSS background override.
   * Defaults to '#f6f3eb' — the standard Sunlit breadcrumb bar background.
   */
  background?: string;
  /**
   * Optional CSS max-width override for the inner content container.
   * Defaults to '1200px'.
   */
  maxWidth?: string;
}

export function BreadcrumbNav({
  items,
  background = '#f6f3eb',
  maxWidth = '1200px',
}: BreadcrumbNavProps) {
  const router = useRouter();

  // Resolve fallback href: second-to-last item with an href, or '/'
  const fallbackHref =
    [...items]
      .reverse()
      .slice(1)
      .find((item) => item.href)?.href ?? '/';

  const handleBack = () => {
    // Use browser history if available; otherwise go to the parent route
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <div
      style={{
        background,
        borderBottom: '1px solid rgba(191, 202, 186, 0.3)',
        padding: '0.75rem 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.875rem',
          color: '#707a6c',
        }}
      >
        {/* ── Back Arrow ─────────────────────────────────────────────── */}
        <button
          type="button"
          onClick={handleBack}
          aria-label="Go back to previous page"
          title="Go back"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            padding: '0',
            margin: '0',
            cursor: 'pointer',
            color: '#707a6c',
            lineHeight: 1,
            // Separate element — no box-shadow, no container
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#00490e';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#707a6c';
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#00490e';
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#707a6c';
          }}
        >
          <ArrowLeft size={16} aria-hidden="true" />
        </button>

        {/* ── Vertical divider between arrow and trail ─────────────── */}
        <span
          style={{
            display: 'inline-block',
            width: '1px',
            height: '14px',
            background: 'rgba(112, 122, 108, 0.35)',
            flexShrink: 0,
          }}
          aria-hidden="true"
        />

        {/* ── Breadcrumb Trail ───────────────────────────────────────── */}
        <nav aria-label="Breadcrumb">
          <ol
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {items.map((item, index) => {
              const isLast = index === items.length - 1;

              return (
                <React.Fragment key={`${item.label}-${index}`}>
                  <li>
                    {isLast ? (
                      // Current page — non-interactive, aria-current
                      <span
                        aria-current="page"
                        style={{ color: '#1a1c1b', fontWeight: 500 }}
                      >
                        {item.label}
                      </span>
                    ) : item.href ? (
                      <Link
                        href={item.href}
                        style={{
                          color: '#707a6c',
                          textDecoration: 'none',
                          transition: 'color 150ms ease',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.color = '#00490e';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.color = '#707a6c';
                        }}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span style={{ color: '#707a6c' }}>{item.label}</span>
                    )}
                  </li>

                  {/* Separator — rendered after every item except the last */}
                  {!isLast && (
                    <li aria-hidden="true" style={{ color: '#c2c9bc', userSelect: 'none' }}>
                      /
                    </li>
                  )}
                </React.Fragment>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
