'use client';

import { FolderKanban, Search, Filter, MoreVertical, Eye } from 'lucide-react';
import styles from '../page.module.css';
import Link from 'next/link';

export default function AdminProjectsPage() {
  const projects = [
    { id: 'PRJ-1049', title: '5kW Residential Setup', owner: 'John Doe', installer: 'SolarGen Ltd', status: 'In Progress', budget: '₦2,400,000', created: '2026-04-10' },
    { id: 'PRJ-1050', title: '10kW Commercial Array', owner: 'Tech Hub LLC', installer: 'Pending', status: 'Bidding', budget: '₦5,000,000', created: '2026-04-15' },
    { id: 'PRJ-1051', title: '3kW Basic Backup', owner: 'Alice Smith', installer: 'Raysun Energy', status: 'Completed', budget: '₦1,200,000', created: '2026-03-20' },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <FolderKanban size={16} className="text-primary" />
                <span className="label-sm uppercase tracking-widest text-primary font-bold">Global Registry</span>
            </div>
            <h1 className={styles.title}>All Projects</h1>
          </div>
          <div className="flex items-center gap-4">
             <button className="btn btn-secondary flex items-center gap-2">
               <Filter size={18} />
               Filter Status
             </button>
          </div>
        </div>
      </header>

      <main className={styles.mainLayout}>
        <div className="bg-surface-2 border border-surface-3 rounded-2xl shadow-sm animate-in">
          
          <div className="p-6 border-b border-surface-3 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
              <input 
                type="text" 
                placeholder="Search by project ID, title or user..."
                className="w-full bg-surface-1 border border-surface-3 rounded-xl pl-12 pr-4 py-3 text-sm focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-3 bg-surface-1/50">
                  <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Project ID & Title</th>
                  <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Stakeholders</th>
                  <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Budget</th>
                  <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-3">
                {projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-surface-1/30 transition-colors">
                    <td className="p-4">
                      <p className="text-xs font-mono text-muted mb-1">{proj.id}</p>
                      <p className="font-bold text-foreground text-sm">{proj.title}</p>
                      <p className="text-xs text-muted mt-1">Created: {new Date(proj.created).toLocaleDateString()}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm"><span className="text-muted text-xs">PO:</span> {proj.owner}</p>
                      <p className="text-sm mt-1"><span className="text-muted text-xs">Inst:</span> {proj.installer}</p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                        proj.status === 'Completed' ? 'bg-green-50 text-green-700 border border-green-200' :
                        proj.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-surface-3 text-foreground border border-surface-3'
                      }`}>
                        {proj.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-medium">{proj.budget}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-muted hover:text-primary transition-colors rounded-lg hover:bg-primary/10">
                          <Eye size={18} />
                        </button>
                        <button className="p-2 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-surface-3">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
}
