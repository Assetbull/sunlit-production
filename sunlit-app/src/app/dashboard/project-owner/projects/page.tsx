'use client';

import Link from 'next/link';
import { ArrowLeft, FolderKanban, Plus } from 'lucide-react';
import ProjectListItem from '../components/ProjectListItem';

export default function ProjectsOverviewPage() {
  // Let's assume an empty state for now as there's no fetchProjects API, 
  // but we build it to be fully Stitch-compliant and ready for data.
  const projects: any[] = []; // Intentionally empty to show empty state, or mock it

  return (
    <div className="flex flex-col gap-8 animate-in stagger-children">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/dashboard/project-owner" className="flex items-center gap-2 text-sm font-bold text-muted hover:text-primary transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          BACK TO COMMAND CENTER
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="display-sm text-slate-900 mb-2">Active Infrastructure</h1>
          <p className="body-lg text-slate-500">Track deployments, milestones, and asset statuses.</p>
        </div>
        <Link href="/dashboard/project-owner/rfq/new" className="btn btn-primary shadow-lg shadow-primary/20">
          <Plus size={18} className="mr-2" />
          Initialize New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="surface-card--glass p-12 text-center rounded-2xl flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 bg-slate-50 flex items-center justify-center rounded-full mb-6">
            <FolderKanban size={40} className="text-slate-300" />
          </div>
          <h3 className="headline-sm text-slate-900 mb-2">No Active Deployments</h3>
          <p className="body-md text-slate-500 mb-8 max-w-md">
            Your project portfolio is currently empty. Initialize a new RFQ to begin matching with verified installers.
          </p>
          <Link href="/dashboard/project-owner/rfq/new" className="btn btn-primary h-12 px-8">
            Start a Deployment
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {projects.map((proj) => (
            <ProjectListItem key={proj.id} {...proj} />
          ))}
        </div>
      )}
    </div>
  );
}
