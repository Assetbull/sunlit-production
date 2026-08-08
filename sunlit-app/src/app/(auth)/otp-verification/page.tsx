'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

function OTPVerificationInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const method = searchParams.get('method') || 'email';
  const target = searchParams.get('target') || (method === 'email' ? 'your email' : 'your phone');
  const email  = searchParams.get('email') || target;

  const [otp,            setOtp]            = useState<string[]>(Array(6).fill(''));
  const [activeIndex,    setActiveIndex]    = useState(0);
  const [isLoading,      setIsLoading]      = useState(false);
  const [error,          setError]          = useState('');
  const [countdown,      setCountdown]      = useState(60);
  const [isSuccess,      setIsSuccess]      = useState(false);
  const inputRefs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  // Focus management
  useEffect(() => {
    inputRefs[activeIndex]?.current?.focus();
  }, [activeIndex]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Auto-submit when all 6 digits filled
  useEffect(() => {
    if (otp.every(d => d !== '') && !isLoading && !isSuccess) {
      handleVerify();
    }
  }, [otp]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = val;
    setOtp(next);
    if (val && index < 5) setActiveIndex(index + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) setActiveIndex(index - 1);
    if (e.key === 'ArrowLeft'  && index > 0) setActiveIndex(index - 1);
    if (e.key === 'ArrowRight' && index < 5) setActiveIndex(index + 1);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    if (!digits.length) return;
    e.preventDefault();
    const next = [...otp];
    digits.forEach((d, i) => { next[i] = d; });
    setOtp(next);
    setActiveIndex(Math.min(digits.length, 5));
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) return;
    setIsLoading(true);
    setError('');
    try {
      // In production: call authService.verifyOtp(email, code)
      // Mock: any 6 digits except 000000 passes
      await new Promise(r => setTimeout(r, 1200));
      if (code === '000000') {
        setError('Invalid code. Please try again.');
        setOtp(Array(6).fill(''));
        setActiveIndex(0);
      } else {
        setIsSuccess(true);
        setTimeout(() => router.push('/dashboard/project-owner'), 2000);
      }
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setCountdown(60);
    setOtp(Array(6).fill(''));
    setActiveIndex(0);
    setError('');
  };

  if (isSuccess) {
    return (
      <div style={{ minHeight: '100dvh', background: '#f9f9f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(15,99,27,0.1)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
            animation: 'pulse 1.5s infinite',
          }}>
            <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: '2.5rem', color: '#0f631b', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.75rem', fontWeight: 800, color: '#1a1c1c', margin: '0 0 0.5rem' }}>
            Verified!
          </h2>
          <p style={{ color: '#40493d', margin: 0 }}>Redirecting you to your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#f9f9f8', position: 'relative', fontFamily: 'Inter, sans-serif' }}>

      {/* Ambient blobs */}
      <div className="auth-blob-tr" style={{ position: 'fixed', top: '-6rem', right: '-6rem', width: '20rem', height: '20rem', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* TopAppBar */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: '1rem',
        padding: '0 1.5rem', height: '4rem', position: 'fixed', top: 0, width: '100%', zIndex: 50,
        background: 'rgba(249,249,248,0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0f631b', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: '1.5rem' }}>arrow_back</span>
        </button>
        <span style={{ fontSize: '1.375rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#0f631b', fontFamily: 'Manrope, sans-serif' }}>SOLAR</span>
      </header>

      {/* Main */}
      <main style={{
        width: '100%', maxWidth: '26rem', margin: '0 auto',
        paddingTop: '6rem', paddingBottom: '8rem',
        paddingLeft: '1.5rem', paddingRight: '1.5rem',
        position: 'relative', zIndex: 10,
      }}>
        {/* Hero */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#1a1c1c', margin: '0 0 0.625rem' }}>
            Verify Your Account
          </h1>
          <p style={{ color: '#40493d', fontSize: '0.9375rem', margin: 0 }}>
            We sent a 6-digit code to <strong>{target}</strong>
          </p>
        </div>

        {/* OTP Card */}
        <div style={{ background: '#ffffff', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 32px 64px -12px rgba(15,99,27,0.08)' }}>

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

          {/* 6-digit OTP boxes */}
          <div style={{ display: 'flex', gap: '0.625rem', justifyContent: 'center', marginBottom: '1.5rem' }} onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={inputRefs[i]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(e, i)}
                onKeyDown={e => handleKeyDown(e, i)}
                onClick={() => setActiveIndex(i)}
                className={`otp-digit${digit ? ' filled' : ''}`}
                aria-label={`OTP digit ${i + 1}`}
                disabled={isLoading}
              />
            ))}
          </div>

          {/* Resend */}
          <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            {countdown > 0 ? (
              <p style={{ color: '#40493d', fontSize: '0.875rem' }}>
                Resend code in <strong style={{ color: '#0f631b' }}>{countdown}s</strong>
              </p>
            ) : (
              <button
                onClick={handleResend}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0f631b', fontWeight: 700, fontSize: '0.9375rem' }}
              >
                Resend verification code
              </button>
            )}
          </div>
        </div>

        {/* Back to register */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link href="/register" style={{ color: '#707a6c', fontSize: '0.875rem', textDecoration: 'none' }}>
            ← Back to registration
          </Link>
        </div>
      </main>

      {/* Sticky Verify CTA */}
      <div className="auth-sticky-footer" style={{
        position: 'fixed', bottom: 0, left: 0, width: '100%',
        padding: '1rem 1.5rem', display: 'flex', justifyContent: 'center', zIndex: 40,
      }}>
        <div style={{ width: '100%', maxWidth: '26rem' }}>
          <button
            type="button"
            onClick={handleVerify}
            disabled={isLoading || otp.some(d => !d)}
            className="auth-cta-gradient"
            style={{
              width: '100%', padding: '1rem', borderRadius: '1rem',
              color: '#ffffff', fontWeight: 700, fontSize: '1.0625rem',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              opacity: (isLoading || otp.some(d => !d)) ? 0.5 : 1,
              transition: 'opacity 0.2s, transform 0.15s',
              fontFamily: 'Inter, sans-serif',
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={e => (e.currentTarget.style.transform = '')}
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
            {!isLoading && <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: '1.25rem' }}>arrow_forward</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OTPVerificationPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#f9f9f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#0f631b', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: 12 }}>
          Loading Secure Terminal...
        </div>
      </div>
    }>
      <OTPVerificationInner />
    </Suspense>
  );
}
