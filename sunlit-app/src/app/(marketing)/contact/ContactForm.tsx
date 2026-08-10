'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function ContactForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        window.location.href = '/waitlist';
      }}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
    >
      {[
        { label: 'Full Name', type: 'text', placeholder: 'Your full name', id: 'contact-name' },
        { label: 'Email Address', type: 'email', placeholder: 'your@email.com', id: 'contact-email' },
      ].map((field) => (
        <div key={field.id}>
          <label
            htmlFor={field.id}
            style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: '#1a1c1b', display: 'block', marginBottom: '0.5rem' }}
          >
            {field.label}
          </label>
          <input
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            required
            style={{
              width: '100%', padding: '0.875rem 1rem', borderRadius: '10px',
              border: '1.5px solid rgba(191, 202, 186, 0.4)',
              background: '#fff8f5', fontFamily: 'Inter, sans-serif',
              fontSize: '0.9375rem', color: '#1a1c1b', outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      ))}
      <div>
        <label
          htmlFor="contact-type"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: '#1a1c1b', display: 'block', marginBottom: '0.5rem' }}
        >
          I am a...
        </label>
        <select
          id="contact-type"
          style={{
            width: '100%', padding: '0.875rem 1rem', borderRadius: '10px',
            border: '1.5px solid rgba(191, 202, 186, 0.4)',
            background: '#f4f4f1', fontFamily: 'Inter, sans-serif',
            fontSize: '0.9375rem', color: '#1a1c1b', outline: 'none',
            boxSizing: 'border-box',
          }}
        >
          <option>Homeowner</option>
          <option>Business Owner</option>
          <option>Solar Installer</option>
          <option>EPC Contractor</option>
          <option>Investor / Finance Partner</option>
          <option>Supplier</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="contact-message"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: '#1a1c1b', display: 'block', marginBottom: '0.5rem' }}
        >
          Message
        </label>
        <textarea
          id="contact-message"
          rows={4}
          placeholder="Tell us about your project or question..."
          required
          style={{
            width: '100%', padding: '0.875rem 1rem', borderRadius: '10px',
            border: '1.5px solid rgba(191, 202, 186, 0.4)',
            background: '#f4f4f1', fontFamily: 'Inter, sans-serif',
            fontSize: '0.9375rem', color: '#1a1c1b', outline: 'none',
            resize: 'vertical', boxSizing: 'border-box',
          }}
        />
      </div>
      <button
        type="submit"
        style={{
          padding: '1rem', borderRadius: '9999px', border: 'none',
          background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)',
          color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 700,
          fontSize: '1rem', cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,73,14,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        }}
      >
        Send Message <ArrowRight size={18} />
      </button>
    </form>
  );
}
