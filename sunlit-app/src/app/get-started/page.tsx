'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Home, Zap, ArrowRight, ArrowLeft, Sun, CheckCircle2, ShieldCheck } from 'lucide-react';

type FlowStep = 'stakeholder_select' | 'property_type' | 'solution_type' | 'load_details' | 'appliance_details' | 'summary';

export default function GetStarted() {
  const router = useRouter();
  const [step, setStep] = useState<FlowStep>('stakeholder_select');
  const [role, setRole] = useState<'project_owner' | 'installer'>('project_owner');
  const [rfq, setRfq] = useState({
    propertyType: '',
    solutionType: '',
    inverterSize: '',
    batterySize: '',
    appliances: [] as string[]
  });
  const [applianceError, setApplianceError] = useState('');

  const nextStep = (next: FlowStep) => {
    setStep(next);
    window.scrollTo(0, 0);
  };

  const handleRoleSelect = (selectedRole: 'project_owner' | 'installer') => {
    setRole(selectedRole);
    if (selectedRole === 'project_owner') {
      nextStep('property_type');
    } else {
      localStorage.setItem('sunlit_onboarding_role', 'installer');
      router.push('/register');
    }
  };

  const handleApplianceToggle = (appliance: string) => {
    const restricted = ['Iron', 'Electric Kettle', 'Electric Cooker', 'Microwave'];
    if (restricted.includes(appliance)) {
      setApplianceError(`${appliance} is highly energy intensive and typically restricted from basic solar sizing. Please consult an engineer.`);
      return;
    }
    setApplianceError('');
    setRfq(prev => ({
      ...prev,
      appliances: prev.appliances.includes(appliance) 
        ? prev.appliances.filter(a => a !== appliance)
        : [...prev.appliances, appliance]
    }));
  };

  const finalizeRFQ = () => {
    localStorage.setItem('sunlit_onboarding_role', 'project_owner');
    localStorage.setItem('sunlit_draft_rfq', JSON.stringify(rfq));
    router.push('/register');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--surface-container-low)' }}>
      {/* HEADER */}
      <header style={{ padding: 'var(--space-4) var(--space-6)', background: 'var(--surface-container-lowest)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sun size={24} /> Sunlit
          </Link>
          <div style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', fontWeight: 500 }}>
            {step === 'stakeholder_select' && 'Step 1 of 4'}
            {step === 'property_type' && 'Step 2 of 4'}
            {step === 'solution_type' && 'Step 3 of 4'}
            {(step === 'load_details' || step === 'appliance_details') && 'Step 4 of 4'}
            {step === 'summary' && 'Review'}
          </div>
        </div>
      </header>

      <main style={{ flex: 1, padding: 'var(--space-12) var(--space-6)' }}>
        <div className="animate-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
          
          {/* STEP 1: STAKEHOLDER */}
          {step === 'stakeholder_select' && (
            <div className="surface-card p-8" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
              <h1 className="headline-md mb-2 text-center">Are you looking to install solar, or are you an installer?</h1>
              <p className="body-md text-muted mb-8 text-center">Select how you want to use the Sunlit Marketplace.</p>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => handleRoleSelect('project_owner')}
                  className="surface-card--glass flex gap-4 text-left hover:border-primary transition-all duration-200"
                  style={{ border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', outline: 'none' }}
                >
                  <div style={{ padding: '12px', background: 'var(--primary-container)', borderRadius: '12px', color: 'var(--on-primary-container)', flexShrink: 0, height: 'max-content' }}>
                    <Home size={24} />
                  </div>
                  <div>
                    <h3 className="title-md font-bold mb-1">I am a Project Owner</h3>
                    <p className="body-sm text-muted">I want to get quotes and hire verified solar installers for my property.</p>
                  </div>
                </button>

                <button 
                  onClick={() => handleRoleSelect('installer')}
                  className="surface-card--glass flex gap-4 text-left hover:border-secondary transition-all duration-200"
                  style={{ border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', outline: 'none' }}
                >
                  <div style={{ padding: '12px', background: 'var(--secondary-container)', borderRadius: '12px', color: 'var(--on-secondary-container)', flexShrink: 0, height: 'max-content' }}>
                    <Zap size={24} />
                  </div>
                  <div>
                    <h3 className="title-md font-bold mb-1">I am a Solar Installer / EPC</h3>
                    <p className="body-sm text-muted">I want to browse projects, submit bids, and grow my installation business.</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PROPERTY TYPE (PO Only) */}
          {step === 'property_type' && (
            <div className="surface-card p-8 animate-slide">
              <button 
                onClick={() => nextStep('stakeholder_select')}
                className="btn btn-ghost btn-icon mb-4"
                style={{ padding: 0 }}
              >
                <ArrowLeft size={20} /> Back
              </button>
              <h1 className="headline-md mb-2">What type of property is this for?</h1>
              <p className="body-md text-muted mb-8">This helps installers understand the scale of the project.</p>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => { setRfq({...rfq, propertyType: 'Residential'}); nextStep('solution_type'); }}
                  style={{ padding: 'var(--space-6)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 'var(--radius-lg)', textAlign: 'center', background: 'var(--surface)', cursor: 'pointer' }}
                  className="hover:border-primary transition-all duration-200 hover:shadow-card"
                >
                  <Home size={32} style={{ margin: '0 auto var(--space-3)', color: 'var(--primary)' }} />
                  <span style={{ fontWeight: 600 }}>Residential</span>
                </button>
                <button 
                  onClick={() => { setRfq({...rfq, propertyType: 'Commercial'}); nextStep('solution_type'); }}
                  style={{ padding: 'var(--space-6)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 'var(--radius-lg)', textAlign: 'center', background: 'var(--surface)', cursor: 'pointer' }}
                  className="hover:border-primary transition-all duration-200 hover:shadow-card"
                >
                  <Building2 size={32} style={{ margin: '0 auto var(--space-3)', color: 'var(--primary)' }} />
                  <span style={{ fontWeight: 600 }}>Commercial</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SOLUTION PATH */}
          {step === 'solution_type' && (
            <div className="surface-card p-8 animate-slide">
              <button onClick={() => nextStep('property_type')} className="btn btn-ghost btn-icon mb-4" style={{ padding: 0 }}><ArrowLeft size={20} /> Back</button>
              <h1 className="headline-md mb-2">How do you want to design your system?</h1>
              <p className="body-md text-muted mb-8">Choose whether you know exactly what you need, or if you want us to estimate based on your appliances.</p>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => { setRfq({...rfq, solutionType: 'System Upgrade'}); nextStep('load_details'); }}
                  className="surface-card--glass flex gap-4 items-center text-left hover:border-primary transition-all duration-200"
                  style={{ border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer' }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 className="title-md font-bold mb-1">System Installation (Specs Known)</h3>
                    <p className="body-sm text-muted">I know the inverter size and battery capacity I want.</p>
                  </div>
                  <ArrowRight size={20} color="var(--primary)" />
                </button>

                <button 
                  onClick={() => { setRfq({...rfq, solutionType: 'Appliance Based'}); nextStep('appliance_details'); }}
                  className="surface-card--glass flex gap-4 items-center text-left hover:border-primary transition-all duration-200"
                  style={{ border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer' }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 className="title-md font-bold mb-1">Appliance-Based Design</h3>
                    <p className="body-sm text-muted">Help me size my system based on the appliances I want to run.</p>
                  </div>
                  <ArrowRight size={20} color="var(--primary)" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4a: KNOWN SPECS */}
          {step === 'load_details' && (
            <div className="surface-card p-8 animate-slide">
              <button onClick={() => nextStep('solution_type')} className="btn btn-ghost btn-icon mb-4" style={{ padding: 0 }}><ArrowLeft size={20} /> Back</button>
              <h1 className="headline-md mb-2">System Specifications</h1>
              <p className="body-md text-muted mb-8">Enter your desired minimum specifications.</p>

              <div className="flex flex-col gap-5">
                <div className="input-group">
                  <label className="input-label">Inverter Size (KVA)</label>
                  <select 
                    className="input-field" 
                    value={rfq.inverterSize}
                    onChange={(e) => setRfq({...rfq, inverterSize: e.target.value})}
                  >
                    <option value="">Select Inverter Size</option>
                    <option value="1KVA">1 KVA</option>
                    <option value="3.5KVA">3.5 KVA</option>
                    <option value="5KVA">5 KVA</option>
                    <option value="10KVA">10 KVA</option>
                    <option value="15KVA">15 KVA+</option>
                  </select>
                </div>
                
                <div className="input-group">
                  <label className="input-label">Battery Capacity</label>
                  <select 
                    className="input-field"
                    value={rfq.batterySize}
                    onChange={(e) => setRfq({...rfq, batterySize: e.target.value})}
                  >
                    <option value="">Select Battery</option>
                    <option value="2.4kWh">2.4 kWh</option>
                    <option value="5.12kWh">5.12 kWh</option>
                    <option value="10kWh">10 kWh</option>
                    <option value="20kWh">20 kWh+</option>
                  </select>
                </div>

                <button 
                  onClick={() => nextStep('summary')} 
                  className="btn btn-primary mt-4 w-full"
                  disabled={!rfq.inverterSize || !rfq.batterySize}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 4b: APPLIANCE SELECTOR */}
          {step === 'appliance_details' && (
            <div className="surface-card p-8 animate-slide">
              <button onClick={() => nextStep('solution_type')} className="btn btn-ghost btn-icon mb-4" style={{ padding: 0 }}><ArrowLeft size={20} /> Back</button>
              <h1 className="headline-md mb-2">Select Your Appliances</h1>
              <p className="body-md text-muted mb-6">Select the devices you want the solar system to power.</p>

              {applianceError && (
                <div style={{ padding: '12px', background: 'rgba(186, 26, 26, 0.1)', color: 'var(--error)', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '16px' }}>
                  {applianceError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-8">
                {['AC', 'Fans', 'Fridge', 'TV', 'Light Bulbs', 'Water Pump', 'Iron', 'Microwave'].map(device => {
                  const isSelected = rfq.appliances.includes(device);
                  return (
                    <div 
                      key={device} 
                      onClick={() => handleApplianceToggle(device)}
                      style={{ 
                        padding: '12px', 
                        border: isSelected ? '2px solid var(--primary)' : '1px solid rgba(0,0,0,0.1)', 
                        borderRadius: '8px', 
                        cursor: 'pointer',
                        background: isSelected ? 'rgba(0,107,92,0.05)' : 'var(--surface)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{device}</span>
                      {isSelected && <CheckCircle2 size={16} color="var(--primary)" />}
                    </div>
                  )
                })}
              </div>

              <button 
                onClick={() => nextStep('summary')} 
                className="btn btn-primary w-full"
                disabled={rfq.appliances.length === 0}
              >
                Determine System Size
              </button>
            </div>
          )}

          {/* STEP 5: SUMMARY & GENERATE */}
          {step === 'summary' && (
            <div className="surface-card p-8 animate-slide">
              <button 
                onClick={() => nextStep(rfq.solutionType === 'System Upgrade' ? 'load_details' : 'appliance_details')} 
                className="btn btn-ghost btn-icon mb-4" style={{ padding: 0 }}
              >
                <ArrowLeft size={20} /> Back
              </button>
              <h1 className="headline-md mb-6">Your Request Summary</h1>
              
              <div style={{ background: 'var(--surface-container)', padding: 'var(--space-6)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-8)' }}>
                <div className="flex justify-between mb-3 border-b border-white/20 pb-2">
                  <span className="text-muted">Property Type</span>
                  <span className="font-semibold">{rfq.propertyType}</span>
                </div>
                <div className="flex justify-between mb-3 border-b border-white/20 pb-2">
                  <span className="text-muted">Design Mode</span>
                  <span className="font-semibold">{rfq.solutionType}</span>
                </div>

                {rfq.solutionType === 'System Upgrade' ? (
                  <>
                    <div className="flex justify-between mb-3 border-b border-white/20 pb-2">
                      <span className="text-muted">Inverter Minimum</span>
                      <span className="font-semibold">{rfq.inverterSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Battery Minimum</span>
                      <span className="font-semibold">{rfq.batterySize}</span>
                    </div>
                  </>
                ) : (
                  <div>
                    <span className="text-muted block mb-2">Selected Appliances</span>
                    <div className="flex flex-wrap gap-2">
                      {rfq.appliances.map(app => (
                        <span key={app} style={{ padding: '4px 8px', background: 'var(--surface)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{app}</span>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-primary/10 rounded text-sm text-primary font-medium">
                      Estimated System: 5KVA Inverter + 5kWh Battery (Suggested)
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'rgba(0,107,92,0.05)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
                <ShieldCheck size={28} color="var(--primary)" />
                <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', margin: 0 }}>
                  By posting this RFQ, installers will send you competitive bids. All payments to installers are protected under the <strong>Sunlit Escrow System</strong>.
                </p>
              </div>

              <button 
                onClick={finalizeRFQ} 
                className="btn btn-primary w-full"
                style={{ height: '48px' }}
              >
                Post to Marketplace (Create Account)
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
