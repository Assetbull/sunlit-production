'use client';

import Link from 'next/link';
import { ArrowLeft, FolderKanban } from 'lucide-react';

export default function ProjectsOverviewPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/dashboard/project-owner" className="btn btn-ghost btn-sm">
          <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
        </Link>
      </div>

      <div className="surface-card animate-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <FolderKanban size={24} className="text-primary" />
          <h1 className="headline-lg">My Projects</h1>
        </div>
        <p className="body-md text-muted mb-6">
          Track active projects, view milestones, and manage completed installations.
        </p>

        <div className="empty-state">
          <FolderKanban size={48} className="text-muted mb-4" />
          <h3 className="title-md">No Active Projects</h3>
          <p className="body-sm text-muted mt-2 mb-4">
            You don&apos;t have any active projects yet. Accept a bid to start a project.
          </p>
          <Link href="/dashboard/project-owner/bids" className="btn btn-primary">
            View Bids
          </Link>
        </div>
      </div>
    </div>
  );
}
