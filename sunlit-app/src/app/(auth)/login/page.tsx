'use client'

import Link from 'next/link';
import { ArrowRight, Lock } from 'lucide-react';

export default function LoginPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Mock Login Validation successful. In production, this proxies to Clerk.');
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-center mb-6">
        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
          <Lock size={28} />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
      <p className="text-slate-500 text-center mb-8">Securely login to your Sunlit workspace</p>

      <form onSubmit={handleSubmit} className="space-y-5">
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
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <Link href="#" className="text-sm font-medium text-orange-600 hover:text-orange-700">Forgot?</Link>
          </div>
          <input 
            type="password" 
            required 
            className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center mt-2">
          Sign In <ArrowRight size={18} className="ml-2" />
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-8">
        Don&apos;t have an account? <Link href="/register" className="font-medium text-orange-600 hover:text-orange-700">Register</Link>
      </p>
    </div>
  );
}
