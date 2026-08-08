import { NigeriaMap } from '@/shared/components/marketing/NigeriaMap';
import { MapPin, ArrowRight } from 'lucide-react';

const FEATURED_LOCATIONS = [
  { name: 'Lekki', state: 'Lagos', desc: 'Premium residential and commercial solar deployments across Lekki Phase 1, 2, and Chevron Drive.', count: '120+ projects' },
  { name: 'Victoria Island', state: 'Lagos', desc: 'Corporate headquarters, hotels, and high-rise commercial buildings. High-capacity grid solutions.', count: '85+ projects' },
  { name: 'Ikoyi', state: 'Lagos', desc: 'Luxury residences and embassies. Discreet installation with premium components and service.', count: '65+ projects' },
  { name: 'Ikeja', state: 'Lagos', desc: 'Industrial district and residential estates. SME solar and large factory deployments.', count: '100+ projects' },
];

interface MapSectionProps {
  onWaitlistOpen: () => void;
}

export function MapSection({ onWaitlistOpen }: MapSectionProps) {
  return (
    <section
      id="locations"
      aria-labelledby="map-heading"
      style={{
        padding: '6rem 1.5rem',
        background: '#fff',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(0, 107, 92, 0.08)', borderRadius: '9999px',
            padding: '0.375rem 1rem', marginBottom: '1.25rem',
          }}>
            <MapPin size={13} color="#00490e" />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Coverage Area
            </span>
          </div>
          <h2 id="map-heading" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#1a1c1b', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '1rem' }}>
            Currently Serving Nigeria&apos;s Solar Capital
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem', color: '#707a6c', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto' }}>
            We&apos;re starting in Lagos, Ogun, and Abuja — expanding to all 36 states by 2026.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
        }}>
          {/* Map */}
          <div data-nigeria-map>
            <NigeriaMap />
          </div>

          {/* Location cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {FEATURED_LOCATIONS.map((loc) => (
              <div
                key={loc.name}
                style={{
                  background: '#f9f9f6',
                  borderRadius: '14px',
                  padding: '1.25rem 1.5rem',
                  border: '1px solid rgba(187, 202, 196, 0.12)',
                  boxShadow: '0 2px 8px rgba(7, 54, 66, 0.04)',
                  transition: 'all 200ms ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(0, 107, 92, 0.2)';
                  el.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(187, 202, 196, 0.12)';
                  el.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.0625rem', color: '#1a1c1b' }}>{loc.name}</span>
                    <span style={{ marginLeft: '0.5rem', fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#707a6c' }}>· {loc.state}</span>
                  </div>
                  <span style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600,
                    color: '#00490e', background: 'rgba(0,107,92,0.08)', borderRadius: '9999px', padding: '0.25rem 0.75rem',
                  }}>
                    {loc.count}
                  </span>
                </div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#707a6c', lineHeight: 1.55 }}>
                  {loc.desc}
                </p>
              </div>
            ))}

            <button
              onClick={onWaitlistOpen}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                padding: '0.875rem', borderRadius: '12px', border: '1.5px dashed rgba(0, 107, 92, 0.3)',
                background: 'transparent', color: '#00490e',
                fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', fontWeight: 600,
                cursor: 'pointer', transition: 'all 150ms ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(0, 107, 92, 0.05)';
                el.style.borderColor = '#00490e';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'transparent';
                el.style.borderColor = 'rgba(0, 107, 92, 0.3)';
              }}
              aria-label="Get notified when we launch in your state"
            >
              <MapPin size={16} />
              Get notified when we launch in your state
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
