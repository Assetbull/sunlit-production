'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sun,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Building2,
  Home,
  Store,
  Factory,
  Wrench,
  Package,
  Landmark,
  ShieldCheck,
  Zap,
  Battery,
  Calculator,
  Eye,
  EyeOff,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronDown,
  FileCheck
} from 'lucide-react';
import { authService } from '@/services/auth.service';

type UserRole = 'consumer' | 'provider' | 'supplier' | 'financier';
type CustomerType = 'homeowner' | 'business' | 'developer';

interface ProjectAssessmentData {
  role: UserRole;
  customerType: CustomerType;
  location: string;
  gridHours: number;
  monthlyBill: string;
  appliances: string[];
  inverterCapacityKva: number;
  batteryCapacityKwh: number;
  solarCapacityKwp: number;
  estimatedCostMin: number;
  estimatedCostMax: number;
  broadcastMode: 'broadcast' | 'direct';
  selectedInstaller?: string;
}

function GetStartedFlowInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoleParam = searchParams.get('role');

  // Step Tracker: 1 = Role, 2 = Customer Type, 3 = Load Assessment, 4 = System Sizing, 5 = Registration Gate, 6 = Broadcast/Matching, 7 = Success
  const [step, setStep] = useState<number>(1);

  // Form State
  const [role, setRole] = useState<UserRole>('consumer');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [customerType, setCustomerType] = useState<CustomerType>('homeowner');

  // Assessment & Sizing
  const [location, setLocation] = useState('Lagos State');
  const [gridHours, setGridHours] = useState(8);
  const [monthlyBill, setMonthlyBill] = useState('₦120,000');
  const [appliances, setAppliances] = useState<string[]>([
    'Lighting & Smart Home',
    'Refrigeration / Freezer',
    '1.5HP Inverter Air Conditioners (x2)',
    'Water Pumping Machine'
  ]);
  const [inverterKva, setInverterKva] = useState(5.0);
  const [batteryKwh, setBatteryKwh] = useState(10.0);
  const [solarKwp, setSolarKwp] = useState(4.5);

  // Account creation form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Marketplace Broadcast
  const [broadcastMode, setBroadcastMode] = useState<'broadcast' | 'direct'>('broadcast');
  const [selectedInstaller, setSelectedInstaller] = useState('Solavita Engineering Ltd');
  const [rfqBroadcasted, setRfqBroadcasted] = useState(false);

  // Sync role param if present
  useEffect(() => {
    if (initialRoleParam === 'installer' || initialRoleParam === 'epc') {
      setRole('provider');
    } else if (initialRoleParam === 'supplier') {
      setRole('supplier');
    } else if (initialRoleParam === 'financier') {
      setRole('financier');
    }
  }, [initialRoleParam]);

  // Sizing Calculation helper based on appliances & customer type
  useEffect(() => {
    let baseInverter = 3.5;
    let baseBattery = 5.0;
    let baseSolar = 3.0;

    if (customerType === 'homeowner') {
      const acCount = appliances.filter(a => a.includes('Air Conditioner')).length;
      baseInverter = 5.0 + (acCount * 2.5);
      baseBattery = 10.0 + (acCount * 5.0);
      baseSolar = 4.5 + (acCount * 2.0);
    } else if (customerType === 'business') {
      baseInverter = 15.0;
      baseBattery = 30.0;
      baseSolar = 12.0;
    } else if (customerType === 'developer') {
      baseInverter = 50.0;
      baseBattery = 100.0;
      baseSolar = 45.0;
    }

    setInverterKva(baseInverter);
    setBatteryKwh(baseBattery);
    setSolarKwp(baseSolar);
  }, [customerType, appliances]);

  const costMin = Math.round(inverterKva * 420000 + batteryKwh * 240000 + solarKwp * 310000);
  const costMax = Math.round(costMin * 1.22);

  const toggleAppliance = (item: string) => {
    if (appliances.includes(item)) {
      setAppliances(appliances.filter(a => a !== item));
    } else {
      setAppliances([...appliances, item]);
    }
  };

  const handleNextFromRole = () => {
    if (role === 'consumer') {
      setStep(2); // Customer Type
    } else if (role === 'provider') {
      router.push('/register?role=installer');
    } else if (role === 'supplier') {
      router.push('/register?role=supplier');
    } else if (role === 'financier') {
      router.push('/register?role=financier');
    }
  };

  const handleAccountCreation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || isLoading) return;
    if (!termsAgreed) {
      setAuthError('Please accept the Sunlit Terms of Service.');
      return;
    }
    setIsLoading(true);
    setAuthError('');

    try {
      const regResult = await authService.register({
        fullName,
        email,
        phone,
        password,
        role: role === 'provider' ? 'installer' : 'project_owner'
      });

      if (regResult.ok) {
        // Save RFQ project draft
        const assessmentPayload: ProjectAssessmentData = {
          role,
          customerType,
          location,
          gridHours,
          monthlyBill,
          appliances,
          inverterCapacityKva: inverterKva,
          batteryCapacityKwh: batteryKwh,
          solarCapacityKwp: solarKwp,
          estimatedCostMin: costMin,
          estimatedCostMax: costMax,
          broadcastMode,
          selectedInstaller
        };
        localStorage.setItem('sunlit_active_assessment', JSON.stringify(assessmentPayload));
        setStep(6); // Go to Marketplace Broadcast
      } else {
        setAuthError(regResult.error || 'Failed to create account. Please try again.');
      }
    } catch {
      setAuthError('An unexpected network error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinishBroadcast = () => {
    setRfqBroadcasted(true);
    setStep(7); // Final Success screen
  };

  return (
    <div className="bg-[#f7fbf1] text-[#191d17] min-h-screen flex flex-col font-[Inter] antialiased selection:bg-[#ceee93] selection:text-[#131f00]">

      {/* Top Header — Contextual Onboarding Navigation */}
      <header className="w-full flex justify-between items-center px-4 md:px-8 h-16 bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-[#c0c9bb]/30">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#003006] text-white flex items-center justify-center shadow-sm">
              <Sun size={18} />
            </div>
            <span className="font-[Manrope] text-lg font-bold text-[#003006]">Sunlit Energy</span>
          </Link>
          <span className="hidden sm:inline-block w-px h-4 bg-[#c0c9bb]/60 mx-1" />
          <span className="hidden sm:inline-block text-xs font-semibold text-[#707a6c] uppercase tracking-wider">
            Global Onboarding
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs font-semibold text-[#40493d] bg-[#fcf2eb] px-3 py-1.5 rounded-full border border-[#c0c9bb]/30">
            Step {step} of 7
          </div>
          <Link
            href="/login"
            className="text-xs font-semibold text-[#003006] hover:underline"
          >
            Existing User? Log In
          </Link>
        </div>
      </header>

      {/* Main Flow Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col justify-center">

        {/* =========================================================================
            STEP 1: ROLE SELECTION (Stitch 8f2c01e812a64cb39a9327dfb71d01e8)
           ========================================================================= */}
        {step === 1 && (
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-stretch">
            {/* Left Column: Context & Imagery */}
            <div className="w-full md:w-5/12 flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ceee93] text-[#374e03] text-xs font-semibold uppercase tracking-wider mb-4">
                  <Sparkles size={14} /> Step 1 of 7: Role Selection
                </span>
                <h1 className="font-[Manrope] text-3xl md:text-4xl font-extrabold text-[#003006] leading-tight mb-3">
                  How do you want to use Sunlit?
                </h1>
                <p className="font-[Inter] text-sm md:text-base text-[#40493d] leading-relaxed">
                  Choose the option that best describes what you’re here to do. We’ll take you to the Sunlit experience built specifically for your needs.
                </p>
              </div>

              {/* Atmospheric Image Container */}
              <div className="hidden md:block mt-8 rounded-2xl overflow-hidden relative shadow-sm border border-[#c0c9bb]/30 h-72">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDqloNyPlu__WldMg_afBmBVt15i1qR13c3wz3YUNr5AwjYGbYj5jXzIf42mQjh__wCrfZJCWb9uu-WkKGQbcGjFiMHzwDCV27QK4Hhc0dHtgnMbo59OYHlcoz-LzuaavyGuz2P9chReK4hv972wC8xvJvicq2AeILtA0_qLqKkywZBHEXS3gNGJbW1ULdBSy9r0xyb1m8vTCsPe4JtMwGlUSb173tbhNuB3C1INa2OP-pCgdmt0nd62g')`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#003006]/85 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-white/90 backdrop-blur-md rounded-xl border border-white/40">
                  <p className="font-[Inter] text-xs font-medium text-[#191d17]">
                    Join 500+ verified solar engineering professionals and energy project owners in Nigeria.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Role Selection */}
            <div className="w-full md:w-7/12 flex flex-col justify-center">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#c0c9bb]/40 shadow-sm max-w-xl mx-auto w-full">
                <label className="block font-[Inter] text-xs font-bold text-[#40493d] uppercase tracking-wider mb-4">
                  Select your primary role
                </label>

                {/* Role Options Grid */}
                <div className="space-y-3">

                  {/* Option 1: Energy Solution Needed (Project Owner) */}
                  <div
                    onClick={() => setRole('consumer')}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      role === 'consumer'
                        ? 'border-[#003006] bg-[#fcf2eb]/60 shadow-sm'
                        : 'border-[#e0e4db] hover:border-[#003006]/40 hover:bg-[#f7fbf1]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        role === 'consumer' ? 'bg-[#003006] text-white' : 'bg-[#ecefe6] text-[#40493d]'
                      }`}>
                        <Home size={22} />
                      </div>
                      <div>
                        <div className="font-[Manrope] text-base font-bold text-[#191d17]">
                          I need an energy solution
                        </div>
                        <div className="text-xs text-[#707a6c]">
                          Homeowner, Commercial SME, Real Estate Developer
                        </div>
                      </div>
                    </div>
                    {role === 'consumer' && (
                      <CheckCircle2 size={20} className="text-[#003006] shrink-0 ml-2" />
                    )}
                  </div>

                  {/* Option 2: Provide Energy Services (Installer/EPC) */}
                  <div
                    onClick={() => setRole('provider')}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      role === 'provider'
                        ? 'border-[#003006] bg-[#fcf2eb]/60 shadow-sm'
                        : 'border-[#e0e4db] hover:border-[#003006]/40 hover:bg-[#f7fbf1]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        role === 'provider' ? 'bg-[#003006] text-white' : 'bg-[#ecefe6] text-[#40493d]'
                      }`}>
                        <Wrench size={22} />
                      </div>
                      <div>
                        <div className="font-[Manrope] text-base font-bold text-[#191d17]">
                          I provide energy services
                        </div>
                        <div className="text-xs text-[#707a6c]">
                          Solar Installer, EPC Contractor, Operations Technician
                        </div>
                      </div>
                    </div>
                    {role === 'provider' && (
                      <CheckCircle2 size={20} className="text-[#003006] shrink-0 ml-2" />
                    )}
                  </div>

                  {/* Option 3: Equipment Supplier */}
                  <div
                    onClick={() => setRole('supplier')}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      role === 'supplier'
                        ? 'border-[#003006] bg-[#fcf2eb]/60 shadow-sm'
                        : 'border-[#e0e4db] hover:border-[#003006]/40 hover:bg-[#f7fbf1]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        role === 'supplier' ? 'bg-[#003006] text-white' : 'bg-[#ecefe6] text-[#40493d]'
                      }`}>
                        <Package size={22} />
                      </div>
                      <div>
                        <div className="font-[Manrope] text-base font-bold text-[#191d17]">
                          I supply energy hardware
                        </div>
                        <div className="text-xs text-[#707a6c]">
                          Tier-1 Inverter & Battery OEM, Equipment Distributor
                        </div>
                      </div>
                    </div>
                    {role === 'supplier' && (
                      <CheckCircle2 size={20} className="text-[#003006] shrink-0 ml-2" />
                    )}
                  </div>

                  {/* Option 4: Project Financier */}
                  <div
                    onClick={() => setRole('financier')}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      role === 'financier'
                        ? 'border-[#003006] bg-[#fcf2eb]/60 shadow-sm'
                        : 'border-[#e0e4db] hover:border-[#003006]/40 hover:bg-[#f7fbf1]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        role === 'financier' ? 'bg-[#003006] text-white' : 'bg-[#ecefe6] text-[#40493d]'
                      }`}>
                        <Landmark size={22} />
                      </div>
                      <div>
                        <div className="font-[Manrope] text-base font-bold text-[#191d17]">
                          I finance energy projects
                        </div>
                        <div className="text-xs text-[#707a6c]">
                          Bank, Infrastructure Fund, PPA Asset Owner
                        </div>
                      </div>
                    </div>
                    {role === 'financier' && (
                      <CheckCircle2 size={20} className="text-[#003006] shrink-0 ml-2" />
                    )}
                  </div>

                </div>

                <div className="pt-6 mt-6 border-t border-[#e0e4db] flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextFromRole}
                    className="w-full sm:w-auto bg-[#003006] text-white font-[Inter] text-sm font-semibold px-8 py-3.5 rounded-full hover:bg-[#0f631b] transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    Continue to Next Step
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 2: CUSTOMER TYPE SELECTION (Stitch 24df764caba14899b4f2770652bde0e7)
           ========================================================================= */}
        {step === 2 && (
          <div className="max-w-4xl mx-auto w-full">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ceee93] text-[#374e03] text-xs font-semibold uppercase tracking-wider mb-3">
                Step 2 of 7: Facility Profile
              </span>
              <h1 className="font-[Manrope] text-3xl md:text-4xl font-extrabold text-[#003006] mb-2">
                Who are you looking to power?
              </h1>
              <p className="font-[Inter] text-sm md:text-base text-[#40493d]">
                Tell us what you're working with so we can tailor your energy assessment and sizing specifications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {/* Homeowner Card */}
              <div
                onClick={() => setCustomerType('homeowner')}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  customerType === 'homeowner'
                    ? 'border-[#003006] bg-white shadow-lg ring-2 ring-[#003006]/10'
                    : 'border-[#c0c9bb]/40 bg-white/70 hover:border-[#003006]/50 hover:bg-white'
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#003006] text-white flex items-center justify-center mb-4 shadow-sm">
                    <Home size={24} />
                  </div>
                  <h3 className="font-[Manrope] text-xl font-bold text-[#003006] mb-1">Homeowner</h3>
                  <span className="text-xs font-semibold text-[#76b970] uppercase tracking-wider block mb-3">
                    Residential Power
                  </span>
                  <p className="font-[Inter] text-xs text-[#40493d] leading-relaxed">
                    Tailored solar solutions for residential properties, ensuring reliable 24/7 power for your family and appliances.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#e0e4db] flex items-center justify-between text-xs font-semibold text-[#003006]">
                  <span>Select Residential</span>
                  {customerType === 'homeowner' ? <CheckCircle2 size={18} /> : <ArrowRight size={16} />}
                </div>
              </div>

              {/* SME / Business Card */}
              <div
                onClick={() => setCustomerType('business')}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  customerType === 'business'
                    ? 'border-[#003006] bg-white shadow-lg ring-2 ring-[#003006]/10'
                    : 'border-[#c0c9bb]/40 bg-white/70 hover:border-[#003006]/50 hover:bg-white'
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#003006] text-white flex items-center justify-center mb-4 shadow-sm">
                    <Store size={24} />
                  </div>
                  <h3 className="font-[Manrope] text-xl font-bold text-[#003006] mb-1">SME / Business</h3>
                  <span className="text-xs font-semibold text-[#76b970] uppercase tracking-wider block mb-3">
                    Commercial Operations
                  </span>
                  <p className="font-[Inter] text-xs text-[#40493d] leading-relaxed">
                    Robust energy infrastructure designed to displace expensive diesel generation and keep operations seamless.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#e0e4db] flex items-center justify-between text-xs font-semibold text-[#003006]">
                  <span>Select Commercial</span>
                  {customerType === 'business' ? <CheckCircle2 size={18} /> : <ArrowRight size={16} />}
                </div>
              </div>

              {/* Developer / Estate Card */}
              <div
                onClick={() => setCustomerType('developer')}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  customerType === 'developer'
                    ? 'border-[#003006] bg-white shadow-lg ring-2 ring-[#003006]/10'
                    : 'border-[#c0c9bb]/40 bg-white/70 hover:border-[#003006]/50 hover:bg-white'
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#003006] text-white flex items-center justify-center mb-4 shadow-sm">
                    <Building2 size={24} />
                  </div>
                  <h3 className="font-[Manrope] text-xl font-bold text-[#003006] mb-1">Developer</h3>
                  <span className="text-xs font-semibold text-[#76b970] uppercase tracking-wider block mb-3">
                    Infrastructure Scale
                  </span>
                  <p className="font-[Inter] text-xs text-[#40493d] leading-relaxed">
                    Centralized mini-grid and estate infrastructure planning for residential estates and multi-tenant complexes.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#e0e4db] flex items-center justify-between text-xs font-semibold text-[#003006]">
                  <span>Select Infrastructure</span>
                  {customerType === 'developer' ? <CheckCircle2 size={18} /> : <ArrowRight size={16} />}
                </div>
              </div>

            </div>

            <div className="mt-8 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-[#40493d] hover:text-[#003006] flex items-center gap-1.5"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="bg-[#003006] text-white font-[Inter] text-sm font-semibold px-8 py-3.5 rounded-full hover:bg-[#0f631b] transition-all shadow-md flex items-center gap-2"
              >
                Continue to Energy Assessment
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 3: LOAD ASSESSMENT (Stitch 0fdacae958664dd8a7c1ff4aaf9e7747)
           ========================================================================= */}
        {step === 3 && (
          <div className="max-w-3xl mx-auto w-full bg-white p-6 sm:p-10 rounded-2xl border border-[#c0c9bb]/40 shadow-sm">
            <div className="mb-6 pb-4 border-b border-[#e0e4db]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ceee93] text-[#374e03] text-xs font-semibold uppercase tracking-wider mb-2">
                Step 3 of 7: Energy Profiling
              </span>
              <h2 className="font-[Manrope] text-2xl sm:text-3xl font-bold text-[#003006]">
                Configure Your Energy Parameters
              </h2>
              <p className="font-[Inter] text-xs sm:text-sm text-[#40493d] mt-1">
                Enter your location and target appliances to generate high-accuracy sizing.
              </p>
            </div>

            <div className="space-y-6">
              {/* Location Select */}
              <div>
                <label className="block text-xs font-bold text-[#40493d] uppercase tracking-wider mb-2">
                  Project Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#c0c9bb] bg-[#f7fbf1]/30 text-sm font-medium focus:ring-2 focus:ring-[#003006] outline-none"
                >
                  <option>Lagos State (Ikeja / Lekki / VI / Ikoyi / Mainland)</option>
                  <option>Abuja FCT (Maitama / Wuse / Gwarinpa / Asokoro)</option>
                  <option>Ogun State (Abeokuta / Sagamu / Mowe / Ibafo)</option>
                  <option>Rivers State (Port Harcourt / GRA)</option>
                  <option>Oyo State (Ibadan / Ring Road)</option>
                  <option>Kano State</option>
                  <option>Enugu State</option>
                  <option>Delta State (Warri / Asaba)</option>
                </select>
              </div>

              {/* Grid Hours Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-[#40493d] uppercase tracking-wider">
                    Average Daily Grid Availability
                  </label>
                  <span className="text-sm font-bold text-[#003006]">{gridHours} Hours / Day</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={gridHours}
                  onChange={(e) => setGridHours(Number(e.target.value))}
                  className="w-full accent-[#003006] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#707a6c] mt-1">
                  <span>0 hrs (Complete Off-Grid)</span>
                  <span>12 hrs</span>
                  <span>24 hrs (Continuous Grid)</span>
                </div>
              </div>

              {/* Monthly Bill */}
              <div>
                <label className="block text-xs font-bold text-[#40493d] uppercase tracking-wider mb-2">
                  Current Monthly Electricity + Fuel Spend
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['₦50,000 - ₦100,000', '₦100,000 - ₦250,000', '₦250,000+'].map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setMonthlyBill(tier)}
                      className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                        monthlyBill === tier
                          ? 'border-[#003006] bg-[#fcf2eb] text-[#003006]'
                          : 'border-[#c0c9bb] bg-white text-[#40493d] hover:bg-[#f7fbf1]'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Appliance Checklist */}
              <div>
                <label className="block text-xs font-bold text-[#40493d] uppercase tracking-wider mb-2">
                  Key Priority Loads to Power
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'Lighting & Smart Home',
                    'Refrigeration / Freezer',
                    '1.5HP Inverter Air Conditioners (x2)',
                    'Water Pumping Machine',
                    'Microwave & Light Kitchen',
                    'Home Office / Laptops & Router',
                    'Heavy Machinery / Motors (Commercial)',
                    'Security CCTV & Gate Automation'
                  ].map((appliance) => (
                    <div
                      key={appliance}
                      onClick={() => toggleAppliance(appliance)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        appliances.includes(appliance)
                          ? 'border-[#003006] bg-[#003006]/5 text-[#003006]'
                          : 'border-[#e0e4db] bg-white text-[#40493d] hover:bg-[#f7fbf1]'
                      }`}
                    >
                      <span className="text-xs font-medium">{appliance}</span>
                      {appliances.includes(appliance) ? (
                        <CheckCircle2 size={16} className="text-[#003006]" />
                      ) : (
                        <div className="w-4 h-4 rounded border border-[#c0c9bb]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#e0e4db] flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs font-semibold text-[#40493d] hover:text-[#003006] flex items-center gap-1.5"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="bg-[#003006] text-white font-[Inter] text-sm font-semibold px-8 py-3.5 rounded-full hover:bg-[#0f631b] transition-all shadow-md flex items-center gap-2"
              >
                Calculate System Sizing
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 4: SYSTEM RECOMMENDATION (Stitch 6a573662124e4318b289047673f2224e)
           ========================================================================= */}
        {step === 4 && (
          <div className="max-w-4xl mx-auto w-full">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ceee93] text-[#374e03] text-xs font-semibold uppercase tracking-wider mb-3">
                Step 4 of 7: Engineering Sizing
              </span>
              <h1 className="font-[Manrope] text-3xl md:text-4xl font-extrabold text-[#003006] mb-2">
                Recommended System Architecture
              </h1>
              <p className="font-[Inter] text-sm md:text-base text-[#40493d]">
                Engineered for 99.4% power reliability and optimal generator displacement.
              </p>
            </div>

            {/* Hardware Sizing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-6 rounded-2xl border border-[#c0c9bb]/40 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#003006]/10 text-[#003006] flex items-center justify-center mb-3">
                    <Zap size={20} />
                  </div>
                  <div className="text-xs text-[#707a6c] font-semibold uppercase tracking-wider">Inverter Capacity</div>
                  <div className="font-[Manrope] text-3xl font-extrabold text-[#003006] my-1">
                    {inverterKva.toFixed(1)} kVA
                  </div>
                  <p className="text-xs text-[#40493d]">Pure Sine Wave Hybrid with MPPT solar charge controller.</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#e0e4db] text-[11px] font-semibold text-[#0f631b]">
                  Supports Surge Loads
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#c0c9bb]/40 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#003006]/10 text-[#003006] flex items-center justify-center mb-3">
                    <Battery size={20} />
                  </div>
                  <div className="text-xs text-[#707a6c] font-semibold uppercase tracking-wider">Storage Bank</div>
                  <div className="font-[Manrope] text-3xl font-extrabold text-[#003006] my-1">
                    {batteryKwh.toFixed(1)} kWh
                  </div>
                  <p className="text-xs text-[#40493d]">Tier-1 LiFePO4 (Lithium Iron Phosphate) with 6,000+ cycle lifespan.</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#e0e4db] text-[11px] font-semibold text-[#0f631b]">
                  ~14 hrs Autonomy
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#c0c9bb]/40 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#003006]/10 text-[#003006] flex items-center justify-center mb-3">
                    <Sun size={20} />
                  </div>
                  <div className="text-xs text-[#707a6c] font-semibold uppercase tracking-wider">Solar Array</div>
                  <div className="font-[Manrope] text-3xl font-extrabold text-[#003006] my-1">
                    {solarKwp.toFixed(1)} kWp
                  </div>
                  <p className="text-xs text-[#40493d]">Tier-1 Monocrystalline N-Type TOPCon high-yield panels.</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#e0e4db] text-[11px] font-semibold text-[#0f631b]">
                  ~22 kWh Daily Harvest
                </div>
              </div>
            </div>

            {/* Financial & Cost Summary */}
            <div className="bg-[#fcf2eb] p-6 sm:p-8 rounded-2xl border border-[#c0c9bb]/40 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold text-[#707a6c] uppercase tracking-wider">Estimated Turnkey Investment</span>
                <div className="font-[Manrope] text-2xl sm:text-3xl font-extrabold text-[#003006] mt-1">
                  ₦{costMin.toLocaleString()} – ₦{costMax.toLocaleString()}
                </div>
                <p className="text-xs text-[#40493d] mt-1">
                  Includes Tier-1 hardware, professional mounting, surge protection, and warranty.
                </p>
              </div>
              <div className="flex flex-col items-start sm:items-end">
                <span className="text-xs font-bold text-[#0f631b] bg-[#ceee93] px-3 py-1 rounded-full uppercase tracking-wider">
                  85% Generator Fuel Savings
                </span>
                <span className="text-xs text-[#707a6c] mt-2">Estimated Payback: 2.1 – 2.8 Years</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="text-xs font-semibold text-[#40493d] hover:text-[#003006] flex items-center gap-1.5"
              >
                <ArrowLeft size={16} /> Back to Parameters
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                className="bg-[#003006] text-white font-[Inter] text-sm font-semibold px-8 py-3.5 rounded-full hover:bg-[#0f631b] transition-all shadow-md flex items-center gap-2"
              >
                Save Sizing & Create Account
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 5: REGISTRATION GATE (Stitch 8029d289514d4da88a1ca619fee1cce6 / 7e85a9fced5f4af69bb082cc85ccaea4)
           ========================================================================= */}
        {step === 5 && (
          <div className="max-w-xl mx-auto w-full bg-white p-6 sm:p-10 rounded-2xl border border-[#c0c9bb]/40 shadow-xl">
            {/* Sizing Context Badge */}
            <div className="bg-[#fcf2eb] rounded-xl p-4 border border-[#c0c9bb]/30 flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#003006] text-white flex items-center justify-center shrink-0">
                <Sun size={20} />
              </div>
              <div className="flex-1">
                <div className="font-[Manrope] text-sm font-bold text-[#003006]">
                  {location.split(' ')[0]} {customerType === 'homeowner' ? 'Residence' : 'Facility'} • {inverterKva}kVA System
                </div>
                <div className="text-xs text-[#707a6c]">
                  Est. ₦{costMin.toLocaleString()} – ₦{costMax.toLocaleString()} • Ready for verified installer quotation
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-[Manrope] text-2xl font-bold text-[#191d17] mb-1">
                Save Assessment & Create Account
              </h2>
              <p className="font-[Inter] text-xs text-[#40493d]">
                Set up your Sunlit workspace to track bids, manage EPC proposals, and access digital escrow.
              </p>
            </div>

            {authError && (
              <div className="p-3.5 mb-5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAccountCreation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#40493d] uppercase tracking-wider mb-1">
                  Full Name / Company Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Babatunde Adeleke"
                  className="w-full px-4 py-3 rounded-xl border border-[#c0c9bb] bg-[#f7fbf1]/30 text-sm focus:ring-2 focus:ring-[#003006] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#40493d] uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="babatunde@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-[#c0c9bb] bg-[#f7fbf1]/30 text-sm focus:ring-2 focus:ring-[#003006] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#40493d] uppercase tracking-wider mb-1">
                    Phone (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="w-full px-4 py-3 rounded-xl border border-[#c0c9bb] bg-[#f7fbf1]/30 text-sm focus:ring-2 focus:ring-[#003006] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#40493d] uppercase tracking-wider mb-1">
                  Create Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-[#c0c9bb] bg-[#f7fbf1]/30 text-sm focus:ring-2 focus:ring-[#003006] outline-none pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-[#003006]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="mt-1 rounded border-[#c0c9bb] text-[#003006] focus:ring-[#003006]"
                />
                <label htmlFor="terms" className="text-xs text-[#707a6c] cursor-pointer">
                  I agree to Sunlit's <Link href="/terms" className="text-[#003006] underline">Terms of Service</Link> and <Link href="/privacy" className="text-[#003006] underline">Privacy Policy</Link>.
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#003006] text-white font-[Inter] text-sm font-semibold py-3.5 px-6 rounded-full hover:bg-[#0f631b] transition-all shadow-md mt-4 flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? 'Creating Workspace...' : 'Create Account & Continue'}
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        )}

        {/* =========================================================================
            STEP 6: MARKETPLACE BROADCAST / MATCHING (Stitch 02d7e573956241b18d8994c92913ca35)
           ========================================================================= */}
        {step === 6 && (
          <div className="max-w-3xl mx-auto w-full bg-white p-6 sm:p-10 rounded-2xl border border-[#c0c9bb]/40 shadow-sm">
            <div className="mb-6 pb-4 border-b border-[#e0e4db]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ceee93] text-[#374e03] text-xs font-semibold uppercase tracking-wider mb-2">
                Step 6 of 7: Installer Matching
              </span>
              <h2 className="font-[Manrope] text-2xl sm:text-3xl font-bold text-[#003006]">
                How would you like to receive proposals?
              </h2>
              <p className="font-[Inter] text-xs sm:text-sm text-[#40493d] mt-1">
                Choose between broadcasting your RFQ to vetted local installers or selecting a direct engineering partner.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {/* Option A: Broadcast RFQ */}
              <div
                onClick={() => setBroadcastMode('broadcast')}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                  broadcastMode === 'broadcast'
                    ? 'border-[#003006] bg-[#fcf2eb]/60 shadow-sm'
                    : 'border-[#e0e4db] hover:border-[#003006]/30 bg-white'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#003006] text-white flex items-center justify-center shrink-0">
                  <Sparkles size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-[Manrope] text-base font-bold text-[#191d17]">
                      Broadcast to Top Certified Installers (Recommended)
                    </h4>
                    {broadcastMode === 'broadcast' && <CheckCircle2 size={18} className="text-[#003006]" />}
                  </div>
                  <p className="text-xs text-[#40493d] leading-relaxed">
                    Sunlit automatically sends your anonymized system specifications to 3–5 top-rated, certified EPC installers in {location.split(' ')[0]}. You receive competitive bids with guaranteed SLAs.
                  </p>
                </div>
              </div>

              {/* Option B: Direct Selection */}
              <div
                onClick={() => setBroadcastMode('direct')}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                  broadcastMode === 'direct'
                    ? 'border-[#003006] bg-[#fcf2eb]/60 shadow-sm'
                    : 'border-[#e0e4db] hover:border-[#003006]/30 bg-white'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#003006] text-white flex items-center justify-center shrink-0">
                  <Building2 size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-[Manrope] text-base font-bold text-[#191d17]">
                      Direct Partner Assignment
                    </h4>
                    {broadcastMode === 'direct' && <CheckCircle2 size={18} className="text-[#003006]" />}
                  </div>
                  <p className="text-xs text-[#40493d] leading-relaxed">
                    Directly assign your project assessment to an enterprise Tier-1 installer from the Sunlit Directory.
                  </p>

                  {broadcastMode === 'direct' && (
                    <div className="mt-3 pt-3 border-t border-[#e0e4db]">
                      <select
                        value={selectedInstaller}
                        onChange={(e) => setSelectedInstaller(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#c0c9bb] bg-white text-xs font-medium outline-none"
                      >
                        <option>Solavita Engineering Ltd (Rating 4.9 • 48 Installations)</option>
                        <option>Zenith Power Systems (Rating 4.8 • 36 Installations)</option>
                        <option>Apex Green Infrastructure (Rating 5.0 • 29 Installations)</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(5)}
                className="text-xs font-semibold text-[#40493d] hover:text-[#003006] flex items-center gap-1.5"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="button"
                onClick={handleFinishBroadcast}
                className="bg-[#003006] text-white font-[Inter] text-sm font-semibold px-8 py-3.5 rounded-full hover:bg-[#0f631b] transition-all shadow-md flex items-center gap-2"
              >
                Submit Project & Enter Workspace
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 7: SUCCESS & ROUTING (Stitch ffb67aa494b843028fb48f31a27cc7e5 / 3cf3de4c43c947e5b80da4feac9da5b5)
           ========================================================================= */}
        {step === 7 && (
          <div className="max-w-2xl mx-auto w-full bg-white p-8 sm:p-12 rounded-3xl border border-[#c0c9bb]/40 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#003006] text-[#aef4a5] flex items-center justify-center mx-auto mb-6 shadow-md">
              <FileCheck size={32} />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ceee93] text-[#374e03] text-xs font-semibold uppercase tracking-wider mb-3">
              Assessment Successfully Saved
            </span>

            <h1 className="font-[Manrope] text-3xl font-extrabold text-[#003006] mb-3">
              Your Project Is Live on Sunlit
            </h1>

            <p className="font-[Inter] text-sm text-[#40493d] max-w-md mx-auto mb-8 leading-relaxed">
              Your {inverterKva}kVA energy profile for {location.split(' ')[0]} has been published. Certified EPC contractors are reviewing your load telemetry.
            </p>

            <div className="bg-[#fcf2eb] rounded-2xl p-5 border border-[#c0c9bb]/30 max-w-md mx-auto mb-8 text-left space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#707a6c]">Reference ID:</span>
                <span className="font-mono font-bold text-[#003006]">SL-RFQ-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#707a6c]">System Capacity:</span>
                <span className="font-bold text-[#191d17]">{inverterKva} kVA Inverter / {batteryKwh} kWh LiFePO4</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#707a6c]">Estimated Investment:</span>
                <span className="font-bold text-[#003006]">₦{costMin.toLocaleString()} – ₦{costMax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#707a6c]">Matching Mode:</span>
                <span className="font-bold text-[#191d17]">{broadcastMode === 'broadcast' ? 'Broadcast RFQ' : `Direct: ${selectedInstaller}`}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard/project-owner"
                className="bg-[#003006] text-white font-[Inter] text-sm font-semibold py-3.5 px-8 rounded-full hover:bg-[#0f631b] transition-all shadow-md flex items-center justify-center gap-2"
              >
                Go to Customer Workspace
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/installers"
                className="bg-transparent text-[#003006] font-[Inter] text-sm font-semibold py-3.5 px-6 rounded-full border border-[#003006]/30 hover:bg-[#003006]/5 transition-all flex items-center justify-center"
              >
                Browse Installer Directory
              </Link>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}

export default function GetStartedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7fbf1] flex items-center justify-center font-[Inter] text-xs text-[#707a6c]">Loading Sunlit Onboarding...</div>}>
      <GetStartedFlowInner />
    </Suspense>
  );
}
