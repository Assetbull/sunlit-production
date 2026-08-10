'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { AuthSplitLayout } from '@/shared/components/auth/AuthSplitLayout';

const FORGOT_HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBaBvJ8Z79AvbmHYOqPaOWUAg-lNI2Oij-r9WVtfELCf73NQ7rsLyodGR3Z_dknZ8niolyu-CVoRoC8O8XUav5Eko3XDeZCl-vE5u1H4uihXdMhNI-8FXHv9x7Qb4GJmRsRqCKskB41yitiagHvrid5kAUkOcE9If5Uc5tW5PGQSmMDPljTNsrkSwjKvKwN5SAXwfNpHa9VSOH4VVtZWKD3S21lx6eKoYK4V9F1b0HvkW1cYROTLlvQ';

function ForgotPasswordInner() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      // Simulate backend password recovery dispatch
      await new Promise((resolve) => setTimeout(resolve, 900));
      setIsSuccess(true);
    } catch {
      setError('Failed to send reset instructions. Please verify your email and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      visualImage={FORGOT_HERO_IMAGE}
      imageAlt="Modern solar panels with sunset reflections"
      headline="Secure Access to the Sovereign Grid."
      subheadline="Regain control of your energy intelligence platform. A secure link will be dispatched to your registered credentials."
      badgeText="Account Recovery"
      cardMaxWidth="max-w-[480px]"
    >
      {isSuccess ? (
        /* Success State View */
        <div className="text-center py-4 space-y-6 animate-in fade-in zoom-in-95 duration-400">
          <div className="w-16 h-16 rounded-2xl bg-primary-container/10 border border-primary-container/20 flex items-center justify-center text-primary-container mx-auto shadow-sm">
            <CheckCircle2 size={32} />
          </div>

          <div className="space-y-2">
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Check Your Email
            </h2>
            <p className="font-body text-sm text-on-surface-variant max-w-sm mx-auto leading-relaxed">
              We have dispatched secure recovery instructions to{' '}
              <strong className="text-primary-container font-semibold break-all">{email}</strong>.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <Link
              href="/login"
              className="w-full bg-primary-container hover:bg-primary text-white font-label text-sm sm:text-base py-3.5 sm:py-4 px-6 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(15,99,27,0.15)] hover:shadow-[0_8px_24px_rgba(15,99,27,0.25)] hover:-translate-y-0.5"
            >
              <span>Return to Sign In</span>
              <ArrowRight size={18} />
            </Link>

            <button
              type="button"
              onClick={() => setIsSuccess(false)}
              className="font-label text-xs sm:text-sm text-on-surface-variant hover:text-primary-container transition-colors py-2"
            >
              Didn’t receive the email? Try again
            </button>
          </div>
        </div>
      ) : (
        /* Recovery Request Form */
        <div>
          {/* Header */}
          <div className="mb-8">
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface mb-2 tracking-tight">
              Reset Password
            </h2>
            <p className="font-body text-sm sm:text-base text-on-surface-variant">
              Enter your email address to receive secure recovery instructions.
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block font-label text-xs sm:text-sm font-semibold text-on-surface"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 pointer-events-none">
                  <Mail size={18} />
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  disabled={isLoading}
                  className="w-full bg-surface-container-low border border-outline-variant/60 focus:border-primary-container focus:bg-surface-container-low pl-11 pr-4 py-3.5 font-body text-sm text-on-surface rounded-lg transition-all duration-300 outline-none placeholder:text-on-surface-variant/50"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-4">
              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-primary-container hover:bg-primary text-white font-label text-sm sm:text-base py-3.5 sm:py-4 px-6 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(15,99,27,0.15)] hover:shadow-[0_8px_24px_rgba(15,99,27,0.25)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 font-label text-xs sm:text-sm text-on-surface-variant hover:text-primary-container transition-colors duration-300 font-medium"
                >
                  <ArrowLeft size={16} />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          </form>
        </div>
      )}
    </AuthSplitLayout>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex items-center gap-3 text-primary-container font-semibold">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading Account Recovery...</span>
          </div>
        </div>
      }
    >
      <ForgotPasswordInner />
    </Suspense>
  );
}
