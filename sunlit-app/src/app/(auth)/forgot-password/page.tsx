'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

function ForgotPasswordInner() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch {
      setError('Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100dvh', background: '#f9f9f8', position: 'relative', fontFamily: "'Inter', sans-serif" }}>

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

      {/* Main content */}
      <main style={{
        width: '100%', maxWidth: '28rem', margin: '0 auto',
        paddingTop: '6rem', paddingBottom: '8rem',
        paddingLeft: '1.5rem', paddingRight: '1.5rem',
        position: 'relative', zIndex: 10,
      }}>

        {/* Hero section */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{
            fontFamily: 'Manrope, sans-serif', fontSize: '2.25rem', fontWeight: 800,
            letterSpacing: '-0.03em', color: '#1a1c1c', margin: '0 0 0.625rem',
          }}>
            Reset Password
          </h1>
          <p style={{ color: '#40493d', fontSize: '0.9375rem', margin: 0 }}>
            {success 
              ? "Check your email for reset instructions."
              : "Enter your email address and we'll send you a link to reset your password."}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#ffffff', borderRadius: '1.5rem', padding: '2rem',
          boxShadow: '0 32px 64px -12px rgba(15,99,27,0.08)'
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

          {success ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ 
                padding: '1rem', background: 'rgba(15,99,27,0.08)', borderRadius: '1rem',
                color: '#0f631b', fontSize: '0.9375rem', fontWeight: 500, lineHeight: 1.5
              }}>
                We've sent a password reset link to <strong style={{ color: '#0f631b' }}>{email}</strong>.
              </div>
              <Link href="/login" className="auth-cta-gradient" style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                padding: '1rem', borderRadius: '1rem', color: '#ffffff', fontWeight: 700, fontSize: '1.0625rem',
                textDecoration: 'none', textAlign: 'center'
              }}>
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="auth-input-float">
                <input
                  id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder=" " required
                />
                <label htmlFor="email">Email address</label>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="auth-cta-gradient"
                style={{
                  width: '100%', padding: '1rem', borderRadius: '1rem',
                  color: '#ffffff', fontWeight: 700, fontSize: '1.0625rem',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  opacity: (isLoading || !email) ? 0.6 : 1, transition: 'opacity 0.2s',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                {!isLoading && <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: '1.25rem' }}>arrow_forward</span>}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div />}>
      <ForgotPasswordInner />
    </Suspense>
  );
}
