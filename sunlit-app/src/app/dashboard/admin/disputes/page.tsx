'use client';

import { Flag, Search, Filter, ShieldAlert, ArrowRight, CheckCircle } from 'lucide-react';
import styles from '../page.module.css';

export default function AdminDisputesPage() {
  const disputes = [
    { id: 'DSP-001', project: 'PRJ-1049', type: 'Milestone Delay', raisedBy: 'John Doe (PO)', status: 'Active', daysOpen: 3, amountHeld: '₦1,400,000' },
    { id: 'DSP-002', project: 'PRJ-1012', type: 'Quality Issue', raisedBy: 'Alice Smith (PO)', status: 'Active', daysOpen: 12, amountHeld: '₦800,000' },
    { id: 'DSP-003', project: 'PRJ-0988', type: 'Payment Release', raisedBy: 'SolarGen Ltd (Inst)', status: 'Resolved', daysOpen: 0, amountHeld: '₦0' },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <Flag size={16} className="text-red-500" />
                <span className="label-sm uppercase tracking-widest text-red-600 font-bold">Resolution Center</span>
            </div>
            <h1 className={styles.title}>System Disputes</h1>
          </div>
        </div>
      </header>

      <main className={styles.mainLayout}>
        <div className="bg-surface-2 border border-surface-3 rounded-2xl shadow-sm animate-in">
          
          <div className="p-6 border-b border-surface-3 flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
              <input 
                type="text" 
                placeholder="Search by dispute ID, project, or user..."
                className="w-full bg-surface-1 border border-surface-3 rounded-xl pl-12 pr-4 py-3 text-sm focus:border-primary transition-all"
              />
            </div>
            <div className="flex items-center gap-4 text-sm font-bold text-muted">
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> 2 Active</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> 14 Resolved</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-3 bg-surface-1/50">
                  <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Dispute Info</th>
                  <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Details</th>
                  <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Escrow Locked</th>
                  <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-muted uppercase tracking-wider text-right">Arbitration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-3">
                {disputes.map((dsp) => (
                  <tr key={dsp.id} className="hover:bg-surface-1/30 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-foreground text-sm flex items-center gap-2">
                        {dsp.id}
                        {dsp.status === 'Active' && <ShieldAlert size={14} className="text-red-500" />}
                      </p>
                      <p className="text-xs font-mono text-muted mt-1">{dsp.project}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-medium">{dsp.type}</p>
                      <p className="text-xs text-muted mt-1">Raised by: {dsp.raisedBy}</p>
                    </td>
                    <td className="p-4 font-mono text-sm font-medium">
                      {dsp.amountHeld}
                    </td>
                    <td className="p-4">
                      {dsp.status === 'Active' ? (
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center w-fit px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                            Active
                          </span>
                          <span className="text-xs text-red-500 font-bold">{dsp.daysOpen} days open</span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                          <CheckCircle size={14}/> Resolved
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {dsp.status === 'Active' ? (
                         <button className="btn btn-secondary px-4 py-2 text-sm inline-flex items-center gap-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                           Review Case
                           <ArrowRight size={16} />
                         </button>
                      ) : (
                        <span className="text-sm text-muted">Closed</span>
                      )}
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
