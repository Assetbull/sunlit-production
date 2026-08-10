'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { postLoginRoute } from '@/shared/auth/client-session';

// ── Floating-label input ────────────────────────────────────────────────────
function FloatInput({
  id, label, type = 'text', value, onChange, autoComplete, required,
  rightSlot, onKeyDown,
}: {
  id: string; label: string; type?: string; value: string;
  onChange: (v: string) => void; autoComplete?: string;
  required?: boolean; rightSlot?: React.ReactNode;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="auth-input-float">
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder=" "
        autoComplete={autoComplete}
        required={required}
        style={{ paddingRight: rightSlot ? '3rem' : undefined }}
      />
      <label htmlFor={id}>{label}</label>
      {rightSlot && (
        <div style={{
          position: 'absolute', right: '0.875rem', top: '50%',
          transform: 'translateY(-50%)',
        }}>
          {rightSlot}
        </div>
      )}
    </div>
  );
}

// ── Page inner ────────────────────────────────────────────────────────────
function LoginPageInner() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || isLoading) return;
    setIsLoading(true);
    setError('');
    try {
      const result = await authService.login(email, password);
      if (result.ok && result.session) {
        const target = postLoginRoute(result.session, redirectTo);
        // Direct browser location synchronization ensures immediate cookie & session sync across all desktop and mobile browsers
        window.location.href = target;
      } else {
        setError(result.error || 'Authentication failed. Please check your credentials.');
        setIsLoading(false);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'apple') => {
    if (isLoading) return;
    setIsLoading(true);
    setError('');
    try {
      const result = await authService.login(`oauth:${provider}`, `oauth:${provider}`);
      if (result.ok && result.session) {
        const target = postLoginRoute(result.session, redirectTo);
        window.location.href = target;
      } else {
        setError(result.error || `${provider} sign-in failed.`);
        setIsLoading(false);
      }
    } catch {
      setError('An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100dvh', background: '#f9f9f8', position: 'relative', fontFamily: "'Inter', sans-serif" }}>

      {/* Ambient blobs */}
      <div className="auth-blob-tr" style={{
        position: 'fixed', top: '-6rem', right: '-6rem',
        width: '20rem', height: '20rem', borderRadius: '50%',
        filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0,
      }} />
      <div className="auth-blob-bl" style={{
        position: 'fixed', bottom: '-6rem', left: '-6rem',
        width: '18rem', height: '18rem', borderRadius: '50%',
        filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Background solar panel — stitch_login.html */}
      <div style={{
        position: 'fixed', top: 0, right: 0, width: '33%', height: '100%',
        overflow: 'hidden', opacity: 0.18, pointerEvents: 'none', zIndex: 0,
        display: 'none',
      }} className="md:block">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg2Wg9EC4utjoNTorpNwXu9xVueJKkIYQ8vAWudSM42In-RAvvfgF-Kx0LQxJLtcKE43mpL8C0CccLFTIBD-p2SbjdWAouEQ7XDVYP7XHyyFHm8i50ocJ7oM-esQqSndTNdT2EGVsZHxnJJWmdhBGSC4mBjjyNfp2EPARe85W-ex6vAUOoiTwbJhYIVVukl9EdST7erlwAUwrvVCP2-QrxoOla-l3iADjma_eAEU6m66IPB72A3vlUEXsSRgWtNT-8GbW8SVmn"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* TopAppBar — stitch_login.html */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 1.5rem', height: '4rem', width: '100%',
        position: 'fixed', top: 0, zIndex: 50,
        background: 'rgba(249,249,248,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem', color: '#0f631b', fontFamily: 'Material Symbols Outlined', fontWeight: 400 }}>solar_power</span>
          <span style={{ fontSize: '1.375rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#0f631b', fontFamily: 'Manrope, sans-serif' }}>SOLAR</span>
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5c5f5e', fontSize: '1.5rem', fontFamily: 'Material Symbols Outlined' }}>
          help_outline
        </button>
      </header>

      {/* Main content — stitch_login.html max-w-md centered */}
      <main style={{
        width: '100%', maxWidth: '28rem', margin: '0 auto',
        paddingTop: '6rem', paddingBottom: '8rem',
        paddingLeft: '1.5rem', paddingRight: '1.5rem',
        position: 'relative', zIndex: 10,
      }}>

        {/* Hero section */}
        <div style={{ position: 'relative', marginBottom: '3rem' }}>
          <div style={{
            position: 'absolute', top: '-3rem', right: '-1rem',
            width: '10rem', height: '10rem', borderRadius: '50%',
            background: 'rgba(163,246,156,0.2)', filter: 'blur(48px)',
          }} />
          <div style={{
            position: 'absolute', bottom: '-2rem', left: '-2rem',
            width: '8rem', height: '8rem', borderRadius: '50%',
            background: 'rgba(198,233,190,0.3)', filter: 'blur(32px)',
          }} />
          <h1 style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '2.5rem', fontWeight: 800,
            letterSpacing: '-0.03em', color: '#1a1c1c', lineHeight: 1.1,
            position: 'relative', zIndex: 1, margin: 0,
          }}>
            Welcome Back
          </h1>
          <p style={{ color: '#40493d', marginTop: '0.5rem', fontWeight: 500, letterSpacing: '-0.01em', fontSize: '0.9375rem' }}>
            Manage your solar portfolio and track your energy impact.
          </p>
        </div>

        {/* Login card — stitch_login.html layered card */}
        <div style={{
          background: '#ffffff', borderRadius: '1.5rem', padding: '2rem',
          boxShadow: '0 32px 64px -12px rgba(15,99,27,0.08)',
          position: 'relative', overflow: 'hidden',
        }}>

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

          <form id="login-form" onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Email — floating label */}
            <FloatInput
              id="email"
              label="Email address"
              type="email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
              required
            />

            {/* Password — floating label + forgot link */}
            <div>
              <FloatInput
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
                required
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#707a6c', padding: 0, display: 'flex', alignItems: 'center' }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <span style={{ fontSize: '1.1rem', fontFamily: 'Material Symbols Outlined', userSelect: 'none' }}>
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                }
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.375rem', paddingRight: '0.25rem' }}>
                <Link href="/forgot-password" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f631b', textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Primary Login Button inside form card */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="auth-cta-gradient"
              style={{
                width: '100%', padding: '0.875rem 1rem', borderRadius: '1rem',
                color: '#ffffff', fontWeight: 700, fontSize: '1rem',
                border: 'none', cursor: (isLoading || !email || !password) ? 'not-allowed' : 'pointer',
                marginTop: '0.25rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                transition: 'transform 0.15s, opacity 0.15s',
                opacity: (isLoading || !email || !password) ? 0.6 : 1,
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseDown={e => { if (!isLoading && email && password) e.currentTarget.style.transform = 'scale(0.98)'; }}
              onMouseUp={e => (e.currentTarget.style.transform = '')}
            >
              {isLoading ? 'Signing in...' : 'Login'}
              {!isLoading && <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: '1.25rem' }}>arrow_forward</span>}
            </button>
          </form>

          {/* OAuth separator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 0' }}>
            <div style={{ height: 1, flex: 1, background: '#e2e2e2' }} />
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'rgba(64,73,61,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>OR</span>
            <div style={{ height: 1, flex: 1, background: '#e2e2e2' }} />
          </div>

          {/* OAuth buttons — stitch_login.html grid-cols-2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => handleOAuth('google')}
              disabled={isLoading}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                background: '#f2e0c8', padding: '0.75rem', borderRadius: '1rem',
                fontWeight: 600, fontSize: '0.9375rem', color: '#231a0b',
                border: 'none', cursor: 'pointer', transition: 'opacity 0.15s, transform 0.15s',
              }}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
              onMouseUp={e => (e.currentTarget.style.transform = '')}
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVcquMHpxhxFEz8zhjRJ-iaT2oFB9JQhUKN9LZ03v16Flfx31n575F660k7DRATIOsPCXEp5iY1UMJ20vfrboDyK6hP_V0q-1dHc7mjKZZEYnsrqdw8eBjxwkHoSFz5NyDYlDvyM0Je9s3pt02aia_oI1_4IGxivu0h3oMYblqMY5Qy7U10TV42wbP-0_ujL3-JpLYT5iiE90sNL5JdN_8xXI06d7yZm7TchmY8FGfmjlg5hFZg-B3hZ3esDKS6iVstA0sD6G3"
                alt="Google"
                style={{ width: 20, height: 20, objectFit: 'contain' }}
              />
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleOAuth('apple')}
              disabled={isLoading}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                background: '#1a1c1c', color: '#f9f9f8',
                padding: '0.75rem', borderRadius: '1rem',
                fontWeight: 600, fontSize: '0.9375rem',
                border: 'none', cursor: 'pointer', transition: 'opacity 0.15s, transform 0.15s',
              }}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
              onMouseUp={e => (e.currentTarget.style.transform = '')}
            >
              <span style={{ fontSize: '1.1rem', fontFamily: 'Material Symbols Outlined', fontVariationSettings: "'FILL' 1" }}>ios</span>
              <span>Apple</span>
            </button>
          </div>
        </div>

        {/* Footer link */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#40493d', fontWeight: 500, fontSize: '0.9375rem' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: '#0f631b', fontWeight: 700, textDecoration: 'none' }}>Register</Link>
          </p>
        </div>
      </main>

      {/* Sticky CTA — stitch_login.html fixed bottom */}
      <div className="auth-sticky-footer" style={{
        position: 'fixed', bottom: 0, left: 0, width: '100%',
        padding: '1rem 1.5rem', display: 'flex', justifyContent: 'center', zIndex: 40,
      }}>
        <div style={{ width: '100%', maxWidth: '28rem' }}>
          <button
            type="submit"
            form="login-form"
            onClick={() => {
              const form = document.getElementById('login-form') as HTMLFormElement;
              if (form) form.requestSubmit();
            }}
            disabled={isLoading || !email || !password}
            className="auth-cta-gradient"
            style={{
              width: '100%', padding: '1rem', borderRadius: '1rem',
              color: '#ffffff', fontWeight: 700, fontSize: '1.0625rem',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              transition: 'transform 0.15s, opacity 0.15s',
              opacity: (isLoading || !email || !password) ? 0.6 : 1,
              fontFamily: 'Inter, sans-serif',
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={e => (e.currentTarget.style.transform = '')}
          >
            {isLoading ? 'Signing in...' : 'Login'}
            {!isLoading && <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: '1.25rem' }}>arrow_forward</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#f9f9f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#0f631b', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: 12 }}>
          Establishing Secure Session...
        </div>
      </div>
    }>
      <LoginPageInner />
    </Suspense>
  );
}

