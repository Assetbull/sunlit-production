'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { AuthSplitLayout } from '@/shared/components/auth/AuthSplitLayout';

const RESET_HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAvuMHkRF4zSxKWDYqMOJ9mii_woarSl4yrQI57zuOSeRBOUFm4eePY-Iphj1ntkQHgbCWSvSHHjH5wLWROUN4iQdtF71tYm4eTxoa_sMubA3wCkhM1zlfaVPVXM87hYvMB6FwUxcKOQt4cwXhn1HRDWMAlOfYkI8W9oVkAYrdBKa_fArvf8SFvZbLedxEBXG--FFnrQgKJwgRvBRXClwQEw2pfIZxjbtXKAHiEmHh_RMEnAmFZ4Zo1';

function ResetPasswordInner() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword || isLoading) return;

    if (newPassword.length < 12) {
      setError('Password must be at least 12 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate backend password update
      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push('/reset-password/success');
    } catch {
      setError('Failed to update password. Please request a new recovery link.');
      setIsLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      visualImage={RESET_HERO_IMAGE}
      imageAlt="High-precision macro solar panel cells"
      headline="Engineered Grid Security"
      subheadline="Create a high-entropy password to protect your energy production telemetry, settlement accounts, and engineering designs."
      badgeText="Credential Update"
      cardMaxWidth="max-w-md"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface mb-2 tracking-tight">
          Reset Password
        </h1>
        <p className="font-body text-sm text-on-surface-variant">
          Create a secure new password for your Sunlit account.
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
      <form onSubmit={handleReset} className="space-y-5">
        {/* New Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="new-password"
            className="block font-label text-xs sm:text-sm font-semibold text-on-surface"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              disabled={isLoading}
              className="w-full bg-surface-container-low border-b-2 border-outline-variant/60 focus:border-primary-container focus:bg-surface-container-low px-4 py-3.5 font-body text-sm text-on-surface rounded-t-lg transition-all duration-300 outline-none pr-12 placeholder:text-on-surface-variant/50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70 hover:text-primary-container p-1 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="font-mono text-xs text-on-surface-variant/70 pt-1">
            Must be at least 12 characters.
          </p>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="confirm-password"
            className="block font-label text-xs sm:text-sm font-semibold text-on-surface"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              disabled={isLoading}
              className="w-full bg-surface-container-low border-b-2 border-outline-variant/60 focus:border-primary-container focus:bg-surface-container-low px-4 py-3.5 font-body text-sm text-on-surface rounded-t-lg transition-all duration-300 outline-none pr-12 placeholder:text-on-surface-variant/50"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70 hover:text-primary-container p-1 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 space-y-4">
          <button
            type="submit"
            disabled={isLoading || !newPassword || !confirmPassword}
            className="w-full bg-primary-container hover:bg-primary text-white font-label text-sm sm:text-base py-3.5 sm:py-4 px-6 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(15,99,27,0.15)] hover:shadow-[0_8px_24px_rgba(15,99,27,0.25)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <span>Update Password</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 font-label text-xs sm:text-sm text-primary-container hover:text-primary transition-colors duration-300 font-medium"
            >
              <ArrowLeft size={16} />
              <span>Return to Sign In</span>
            </Link>
          </div>
        </div>
      </form>
    </AuthSplitLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex items-center gap-3 text-primary-container font-semibold">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading Password Reset...</span>
          </div>
        </div>
      }
    >
      <ResetPasswordInner />
    </Suspense>
  );
}
