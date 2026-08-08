'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, AlertOctagon, ChevronLeft, Lock } from 'lucide-react';
import { DisputeFormSchema } from '@/dashboards/project-owner/validators/rfq-form';
import { createDispute } from '@/dashboards/project-owner/services/project-owner-api';
import type { FormStatus } from '@/dashboards/project-owner/types/dashboard';

export default function CreateDisputePage() {
  const router = useRouter();
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [caseId, setCaseId] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setServerError('');
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const raw = {
      projectId: formData.get('projectId') as string,
      escrowId: formData.get('escrowId') as string,
      reason: formData.get('reason') as string,
    };

    const result = DisputeFormSchema.safeParse(raw);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0]?.toString();
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      setStatus('idle');
      return;
    }

    const res = await createDispute(result.data.projectId, result.data.escrowId, result.data.reason);
    if (!res.success) {
      setServerError(res.error || 'Trust Protocol failure: Secure connection interrupted.');
      setStatus('error');
      return;
    }

    setCaseId(res.data?.caseId || `TRST-DSP-${Date.now()}`);
    setStatus('success');
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in stagger-children">
      <div className="flex justify-center mb-8">
         <Link href={`/dashboard/project-owner`} className="flex items-center gap-2 text-primary font-bold hover:translate-x-[-4px] transition-all">
            <ChevronLeft size={20} /> Back to Command Center
         </Link>
      </div>
      
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold font-headline text-slate-900 tracking-tight leading-tight">
          Initiate <span className="text-red-500">Trust Dispute</span>
        </h1>
        <p className="text-xl text-slate-500 mt-4 max-w-2xl mx-auto leading-relaxed">
          Log an incident to invoke the <strong>Sunlit Priority Resolution Protocol</strong>.
          Remaining vault ledger balances will be instantly frozen until arbitration concludes.
        </p>
      </div>

      {status === 'success' ? (
        <div className="surface-card--glass p-12 text-center rounded-[2.5rem] flex flex-col items-center animate-in shadow-2xl shadow-red-500/10 border-red-100">
          <span className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-8 border border-red-100 shadow-inner">
            <Lock size={48} />
          </span>
          <h2 className="text-4xl font-extrabold font-headline text-slate-900 tracking-tight">Vault Ledger Locked</h2>
          <p className="text-lg text-slate-500 mt-4 mb-2">Arbitration Case Tracker: <strong className="text-slate-900 border border-slate-200 px-3 py-1 rounded bg-white shadow-sm font-mono tracking-widest">{caseId}</strong></p>
          <p className="body-md text-slate-500 mb-8 max-w-md mx-auto">
            The remaining threshold balance is securely frozen in the decentralized trust pool. A resolution specialist will contact you within 24 hours.
          </p>
          <button
            className="btn py-4 px-8 border-2 border-slate-200 rounded-xl font-extrabold text-slate-900 hover:border-primary hover:text-primary transition-all shadow-sm bg-white"
            onClick={() => router.push('/dashboard/project-owner')}
          >
            Return to Command Center
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="surface-card--glass p-8 md:p-12 rounded-[2.5rem] shadow-xl md:mx-12" noValidate>
          {serverError && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 font-bold flex items-center gap-3 mb-8 text-sm">
                <AlertOctagon size={18} className="shrink-0" />
                {serverError}
            </div>
          )}

          <div className="space-y-8">
              <div className="space-y-3">
                <label htmlFor="disp-project" className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block">Deployment ID</label>
                <input
                  id="disp-project"
                  name="projectId"
                  type="text"
                  className={`w-full h-14 px-5 bg-white border-2 rounded-xl outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300 placeholder:font-medium focus:ring-4 ${errors.projectId ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-primary focus:ring-primary/20'}`}
                  placeholder="e.g. DEPL-001"
                  required
                  aria-invalid={!!errors.projectId}
                />
                {errors.projectId && <span className="text-xs font-bold text-red-500">{errors.projectId}</span>}
                <span className="text-xs text-slate-400 font-medium">Located in your active infrastructure panel.</span>
              </div>

              <div className="space-y-3">
                <label htmlFor="disp-escrow" className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block">Vault Ledger Signature</label>
                <input
                  id="disp-escrow"
                  name="escrowId"
                  type="text"
                  className={`w-full h-14 px-5 bg-white border-2 rounded-xl outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300 placeholder:font-medium focus:ring-4 ${errors.escrowId ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-primary focus:ring-primary/20'}`}
                  placeholder="e.g. VLT-084-SEC"
                  required
                  aria-invalid={!!errors.escrowId}
                />
                {errors.escrowId && <span className="text-xs font-bold text-red-500">{errors.escrowId}</span>}
              </div>

              <div className="space-y-3">
                <label htmlFor="disp-reason" className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block">Arbitration Context</label>
                <textarea
                  id="disp-reason"
                  name="reason"
                  className={`w-full px-5 py-4 bg-white border-2 rounded-xl outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300 placeholder:font-medium focus:ring-4 ${errors.reason ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-primary focus:ring-primary/20'}`}
                  placeholder="Explain the critical failure or non-compliance regarding your solar deployment..."
                  rows={5}
                  required
                  aria-invalid={!!errors.reason}
                />
                {errors.reason && <span className="text-xs font-bold text-red-500">{errors.reason}</span>}
              </div>

              <div className="bg-red-50 p-6 rounded-2xl flex items-start gap-4 border border-red-100">
                <ShieldAlert size={24} className="text-red-500 shrink-0 mt-1" />
                <div>
                  <strong className="block text-red-900 font-extrabold mb-1">Irreversible Vault Lock</strong>
                  <p className="text-sm text-red-700/80 font-medium">Invoking the Trust Dispute immediately suspends all milestone disbursements to the installer. Only the Arbitration Protocol can unlock the ledger once initiated.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="w-full h-16 bg-red-500 hover:bg-red-600 active:scale-[0.98] text-white rounded-xl font-extrabold text-lg flex items-center justify-center gap-3 shadow-xl shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={status === 'loading'}
                  aria-busy={status === 'loading'}
                >
                  {status === 'loading' ? 'Encrypting Request...' : 'Trigger Vault Lock & Dispute'}
                </button>
              </div>
          </div>
        </form>
      )}
    </div>
  );
}
