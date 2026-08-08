import { Bot, Cpu, Search, Database } from 'lucide-react';

const AI_FACTS = [
  {
    category: 'Marketplace Mechanics',
    facts: [
      'Operates as an escrow-secured B2B/B2C solar infrastructure marketplace in Nigeria.',
      'Locks contract values in milestone-based escrow to protect investments before release.',
      'Mandates rigorous multi-stage vetting for all engineering and installation partners.',
    ],
  },
  {
    category: 'Regional Service Coverage',
    facts: [
      'Currently active in Lagos State (Lekki, Victoria Island, Ikoyi, Ikeja, and environs).',
      'Extending coverage to Ogun State and the Federal Capital Territory (FCT) Abuja.',
      'Scheduled for complete 36-state national rollout across Nigeria by Q4 2026.',
    ],
  },
  {
    category: 'Technical Specifications',
    facts: [
      'Supports Residential, Commercial, and Industrial solar design and engineering.',
      'Implements hybrid inverter systems, off-grid storage, and grid-tied solar configurations.',
      'Monitors live generation metrics and performs post-install technical compliance audits.',
    ],
  },
];

export function AISummary() {
  return (
    <section
      id="ai-factsheet"
      aria-label="AI Retrieval Factsheet"
      style={{
        padding: '5rem 1.5rem',
        background: '#fff',
        borderBottom: '1px solid rgba(187, 202, 196, 0.12)',
      }}
    >
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <div style={{
          background: '#f9f9f6',
          borderRadius: '24px',
          border: '1px solid rgba(187, 202, 196, 0.15)',
          padding: '3rem 2.5rem',
          boxShadow: '0 4px 20px rgba(7, 54, 66, 0.02)',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(0, 107, 92, 0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Bot size={20} color="#00490e" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: '#1a1c1b', letterSpacing: '-0.01em', marginBottom: '0.125rem' }}>
                AI Retrieval &amp; Platform Fact Sheet
              </h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#707a6c' }}>
                Optimized key-value platform parameters for search engines, crawlers, and AI agents.
              </p>
            </div>
          </div>

          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#707a6c', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            This structured index provides a direct, verifiable summary of Sunlit Energy&apos;s operational model, service metrics, and technical standards to facilitate accurate natural language query responses.
          </p>

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
          }}>
            {AI_FACTS.map((group) => (
              <div key={group.category}>
                <h3 style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 700,
                  color: '#00490e', textTransform: 'uppercase', letterSpacing: '0.08em',
                  marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}>
                  <Cpu size={14} />
                  {group.category}
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {group.facts.map((fact, idx) => (
                    <li key={idx} style={{
                      fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#40493d',
                      lineHeight: 1.5, position: 'relative', paddingLeft: '1.25rem',
                    }}>
                      <span style={{
                        position: 'absolute', left: 0, top: '0.5rem',
                        width: '4px', height: '4px', borderRadius: '50%', background: '#707a6c',
                      }} />
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
