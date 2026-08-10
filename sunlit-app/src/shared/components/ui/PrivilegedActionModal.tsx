import React, { useState } from 'react';
import Button from './Button';
import Input from './Input';

export interface PrivilegedActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (verificationCode?: string) => Promise<void> | void;
  title: string;
  description: string;
  actionLabel?: string;
  isDestructive?: boolean;
  requiresVerification?: boolean;
  verificationPrompt?: string;
  auditContext?: string;
}

/**
 * Sunlit Enterprise UX Standard — Canonical Security UX & Privileged Action Modal
 * - Explicit permissions & privileged actions confirmation
 * - Authentication context & auditability badge
 * - Safe destructive action gating with confirmation challenge
 * - Backdrop blur scrim & clean modal ergonomics
 */
export const PrivilegedActionModal: React.FC<PrivilegedActionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  actionLabel = 'Confirm Action',
  isDestructive = false,
  requiresVerification = false,
  verificationPrompt = 'Enter CONFIRM or your 2FA code to proceed',
  auditContext,
}) => {
  const [verificationInput, setVerificationInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (requiresVerification && !verificationInput.trim()) {
      setError('Verification input is required for this privileged action.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await onConfirm(verificationInput);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to complete privileged action.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1f1b17]/60 backdrop-blur-sm animate-in">
      <div className="w-full max-w-lg bg-white rounded-[28px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-[#e7e5e4] flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isDestructive
                  ? 'bg-[#ffdad6] text-[#ba1a1a]'
                  : 'bg-[#f6ece6] text-[#0f631b]'
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-headline text-lg font-bold text-[#1f1b17]">
                {title}
              </h3>
              {auditContext && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0f631b] bg-[#0f631b]/10 px-2 py-0.5 rounded-full mt-0.5">
                  Audit Logged: {auditContext}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#707a6c] hover:text-[#1f1b17] p-1 rounded-full hover:bg-[#f5f5f4]"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <p className="text-sm text-[#5d6361] leading-relaxed">{description}</p>

        {/* Optional Verification Challenge */}
        {requiresVerification && (
          <div className="pt-2">
            <Input
              label={verificationPrompt}
              value={verificationInput}
              onChange={(e) => setVerificationInput(e.target.value)}
              placeholder="Type confirmation here..."
              error={error || undefined}
            />
          </div>
        )}

        {error && !requiresVerification && (
          <p className="text-xs text-[#ba1a1a] font-medium">{error}</p>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e7e5e4]">
          <Button
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant={isDestructive ? 'danger' : 'primary'}
            size="md"
            isLoading={isLoading}
            onClick={handleConfirm}
          >
            {actionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivilegedActionModal;
