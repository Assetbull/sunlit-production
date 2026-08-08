'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  Briefcase,
  MapPin,
  Calendar,
  HardHat,
  Minus,
  Plus,
  Coins,
  Zap,
  Send,
  CheckCircle
} from 'lucide-react';

export default function PostCrewJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    duration: '',
    crewSize: 2,
    skills: ['roofer'],
    payRate: '',
    boost: false
  });

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => {
      if (prev.skills.includes(skill)) {
        return { ...prev, skills: prev.skills.filter(s => s !== skill) };
      } else {
        return { ...prev, skills: [...prev.skills, skill] };
      }
    });
  };

  const handleCrewSizeChange = (delta: number) => {
    setFormData(prev => ({
      ...prev,
      crewSize: Math.max(1, Math.min(20, prev.crewSize + delta))
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API Call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/installer/crewlink');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="flex-1 min-h-screen bg-surface p-8 lg:p-12 flex flex-col relative pb-32">
      {success && (
        <div className="mb-8 max-w-[1200px] mx-auto w-full p-6 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-4 text-on-surface shadow-sm">
          <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center shrink-0 shadow-sm border border-surface-container">
             <CheckCircle className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-lg">Position Posted Successfully</h3>
            <p className="text-muted text-sm mt-1">This job is now visible on the CrewLink Worker Board. Redirecting...</p>
          </div>
        </div>
      )}

      {/* Contextual Header */}
      <div className="mb-10 max-w-[1200px] mx-auto w-full">
        <Link href="/dashboard/installer/crewlink" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-[18px] h-[18px]" />
          Back to CrewLink Overview
        </Link>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-headline text-4xl lg:text-[40px] font-extrabold tracking-tight text-on-surface leading-tight mb-2">Post New Job</h1>
            <p className="text-on-surface-variant text-lg">Broadcast your labor requirements to the verified network.</p>
          </div>
        </div>
      </div>

      {/* Form Bento Grid */}
      <form onSubmit={handleSubmit} className="max-w-[1200px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Primary Details */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Core Requirements Card */}
          <div className="bg-surface-bright rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-8 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <h3 className="font-headline text-xl font-extrabold text-on-surface mb-6 flex items-center gap-2">
              <Briefcase className="text-primary w-[22px] h-[22px]" />
              Job Parameters
            </h3>
            
            <div className="space-y-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="job_title" className="text-sm font-semibold text-on-surface">Job Title</label>
                <input 
                  id="job_title"
                  type="text"
                  required
                  placeholder="e.g. 10kW Residential Install" 
                  className="w-full bg-surface-container-low text-on-surface rounded-xl px-4 py-3.5 border-none outline-none focus:ring-2 focus:ring-primary/40 transition-shadow placeholder:text-on-surface-variant/50 font-medium"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="location" className="text-sm font-semibold text-on-surface">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 w-5 h-5" />
                    <input 
                      id="location"
                      type="text"
                      required
                      placeholder="City or Zip Code" 
                      className="w-full bg-surface-container-low text-on-surface rounded-xl pl-11 pr-4 py-3.5 border-none outline-none focus:ring-2 focus:ring-primary/40 transition-shadow placeholder:text-on-surface-variant/50 font-medium"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="duration" className="text-sm font-semibold text-on-surface">Estimated Duration</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 w-5 h-5" />
                    <select 
                      id="duration"
                      required
                      className="w-full bg-surface-container-low text-on-surface rounded-xl pl-11 pr-10 py-3.5 border-none outline-none focus:ring-2 focus:ring-primary/40 transition-shadow appearance-none font-medium cursor-pointer"
                      value={formData.duration}
                      onChange={e => setFormData({...formData, duration: e.target.value})}
                    >
                      <option value="" disabled>Select duration</option>
                      <option value="1_day">1 Day</option>
                      <option value="2_3_days">2-3 Days</option>
                      <option value="1_week">1 Week</option>
                      <option value="custom">Custom Schedule</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Labor Specialization Card */}
          <div className="bg-surface-bright rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-8 hover:-translate-y-1 transition-transform duration-300">
            <h3 className="font-headline text-xl font-extrabold text-on-surface mb-6 flex items-center gap-2">
              <HardHat className="text-primary w-[22px] h-[22px]" />
              Labor Specialization
            </h3>
            
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-on-surface">Crew Size Needed</label>
                <div className="flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={() => handleCrewSizeChange(-1)}
                    className="w-12 h-12 rounded-xl bg-surface-container-low text-on-surface flex items-center justify-center hover:bg-surface-container transition-colors shadow-sm"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <input 
                    type="number" 
                    min="1" 
                    max="20" 
                    value={formData.crewSize}
                    readOnly
                    className="w-20 text-center bg-transparent text-xl font-headline font-bold border-none focus:ring-0 text-on-surface p-0 appearance-none m-0 pointer-events-none"
                  />
                  <button 
                    type="button"
                    onClick={() => handleCrewSizeChange(1)}
                    className="w-12 h-12 rounded-xl bg-surface-container-low text-on-surface flex items-center justify-center hover:bg-surface-container transition-colors shadow-sm"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-on-surface">Required Skill Profiles</label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: 'lead', label: 'Lead Installer' },
                    { id: 'roofer', label: 'Roofer' },
                    { id: 'electrician', label: 'Electrician' },
                    { id: 'laborer', label: 'General Laborer' }
                  ].map(skill => (
                    <label key={skill.id} className="cursor-pointer relative">
                      <input 
                        type="checkbox" 
                        name="skills" 
                        value={skill.id} 
                        className="peer sr-only"
                        checked={formData.skills.includes(skill.id)}
                        onChange={() => handleSkillToggle(skill.id)}
                      />
                      <div className="px-5 py-2.5 rounded-full border-2 border-transparent bg-surface-container-low text-on-surface-variant font-medium text-sm peer-checked:bg-secondary-container peer-checked:text-on-secondary-container peer-checked:border-secondary-fixed transition-all shadow-sm">
                        {skill.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column: Financials & Upgrades */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Compensation Card */}
          <div className="bg-surface-bright rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-8 hover:-translate-y-1 transition-transform duration-300">
            <h3 className="font-headline text-xl font-extrabold text-on-surface mb-6 flex items-center gap-2">
              <Coins className="text-primary w-[22px] h-[22px]" />
              Compensation
            </h3>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="daily_rate" className="text-sm font-semibold text-on-surface flex justify-between">
                Daily Rate per worker
                <span className="text-xs text-on-surface-variant font-normal">Est. market avg: ₦15,000</span>
              </label>
              <div className="relative flex items-center mt-1">
                <span className="absolute left-4 font-headline font-bold text-on-surface text-lg">₦</span>
                <input 
                  id="daily_rate"
                  type="number"
                  required
                  placeholder="0"
                  className="w-full bg-surface-container-low text-on-surface text-xl font-headline font-bold rounded-xl pl-10 pr-16 py-4 border-none outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
                  value={formData.payRate}
                  onChange={e => setFormData({...formData, payRate: e.target.value})}
                />
                <span className="absolute right-4 text-sm font-medium text-on-surface-variant">/day</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                CrewLink deducts a standard 5% facilitation fee from the total payout upon job completion.
              </p>
            </div>
          </div>

          {/* Premium Boost Card */}
          <div className="rounded-xl p-[2px] bg-gradient-to-br from-tertiary-fixed via-surface-container to-surface hover:-translate-y-1 transition-transform duration-300 shadow-sm relative overflow-hidden">
            <div className="bg-surface-bright rounded-[10px] p-6 h-full relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-tertiary-fixed/30 flex items-center justify-center">
                    <Zap className="text-tertiary w-[18px] h-[18px] fill-tertiary/20" />
                  </div>
                  <h3 className="font-headline text-lg font-extrabold text-on-surface">Boost Hiring</h3>
                </div>
                
                {/* Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={formData.boost}
                    onChange={e => setFormData({...formData, boost: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
                </label>
              </div>
              <p className="text-sm text-on-surface-variant mb-4 leading-relaxed">Pin your listing to the top of the feed and send SMS alerts to top-rated crews in the area.</p>
              <div className="flex items-end gap-1">
                <span className="font-headline font-bold text-lg text-on-surface">₦5,000</span>
                <span className="text-xs text-on-surface-variant mb-1">/listing</span>
              </div>
            </div>
          </div>

        </div>
        
        {/* Floating Action Footer (Pushed to bottom of viewport relative to parent or fixed) */}
        <div className="fixed bottom-0 lg:left-64 left-0 right-0 p-6 bg-surface-bright/80 backdrop-blur-2xl border-t border-outline-variant/20 z-30 shadow-[0_-8px_24px_rgba(0,0,0,0.02)]">
          <div className="max-w-[1200px] mx-auto flex justify-end gap-4 items-center">
            <button 
              type="button"
              className="px-6 py-3 rounded-xl text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors"
            >
              Save Draft
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-white font-semibold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Publish Job Request
                  <Send className="w-[18px] h-[18px]" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
