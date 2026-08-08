'use client';

import { useState, useEffect } from 'react';

interface EquipmentSpecsProps {
  onUpdate: (appliances: string[], totalKw: string) => void;
}

export default function EquipmentSpecs({ onUpdate }: EquipmentSpecsProps) {
  const [inverterSize, setInverterSize] = useState('');
  const [panelWattage, setPanelWattage] = useState('');
  const [panelUnits, setPanelUnits] = useState('');
  const [batteryStorage, setBatteryStorage] = useState('');
  const [batteryUnits, setBatteryUnits] = useState('');
  const [accessories, setAccessories] = useState<string[]>(['Surge Protection']);

  useEffect(() => {
    const specs = [];
    let systemSizeKw = '0';

    if (inverterSize) specs.push(`${inverterSize}kVA Inverter`);
    if (panelWattage && panelUnits) {
      specs.push(`${panelUnits}x ${panelWattage}W Panels`);
      systemSizeKw = ((parseFloat(panelWattage) * parseInt(panelUnits)) / 1000).toFixed(1);
    }
    if (batteryStorage && batteryUnits) specs.push(`${batteryUnits}x ${batteryStorage}kWh Battery`);
    specs.push(...accessories);

    onUpdate(specs, systemSizeKw || inverterSize || '0');
  }, [inverterSize, panelWattage, panelUnits, batteryStorage, batteryUnits, accessories, onUpdate]);

  const toggleAccessory = (acc: string) => {
    setAccessories(prev => 
      prev.includes(acc) ? prev.filter(x => x !== acc) : [...prev, acc]
    );
  };

  return (
    <div className="space-y-8 animate-in">
      <section className="bg-white/85 backdrop-blur-md shadow-sm rounded-xl border-2 border-surface-3/40 p-6 lg:p-8 transition-colors duration-300 hover:border-primary/30">
        <div className="mb-6 border-b border-surface-2 pb-4">
          <h2 className="font-headline text-lg font-bold text-on-surface">Core System Components</h2>
          <p className="font-body text-sm text-muted mt-1 leading-relaxed">Specify the capacity and quantity for the primary solar hardware required for this project.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-4">
            <div>
              <label className="block font-label text-sm font-medium text-on-surface mb-1.5" htmlFor="inverter-size">Inverter Size</label>
              <div className="relative">
                <select 
                  id="inverter-size"
                  className="w-full bg-surface-1 border-0 border-b-2 border-surface-3 rounded-t-sm focus:border-primary focus:ring-0 text-on-surface font-body text-sm py-2.5 pl-3 pr-10 appearance-none transition-colors"
                  value={inverterSize}
                  onChange={e => setInverterSize(e.target.value)}
                >
                  <option value="" disabled>Select kVA</option>
                  <option value="3">3 kVA</option>
                  <option value="5">5 kVA</option>
                  <option value="8">8 kVA</option>
                  <option value="10">10 kVA</option>
                  <option value="15">15 kVA</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-label text-sm font-medium text-on-surface mb-1.5" htmlFor="panel-wattage">Panel Wattage</label>
                <div className="relative">
                  <select 
                    id="panel-wattage"
                    className="w-full bg-surface-1 border-0 border-b-2 border-surface-3 rounded-t-sm focus:border-primary focus:ring-0 text-on-surface font-body text-sm py-2.5 pl-3 pr-8 appearance-none transition-colors"
                    value={panelWattage}
                    onChange={e => setPanelWattage(e.target.value)}
                  >
                    <option value="" disabled>Watts</option>
                    <option value="450">450 W</option>
                    <option value="550">550 W</option>
                    <option value="600">600 W</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-label text-sm font-medium text-on-surface mb-1.5" htmlFor="panel-units">Panel Units</label>
                <div className="relative">
                  <select 
                    id="panel-units"
                    className="w-full bg-surface-1 border-0 border-b-2 border-surface-3 rounded-t-sm focus:border-primary focus:ring-0 text-on-surface font-body text-sm py-2.5 pl-3 pr-8 appearance-none transition-colors"
                    value={panelUnits}
                    onChange={e => setPanelUnits(e.target.value)}
                  >
                    <option value="" disabled>Qty</option>
                    <option value="6">6</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="25">25</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 md:col-span-2 mt-2">
            <h3 className="font-headline font-semibold text-sm uppercase tracking-wider text-muted border-t border-surface-2 pt-6">Energy Storage</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-label text-sm font-medium text-on-surface mb-1.5" htmlFor="battery-storage">Battery Storage</label>
                <div className="relative">
                  <select 
                    id="battery-storage"
                    className="w-full bg-surface-1 border-0 border-b-2 border-surface-3 rounded-t-sm focus:border-primary focus:ring-0 text-on-surface font-body text-sm py-2.5 pl-3 pr-10 appearance-none transition-colors"
                    value={batteryStorage}
                    onChange={e => setBatteryStorage(e.target.value)}
                  >
                    <option value="" disabled>Select kWh</option>
                    <option value="5">5 kWh</option>
                    <option value="10">10 kWh</option>
                    <option value="15">15 kWh</option>
                    <option value="20">20 kWh</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-label text-sm font-medium text-on-surface mb-1.5" htmlFor="battery-units">Battery Units</label>
                <div className="relative">
                  <select 
                    id="battery-units"
                    className="w-full bg-surface-1 border-0 border-b-2 border-surface-3 rounded-t-sm focus:border-primary focus:ring-0 text-on-surface font-body text-sm py-2.5 pl-3 pr-10 appearance-none transition-colors"
                    value={batteryUnits}
                    onChange={e => setBatteryUnits(e.target.value)}
                  >
                    <option value="" disabled>Select quantity</option>
                    <option value="1">1 Unit</option>
                    <option value="2">2 Units</option>
                    <option value="3">3 Units</option>
                    <option value="4">4 Units</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white/85 backdrop-blur-md shadow-sm rounded-xl border-2 border-surface-3/40 p-6 transition-colors duration-300 hover:border-primary/30">
        <div className="mb-4">
          <h2 className="font-headline text-lg font-bold text-on-surface">Additional Accessories</h2>
          <p className="font-body text-sm text-muted mt-1">Select necessary balance of system components.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { id: 'Mounting Rails', desc: 'Aluminum roof mounts' },
            { id: 'DC Combiner Box', desc: 'Multi-string protection' },
            { id: 'Surge Protection', desc: 'AC/DC arresters' }
          ].map(acc => (
            <label key={acc.id} className="flex items-start gap-3 p-3 rounded-lg border border-surface-2 bg-surface-1 hover:bg-surface-2 transition-colors cursor-pointer group">
              <div className="flex items-center h-5 mt-0.5">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-primary bg-surface border-surface-3 rounded focus:ring-primary focus:ring-2 focus:ring-offset-1" 
                  checked={accessories.includes(acc.id)}
                  onChange={() => toggleAccessory(acc.id)}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-body text-sm font-medium text-on-surface group-hover:text-primary transition-colors">{acc.id}</span>
                <span className="font-body text-xs text-muted mt-0.5">{acc.desc}</span>
              </div>
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
