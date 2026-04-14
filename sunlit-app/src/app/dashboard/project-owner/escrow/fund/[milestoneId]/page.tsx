'use client';

import { use } from 'react';
import Link from 'next/link';
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
        <Link href="/dashboard/project-owner" className="btn btn-ghost btn-sm">← Back</Link>
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
          <p className="body-sm">
            🔒 <strong>Escrow Protection:</strong> Your funds are held securely until the milestone is completed.
            Payment confirmation is processed exclusively via secure webhook — not through your browser.
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

        <button
          className="btn btn-primary btn-lg w-full"
          onClick={() => {
            // TODO: Wire to Paystack initialization
            // initializePayment(milestoneId, projectId, milestoneAmount)
            alert('Paystack payment initialization will be wired when payment gateway is configured.');
          }}
        >
          Pay {formatCurrency(milestoneAmount)} via Paystack
        </button>

        <p className="body-sm text-muted text-center mt-2">
          Secured by Paystack · Webhook-only confirmation
        </p>
      </div>
    </div>
  );
}
