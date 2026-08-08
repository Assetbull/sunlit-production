'use client';

import { useState } from 'react';
import {
  Star,
  Shield,
  MapPin,
  Zap,
  Users,
  Award,
  CheckCircle2,
  Camera,
  TrendingUp,
  HardHat,
  Clock,
  Plus,
  ChevronRight,
} from 'lucide-react';
import { getSession } from '@/shared/session/sessionManager';
import styles from './page.module.css';

const CERTIFICATIONS = [
  { name: 'NAFDAC Registered', issuer: 'NAFDAC Nigeria', year: '2023', valid: true },
  { name: 'SON Certified', issuer: 'Standards Organisation Nigeria', year: '2022', valid: true },
  { name: 'NIEE Licensed Electrician', issuer: 'NIEE', year: '2021', valid: true },
  { name: 'IEC 62133 Battery Standard', issuer: 'IEC', year: '2024', valid: true },
];

const PORTFOLIO = [
  { id: 'pf1', title: '25kW Commercial Install', location: 'Victoria Island, Lagos', kw: 25, type: 'Commercial', year: '2025' },
  { id: 'pf2', title: '10kW Hybrid System', location: 'Abuja', kw: 10, type: 'Residential', year: '2024' },
  { id: 'pf3', title: '5kW Rooftop — Duplex', location: 'Lekki, Lagos', kw: 5, type: 'Residential', year: '2024' },
];

const REVIEWS = [
  { id: 'r1', from: 'Ade Banjo', rating: 5, text: 'Exceptional team. Completed the 25kW install 3 days early.', date: 'Mar 2026' },
  { id: 'r2', from: 'Chinwe Obi', rating: 5, text: 'Very professional, zero mess left on site. Highly recommend.', date: 'Jan 2026' },
  { id: 'r3', from: 'Emeka Okafor', rating: 4, text: 'Solid work, a bit slow on day 2 but overall great results.', date: 'Nov 2025' },
];

export default function InstallerProfilePage() {
  const session = getSession();
  const [companyName, setCompanyName] = useState('SunPower Installations Ltd.');
  const [location, setLocation] = useState('Lagos Island, Lagos State');
  const [capacity, setCapacity] = useState('Up to 200kW');
  const [teamSize, setTeamSize] = useState('12');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const avgRating = REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length;

  return (
    <div className={styles.page}>
      {/* Hero Profile Card */}
      <div className={styles.heroCard}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatar}>SP</div>
              <button className={styles.avatarEdit}><Camera size={14} /></button>
            </div>
            <div>
              <div className={styles.verifiedBadges}>
                <span className={styles.verifiedBadge}><Shield size={11} /> Verified</span>
                <span className={styles.premiumBadge}><Award size={11} /> Premium Installer</span>
              </div>
              <h1 className={styles.companyName}>{companyName}</h1>
              <div className={styles.heroMeta}>
                <span><MapPin size={13} /> {location}</span>
                <span><Zap size={13} /> {capacity}</span>
                <span><Users size={13} /> {teamSize} team members</span>
              </div>
            </div>
          </div>

          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatVal}>{avgRating.toFixed(1)}</span>
              <div className={styles.heroStatStars}>
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={12} fill={avgRating >= s ? '#F5A623' : 'none'} stroke={avgRating >= s ? '#F5A623' : '#A0A79C'} />
                ))}
              </div>
              <span className={styles.heroStatLabel}>Rating ({REVIEWS.length} reviews)</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatVal}>28</span>
              <span className={styles.heroStatLabel}>Completed Installs</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatVal}>94%</span>
              <span className={styles.heroStatLabel}>On-time Rate</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatVal}>5yr</span>
              <span className={styles.heroStatLabel}>Warranty Offered</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Left Column */}
        <div className={styles.leftCol}>
          {/* Edit Form */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Company Details</h3>
            <div className={styles.form}>
              {[
                { label: 'Company Name', val: companyName, set: setCompanyName },
                { label: 'Location', val: location, set: setLocation },
                { label: 'Max Capacity', val: capacity, set: setCapacity },
                { label: 'Team Size', val: teamSize, set: setTeamSize },
              ].map((f) => (
                <div key={f.label} className={styles.field}>
                  <label className={styles.fieldLabel}>{f.label}</label>
                  <input className={styles.input} value={f.val} onChange={(e) => f.set(e.target.value)} />
                </div>
              ))}
              <button className={styles.saveBtn} onClick={handleSave}>
                {saved ? <><CheckCircle2 size={15} /> Saved</> : 'Update Profile'}
              </button>
            </div>
          </div>

          {/* Certifications */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}><Award size={16} /> Certifications</h3>
            <div className={styles.certList}>
              {CERTIFICATIONS.map((c) => (
                <div key={c.name} className={styles.certRow}>
                  <CheckCircle2 size={16} className={styles.certIcon} />
                  <div>
                    <span className={styles.certName}>{c.name}</span>
                    <span className={styles.certMeta}>{c.issuer} · {c.year}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className={styles.addCertBtn}><Plus size={14} /> Add Certification</button>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightCol}>
          {/* Portfolio */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}><HardHat size={16} /> Completed Installations</h3>
              <button className={styles.smallBtn}><Plus size={13} /> Add</button>
            </div>
            <div className={styles.portfolioList}>
              {PORTFOLIO.map((p) => (
                <div key={p.id} className={styles.portfolioRow}>
                  <div className={styles.portfolioIcon}>
                    <Zap size={18} />
                  </div>
                  <div className={styles.portfolioBody}>
                    <div className={styles.portfolioTop}>
                      <span className={styles.portfolioTitle}>{p.title}</span>
                      <span className={styles.portfolioKw}>{p.kw}kW</span>
                    </div>
                    <div className={styles.portfolioMeta}>
                      <span><MapPin size={11} /> {p.location}</span>
                      <span>{p.type}</span>
                      <span><Clock size={11} /> {p.year}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}><Star size={16} /> Client Reviews</h3>
            <div className={styles.reviewList}>
              {REVIEWS.map((r) => (
                <div key={r.id} className={styles.reviewRow}>
                  <div className={styles.reviewTop}>
                    <span className={styles.reviewFrom}>{r.from}</span>
                    <div className={styles.reviewStars}>
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} size={12} fill={r.rating >= s ? '#F5A623' : 'none'} stroke={r.rating >= s ? '#F5A623' : '#E8E8E7'} />
                      ))}
                    </div>
                    <span className={styles.reviewDate}>{r.date}</span>
                  </div>
                  <p className={styles.reviewText}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Performance */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}><TrendingUp size={16} /> Performance Score</h3>
            <div className={styles.perfGrid}>
              {[
                { label: 'Bid Win Rate', val: '28%' },
                { label: 'Avg Response Time', val: '4h' },
                { label: 'Project Completion', val: '100%' },
                { label: 'Dispute Rate', val: '0%' },
              ].map((m) => (
                <div key={m.label} className={styles.perfItem}>
                  <span className={styles.perfVal}>{m.val}</span>
                  <span className={styles.perfLabel}>{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
