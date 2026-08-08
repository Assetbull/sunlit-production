'use client';

import { Settings, User, Shield, CreditCard,
  CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';

/**
 * Installer Settings — Profile, KYC, Bank Details
 *
 * GEMINI.md: KYC verification required for project payouts.
 */
export default function InstallerSettingsPage() {
  const kycStatus = 'verified'; // mock

  return (
    <div style={{ maxWidth: 900 }}>
      <header style={{ marginBottom: 28 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 14px', borderRadius: 999,
          background: 'rgba(15,99,27,0.06)', fontSize: '0.6875rem',
          fontWeight: 700, color: '#0F631B', textTransform: 'uppercase',
          letterSpacing: '0.1em', marginBottom: 16,
        }}>
          <Settings size={12} /> settings
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1A1C1C', letterSpacing: '-0.02em', margin: '0 0 8px' }}>
          Settings
        </h1>
        <p style={{ fontSize: '0.9375rem', color: '#40493D', margin: 0 }}>
          Manage your profile, verification, and payment details.
        </p>
      </header>

      {/* Settings Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Profile */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'rgba(15,99,27,0.06)', color: '#0F631B',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <User size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1A1C1C', margin: 0 }}>Profile</h2>
              <p style={{ fontSize: '0.75rem', color: '#707A6C', margin: '2px 0 0' }}>Manage your installer profile</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { label: 'Company Name', value: 'SolarTech Pro Ltd.' },
              { label: 'Email', value: 'installer@sunlit.ng' },
              { label: 'Phone', value: '+234 801 234 5678' },
              { label: 'Location', value: 'Lagos, Nigeria' },
            ].map((field) => (
              <div key={field.label} style={{ padding: '14px 16px', background: '#F9F9F8', borderRadius: 12 }}>
                <p style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#707A6C', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                  {field.label}
                </p>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A1C1C', margin: '4px 0 0' }}>
                  {field.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* KYC */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: kycStatus === 'verified' ? 'rgba(15,99,27,0.06)' : 'rgba(245,166,35,0.08)',
              color: kycStatus === 'verified' ? '#0F631B' : '#F5A623',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1A1C1C', margin: 0 }}>KYC Verification</h2>
              <p style={{ fontSize: '0.75rem', color: '#707A6C', margin: '2px 0 0' }}>Required for project payouts</p>
            </div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 8,
              background: kycStatus === 'verified' ? 'rgba(15,99,27,0.06)' : 'rgba(245,166,35,0.08)',
              color: kycStatus === 'verified' ? '#0F631B' : '#F5A623',
              fontSize: '0.6875rem', fontWeight: 700,
            }}>
              {kycStatus === 'verified' ? <><CheckCircle2 size={12} /> Verified</> : <><AlertCircle size={12} /> Pending</>}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {['Identity Document', 'Business Registration', 'Tax Certificate'].map((doc) => (
              <div key={doc} style={{
                padding: '14px 16px', background: '#F9F9F8', borderRadius: 12,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <CheckCircle2 size={16} style={{ color: '#0F631B' }} />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1A1C1C' }}>{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bank Details */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'rgba(105,92,73,0.08)', color: '#695C49',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CreditCard size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1A1C1C', margin: 0 }}>Bank Details</h2>
              <p style={{ fontSize: '0.75rem', color: '#707A6C', margin: '2px 0 0' }}>For Paystack project payouts</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ padding: '14px 16px', background: '#F9F9F8', borderRadius: 12 }}>
              <p style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#707A6C', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Bank Name</p>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A1C1C', margin: '4px 0 0' }}>First Bank of Nigeria</p>
            </div>
            <div style={{ padding: '14px 16px', background: '#F9F9F8', borderRadius: 12 }}>
              <p style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#707A6C', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Account Number</p>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A1C1C', margin: '4px 0 0' }}>●●●●●●7890</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
