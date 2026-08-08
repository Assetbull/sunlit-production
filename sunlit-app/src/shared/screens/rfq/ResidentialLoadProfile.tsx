import React, { useMemo } from 'react';
import { ArrowLeft, ArrowRight, Battery, Cpu, PanelTop } from 'lucide-react';
import { RFQScreenProps } from './types';
import EquipmentSpecs from '../../../app/dashboard/project-owner/rfq/new/components/EquipmentSpecs';
import SizingSidebar from '../../../app/dashboard/project-owner/rfq/new/components/SizingSidebar';

export function ResidentialLoadProfile({ data }: RFQScreenProps) {
  const { state, onUpdate, onNext, onBack } = data;

  const totalConsumption = useMemo(() => {
    return parseFloat(state.systemSizeKw || '0') * 4.5;
  }, [state.systemSizeKw]);

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <nav className="mb-8 md:mb-12">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline bg-transparent group">
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Back to Project Path
        </button>
      </nav>

      <main className="flex-1 flex flex-col xl:flex-row gap-12 lg:gap-16 items-center lg:items-start bg-surface-bright/85 backdrop-blur-[20px] rounded-2xl border border-surface-variant/50 shadow-sm p-8 md:p-12 lg:p-16">
        <div className="w-full xl:w-5/12 flex flex-col xl:sticky xl:top-32">
          <div className="mb-4">
            <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-primary"></span>
              Step 3 of 5
            </p>
            <h1 className="font-headline text-4xl lg:text-5xl font-extrabold tracking-[-0.02em] text-on-surface mb-6 leading-tight">
              Equipment <br className="hidden xl:block"/>Specifications
            </h1>
            <p className="font-body text-base text-on-surface-variant leading-relaxed max-w-md">
              {state.projectPath === 'appliance' 
                ? 'Select your household appliances to let our engine calculate the ideal residential solar array size for your project.' 
                : 'Detail the specifications of your existing solar equipment to ensure precise installer matching.'}
            </p>
          </div>
        </div>

        <div className="w-full xl:w-7/12 flex flex-col gap-6">
          {state.projectPath === 'appliance' ? (
             <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-6 overflow-hidden">
                <EquipmentSpecs 
                  onUpdate={(apps: string[], size: string) => {
                    onUpdate({ selectedAppliances: apps, systemSizeKw: size });
                  }} 
                />
                <div className="mt-8 border-t border-surface-variant pt-6">
                  <SizingSidebar 
                    consumption={totalConsumption} 
                    systemSize={state.systemSizeKw === '0' ? '---' : state.systemSizeKw} 
                  />
                </div>
             </div>
          ) : (
            <div className="space-y-6">
              <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-6 md:p-8 hover:border-outline-variant transition-colors shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Cpu className="text-primary w-6 h-6" />
                  <h3 className="font-headline text-xl font-bold tracking-tight">Inverter Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">Inverter Capacity</label>
                    <select 
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3.5 focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body appearance-none transition-colors font-medium"
                      value={state.invCapacity}
                      onChange={e => onUpdate({ invCapacity: e.target.value })}
                    >
                      <option value="" disabled>Select capacity</option>
                      <option value="1kVA">1kVA</option>
                      <option value="3kVA">3kVA</option>
                      <option value="5kVA">5kVA</option>
                      <option value="10kVA">10kVA</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="relative">
                    <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">Inverter Type</label>
                    <select 
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3.5 focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body appearance-none transition-colors font-medium"
                      value={state.invType}
                      onChange={e => onUpdate({ invType: e.target.value })}
                    >
                      <option value="" disabled>Select type</option>
                      <option value="Pure Sine Wave">Pure Sine Wave</option>
                      <option value="Modified Sine Wave">Modified Sine Wave</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>
              </section>

              <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-6 md:p-8 hover:border-outline-variant transition-colors shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Battery className="text-primary w-6 h-6" />
                  <h3 className="font-headline text-xl font-bold tracking-tight">Battery Storage</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">Capacity (kWh)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 5"
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3.5 focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body transition-colors font-medium"
                      value={state.battCapacity}
                      onChange={e => onUpdate({ battCapacity: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">Quantity</label>
                    <div className="flex items-center border border-outline-variant/40 bg-surface-container-low rounded-xl overflow-hidden">
                      <button type="button" onClick={() => onUpdate({ battUnits: String(Math.max(1, parseInt(state.battUnits||'1')-1)) })} className="p-3.5 text-on-surface-variant hover:bg-surface-variant transition-colors text-xl font-bold px-4">-</button>
                      <input type="number" value={state.battUnits} readOnly className="w-full bg-transparent border-none text-center focus:ring-0 text-on-surface font-body p-0 font-bold" />
                      <button type="button" onClick={() => onUpdate({ battUnits: String(parseInt(state.battUnits||'1')+1) })} className="p-3.5 text-on-surface-variant hover:bg-surface-variant transition-colors text-xl font-bold px-4">+</button>
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">Chemistry</label>
                    <select 
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3.5 focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body appearance-none transition-colors font-medium"
                      value={state.battChem}
                      onChange={e => onUpdate({ battChem: e.target.value })}
                    >
                      <option value="" disabled>Select chemistry</option>
                      <option value="Lithium-ion">Lithium-ion</option>
                      <option value="Lead Acid">Lead Acid</option>
                      <option value="Tubular">Tubular</option>
                    </select>
                  </div>
                </div>
              </section>

              <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-6 md:p-8 hover:border-outline-variant transition-colors shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <PanelTop className="text-primary w-6 h-6" />
                  <h3 className="font-headline text-xl font-bold tracking-tight">Solar Panels</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">Wattage (W)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 400"
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3.5 focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body transition-colors font-medium"
                      value={state.panelWattage}
                      onChange={e => onUpdate({ panelWattage: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">Total Count</label>
                    <div className="flex items-center border border-outline-variant/40 bg-surface-container-low rounded-xl overflow-hidden">
                      <button type="button" onClick={() => onUpdate({ panelCount: String(Math.max(1, parseInt(state.panelCount||'10')-1)) })} className="p-3.5 text-on-surface-variant hover:bg-surface-variant transition-colors text-xl font-bold px-4">-</button>
                      <input type="number" value={state.panelCount} readOnly className="w-full bg-transparent border-none text-center focus:ring-0 text-on-surface font-body p-0 font-bold" />
                      <button type="button" onClick={() => onUpdate({ panelCount: String(parseInt(state.panelCount||'10')+1) })} className="p-3.5 text-on-surface-variant hover:bg-surface-variant transition-colors text-xl font-bold px-4">+</button>
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">Panel Type</label>
                    <select 
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3.5 focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body appearance-none transition-colors font-medium"
                      value={state.panelType}
                      onChange={e => onUpdate({ panelType: e.target.value })}
                    >
                      <option value="" disabled>Select type</option>
                      <option value="Monocrystalline">Monocrystalline</option>
                      <option value="Polycrystalline">Polycrystalline</option>
                    </select>
                  </div>
                </div>
              </section>
            </div>
          )}

          <div className="flex justify-end mt-4 pt-8 border-t border-surface-variant/50 animate-in fade-in duration-300">
            <button 
              type="button"
              onClick={onNext}
              className="bg-gradient-to-r from-primary to-primary-container text-white font-label font-bold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              Continue to Deployment
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
