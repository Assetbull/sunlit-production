'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Zap, Battery, Wrench, Activity, Sun, ArrowRight } from 'lucide-react';
import styles from './page.module.css';

export default function LandingPage() {
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleWaitlist = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWaitlistStatus('submitting');
    // Mocking an API call
    setTimeout(() => {
      setWaitlistStatus('success');
    }, 1000);
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h1 className={styles.heroTitle}>
            Verified solar installers.<br />
            <span className="text-primary">Escrow-secured</span> projects.<br />
            Faster installs.
          </h1>
          <p className={styles.heroSubtitle}>
            Sunlit Energy Marketplace connects you with trusted solar providers, 
            backed by transparent escrow payments to give you peace of mind.
          </p>
          <div className={styles.heroActions}>
            <Link href="/register" className="btn btn-primary btn-lg">
              Get Started <ArrowRight size={20} className="ml-2" />
            </Link>
            <a href="#waitlist" className="btn btn-outline btn-lg">
              Join Waitlist
            </a>
          </div>
        </div>
      </section>

      {/* INTRO & SEO */}
      <section className={styles.section} style={{ paddingTop: 0 }}>
        <p className={styles.seoText}>
          We bring reliable <strong>Solar Energy Solutions</strong> to homes and businesses across <strong>Lagos</strong> and <strong>Abuja</strong>. From consultation to installation, our team helps communities reduce power costs and enjoy steady electricity. Our services include inverters, batteries, solar panels, charge controllers, monitoring devices, and street solar lighting. We also serve Port Harcourt, Ogun State, Kano, and Enugu, making clean energy accessible across Nigeria.
        </p>
      </section>

      {/* ABOUT US PREVIEW */}
      <section className={styles.section} style={{ backgroundColor: 'var(--surface-2)', borderRadius: 'var(--radius-xl)' }}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Trusted Local Experts</h2>
          <p className="text-muted max-w-[600px] mx-auto">
            We are local energy consultants with years of experience helping families and businesses switch to solar. Our mission is to make renewable energy simple, affordable, and reliable. We partner with trusted vendors to deliver high-quality products and services.
          </p>
        </div>
        <div className={styles.grid}>
          <div className={styles.card}>
            <ShieldCheck className={styles.cardIcon} />
            <h3 className={styles.cardTitle}>Vetted Installers</h3>
            <p className={styles.cardText}>Every vendor on Sunlit undergoes rigorous quality checks and verification.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardIcon} style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
              <span className="font-bold text-xl">₦</span>
            </div>
            <h3 className={styles.cardTitle}>Escrow Security</h3>
            <p className={styles.cardText}>Your funds are completely secured and only released when milestones are approved.</p>
          </div>
          <div className={styles.card}>
            <Activity className={styles.cardIcon} />
            <h3 className={styles.cardTitle}>Real-time Tracking</h3>
            <p className={styles.cardText}>Monitor your project progress from inception to testing and deployment.</p>
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Our Energy Solutions</h2>
        </div>
        <div className={styles.grid}>
          <div className={styles.card}>
            <Zap className={styles.cardIcon} />
            <h3 className={styles.cardTitle}>Inverter Solutions</h3>
            <p className={styles.cardText}>Professional installation and maintenance of high-capacity inverters.</p>
          </div>
          <div className={styles.card}>
            <Battery className={styles.cardIcon} />
            <h3 className={styles.cardTitle}>Battery Storage</h3>
            <p className={styles.cardText}>Supply and replacement of Lithium-ion and tubular battery systems.</p>
          </div>
          <div className={styles.card}>
            <Sun className={styles.cardIcon} />
            <h3 className={styles.cardTitle}>Solar Panel Setup</h3>
            <p className={styles.cardText}>Roof and ground-mounted solar panel array installations.</p>
          </div>
          <div className={styles.card}>
            <Wrench className={styles.cardIcon} />
            <h3 className={styles.cardTitle}>Charge Controllers</h3>
            <p className={styles.cardText}>Setup and tuning of MPPT charge controllers for maximum yield.</p>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <Link href="/services" className="btn btn-outline">
            View All Services
          </Link>
        </div>
      </section>

      {/* WAITLIST SECTION */}
      <section id="waitlist" className={styles.waitlistSection}>
        <div className={styles.sectionHeader} style={{ marginBottom: 'var(--space-8)' }}>
          <h2 className={styles.sectionTitle}>Get Early Access</h2>
          <p className="text-muted">Join the waitlist to receive priority onboarding when Sunlit expands to your city.</p>
        </div>

        {waitlistStatus === 'success' ? (
          <div className={styles.waitlistForm}>
            <div className={styles.successMessage}>
              Thank you! You have been successfully added to the Sunlit Marketplace waitlist.
            </div>
          </div>
        ) : (
          <form className={styles.waitlistForm} onSubmit={handleWaitlist}>
            <div className={styles.inputGroup}>
              <label htmlFor="name" className="text-sm font-medium">Full Name</label>
              <input id="name" type="text" className={styles.input} required placeholder="Enter your name" />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className="text-sm font-medium">Email Address</label>
              <input id="email" type="email" className={styles.input} required placeholder="Enter your email" />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary w-full mt-2" 
              disabled={waitlistStatus === 'submitting'}
            >
              {waitlistStatus === 'submitting' ? 'Submitting...' : 'Join Waitlist'}
            </button>
          </form>
        )}
      </section>
    </>
  );
}
