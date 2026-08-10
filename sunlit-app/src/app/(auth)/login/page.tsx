'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Sun, Eye, EyeOff, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { postLoginRoute } from '@/shared/auth/client-session';

function LoginPageInner() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  const roleParam = searchParams.get('role');

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
    <div className="bg-[#f7fbf1] text-[#191d17] min-h-screen flex items-center justify-center p-4 md:p-8 font-[Inter]">
      {/* Central Auth Container — Stitch Screen 6e7a4e3de7a647b9870d9d5de16cd0e4 */}
      <main className="w-full max-w-5xl flex flex-col md:flex-row bg-[#fcf2eb]/50 rounded-2xl shadow-xl overflow-hidden border border-[#c0c9bb]/40">

        {/* Left Side: Visual / Brand Context */}
        <div className="hidden md:flex md:w-1/2 relative bg-[#003006] p-10 lg:p-12 flex-col justify-between overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 z-0 opacity-25 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBCL61pLZe9vM6UXwr5dpWvvLv4yCWkm2UX8Bpvhsa1R01dgJVe9nGoDUwvNVlyxpZ_ZGdz33tC2MkFWcveiZWFUwknUom5hfUrgDqjg8hVB7ofhnIaYwR_36nUffaQV_kjBY3hBloXS64hMW4VqqnNTgoLc3GFpKAO4K1obGwU3o4yZbmXlit3C5GfiNXmVBi-qcEfQPA9RLUALk7DQII_vdo2AXkPAHw5SjHg0Lxf0ga6oyzqBPlNJA')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001902] via-[#003006]/80 to-transparent z-0" />

          <div className="relative z-10 flex flex-col h-full justify-between">
            <Link href="/" className="flex items-center gap-2.5 text-[#aef4a5] hover:opacity-90 transition-opacity">
              <div className="w-9 h-9 rounded-xl bg-[#0f631b] flex items-center justify-center text-white shadow-sm">
                <Sun size={20} />
              </div>
              <span className="font-[Manrope] text-xl font-bold tracking-tight text-white">Sunlit Energy</span>
            </Link>

            <div className="mt-auto pb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0f631b]/80 text-[#aef4a5] text-xs font-semibold uppercase tracking-wider mb-4 border border-[#aef4a5]/20">
                <ShieldCheck size={13} /> Enterprise Energy Platform
              </span>
              <h2 className="font-[Manrope] text-2xl lg:text-3xl font-extrabold text-white mb-3 leading-tight">
                Powering Africa’s Next Energy Infrastructure
              </h2>
              <p className="font-[Inter] text-sm lg:text-base text-[#aef4a5]/80 max-w-sm leading-relaxed">
                Connect projects, certified installers, digital escrow, and engineering intelligence in one secure ecosystem.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-12 bg-white flex flex-col justify-center relative">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-6 md:hidden">
            <div className="w-8 h-8 rounded-lg bg-[#003006] flex items-center justify-center text-white">
              <Sun size={18} />
            </div>
            <span className="font-[Manrope] text-lg font-bold text-[#003006]">Sunlit Energy</span>
          </div>

          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="mb-6">
              <h1 className="font-[Manrope] text-2xl sm:text-3xl font-bold text-[#191d17] mb-1.5 tracking-tight">
                Log in to Sunlit
              </h1>
              <p className="font-[Inter] text-sm text-[#40493d]">
                Enter your credentials to access your workspace and telemetry.
              </p>
            </div>

            {/* Optional Role Badge */}
            {roleParam && (
              <div className="inline-flex items-center gap-2 bg-[#ceee93]/50 border border-[#ceee93] px-3.5 py-1.5 rounded-full mb-6 text-xs font-semibold text-[#374e03]">
                Role: {roleParam.charAt(0).toUpperCase() + roleParam.slice(1)}
              </div>
            )}

            {error && (
              <div className="p-3.5 mb-5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block font-[Inter] text-xs font-semibold text-[#40493d] uppercase tracking-wider mb-1.5" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-4 py-3 rounded-xl border border-[#c0c9bb] bg-[#f7fbf1]/40 text-[#191d17] text-sm focus:ring-2 focus:ring-[#003006] focus:border-[#003006] outline-none transition-all placeholder:text-neutral-400"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-[Inter] text-xs font-semibold text-[#40493d] uppercase tracking-wider" htmlFor="password">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs text-[#003006] hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-[#c0c9bb] bg-[#f7fbf1]/40 text-[#191d17] text-sm focus:ring-2 focus:ring-[#003006] focus:border-[#003006] outline-none transition-all placeholder:text-neutral-400 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-[#003006]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#003006] text-white font-[Inter] text-sm font-semibold py-3.5 px-6 rounded-full hover:bg-[#0f631b] transition-all shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-50 flex justify-center items-center gap-2 mt-2"
              >
                {isLoading ? 'Authenticating...' : 'Log In'}
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-[#e0e4db]" />
              <span className="font-[Inter] text-xs font-medium text-[#707a6c] uppercase tracking-wider">Or continue with</span>
              <div className="flex-1 h-px bg-[#e0e4db]" />
            </div>

            {/* Social Auth */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOAuth('google')}
                className="flex items-center justify-center gap-2 bg-white text-[#191d17] py-2.5 px-4 rounded-xl border border-[#c0c9bb] hover:bg-[#f7fbf1] transition-colors font-[Inter] text-xs font-medium"
              >
                <span className="font-bold text-sm">G</span> Google
              </button>
              <button
                type="button"
                onClick={() => handleOAuth('apple')}
                className="flex items-center justify-center gap-2 bg-white text-[#191d17] py-2.5 px-4 rounded-xl border border-[#c0c9bb] hover:bg-[#f7fbf1] transition-colors font-[Inter] text-xs font-medium"
              >
                <span className="font-bold text-sm"></span> Apple
              </button>
            </div>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="font-[Inter] text-xs text-[#707a6c]">
                Don’t have an account?{' '}
                <Link href="/get-started" className="text-[#003006] font-semibold hover:underline">
                  Get Started
                </Link>
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7fbf1] flex items-center justify-center font-[Inter] text-xs text-[#707a6c]">Loading authentication...</div>}>
      <LoginPageInner />
    </Suspense>
  );
}
