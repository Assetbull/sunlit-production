'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  Building2,
  Wrench,
  HardHat,
  Users,
  ChevronDown,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { AuthSplitLayout } from '@/shared/components/auth/AuthSplitLayout';
import { SocialAuthButtons } from '@/shared/components/auth/SocialAuthButtons';
import { authService } from '@/services/auth.service';
import { dashboardPathForRole } from '@/shared/auth/sunlit-roles';
import type { SunlitRole } from '@/shared/auth/sunlit-roles';

const REGISTER_HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDWqJbRN8KQ9V-pzYV6K9RGQVacahfCELKLD7qa9hcZVHoj0bljoEqXE0rO2xQaKOPP-aEB5DqBxzEVMOccvGQ4CdM4f1jH9y1xidwMDjDHb_K23Y7T0xcNpQ3ygZioQTb4batAEyuscPOLebU0Ny--alwdVuZNUdt7sdYmnT80zmKD6YVNQBRwzBpZ4ZELI9p4rniouNhadVBhYcU9_my_XJL6N4UilY1ce3_iJvRrswtHEPJrTKpe';

interface RoleOption {
  value: SunlitRole;
  label: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: 'project_owner',
    label: 'Homeowner / Business / Real Estate',
    badge: 'Asset Owner',
    description: 'Residential property, commercial buildings & real estate developments',
    icon: Building2,
  },
  {
    value: 'installer',
    label: 'Solar Installer',
    badge: 'Certified Partner',
    description: 'Solar design, panel installation & project engineering teams',
    icon: Wrench,
  },
  {
    value: 'epc_contractor',
    label: 'EPC Contractor',
    badge: 'Infrastructure',
    description: 'Turnkey engineering, procurement, utility & commercial microgrids',
    icon: HardHat,
  },
  {
    value: 'crew_member',
    label: 'Crew Member / Technician',
    badge: 'Operations',
    description: 'Site electricians, riggers, field technicians & operational specialists',
    icon: Users,
  },
];

function calculatePasswordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: 'bg-transparent' };
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (pw.length >= 12) score += 1;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;

  if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-error' };
  if (score <= 3) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
  if (score <= 4) return { score: 3, label: 'Good', color: 'bg-primary-container' };
  return { score: 4, label: 'Strong', color: 'bg-[#179d5b]' };
}

function RegisterPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<SunlitRole>('project_owner');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

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
    else if (roleParam === 'consumer' || roleParam === 'project_owner' || roleParam === 'business') {
      setRole('project_owner');
    }
  }, [roleParam]);

  // Click outside to close role dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedRoleOption = ROLE_OPTIONS.find((r) => r.value === role) || ROLE_OPTIONS[0];
  const SelectedIcon = selectedRoleOption.icon;
  const pwStrength = calculatePasswordStrength(password);

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
      headline="Plan, fund, and install reliable solar energy."
      subheadline="Join Sunlit to assess your energy needs, connect with verified installers, and protect your project with milestone escrow."
      badgeText="Get Started"
      cardMaxWidth="max-w-xl"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface mb-2 tracking-tight">
          Create Account
        </h1>
        <p className="font-body text-sm sm:text-base text-on-surface-variant">
          Join Sunlit to plan, finance, install and manage your energy system.
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

            {/* Password Strength Indicator */}
            {password && (
              <div className="pt-1 space-y-1">
                <div className="flex gap-1 h-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        step <= pwStrength.score ? pwStrength.color : 'bg-outline-variant/30'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center text-[10px] text-on-surface-variant/70">
                  <span>Entropy Security</span>
                  <span className="font-semibold">{pwStrength.label}</span>
                </div>
              </div>
            )}
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

        {/* Advanced Role Selector */}
        <div className="space-y-2 relative" ref={roleDropdownRef}>
          <div className="flex justify-between items-center">
            <label
              htmlFor="role"
              className="block font-label text-xs sm:text-sm font-semibold text-on-surface"
            >
              Stakeholder Role
            </label>
            <span className="text-[11px] font-mono text-primary-container flex items-center gap-1 font-medium">
              <ShieldCheck size={13} />
              RBAC Authorized
            </span>
          </div>

          {/* Custom Advanced Select Button */}
          <button
            type="button"
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            disabled={isLoading}
            className="w-full bg-surface-container-low border border-outline-variant/60 hover:border-primary-container/60 focus:border-primary-container focus:bg-surface-container-low p-3.5 rounded-lg transition-all duration-300 flex items-center justify-between text-left group shadow-sm"
            aria-haspopup="listbox"
            aria-expanded={isRoleDropdownOpen}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant/50 flex items-center justify-center text-primary-container shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-300">
                <SelectedIcon size={20} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-headline text-sm font-bold text-on-surface truncate">
                    {selectedRoleOption.label}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-primary-container/10 text-primary-container border border-primary-container/20">
                    {selectedRoleOption.badge}
                  </span>
                </div>
                <p className="font-body text-xs text-on-surface-variant/80 truncate mt-0.5">
                  {selectedRoleOption.description}
                </p>
              </div>
            </div>
            <ChevronDown
              size={18}
              className={`text-on-surface-variant shrink-0 ml-2 transition-transform duration-300 ${
                isRoleDropdownOpen ? 'rotate-180 text-primary-container' : ''
              }`}
            />
          </button>

          {/* Floating Dropdown Options Menu */}
          {isRoleDropdownOpen && (
            <div className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-surface border border-outline-variant/60 rounded-xl shadow-[0_16px_36px_rgba(0,48,6,0.12)] p-2 space-y-1.5 animate-in fade-in zoom-in-95 duration-200">
              {ROLE_OPTIONS.map((opt) => {
                const isSelected = opt.value === role;
                const OptIcon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setRole(opt.value);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full p-3 rounded-lg flex items-center justify-between text-left transition-all duration-200 group ${
                      isSelected
                        ? 'bg-primary-container/10 border border-primary-container/30 text-on-surface'
                        : 'hover:bg-surface-container-low border border-transparent text-on-surface'
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-primary-container text-white shadow-sm'
                            : 'bg-surface-container-low text-on-surface-variant group-hover:text-primary-container'
                        }`}
                      >
                        <OptIcon size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-headline text-xs sm:text-sm font-bold text-on-surface">
                            {opt.label}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                              isSelected
                                ? 'bg-primary-container text-white'
                                : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                          >
                            {opt.badge}
                          </span>
                        </div>
                        <p className="font-body text-[11px] text-on-surface-variant/80 mt-0.5 leading-snug">
                          {opt.description}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <Check size={16} className="text-primary-container shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Hidden native select for form accessibility */}
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as SunlitRole)}
            className="sr-only"
            aria-hidden="true"
            tabIndex={-1}
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
