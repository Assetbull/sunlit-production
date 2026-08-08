import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function FinalPublishEngine() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full bg-primary/10 blur-[120px] mix-blend-screen"></div>
      </div>

      <div className="bg-surface-bright p-12 rounded-3xl border border-surface-variant/50 text-center max-w-xl w-full shadow-2xl relative z-10 backdrop-blur-md">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-primary/20">
          <CheckCircle className="text-primary w-12 h-12" />
        </div>
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface mb-4">RFQ Secured & Published</h1>
        <p className="font-body text-lg text-on-surface-variant mb-10 leading-relaxed max-w-md mx-auto">
          Your project is now live in the Sunlit Marketplace. Our matching engine is actively notifying certified installers in your region.
        </p>
        <button 
          onClick={() => router.push('/dashboard/project-owner')}
          className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all"
        >
          Go to Command Center
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
