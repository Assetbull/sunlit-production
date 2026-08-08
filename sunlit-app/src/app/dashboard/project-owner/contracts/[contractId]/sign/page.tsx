'use client';

import { useEffect, useState, useRef, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, FileSignature, CheckCircle2, ShieldCheck,
  AlertCircle, FileText, UserCheck, Banknote, Shield, Activity, X
} from 'lucide-react';
import { fetchContract, signContract } from '@/dashboards/project-owner/services/project-owner-api';
import type { ContractView } from '@/dashboards/project-owner/types/dashboard';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', { 
    style: 'currency', 
    currency: 'NGN', 
    maximumFractionDigits: 0 
  }).format(amount);
}

export default function ContractSignPage({ params }: { params: Promise<{ contractId: string }> }) {
  const { contractId } = use(params);
  const router = useRouter();
  
  const [contract, setContract] = useState<ContractView | null>(null);
  const [loading, setLoading] = useState(true);
  
  // E-Sign states
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [signedName, setSignedName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Setup canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#00490e';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [loading]);

  useEffect(() => {
    async function load() {
      const res = await fetchContract(contractId);
      if (res.success && res.data) setContract(res.data);
      setLoading(false);
    }
    load();
  }, [contractId]);

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    setIsDrawing(true);
    setHasSignature(true);
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSignSubmit = async () => {
    if (!hasSignature || !signedName || !contract) return;
    setIsSubmitting(true);
    setError('');

    const canvas = canvasRef.current;
    const signatureData = canvas ? canvas.toDataURL('image/png') : '';

    try {
      const res = await signContract(contract.id, { signatureData, signedName });
      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.error || 'Failed to sign contract');
      }
    } catch {
      setError('An unexpected error occurred while signing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="skeleton h-12 w-1/3 rounded-[12px] mb-8" />
        <div className="flex flex-col lg:flex-row gap-8">
           <div className="skeleton h-[600px] flex-grow rounded-[32px]" />
           <div className="skeleton h-[500px] w-full lg:w-[420px] rounded-[32px]" />
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
         <div className="w-20 h-20 bg-slate-100 text-slate-300 rounded-3xl flex items-center justify-center mb-6">
           <AlertCircle size={32} />
         </div>
         <h2 className="text-2xl font-black text-slate-900 mb-2">Contract Not Found</h2>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <header className="mb-10">
        <Link href={`/dashboard/project-owner/contracts/${contractId}`} className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm text-slate-600 hover:text-primary transition-all mb-6">
          <ArrowLeft size={16} />
          <span className="text-[10px] font-extrabold uppercase tracking-widest">Back to Contract Overview</span>
        </Link>
        <div className="flex items-center gap-3 mb-3">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
            {contract.id.slice(0, 13).toUpperCase()}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Authorization Stage
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black font-headline text-slate-900 tracking-tighter">
          Master Agreement Signature
        </h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left: Contract Summary */}
        <div className="flex-grow space-y-6">
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
              <FileText size={18} className="text-primary" /> Term Summary
            </h2>
            
            <div className="flex flex-col md:flex-row gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-slate-50 rounded-2xl border border-slate-100 p-6 mb-8">
               <div className="flex-1 md:pr-6">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Principal</div>
                  <div className="text-lg font-black text-slate-900 flex items-center gap-2">Project Owner <UserCheck size={14} className="text-emerald-500" /></div>
               </div>
               <div className="flex-1 md:pl-6 pt-6 md:pt-0">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Executer</div>
                  <div className="text-lg font-black text-slate-900 flex items-center gap-2">{contract.installerName} <Shield size={14} className="text-primary" /></div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Valuation</span>
                <p className="text-3xl font-black font-headline text-slate-900 mt-1">
                  {formatCurrency(contract.totalAmount)}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Settlement Model</span>
                <div className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Banknote size={16} className="text-primary" /> Sunlit Escrow Milestones
                </div>
              </div>
            </div>

            <div className="mt-8">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Milestone Schedule</span>
              <div className="space-y-3">
                {contract.milestones.map((ms, i) => (
                  <div key={ms.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-md bg-white text-[10px] font-black flex items-center justify-center shadow-sm text-slate-500">0{i+1}</div>
                      <span className="text-sm font-bold text-slate-900">{ms.title}</span>
                    </div>
                    <span className="text-sm font-black">{formatCurrency(ms.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                By electronically signing this document, you acknowledge that you have read, understood, and agree to be bound by the Terms and Conditions of this Master Agreement. This digital signature carries the same legal weight as a physical signature under applicable law.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Signature Pad */}
        <div className="w-full lg:w-[420px] flex-shrink-0">
          <div className="bg-slate-950 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden sticky top-24">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl mix-blend-screen -translate-y-1/2 translate-x-1/2" />
            
            {success ? (
              <div className="text-center py-10 relative z-10 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-black mb-2 text-white">Cryptographically Signed</h3>
                <p className="text-sm text-slate-400 mb-8 font-medium">Your signature has been securely recorded and timestamped.</p>
                <Link href={`/dashboard/project-owner/projects/${contract.projectId}/escrow-funding`} className="w-full py-4 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                  Proceed to Escrow Funding
                </Link>
              </div>
            ) : (
              <div className="relative z-10">
                <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-2 mb-6">
                  <FileSignature className="text-primary" /> Authorization
                </h3>
                
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm font-bold flex items-center gap-2 mb-6">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Draw Signature</label>
                    <div className="sign-canvas-container">
                      <canvas
                        ref={canvasRef}
                        width={350}
                        height={160}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseOut={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full bg-white touch-none"
                      />
                      {hasSignature && (
                        <button onClick={clearCanvas} className="absolute top-2 right-2 w-6 h-6 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center transition-colors">
                          <X size={12} />
                        </button>
                      )}
                      {!hasSignature && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-300 font-medium text-sm">
                          Draw your signature here
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Legal Name Confirmation</label>
                    <input 
                      type="text" 
                      value={signedName}
                      onChange={e => setSignedName(e.target.value)}
                      placeholder="Type your full name" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                    />
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <button
                      onClick={handleSignSubmit}
                      disabled={!hasSignature || !signedName || isSubmitting}
                      className="w-full py-4 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                    >
                      {isSubmitting ? <Activity size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                      {isSubmitting ? 'Securing Signature...' : 'Sign & Authorize'}
                    </button>
                    <p className="text-[10px] font-mono text-slate-500 mt-4 text-center">
                      TS: {new Date().toISOString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
