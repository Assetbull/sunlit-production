import React from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, Target } from 'lucide-react';
import { RFQScreenProps } from './types';

export function BudgetPreferences({ data }: RFQScreenProps) {
  const { state, onUpdate, onNext, onBack } = data;

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <nav className="mb-8 md:mb-12">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline bg-transparent group">
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Back to Location
        </button>
      </nav>

      <main className="flex-1 flex flex-col xl:flex-row gap-12 lg:gap-16 items-center lg:items-start bg-surface-bright/85 backdrop-blur-[20px] rounded-2xl border border-surface-variant/50 shadow-sm p-8 md:p-12 lg:p-16">
        <div className="w-full xl:w-5/12 flex flex-col xl:sticky xl:top-32">
          <div className="mb-4">
            <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-primary"></span>
              Step 5 of 6
            </p>
            <h1 className="font-headline text-4xl lg:text-5xl font-extrabold tracking-[-0.02em] text-on-surface mb-6 leading-tight">
              Financial <br className="hidden xl:block"/>Protocols
            </h1>
            <p className="font-body text-base text-on-surface-variant leading-relaxed max-w-md">
              Define your budget constraints. Funds will be held securely in escrow and only released upon verified milestone completion.
            </p>
          </div>
        </div>

        <div className="w-full xl:w-7/12 flex flex-col gap-6">
          <div className="space-y-8">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex gap-6 items-center shadow-sm hover:border-primary/40 transition-colors">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-headline tracking-tight text-on-surface">Secure Payment Control</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed mt-1">
                  Protect your deployment funds via our encrypted vault. Funds are only dispersed to the installer 
                  after you approve physical milestone completion. Zero-risk infrastructure.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider block">Minimum Budget Target (₦)</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-on-surface-variant text-lg group-focus-within:text-primary transition-colors">₦</span>
                  <input
                    type="number"
                    className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl pl-10 pr-4 py-4 text-xl font-bold shadow-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="0"
                    value={state.budgetRangeMin}
                    onChange={e => onUpdate({ budgetRangeMin: e.target.value })}
                  />
                </div>
                {state.errors?.budgetRangeMin && <p className="text-xs text-error font-bold">{state.errors.budgetRangeMin}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider block">Maximum Budget Target (₦)</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-on-surface-variant text-lg group-focus-within:text-primary transition-colors">₦</span>
                  <input
                    type="number"
                    className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl pl-10 pr-4 py-4 text-xl font-bold shadow-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="0"
                    value={state.budgetRangeMax}
                    onChange={e => onUpdate({ budgetRangeMax: e.target.value })}
                  />
                </div>
                {state.errors?.budgetRangeMax && <p className="text-xs text-error font-bold">{state.errors.budgetRangeMax}</p>}
              </div>
            </div>

            {state.serverError && <p className="p-4 bg-error-container text-on-error-container rounded-xl font-bold text-center text-sm">{state.serverError}</p>}
          </div>

          <div className="flex justify-end mt-4 pt-8 border-t border-surface-variant/50 animate-in fade-in duration-300">
            <button 
              type="button"
              onClick={onNext}
              className="bg-gradient-to-r from-primary to-primary-container text-white font-label font-bold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              Continue to Review
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
