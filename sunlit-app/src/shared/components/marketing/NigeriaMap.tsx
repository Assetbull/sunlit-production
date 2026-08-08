'use client';

import { useState } from 'react';

interface StateInfo {
  name: string;
  d: string;
  cx: number;
  cy: number;
  highlighted?: boolean;
}

// Simplified SVG paths for Nigerian states
// Lagos, Ogun, Abuja are highlighted as "coming soon" service areas
const NIGERIA_STATES: StateInfo[] = [
  // North-West
  { name: 'Sokoto',    d: 'M140 42 L175 38 L195 55 L185 75 L155 80 L135 65 Z', cx: 165, cy: 58 },
  { name: 'Kebbi',     d: 'M110 55 L140 42 L155 80 L140 100 L110 95 L100 75 Z', cx: 127, cy: 73 },
  { name: 'Zamfara',   d: 'M175 38 L215 35 L230 55 L220 80 L185 75 L195 55 Z', cx: 202, cy: 57 },
  { name: 'Katsina',   d: 'M215 35 L255 30 L275 50 L265 75 L230 80 L220 55 Z', cx: 247, cy: 54 },
  { name: 'Kano',      d: 'M255 30 L295 32 L310 55 L295 80 L265 75 L275 50 Z', cx: 283, cy: 55 },
  { name: 'Kaduna',    d: 'M230 80 L265 75 L295 80 L285 115 L250 120 L225 105 Z', cx: 260, cy: 98 },
  { name: 'Jigawa',    d: 'M295 32 L335 28 L355 45 L345 70 L310 75 L310 55 Z', cx: 328, cy: 52 },
  // North-East  
  { name: 'Yobe',      d: 'M335 28 L390 30 L400 55 L375 70 L345 70 L355 45 Z', cx: 372, cy: 49 },
  { name: 'Borno',     d: 'M390 30 L450 28 L470 60 L450 95 L400 95 L400 55 Z', cx: 432, cy: 61 },
  { name: 'Gombe',     d: 'M345 70 L375 70 L390 95 L370 110 L345 100 Z', cx: 367, cy: 89 },
  { name: 'Adamawa',   d: 'M400 55 L450 60 L455 110 L420 140 L385 125 L380 95 L400 95 Z', cx: 420, cy: 98 },
  { name: 'Taraba',    d: 'M355 110 L385 100 L385 125 L370 155 L340 150 L335 125 Z', cx: 361, cy: 130 },
  { name: 'Bauchi',    d: 'M310 75 L345 75 L345 100 L335 125 L300 120 L290 98 L295 80 Z', cx: 318, cy: 100 },
  // North-Central
  { name: 'Niger',     d: 'M175 80 L220 80 L225 105 L215 140 L175 145 L155 120 L155 95 Z', cx: 190, cy: 112 },
  { name: 'Kwara',     d: 'M155 120 L175 145 L170 168 L145 170 L135 150 L140 130 Z', cx: 155, cy: 148 },
  { name: 'Kogi',      d: 'M215 140 L250 120 L270 145 L255 168 L225 175 L205 165 L200 145 Z', cx: 235, cy: 153 },
  { name: 'Benue',     d: 'M270 120 L300 120 L335 130 L335 160 L295 175 L265 168 L270 145 Z', cx: 302, cy: 148 },
  { name: 'Nasarawa',  d: 'M250 105 L285 100 L295 120 L270 120 L250 120 Z', cx: 271, cy: 112 },
  { name: 'Plateau',   d: 'M285 98 L310 98 L335 110 L335 130 L300 120 L285 120 Z', cx: 310, cy: 112 },
  // FCT
  { name: 'FCT - Abuja', d: 'M240 120 L260 115 L265 132 L248 138 L235 130 Z', cx: 250, cy: 127, highlighted: true },
  // South-West
  { name: 'Oyo',       d: 'M140 170 L175 165 L180 192 L165 210 L140 205 L130 188 Z', cx: 156, cy: 189 },
  { name: 'Osun',      d: 'M175 165 L200 162 L210 182 L200 200 L180 200 L175 185 Z', cx: 193, cy: 183 },
  { name: 'Ekiti',     d: 'M200 160 L225 158 L232 175 L218 188 L205 182 Z', cx: 216, cy: 172 },
  { name: 'Ondo',      d: 'M200 200 L218 188 L235 195 L230 220 L205 220 Z', cx: 218, cy: 208 },
  { name: 'Ogun',      d: 'M130 188 L160 188 L165 215 L148 232 L125 225 L118 205 Z', cx: 143, cy: 211, highlighted: true },
  { name: 'Lagos',     d: 'M118 205 L148 205 L148 232 L130 242 L110 235 L108 218 Z', cx: 130, cy: 222, highlighted: true },
  // South-South
  { name: 'Edo',       d: 'M200 200 L220 195 L235 215 L225 238 L200 238 L190 220 Z', cx: 213, cy: 220 },
  { name: 'Delta',     d: 'M185 220 L200 215 L205 238 L195 255 L170 252 L165 238 Z', cx: 185, cy: 238 },
  { name: 'Anambra',   d: 'M230 225 L248 218 L258 235 L248 252 L232 248 Z', cx: 245, cy: 236 },
  { name: 'Enugu',     d: 'M250 210 L270 205 L280 225 L265 240 L248 235 Z', cx: 264, cy: 222 },
  { name: 'Ebonyi',    d: 'M270 225 L290 218 L298 235 L285 248 L268 242 Z', cx: 284, cy: 234 },
  { name: 'Imo',       d: 'M225 252 L248 252 L250 272 L235 278 L218 268 Z', cx: 235, cy: 264 },
  { name: 'Abia',      d: 'M250 252 L270 248 L275 268 L258 278 L244 272 Z', cx: 260, cy: 264 },
  { name: 'Cross River',d: 'M290 215 L315 205 L328 230 L318 258 L295 255 L282 240 Z', cx: 308, cy: 233 },
  { name: 'Rivers',    d: 'M255 265 L285 258 L298 278 L285 295 L260 290 Z', cx: 276, cy: 279 },
  { name: 'Bayelsa',   d: 'M220 278 L250 275 L250 295 L230 305 L210 295 Z', cx: 232, cy: 290 },
  { name: 'Akwa Ibom', d: 'M290 255 L318 258 L320 285 L298 295 L280 285 Z', cx: 300, cy: 272 },
];

interface HoveredState {
  name: string;
  x: number;
  y: number;
}

export function NigeriaMap() {
  const [hovered, setHovered] = useState<HoveredState | null>(null);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '520px', margin: '0 auto' }}>
      {/* Legend */}
      <div style={{
        position: 'absolute', top: '1rem', right: '1rem',
        background: 'rgba(252, 249, 244, 0.92)', backdropFilter: 'blur(10px)',
        borderRadius: '10px', padding: '0.75rem 1rem',
        border: '1px solid rgba(187, 202, 196, 0.2)',
        boxShadow: '0 4px 16px rgba(7, 54, 66, 0.08)',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'linear-gradient(135deg, #00490e, #0f631b)', display: 'inline-block' }} />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#40493d' }}>Active Coverage</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#e2e3e0', display: 'inline-block' }} />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#40493d' }}>Coming Soon</span>
        </div>
      </div>

      {/* Tooltip */}
      {hovered && (
        <div style={{
          position: 'absolute',
          left: `${hovered.x}%`,
          top: `${hovered.y}%`,
          transform: 'translate(-50%, -120%)',
          background: '#1a1c1b',
          color: '#f9f9f6',
          padding: '0.375rem 0.75rem',
          borderRadius: '8px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.8125rem',
          fontWeight: 500,
          pointerEvents: 'none',
          zIndex: 20,
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        }}>
          {hovered.name}
          <div style={{
            position: 'absolute', left: '50%', top: '100%',
            transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '5px solid #1a1c1b',
          }} />
        </div>
      )}

      <svg
        viewBox="0 0 580 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 8px 24px rgba(7,54,66,0.08))' }}
        role="img"
        aria-label="Interactive map of Nigeria showing Sunlit Energy service coverage"
      >
        {NIGERIA_STATES.map((state) => (
          <path
            key={state.name}
            d={state.d}
            fill={
              state.highlighted
                ? 'url(#highlightGradient)'
                : hovered?.name === state.name
                  ? '#dadad7'
                  : '#e8e8e5'
            }
            stroke={state.highlighted ? '#00490e' : '#fff'}
            strokeWidth={state.highlighted ? '1.5' : '1'}
            style={{
              cursor: 'pointer',
              transition: 'fill 200ms ease, stroke 200ms ease',
              filter: state.highlighted ? 'drop-shadow(0 2px 6px rgba(0, 107, 92, 0.3))' : undefined,
            }}
            onMouseEnter={() => {
              const svgRect = document.querySelector('svg[aria-label*="Nigeria"]')?.getBoundingClientRect();
              const containerRect = document.querySelector('[data-nigeria-map]')?.getBoundingClientRect();
              setHovered({ name: state.name, x: (state.cx / 580) * 100, y: (state.cy / 340) * 100 });
            }}
            onMouseLeave={() => setHovered(null)}
            aria-label={`${state.name}${state.highlighted ? ' — Active service area' : ''}`}
            role="img"
          />
        ))}

        {/* Dots for highlighted states */}
        {NIGERIA_STATES.filter(s => s.highlighted).map(state => (
          <g key={`dot-${state.name}`}>
            <circle cx={state.cx} cy={state.cy} r="5" fill="#fff" />
            <circle cx={state.cx} cy={state.cy} r="3" fill="#00490e" />
            {/* Pulse ring */}
            <circle cx={state.cx} cy={state.cy} r="8" fill="none" stroke="#0f631b" strokeWidth="1.5" opacity="0.6">
              <animate attributeName="r" from="5" to="14" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.7" to="0" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
        ))}

        <defs>
          <linearGradient id="highlightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00490e" />
            <stop offset="100%" stopColor="#0f631b" />
          </linearGradient>
        </defs>
      </svg>

      {/* Active state labels */}
      <div style={{
        position: 'absolute', bottom: '1rem', left: '1rem',
        display: 'flex', flexDirection: 'column', gap: '0.375rem',
      }}>
        {NIGERIA_STATES.filter(s => s.highlighted).map(state => (
          <div key={`label-${state.name}`} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(252, 249, 244, 0.92)', backdropFilter: 'blur(10px)',
            borderRadius: '8px', padding: '0.375rem 0.625rem',
            border: '1px solid rgba(0, 194, 168, 0.2)',
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #00490e, #0f631b)', display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: '#00490e' }}>{state.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
