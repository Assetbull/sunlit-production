'use client';

import { useState } from 'react';
import { Camera, User, MapPin, CheckCircle, Clock } from 'lucide-react';
import { getSession } from '@/shared/session/sessionManager';

export default function SettingsPage() {
  const session = getSession();
  const [name, setName] = useState(session?.name || '');
  const [address, setAddress] = useState('123 Victoria Island, Lagos');
  const [avatar, setAvatar] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuB-sZxUQXg8Fpx_-C0grjEAW3dKtZhdjU_RxOgkPdKxvfSRYQDcBOF6LMqhSMUJCNlMnU--2NGx3rONplD9M8SUXgJetqMIttyU3dBGBytltznoG95FQZjRSfFObhC3ZsFqb_QugZhFAnTszwEktxj6RqoDsEt7xYxeAXrdyGkVhUQNXl7A71tk6mbrpUxWp1SERX7EewuKpE5uYWhNmsVBlih5tIyUhjsFbinU_MPXHLnnhGmyymiNpziqMR2IZ9HaR21myi88yiaS');
  const [kycStatus, setKycStatus] = useState<'pending' | 'verified' | 'failed'>('pending');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-in stagger-children flex flex-col gap-10">
      <div className="border-b border-slate-100 pb-8">
        <h1 className="text-5xl font-extrabold font-headline text-slate-900 tracking-tight leading-tight">Identity <span className="text-primary">& Security</span></h1>
        <p className="text-lg text-slate-500 max-w-2xl mt-3">Manage your Vault Profile, update compliance protocols, and monitor KYC validation states.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="surface-card--glass p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-6">
            <h2 className="text-2xl font-extrabold font-headline text-slate-900 tracking-tight">Vault Profile Identity</h2>
            
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 relative group cursor-pointer bg-slate-100">
                <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/50 hidden group-hover:flex items-center justify-center transition-all">
                  <Camera size={24} className="text-white" />
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
              </div>
              <div>
                <button className="h-10 px-6 bg-slate-50 hover:bg-slate-100 rounded-xl font-bold text-sm transition-colors text-slate-700">Update Portrait</button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-extrabold tracking-widest uppercase text-slate-400 pl-1">Primary Representative</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-14 pl-12 bg-slate-50 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl transition-all font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold tracking-widest uppercase text-slate-400 pl-1">Verified Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                    <MapPin size={18} />
                  </div>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-14 pl-12 bg-slate-50 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl transition-all font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            <button className="h-14 mt-4 cta-gradient text-white rounded-2xl font-extrabold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
              Commit Changes
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-card--glass p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-6">
            <h2 className="text-2xl font-extrabold font-headline text-slate-900 tracking-tight">Compliance Oracle</h2>
            
            {kycStatus === 'pending' && (
              <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="flex mb-4 text-amber-500 items-center gap-3">
                  <Clock size={24} strokeWidth={2} />
                  <span className="font-extrabold font-headline text-lg">KYC Processing</span>
                </div>
                <p className="text-amber-800 text-sm font-bold leading-relaxed mb-4">
                  The Compliance Oracle is actively analyzing your identity data against NIBSS. Verification expected within 24 hours.
                </p>
                <div className="w-full bg-amber-200/50 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full animate-pulse w-2/3" />
                </div>
              </div>
            )}

            {kycStatus === 'verified' && (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="flex mb-4 text-primary items-center gap-3">
                  <CheckCircle size={24} strokeWidth={2} />
                  <span className="font-extrabold font-headline text-lg">Identity Verified</span>
                </div>
                <p className="text-emerald-800 text-sm font-bold leading-relaxed">
                  Your identity is secured and encrypted. Payment execution limits are fully unlocked.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
