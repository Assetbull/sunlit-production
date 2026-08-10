'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { dashboardPathForRole } from '@/shared/auth/sunlit-roles';
import type { SunlitRole } from '@/shared/auth/sunlit-roles';

// ─── Data ─────────────────────────────────────────────────────────────────
const ROLES: { value: SunlitRole; label: string }[] = [
  { value: 'project_owner',   label: 'Project Owner' },
  { value: 'installer',       label: 'Installer' },
  { value: 'epc_contractor',  label: 'EPC Contractor' },
  { value: 'crew_member',     label: 'Crew Member' },
];

// ─── Shared label + field ──────────────────────────────────────────────────
function Field({
  label, id, children,
}: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <label
        htmlFor={id}
        style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#40493d', paddingLeft: '0.25rem' }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Page inner ────────────────────────────────────────────────────────────
function RegisterPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');

  const [fullName,        setFullName]        = useState('');
  const [email,           setEmail]           = useState('');
  const [phone,           setPhone]           = useState('');
  const [role,            setRole]            = useState<SunlitRole>('project_owner');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw,          setShowPw]          = useState(false);
  const [showCPw,         setShowCPw]         = useState(false);
  const [agreed,          setAgreed]          = useState(false);
  const [isLoading,       setIsLoading]       = useState(false);
  const [error,           setError]           = useState('');

  useEffect(() => {
    if (roleParam === 'installer') setRole('installer');
    else if (roleParam === 'epc' || roleParam === 'epc_contractor') setRole('epc_contractor');
    else if (roleParam === 'crew' || roleParam === 'crew_member') setRole('crew_member');
    else if (roleParam === 'consumer' || roleParam === 'project_owner') setRole('project_owner');
  }, [roleParam]);

  const canSubmit = fullName && email && password && confirmPassword && agreed && !isLoading;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (!agreed) { setError('Please agree to the Terms of Service.'); return; }
    setIsLoading(true);
    setError('');
    try {
      const result = await authService.register({ fullName, email, phone, role, password });
      if (result.ok && result.session) {
        router.push('/register/success');
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'apple') => {
    setIsLoading(true);
    setError('');
    try {
      const result = await authService.login(`oauth:${provider}`, `oauth:${provider}`);
      if (result.ok && result.session) {
        router.push(dashboardPathForRole(result.session.role));
      } else {
        setError(result.error || `${provider} sign-up failed.`);
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#e2e2e2', border: 'none',
    borderRadius: '0.75rem', padding: '0.75rem 1rem',
    fontSize: '0.9375rem', color: '#1a1c1c', outline: 'none',
    fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
    transition: 'box-shadow 0.2s',
  };

  const pwWrap: React.CSSProperties = { position: 'relative' };
  const eyeBtn: React.CSSProperties = {
    position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', color: '#707a6c',
    display: 'flex', alignItems: 'center', padding: 0,
  };

  return (
    <div style={{ minHeight: '100dvh', background: '#f9f9f8', position: 'relative', fontFamily: "'Inter', sans-serif" }}>

      {/* Ambient blobs */}
      <div className="auth-blob-tr" style={{
        position: 'fixed', top: '-6rem', right: '-6rem',
        width: '24rem', height: '24rem', borderRadius: '50%',
        filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0,
      }} />
      <div className="auth-blob-bl" style={{
        position: 'fixed', bottom: '-6rem', left: '-6rem',
        width: '22rem', height: '22rem', borderRadius: '50%',
        filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0,
      }} />

      {/* TopAppBar — stitch_register.html */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 1.5rem', height: '4rem', width: '100%',
        position: 'fixed', top: 0, zIndex: 50,
        background: 'rgba(249,249,248,0.85)', backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/login" style={{ color: '#0f631b', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: '1.5rem' }}>arrow_back</span>
          </Link>
          <span style={{ fontSize: '1.375rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#0f631b', fontFamily: 'Manrope, sans-serif' }}>SOLAR</span>
        </div>
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {['Market', 'Impact', 'Wallet'].map(item => (
            <span key={item} style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5c5f5e', cursor: 'pointer' }}>{item}</span>
          ))}
        </nav>
      </header>

      {/* Main — stitch_register.html max-w-2xl centered */}
      <main style={{
        minHeight: '100dvh', paddingTop: '6rem', paddingBottom: '8rem',
        paddingLeft: '1.5rem', paddingRight: '1.5rem',
        maxWidth: '40rem', margin: '0 auto',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        position: 'relative', zIndex: 10,
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem', textAlign: 'left' }}>
          <h1 style={{
            fontFamily: 'Manrope, sans-serif', fontSize: 'clamp(2rem, 6vw, 3rem)',
            fontWeight: 800, letterSpacing: '-0.03em', color: '#1a1c1c',
            lineHeight: 1.1, margin: '0 0 0.75rem',
          }}>
            Create Your Account
          </h1>
          <p style={{ color: '#605441', fontSize: '0.9375rem', maxWidth: '26rem', margin: 0 }}>
            Join the leading ecosystem for renewable energy professionals and property owners.
          </p>
        </div>

        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1rem', borderRadius: '0.75rem',
            background: 'rgba(186,26,26,0.06)', color: '#ba1a1a',
            fontSize: '0.875rem', fontWeight: 500, marginBottom: '1.5rem',
          }}>
            <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form id="register-form" onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Basic Info — stitch_register.html bg-surface-container-lowest p-8 rounded-3xl */}
          <section style={{
            background: '#ffffff', padding: '2rem', borderRadius: '1.5rem',
            boxShadow: '0 8px 30px rgba(15,99,27,0.03)',
            display: 'flex', flexDirection: 'column', gap: '1.25rem',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <Field label="Full Name" id="fullName">
                <input id="fullName" type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                  placeholder="Bayo Adewale" style={inputStyle} autoComplete="name" required />
              </Field>
              <Field label="Email Address" id="email">
                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="bayo@sunlit.africa" style={inputStyle} autoComplete="email" required />
              </Field>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <Field label="Phone Number" id="phone">
                <input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="+234 800 000 0000" style={inputStyle} autoComplete="tel" />
              </Field>
              <Field label="I am a..." id="role">
                <div style={{ position: 'relative' }}>
                  <select
                    id="role"
                    value={role}
                    onChange={e => setRole(e.target.value as SunlitRole)}
                    style={{ ...inputStyle, appearance: 'none', paddingRight: '2.5rem' }}
                  >
                    {ROLES.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                  <span style={{
                    position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                    fontFamily: 'Material Symbols Outlined', fontSize: '1.25rem', color: '#707a6c', pointerEvents: 'none',
                  }}>expand_more</span>
                </div>
              </Field>
            </div>
          </section>

          {/* Password — stitch_register.html bg-surface-container-low p-8 rounded-3xl */}
          <section style={{
            background: '#f3f4f3', padding: '2rem', borderRadius: '1.5rem',
            display: 'flex', flexDirection: 'column', gap: '1.25rem',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <Field label="Password" id="password">
                <div style={pwWrap}>
                  <input id="password" type={showPw ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" style={{ ...inputStyle, paddingRight: '3rem' }}
                    autoComplete="new-password" minLength={8} required />
                  <button type="button" style={eyeBtn} onClick={() => setShowPw(!showPw)}>
                    <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: '1.1rem' }}>{showPw ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </Field>
              <Field label="Confirm Password" id="confirmPassword">
                <div style={pwWrap}>
                  <input id="confirmPassword" type={showCPw ? 'text' : 'password'} value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••" style={{ ...inputStyle, paddingRight: '3rem' }}
                    autoComplete="new-password" required />
                  <button type="button" style={eyeBtn} onClick={() => setShowCPw(!showCPw)}>
                    <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: '1.1rem' }}>{showCPw ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p style={{ fontSize: '0.75rem', color: '#ba1a1a', margin: '0.25rem 0 0 0.25rem' }}>Passwords do not match</p>
                )}
              </Field>
            </div>

            {/* Terms */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', paddingLeft: '0.25rem' }}>
              <input
                type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#0f631b', marginTop: 2, flexShrink: 0 }}
              />
              <p style={{ fontSize: '0.8125rem', color: '#605441', margin: 0, lineHeight: 1.5 }}>
                I agree to the{' '}
                <Link href="/terms" style={{ color: '#0f631b', fontWeight: 600 }}>Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" style={{ color: '#0f631b', fontWeight: 600 }}>Privacy Policy</Link>.
              </p>
            </label>
          </section>

          {/* OAuth — stitch_register.html */}
          <div style={{ paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ height: 1, flex: 1, background: 'rgba(191,202,186,0.4)' }} />
              <span style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#707a6c' }}>Or continue with</span>
              <div style={{ height: 1, flex: 1, background: 'rgba(191,202,186,0.4)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {(['google', 'apple'] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleOAuth(p)}
                  disabled={isLoading}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                    background: '#e2e2e2', padding: '1rem', borderRadius: '1rem',
                    border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9375rem',
                    transition: 'background 0.15s, transform 0.15s',
                  }}
                  onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
                  onMouseUp={e => (e.currentTarget.style.transform = '')}
                >
                  <img
                    src={p === 'google'
                      ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiHKwGDKmpp36aw1bRckBPU5Z9L7ipzX7Fqii9XpDuavWPMu2E1-1N30UiPN9iOUbOZHahnIRlsvRYHH8nfOfXAzJEOLjfiDhxw-akvVXGWNBcNSDRUcnWraolP1M-zYTUgtUgHi2euf4Rs5VpbBpD8Ryula4GXg7IUw6HDoyAopV99kyErt-df93tXn2bXcOTCbHv62jnS0nL4rk3DT_MXr-yi0VHENI7hSiyhwZqDea7cunA1yuvRvCPFcR0ZcJVMowJ5TFL'
                      : 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9_ePHrtYGiERVsT0iv8Rt4_PDCE5U5wLT7IQd86CZ3eDV5dqUS8Uxc2NGb93owv2Z73UBBJV7L4Ds997g1JkPxA0Hr3yUEs53tTCVSetQLlKVwgndw6R9Qn3yi_IWSoG1KF7rqahT9U-_ZuWwl5H3Z4T8_5vuCztMKqe3Kmv9Dje65kYwI8U8whgvLnZWZNaRU3xXuWZ03Lhfc3cPOeDpIaMRYtCSCyM7r2oCZe80CSk8lzoxXfv0lZdMKZvS9A2MWKJaVQzd'
                    }
                    alt={p === 'google' ? 'Google' : 'Apple'}
                    style={{ width: 20, height: 20, objectFit: 'contain' }}
                  />
                  <span>{p === 'google' ? 'Google' : 'Apple'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Login link */}
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <p style={{ color: '#40493d', fontSize: '0.9375rem' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#0f631b', fontWeight: 700, textDecoration: 'none' }}>Login</Link>
            </p>
          </div>
        </form>
      </main>

      {/* Sticky CTA — stitch_register.html */}
      <div className="auth-sticky-footer" style={{
        position: 'fixed', bottom: 0, left: 0, width: '100%',
        padding: '1rem 1.5rem', display: 'flex', justifyContent: 'center', zIndex: 40,
      }}>
        <div style={{ width: '100%', maxWidth: '40rem' }}>
          <button
            type="submit"
            form="register-form"
            disabled={!canSubmit}
            className="auth-cta-gradient"
            style={{
              width: '100%', padding: '1.125rem', borderRadius: '1.5rem',
              color: '#ffffff', fontWeight: 700, fontSize: '1.0625rem',
              border: 'none', cursor: canSubmit ? 'pointer' : 'not-allowed',
              opacity: canSubmit ? 1 : 0.55,
              transition: 'transform 0.15s, opacity 0.15s',
              fontFamily: 'Inter, sans-serif',
            }}
            onMouseDown={e => canSubmit && (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={e => (e.currentTarget.style.transform = '')}
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#f9f9f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#0f631b', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: 12 }}>
          Initializing Registration Flow...
        </div>
      </div>
    }>
      <RegisterPageInner />
    </Suspense>
  );
}
