'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { AuthSplitLayout } from '@/shared/components/auth/AuthSplitLayout';
import { SocialAuthButtons } from '@/shared/components/auth/SocialAuthButtons';
import { authService } from '@/services/auth.service';
import { dashboardPathForRole } from '@/shared/auth/sunlit-roles';
import type { SunlitRole } from '@/shared/auth/sunlit-roles';

const REGISTER_HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDWqJbRN8KQ9V-pzYV6K9RGQVacahfCELKLD7qa9hcZVHoj0bljoEqXE0rO2xQaKOPP-aEB5DqBxzEVMOccvGQ4CdM4f1jH9y1xidwMDjDHb_K23Y7T0xcNpQ3ygZioQTb4batAEyuscPOLebU0Ny--alwdVuZNUdt7sdYmnT80zmKD6YVNQBRwzBpZ4ZELI9p4rniouNhadVBhYcU9_my_XJL6N4UilY1ce3_iJvRrswtHEPJrTKpe';

const ROLE_OPTIONS: { value: SunlitRole; label: string }[] = [
  { value: 'project_owner', label: 'Homeowner / Project Owner' },
  { value: 'installer', label: 'Solar Installer' },
  { value: 'epc_contractor', label: 'EPC Contractor' },
  { value: 'crew_member', label: 'Crew Member / Technician' },
];

function RegisterPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<SunlitRole>('project_owner');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Hydrate role query param if present
  useEffect(() => {
    if (roleParam === 'installer') setRole('installer');
    else if (roleParam === 'epc' || roleParam === 'epc_contractor') setRole('epc_contractor');
    else if (roleParam === 'crew' || roleParam === 'crew_member') setRole('crew_member');
    else if (roleParam === 'consumer' || roleParam === 'project_owner') setRole('project_owner');
  }, [roleParam]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword || isLoading) return;

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!termsAgreed) {
      setError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await authService.register({
        fullName,
        email,
        phone,
        role,
        password,
      });

      if (result.ok && result.session) {
        router.push(`/otp-verification?email=${encodeURIComponent(email)}&method=email`);
      } else {
        setError(result.error || 'Registration failed. Please try again.');
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
        router.push(dashboardPathForRole(result.session.role));
      } else {
        setError(result.error || `${provider} sign-up failed.`);
        setIsLoading(false);
      }
    } catch {
      setError('An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      visualImage={REGISTER_HERO_IMAGE}
      imageAlt="High-fidelity imagery of modern renewable energy infrastructure"
      headline="Accelerate Africa’s Clean Energy Transition."
      subheadline="Join the sovereign grid platform to design, finance, and deploy bankable solar infrastructure."
      badgeText="Platform Registration"
      cardMaxWidth="max-w-xl"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface mb-2 tracking-tight">
          Create Account
        </h1>
        <p className="font-body text-sm sm:text-base text-on-surface-variant">
          Join the Sovereign Grid platform to manage your renewable energy assets.
        </p>
      </div>

      {/* Social Logins */}
      <div className="mb-6">
        <SocialAuthButtons
          onGoogleClick={() => handleOAuth('google')}
          onAppleClick={() => handleOAuth('apple')}
          isLoading={isLoading}
          dividerText="Or continue with email"
        />
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-3.5 rounded-lg bg-error-container/40 border border-error/20 flex items-center gap-2.5 text-error text-sm font-medium">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="fullName"
            className="block font-label text-xs sm:text-sm font-semibold text-on-surface"
          >
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Jane Doe"
            required
            disabled={isLoading}
            className="w-full bg-surface-container-low border border-outline-variant/60 focus:border-primary-container focus:bg-surface-container-low px-4 py-3 font-body text-sm text-on-surface rounded-lg transition-all duration-300 outline-none placeholder:text-on-surface-variant/50"
          />
        </div>

        {/* Contact Details (Email + Phone Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block font-label text-xs sm:text-sm font-semibold text-on-surface"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              required
              disabled={isLoading}
              className="w-full bg-surface-container-low border border-outline-variant/60 focus:border-primary-container focus:bg-surface-container-low px-4 py-3 font-body text-sm text-on-surface rounded-lg transition-all duration-300 outline-none placeholder:text-on-surface-variant/50"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label
              htmlFor="phone"
              className="block font-label text-xs sm:text-sm font-semibold text-on-surface"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234 800 000 0000"
              disabled={isLoading}
              className="w-full bg-surface-container-low border border-outline-variant/60 focus:border-primary-container focus:bg-surface-container-low px-4 py-3 font-body text-sm text-on-surface rounded-lg transition-all duration-300 outline-none placeholder:text-on-surface-variant/50"
            />
          </div>
        </div>

        {/* Password Group (Password + Confirm Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Password */}
          <div className="space-y-1.5 relative">
            <label
              htmlFor="password"
              className="block font-label text-xs sm:text-sm font-semibold text-on-surface"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="w-full bg-surface-container-low border border-outline-variant/60 focus:border-primary-container focus:bg-surface-container-low px-4 py-3 font-body text-sm text-on-surface rounded-lg transition-all duration-300 outline-none pr-10 placeholder:text-on-surface-variant/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70 hover:text-primary-container p-1 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5 relative">
            <label
              htmlFor="confirmPassword"
              className="block font-label text-xs sm:text-sm font-semibold text-on-surface"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="w-full bg-surface-container-low border border-outline-variant/60 focus:border-primary-container focus:bg-surface-container-low px-4 py-3 font-body text-sm text-on-surface rounded-lg transition-all duration-300 outline-none pr-10 placeholder:text-on-surface-variant/50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70 hover:text-primary-container p-1 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Role Selection Dropdown */}
        <div className="space-y-1.5">
          <label
            htmlFor="role"
            className="block font-label text-xs sm:text-sm font-semibold text-on-surface"
          >
            I am registering as a...
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as SunlitRole)}
            disabled={isLoading}
            className="w-full bg-surface-container-low border border-outline-variant/60 focus:border-primary-container focus:bg-surface-container-low px-4 py-3 font-body text-sm text-on-surface rounded-lg transition-all duration-300 outline-none cursor-pointer"
          >
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Legal Terms Checkbox */}
        <div className="flex items-start pt-1">
          <input
            id="terms"
            type="checkbox"
            checked={termsAgreed}
            onChange={(e) => setTermsAgreed(e.target.checked)}
            className="w-4 h-4 mt-0.5 text-primary-container bg-surface-container-low border-outline-variant rounded focus:ring-primary-container focus:ring-2 cursor-pointer"
          />
          <label
            htmlFor="terms"
            className="ml-2.5 font-body text-xs sm:text-sm text-on-surface-variant leading-tight cursor-pointer select-none"
          >
            I agree to the{' '}
            <Link
              href="/terms"
              target="_blank"
              className="text-primary-container hover:underline font-medium"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              target="_blank"
              className="text-primary-container hover:underline font-medium"
            >
              Privacy Policy
            </Link>
            .
          </label>
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !fullName || !email || !password || !confirmPassword || !termsAgreed}
            className="w-full bg-primary-container hover:bg-primary text-white font-label text-sm sm:text-base py-3.5 sm:py-4 px-6 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(15,99,27,0.15)] hover:shadow-[0_8px_24px_rgba(15,99,27,0.25)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Log In Link */}
      <div className="mt-6 text-center pt-4 border-t border-outline-variant/30">
        <p className="font-body text-xs sm:text-sm text-on-surface-variant">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-primary-container hover:text-primary underline underline-offset-4 transition-colors duration-300"
          >
            Log in
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex items-center gap-3 text-primary-container font-semibold">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading Sunlit Registration...</span>
          </div>
        </div>
      }
    >
      <RegisterPageInner />
    </Suspense>
  );
}
