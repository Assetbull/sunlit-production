import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Sunlit Energy',
  description: 'Sunlit Energy privacy policy and data governance terms.',
};

export default function PrivacyPage() {
  return (
    <main style={{ background: '#faf8f3', minHeight: '80vh', padding: '5rem 1.5rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '3rem', borderRadius: '16px', border: '1px solid rgba(191,202,186,0.3)' }}>
        <h1 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '2.25rem', fontWeight: 800, color: '#1a1c1b', marginBottom: '1rem' }}>
          Privacy Policy
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#707a6c', marginBottom: '2rem' }}>
          Last updated: January 2026
        </p>

        <section style={{ fontFamily: 'Inter, sans-serif', color: '#40493d', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p>
            Sunlit Global Energy Co. Ltd. (&ldquo;Sunlit Energy&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website, use our engineering tools, or engage with our verified installer marketplace.
          </p>
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#1a1c1b' }}>
            1. Information We Collect
          </h2>
          <p>
            We collect information you provide directly to us when you request solar quotes, register as an installer, create project designs, or contact our team. This may include your name, contact details, project address, property type, electrical bills, and payment records.
          </p>
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#1a1c1b' }}>
            2. How We Use Your Information
          </h2>
          <p>
            We use collected data to match project owners with vetted solar installers, facilitate milestone-based escrow payments, generate solar system sizing models, and ensure compliance with Nigerian regulatory standards.
          </p>
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#1a1c1b' }}>
            3. Data Security & Escrow Protection
          </h2>
          <p>
            We employ bank-grade encryption protocols to safeguard transaction and personal data. Financial transfers and escrow balances are held in segregated, audited accounts.
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
