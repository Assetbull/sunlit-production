import { Zap, Battery, Sun, Wrench, Activity, Search, MapPin } from 'lucide-react';
import styles from '../page.module.css';
import Link from 'next/link';

export default function ServicesPage() {
  return (
    <div className="container py-12">
      <div className={styles.sectionHeader}>
        <h1 className={styles.sectionTitle}>Solar Infrastructure Services</h1>
        <p className="text-muted max-w-[600px] mx-auto">
          Comprehensive solar deployment spanning from residential setups to community-scale renewable energy infrastructure.
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <Search className={styles.cardIcon} />
          <h3 className={styles.cardTitle}>Energy Consultation</h3>
          <ul className="text-sm text-muted space-y-2 mt-4 ml-4 list-disc">
            <li>Energy Load Analysis</li>
            <li>Solar Feasibility Studies</li>
            <li>Vendor Advisory</li>
          </ul>
        </div>

        <div className={styles.card}>
          <Zap className={styles.cardIcon} />
          <h3 className={styles.cardTitle}>Inverter Systems</h3>
          <ul className="text-sm text-muted space-y-2 mt-4 ml-4 list-disc">
            <li>Standard & Hybrid Installation</li>
            <li>Routine Maintenance</li>
            <li>Inverter Repair</li>
          </ul>
        </div>

        <div className={styles.card}>
          <Battery className={styles.cardIcon} />
          <h3 className={styles.cardTitle}>Battery Solutions</h3>
          <ul className="text-sm text-muted space-y-2 mt-4 ml-4 list-disc">
            <li>Lifepo4 Lithium Supply</li>
            <li>Tubular Battery Replacement</li>
            <li>Battery Rack Setup</li>
          </ul>
        </div>

        <div className={styles.card}>
          <Sun className={styles.cardIcon} />
          <h3 className={styles.cardTitle}>Solar Panels</h3>
          <ul className="text-sm text-muted space-y-2 mt-4 ml-4 list-disc">
            <li>Rooftop Array Installation</li>
            <li>Ground Mount Structures</li>
            <li>Panel Cleaning & Maintenance</li>
          </ul>
        </div>

        <div className={styles.card}>
          <Wrench className={styles.cardIcon} />
          <h3 className={styles.cardTitle}>Charge Controllers</h3>
          <ul className="text-sm text-muted space-y-2 mt-4 ml-4 list-disc">
            <li>MPPT Setup & Calibration</li>
            <li>Troubleshooting & Repair</li>
          </ul>
        </div>

        <div className={styles.card}>
          <Activity className={styles.cardIcon} />
          <h3 className={styles.cardTitle}>Smart Monitoring</h3>
          <ul className="text-sm text-muted space-y-2 mt-4 ml-4 list-disc">
            <li>IoT Energy Tracking</li>
            <li>Remote Monitoring Dashboard</li>
          </ul>
        </div>

        <div className={styles.card}>
          <MapPin className={styles.cardIcon} />
          <h3 className={styles.cardTitle}>Street Solar Lighting</h3>
          <ul className="text-sm text-muted space-y-2 mt-4 ml-4 list-disc">
            <li>Community Lighting Projects</li>
            <li>Estate Perimeter Solar</li>
          </ul>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-2xl font-bold mb-4">Ready to start your project?</h3>
        <Link href="/register" className="btn btn-primary btn-lg">
          Get Quotes Now
        </Link>
      </div>
    </div>
  );
}
