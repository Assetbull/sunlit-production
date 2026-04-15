'use client'

import Link from 'next/link';
import { ArrowRight, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Mock Registration Validation successful. In production, this proxies to Clerk.');
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-center mb-6">
        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
          <UserPlus size={28} />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-center mb-2">Create an Account</h1>
      <p className="text-slate-500 text-center mb-8">Join the Sunlit Energy Marketplace</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Full Name</label>
          <input 
            type="text" 
            required 
            className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
            placeholder="Jane Doe"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Email Address</label>
          <input 
            type="email" 
            required 
            className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
            placeholder="name@company.com"
          />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input 
            type="password" 
            required 
            className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
            placeholder="••••••••"
          />
        </div>

        <div className="pt-2 text-sm text-slate-500">
          By registering, you agree to our <Link href="#" className="text-orange-600">Terms of Service</Link> and <Link href="#" className="text-orange-600">Privacy Policy</Link>.
        </div>

        <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center mt-4">
          Create Account <ArrowRight size={18} className="ml-2" />
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-8">
        Already have an account? <Link href="/login" className="font-medium text-orange-600 hover:text-orange-700">Sign In</Link>
      </p>
    </div>
  );
}
