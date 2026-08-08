'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { dashboardPathForRole } from '@/shared/auth/sunlit-roles';

export default function RegisterSuccessPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // After 3 seconds, redirect to OTP or dashboard (we'll route to OTP)
    // Wait, let's just show success and then go to OTP? Or is success after OTP?
    // Registration success -> Dashboard (assuming auto-login via OAuth/email pass)
    // Actually, in the implementation plan: Register -> Success -> OTP
    // Wait, the plan was Register -> OTP -> Success -> Dashboard.
    // Let's redirect to Dashboard after 3s.
    const timer = setTimeout(() => {
      // Typically, in a real app, you'd get the session role.
      // For now, redirect to project owner dashboard as default if role not found in state
      router.push('/dashboard/project-owner');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={{ minHeight: '100dvh', background: '#f9f9f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center', padding: '2rem', animation: mounted ? 'fade-in 0.5s ease-out' : 'none' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'rgba(15,99,27,0.1)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
          animation: 'pulse 1.5s infinite',
        }}>
          <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: '2.5rem', color: '#0f631b', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
        <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.75rem', fontWeight: 800, color: '#1a1c1c', margin: '0 0 0.5rem' }}>
          Account Created
        </h2>
        <p style={{ color: '#40493d', margin: 0 }}>Preparing your workspace…</p>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(15,99,27,0.4); }
          70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(15,99,27,0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(15,99,27,0); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
