import React from 'react';
import { Home, Building2, Trees, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import { RFQScreenProps } from './types';

export function ProjectTypeSelection({ data }: RFQScreenProps) {
  const { state, onUpdate, onNext } = data;

  const handleSelect = (type: 'Residential' | 'Commercial' | 'Real Estate Development') => {
    onUpdate({ projectType: type });
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Contextual Navigation */}
      <nav className="mb-8 md:mb-12">
        <Link href="/dashboard/project-owner" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline bg-transparent group">
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>
      </nav>

      <main className="flex-1 flex flex-col xl:flex-row gap-12 lg:gap-16 items-center lg:items-start bg-surface-bright/85 backdrop-blur-[20px] rounded-2xl border border-surface-variant/50 shadow-sm p-8 md:p-12 lg:p-16">
        {/* Left Editorial Content */}
        <div className="w-full xl:w-5/12 flex flex-col xl:sticky xl:top-32">
          <div className="mb-4">
            <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-primary"></span>
              Step 1 of 5
            </p>
            <h1 className="font-headline text-4xl lg:text-5xl font-extrabold tracking-[-0.02em] text-on-surface mb-6 leading-tight">
              Select <br className="hidden xl:block"/>Project Type
            </h1>
            <p className="font-body text-base text-on-surface-variant leading-relaxed max-w-md">
              Select the category that best describes your upcoming installation. This helps us tailor the equipment recommendations and compliance requirements.
            </p>
          </div>
        </div>

        {/* Right Interactive Options */}
        <div className="w-full xl:w-7/12 flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4">
            {/* Residential */}
            <label className="group relative flex cursor-pointer w-full">
              <input className="peer sr-only" type="radio" checked={state.projectType === 'Residential'} onChange={() => handleSelect('Residential')} />
              <div className="w-full flex items-center gap-6 p-6 border-2 border-outline-variant/50 rounded-xl bg-surface-container-lowest transition-all duration-300 peer-checked:border-primary peer-checked:bg-secondary-container hover:border-primary hover:shadow-lg overflow-hidden">
                <div className="w-16 h-16 shrink-0 rounded-full bg-surface-bright flex items-center justify-center shadow-sm border border-surface-variant text-primary transition-colors peer-checked:bg-primary peer-checked:text-white">
                  <Home className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h2 className="font-headline text-xl font-bold tracking-tight text-on-surface peer-checked:text-on-secondary-container mb-1">Residential</h2>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                    Single-family homes or townhouses. Optimized for individual energy offset and battery storage integration.
                  </p>
                </div>
                <div className="w-6 h-6 rounded-full shrink-0 border-2 border-outline-variant flex items-center justify-center transition-colors group-hover:border-primary peer-checked:border-primary peer-checked:bg-primary ml-4">
                  <Check className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
              </div>
            </label>

            {/* Commercial */}
            <label className="group relative flex cursor-pointer w-full">
              <input className="peer sr-only" type="radio" checked={state.projectType === 'Commercial'} onChange={() => handleSelect('Commercial')} />
              <div className="w-full flex items-center gap-6 p-6 border-2 border-outline-variant/50 rounded-xl bg-surface-container-lowest transition-all duration-300 peer-checked:border-primary peer-checked:bg-secondary-container hover:border-primary hover:shadow-lg overflow-hidden relative">
                {/* AI Badge */}
                <div className="absolute top-0 right-8 bg-gradient-to-r from-primary to-primary-container text-white text-[10px] font-bold uppercase px-3 py-1 rounded-b-lg shadow-sm">
                  AI Suggestion
                </div>
                
                <div className="w-16 h-16 shrink-0 rounded-full bg-surface-bright flex items-center justify-center shadow-sm border border-surface-variant text-primary transition-colors peer-checked:bg-primary peer-checked:text-white">
                  <Building2 className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h2 className="font-headline text-xl font-bold tracking-tight text-on-surface peer-checked:text-on-secondary-container mb-1">Commercial</h2>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                    Retail, industrial, or office spaces. Designed for high capacity output and complex grid interconnection.
                  </p>
                </div>
                <div className="w-6 h-6 rounded-full shrink-0 border-2 border-outline-variant flex items-center justify-center transition-colors group-hover:border-primary peer-checked:border-primary peer-checked:bg-primary ml-4">
                  <Check className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
              </div>
            </label>

            {/* Real Estate Development */}
            <label className="group relative flex cursor-pointer w-full">
              <input className="peer sr-only" type="radio" checked={state.projectType === 'Real Estate Development'} onChange={() => handleSelect('Real Estate Development')} />
              <div className="w-full flex items-center gap-6 p-6 border-2 border-outline-variant/50 rounded-xl bg-surface-container-lowest transition-all duration-300 peer-checked:border-primary peer-checked:bg-secondary-container hover:border-primary hover:shadow-lg overflow-hidden">
                <div className="w-16 h-16 shrink-0 rounded-full bg-surface-bright flex items-center justify-center shadow-sm border border-surface-variant text-primary transition-colors peer-checked:bg-primary peer-checked:text-white">
                  <Trees className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h2 className="font-headline text-xl font-bold tracking-tight text-on-surface peer-checked:text-on-secondary-container mb-1">Real Estate Development</h2>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                    Multi-family units or new housing tracts. Built for scalable deployment and community solar models.
                  </p>
                </div>
                <div className="w-6 h-6 rounded-full shrink-0 border-2 border-outline-variant flex items-center justify-center transition-colors group-hover:border-primary peer-checked:border-primary peer-checked:bg-primary ml-4">
                  <Check className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
              </div>
            </label>
          </div>

          {state.projectType && (
            <div className="flex justify-end mt-4 pt-8 border-t border-surface-variant/50 animate-in fade-in duration-300">
              <button 
                type="button"
                onClick={onNext}
                className="bg-gradient-to-r from-primary to-primary-container text-white font-label font-bold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                Continue to Project Path
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
