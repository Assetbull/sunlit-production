'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, CheckCircle2, Clock, Circle,
  Upload, MapPin, User, DollarSign,
  Calendar, MessageCircle,
} from 'lucide-react';

/**
 * Project Detail — Installer View
 *
 * GEMINI.md §4 steps 7-9: Execution → Milestones → Completion
 * Visual milestone tracker + escrow + proof of work upload
 */

interface Milestone {
  id: string; name: string; amount: number;
  status: 'completed' | 'in_progress' | 'pending';
  progress?: number;
}

const MOCK = {
  title: 'Modernist Villa Solar System', client: 'Edward Adeyemi',
  location: 'Lagos, Ikoyi', contractValue: 4200000, day: 12, totalDays: 25,
  escrowFunded: 4200000, escrowReleased: 1680000,
  milestones: [
    { id: 'm1', name: 'Site Survey', amount: 420000, status: 'completed' as const },
    { id: 'm2', name: 'Equipment Procurement', amount: 1260000, status: 'completed' as const },
    { id: 'm3', name: 'Installation', amount: 1680000, status: 'in_progress' as const, progress: 60 },
    { id: 'm4', name: 'Testing & Commissioning', amount: 420000, status: 'pending' as const },
    { id: 'm5', name: 'Final Handover', amount: 420000, status: 'pending' as const },
  ],
};

const s = {
  page: { maxWidth: 1120 } as React.CSSProperties,
  back: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '8px 16px', borderRadius: 10,
    fontSize: '0.8125rem', fontWeight: 600, color: '#40493D',
    textDecoration: 'none', marginBottom: 24,
  } as React.CSSProperties,
  panel: {
    background: '#FFFFFF', borderRadius: 20, padding: 28, marginBottom: 20,
  } as React.CSSProperties,
  title: {
    fontSize: '1.75rem', fontWeight: 800, color: '#1A1C1C',
    letterSpacing: '-0.02em', margin: '0 0 8px',
  } as React.CSSProperties,
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '6px 14px', borderRadius: 999,
    background: 'rgba(15,99,27,0.06)', color: '#0F631B',
    fontSize: '0.6875rem', fontWeight: 700,
    textTransform: 'uppercase' as const, letterSpacing: '0.1em',
    marginBottom: 20,
  } as React.CSSProperties,
  detailGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 14, marginBottom: 24,
  } as React.CSSProperties,
  detailItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '14px 16px', background: '#F9F9F8', borderRadius: 12,
  } as React.CSSProperties,
  detailIcon: {
    width: 32, height: 32, borderRadius: 8,
    background: 'rgba(15,99,27,0.06)', color: '#0F631B',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  } as React.CSSProperties,
  label: {
    fontSize: '0.5625rem', fontWeight: 700, color: '#707A6C',
    textTransform: 'uppercase' as const, letterSpacing: '0.08em',
    margin: 0,
  } as React.CSSProperties,
  value: {
    fontSize: '0.875rem', fontWeight: 700, color: '#1A1C1C', margin: 0,
  } as React.CSSProperties,
};

function formatN(n: number) {
  return n >= 1e6 ? `₦${(n / 1e6).toFixed(1)}M` : `₦${n.toLocaleString()}`;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const [progress, setProgress] = useState(60);
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const p = MOCK;

  const escrowPct = Math.round((p.escrowReleased / p.escrowFunded) * 100);

  return (
    <div style={s.page}>
      <Link href="/dashboard/installer/projects" style={s.back}>
        <ArrowLeft size={16} /> Back to Projects
      </Link>

      {/* Project Header */}
      <div style={s.panel}>
        <div style={s.badge}>● In Progress — Day {p.day} of {p.totalDays}</div>
        <h1 style={s.title}>{p.title}</h1>

        <div style={s.detailGrid}>
          <div style={s.detailItem}>
            <div style={s.detailIcon}><User size={14} /></div>
            <div><p style={s.label}>Client</p><p style={s.value}>{p.client}</p></div>
          </div>
          <div style={s.detailItem}>
            <div style={s.detailIcon}><MapPin size={14} /></div>
            <div><p style={s.label}>Location</p><p style={s.value}>{p.location}</p></div>
          </div>
          <div style={s.detailItem}>
            <div style={s.detailIcon}><DollarSign size={14} /></div>
            <div><p style={s.label}>Contract</p><p style={s.value}>{formatN(p.contractValue)}</p></div>
          </div>
        </div>
      </div>

      {/* Milestone Tracker */}
      <div style={s.panel}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1A1C1C', margin: '0 0 24px', letterSpacing: '-0.01em' }}>
          Milestone Tracker
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {p.milestones.map((m, i) => {
            const Icon = m.status === 'completed' ? CheckCircle2 :
                         m.status === 'in_progress' ? Clock : Circle;
            const color = m.status === 'completed' ? '#0F631B' :
                          m.status === 'in_progress' ? '#F5A623' : '#BFCABA';
            const isLast = i === p.milestones.length - 1;

            return (
              <div key={m.id} style={{ display: 'flex', gap: 20 }}>
                {/* Timeline */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24 }}>
                  <Icon size={20} style={{ color, flexShrink: 0 }} strokeWidth={m.status === 'completed' ? 2.5 : 2} />
                  {!isLast && (
                    <div style={{
                      width: 2, flex: 1, minHeight: 40,
                      background: m.status === 'completed' ? '#0F631B' : '#EEEEED',
                      borderRadius: 1, margin: '4px 0',
                    }} />
                  )}
                </div>

                {/* Content */}
                <div style={{
                  flex: 1, paddingBottom: isLast ? 0 : 20,
                  background: m.status === 'in_progress' ? '#F9F9F8' : 'transparent',
                  borderRadius: m.status === 'in_progress' ? 14 : 0,
                  padding: m.status === 'in_progress' ? '16px 20px' : '0 0 0 0',
                  marginBottom: m.status === 'in_progress' ? 8 : 0,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{
                      fontSize: '0.875rem', fontWeight: 700, color: '#1A1C1C', margin: 0,
                      opacity: m.status === 'pending' ? 0.5 : 1,
                    }}>{m.name}</p>
                    <span style={{
                      fontSize: '0.8125rem', fontWeight: 800, color: m.status === 'completed' ? '#0F631B' : '#40493D',
                      opacity: m.status === 'pending' ? 0.5 : 1,
                    }}>{formatN(m.amount)}</span>
                  </div>
                  {m.status === 'completed' && (
                    <p style={{ fontSize: '0.6875rem', color: '#0F631B', margin: '4px 0 0', fontWeight: 600 }}>
                      ✓ Completed — {formatN(m.amount)} released
                    </p>
                  )}
                  {m.status === 'in_progress' && (
                    <p style={{ fontSize: '0.6875rem', color: '#F5A623', margin: '4px 0 0', fontWeight: 600 }}>
                      ● In Progress — {m.progress}%
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Escrow Status */}
      <div style={s.panel}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1A1C1C', margin: '0 0 20px' }}>
          Payment Status
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 16 }}>
          <div style={{ padding: '14px 18px', background: '#F9F9F8', borderRadius: 12, textAlign: 'center' }}>
            <p style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F631B', margin: 0 }}>{formatN(p.escrowFunded)}</p>
            <p style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#707A6C', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '4px 0 0' }}>Total Funded</p>
          </div>
          <div style={{ padding: '14px 18px', background: '#F9F9F8', borderRadius: 12, textAlign: 'center' }}>
            <p style={{ fontSize: '1.125rem', fontWeight: 800, color: '#345F3A', margin: 0 }}>{formatN(p.escrowReleased)}</p>
            <p style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#707A6C', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '4px 0 0' }}>Released</p>
          </div>
          <div style={{ padding: '14px 18px', background: '#F9F9F8', borderRadius: 12, textAlign: 'center' }}>
            <p style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1A1C1C', margin: 0 }}>{formatN(p.escrowFunded - p.escrowReleased)}</p>
            <p style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#707A6C', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '4px 0 0' }}>Held</p>
          </div>
        </div>
        <div style={{ height: 8, background: '#F3F4F3', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${escrowPct}%`, background: 'linear-gradient(90deg, #0F631B, #2F7D32)', borderRadius: 4, transition: 'width 0.6s ease' }} />
        </div>
        <p style={{ fontSize: '0.6875rem', color: '#707A6C', textAlign: 'right', marginTop: 6 }}>{escrowPct}% released</p>
      </div>

      {/* Update Current Milestone */}
      <div style={s.panel}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1A1C1C', margin: '0 0 20px' }}>
          Update Milestone — Installation
        </h2>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#707A6C', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Progress ({progress}%)
          </label>
          <input
            type="range" min="0" max="100" value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#0F631B' }}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#707A6C', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Notes
          </label>
          <textarea
            value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about your progress..."
            style={{
              width: '100%', minHeight: 100, padding: '14px 16px',
              background: '#F3F4F3', border: 'none', borderRadius: 12,
              fontSize: '0.875rem', fontFamily: 'Inter, sans-serif',
              outline: 'none', resize: 'vertical', boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 20px', background: '#F3F4F3', borderRadius: 12,
            border: 'none', fontSize: '0.8125rem', fontWeight: 600,
            color: '#40493D', cursor: 'pointer',
          }}>
            <Upload size={16} /> Upload Proof
          </button>
          <button
            disabled={updating}
            onClick={() => { setUpdating(true); setTimeout(() => setUpdating(false), 1500); }}
            style={{
              flex: 1, padding: '14px 24px', border: 'none', borderRadius: 12,
              background: 'linear-gradient(135deg, #0F631B, #2F7D32)',
              color: 'white', fontSize: '0.875rem', fontWeight: 700,
              cursor: 'pointer', letterSpacing: '0.04em',
              boxShadow: '0 4px 16px rgba(15,99,27,0.15)',
            }}
          >
            {updating ? 'Submitting...' : 'Submit Update'}
          </button>
        </div>
      </div>

      {/* Chat Preview */}
      <div style={s.panel}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1A1C1C', margin: 0 }}>
            Project Chat
          </h2>
          <Link href="/dashboard/installer/messages" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: '0.75rem', fontWeight: 700, color: '#0F631B', textDecoration: 'none',
          }}>
            <MessageCircle size={14} /> Open Full Chat
          </Link>
        </div>
        <div style={{ marginTop: 16, padding: '12px 16px', background: '#F9F9F8', borderRadius: 12 }}>
          <p style={{ fontSize: '0.8125rem', color: '#40493D', margin: 0 }}>
            <strong>{p.client}:</strong> "Great progress on the installation. Can you share updated timeline?"
          </p>
          <p style={{ fontSize: '0.625rem', color: '#BFCABA', marginTop: 4 }}>2 hours ago</p>
        </div>
      </div>
    </div>
  );
}
