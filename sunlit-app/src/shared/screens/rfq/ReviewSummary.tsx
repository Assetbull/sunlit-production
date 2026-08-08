import React from 'react';
import { ArrowLeft, Target, FileText, MapPin, DollarSign, Settings, CheckCircle2 } from 'lucide-react';
import { RFQScreenProps } from './types';

export function ReviewSummary({ data }: RFQScreenProps) {
  const { state, onSubmit, onBack } = data;

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <nav className="mb-8 md:mb-12">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline bg-transparent group">
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Back to Budget
        </button>
      </nav>

      <main className="flex-1 flex flex-col xl:flex-row gap-12 lg:gap-16 items-center lg:items-start bg-surface-bright/85 backdrop-blur-[20px] rounded-2xl border border-surface-variant/50 shadow-sm p-8 md:p-12 lg:p-16">
        <div className="w-full xl:w-5/12 flex flex-col xl:sticky xl:top-32">
          <div className="mb-4">
            <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-primary"></span>
              Step 6 of 6
            </p>
            <h1 className="font-headline text-4xl lg:text-5xl font-extrabold tracking-[-0.02em] text-on-surface mb-6 leading-tight">
              Review & <br className="hidden xl:block"/>AI Summary
            </h1>
            <p className="font-body text-base text-on-surface-variant leading-relaxed max-w-md mb-6">
              Review your comprehensive RFQ details. Our intelligence engine has compiled your specifications for the marketplace.
            </p>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex gap-4 items-start shadow-sm mt-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-on-surface">Marketplace Ready</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed mt-1">
                  Your project is structured correctly and is ready to be broadcasted to certified {state.projectType?.toLowerCase()} installers in {state.locationState}.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full xl:w-7/12 flex flex-col gap-6">
          <div className="space-y-6">
            
            {/* General Info */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-surface-variant/50 pb-4">
                <FileText className="text-primary w-5 h-5" />
                <h3 className="font-headline text-lg font-bold tracking-tight">Project Overview</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Title</p>
                  <p className="font-medium text-on-surface">{state.projectTitle || 'Untitled Project'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Type</p>
                  <p className="font-medium text-on-surface">{state.projectType}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Path</p>
                  <p className="font-medium text-on-surface capitalize">{state.projectPath}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">System Size</p>
                  <p className="font-medium text-on-surface">{state.systemSizeKw || '5'} kW</p>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-surface-variant/50 pb-4">
                <Settings className="text-primary w-5 h-5" />
                <h3 className="font-headline text-lg font-bold tracking-tight">Technical Specifications</h3>
              </div>
              <div className="space-y-4">
                {state.projectPath === 'appliance' ? (
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Selected Appliances</p>
                    <div className="flex flex-wrap gap-2">
                      {state.selectedAppliances?.length > 0 ? state.selectedAppliances.map(app => (
                        <span key={app} className="bg-surface-variant/30 text-on-surface text-sm px-3 py-1 rounded-full font-medium">{app}</span>
                      )) : <span className="text-sm text-on-surface-variant">General Load</span>}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Inverter</p>
                      <p className="font-medium text-on-surface">{state.invCapacity} {state.invType}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Battery</p>
                      <p className="font-medium text-on-surface">{state.battUnits}x {state.battCapacity}kWh {state.battChem}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Panels</p>
                      <p className="font-medium text-on-surface">{state.panelCount}x {state.panelWattage}W {state.panelType}</p>
                    </div>
                  </div>
                )}
                
                {state.description && (
                  <div className="pt-2">
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Additional Notes</p>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{state.description}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location & SLA */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4 border-b border-surface-variant/50 pb-4">
                  <MapPin className="text-primary w-5 h-5" />
                  <h3 className="font-headline text-lg font-bold tracking-tight">Deployment</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Location</p>
                    <p className="font-medium text-on-surface">{state.locationCity}, {state.locationState}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">SLA Target</p>
                    <p className="font-medium text-on-surface">{state.timelineDays} Days</p>
                  </div>
                </div>
              </div>

              {/* Financials */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4 border-b border-surface-variant/50 pb-4">
                  <DollarSign className="text-primary w-5 h-5" />
                  <h3 className="font-headline text-lg font-bold tracking-tight">Budget Range</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Minimum</p>
                    <p className="font-bold text-on-surface text-lg">₦ {parseInt(state.budgetRangeMin || '0').toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Maximum</p>
                    <p className="font-bold text-on-surface text-lg">₦ {parseInt(state.budgetRangeMax || '0').toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {state.serverError && <p className="p-4 bg-error-container text-on-error-container rounded-xl font-bold text-center text-sm">{state.serverError}</p>}
          </div>

          <div className="flex justify-end mt-4 pt-8 border-t border-surface-variant/50 animate-in fade-in duration-300">
            <button 
              type="button"
              onClick={onSubmit}
              disabled={state.status === 'loading'}
              className="bg-gradient-to-r from-primary to-primary-container text-white font-label font-bold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {state.status === 'loading' ? 'Securing RFQ...' : 'Secure & Publish RFQ'}
              <Target className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
