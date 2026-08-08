'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  Zap,
  ChevronRight,
  Search,
  FolderOpen,
} from 'lucide-react';
import {
  fetchMarketplace,
  type MarketplaceItem,
} from '@/dashboards/installer/services/installer-api';
import styles from './page.module.css';

/**
 * Installer Marketplace Browse
 *
 * GEMINI.md §4: "RFQ Broadcast → Installer discovers"
 * Fetches from GET /api/v1/marketplace (unified feed)
 * Filterable by location, budget, project type
 */

const NIGERIAN_STATES = [
  'All States', 'Lagos', 'Abuja', 'Rivers', 'Ogun', 'Kaduna',
  'Kano', 'Enugu', 'Delta', 'Oyo', 'Anambra', 'Edo', 'Imo',
];

const PROJECT_TYPES = ['All', 'Residential', 'Commercial', 'Industrial'] as const;

function formatBudget(amount?: number): string {
  if (!amount) return '—';
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}K`;
  return `₦${amount.toLocaleString()}`;
}

// Mock data for scaffold mode
const SCAFFOLD_ITEMS: MarketplaceItem[] = [
  {
    id: 'rfq-001', type: 'rfq', title: 'Modernist Villa Solar System',
    location_state: 'Lagos', location_city: 'Ikoyi',
    budgetMin: 3500000, budgetMax: 5000000, systemSizeKw: 15,
    projectType: 'Residential', status: 'open', posted_by: 'Edward A.',
    bidsCount: 4, timeline: '30 days', created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'rfq-002', type: 'rfq', title: 'Tech Hub Commercial Installation',
    location_state: 'Lagos', location_city: 'Lekki',
    budgetMin: 8000000, budgetMax: 12000000, systemSizeKw: 50,
    projectType: 'Commercial', status: 'open', posted_by: 'Sarah K.',
    bidsCount: 2, timeline: '45 days', created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'rfq-003', type: 'rfq', title: 'Suburban Family Home Solar',
    location_state: 'Ogun', location_city: 'Abeokuta',
    budgetMin: 1800000, budgetMax: 2500000, systemSizeKw: 8,
    projectType: 'Residential', status: 'open', posted_by: 'Michael O.',
    bidsCount: 6, timeline: '21 days', created_at: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 'rfq-004', type: 'rfq', title: 'Office Complex Energy Upgrade',
    location_state: 'Abuja', location_city: 'Garki',
    budgetMin: 15000000, budgetMax: 22000000, systemSizeKw: 100,
    projectType: 'Commercial', status: 'open', posted_by: 'Chidi N.',
    bidsCount: 1, timeline: '60 days', created_at: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: 'rfq-005', type: 'rfq', title: 'Lakeside Residence Solar',
    location_state: 'Lagos', location_city: 'Victoria Island',
    budgetMin: 4200000, budgetMax: 6000000, systemSizeKw: 20,
    projectType: 'Residential', status: 'open', posted_by: 'Amina B.',
    bidsCount: 3, timeline: '35 days', created_at: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    id: 'rfq-006', type: 'rfq', title: 'Industrial Warehouse Solar Array',
    location_state: 'Rivers', location_city: 'Port Harcourt',
    budgetMin: 25000000, budgetMax: 35000000, systemSizeKw: 200,
    projectType: 'Industrial', status: 'open', posted_by: 'Emeka U.',
    bidsCount: 0, timeline: '90 days', created_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

export default function InstallerMarketplacePage() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [location, setLocation] = useState('All States');
  const [projectType, setProjectType] = useState<string>('All');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');

  useEffect(() => {
    async function load() {
      const res = await fetchMarketplace({
        location: location !== 'All States' ? location : undefined,
        budgetMin: budgetMin ? Number(budgetMin) : undefined,
        budgetMax: budgetMax ? Number(budgetMax) : undefined,
        projectType: projectType !== 'All' ? projectType : undefined,
      });
      if (res.success && res.data && res.data.items && res.data.items.length > 0) {
        setItems(res.data.items);
      } else {
        // Scaffold mode — use mock data if database is empty or not configured
        setItems(SCAFFOLD_ITEMS);
      }
      setLoading(false);
    }
    load();
  }, [location, projectType, budgetMin, budgetMax]);

  // Filter applied client-side for scaffold
  const filtered = items.filter((item) => {
    if (location !== 'All States' && item.location_state !== location) return false;
    if (projectType !== 'All' && item.projectType !== projectType) return false;
    if (budgetMin && (item.budgetMax || 0) < Number(budgetMin)) return false;
    if (budgetMax && (item.budgetMin || 0) > Number(budgetMax)) return false;
    return true;
  });

  const matchScore = () => Math.floor(70 + Math.random() * 25);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.skeleton} style={{ height: 40, width: '35%', marginBottom: 12 }} />
        <div className={styles.skeleton} style={{ height: 20, width: '50%', marginBottom: 24 }} />
        <div className={styles.skeleton} style={{ height: 72, borderRadius: 16, marginBottom: 24 }} />
        <div className={styles.cardGrid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={styles.skeleton} style={{ height: 260, borderRadius: 16 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.tagBadge}>
          <Search size={12} /> Marketplace
        </div>
        <h1 className={styles.title}>Solar Marketplace</h1>
        <p className={styles.subtitle}>
          Discover projects matched to your expertise and grow your portfolio.
        </p>
      </header>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Location</label>
          <select
            className={styles.filterSelect}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            {NIGERIAN_STATES.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Budget Min</label>
          <input
            type="number"
            className={styles.filterInput}
            placeholder="₦0"
            value={budgetMin}
            onChange={(e) => setBudgetMin(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Budget Max</label>
          <input
            type="number"
            className={styles.filterInput}
            placeholder="₦∞"
            value={budgetMax}
            onChange={(e) => setBudgetMax(e.target.value)}
          />
        </div>

        <div className={styles.typeToggles}>
          {PROJECT_TYPES.map((pt) => (
            <button
              key={pt}
              className={`${styles.typeToggle} ${projectType === pt ? styles.typeToggleActive : ''}`}
              onClick={() => setProjectType(pt)}
            >
              {pt}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className={styles.resultsBar}>
        <span className={styles.resultsCount}>
          <span className={styles.resultsCountNum}>{filtered.length}</span> Open Opportunities
        </span>
      </div>

      {/* Cards Grid */}
      {filtered.length > 0 ? (
        <div className={styles.cardGrid}>
          {filtered.map((item) => {
            const score = matchScore();
            return (
              <Link
                key={item.id}
                href={`/dashboard/installer/marketplace/${item.id}`}
                className={styles.card}
              >
                <div className={styles.cardTop}>
                  <span className={`${styles.cardType} ${
                    item.projectType === 'Commercial' || item.projectType === 'Industrial'
                      ? styles.cardTypeCommercial
                      : styles.cardTypeResidential
                  }`}>
                    {item.projectType || 'Solar'}
                  </span>
                  <span className={styles.cardMatch}>{score}% match</span>
                </div>

                <h3 className={styles.cardTitle}>{item.title}</h3>

                <div className={styles.cardMeta}>
                  <div className={styles.cardMetaRow}>
                    <span className={styles.cardMetaIcon}><MapPin size={14} /></span>
                    <span className={styles.cardMetaValue}>
                      {item.location_city ? `${item.location_city}, ` : ''}{item.location_state || 'Nigeria'}
                    </span>
                  </div>
                  {item.systemSizeKw && (
                    <div className={styles.cardMetaRow}>
                      <span className={styles.cardMetaIcon}><Zap size={14} /></span>
                      <span className={styles.cardMetaValue}>{item.systemSizeKw} kW System</span>
                    </div>
                  )}
                  <div className={styles.cardMetaRow}>
                    <span className={styles.cardMetaIcon}>₦</span>
                    <span className={styles.cardMetaValue}>
                      {formatBudget(item.budgetMin)} — {formatBudget(item.budgetMax)}
                    </span>
                  </div>
                  {item.timeline && (
                    <div className={styles.cardMetaRow}>
                      <span className={styles.cardMetaIcon}><Calendar size={14} /></span>
                      <span className={styles.cardMetaValue}>{item.timeline}</span>
                    </div>
                  )}
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.cardBids}>
                    {item.bidsCount !== undefined ? `${item.bidsCount} bid${item.bidsCount !== 1 ? 's' : ''}` : ''}
                  </span>
                  <span className={styles.cardCta}>
                    View Details <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <FolderOpen size={48} style={{ color: '#BFCABA' }} />
          <h3 className={styles.emptyTitle}>No matches found</h3>
          <p className={styles.emptyDesc}>
            Try adjusting your filters or check back soon for new opportunities.
          </p>
        </div>
      )}
    </div>
  );
}
