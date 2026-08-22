'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { MailCheck, ArrowRight, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { AuthSplitLayout } from '@/shared/components/auth/AuthSplitLayout';
import { OtpInputGrid } from '@/shared/components/auth/OtpInputGrid';

const VERIFY_HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCFiuiFMB3BAKBAqDxLk5WzWKXzl_R29P5viaanHlEQUUqgOqGyFMFZnrjF_qIfSKTJNpyBdE_Td_nzeBmyEliIy7wx_2RpqaHmL4E61DnAmZkXVLWswTj1S5VONn2PsgxMRh8QdUSk0i2tw_B_pqV0jL92mFqlQ4kVUjZQHewnK8E9MUOJiG8Q8OXPGFDGJ-ooGVAspYcpWbWOQxf-TvZFRvt9iO2khtz-TeBm5tC4_uTCWQVcxKQT';

function OTPVerificationInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'your registered email';

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [countdown, setCountdown] = useState(59);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerify = async (codeOverride?: string) => {
    const code = codeOverride || otp.join('');
    if (code.length < 6 || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      // Mock validation: any 6-digit code except 000000 succeeds
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (code === '000000') {
        setError('Invalid verification code. Please check and try again.');
        setOtp(Array(6).fill(''));
        setIsLoading(false);
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/register/success');
        }, 1000);
      }
    } catch {
      setError('Verification failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(59);
    setOtp(Array(6).fill(''));
    setError('');
  };

  return (
    <AuthSplitLayout
      visualImage={VERIFY_HERO_IMAGE}
      imageAlt="A modern solar farm at dawn with geometric precision"
      headline="Confirm your email address"
      subheadline="We sent a 6-digit confirmation code to your email. Enter it below to activate your account."
      badgeText="Email Confirmation"
      cardMaxWidth="max-w-[480px]"
    >
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="w-12 h-12 rounded-xl bg-primary-container/10 border border-primary-container/20 flex items-center justify-center text-primary-container mb-5 shadow-sm mx-auto sm:mx-0">
          <MailCheck size={24} />
        </div>
        <h1 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface mb-2 tracking-tight">
          Verify Your Email
        </h1>
        <p className="font-body text-sm text-on-surface-variant leading-relaxed">
          We’ve sent a 6-digit authorization code to{' '}
          <span className="font-semibold text-primary-container break-all">{email}</span>
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleVerify();
        }}
        className="space-y-6"
      >
        {/* OTP Input Grid */}
        <div className="space-y-3">
          <label className="block font-label text-sm font-semibold text-on-surface text-center sm:text-left">
            Secure Authorization Code
          </label>
          <OtpInputGrid
            length={6}
            value={otp}
            onChange={setOtp}
            onComplete={(code) => handleVerify(code)}
            disabled={isLoading || isSuccess}
            hasError={!!error}
          />
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || otp.some((d) => !d) || isSuccess}
            className="w-full bg-primary-container hover:bg-primary text-white font-label text-base py-3.5 sm:py-4 px-6 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(15,99,27,0.15)] hover:shadow-[0_8px_24px_rgba(15,99,27,0.25)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Verifying Identity...</span>
              </>
            ) : isSuccess ? (
              <span>Identity Verified!</span>
            ) : (
              <>
                <span>Verify Identity</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>

        {/* Resend Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-2 text-sm text-on-surface-variant gap-2">
          <button
            type="button"
            onClick={handleResend}
            disabled={countdown > 0}
            className={`font-semibold flex items-center gap-1.5 transition-colors duration-300 ${
              countdown > 0
                ? 'text-on-surface-variant/50 cursor-not-allowed'
                : 'text-primary-container hover:text-primary'
            }`}
          >
            <RefreshCw size={14} className={countdown === 0 ? 'hover:rotate-180 transition-transform duration-500' : ''} />
            <span>Resend Code</span>
            {countdown > 0 && (
              <span className="font-mono text-xs text-outline-variant font-medium">
                ({`0:${countdown < 10 ? `0${countdown}` : countdown}`})
              </span>
            )}
          </button>

          <Link
            href="/register"
            className="text-on-surface-variant hover:text-primary-container transition-colors text-sm font-medium"
          >
            ← Change email address
          </Link>
        </div>
      </form>
    </AuthSplitLayout>
  );
}

export default function OTPVerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex items-center gap-3 text-primary-container font-semibold">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading Verification Terminal...</span>
          </div>
        </div>
      }
    >
      <OTPVerificationInner />
    </Suspense>
  );
}
