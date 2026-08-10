'use client';

import React from 'react';

interface SocialAuthButtonsProps {
  onGoogleClick?: () => void;
  onAppleClick?: () => void;
  isLoading?: boolean;
  dividerText?: string;
}

export function SocialAuthButtons({
  onGoogleClick,
  onAppleClick,
  isLoading = false,
  dividerText = 'Or continue with email',
}: SocialAuthButtonsProps) {
  return (
    <div className="w-full space-y-4">
      {/* Divider */}
      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-outline-variant/40" />
        <span className="flex-shrink-0 mx-4 font-mono text-xs text-on-surface-variant/70 uppercase tracking-widest">
          {dividerText}
        </span>
        <div className="flex-grow border-t border-outline-variant/40" />
      </div>

      {/* Social Button Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Google */}
        <button
          type="button"
          onClick={onGoogleClick}
          disabled={isLoading}
          className="w-full bg-surface-container-lowest border border-outline-variant/50 hover:border-primary-container/40 hover:bg-surface-container-low text-on-surface font-label text-sm py-3.5 px-4 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] flex items-center justify-center gap-2.5 group disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 flex-shrink-0"
            viewBox="0 0 24 24"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="font-medium">Google</span>
        </button>

        {/* Apple */}
        <button
          type="button"
          onClick={onAppleClick}
          disabled={isLoading}
          className="w-full bg-surface-container-lowest border border-outline-variant/50 hover:border-primary-container/40 hover:bg-surface-container-low text-on-surface font-label text-sm py-3.5 px-4 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] flex items-center justify-center gap-2.5 group disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <svg
            className="w-4 h-4 text-on-surface transition-transform duration-300 group-hover:scale-110 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.689.827-1.33 2.272-1.144 3.61 1.356.105 2.628-.622 3.431-1.598z" />
          </svg>
          <span className="font-medium">Apple</span>
        </button>
      </div>
    </div>
  );
}
