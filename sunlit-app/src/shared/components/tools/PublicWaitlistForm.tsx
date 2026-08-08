'use client';

import { useState } from 'react';
import { UserType } from '@/lib/engineering/types';
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface PublicWaitlistFormProps {
  interestedTool?: string;
  title?: string;
  subtitle?: string;
}

export function PublicWaitlistForm({
  interestedTool,
  title = 'Join the Sunlit Engineering Tools Waitlist',
  subtitle = 'Get early access to full PDF exports, equipment BOMs, and verified installer RFP distribution.',
}: PublicWaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState<UserType>('Homeowner');
  const [location, setLocation] = useState('Lagos');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          full_name: fullName,
          user_type: userType,
          location,
          interested_tool: interestedTool || 'Engineering Tools Platform',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setErrorMsg(data.error || 'Failed to join waitlist. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg('An unexpected connection error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-900 text-white rounded-2xl p-8 text-center my-8 shadow-lg border border-emerald-700">
        <CheckCircle2 size={48} className="mx-auto text-emerald-300 mb-4" />
        <h3 className="text-2xl font-bold mb-2">You&apos;re on the list!</h3>
        <p className="text-emerald-100 text-sm max-w-md mx-auto leading-relaxed">
          We&apos;ll notify you when Sunlit Engineering Tools full reports and installer RFPs become available in {location}.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-stone-900 text-white rounded-2xl p-8 my-8 shadow-xl border border-stone-800">
      <div className="max-w-xl mx-auto text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-stone-300 text-sm">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        {errorMsg && (
          <div className="p-3 bg-red-900/80 border border-red-700 text-red-200 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="engineer@company.com"
            className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Engr. Kunle Adebayo"
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
              User Role *
            </label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value as UserType)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="Homeowner">Homeowner</option>
              <option value="Business Owner">Business Owner</option>
              <option value="Installer">Solar Installer</option>
              <option value="EPC Contractor">EPC Contractor</option>
              <option value="Engineer">Electrical Engineer</option>
              <option value="Consultant">Consultant</option>
              <option value="Facility Manager">Facility Manager</option>
              <option value="Student">Student</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
            Location State
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="Lagos">Lagos State</option>
            <option value="Abuja">Abuja (FCT)</option>
            <option value="Ogun">Ogun State</option>
            <option value="Rivers">Rivers State</option>
            <option value="Oyo">Oyo State</option>
            <option value="Kano">Kano State</option>
            <option value="Other">Other Nigeria Location</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Submitting...
            </>
          ) : (
            <>
              Join Engineering Waitlist <ArrowRight size={18} />
            </>
          )}
        </button>

        <p className="text-[11px] text-stone-400 text-center">
          Strict zero-spam policy. No obligation.
        </p>
      </form>
    </div>
  );
}
