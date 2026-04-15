import styles from '../page.module.css';

export default function AboutPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <div className={styles.sectionHeader}>
        <h1 className={styles.sectionTitle}>About Sunlit Energy</h1>
        <p className="text-muted text-lg">
          Powering Nigeria&apos;s transition to reliable and secure renewable energy.
        </p>
      </div>

      <div className="space-y-8 text-lg leading-relaxed text-muted">
        <p>
          At Sunlit Energy Marketplace, our mission is simple: to make the transition to solar energy entirely <strong>frictionless, secure, and transparent</strong> for homes and businesses across Nigeria. 
        </p>
        
        <p>
          We recognized the severe lack of trust and lack of standardized quality in the local solar industry. Installers struggled to showcase credibility, and property owners risked capital on unverified parts or shoddy workmanship.
        </p>

        <div className="bg-orange-50/50 p-8 rounded-2xl border border-orange-100 my-10 text-slate-800">
          <h2 className="text-2xl font-bold mb-4 text-orange-600">The Escrow Advantage</h2>
          <p>
            By integrating strict, milestone-based escrow payments, we align the incentives of the Project Owner and the Solar Installer. You control your budget. Funds are only released when cryptographic and visual proof of completion is validated.
          </p>
        </div>

        <p>
          Operating natively across Lagos, Abuja, Port Harcourt, and Kano, we are deeply committed to elevating local economies. Whether you are seeking a resilient inverter backup system or a community-wide micro-grid, Sunlit is your deployment infrastructure.
        </p>
      </div>
    </div>
  );
}
