'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  HardHat, PlusCircle, Users, ChevronRight,
  MapPin, Calendar, Eye,
} from 'lucide-react';

/**
 * CrewLink Hub — Installer Side
 *
 * GEMINI.md: "Installer ↔ CrewLink lifecycle (standalone + project-bound)"
 * Post crew jobs, review applications, manage assignments.
 */

interface CrewJob {
  id: string; title: string; location: string;
  payRate: string; skills: string[];
  applicants: number; status: 'active' | 'filled' | 'closed';
  posted: string;
}

const MOCK_JOBS: CrewJob[] = [
  {
    id: 'job-001', title: 'Solar Panel Installer', location: 'Lagos, Ikoyi',
    payRate: '₦25,000/day', skills: ['Panel mounting', 'Electrical wiring'],
    applicants: 5, status: 'active', posted: '3 days ago',
  },
  {
    id: 'job-002', title: 'Electrical Technician', location: 'Abuja, Garki',
    payRate: '₦30,000/day', skills: ['Inverter setup', 'Grid-tie'],
    applicants: 2, status: 'active', posted: '1 day ago',
  },
];

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  active: { bg: 'rgba(15,99,27,0.06)', color: '#0F631B', label: 'Active' },
  filled: { bg: 'rgba(52,95,58,0.08)', color: '#345F3A', label: 'Filled' },
  closed: { bg: 'rgba(112,122,108,0.08)', color: '#707A6C', label: 'Closed' },
};

export default function CrewLinkHubPage() {
  const jobs = MOCK_JOBS;

  return (
    <div style={{ maxWidth: 1120 }}>
      <header style={{ marginBottom: 28 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 14px', borderRadius: 999,
          background: 'rgba(52,95,58,0.08)', fontSize: '0.6875rem',
          fontWeight: 700, color: '#345F3A', textTransform: 'uppercase',
          letterSpacing: '0.1em', marginBottom: 16,
        }}>
          <HardHat size={12} /> CrewLink Hub
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1A1C1C', letterSpacing: '-0.02em', margin: '0 0 8px' }}>
          Crew Management
        </h1>
        <p style={{ fontSize: '0.9375rem', color: '#40493D', margin: 0 }}>
          Post crew positions and manage your workforce.
        </p>
      </header>

      {/* Post New Job CTA */}
      <Link href="/dashboard/installer/crewlink/new" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: '16px 24px', borderRadius: 14, marginBottom: 24,
        background: 'linear-gradient(135deg, #0F631B, #2F7D32)',
        color: 'white', fontWeight: 700, fontSize: '0.875rem',
        textDecoration: 'none', letterSpacing: '0.04em',
        boxShadow: '0 4px 16px rgba(15,99,27,0.15)',
      }}>
        <PlusCircle size={18} /> Post New Crew Position
      </Link>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F631B', margin: 0 }}>{jobs.length}</p>
          <p style={{ fontSize: '0.625rem', fontWeight: 700, color: '#707A6C', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '4px 0 0' }}>Active Jobs</p>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1A1C1C', margin: 0 }}>
            {jobs.reduce((s, j) => s + j.applicants, 0)}
          </p>
          <p style={{ fontSize: '0.625rem', fontWeight: 700, color: '#707A6C', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '4px 0 0' }}>Total Applicants</p>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1A1C1C', margin: 0 }}>0</p>
          <p style={{ fontSize: '0.625rem', fontWeight: 700, color: '#707A6C', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '4px 0 0' }}>Crew Assigned</p>
        </div>
      </div>

      {/* Job Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {jobs.map((job) => {
          const st = STATUS_STYLES[job.status];
          return (
            <Link
              key={job.id}
              href={`/dashboard/installer/crewlink/${job.id}`}
              style={{
                background: '#fff', borderRadius: 20, padding: 28,
                textDecoration: 'none', color: 'inherit',
                transition: 'all 0.3s ease', display: 'block',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1A1C1C', margin: '0 0 6px' }}>{job.title}</h3>
                  <div style={{ display: 'flex', gap: 12, fontSize: '0.75rem', color: '#707A6C' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} />{job.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} />{job.posted}</span>
                  </div>
                </div>
                <span style={{
                  padding: '4px 12px', borderRadius: 8,
                  background: st.bg, color: st.color,
                  fontSize: '0.6875rem', fontWeight: 700,
                }}>{st.label}</span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                {job.skills.map((skill) => (
                  <span key={skill} style={{
                    padding: '4px 10px', borderRadius: 6, background: '#F3F4F3',
                    fontSize: '0.6875rem', fontWeight: 600, color: '#40493D',
                  }}>{skill}</span>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 20, fontSize: '0.8125rem' }}>
                  <span style={{ fontWeight: 700, color: '#0F631B' }}>{job.payRate}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#707A6C' }}>
                    <Users size={14} /> {job.applicants} applicant{job.applicants !== 1 ? 's' : ''}
                  </span>
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 700, color: '#0F631B' }}>
                  <Eye size={14} /> Review <ChevronRight size={14} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
