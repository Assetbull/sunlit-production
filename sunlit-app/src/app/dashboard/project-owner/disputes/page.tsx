'use client';

import Link from 'next/link';
import { ArrowLeft, Flag } from 'lucide-react';

export default function DisputesOverviewPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/dashboard/project-owner" className="btn btn-ghost btn-sm">
          <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
        </Link>
      </div>

      <div className="surface-card animate-in">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Flag size={24} className="text-danger" />
            <h1 className="headline-lg">Disputes</h1>
          </div>
          <Link href="/dashboard/project-owner/disputes/new" className="btn btn-danger btn-sm">
            Raise Dispute
          </Link>
        </div>
        <p className="body-md text-muted mb-6">
          Track and manage your active disputes.
        </p>

        <div className="empty-state">
          <Flag size={48} className="text-muted mb-4" />
          <h3 className="title-md">No Active Disputes</h3>
          <p className="body-sm text-muted mt-2 mb-4">
            You don&apos;t have any active disputes. Have an issue with your project?
          </p>
          <Link href="/dashboard/project-owner/disputes/new" className="btn btn-danger">
            Raise a Dispute
          </Link>
        </div>
      </div>
    </div>
  );
}
