'use client';

/**
 * BreadcrumbNav — Legacy Adapter to ContextualBackNav
 *
 * Upgraded to wrap the canonical ContextualBackNav component.
 * Converts hierarchical breadcrumb item arrays into a clean, minimal
 * `← Back to [Context]` contextual back link without colored background bars.
 */

import React from 'react';
import { ContextualBackNav } from '@/shared/components/navigation/ContextualBackNav';

export interface BreadcrumbItem {
  /** Display label for this breadcrumb step. */
  label: string;
  /** Href for the breadcrumb link. */
  href?: string;
}

export interface BreadcrumbNavProps {
  /** Ordered array from root → current page. */
  items: BreadcrumbItem[];
  /** Optional background override (kept for interface compatibility, transparent by default). */
  background?: string;
  /** Optional max-width override. */
  maxWidth?: string;
  /** Optional custom CSS class */
  className?: string;
}

export function BreadcrumbNav({
  items,
  maxWidth = '1200px',
  className = '',
}: BreadcrumbNavProps) {
  // Resolve parent context destination: the second-to-last item with an href, or the first item with an href, or '/'
  const parentItem =
    [...items]
      .reverse()
      .slice(1)
      .find((item) => item.href) || { label: 'Home', href: '/' };

  const targetHref = parentItem.href || '/';
  const targetLabel = parentItem.label;

  return (
    <ContextualBackNav
      href={targetHref}
      label={targetLabel}
      maxWidth={maxWidth}
      className={className}
    />
  );
}
