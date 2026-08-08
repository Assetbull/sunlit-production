'use client';

import { useState } from 'react';
import { ShieldCheck, AlertCircle, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { submitKycVerification } from '@/dashboards/project-owner/services/project-owner-api';

interface KYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function KYCModal({ isOpen, onClose, onSuccess }: KYCModalProps) {
  const [step, setStep] = useState<'intro' | 'form' | 'success' | 'submitted'>('intro');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [idType, setIdType] = useState<'BVN' | 'NIN'>('BVN');
  const [idNumber, setIdNumber] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await submitKycVerification({
        bvn: idType === 'BVN' ? idNumber : undefined,
        nin: idType === 'NIN' ? idNumber : undefined,
      });
      if (!res.success) {
        setError(res.error || 'Verification request failed');
        setLoading(false);
        return;
      }
      if (res.data?.status === 'verified') {
        setStep('success');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1800);
      } else if (res.data?.status === 'pending') {
        setStep('submitted');
      } else {
        setError('Verification could not be completed. Try again or contact support.');
      }
    } catch {
      setError('Network error. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="surface-card w-full max-w-md overflow-hidden animate-in slide-in-from-bottom shadow-2xl">
        {step !== 'success' && step !== 'submitted' && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-muted hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        )}

        <div className="p-8">
          {step === 'intro' && (
            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <ShieldCheck size={32} />
              </div>
              <div className="space-y-2">
                <h2 className="headline-sm">Verify Your Identity</h2>
                <p className="body-md text-muted">
                  To comply with Nigerian financial regulations and protect your project funds, please verify your identity via BVN or NIN.
                </p>
              </div>
              <div className="surface-card bg-neutral-50 p-4 text-left border-l-4 border-primary">
                <div className="flex gap-3">
                  <AlertCircle size={18} className="text-primary shrink-0 mt-1" />
                  <p className="body-sm">
                    <strong>Why?</strong> Verified users enjoy faster payments and enhanced dispute protection. We do not store your private ID data.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setStep('form')}
                className="btn btn-primary w-full py-3"
              >
                Get Started <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          )}

          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <h2 className="title-lg">Identity Details</h2>
                <p className="body-sm text-muted">Select an ID type available in Nigeria</p>
              </div>

              <div className="flex gap-4">
                {(['BVN', 'NIN'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setIdType(type)}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                      idType === type 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-border bg-transparent text-muted hover:border-muted'
                    }`}
                  >
                    <span className="title-sm">{type}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="label-md">Enter your {idType} Number</label>
                <input
                  type="text"
                  required
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  placeholder={idType === 'BVN' ? '222XXXXXXXX' : '123XXXXXXXX'}
                  className="form-input w-full py-3 text-lg tracking-widest text-center"
                />
                <p className="label-sm text-muted text-center italic">Usually 11 digits</p>
              </div>

              {error ? (
                <p className="body-sm text-red-600 text-center">{error}</p>
              ) : null}

              <button 
                type="submit" 
                disabled={loading || idNumber.length < 11}
                className="btn btn-primary w-full py-3"
              >
                {loading ? 'Verifying with Provider...' : 'Verify Now'}
              </button>
              
              <p className="body-xs text-center text-muted">
                Securely encrypted via Sunlit Guardian protocols.
              </p>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-8 space-y-6 animate-in zoom-in">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <CheckCircle2 size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="headline-sm text-green-700">Identity Verified!</h2>
                <p className="body-md text-muted">
                  Your account is now fully compliant. You can proceed with project funding.
                </p>
              </div>
              <div className="loading loading-dots loading-sm text-green-600 mx-auto"></div>
            </div>
          )}

          {step === 'submitted' && (
            <div className="text-center py-8 space-y-6">
              <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <ShieldCheck size={40} />
              </div>
              <div className="space-y-2">
                <h2 className="headline-sm">Submitted for verification</h2>
                <p className="body-md text-muted">
                  Your BVN/NIN is being validated. Payment funding stays locked until verification completes.
                </p>
              </div>
              <button type="button" className="btn btn-primary w-full py-3" onClick={onClose}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
