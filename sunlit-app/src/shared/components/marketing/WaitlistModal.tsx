'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { submitWaitlist } from '@/lib/waitlist';

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'FCT - Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
  'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
  'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

const INTERESTS = [
  { value: 'residential_solar', label: 'Residential Solar' },
  { value: 'commercial_solar', label: 'Commercial Solar' },
  { value: 'installer', label: 'Installer / EPC Contractor' },
  { value: 'supplier', label: 'Supplier' },
  { value: 'investor', label: 'Investor' },
  { value: 'business', label: 'Business Owner' },
];

interface FormState {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  state: string;
  city: string;
  interest: string;
  message: string;
  agreed_to_updates: boolean;
}

interface Errors {
  [key: string]: string;
}

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [form, setForm] = useState<FormState>({
    first_name: '', last_name: '', email: '', phone: '',
    state: '', city: '', interest: '', message: '', agreed_to_updates: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => firstInputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Keyboard close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const validate = useCallback((): boolean => {
    const e: Errors = {};
    if (!form.first_name.trim()) e.first_name = 'First name is required';
    if (!form.last_name.trim()) e.last_name = 'Last name is required';
    if (!form.email.trim()) {
      e.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Please enter a valid email address';
    }
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.state) e.state = 'Please select your state';
    if (!form.interest) e.interest = 'Please select your interest';
    if (!form.agreed_to_updates) e.agreed_to_updates = 'Please agree to receive updates';
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    setErrorMessage('');

    const result = await submitWaitlist({
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
      state: form.state,
      city: form.city || undefined,
      interest: form.interest,
      message: form.message || undefined,
      agreed_to_updates: form.agreed_to_updates,
    });

    if (result.success) {
      setStatus('success');
    } else {
      setStatus('error');
      setErrorMessage(result.error ?? 'Something went wrong. Please try again.');
    }
  };

  const reset = () => {
    setForm({ first_name: '', last_name: '', email: '', phone: '', state: '', city: '', interest: '', message: '', agreed_to_updates: false });
    setErrors({});
    setStatus('idle');
    setErrorMessage('');
    onClose();
  };

  if (!isOpen) return null;

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%', padding: '0.75rem 1rem',
    background: errors[field] ? 'rgba(186, 26, 26, 0.04)' : '#eeeeeb',
    border: errors[field] ? '1px solid #ba1a1a' : '1px solid transparent',
    borderRadius: '10px', color: '#1a1c1b',
    fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem',
    outline: 'none', transition: 'all 150ms ease',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: '0.375rem',
    fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600,
    color: '#40493d', textTransform: 'uppercase', letterSpacing: '0.06em',
  };

  const errorStyle: React.CSSProperties = {
    fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#ba1a1a', marginTop: '0.25rem',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-title"
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(28, 28, 25, 0.6)', backdropFilter: 'blur(8px)' }} />

      {/* Modal */}
      <div
        ref={modalRef}
        style={{
          position: 'relative', zIndex: 1,
          background: '#f9f9f6',
          borderRadius: '20px',
          width: '100%', maxWidth: '600px', maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 32px 80px rgba(7, 54, 66, 0.2)',
          border: '1px solid rgba(187, 202, 196, 0.15)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.75rem 1.75rem 0',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        }}>
          <div>
            <h2 id="waitlist-title" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#1a1c1b', letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>
              Join the Waitlist
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#707a6c', lineHeight: 1.5 }}>
              Be first in line when Sunlit Energy launches in your area.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close waitlist modal"
            style={{
              width: '36px', height: '36px', borderRadius: '10px', border: 'none',
              background: '#eeeeeb', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#707a6c', transition: 'all 150ms ease', flexShrink: 0, marginLeft: '1rem',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#e2e3e0'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#eeeeeb'; }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem 1.75rem 1.75rem' }}>
          {/* Success */}
          {status === 'success' && (
            <div style={{
              textAlign: 'center', padding: '2rem 1rem',
              background: 'rgba(0, 194, 168, 0.06)', borderRadius: '16px',
              border: '1px solid rgba(0, 194, 168, 0.15)',
            }}>
              <CheckCircle2 size={52} color="#00490e" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.375rem', color: '#1a1c1b', marginBottom: '0.75rem' }}>
                Thank you!
              </h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem', color: '#1a1c1b', fontWeight: 600, marginBottom: '0.5rem' }}>
                You&apos;re officially on the Sunlit Energy waitlist.
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#707a6c', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                We&apos;ll notify you immediately when we launch. In the meantime you&apos;ll receive:
              </p>
              <div style={{ flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start', display: 'inline-flex' }}>
                {['Product updates', 'Early access', 'Educational resources', 'Launch announcements'].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <CheckCircle2 size={16} color="#00490e" />
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#40493d' }}>{item}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={reset}
                style={{
                  marginTop: '1.75rem', padding: '0.75rem 2rem', borderRadius: '9999px', border: 'none',
                  background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)',
                  color: '#fff', fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
            </div>
          )}

          {/* Form */}
          {status !== 'success' && (
            <form onSubmit={handleSubmit} noValidate>
              {/* Error banner */}
              {status === 'error' && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.875rem 1rem', borderRadius: '10px', marginBottom: '1.25rem',
                  background: 'rgba(186, 26, 26, 0.06)', border: '1px solid rgba(186, 26, 26, 0.15)',
                }}>
                  <AlertCircle size={18} color="#ba1a1a" style={{ flexShrink: 0 }} />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#ba1a1a' }}>{errorMessage}</span>
                </div>
              )}

              {/* Name row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label htmlFor="wl-first-name" style={labelStyle}>First Name</label>
                  <input
                    ref={firstInputRef}
                    id="wl-first-name"
                    type="text"
                    autoComplete="given-name"
                    value={form.first_name}
                    onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                    style={inputStyle('first_name')}
                    placeholder="Emeka"
                    aria-required="true"
                    aria-describedby={errors.first_name ? 'wl-first-name-error' : undefined}
                    onFocus={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 2px rgba(0, 107, 92, 0.2)'; }}
                    onBlur={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                  />
                  {errors.first_name && <p id="wl-first-name-error" style={errorStyle} role="alert">{errors.first_name}</p>}
                </div>
                <div>
                  <label htmlFor="wl-last-name" style={labelStyle}>Last Name</label>
                  <input
                    id="wl-last-name"
                    type="text"
                    autoComplete="family-name"
                    value={form.last_name}
                    onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                    style={inputStyle('last_name')}
                    placeholder="Okafor"
                    aria-required="true"
                    aria-describedby={errors.last_name ? 'wl-last-name-error' : undefined}
                    onFocus={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 2px rgba(0, 107, 92, 0.2)'; }}
                    onBlur={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                  />
                  {errors.last_name && <p id="wl-last-name-error" style={errorStyle} role="alert">{errors.last_name}</p>}
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="wl-email" style={labelStyle}>Email Address</label>
                <input
                  id="wl-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={inputStyle('email')}
                  placeholder="emeka@example.com"
                  aria-required="true"
                  aria-describedby={errors.email ? 'wl-email-error' : undefined}
                  onFocus={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 2px rgba(0, 107, 92, 0.2)'; }}
                  onBlur={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                />
                {errors.email && <p id="wl-email-error" style={errorStyle} role="alert">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="wl-phone" style={labelStyle}>Phone Number</label>
                <input
                  id="wl-phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  style={inputStyle('phone')}
                  placeholder="+234 801 234 5678"
                  aria-required="true"
                  aria-describedby={errors.phone ? 'wl-phone-error' : undefined}
                  onFocus={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 2px rgba(0, 107, 92, 0.2)'; }}
                  onBlur={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                />
                {errors.phone && <p id="wl-phone-error" style={errorStyle} role="alert">{errors.phone}</p>}
              </div>

              {/* State + City */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label htmlFor="wl-state" style={labelStyle}>State</label>
                  <select
                    id="wl-state"
                    value={form.state}
                    onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                    aria-required="true"
                    aria-describedby={errors.state ? 'wl-state-error' : undefined}
                    style={{
                      ...inputStyle('state'),
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M6 8L1 3h10z' fill='%23707a6c'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      paddingRight: '2.5rem',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="">Select State</option>
                    {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <p id="wl-state-error" style={errorStyle} role="alert">{errors.state}</p>}
                </div>
                <div>
                  <label htmlFor="wl-city" style={labelStyle}>City <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#707a6c' }}>(optional)</span></label>
                  <input
                    id="wl-city"
                    type="text"
                    value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    style={inputStyle('city')}
                    placeholder="Lekki"
                    onFocus={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 2px rgba(0, 107, 92, 0.2)'; }}
                    onBlur={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              {/* Interest */}
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="wl-interest" style={labelStyle}>I&apos;m Interested In</label>
                <select
                  id="wl-interest"
                  value={form.interest}
                  onChange={e => setForm(f => ({ ...f, interest: e.target.value }))}
                  aria-required="true"
                  aria-describedby={errors.interest ? 'wl-interest-error' : undefined}
                  style={{
                    ...inputStyle('interest'),
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M6 8L1 3h10z' fill='%23707a6c'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    paddingRight: '2.5rem',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Select an option</option>
                  {INTERESTS.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                </select>
                {errors.interest && <p id="wl-interest-error" style={errorStyle} role="alert">{errors.interest}</p>}
              </div>

              {/* Message */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="wl-message" style={labelStyle}>Message <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#707a6c' }}>(optional)</span></label>
                <textarea
                  id="wl-message"
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  style={{ ...inputStyle('message'), resize: 'vertical', minHeight: '80px' }}
                  placeholder="Tell us about your energy needs..."
                  onFocus={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 2px rgba(0, 107, 92, 0.2)'; }}
                  onBlur={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                />
              </div>

              {/* Checkbox */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="wl-agree"
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer',
                  }}
                >
                  <input
                    id="wl-agree"
                    type="checkbox"
                    checked={form.agreed_to_updates}
                    onChange={e => setForm(f => ({ ...f, agreed_to_updates: e.target.checked }))}
                    aria-required="true"
                    aria-describedby={errors.agreed_to_updates ? 'wl-agree-error' : undefined}
                    style={{
                      width: '18px', height: '18px', borderRadius: '5px',
                      accentColor: '#00490e', cursor: 'pointer', flexShrink: 0, marginTop: '2px',
                    }}
                  />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#40493d', lineHeight: 1.5 }}>
                    I agree to receive product updates, launch announcements, and educational resources from Sunlit Energy.
                  </span>
                </label>
                {errors.agreed_to_updates && <p id="wl-agree-error" style={{ ...errorStyle, marginLeft: '2.125rem' }} role="alert">{errors.agreed_to_updates}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                id="waitlist-submit-btn"
                style={{
                  width: '100%', padding: '1rem', borderRadius: '12px', border: 'none',
                  background: status === 'submitting' ? '#9db8b3' : 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)',
                  color: '#fff', fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 600,
                  cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  transition: 'all 200ms ease',
                  boxShadow: status === 'submitting' ? 'none' : '0 6px 20px rgba(0, 107, 92, 0.3)',
                }}
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    Joining Waitlist...
                  </>
                ) : (
                  'Join Waitlist'
                )}
              </button>

              <p style={{ textAlign: 'center', marginTop: '0.875rem', fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#707a6c' }}>
                No spam, no password required. Unsubscribe at any time.
              </p>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
