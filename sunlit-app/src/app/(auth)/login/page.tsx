'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { AuthSplitLayout } from '@/shared/components/auth/AuthSplitLayout';
import { SocialAuthButtons } from '@/shared/components/auth/SocialAuthButtons';
import { authService } from '@/services/auth.service';
import { postLoginRoute } from '@/shared/auth/client-session';

const LOGIN_HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAT51aNT0TR-ThjIuC1pyfTaA4f3L58cb68ZRY0znj_O6HrKiBbYTDuVbnj3T89m8P0wH642XO4gjZC5QFOCQRDDvPd0I7tU-jGA3SJ1HSWvZmzCv-6NA-Kk3intD8HIW-wDLdjcKr4hbcKeXLG7zu8bokZwyIcDGryYYSkkzkg3EsL7zVJ7OnTBHQ4SJ0ZZzLoky56MhkToKD-cZXf7MffmfOb8gr1YZisxgzZzHzklgQJLdNd_8-3';

function LoginPageInner() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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
    <AuthSplitLayout
      visualImage={LOGIN_HERO_IMAGE}
      imageAlt="Modern solar powered architectural infrastructure"
      headline="Reliable energy projects, managed from start to finish."
      subheadline="Sign in to track your solar installation, compare installer quotes, and monitor milestone payments."
      badgeText="Sunlit Account Access"
      cardMaxWidth="max-w-[480px]"
    >
      {/* Header */}
      <div className="mb-8">
        <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface mb-2 tracking-tight">
          Welcome Back
        </h2>
        <p className="font-body text-sm sm:text-base text-on-surface-variant">
          Sign in to manage your projects and view your quotes.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-3.5 rounded-lg bg-error-container/40 border border-error/20 flex items-center gap-2.5 text-error text-sm font-medium">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-5">
        {/* Email Field */}
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
            placeholder="name@company.com"
            required
            disabled={isLoading}
            className="w-full bg-surface-container-low border-b-2 border-outline-variant/60 focus:border-primary-container focus:bg-surface-container-low px-4 py-3.5 font-body text-sm text-on-surface rounded-t-lg transition-all duration-300 outline-none placeholder:text-on-surface-variant/50"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label
              htmlFor="password"
              className="block font-label text-xs sm:text-sm font-semibold text-on-surface"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="font-label text-xs sm:text-sm text-primary-container hover:text-primary transition-colors duration-300 font-medium"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
              className="w-full bg-surface-container-low border-b-2 border-outline-variant/60 focus:border-primary-container focus:bg-surface-container-low px-4 py-3.5 font-body text-sm text-on-surface rounded-t-lg transition-all duration-300 outline-none pr-12 placeholder:text-on-surface-variant/50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70 hover:text-primary-container transition-colors duration-300 p-1"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center pt-1">
          <input
            id="remember"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 text-primary-container bg-surface-container-low border-outline-variant rounded focus:ring-primary-container focus:ring-2 cursor-pointer"
          />
          <label
            htmlFor="remember"
            className="ml-2.5 font-body text-xs sm:text-sm text-on-surface-variant cursor-pointer select-none"
          >
            Remember Me
          </label>
        </div>

        {/* Login Action Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full bg-primary-container hover:bg-primary text-white font-label text-sm sm:text-base py-3.5 sm:py-4 px-6 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(15,99,27,0.15)] hover:shadow-[0_8px_24px_rgba(15,99,27,0.25)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Login</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Social Logins (Stitch V2 Refinement) */}
      <div className="mt-6">
        <SocialAuthButtons
          onGoogleClick={() => handleOAuth('google')}
          onAppleClick={() => handleOAuth('apple')}
          isLoading={isLoading}
          dividerText="Or continue with"
        />
      </div>

      {/* Sign Up Link */}
      <div className="mt-8 text-center pt-4 border-t border-outline-variant/30">
        <p className="font-body text-xs sm:text-sm text-on-surface-variant">
          Don’t have an account?{' '}
          <Link
            href="/register"
            className="font-semibold text-primary-container hover:text-primary underline underline-offset-4 transition-colors duration-300"
          >
            Create an account
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex items-center gap-3 text-primary-container font-semibold">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading Sunlit Terminal...</span>
          </div>
        </div>
      }
    >
      <LoginPageInner />
    </Suspense>
  );
}
