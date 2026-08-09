'use client';

import { useState } from 'react';
import { UserType } from '@/lib/engineering/types';
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface PublicWaitlistFormProps {
  interestedTool?: string;
  title?: string;
  subtitle?: string;
}

export function PublicWaitlistForm({
  interestedTool,
  title = 'Join the Sunlit Engineering Tools Waitlist',
  subtitle = 'Get early access to full PDF exports, equipment BOMs, and verified installer RFP distribution.',
}: PublicWaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState<UserType>('Homeowner');
  const [location, setLocation] = useState('Lagos');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          full_name: fullName,
          user_type: userType,
          location,
          interested_tool: interestedTool || 'Engineering Tools Platform',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setErrorMsg(data.error || 'Failed to join waitlist. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg('An unexpected connection error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, #00490e 0%, #216224 100%)',
          color: '#fff',
          borderRadius: '20px',
          padding: '40px 32px',
          textAlign: 'center',
          margin: '32px 0',
          boxShadow: '0 8px 32px rgba(0, 73, 14, 0.2)',
        }}
      >
        <CheckCircle2 size={48} style={{ margin: '0 auto 16px', color: '#88d982' }} />
        <h3
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 700,
            fontSize: '24px',
            marginBottom: '8px',
          }}
        >
          You&apos;re on the list!
        </h3>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '15px',
            color: 'rgba(255, 255, 255, 0.85)',
            maxWidth: '480px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          We&apos;ll notify you when Sunlit Engineering Tools full reports and installer
          RFPs become available in {location}.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '40px 32px',
        margin: '32px 0',
        border: '1px solid rgba(230, 225, 215, 0.7)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div style={{ maxWidth: '560px', margin: '0 auto 32px', textAlign: 'center' }}>
        <h3
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 700,
            fontSize: '24px',
            color: '#1f1b17',
            marginBottom: '8px',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: '#40493d',
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: '440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {errorMsg && (
          <div
            style={{
              padding: '12px 16px',
              background: 'rgba(186, 26, 26, 0.08)',
              border: '1px solid rgba(186, 26, 26, 0.3)',
              color: '#ba1a1a',
              borderRadius: '12px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        <div>
          <label
            style={{
              display: 'block',
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#40493d',
              marginBottom: '6px',
            }}
          >
            Email Address *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="engineer@company.com"
            style={{
              width: '100%',
              background: '#f9f9f6',
              border: '1px solid rgba(191, 202, 186, 0.5)',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
              color: '#1f1b17',
              outline: 'none',
              fontFamily: 'Inter, sans-serif',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#40493d',
                marginBottom: '6px',
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Engr. Kunle Adebayo"
              style={{
                width: '100%',
                background: '#f9f9f6',
                border: '1px solid rgba(191, 202, 186, 0.5)',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '14px',
                color: '#1f1b17',
                outline: 'none',
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#40493d',
                marginBottom: '6px',
              }}
            >
              User Role *
            </label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value as UserType)}
              style={{
                width: '100%',
                background: '#f9f9f6',
                border: '1px solid rgba(191, 202, 186, 0.5)',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '14px',
                color: '#1f1b17',
                outline: 'none',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <option value="Homeowner">Homeowner</option>
              <option value="Business Owner">Business Owner</option>
              <option value="Installer">Solar Installer</option>
              <option value="EPC Contractor">EPC Contractor</option>
              <option value="Engineer">Electrical Engineer</option>
              <option value="Consultant">Consultant</option>
              <option value="Facility Manager">Facility Manager</option>
              <option value="Student">Student</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#40493d',
              marginBottom: '6px',
            }}
          >
            Location State
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{
              width: '100%',
              background: '#f9f9f6',
              border: '1px solid rgba(191, 202, 186, 0.5)',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
              color: '#1f1b17',
              outline: 'none',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <option value="Lagos">Lagos State</option>
            <option value="Abuja">Abuja (FCT)</option>
            <option value="Ogun">Ogun State</option>
            <option value="Rivers">Rivers State</option>
            <option value="Oyo">Oyo State</option>
            <option value="Kano">Kano State</option>
            <option value="Other">Other Nigeria Location</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #00490e 0%, #216224 100%)',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: '14px',
            padding: '14px 24px',
            borderRadius: '9999px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0, 73, 14, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 200ms ease',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Submitting...
            </>
          ) : (
            <>
              Join Engineering Waitlist <ArrowRight size={18} />
            </>
          )}
        </button>

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#40493d', textAlign: 'center', margin: 0 }}>
          Strict zero-spam policy. No obligation.
        </p>
      </form>
    </div>
  );
}
