'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Flag,
  Shield,
  Scale,
  Clock,
  CheckCircle2,
  Upload,
  MessageSquare,
  FileText,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import styles from './page.module.css';

interface InstallerDispute {
  id: string;
  project: string;
  owner: string;
  amount: number;
  claim: string;
  status: 'open' | 'in_mediation' | 'resolved';
  openedDate: string;
  evidenceCount: number;
  timeline: { date: string; actor: string; action: string }[];
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n);
}

const DISPUTES: InstallerDispute[] = [
  {
    id: 'dsp-001',
    project: 'Lekki Residential Solar',
    owner: 'Bayo Adeyemi',
    amount: 960000,
    claim: 'Project Owner disputes quality of Milestone 3 wiring. Claims it does not meet contracted spec.',
    status: 'in_mediation',
    openedDate: 'Apr 20, 2026',
    evidenceCount: 2,
    timeline: [
      { date: 'Apr 20', actor: 'Bayo Adeyemi (PO)', action: 'Raised dispute — wiring quality' },
      { date: 'Apr 21', actor: 'Sunlit Admin', action: 'Acknowledged. Mediation team assigned.' },
      { date: 'Apr 23', actor: 'You', action: 'Submitted counter-evidence — 2 site inspection documents' },
      { date: 'Apr 24', actor: 'Sunlit Admin', action: 'Mediation session: Apr 28' },
    ],
  },
];

function statusCfg(s: InstallerDispute['status']) {
  if (s === 'open') return { bg: 'rgba(186,26,26,0.08)', color: '#ba1a1a', label: 'Open', icon: Flag };
  if (s === 'in_mediation') return { bg: 'rgba(184,134,11,0.08)', color: '#B8860B', label: 'In Mediation', icon: Scale };
  return { bg: 'rgba(15,99,27,0.08)', color: '#0F631B', label: 'Resolved', icon: CheckCircle2 };
}

export default function InstallerDisputesPage() {
  const [active, setActive] = useState<string | null>(DISPUTES[0]?.id ?? null);
  const selected = DISPUTES.find((d) => d.id === active);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.tagBadge}>
          <Flag size={11} strokeWidth={2.5} />
          <span>Dispute Defense</span>
        </div>
        <h1 className={styles.title}>
          Disputes &amp; <span className={styles.titleAccent}>Defense</span>
        </h1>
        <p className={styles.subtitle}>
          Respond to disputes raised against your work. Submit evidence to support your case.
        </p>
      </header>

      {DISPUTES.some((d) => d.status !== 'resolved') && (
        <div className={styles.lockBanner}>
          <Shield size={18} />
          <div>
            <strong>Payment Frozen</strong>
            <span>Related milestone payments are held until this dispute is resolved.</span>
          </div>
        </div>
      )}

      {DISPUTES.length === 0 ? (
        <div className={styles.emptyState}>
          <Shield size={36} className={styles.emptyIcon} />
          <h3>No Active Disputes</h3>
          <p>No disputes have been raised against your work. Keep up the great work!</p>
        </div>
      ) : (
        <div className={styles.disputeLayout}>
          <div className={styles.disputeList}>
            {DISPUTES.map((d) => {
              const { bg, color, label, icon: StatusIcon } = statusCfg(d.status);
              return (
                <button
                  key={d.id}
                  className={`${styles.disputeCard} ${active === d.id ? styles.disputeCardActive : ''}`}
                  onClick={() => setActive(d.id)}
                >
                  <div className={styles.disputeTop}>
                    <span className={styles.disputeProject}>{d.project}</span>
                    <span className={styles.disputeStatus} style={{ background: bg, color }}>
                      <StatusIcon size={11} /> {label}
                    </span>
                  </div>
                  <p className={styles.disputeOwner}>Raised by: {d.owner}</p>
                  <div className={styles.disputeBottom}>
                    <span className={styles.disputeAmount}>{formatCurrency(d.amount)} at stake</span>
                    <span className={styles.disputeDate}>{d.openedDate}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {selected && (() => {
            const { bg, color, label, icon: StatusIcon } = statusCfg(selected.status);
            return (
              <div className={styles.disputeDetail}>
                <div className={styles.detailHeader}>
                  <div>
                    <h2 className={styles.detailTitle}>{selected.project}</h2>
                    <p className={styles.detailOwner}>Disputed by {selected.owner}</p>
                  </div>
                  <span className={styles.detailStatus} style={{ background: bg, color }}>
                    <StatusIcon size={12} /> {label}
                  </span>
                </div>

                <div className={styles.claimCard}>
                  <div className={styles.claimLabel}>
                    <AlertTriangle size={14} /> Owner's Claim
                  </div>
                  <p className={styles.claimText}>{selected.claim}</p>
                </div>

                <div className={styles.amountCard}>
                  <span className={styles.amountLabel}>Amount at Stake</span>
                  <span className={styles.amountVal}>{formatCurrency(selected.amount)}</span>
                </div>

                <div className={styles.actions}>
                  <button className={styles.actionBtn}>
                    <Upload size={15} /> Upload Evidence ({selected.evidenceCount} uploaded)
                  </button>
                  <button className={styles.actionBtn}>
                    <MessageSquare size={15} /> Message Mediator
                  </button>
                  <button className={styles.actionBtn}>
                    <FileText size={15} /> View Contract
                  </button>
                </div>

                <div className={styles.timeline}>
                  <h3 className={styles.timelineTitle}><Clock size={14} /> Dispute Timeline</h3>
                  {selected.timeline.map((ev, idx) => (
                    <div key={idx} className={styles.timelineEvent}>
                      <div className={styles.timelineDot} />
                      <div className={styles.timelineContent}>
                        <div className={styles.timelineTop}>
                          <span className={styles.timelineActor}>{ev.actor}</span>
                          <span className={styles.timelineDate}>{ev.date}</span>
                        </div>
                        <p className={styles.timelineAction}>{ev.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
