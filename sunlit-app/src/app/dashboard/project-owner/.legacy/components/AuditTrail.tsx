'use client';

import { useState, useEffect } from 'react';
import { History, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
import { fetchAuditLogs, AuditLogItem } from '@/dashboards/project-owner/services/project-owner-api';

interface AuditTrailProps {
  projectId: string;
}

export default function AuditTrail({ projectId }: AuditTrailProps) {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetchAuditLogs(projectId);
      if (res.success && res.data) {
        setLogs(res.data);
      }
      setLoading(false);
    }
    load();
  }, [projectId]);

  return (
    <div className="surface-card p-6 animate-in fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
          <History size={20} />
        </div>
        <div>
          <h3 className="title-lg">Audit Trail & Integrity</h3>
          <p className="body-sm text-muted">Immutable ledger of all project operations</p>
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="skeleton h-16 w-full rounded-xl" />)
        ) : logs.length === 0 ? (
          <p className="text-center text-muted py-8">No audit logs available.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-4 group">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-primary/20 flex items-center justify-center text-primary z-10 shrink-0">
                  <ShieldCheck size={14} />
                </div>
                <div className="w-0.5 flex-1 bg-border group-last:bg-transparent -mt-2"></div>
              </div>
              <div className="flex-1 pb-6">
                <div className="flex justify-between items-start">
                  <h4 className="title-xs font-bold text-foreground">{log.actionType.replace(/_/g, ' ')}</h4>
                  <span className="label-xs text-muted flex items-center gap-1">
                    <Clock size={10} /> {new Date(log.timestamp).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="body-sm text-muted mt-1">{log.details}</p>
                <div className="flex items-center gap-2 mt-2">
                   <div className="label-xs bg-neutral-100 text-muted px-2 py-0.5 rounded flex items-center gap-1 font-mono">
                     <span className="opacity-50">CID:</span> {log.correlationId}
                   </div>
                   <button className="label-xs text-primary hover:underline flex items-center gap-0.5">
                     Verify on Ledger <ExternalLink size={10} />
                   </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-muted">
        <div className="flex items-center gap-1.5 label-xs">
          <ShieldCheck size={14} className="text-green-500" /> All records cryptographically signed
        </div>
        <button className="btn btn-ghost btn-xs">Download Report</button>
      </div>
    </div>
  );
}
