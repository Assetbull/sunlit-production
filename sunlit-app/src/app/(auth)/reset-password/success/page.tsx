'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { AuthSplitLayout } from '@/shared/components/auth/AuthSplitLayout';

const PASSWORD_UPDATED_HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBHYMy3-zVNNFq-zkHeh-iFxh8yd4IhSjwZXaDav6Q9PqRwKPQPbM1q2OslUAGt9pQ6meJGAl_jZ5BKraAxGRioy41cMX4--ZYkuy4UJm3hsvjm8a5Zeb0GG4e2xqDk4g1DrXqb8N3Shu2Fq9JJi2WDRKhtIGlk94Pd2oOlXiz_jPJdS4Tt865t3q_pTe0tK2aQE6nuU9LvHcbxFE-XO5uv6NriJRIhPL-jt8elwW7ewLUNPQ420XBv';

export default function PasswordUpdatedSuccessPage() {
  return (
    <AuthSplitLayout
      visualImage={PASSWORD_UPDATED_HERO_IMAGE}
      imageAlt="Modern renewable energy infrastructure"
      headline="Password Updated"
      subheadline="Your account credentials have been updated securely. You can now sign in with your new password."
      badgeText="Account Updated"
      cardMaxWidth="max-w-md"
    >
      <div className="flex flex-col items-center text-center space-y-6 py-4">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-primary-container/10 border border-primary-container/20 rounded-2xl flex items-center justify-center text-primary-container shadow-sm">
          <CheckCircle2 size={40} className="stroke-[2.2]" />
        </div>

        {/* Content */}
        <div className="space-y-2.5">
          <h1 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Password Updated Successfully
          </h1>
          <p className="font-body text-sm sm:text-base text-on-surface-variant max-w-sm mx-auto leading-relaxed">
            Your password has been updated. You can now sign in to your Sunlit account.
          </p>
        </div>

        {/* CTA Action */}
        <div className="w-full pt-4">
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 bg-primary-container hover:bg-primary text-white font-label text-sm sm:text-base py-3.5 sm:py-4 px-8 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] shadow-[0_4px_12px_rgba(15,99,27,0.15)] hover:shadow-[0_8px_24px_rgba(15,99,27,0.25)] hover:-translate-y-0.5"
          >
            <span>Go to Login</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </AuthSplitLayout>
  );
}
