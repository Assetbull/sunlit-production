'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  ArrowLeftRight,
  Wallet,
  HardHat,
  AlertCircle,
  ChevronRight,
  Search,
  PlusCircle,
  TrendingUp,
  CheckCircle2,
  Zap,
  CircleDollarSign,
  Users,
  Building2,
  FileText,
} from 'lucide-react'; 
import {
  fetchInstallerDashboard,
  fetchRecentActivity,
  type InstallerDashboardSummary,
  type ActivityItem,
} from '@/dashboards/installer/services/installer-api';
import { getSession } from '@/shared/session/sessionManager';
import type { EPCDashboardData } from '@/dashboards/epc/types';
import styles from './page.module.css';

/**
 * Installer Dashboard Overview
 *
 * GEMINI.md §3: Module 2 — Installer Dashboard
 * Design: "Luminous Command Center" — light mode, organic minimalism
 *
 * Features:
 * - Summary metrics (projects, bids, earnings, crew)
 * - Action required alerts
 * - Recent activity feed
 * - Quick actions (marketplace, crew posting)
 * 
 * EPC Enhancement (Task 4.2):
 * - Conditionally displays EPC-specific metrics for epc_contractor role
 * - Shows external projects, crews managed, and enhanced revenue
 * - Adds EPC-specific navigation items
 * - Maintains backward compatibility with standard installer dashboard
 */

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const ACTIVITY_ICONS: Record<string, { icon: typeof Briefcase; bg: string; color: string }> = {
  bid_accepted: { icon: CheckCircle2, bg: 'rgba(15,99,27,0.08)', color: '#0F631B' },
  bid_rejected: { icon: AlertCircle, bg: 'rgba(186,26,26,0.08)', color: '#ba1a1a' },
  milestone_approved: { icon: Zap, bg: 'rgba(15,99,27,0.08)', color: '#0F631B' },
  new_match: { icon: Search, bg: 'rgba(52,95,58,0.08)', color: '#345F3A' },
  payment_released: { icon: CircleDollarSign, bg: 'rgba(15,99,27,0.08)', color: '#0F631B' },
  crew_applied: { icon: Users, bg: 'rgba(105,92,73,0.08)', color: '#695C49' },
};

export default function InstallerDashboardOverview() {
  const [summary, setSummary] = useState<InstallerDashboardSummary | null>(null);
  const [epcData, setEpcData] = useState<EPCDashboardData | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get user session to check role
  const session = getSession();
  const isEpcContractor = session?.role === 'epc_contractor';

  useEffect(() => {
    async function load() {
      if (isEpcContractor) {
        // Load EPC dashboard data for EPC contractors
        try {
          const response = await fetch('/api/v1/dashboard/epc', {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          });
          
          if (response.ok) {
            const data = await response.json();
            setEpcData(data);
            setSummary(data); // EPC data extends installer data
          } else {
            // Fallback to standard installer dashboard if EPC data fails
            const [summaryRes, activityRes] = await Promise.all([
              fetchInstallerDashboard(),
              fetchRecentActivity(),
            ]);
            if (summaryRes.success && summaryRes.data) setSummary(summaryRes.data);
            if (activityRes.success && activityRes.data) setActivity(activityRes.data.items);
          }
        } catch (error) {
          console.error('Error loading EPC dashboard:', error);
          // Fallback to standard installer dashboard
          const [summaryRes, activityRes] = await Promise.all([
            fetchInstallerDashboard(),
            fetchRecentActivity(),
          ]);
          if (summaryRes.success && summaryRes.data) setSummary(summaryRes.data);
          if (activityRes.success && activityRes.data) setActivity(activityRes.data.items);
        }
      } else {
        // Load standard installer dashboard for regular installers
        const [summaryRes, activityRes] = await Promise.all([
          fetchInstallerDashboard(),
          fetchRecentActivity(),
        ]);
        if (summaryRes.success && summaryRes.data) setSummary(summaryRes.data);
        if (activityRes.success && activityRes.data) setActivity(activityRes.data.items);
      }
      setLoading(false);
    }
    load();
  }, [isEpcContractor]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.skeleton} style={{ height: 28, width: '30%', marginBottom: 12 }} />
          <div className={styles.skeleton} style={{ height: 18, width: '45%' }} />
        </div>
        <div className={styles.summaryGrid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.skeleton} style={{ height: 140, borderRadius: 16 }} />
          ))}
        </div>
        <div className={styles.dualGrid}>
          <div className={styles.skeleton} style={{ height: 280, borderRadius: 20 }} />
          <div className={styles.skeleton} style={{ height: 280, borderRadius: 20 }} />
        </div>
        <div className={styles.skeleton} style={{ height: 320, borderRadius: 20 }} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.tagBadge}>
          {isEpcContractor ? 'EPC Contractor Dashboard' : 'Installer Dashboard'}
        </div>
        <h1 className={styles.title}>
          Welcome back, <span className={styles.titleAccent}>{isEpcContractor ? 'EPC Contractor' : 'Installer'}</span>
        </h1>
        <p className={styles.subtitle}>
          {isEpcContractor 
            ? 'Your enterprise projects, crews, and operations at a glance.'
            : 'Your solar projects, bids, and crew at a glance.'}
        </p>
      </header>

      {/* Summary Metrics */}
      {summary && (
        <div className={styles.summaryGrid}>
          {/* Active Projects */}
          <div className={styles.summaryCard}>
            <div className={styles.summaryCardTop}>
              <span className={styles.summaryLabel}>Active Projects</span>
              <div
                className={styles.summaryIconBox}
                style={{ background: 'rgba(15,99,27,0.06)', color: '#0F631B' }}
              >
                <Briefcase size={18} />
              </div>
            </div>
            <span className={`${styles.summaryValue} ${styles.summaryValuePrimary}`}>
              {summary.activeProjects}
            </span>
            <div className={styles.summarySubtext} style={{ color: '#0F631B' }}>
              <TrendingUp size={12} /> In progress
            </div>
          </div>

          {/* Pending Bids */}
          <div className={styles.summaryCard}>
            <div className={styles.summaryCardTop}>
              <span className={styles.summaryLabel}>Pending Bids</span>
              <div
                className={styles.summaryIconBox}
                style={{ background: 'rgba(245,166,35,0.08)', color: '#F5A623' }}
              >
                <ArrowLeftRight size={18} />
              </div>
            </div>
            <span className={styles.summaryValue}>{summary.pendingBids}</span>
            <div className={styles.summarySubtext} style={{ color: '#F5A623' }}>
              Awaiting response
            </div>
          </div>

          {/* Total Earnings */}
          <div className={styles.summaryCard}>
            <div className={styles.summaryCardTop}>
              <span className={styles.summaryLabel}>Total Earnings</span>
              <div
                className={styles.summaryIconBox}
                style={{ background: 'rgba(15,99,27,0.06)', color: '#0F631B' }}
              >
                <Wallet size={18} />
              </div>
            </div>
            <span className={`${styles.summaryValue} ${styles.summaryValuePrimary}`}>
              {formatCurrency(summary.totalEarnings).split('.')[0]}
            </span>
            <div className={styles.summarySubtext} style={{ color: '#0F631B' }}>
              <TrendingUp size={12} /> +18% this month
            </div>
          </div>

          {/* Crew Jobs Posted */}
          <div className={styles.summaryCard}>
            <div className={styles.summaryCardTop}>
              <span className={styles.summaryLabel}>Crew Jobs</span>
              <div
                className={styles.summaryIconBox}
                style={{ background: 'rgba(52,95,58,0.08)', color: '#345F3A' }}
              >
                <HardHat size={18} />
              </div>
            </div>
            <span className={styles.summaryValue}>{summary.crewJobsPosted}</span>
            <div className={styles.summarySubtext} style={{ color: '#345F3A' }}>
              Active listings
            </div>
          </div>

          {/* EPC-Specific Metrics - Only shown for EPC contractors */}
          {isEpcContractor && epcData && (
            <>
              {/* External Projects */}
              <div className={styles.summaryCard}>
                <div className={styles.summaryCardTop}>
                  <span className={styles.summaryLabel}>External Projects</span>
                  <div
                    className={styles.summaryIconBox}
                    style={{ background: 'rgba(52,95,58,0.08)', color: '#345F3A' }}
                  >
                    <Building2 size={18} />
                  </div>
                </div>
                <span className={styles.summaryValue}>
                  {epcData.enhancedMetrics.externalProjectCount}
                </span>
                <div className={styles.summarySubtext} style={{ color: '#345F3A' }}>
                  Self-managed projects
                </div>
              </div>

              {/* Total Crews Managed */}
              <div className={styles.summaryCard}>
                <div className={styles.summaryCardTop}>
                  <span className={styles.summaryLabel}>Crews Managed</span>
                  <div
                    className={styles.summaryIconBox}
                    style={{ background: 'rgba(105,92,73,0.08)', color: '#695C49' }}
                  >
                    <Users size={18} />
                  </div>
                </div>
                <span className={styles.summaryValue}>
                  {epcData.enhancedMetrics.totalCrewsManaged}
                </span>
                <div className={styles.summarySubtext} style={{ color: '#695C49' }}>
                  Active coordination
                </div>
              </div>

              {/* External Project Revenue */}
              <div className={styles.summaryCard}>
                <div className={styles.summaryCardTop}>
                  <span className={styles.summaryLabel}>External Revenue</span>
                  <div
                    className={styles.summaryIconBox}
                    style={{ background: 'rgba(15,99,27,0.06)', color: '#0F631B' }}
                  >
                    <CircleDollarSign size={18} />
                  </div>
                </div>
                <span className={`${styles.summaryValue} ${styles.summaryValuePrimary}`}>
                  {formatCurrency(epcData.enhancedMetrics.externalProjectRevenue).split('.')[0]}
                </span>
                <div className={styles.summarySubtext} style={{ color: '#0F631B' }}>
                  <TrendingUp size={12} /> From external projects
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Action Required + Quick Actions */}
      <div className={styles.dualGrid}>
        {/* Action Required */}
        <div className={styles.actionPanel}>
          <div className={styles.actionTag}>
            <AlertCircle size={14} strokeWidth={2.5} />
            <span>Action Required</span>
          </div>
          <h2 className={styles.actionTitle}>Items needing your attention</h2>
          <p className={styles.actionText}>
            Stay on top of your projects by addressing these pending items.
          </p>

          {summary && summary.pendingMilestones > 0 && (
            <Link href="/dashboard/installer/projects" className={styles.actionItem}>
              <div className={styles.actionItemDot} style={{ background: '#F5A623' }} />
              <span className={styles.actionItemText}>
                {summary.pendingMilestones} milestone{summary.pendingMilestones > 1 ? 's' : ''} awaiting your update
              </span>
              <ChevronRight size={16} className={styles.actionItemArrow} />
            </Link>
          )}

          {summary && summary.newMatches > 0 && (
            <Link href="/dashboard/installer/marketplace" className={styles.actionItem}>
              <div className={styles.actionItemDot} style={{ background: '#0F631B' }} />
              <span className={styles.actionItemText}>
                {summary.newMatches} new RFQ{summary.newMatches > 1 ? 's' : ''} matching your profile
              </span>
              <ChevronRight size={16} className={styles.actionItemArrow} />
            </Link>
          )}

          <Link href="/dashboard/installer/bids" className={styles.actionItem}>
            <div className={styles.actionItemDot} style={{ background: '#345F3A' }} />
            <span className={styles.actionItemText}>
              Review your pending bid submissions
            </span>
            <ChevronRight size={16} className={styles.actionItemArrow} />
          </Link>
        </div>

        {/* Quick Actions + Stats */}
        <div className={styles.quickPanel}>
          <span className={styles.quickTitle}>Quick Actions</span>
          <div className={styles.quickActions}>
            <Link
              href="/dashboard/installer/marketplace"
              className={`${styles.quickBtn} ${styles.quickBtnPrimary}`}
            >
              <Search size={18} /> Browse Marketplace
            </Link>
            <Link
              href="/dashboard/installer/crewlink"
              className={`${styles.quickBtn} ${styles.quickBtnSecondary}`}
            >
              <PlusCircle size={18} /> Post Crew Job
            </Link>
            
            {/* EPC-Specific Quick Actions */}
            {isEpcContractor && (
              <>
                <Link
                  href="/dashboard/installer/external-projects"
                  className={`${styles.quickBtn} ${styles.quickBtnSecondary}`}
                >
                  <Building2 size={18} /> External Projects
                </Link>
                <Link
                  href="/dashboard/installer/financial-center"
                  className={`${styles.quickBtn} ${styles.quickBtnSecondary}`}
                >
                  <Wallet size={18} /> Financial Center
                </Link>
                <Link
                  href="/dashboard/installer/audit-logs"
                  className={`${styles.quickBtn} ${styles.quickBtnSecondary}`}
                >
                  <FileText size={18} /> Audit Logs
                </Link>
              </>
            )}
          </div>

          {summary && (
            <div className={styles.quickStats}>
              <div className={styles.quickStat}>
                <span className={styles.quickStatValue}>28%</span>
                <span className={styles.quickStatLabel}>Win Rate</span>
              </div>
              <div className={styles.quickStat}>
                <span className={styles.quickStatValue}>₦4.1M</span>
                <span className={styles.quickStatLabel}>Avg Bid</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Activity</h2>
          <span className={styles.sectionBadge}>{activity.length} events</span>
        </div>

        {activity.length > 0 ? (
          <div className={styles.activityList}>
            {activity.map((item) => {
              const config = ACTIVITY_ICONS[item.type] || ACTIVITY_ICONS.new_match;
              const Icon = config.icon;
              return (
                <div key={item.id} className={styles.activityItem}>
                  <div
                    className={styles.activityIcon}
                    style={{ background: config.bg, color: config.color }}
                  >
                    <Icon size={18} />
                  </div>
                  <div className={styles.activityContent}>
                    <p className={styles.activityTitle}>{item.title}</p>
                    <p className={styles.activityDesc}>{item.description}</p>
                  </div>
                  <span className={styles.activityTime}>{timeAgo(item.timestamp)}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.activityList} style={{ padding: 48, textAlign: 'center' }}>
            <p style={{ color: '#707A6C', fontSize: '0.875rem' }}>
              No recent activity. Start by browsing the marketplace.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
