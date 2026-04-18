'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Zap, Battery, Wrench, Activity, Sun, ArrowRight, CheckCircle2 } from 'lucide-react';
import styles from './page.module.css';

export default function LandingPage() {
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleWaitlist = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWaitlistStatus('submitting');
    setTimeout(() => {
      setWaitlistStatus('success');
    }, 1200);
  };


  const gradientText: React.CSSProperties = {
    background: 'var(--cta-gradient)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Main content sections start here (Header is provided by layout) */}

      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className="animate-in stagger-children" style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10, padding: '0 24px' }}>
          
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', 
            padding: '6px 12px', borderRadius: '999px', 
            background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(4px)', 
            border: '1px solid rgba(255,255,255,0.3)', 
            fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', 
            marginBottom: 'var(--space-6)', boxShadow: 'var(--shadow-card)'
          }}>
            <span style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
              <span style={{ position: 'absolute', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: 'var(--primary)', opacity: 0.75, animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></span>
              <span style={{ position: 'relative', height: '8px', width: '8px', backgroundColor: 'var(--primary)', borderRadius: '50%' }}></span>
            </span>
            Available in Lagos & Abuja
          </div>
          
          <h1 className="display-lg mb-6">
            Verified solar installers.<br />
            <span style={gradientText}>Escrow-secured</span> projects.<br />
            Faster installs.
          </h1>
          
          <p className="body-lg text-muted mb-8" style={{ maxWidth: '650px', margin: '0 auto var(--space-8)' }}>
            Sunlit Energy Marketplace connects you with trusted solar providers, 
            backed by transparent escrow payments to give you absolute peace of mind.
          </p>
          
          <div className="flex justify-center flex-wrap gap-4">
            <Link href="/register" className="btn btn-primary btn-lg" style={{ display: 'flex', alignItems: 'center' }}>
              Start Your Project <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </Link>
            <a href="#waitlist" className="btn btn-secondary btn-lg">
              Join Waitlist
            </a>
          </div>
          
          <div className="mt-8 flex justify-center items-center flex-wrap gap-6" style={{ opacity: 0.8, fontSize: '0.875rem', color: 'var(--on-surface-variant)', marginTop: 'var(--space-10)' }}>
            <div className="flex items-center gap-2"><CheckCircle2 size={16} color="var(--primary)" /> Vetted Professionals</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={16} color="var(--primary)" /> Escrow Payments</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={16} color="var(--primary)" /> End-to-End Tracking</div>
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section id="services" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className="headline-lg">Our Energy Solutions</h2>
          <p className="body-lg text-muted mt-4" style={{ maxWidth: '650px', margin: 'var(--space-4) auto 0' }}>Professional installation across Nigeria, including Port Harcourt, Ogun, Kano, and Enugu.</p>
        </div>
        <div className="grid grid-cols-4 stagger-children">
          <div className="surface-card surface-card--glass">
            <div className={styles.cardIcon}><Zap size={24} /></div>
            <h3 className="title-md mb-2">Inverter Solutions</h3>
            <p className="body-sm">Professional installation and maintenance of high-capacity inverters.</p>
          </div>
          <div className="surface-card surface-card--glass">
            <div className={styles.cardIcon}><Battery size={24} /></div>
            <h3 className="title-md mb-2">Battery Storage</h3>
            <p className="body-sm">Supply and replacement of Lithium-ion and tubular battery systems.</p>
          </div>
          <div className="surface-card surface-card--glass">
            <div className={styles.cardIcon}><Sun size={24} /></div>
            <h3 className="title-md mb-2">Solar Arrays</h3>
            <p className="body-sm">Roof and ground-mounted high-efficiency solar panel installations.</p>
          </div>
          <div className="surface-card surface-card--glass">
            <div className={styles.cardIcon}><Wrench size={24} /></div>
            <h3 className="title-md mb-2">System Tuning</h3>
            <p className="body-sm">Setup and calibration of MPPT charge controllers for max yield.</p>
          </div>
        </div>
      </section>

      {/* ABOUT US PREVIEW */}
      <section id="about" className={styles.section}>
        <div style={{ background: 'linear-gradient(135deg, var(--surface-container-lowest), var(--surface-container))', borderRadius: 'var(--radius-xl)', padding: 'var(--space-10)', border: '1px solid rgba(255,255,255,0.4)', boxShadow: 'var(--shadow-ambient)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '250px', height: '250px', background: 'var(--primary-fixed)', opacity: 0.1, filter: 'blur(60px)', transform: 'translate(50%, -50%)', borderRadius: '50%' }}></div>
          
          <div className="grid grid-cols-2 gap-6 items-center relative" style={{ zIndex: 10 }}>
            <div>
              <h2 className="headline-lg mb-6">Trusted Local Experts</h2>
              <p className="body-lg text-muted mb-6">
                We are energy native consultants with years of experience helping households and businesses switch to continuous, clean power. 
                Our mission is to make renewable energy simple, affordable, and 100% reliable.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex gap-4" style={{ alignItems: 'flex-start' }}>
                  <div style={{ padding: '8px', background: 'rgba(0,107,92,0.1)', borderRadius: '8px', color: 'var(--primary)' }}>
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="title-sm" style={{ fontWeight: 600 }}>Vetted Installers</h4>
                    <p className="body-sm mt-1">Every vendor undergoes rigorous background checks and quality verifications.</p>
                  </div>
                </div>
                <div className="flex gap-4" style={{ alignItems: 'flex-start' }}>
                  <div style={{ padding: '8px', background: 'rgba(0,107,92,0.1)', borderRadius: '8px', color: 'var(--primary)' }}>
                    <Activity size={20} />
                  </div>
                  <div>
                    <h4 className="title-sm" style={{ fontWeight: 600 }}>Real-time Tracking</h4>
                    <p className="body-sm mt-1">Monitor milestone progress dynamically from inception to testing.</p>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ height: '350px', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-float)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '4px solid rgba(255,255,255,0.1)' }}>
              <Sun size={64} color="rgba(255,255,255,0.2)" />
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className="headline-lg">What Our Users Say</h2>
        </div>
        <div className="grid grid-cols-3 stagger-children">
          <div className="surface-card">
            <p className="body-md mb-6" style={{ fontStyle: 'italic' }}>"Sunlit saved us months of searching. We found a verified installer in Lagos in 24 hours, and the escrow system gave my board total confidence."</p>
            <div className="flex items-center gap-3">
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,107,92,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--primary)' }}>OA</div>
              <div>
                <p className="title-sm" style={{ fontWeight: 700 }}>Oluwaseun A.</p>
                <p className="body-sm">Commercial Facility Manager</p>
              </div>
            </div>
          </div>
          <div className="surface-card">
            <p className="body-md mb-6" style={{ fontStyle: 'italic' }}>"As an installer, knowing I will get paid upon approved milestones perfectly eliminates my cash flow anxiety. The platform is incredibly fast."</p>
            <div className="flex items-center gap-3">
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--secondary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--secondary)' }}>EE</div>
              <div>
                <p className="title-sm" style={{ fontWeight: 700 }}>Emmanuel E.</p>
                <p className="body-sm">Verified EPC Provider</p>
              </div>
            </div>
          </div>
          <div className="surface-card">
            <p className="body-md mb-6" style={{ fontStyle: 'italic' }}>"I just wanted an inverter for my apartment in Abuja. The appliance selection tool correctly sized my needs and I got exactly what I paid for."</p>
            <div className="flex items-center gap-3">
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--tertiary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--tertiary)' }}>CJ</div>
              <div>
                <p className="title-sm" style={{ fontWeight: 700 }}>Chisom J.</p>
                <p className="body-sm">Residential Homeowner</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WAITLIST SECTION */}
      <section id="waitlist" style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.2)', background: 'var(--surface-container-low)', padding: 'var(--space-12) var(--space-6)' }}>
        <div className="animate-in" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
          <h2 className="headline-md mb-3">Join the Future of Energy</h2>
          <p className="body-md text-muted mb-8">Get priority access to the marketplace and exclusive early installer discounts when we launch fully.</p>
          
          {waitlistStatus === 'success' ? (
            <div style={{ padding: 'var(--space-5)', background: 'rgba(0,194,168,0.1)', border: '1px solid rgba(0,194,168,0.2)', borderRadius: 'var(--radius-lg)', color: 'var(--primary)', fontWeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={32} />
              Thank you! You are officially on the Sunlit Marketplace waitlist.
            </div>
          ) : (
            <form className="surface-card--glass" style={{ padding: 'var(--space-6)', textAlign: 'left', boxShadow: 'var(--shadow-float)' }} onSubmit={handleWaitlist}>
              <div className="input-group mb-4">
                <label htmlFor="name" className="input-label">Full Name</label>
                <input id="name" type="text" className="input-field" required placeholder="Jane Doe" />
              </div>
              <div className="input-group mb-6">
                <label htmlFor="email" className="input-label">Email Address</label>
                <input id="email" type="email" className="input-field" required placeholder="jane@company.com" />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary w-full" 
                style={{ boxShadow: 'var(--shadow-float)' }}
                disabled={waitlistStatus === 'submitting'}
              >
                {waitlistStatus === 'submitting' ? 'Submitting...' : 'Join Waitlist Priority'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer is provided by layout */}
    </div>
  );
}

