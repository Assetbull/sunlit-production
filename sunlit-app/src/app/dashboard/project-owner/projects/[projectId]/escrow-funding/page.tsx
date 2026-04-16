'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowLeft, Clock, Copy, CheckCircle, RefreshCcw, HandCoins } from 'lucide-react';
import { fetchProject } from '@/dashboards/project-owner/services/project-owner-api';
import type { ProjectView } from '@/dashboards/project-owner/types/dashboard';
import styles from './page.module.css';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
}

export default function EscrowFundingPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const router = useRouter();
  
  const [project, setProject] = useState<ProjectView | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 mins mock
  
  // Status: idle -> awaiting_transfer -> verifying -> success -> redirect
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'awaiting_transfer' | 'verifying' | 'success'>('awaiting_transfer');

  useEffect(() => {
    async function load() {
      // Mock loading project details for the escrow context
      const res = await fetchProject(projectId);
      if (res.success && res.data) {
        setProject(res.data);
      }
      setLoading(false);
    }
    load();
  }, [projectId]);

  useEffect(() => {
    if (paymentStatus === 'awaiting_transfer') {
      const timer = setInterval(() => {
        setTimeRemaining(t => (t > 0 ? t - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [paymentStatus]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText('0039845123'); // Mock Paystack Account
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulatePayment = () => {
    setPaymentStatus('verifying');
    // Simulate webhook delay
    setTimeout(() => {
      setPaymentStatus('success');
      // Redirect to project workspace after 2s
      setTimeout(() => {
         router.push(`/dashboard/project-owner/projects/${projectId}`);
      }, 2000);
    }, 2500);
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--card" style={{ height: 400 }} />
      </div>
    );
  }

  // Find the first pending milestone (Deposit/Procurement)
  const targetMilestone = project?.milestones[0];
  const amountToFund = targetMilestone?.amount || 0;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href={`/dashboard/project-owner`} className="btn btn-ghost btn-sm">
          <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
        </Link>
        <h1 className="headline-lg">Secure Escrow Funding</h1>
        <p className="body-md text-muted">
          Your project <strong className="text-foreground">{project?.title}</strong> requires an initial deposit to begin execution.
        </p>
      </div>

      <div className={styles.contentGrid}>
        {/* Payment Details Container */}
        <div className={`surface-card animate-in ${styles.paymentCard}`}>
          <div className={styles.escrowHeader}>
            <ShieldCheck size={28} className="text-secondary" />
            <span className="body-sm font-bold text-secondary uppercase tracking-wider">Sunlit Protected Escrow</span>
          </div>

          <div className={styles.amountContainer}>
             <span className="label-md text-muted">Amount to Fund</span>
             <h2 className="headline-xl mt-1">{formatCurrency(amountToFund)}</h2>
             <span className="body-sm text-muted mt-2">For: {targetMilestone?.title || 'Initial Milestone'}</span>
          </div>

          {paymentStatus === 'success' ? (
             <div className={`animate-scale ${styles.successState}`}>
                 <CheckCircle size={56} className="text-secondary mb-4" />
                 <h3 className="headline-sm">Payment Verified!</h3>
                 <p className="body-md text-muted mt-2">The escrow account has been successfully funded.</p>
                 <p className="body-sm text-muted mt-4 animate-pulse">Redirecting to project workspace...</p>
             </div>
          ) : paymentStatus === 'verifying' ? (
             <div className={`animate-in ${styles.verifyingState}`}>
                 <RefreshCcw size={48} className="text-primary animate-spin mb-4" />
                 <h3 className="headline-sm">Listening for Webhook...</h3>
                 <p className="body-md text-muted mt-2">Please wait while we verify your transfer across our nodes.</p>
             </div>
          ) : (
             <div className={`animate-in ${styles.transferDetails}`}>
                <div className={styles.timerBar}>
                   <Clock size={16} className={timeRemaining < 300 ? 'text-error' : 'text-primary'} />
                   <span className={`label-sm ${timeRemaining < 300 ? 'text-error' : ''}`}>
                      Expires in: {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                   </span>
                </div>

                <div className={styles.accountBox}>
                   <div className={styles.accountRow}>
                      <span className="body-sm text-muted">Bank Name</span>
                      <span className="title-md">Paystack-Titan</span>
                   </div>
                   <div className={styles.accountRow}>
                      <span className="body-sm text-muted">Account Number</span>
                      <div className="flex items-center gap-2">
                         <span className="headline-sm tracking-wider">0039845123</span>
                         <button onClick={copyToClipboard} className="btn btn-ghost btn-sm" title="Copy Account Number">
                            {copied ? <CheckCircle size={16} className="text-secondary"/> : <Copy size={16}/>}
                         </button>
                      </div>
                   </div>
                   <div className={styles.accountRow}>
                      <span className="body-sm text-muted">Account Name</span>
                      <span className="title-sm">Sunlit Escrow / {project?.title.slice(0,10)}</span>
                   </div>
                </div>

                <div className={styles.simulationBanner}>
                    <p className="body-sm text-muted mb-3 flex items-start gap-2">
                       <CheckCircle size={16} className="mt-0.5 text-secondary flex-shrink-0" />
                       Your funds are held securely in a virtual trust and will only be released to the installer upon your milestone approval.
                    </p>
                    
                    {/* Developer Mock Control */}
                    <div className="pt-4 border-t border-border/50">
                        <button onClick={simulatePayment} className="btn btn-secondary w-full">
                           <HandCoins size={16} className="mr-2"/> Simulate Webhook Transfer
                        </button>
                    </div>
                </div>
             </div>
          )}
        </div>

        {/* Informational Sidebar */}
        <div className={styles.infoSidebar}>
            <div className={`surface-card ${styles.infoCard}`}>
                <h3 className="title-md border-b border-border/50 pb-3 mb-3">How Escrow Works</h3>
                <ol className={styles.infoList}>
                   <li>
                      <strong>1. Fund the Project</strong>
                      <span className="text-muted block mt-1">You transfer the initial milestone cost into the Sunlit Escrow Account.</span>
                   </li>
                   <li>
                      <strong>2. Setup Begins</strong>
                      <span className="text-muted block mt-1">The installer is notified and begins logistics and execution.</span>
                   </li>
                   <li>
                      <strong>3. Approve & Release</strong>
                      <span className="text-muted block mt-1">Once the milestone is physically verified, you click "Release Funds".</span>
                   </li>
                </ol>
            </div>
        </div>
      </div>
    </div>
  );
}
