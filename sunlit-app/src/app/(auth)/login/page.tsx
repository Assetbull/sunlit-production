'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, Phone, ShieldCheck, RefreshCw } from 'lucide-react';

type AuthMethod = 'email' | 'phone';
type AuthState = 'input' | 'otp' | 'success';

export default function LoginPage() {
  const router = useRouter();
  const [method, setMethod] = useState<AuthMethod>('email');
  const [state, setState] = useState<AuthState>('input');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle Enter OTP digit
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    
    // Auto-advance
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (method === 'email' && !identifier.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (method === 'phone' && identifier.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    // Simulate network request
    await new Promise(res => setTimeout(res, 800));
    setIsLoading(false);
    setState('otp');
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    // Simulate network verification
    await new Promise(res => setTimeout(res, 800));
    
    if (code === '000000') {
      setIsLoading(false);
      setError('Invalid OTP. For testing, use 123456');
      return;
    }
    
    // Success scenario
    setState('success');
    
    // Create Session Data
    const sessionData = {
      user_id: 'mock-uuid',
      role: localStorage.getItem('sunlit_onboarding_role') || 'project_owner',
      provider: 'otp',
      timestamp: Date.now()
    };

    // Persistence Layer (localStorage for client + Cookie for Middleware)
    const sessionString = JSON.stringify(sessionData);
    localStorage.setItem('sunlit_session', sessionString);
    document.cookie = `sunlit_session=${encodeURIComponent(sessionString)}; path=/; max-age=86400; SameSite=Lax`;

    setTimeout(() => {
      // Determine what role they are to route to correct dashboard
      const role = localStorage.getItem('sunlit_onboarding_role') || 'project_owner';
      if (role === 'installer') router.push('/dashboard/installer');
      else router.push('/dashboard/project-owner');
    }, 1000);
  };

  const mockSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const sessionData = {
        user_id: 'mock-uuid',
        role: localStorage.getItem('sunlit_onboarding_role') || 'project_owner',
        provider,
        timestamp: Date.now()
      };
      
      const sessionString = JSON.stringify(sessionData);
      localStorage.setItem('sunlit_session', sessionString);
      document.cookie = `sunlit_session=${encodeURIComponent(sessionString)}; path=/; max-age=86400; SameSite=Lax`;
      
      const role = localStorage.getItem('sunlit_onboarding_role') || 'project_owner';
      if (role === 'installer') router.push('/dashboard/installer');
      else router.push('/dashboard/project-owner');
    }, 1500);
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-lg border border-slate-100" style={{ boxShadow: 'var(--shadow-lg)' }}>
      {state === 'input' && (
        <div className="animate-in">
          <div className="flex justify-center mb-6">
            <div className="p-4" style={{ background: 'var(--primary-container)', color: 'var(--on-primary-container)', borderRadius: 'var(--radius-full)' }}>
              <Lock size={28} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--on-surface)' }}>Welcome Back</h1>
          <p className="text-center mb-8" style={{ color: 'var(--on-surface-variant)' }}>Passwordless login to your workspace</p>

          <div className="flex gap-2 mb-6 p-1 rounded-lg" style={{ background: 'var(--surface-container-high)' }}>
            <button 
              type="button"
              onClick={() => { setMethod('email'); setIdentifier(''); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${method === 'email' ? 'bg-white shadow pointer-events-none' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Email
            </button>
            <button 
              type="button"
              onClick={() => { setMethod('phone'); setIdentifier(''); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${method === 'phone' ? 'bg-white shadow pointer-events-none' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Phone (+234)
            </button>
          </div>

          <form onSubmit={sendOtp} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="input-label">{method === 'email' ? 'Email Address' : 'Phone Number'}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  {method === 'email' ? <Mail size={18} /> : <Phone size={18} />}
                </div>
                <input 
                  type={method === 'email' ? 'email' : 'tel'} 
                  required 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="input-field pl-10"
                  placeholder={method === 'email' ? 'name@company.com' : '801 234 5678'}
                />
              </div>
              {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
            </div>

            <button type="submit" disabled={isLoading} className="btn w-full" style={{ background: 'var(--primary)', color: 'var(--on-primary)', height: '48px' }}>
              {isLoading ? <RefreshCw size={18} className="animate-spin" /> : `Continue with ${method === 'email' ? 'Email' : 'Phone'}`}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-slate-500">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => mockSocialLogin('google')} className="btn btn-ghost" style={{ border: '1px solid var(--outline)' }}>
              Google
            </button>
            <button type="button" onClick={() => mockSocialLogin('apple')} className="btn btn-ghost" style={{ border: '1px solid var(--outline)' }}>
              Apple
            </button>
          </div>

          <p className="text-center text-sm mt-8" style={{ color: 'var(--on-surface-variant)' }}>
            Don&apos;t have an account? <Link href="/register" className="font-semibold" style={{ color: 'var(--primary)' }}>Register</Link>
          </p>
        </div>
      )}

      {state === 'otp' && (
        <div className="animate-in animate-slide">
          <div className="flex justify-center mb-6">
            <div className="p-4" style={{ background: 'var(--primary-container)', color: 'var(--on-primary-container)', borderRadius: 'var(--radius-full)' }}>
              <ShieldCheck size={28} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--on-surface)' }}>Enter Verification Code</h1>
          <p className="text-center mb-8" style={{ color: 'var(--on-surface-variant)' }}>
            We sent a 6-digit code to <br/><span className="font-semibold text-slate-900">{identifier}</span>
          </p>

          <form onSubmit={verifyOtp} className="space-y-8">
            <div className="flex justify-between gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-12 h-14 text-center text-xl font-bold border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  style={{ borderColor: 'var(--outline)' }}
                />
              ))}
            </div>
            
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}

            <button type="submit" disabled={isLoading} className="btn w-full" style={{ background: 'var(--primary)', color: 'var(--on-primary)', height: '48px' }}>
              {isLoading ? <RefreshCw size={18} className="animate-spin" /> : 'Verify & Login'}
            </button>
          </form>

          <div className="text-center mt-6">
            <button onClick={() => setState('input')} className="text-sm font-medium hover:underline" style={{ color: 'var(--primary)' }}>Use a different {method}</button>
          </div>
        </div>
      )}

      {state === 'success' && (
        <div className="animate-in flex flex-col items-center justify-center py-8">
          <div className="w-20 h-20 mb-6 rounded-full flex items-center justify-center animate-pulse" style={{ background: 'var(--primary-container)', color: 'var(--on-primary-container)' }}>
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Verified!</h2>
          <p className="text-slate-500">Redirecting to your dashboard...</p>
        </div>
      )}
    </div>
  );
}
