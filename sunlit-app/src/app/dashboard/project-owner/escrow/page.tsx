'use client';

import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

export default function EscrowOverviewPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/dashboard/project-owner" className="btn btn-ghost btn-sm">
          <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
        </Link>
      </div>

      <div className="surface-card animate-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Lock size={24} className="text-secondary" />
          <h1 className="headline-lg">Escrow Wallet</h1>
        </div>
        <p className="body-md text-muted mb-6">
          Manage your escrow funds and view transaction history securely.
        </p>

        <div className="empty-state">
          <Lock size={48} className="text-muted mb-4" />
          <h3 className="title-md">No Escrow Transactions</h3>
          <p className="body-sm text-muted mt-2 mb-4">
            You don&apos;t have any funded escrow accounts. Accept a bid to start a project and fund escrow milestones.
          </p>
          <Link href="/dashboard/project-owner/projects" className="btn btn-secondary">
            View Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
