'use client';

import {
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle2,
  CircleDollarSign,
  Shield,
  Download,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';
import styles from './page.module.css';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
}

interface Transaction {
  id: string;
  project: string;
  milestone: string;
  amount: number;
  commission: number;
  net: number;
  date: string;
  status: 'paid' | 'pending' | 'processing';
}

const TRANSACTIONS: Transaction[] = [
  { id: 'tx-001', project: 'Victoria Island Commercial', milestone: 'Milestone 1 — Mobilisation', amount: 3750000, commission: 150000, net: 3600000, date: 'Apr 15, 2026', status: 'paid' },
  { id: 'tx-002', project: 'Lekki Residential Solar', milestone: 'Milestone 1 — Site Prep', amount: 1440000, commission: 57600, net: 1382400, date: 'Apr 10, 2026', status: 'paid' },
  { id: 'tx-003', project: 'Victoria Island Commercial', milestone: 'Milestone 2 — Structural', amount: 3750000, commission: 150000, net: 3600000, date: 'Apr 25, 2026', status: 'processing' },
  { id: 'tx-004', project: 'Lekki Residential Solar', milestone: 'Milestone 2 — Panel Install', amount: 1440000, commission: 57600, net: 1382400, date: '—', status: 'pending' },
];

function statusConfig(s: Transaction['status']) {
  if (s === 'paid') return { bg: 'rgba(15,99,27,0.08)', color: '#0F631B', label: 'Paid', icon: CheckCircle2 };
  if (s === 'processing') return { bg: 'rgba(184,134,11,0.08)', color: '#B8860B', label: 'Processing', icon: Clock };
  return { bg: 'rgba(160,167,156,0.12)', color: '#707A6C', label: 'Pending', icon: CircleDollarSign };
}

export default function FinancialCenterPage() {
  const totalEarned = TRANSACTIONS.filter((t) => t.status === 'paid').reduce((s, t) => s + t.net, 0);
  const totalPending = TRANSACTIONS.filter((t) => t.status !== 'paid').reduce((s, t) => s + t.net, 0);
  const totalCommission = TRANSACTIONS.reduce((s, t) => s + t.commission, 0);

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.tagBadge}>
          <Wallet size={11} strokeWidth={2.5} />
          <span>Financial Center</span>
        </div>
        <h1 className={styles.title}>
          Earnings &amp; <span className={styles.titleAccent}>Ledger</span>
        </h1>
        <p className={styles.subtitle}>
          Your complete payment history, pending payouts, and commission breakdown.
        </p>
      </header>

      {/* Summary */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard} style={{ background: 'linear-gradient(135deg, #0F631B, #2F7D32)' }}>
          <div className={styles.summaryTop}>
            <span className={styles.summaryLabel} style={{ color: 'rgba(255,255,255,0.75)' }}>Total Earned (Net)</span>
            <div className={styles.summaryIcon} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <span className={styles.summaryValue} style={{ color: '#fff' }}>{formatCurrency(totalEarned)}</span>
          <div className={styles.summarySubtext} style={{ color: 'rgba(255,255,255,0.7)' }}>
            <CheckCircle2 size={11} /> After commission deduction
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryTop}>
            <span className={styles.summaryLabel}>Pending Payouts</span>
            <div className={styles.summaryIcon} style={{ background: 'rgba(184,134,11,0.08)', color: '#B8860B' }}>
              <Clock size={18} />
            </div>
          </div>
          <span className={styles.summaryValue}>{formatCurrency(totalPending)}</span>
          <div className={styles.summarySubtext}>
            <ArrowUpRight size={11} /> Awaiting milestone approval
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryTop}>
            <span className={styles.summaryLabel}>Platform Commission</span>
            <div className={styles.summaryIcon} style={{ background: 'rgba(52,95,58,0.08)', color: '#345F3A' }}>
              <CircleDollarSign size={18} />
            </div>
          </div>
          <span className={styles.summaryValue}>{formatCurrency(totalCommission)}</span>
          <div className={styles.summarySubtext}>4% per milestone release</div>
        </div>
      </div>

      {/* Transactions */}
      <div className={styles.ledger}>
        <div className={styles.ledgerHeader}>
          <div>
            <div className={styles.sectionMetaTag}>
              <CircleDollarSign size={12} strokeWidth={2.5} />
              <span>Payment History</span>
            </div>
            <h2 className={styles.sectionTitle}>Milestone Transactions</h2>
          </div>
          <button className={styles.exportBtn}>
            <Download size={15} /> Export CSV
          </button>
        </div>

        <div className={styles.txList}>
          <div className={styles.txHeader}>
            <span>Project / Milestone</span>
            <span>Gross</span>
            <span>Commission</span>
            <span>Net Payout</span>
            <span>Date</span>
            <span>Status</span>
          </div>
          {TRANSACTIONS.map((tx) => {
            const { bg, color, label, icon: StatusIcon } = statusConfig(tx.status);
            return (
              <div key={tx.id} className={styles.txRow}>
                <div className={styles.txProject}>
                  <span className={styles.txProjectName}>{tx.project}</span>
                  <span className={styles.txMilestone}>{tx.milestone}</span>
                </div>
                <span className={styles.txAmount}>{formatCurrency(tx.amount)}</span>
                <span className={styles.txCommission}>-{formatCurrency(tx.commission)}</span>
                <span className={styles.txNet} style={{ color: '#0F631B' }}>{formatCurrency(tx.net)}</span>
                <span className={styles.txDate}>{tx.date}</span>
                <span className={styles.txStatus} style={{ background: bg, color }}>
                  <StatusIcon size={11} /> {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security */}
      <div className={styles.securityNotice}>
        <Shield size={16} />
        <div>
          <strong>Paystack-Secured Transfers</strong>
          <p>All payouts are processed via Paystack. Commission is deducted at release per your contract terms.</p>
        </div>
      </div>
    </div>
  );
}
