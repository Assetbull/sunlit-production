import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Sunlit Energy',
  description: 'Sunlit Energy terms of service and marketplace agreement.',
};

export default function TermsPage() {
  return (
    <main style={{ background: '#faf8f3', minHeight: '80vh', padding: '5rem 1.5rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '3rem', borderRadius: '16px', border: '1px solid rgba(191,202,186,0.3)' }}>
        <h1 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '2.25rem', fontWeight: 800, color: '#1a1c1b', marginBottom: '1rem' }}>
          Terms of Service
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#707a6c', marginBottom: '2rem' }}>
          Last updated: January 2026
        </p>

        <section style={{ fontFamily: 'Inter, sans-serif', color: '#40493d', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p>
            Welcome to Sunlit Energy. By accessing our platform, sizing tools, and marketplace services, you agree to comply with and be bound by these Terms of Service.
          </p>
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#1a1c1b' }}>
            1. Platform Services & Marketplace Rules
          </h2>
          <p>
            Sunlit Energy provides an intelligent marketplace connecting property owners with certified solar installers and EPC contractors. All quotes, project milestones, and communications are governed by platform verification and escrow protocols.
          </p>
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#1a1c1b' }}>
            2. Milestone Escrow & Payment Guarantees
          </h2>
          <p>
            Project payments are held in secure escrow and released only upon mutual milestone verification between the project owner and the installer. Neither party may unilaterally alter milestone deliverables once locked in the platform agreement.
          </p>
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#1a1c1b' }}>
            3. Engineering Calculations & Estimations
          </h2>
          <p>
            System sizing calculators, battery yield estimates, and financial projections provided by our platform are based on mathematical and meteorological models. On-site physical engineering audits by certified installers are required prior to final procurement.
          </p>
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(191,202,186,0.3)' }}>
            <Link href="/" style={{ color: '#00490e', fontWeight: 600, textDecoration: 'none' }}>
              &larr; Return to Homepage
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
