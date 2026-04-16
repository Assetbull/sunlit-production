'use client';

import { useState } from 'react';
import { Search, Plus, Minus, Trash2, Zap } from 'lucide-react';

interface Appliance {
  id: string;
  name: string;
  wattage: number;
  count: number;
  category: string;
}

const SUGGESTED_APPLIANCES = [
  { name: 'Inverter AC (1.5HP)', wattage: 1200, category: 'Cooling' },
  { name: 'Refrigerator', wattage: 250, category: 'Kitchen' },
  { name: 'LED Smart TV (55")', wattage: 100, category: 'Entertainment' },
  { name: 'Washing Machine', wattage: 500, category: 'Laundry' },
  { name: 'Ceiling Fan', wattage: 75, category: 'Cooling' },
  { name: 'Borehole Pump', wattage: 1500, category: 'Water' },
];

interface ApplianceLoadSizerProps {
  onUpdate: (appliances: string[], totalKw: string) => void;
}

export default function ApplianceLoadSizer({ onUpdate }: ApplianceLoadSizerProps) {
  const [selected, setSelected] = useState<Appliance[]>([]);
  const [search, setSearch] = useState('');
  const [customName, setCustomName] = useState('');
  const [customWatt, setCustomWatt] = useState('');

  const updateParent = (current: Appliance[]) => {
    const names = current.map(a => `${a.name} (x${a.count})`);
    const totalW = current.reduce((acc, a) => acc + (a.wattage * a.count), 0);
    // Rough estimate for system size (kW) = Total Peak Wattage / 1000 * 1.2 (buffer)
    const kVa = ((totalW / 1000) * 1.25).toFixed(1);
    onUpdate(names, kVa);
  };

  const addAppliance = (app: { name: string; wattage: number }) => {
    const existing = selected.find(a => a.name === app.name);
    let next;
    if (existing) {
      next = selected.map(a => a.name === app.name ? { ...a, count: a.count + 1 } : a);
    } else {
      next = [...selected, { id: Math.random().toString(), ...app, count: 1, category: 'Other' }];
    }
    setSelected(next);
    updateParent(next);
    setSearch('');
  };

  const modifyCount = (id: string, delta: number) => {
    const next = selected.map(a => {
      if (a.id === id) {
        const count = Math.max(1, a.count + delta);
        return { ...a, count };
      }
      return a;
    });
    setSelected(next);
    updateParent(next);
  };

  const remove = (id: string) => {
    const next = selected.filter(a => a.id !== id);
    setSelected(next);
    updateParent(next);
  };

  const filtered = SUGGESTED_APPLIANCES.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) && 
    !selected.some(s => s.name === a.name)
  );

  return (
    <div className="space-y-8 animate-in transition-all">
      <div className="relative">
        <div className="flex items-center gap-4 glass-card p-2 border border-white/20 rounded-2xl shadow-xl">
          <div className="flex-grow flex items-center px-4 gap-3">
            <Search className="text-primary" size={20} />
            <input 
              type="text" 
              className="w-full bg-transparent border-none focus:ring-0 text-slate-900 font-body py-3" 
              placeholder="Search appliances (e.g. Inverter AC, Pump...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {search && filtered.length > 0 && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white/90 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl z-20 overflow-hidden">
            <div className="p-2">
              {filtered.map(app => (
                <div 
                  key={app.name} 
                  className="flex items-center gap-4 p-4 hover:bg-emerald-50 rounded-xl cursor-pointer transition-colors"
                  onClick={() => addAppliance(app)}
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Zap className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{app.name}</p>
                    <p className="text-xs text-slate-500">{app.wattage}W peak load</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Selected Inventory</p>
        <div className="grid grid-cols-1 gap-4">
          {selected.map(app => (
            <div key={app.id} className="bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-sm flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-primary shadow-inner">
                  <Zap size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 font-headline">{app.name}</h4>
                  <p className="text-xs text-slate-500">{app.wattage}W per unit</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-full border border-slate-100">
                  <button 
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                    onClick={() => modifyCount(app.id, -1)}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-6 text-center font-bold text-slate-900">{app.count}</span>
                  <button 
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                    onClick={() => modifyCount(app.id, 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button 
                  className="text-slate-300 hover:text-red-500 transition-colors p-2"
                  onClick={() => remove(app.id)}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}

          {selected.length === 0 && (
            <div className="h-32 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Zap size={32} strokeWidth={1} />
              <p className="text-sm font-medium">Add appliances to see your energy profile</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100 space-y-6">
        <h3 className="text-lg font-bold text-emerald-900 font-headline">Custom Entry</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-emerald-800/60 block px-1">Appliance Name</label>
            <input 
              type="text" 
              className="w-full bg-white border-none rounded-xl p-4 text-emerald-900 focus:ring-2 focus:ring-emerald-500 shadow-sm"
              placeholder="e.g. Electric Cooker"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-emerald-800/60 block px-1">Wattage (W)</label>
            <input 
              type="number" 
              className="w-full bg-white border-none rounded-xl p-4 text-emerald-900 focus:ring-2 focus:ring-emerald-500 shadow-sm"
              placeholder="1500"
              value={customWatt}
              onChange={(e) => setCustomWatt(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <button 
              className="w-full py-4 border-2 border-emerald-600 text-emerald-700 rounded-xl font-bold hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2"
              onClick={() => {
                if (customName && customWatt) {
                  addAppliance({ name: customName, wattage: parseInt(customWatt) });
                  setCustomName('');
                  setCustomWatt('');
                }
              }}
            >
              <Plus size={20} />
              Add Custom
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
