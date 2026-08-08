import React from 'react';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import { RFQScreenProps } from './types';
import { NIGERIA_STATES } from '@/dashboards/project-owner/types/dashboard';

export function LocationIntelligence({ data }: RFQScreenProps) {
  const { state, onUpdate, onNext, onBack } = data;

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <nav className="mb-8 md:mb-12">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline bg-transparent group">
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Back to Specifications
        </button>
      </nav>

      <main className="flex-1 flex flex-col xl:flex-row gap-12 lg:gap-16 items-center lg:items-start bg-surface-bright/85 backdrop-blur-[20px] rounded-2xl border border-surface-variant/50 shadow-sm p-8 md:p-12 lg:p-16">
        <div className="w-full xl:w-5/12 flex flex-col xl:sticky xl:top-32">
          <div className="mb-4">
            <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-primary"></span>
              Step 4 of 5
            </p>
            <h1 className="font-headline text-4xl lg:text-5xl font-extrabold tracking-[-0.02em] text-on-surface mb-6 leading-tight">
              Location <br className="hidden xl:block"/>Intelligence
            </h1>
            <p className="font-body text-base text-on-surface-variant leading-relaxed max-w-md">
              Set the geographic location and the expected completion timeline for your solar infrastructure deployment.
            </p>
          </div>
        </div>

        <div className="w-full xl:w-7/12 flex flex-col gap-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider block">Project Identifier</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-4 text-base font-medium shadow-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="e.g. 5kW Residential Installation"
                  value={state.projectTitle}
                  onChange={e => onUpdate({ projectTitle: e.target.value })}
                />
              </div>
              {state.errors?.projectTitle && <p className="text-xs text-error font-bold">{state.errors.projectTitle}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider block">Field State</label>
                <select
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-4 text-base font-medium shadow-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                  value={state.locationState}
                  onChange={e => onUpdate({ locationState: e.target.value })}
                >
                  <option value="">Select State</option>
                  {NIGERIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {state.errors?.locationState && <p className="text-xs text-error font-bold">{state.errors.locationState}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider block">City / Hub</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 w-5 h-5" />
                  <input
                    type="text"
                    className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl pl-12 pr-4 py-4 text-base font-medium shadow-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="e.g. Lekki Phase 1"
                    value={state.locationCity}
                    onChange={e => onUpdate({ locationCity: e.target.value })}
                  />
                </div>
                {state.errors?.locationCity && <p className="text-xs text-error font-bold">{state.errors.locationCity}</p>}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <label className="text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider block">Operation SLA (Days)</label>
              <div className="flex items-center gap-4">
                {[15, 30, 45, 60].map(days => (
                  <button
                    key={days}
                    type="button"
                    className={`flex-1 py-4 rounded-xl border-2 font-bold transition-all text-sm ${state.timelineDays === days.toString() ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant hover:border-outline-variant'}`}
                    onClick={() => onUpdate({ timelineDays: days.toString() })}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>

            {state.projectPath === 'appliance' && (
              <div className="space-y-2 pt-4">
                <label className="text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider block">Additional Requirements</label>
                <textarea
                  placeholder="Describe your goals, specialized equipment preferences, or any site constraints..."
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 text-base shadow-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[140px]"
                  value={state.description}
                  onChange={e => onUpdate({ description: e.target.value })}
                />
              </div>
            )}
            {state.projectPath === 'installation' && (
              <div className="space-y-2 pt-4">
                <label className="text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider block">Notes for Installer</label>
                <textarea
                  placeholder="Mention any specific wiring preferences, mounting constraints, or site access details..."
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 text-base shadow-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[140px]"
                  value={state.description}
                  onChange={e => onUpdate({ description: e.target.value })}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end mt-4 pt-8 border-t border-surface-variant/50 animate-in fade-in duration-300">
            <button 
              type="button"
              onClick={onNext}
              className="bg-gradient-to-r from-primary to-primary-container text-white font-label font-bold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              Continue to Budgeting
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
