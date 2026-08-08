import React from 'react';
import { ArrowLeft, ArrowRight, Check, HardHat, ListChecks } from 'lucide-react';
import { RFQScreenProps } from './types';

export function ModelingTypeSelection({ data }: RFQScreenProps) {
  const { state, onUpdate, onNext, onBack } = data;

  const handleSelect = (path: 'installation' | 'appliance') => {
    onUpdate({ projectPath: path });
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <nav className="mb-8 md:mb-12">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline bg-transparent group">
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Back to Project Type
        </button>
      </nav>

      <main className="flex-1 flex flex-col xl:flex-row gap-12 lg:gap-16 items-center lg:items-start bg-surface-bright/85 backdrop-blur-[20px] rounded-2xl border border-surface-variant/50 shadow-sm p-8 md:p-12 lg:p-16">
        <div className="w-full xl:w-5/12 flex flex-col xl:sticky xl:top-32">
          <div className="mb-4">
            <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-primary"></span>
              Step 2 of 5
            </p>
            <h1 className="font-headline text-4xl lg:text-5xl font-extrabold tracking-[-0.02em] text-on-surface mb-6 leading-tight">
              Select your <br className="hidden xl:block"/>project path.
            </h1>
            <p className="font-body text-base text-on-surface-variant leading-relaxed max-w-md">
              Determine how you want to approach your solar installation. Whether you bring your own gear or need a full system designed, we'll guide you to the right experts.
            </p>
          </div>
        </div>

        <div className="w-full xl:w-7/12 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="cursor-pointer group relative">
              <input className="peer sr-only" type="radio" checked={state.projectPath === 'installation'} onChange={() => handleSelect('installation')} />
              <div className="h-full bg-surface-container-lowest rounded-xl p-8 border-2 border-outline-variant/40 transition-all duration-300 peer-checked:border-primary peer-checked:bg-secondary-container hover:border-primary hover:bg-surface-container-low relative overflow-hidden shadow-sm">
                <div className="absolute top-6 right-6 w-6 h-6 rounded-full border-2 border-outline-variant group-hover:border-primary peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-colors">
                  <Check className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <div className="mb-6 h-16 w-16 bg-surface-container-low rounded-xl flex items-center justify-center border border-surface-variant/50 group-hover:bg-white transition-colors">
                  <HardHat className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-headline text-2xl font-bold text-on-surface mb-3 tracking-[-0.02em]">System Installation</h3>
                <p className="font-body text-on-surface-variant leading-relaxed text-sm">
                  I already have my solar equipment (panels, inverter, batteries) and need a certified installer to perform the installation and commissioning.
                </p>
              </div>
            </label>

            <label className="cursor-pointer group relative">
              <input className="peer sr-only" type="radio" checked={state.projectPath === 'appliance'} onChange={() => handleSelect('appliance')} />
              <div className="h-full bg-surface-container-lowest rounded-xl p-8 border-2 border-outline-variant/40 transition-all duration-300 peer-checked:border-primary peer-checked:bg-secondary-container hover:border-primary hover:bg-surface-container-low relative overflow-hidden shadow-sm">
                <div className="absolute top-6 right-6 w-6 h-6 rounded-full border-2 border-outline-variant group-hover:border-primary peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-colors">
                  <Check className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <div className="mb-6 h-16 w-16 bg-surface-container-low rounded-xl flex items-center justify-center border border-surface-variant/50 group-hover:bg-white transition-colors">
                  <ListChecks className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-headline text-2xl font-bold text-on-surface mb-3 tracking-[-0.02em]">Appliance-Based Design</h3>
                <p className="font-body text-on-surface-variant leading-relaxed text-sm">
                  I don't have equipment yet. I want a system recommendation based on my daily electrical load (ACs, fans, lighting, etc.).
                </p>
              </div>
            </label>
          </div>

          {state.projectPath && (
            <div className="flex justify-end mt-4 pt-8 border-t border-surface-variant/50 animate-in fade-in duration-300">
              <button 
                type="button"
                onClick={onNext}
                className="bg-gradient-to-r from-primary to-primary-container text-white font-label font-bold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                Continue to Specifications
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
