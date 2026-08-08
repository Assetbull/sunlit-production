'use client';

import {
  FileText,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Download,
  Filter,
} from 'lucide-react';
import { useState } from 'react';
import styles from './page.module.css';

interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  entity: string;
  entityId: string;
  ip: string;
  status: 'success' | 'warning' | 'error';
}

const EVENTS: AuditEvent[] = [
  { id: 'ae-001', timestamp: '2026-04-28 18:45', actor: 'You', action: 'Bid Submitted', entity: 'RFQ', entityId: 'rfq-224', ip: '105.112.xx.xx', status: 'success' },
  { id: 'ae-002', timestamp: '2026-04-28 15:22', actor: 'You', action: 'Milestone Marked Complete', entity: 'Milestone', entityId: 'ms-002', ip: '105.112.xx.xx', status: 'success' },
  { id: 'ae-003', timestamp: '2026-04-27 09:10', actor: 'System', action: 'Payment Released', entity: 'Escrow', entityId: 'esc-001', ip: 'system', status: 'success' },
  { id: 'ae-004', timestamp: '2026-04-26 11:33', actor: 'You', action: 'Profile Updated', entity: 'User', entityId: 'me', ip: '105.112.xx.xx', status: 'success' },
  { id: 'ae-005', timestamp: '2026-04-25 16:55', actor: 'You', action: 'Bid Rejected', entity: 'Bid', entityId: 'bid-118', ip: '105.112.xx.xx', status: 'warning' },
  { id: 'ae-006', timestamp: '2026-04-24 08:20', actor: 'You', action: 'Crew Job Posted', entity: 'CrewJob', entityId: 'cj-045', ip: '105.112.xx.xx', status: 'success' },
  { id: 'ae-007', timestamp: '2026-04-23 14:11', actor: 'System', action: 'Transfer Failed — Retry Queued', entity: 'Transfer', entityId: 'tr-089', ip: 'system', status: 'error' },
];

function statusConfig(s: AuditEvent['status']) {
  if (s === 'success') return { bg: 'rgba(15,99,27,0.08)', color: '#0F631B', icon: CheckCircle2 };
  if (s === 'warning') return { bg: 'rgba(184,134,11,0.08)', color: '#B8860B', icon: AlertCircle };
  return { bg: 'rgba(186,26,26,0.08)', color: '#ba1a1a', icon: AlertCircle };
}

export default function AuditLogsPage() {
  const [search, setSearch] = useState('');
  const filtered = EVENTS.filter(
    (e) =>
      e.action.toLowerCase().includes(search.toLowerCase()) ||
      e.entity.toLowerCase().includes(search.toLowerCase()) ||
      e.actor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.tagBadge}>
          <Shield size={11} strokeWidth={2.5} />
          <span>Audit Trail</span>
        </div>
        <h1 className={styles.title}>
          Audit <span className={styles.titleAccent}>Logs</span>
        </h1>
        <p className={styles.subtitle}>
          Immutable, append-only record of all actions taken on your account.
        </p>
      </header>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statVal}>{EVENTS.length}</span>
          <span className={styles.statLabel}>Total Events (30 days)</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statVal} style={{ color: '#0F631B' }}>{EVENTS.filter((e) => e.status === 'success').length}</span>
          <span className={styles.statLabel}>Successful</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statVal} style={{ color: '#B8860B' }}>{EVENTS.filter((e) => e.status === 'warning').length}</span>
          <span className={styles.statLabel}>Warnings</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statVal} style={{ color: '#ba1a1a' }}>{EVENTS.filter((e) => e.status === 'error').length}</span>
          <span className={styles.statLabel}>Errors</span>
        </div>
      </div>

      {/* Log Table */}
      <div className={styles.logPanel}>
        <div className={styles.logPanelHeader}>
          <div className={styles.searchWrap}>
            <Search size={16} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Search actions, entities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.logActions}>
            <button className={styles.iconBtn}><Filter size={15} /> Filter</button>
            <button className={styles.iconBtn}><Download size={15} /> Export</button>
          </div>
        </div>

        <div className={styles.logTable}>
          <div className={styles.logHead}>
            <span>Timestamp</span>
            <span>Actor</span>
            <span>Action</span>
            <span>Entity</span>
            <span>IP</span>
            <span>Status</span>
          </div>
          {filtered.map((ev) => {
            const { bg, color, icon: StatusIcon } = statusConfig(ev.status);
            return (
              <div key={ev.id} className={styles.logRow}>
                <div className={styles.logTime}>
                  <Clock size={12} />
                  <span>{ev.timestamp}</span>
                </div>
                <span className={styles.logActor}>{ev.actor}</span>
                <span className={styles.logAction}>{ev.action}</span>
                <div className={styles.logEntity}>
                  <span className={styles.logEntityType}>{ev.entity}</span>
                  <span className={styles.logEntityId}>{ev.entityId}</span>
                </div>
                <span className={styles.logIp}>{ev.ip}</span>
                <span className={styles.logStatus} style={{ background: bg, color }}>
                  <StatusIcon size={11} /> {ev.status}
                </span>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className={styles.noResults}>
              <FileText size={28} />
              <p>No events match your search.</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.immutableNotice}>
        <Shield size={14} />
        <span>These logs are immutable and append-only. No entry can be modified or deleted.</span>
      </div>
    </div>
  );
}
