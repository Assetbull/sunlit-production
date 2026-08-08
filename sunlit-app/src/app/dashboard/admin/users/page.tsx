'use client';

import { Users, Search, Filter, MoreVertical, CheckCircle, XCircle, Clock } from 'lucide-react';
import styles from '../page.module.css';

export default function AdminUsersPage() {
  const users = [
    { id: 'usr-1', name: 'John Doe', email: 'john@example.com', role: 'Project Owner', status: 'Active', joined: '2026-01-15' },
    { id: 'usr-2', name: 'SolarGen Ltd', email: 'hello@solargen.com', role: 'Installer', status: 'Pending KYC', joined: '2026-04-20' },
    { id: 'usr-3', name: 'BuildCorp EPC', email: 'admin@buildcorp.ng', role: 'EPC Contractor', status: 'Active', joined: '2026-02-10' },
    { id: 'usr-4', name: 'Mike Smith', email: 'mike.s@example.com', role: 'Crew Member', status: 'Suspended', joined: '2026-03-05' },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <Users size={16} className="text-primary" />
                <span className="label-sm uppercase tracking-widest text-primary font-bold">User Management</span>
            </div>
            <h1 className={styles.title}>System Users</h1>
          </div>
          <div className="flex items-center gap-4">
             <button className="btn btn-secondary flex items-center gap-2">
               <Filter size={18} />
               Filter Roles
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
                placeholder="Search by name, email or ID..."
                className="w-full bg-surface-1 border border-surface-3 rounded-xl pl-12 pr-4 py-3 text-sm focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-3 bg-surface-1/50">
                  <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider w-1/4">User Info</th>
                  <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Role</th>
                  <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Joined</th>
                  <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-3">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-1/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-sm">{user.name}</p>
                          <p className="text-xs text-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium">{user.role}</td>
                    <td className="p-4">
                      {user.status === 'Active' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-green-50 text-green-700 border border-green-200"><CheckCircle size={14}/> Active</span>}
                      {user.status === 'Pending KYC' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200"><Clock size={14}/> Pending KYC</span>}
                      {user.status === 'Suspended' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 text-red-700 border border-red-200"><XCircle size={14}/> Suspended</span>}
                    </td>
                    <td className="p-4 text-sm text-muted">{new Date(user.joined).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-surface-3">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-surface-3 text-center">
             <p className="text-xs text-muted font-bold">Showing 4 of 1,248 users</p>
          </div>

        </div>
      </main>
    </div>
  );
}
