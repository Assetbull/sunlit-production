'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';
import styles from './page.module.css';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
}

export default function FundEscrowPage({ params }: { params: Promise<{ milestoneId: string }> }) {
  const { milestoneId } = use(params);

  // In production this would fetch milestone + project details via API
  const milestoneAmount = 840_000;
  const milestoneTitle = 'Installation & Wiring';

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/dashboard/project-owner" className="btn btn-ghost btn-sm">
          <ArrowLeft size={16} className="mr-2" /> Back
        </Link>
        <h1 className="headline-lg">Fund Escrow</h1>
        <p className="body-md text-muted">
          Secure your funds in escrow. Payment will only be released when the milestone is completed and approved.
        </p>
      </div>

      <div className={`surface-card animate-in ${styles.paymentCard}`}>
        <div className={styles.paymentHeader}>
          <span className="label-md">Milestone</span>
          <h2 className="headline-sm">{milestoneTitle}</h2>
        </div>

        <div className={styles.amountSection}>
          <span className="label-md">Amount to Fund</span>
          <span className={styles.amount}>{formatCurrency(milestoneAmount)}</span>
        </div>

        <div className={styles.securityNotice}>
          <p className="body-sm flex items-start gap-2">
            <Lock size={16} className="text-primary shrink-0 mt-0.5" />
            <span>
              <strong>Escrow Protection:</strong> Your funds are held securely until the milestone is completed.
              Payment confirmation is processed exclusively via secure webhook — not through your browser.
            </span>
          </p>
        </div>

        <div className={styles.escrowRules}>
          <span className="label-md">Escrow Rules</span>
          <ul className={styles.rulesList}>
            <li className="body-sm">If a dispute is raised → funds are <strong>blocked</strong></li>
            <li className="body-sm">If the milestone is incomplete → funds are <strong>held</strong></li>
            <li className="body-sm">If you approve completion → funds are <strong>released</strong> to installer</li>
          </ul>
        </div>

        <div className={styles.vaContainer}>
          <div className={styles.vaRow}>
            <span className={styles.vaLabel}>Bank Name</span>
            <span className={styles.vaValue}>Titan Trust Bank (Paystack)</span>
          </div>
          <div className={styles.vaRow}>
            <span className={styles.vaLabel}>Account Number</span>
            <span className={styles.vaValue}>
              <span className={styles.vaNumber}>9984712032</span>
            </span>
          </div>
          <div className={styles.vaRow}>
            <span className={styles.vaLabel}>Account Name</span>
            <span className={styles.vaValue}>Sunlit Escrow - Project</span>
          </div>
          <div className={styles.vaRow}>
            <span className={styles.vaLabel}>Amount due</span>
            <span className={styles.vaValue}>{formatCurrency(milestoneAmount)}</span>
          </div>
        </div>

        <button
          className="btn btn-primary btn-lg w-full mt-4"
          onClick={() => {
            alert('Transfer Simulation: A webhook from Paystack has updated the escrow state to FUNDED.');
          }}
        >
          I have made this transfer
        </button>

        <p className="body-sm text-muted text-center mt-2">
          Payment is automatically verified via secure webhook.
        </p>
      </div>
    </div>
  );
}
