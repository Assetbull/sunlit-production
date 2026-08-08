'use client';

import { useState } from 'react';
import {
  User,
  MapPin,
  Building2,
  Zap,
  Star,
  Shield,
  Camera,
  CheckCircle2,
  TrendingUp,
  Plus,
} from 'lucide-react';
import { getSession } from '@/shared/session/sessionManager';
import styles from './page.module.css';

const PROPERTIES = [
  { id: 'p1', name: 'Lekki Villa', type: '4 Bed Duplex', location: 'Lekki Phase 1, Lagos', size: '5kW', status: 'active' },
  { id: 'p2', name: 'Victoria Island Office', type: 'Commercial', location: 'Victoria Island, Lagos', size: '25kW', status: 'completed' },
  { id: 'p3', name: 'Ikeja Home', type: '3 Bed Bungalow', location: 'GRA Ikeja, Lagos', size: '3.5kW', status: 'pending' },
];

export default function POProfilePage() {
  const session = getSession();
  const [name, setName] = useState(session?.name || 'Bayo Adeyemi');
  const [phone, setPhone] = useState('+234 801 234 5678');
  const [location, setLocation] = useState('Lagos, Nigeria');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.tagBadge}>
          <User size={11} strokeWidth={2.5} />
          <span>My Profile</span>
        </div>
        <h1 className={styles.title}>
          Account &amp; <span className={styles.titleAccent}>Portfolio</span>
        </h1>
        <p className={styles.subtitle}>Your identity, property portfolio, and platform reputation.</p>
      </header>

      <div className={styles.layout}>
        {/* LEFT: Identity Card */}
        <div className={styles.leftCol}>
          {/* Avatar Card */}
          <div className={styles.card}>
            <div className={styles.avatarSection}>
              <div className={styles.avatarWrap}>
                <div className={styles.avatar}>
                  {name?.[0]?.toUpperCase() ?? 'PO'}
                </div>
                <button className={styles.avatarEdit} aria-label="Change photo">
                  <Camera size={14} />
                </button>
              </div>
              <div>
                <h2 className={styles.profileName}>{name}</h2>
                <p className={styles.profileRole}>Project Owner</p>
                <div className={styles.verifiedBadge}>
                  <Shield size={11} /> KYC Verified
                </div>
              </div>
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statVal}>3</span>
                <span className={styles.statLabel}>Projects</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statVal}>87</span>
                <span className={styles.statLabel}>SunlitScore™</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statVal}>100%</span>
                <span className={styles.statLabel}>Pay Rate</span>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Profile Details</h3>
            <div className={styles.form}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Full Name</label>
                <div className={styles.inputWrap}>
                  <User size={16} className={styles.inputIcon} />
                  <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Phone Number</label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon} style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F631B' }}>NG</span>
                  <input className={styles.input} value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Location</label>
                <div className={styles.inputWrap}>
                  <MapPin size={16} className={styles.inputIcon} />
                  <input className={styles.input} value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
              </div>
              <button className={styles.saveBtn} onClick={handleSave}>
                {saved ? <><CheckCircle2 size={16} /> Saved</> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Property Portfolio */}
        <div className={styles.rightCol}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <Building2 size={16} /> Property Portfolio
              </h3>
              <button className={styles.addBtn}>
                <Plus size={14} /> Add Property
              </button>
            </div>

            <div className={styles.propertyList}>
              {PROPERTIES.map((p) => (
                <div key={p.id} className={styles.propertyRow}>
                  <div className={styles.propertyIcon}>
                    <Zap size={18} />
                  </div>
                  <div className={styles.propertyBody}>
                    <div className={styles.propertyTop}>
                      <span className={styles.propertyName}>{p.name}</span>
                      <span
                        className={styles.propertyStatus}
                        style={{
                          background: p.status === 'active' ? 'rgba(15,99,27,0.08)' : p.status === 'completed' ? 'rgba(52,95,58,0.08)' : 'rgba(184,134,11,0.08)',
                          color: p.status === 'active' ? '#0F631B' : p.status === 'completed' ? '#345F3A' : '#B8860B',
                        }}
                      >
                        {p.status}
                      </span>
                    </div>
                    <div className={styles.propertyMeta}>
                      <span><MapPin size={11} /> {p.location}</span>
                      <span><Zap size={11} /> {p.size}</span>
                      <span>{p.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Summary */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}><TrendingUp size={16} /> Energy Impact</h3>
            <div className={styles.impactGrid}>
              <div className={styles.impactItem}>
                <span className={styles.impactVal}>33.5 kW</span>
                <span className={styles.impactLabel}>Total Solar Capacity</span>
              </div>
              <div className={styles.impactItem}>
                <span className={styles.impactVal}>~₦2.1M</span>
                <span className={styles.impactLabel}>Annual Savings Est.</span>
              </div>
              <div className={styles.impactItem}>
                <span className={styles.impactVal}>14.2t</span>
                <span className={styles.impactLabel}>CO₂ Avoided/yr</span>
              </div>
              <div className={styles.impactItem}>
                <span className={styles.impactVal}>2</span>
                <span className={styles.impactLabel}>Installations Complete</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
