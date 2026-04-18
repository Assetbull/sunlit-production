'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Phone, ArrowLeft, RefreshCw, UserPlus, ChevronRight, Check, Building2, HardHat, Package, Zap } from 'lucide-react';
import { bootstrapMockSession } from '@/shared/auth/client-session';
import {
  dashboardPathForRole,
  isSunlitRole,
  type SunlitRole,
} from '@/shared/auth/sunlit-roles';

type AuthMethod = 'email' | 'phone';
type AuthState = 'input' | 'otp' | 'success';

const ROLE_OPTIONS: { id: SunlitRole; label: string; hint: string; icon: ReactNode }[] = [
  {
    id: 'project_owner',
    label: 'Project owner',
    hint: 'Post projects and manage escrow',
    icon: <Building2 size={22} />,
  },
  {
    id: 'installer',
    label: 'Installer / EPC',
    hint: 'Bid and execute field work',
    icon: <HardHat size={22} />,
  },
  {
    id: 'supplier',
    label: 'Supplier',
    hint: 'Fulfill equipment and logistics',
    icon: <Package size={22} />,
  },
  {
    id: 'mini_grid',
    label: 'Mini-grid operator',
    hint: 'Plan and operate distributed grids',
    icon: <Zap size={22} />,
  },
];

function readStoredRole(): SunlitRole {
  if (typeof window === 'undefined') return 'project_owner';
  const raw = localStorage.getItem('sunlit_onboarding_role');
  return isSunlitRole(raw) ? raw : 'project_owner';
}

export default function RegisterPage() {
  const router = useRouter();
  const [method, setMethod] = useState<AuthMethod>('email');
  const [state, setState] = useState<AuthState>('input');

  const [selectedRole, setSelectedRole] = useState<SunlitRole>('project_owner');

  const [formData, setFormData] = useState({
    name: '',
    identifier: '',
  });

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setSelectedRole(readStoredRole());
  }, []);

  useEffect(() => {
    localStorage.setItem('sunlit_onboarding_role', selectedRole);
  }, [selectedRole]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-reg-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-reg-${index - 1}`);
      prevInput?.focus();
    }
  };

  const initiateRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.identifier) return;

    setIsLoading(true);
    setError('');

    await new Promise((res) => setTimeout(res, 1200));
    setIsLoading(false);
    setState('otp');
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please fill in the 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');
    await new Promise((res) => setTimeout(res, 1500));

    if (code === '000000') {
      setIsLoading(false);
      setError('Invalid code. Try 123456');
      return;
    }

    const session = await bootstrapMockSession({
      user_id: 'mock-uuid-new_user',
      name: formData.name,
      role: selectedRole,
    });

    setIsLoading(false);
    if (!session) {
      setError('Could not create session. Try again.');
      return;
    }

    setState('success');
    setTimeout(() => {
      router.push(dashboardPathForRole(selectedRole));
    }, 900);
  };

  const mockSocialLogin = async (provider: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const session = await bootstrapMockSession({
      user_id: 'mock-uuid-social-reg',
      name: `Social (${provider})`,
      role: selectedRole,
    });
    setIsLoading(false);
    if (session) {
      router.push(dashboardPathForRole(selectedRole));
    }
  };

  if (state === 'success') {
    return (
      <div className="surface-card--glass p-12 max-w-md w-full animate-scale flex flex-col items-center text-center">
        <div className="w-24 h-24 mb-8 relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
          <div className="relative z-10 w-full h-full bg-primary rounded-full flex items-center justify-center text-white">
            <Check size={48} strokeWidth={3} />
          </div>
        </div>
        <h2 className="headline-md mb-2">Welcome to Sunlit</h2>
        <p className="body-md text-muted mb-8 italic">Your identity has been established. Building your dashboard workspace...</p>
        <div className="flex gap-1.5 justify-center">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md animate-in stagger-children">
      <div className="mb-8 text-center animate-slide">
        <h1 className="display-lg text-[2.5rem] mb-2">Join the Future</h1>
        <p className="body-lg text-muted">Initialize your Sunlit Energy identity</p>
      </div>

      <div className="surface-card--glass p-8 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl translate-y-[-20%] translate-x-[-20%] group-hover:bg-emerald-500/10 transition-all duration-700" />

        {state === 'input' && (
          <form onSubmit={initiateRegistration} className="space-y-6">
            <div className="space-y-3">
              <label className="input-label pl-1">I am a…</label>
              <div className="grid grid-cols-1 gap-2">
                {ROLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedRole(opt.id)}
                    className={`flex gap-3 text-left rounded-xl border p-3 transition-all ${
                      selectedRole === opt.id
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-outline-variant/15 bg-surface-container-low/80 hover:border-primary/30'
                    }`}
                  >
                    <span className="text-primary shrink-0 mt-0.5">{opt.icon}</span>
                    <span>
                      <span className="block font-bold text-sm">{opt.label}</span>
                      <span className="body-xs text-muted">{opt.hint}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="input-label pl-1">Legal Full Name</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-4 flex items-center text-muted group-focus-within/input:text-primary transition-colors">
                    <UserPlus size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="input-field pl-12 h-[52px] bg-surface-container-low border-transparent hover:bg-surface-container-high focus:bg-white focus:border-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-2 p-1 bg-surface-container-low rounded-full">
                <button
                  type="button"
                  onClick={() => {
                    setMethod('email');
                    setFormData({ ...formData, identifier: '' });
                    setError('');
                  }}
                  className={`flex-1 py-1.5 text-[10px] font-black tracking-widest rounded-full transition-all ${method === 'email' ? 'bg-white shadow-sm text-primary' : 'text-muted hover:text-on-surface'}`}
                >
                  EMAIL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMethod('phone');
                    setFormData({ ...formData, identifier: '' });
                    setError('');
                  }}
                  className={`flex-1 py-1.5 text-[10px] font-black tracking-widest rounded-full transition-all ${method === 'phone' ? 'bg-white shadow-sm text-primary' : 'text-muted hover:text-on-surface'}`}
                >
                  PHONE
                </button>
              </div>

              <div className="space-y-2">
                <label className="input-label pl-1">{method === 'email' ? 'Identity Email' : 'Identity Phone'}</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-4 flex items-center text-muted group-focus-within/input:text-primary transition-colors">
                    {method === 'email' ? <Mail size={18} /> : <Phone size={18} />}
                  </div>
                  <input
                    type={method === 'email' ? 'email' : 'tel'}
                    required
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    placeholder={method === 'email' ? 'jane@sunlitenergy.com' : '+234 800 000 0000'}
                    className="input-field pl-12 h-[52px] bg-surface-container-low border-transparent hover:bg-surface-container-high focus:bg-white focus:border-primary/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 body-sm text-muted">
              By initializing your identity, you agree to our <Link href="#" className="font-bold text-primary hover:underline">Terms of Service</Link>.
            </div>

            <button
              type="submit"
              disabled={isLoading || !formData.identifier || !formData.name}
              className="btn btn-primary w-full h-[52px] gap-3"
            >
              {isLoading ? (
                <RefreshCw size={20} className="animate-spin" />
              ) : (
                <>
                  Register Identity
                  <ChevronRight size={18} />
                </>
              )}
            </button>

            <div className="relative py-2 flex items-center gap-4">
              <div className="flex-1 h-[1px] bg-outline-variant/10" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-muted whitespace-nowrap uppercase">Or quick join</span>
              <div className="flex-1 h-[1px] bg-outline-variant/10" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => mockSocialLogin('google')}
                className="btn btn-secondary h-12 gap-2 text-xs font-bold bg-white/40 border-outline-variant/10 hover:bg-white/80"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="" />
                GOOGLE
              </button>
              <button
                type="button"
                onClick={() => mockSocialLogin('apple')}
                className="btn btn-secondary h-12 gap-2 text-xs font-bold bg-white/40 border-outline-variant/10 hover:bg-white/80"
              >
                <svg viewBox="0 0 384 512" className="w-4 h-4 fill-on-surface"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                APPLE
              </button>
            </div>
          </form>
        )}

        {state === 'otp' && (
          <div className="animate-in animate-slide space-y-8">
            <button
              type="button"
              onClick={() => setState('input')}
              className="flex items-center gap-2 text-xs font-bold text-muted hover:text-primary transition-colors group/back"
            >
              <ArrowLeft size={16} className="group-hover/back:-translate-x-1 transition-transform" />
              BACK TO FORM
            </button>

            <div className="text-center">
              <h2 className="headline-sm mb-2">Verify Registration</h2>
              <p className="body-sm text-muted">
                Security code sent to <br />
                <span className="font-bold text-on-surface">{formData.identifier}</span>
              </p>
            </div>

            <form onSubmit={verifyOtp} className="space-y-8">
              <div className="flex justify-between gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-reg-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-full aspect-square text-center text-xl font-bold bg-surface-container-low border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 rounded-xl transition-all"
                  />
                ))}
              </div>

              {error && (
                <div className="p-3 bg-error/5 border border-error/10 rounded-lg text-error text-center text-xs font-medium animate-pulse">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <button type="submit" disabled={isLoading} className="btn btn-primary w-full h-[52px]">
                  {isLoading ? <RefreshCw size={20} className="animate-spin" /> : 'Claim Account'}
                </button>
                <button type="button" className="w-full text-xs font-bold text-muted hover:text-on-surface transition-colors uppercase tracking-widest">
                  Resend Security Code
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <p className="text-center mt-12 body-sm text-muted">
        Already identified? <Link href="/login" className="font-bold text-primary hover:underline underline-offset-4">Sign in to workspace</Link>
      </p>
    </div>
  );
}
