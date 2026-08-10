'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
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
  Wrench,
  Package,
  Landmark,
  ShieldCheck,
  Zap,
  Battery,
  Eye,
  EyeOff,
  AlertCircle,
  Clock,
  Sparkles,
  Search,
  MapPin,
  Star,
  Check,
  Send,
  X,
  Award,
  FileCheck
} from 'lucide-react';
import { authService } from '@/services/auth.service';
import { SunlitLogo } from '@/shared/components/brand/SunlitLogo';

type UserRole = 'consumer' | 'provider' | 'supplier' | 'financier';
type CustomerType = 'homeowner' | 'business' | 'developer';

interface InstallerItem {
  id: string;
  name: string;
  badge: 'Premium Partner' | 'Enterprise EPC' | 'Verified Partner';
  rating: number;
  reviewsCount: number;
  completedJobs: number;
  coverage: string;
  responseTime: string;
  experience: string;
  imageUrl: string;
  certifications: string[];
  description: string;
}

const LOCAL_INSTALLERS: InstallerItem[] = [
  {
    id: 'solavita',
    name: 'Solavita Engineering Ltd',
    badge: 'Premium Partner',
    rating: 4.9,
    reviewsCount: 48,
    completedJobs: 142,
    coverage: 'Lekki, VI, Ikoyi & Ikeja',
    responseTime: 'Avg. 45 min response',
    experience: '7 years in enterprise solar',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxFrw_CLm54QbXD7WfQjOEFG6D5N63akUFC54wW73XFcav_FKgUQtVNhkrvMsYODSJ8sqK2XMO4CIg1zp2P31DJdQtbcwqh6EEg5rOxoYu-jNVodZ2JpMioG31-CuU2zZ7wSQ1fKW9yS375FHdHwyNZD6jg--iUHIo0hADqIEdqQTRESRb71dxgVVZ3wu8ZVaL8965-P7XJl0-P5GC_p_JgMg-g8prRgvBJ5eEL_nfB3kPMY6fzBK3-w',
    certifications: ['COREN Certified', 'NEMSA Licensed', 'Tier-1 LiFePO4 Specialist'],
    description: 'Premier turnkey solar & storage contractor with over 15MW of installed commercial and residential capacity in Southwest Nigeria.'
  },
  {
    id: 'zenith-power',
    name: 'Zenith Power Systems',
    badge: 'Enterprise EPC',
    rating: 4.8,
    reviewsCount: 36,
    completedJobs: 98,
    coverage: 'Lagos State & Ogun Corridor',
    responseTime: 'Avg. 1.2 hrs response',
    experience: '6 years experience',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsG5gYszHl3xGCbi5m3pcTHJk4sdHwsxnC9OwllB2g07SURk6h1DCLdAm4z2D3Onn4RMrVR9UbytK4Qs0Xz6Z3mJ3wP2e6KDdzDKsTOMSQiPNBPIV_wYHvEFbfDIksVoQd4jlWKImh-ndmF1HMDWQdULKaVWI4vpdNxnozDvyXsilNR_Uh0R0Bzx07qvqBvLFdz8MdDHxHzk6L6e0J6EK7UDSon_XvwW06eAK9fFVFG4rm19kcGQUJ7Q',
    certifications: ['ISO 9001:2015', 'NEMSA Category 1', 'Schneider/Victron Certified'],
    description: 'Specializing in hybrid industrial microgrids and zero-downtime corporate energy transitions with comprehensive SLAs.'
  },
  {
    id: 'apex-green',
    name: 'Apex Green Infrastructure',
    badge: 'Premium Partner',
    rating: 5.0,
    reviewsCount: 29,
    completedJobs: 85,
    coverage: 'Lagos, Abuja & Port Harcourt',
    responseTime: 'Avg. 30 min response',
    experience: '8 years experience',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1yqcQpHsqTlSPinCugSb48z6bkzzKdnNGkF7iRuuiMVDYVY8yTg29NK1s0amlINBnfdj3dMZrS-m-zLL1Hn8Y3mqz4PNLRUijYzaHM8_W-2uoYBNPxvjVN5qd2uN64RDUZIAykUZGKnEecXWcIxyAU8sVUi1jW2HHn3ygUxJ6ql_RTfvMAeYqBRpx-8vHWIJx5J5w77zEMw9L6fS3p875G187fV4RrzYkGcwHQ7fn4j3xlf35aSVXog',
    certifications: ['COREN Registered Engineers', 'Tesla Certified Installer', 'Huawei FusionSolar Partner'],
    description: 'High-end smart energy integration for luxury residences and gated multi-tenant estates.'
  },
  {
    id: 'sunpower-hub',
    name: 'SunPower Hub Systems',
    badge: 'Verified Partner',
    rating: 4.7,
    reviewsCount: 52,
    completedJobs: 110,
    coverage: 'Victoria Island, Lekki & Ajah',
    responseTime: 'Avg. 1 hr response',
    experience: '5 years experience',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPJXzSpiKfVI5yPO65RZGLhMkwrLICvzvjF90EkxBvTPhCNYNLO3SXUowNmjgCuYfv4Hzy3yKtK2raic-v4loJoKUoJJJnL0uK9oIZkXHuRneg-XvubVGTjjauoL7Lbn6yveAmiUhAZgRKybg16l7Nswb4ZPb33tKP3Whayjt-B0bkLCfQqonAaD_TOEErMfzDB4QFNaVYmcCtzXGefKXACEUWx4VjreVj9eQQbSxZHkTYPi7kxE5gXQ',
    certifications: ['NEMSA Certified', 'Growatt / Deye Master Installer'],
    description: 'Cost-effective, reliable residential and SME solar-plus-storage solutions with guaranteed 5-year workmanship warranties.'
  }
];

function GetStartedFlowInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoleParam = searchParams.get('role');

  // Step Sequence (Streamlined & Reordered):
  // 1 = Role Selection (Stitch 8029d289...)
  // 2 = Customer Facility Profile
  // 3 = Live Sizing Engine Preview (Instant System Sizing Model)
  // 4 = Recommended Architecture
  // 5 = Installer Matchmaking & Discovery ("Installers serving your area" - Stitch 808292ae... / 02d7e573... / 50678543...)
  // 6 = Save Assessment & Account Creation Gate (Stitch 7e85a9fc...)
  // 7 = Project Submission Confirmation
  const [step, setStep] = useState<number>(1);

  // Step 1: Role
  const [role, setRole] = useState<UserRole>('consumer');

  // Step 2: Customer Profile
  const [customerType, setCustomerType] = useState<CustomerType>('homeowner');

  // Step 3: Location & Live Sizing Engine
  const [location, setLocation] = useState('Lagos State (Ikeja / Lekki / VI / Ikoyi / Mainland)');
  const [dailyKwh, setDailyKwh] = useState<number>(15);
  const [autonomyHours, setAutonomyHours] = useState<number>(24);

  // Dynamic Live Sizing Engine Calculations
  const liveSizing = useMemo(() => {
    // Solar kWp = Daily kWh / (Peak Sun Hours 4.8 * system PR 0.80)
    const kwp = Math.round((dailyKwh / (4.8 * 0.80)) * 100) / 100;
    const panels550w = Math.ceil((kwp * 1000) / 550);
    // Battery kWh = (Daily kWh * (autonomyHours / 24)) / (0.85 DoD)
    const storageKwh = Math.round(((dailyKwh * (autonomyHours / 24)) / 0.85) * 10) / 10;
    // Inverter kVA = kwp * 1.0 (minimum rating)
    const invKva = Math.max(3.5, Math.round((kwp * 1.0) * 10) / 10);
    // Estimated Monthly Savings vs Diesel Gen & Grid (approx ₦6,750 per daily kWh)
    const monthlySavings = Math.round(dailyKwh * 6750);

    return {
      kwp: Math.max(3.0, kwp),
      panels: Math.max(6, panels550w),
      storageKwh: Math.max(5.0, storageKwh),
      inverterKva: invKva,
      monthlySavings
    };
  }, [dailyKwh, autonomyHours]);

  // Step 5: Installer Discovery & Dual Matching
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstallerIds, setSelectedInstallerIds] = useState<string[]>(['solavita']);
  const [viewingProfile, setViewingProfile] = useState<InstallerItem | null>(null);
  const [distributionSubView, setDistributionSubView] = useState<'directory' | 'confirm_selected' | 'marketplace_broadcast'>('directory');

  // Step 6: Account creation form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

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

  // Estimated Turnkey Cost Range based on calculated specs
  const costMin = Math.round(liveSizing.inverterKva * 420000 + liveSizing.storageKwh * 240000 + liveSizing.kwp * 310000);
  const costMax = Math.round(costMin * 1.22);

  const handleNextFromRole = () => {
    if (role === 'consumer') {
      setStep(2);
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
    const fullName = `${firstName} ${lastName}`.trim();
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
        role: 'project_owner'
      });

      if (regResult.ok) {
        // Save active project assessment payload with installer selection
        const assessmentPayload = {
          role,
          customerType,
          location,
          dailyKwh,
          autonomyHours,
          liveSizing,
          estimatedCostMin: costMin,
          estimatedCostMax: costMax,
          selectedInstallerIds,
          distributionMode: distributionSubView === 'confirm_selected' ? 'direct_assignment' : 'marketplace_broadcast'
        };
        localStorage.setItem('sunlit_active_assessment', JSON.stringify(assessmentPayload));
        setStep(7); // Proceed to Final Confirmation
      } else {
        setAuthError(regResult.error || 'Failed to create account. Please try again.');
      }
    } catch {
      setAuthError('An unexpected network error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelectInstaller = (id: string) => {
    if (selectedInstallerIds.includes(id)) {
      setSelectedInstallerIds(selectedInstallerIds.filter(item => item !== id));
    } else {
      setSelectedInstallerIds([...selectedInstallerIds, id]);
    }
  };

  const filteredInstallers = LOCAL_INSTALLERS.filter(inst => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return inst.name.toLowerCase().includes(q) || inst.coverage.toLowerCase().includes(q) || inst.badge.toLowerCase().includes(q);
  });

  const selectedInstallersData = LOCAL_INSTALLERS.filter(inst => selectedInstallerIds.includes(inst.id));

  return (
    <div className="bg-[#f7fbf1] text-[#191d17] min-h-screen flex flex-col font-sans antialiased selection:bg-[#ceee93] selection:text-[#131f00]">

      {/* Top Header — Contextual Onboarding Navigation */}
      <header className="w-full flex justify-between items-center px-4 md:px-8 h-16 bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-[#c0c9bb]/30">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center" aria-label="Sunlit Energy Home">
            <SunlitLogo variant="horizontal" theme="light" height={26} />
          </Link>
          <span className="hidden sm:inline-block w-px h-4 bg-[#c0c9bb]/60 mx-1" />
          <span className="hidden sm:inline-block text-xs font-semibold text-[#707a6c] uppercase tracking-wider">
            Global Onboarding
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs font-semibold text-[#003006] bg-[#ECEFE6] px-3.5 py-1.5 rounded-full border border-[#BFCABA]/50 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00490E] animate-pulse" />
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

      {/* Main Flow Container with smooth fade-in */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col justify-center animate-fade-in-up">

        {/* =========================================================================
            STEP 1: ROLE SELECTION (Stitch 8029d289514d4da88a1ca619fee1cce6 / 77332c5af35e45eb8791d8e26e294f90)
           ========================================================================= */}
        {step === 1 && (
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-stretch">
            {/* Left Column: Context & Imagery */}
            <div className="w-full md:w-5/12 flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ceee93] text-[#374e03] text-xs font-semibold uppercase tracking-wider mb-4">
                  <Sparkles size={14} /> Step 1 of 7: Role Selection
                </span>
                <h1 className="font-display text-3xl md:text-4xl font-extrabold text-[#003006] leading-tight mb-3">
                  How do you want to use Sunlit?
                </h1>
                <p className="text-sm md:text-base text-[#40493d] leading-relaxed">
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
                  <p className="text-xs font-medium text-[#191d17]">
                    Join 500+ verified solar engineering professionals and energy project owners in Nigeria.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Role Selection */}
            <div className="w-full md:w-7/12 flex flex-col justify-center">
              <div className="bg-[#fff8f5] p-6 sm:p-8 rounded-[20px] border border-[#c0c9bb]/40 shadow-sm max-w-xl mx-auto w-full">
                <label className="block text-xs font-bold text-[#40493d] uppercase tracking-wider mb-4">
                  Select your primary role
                </label>

                {/* Role Options Grid */}
                <div className="space-y-3">
                  {/* Option 1: Energy Solution Needed (Project Owner) */}
                  <div
                    onClick={() => setRole('consumer')}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      role === 'consumer'
                        ? 'border-[#003006] bg-[#f6ece6] shadow-sm'
                        : 'border-[#e0e4db] hover:border-[#003006]/40 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        role === 'consumer' ? 'bg-[#003006] text-white' : 'bg-[#ecefe6] text-[#40493d]'
                      }`}>
                        <Home size={22} />
                      </div>
                      <div>
                        <div className="font-display text-base font-bold text-[#191d17]">
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
                        ? 'border-[#003006] bg-[#f6ece6] shadow-sm'
                        : 'border-[#e0e4db] hover:border-[#003006]/40 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        role === 'provider' ? 'bg-[#003006] text-white' : 'bg-[#ecefe6] text-[#40493d]'
                      }`}>
                        <Wrench size={22} />
                      </div>
                      <div>
                        <div className="font-display text-base font-bold text-[#191d17]">
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
                        ? 'border-[#003006] bg-[#f6ece6] shadow-sm'
                        : 'border-[#e0e4db] hover:border-[#003006]/40 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        role === 'supplier' ? 'bg-[#003006] text-white' : 'bg-[#ecefe6] text-[#40493d]'
                      }`}>
                        <Package size={22} />
                      </div>
                      <div>
                        <div className="font-display text-base font-bold text-[#191d17]">
                          I supply energy hardware
                        </div>
                        <div className="text-xs text-[#707a6c]">
                          Tier-1 Inverter &amp; Battery OEM, Equipment Distributor
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
                        ? 'border-[#003006] bg-[#f6ece6] shadow-sm'
                        : 'border-[#e0e4db] hover:border-[#003006]/40 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        role === 'financier' ? 'bg-[#003006] text-white' : 'bg-[#ecefe6] text-[#40493d]'
                      }`}>
                        <Landmark size={22} />
                      </div>
                      <div>
                        <div className="font-display text-base font-bold text-[#191d17]">
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
                    className="w-full sm:w-auto bg-[#003006] text-white text-sm font-semibold px-8 py-3.5 rounded-full hover:bg-[#0f631b] transition-all shadow-md flex items-center justify-center gap-2 hover-lift"
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
            STEP 2: CUSTOMER TYPE SELECTION
           ========================================================================= */}
        {step === 2 && (
          <div className="max-w-4xl mx-auto w-full">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ceee93] text-[#374e03] text-xs font-semibold uppercase tracking-wider mb-3">
                Step 2 of 7: Facility Profile
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-extrabold text-[#003006] mb-2">
                Who are you looking to power?
              </h1>
              <p className="text-sm md:text-base text-[#40493d]">
                Tell us what you're working with so we can tailor your energy assessment and sizing specifications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Homeowner Card */}
              <div
                onClick={() => setCustomerType('homeowner')}
                className={`p-6 rounded-[20px] border-2 transition-all cursor-pointer flex flex-col justify-between hover-lift ${
                  customerType === 'homeowner'
                    ? 'border-[#003006] bg-[#fff8f5] shadow-lg ring-2 ring-[#003006]/10'
                    : 'border-[#c0c9bb]/40 bg-[#fff8f5]/70 hover:border-[#003006]/50 hover:bg-[#fff8f5]'
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#003006] text-white flex items-center justify-center mb-4 shadow-sm">
                    <Home size={24} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#003006] mb-1">Homeowner</h3>
                  <span className="text-xs font-semibold text-[#76b970] uppercase tracking-wider block mb-3">
                    Residential Power
                  </span>
                  <p className="text-xs text-[#40493d] leading-relaxed">
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
                className={`p-6 rounded-[20px] border-2 transition-all cursor-pointer flex flex-col justify-between hover-lift ${
                  customerType === 'business'
                    ? 'border-[#003006] bg-[#fff8f5] shadow-lg ring-2 ring-[#003006]/10'
                    : 'border-[#c0c9bb]/40 bg-[#fff8f5]/70 hover:border-[#003006]/50 hover:bg-[#fff8f5]'
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#003006] text-white flex items-center justify-center mb-4 shadow-sm">
                    <Store size={24} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#003006] mb-1">SME / Business</h3>
                  <span className="text-xs font-semibold text-[#76b970] uppercase tracking-wider block mb-3">
                    Commercial Operations
                  </span>
                  <p className="text-xs text-[#40493d] leading-relaxed">
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
                className={`p-6 rounded-[20px] border-2 transition-all cursor-pointer flex flex-col justify-between hover-lift ${
                  customerType === 'developer'
                    ? 'border-[#003006] bg-[#fff8f5] shadow-lg ring-2 ring-[#003006]/10'
                    : 'border-[#c0c9bb]/40 bg-[#fff8f5]/70 hover:border-[#003006]/50 hover:bg-[#fff8f5]'
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#003006] text-white flex items-center justify-center mb-4 shadow-sm">
                    <Building2 size={24} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#003006] mb-1">Developer</h3>
                  <span className="text-xs font-semibold text-[#76b970] uppercase tracking-wider block mb-3">
                    Infrastructure Scale
                  </span>
                  <p className="text-xs text-[#40493d] leading-relaxed">
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
                className="bg-[#003006] text-white text-sm font-semibold px-8 py-3.5 rounded-full hover:bg-[#0f631b] transition-all shadow-md flex items-center gap-2 hover-lift"
              >
                Continue to Live Sizing Engine
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 3: LIVE SIZING ENGINE PREVIEW (Instant System Sizing Model)
           ========================================================================= */}
        {step === 3 && (
          <div className="max-w-4xl mx-auto w-full space-y-6">
            <div className="text-center max-w-xl mx-auto mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ceee93] text-[#374e03] text-xs font-semibold uppercase tracking-wider mb-2">
                Step 3 of 7: Energy Sizing
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-extrabold text-[#003006] mb-1">
                Configure Your Energy Parameters
              </h1>
              <p className="text-xs sm:text-sm text-[#40493d]">
                Instant engineering model tailored for high-accuracy Nigerian solar sizing.
              </p>
            </div>

            {/* Focused LIVE SIZING ENGINE PREVIEW Card */}
            <div className="bg-[#fff8f5] p-6 sm:p-8 rounded-[24px] border border-[#c0c9bb]/40 shadow-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-[#c0c9bb]/30">
                <div>
                  <span className="text-[11px] font-bold tracking-wider text-[#536D21] uppercase">
                    LIVE SIZING ENGINE PREVIEW
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#003006] mt-0.5">
                    Instant System Sizing Model
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="px-3.5 py-1.5 rounded-full border border-[#c0c9bb] bg-[#f6ece6] text-xs font-semibold text-[#003006] focus:ring-2 focus:ring-[#003006] outline-none"
                  >
                    <option>Lagos State (Ikeja / Lekki / VI / Ikoyi)</option>
                    <option>Abuja FCT (Maitama / Wuse / Gwarinpa)</option>
                    <option>Ogun State (Abeokuta / Sagamu / Mowe)</option>
                    <option>Rivers State (Port Harcourt / GRA)</option>
                    <option>Oyo State (Ibadan / Ring Road)</option>
                    <option>Kano State</option>
                    <option>Enugu State</option>
                    <option>Delta State (Warri / Asaba)</option>
                  </select>
                  <span className="bg-[#CEEE93] text-[#003006] px-3 py-1 rounded-full text-[11px] font-bold">
                    REAL-TIME
                  </span>
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Daily Consumption Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-[#191D17]">Daily Energy Consumption</label>
                    <span className="text-xs font-bold text-[#00490E] bg-[#f6ece6] px-2 py-0.5 rounded-md">
                      {dailyKwh} kWh / day
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="60"
                    step="1"
                    value={dailyKwh}
                    onChange={(e) => setDailyKwh(Number(e.target.value))}
                    className="w-full accent-[#00490E] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#717A6D] mt-1">
                    <span>3 kWh (Small Home)</span>
                    <span>25 kWh (Duplex)</span>
                    <span>60 kWh (Commercial)</span>
                  </div>
                </div>

                {/* Desired Backup Autonomy */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-[#191D17]">Desired Backup Autonomy</label>
                    <span className="text-xs font-bold text-[#00490E] bg-[#f6ece6] px-2 py-0.5 rounded-md">
                      {autonomyHours} Hours
                    </span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="48"
                    step="4"
                    value={autonomyHours}
                    onChange={(e) => setAutonomyHours(Number(e.target.value))}
                    className="w-full accent-[#00490E] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#717A6D] mt-1">
                    <span>8 hrs (Partial)</span>
                    <span>24 hrs (Full 1-Day)</span>
                    <span>48 hrs (2-Day Autonomy)</span>
                  </div>
                </div>
              </div>

              {/* Output Bento Box */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-[#f6ece6] p-5 rounded-2xl border border-[#c0c9bb]/40 mb-2">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#707a6c] mb-1">
                    SOLAR ARRAY
                  </div>
                  <div className="font-display text-2xl font-bold text-[#00490E]">
                    {liveSizing.kwp} <span className="text-xs font-normal">kWp</span>
                  </div>
                  <div className="text-[11px] text-[#40493D] mt-0.5">
                    ≈ {liveSizing.panels} × 550W Panels
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#707a6c] mb-1">
                    BATTERY STORAGE
                  </div>
                  <div className="font-display text-2xl font-bold text-[#00490E]">
                    {liveSizing.storageKwh} <span className="text-xs font-normal">kWh</span>
                  </div>
                  <div className="text-[11px] text-[#40493D] mt-0.5">
                    LiFePO4 @ 85% DoD
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#707a6c] mb-1">
                    HYBRID INVERTER
                  </div>
                  <div className="font-display text-2xl font-bold text-[#00490E]">
                    {liveSizing.inverterKva} <span className="text-xs font-normal">kVA</span>
                  </div>
                  <div className="text-[11px] text-[#40493D] mt-0.5">
                    Pure Sine Wave
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#707a6c] mb-1">
                    EST. MONTHLY SAVINGS
                  </div>
                  <div className="font-display text-2xl font-bold text-[#00490E]">
                    ₦{liveSizing.monthlySavings.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-[#40493D] mt-0.5">
                    vs Grid &amp; Generator
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
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
                className="bg-[#003006] text-white text-sm font-semibold px-8 py-3.5 rounded-full hover:bg-[#0f631b] transition-all shadow-md flex items-center gap-2 hover-lift"
              >
                Calculate System Sizing
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 4: SYSTEM SIZING RECOMMENDATION
           ========================================================================= */}
        {step === 4 && (
          <div className="max-w-4xl mx-auto w-full">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ceee93] text-[#374e03] text-xs font-semibold uppercase tracking-wider mb-3">
                Step 4 of 7: Engineering Sizing
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-extrabold text-[#003006] mb-2">
                Recommended System Architecture
              </h1>
              <p className="text-sm md:text-base text-[#40493d]">
                Engineered for 99.4% power reliability and optimal generator displacement.
              </p>
            </div>

            {/* Hardware Sizing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#fff8f5] p-6 rounded-[20px] border border-[#c0c9bb]/40 shadow-sm flex flex-col justify-between hover-lift">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#003006]/10 text-[#003006] flex items-center justify-center mb-3">
                    <Zap size={20} />
                  </div>
                  <div className="text-xs text-[#707a6c] font-semibold uppercase tracking-wider">Inverter Capacity</div>
                  <div className="font-display text-3xl font-extrabold text-[#003006] my-1">
                    {liveSizing.inverterKva} kVA
                  </div>
                  <p className="text-xs text-[#40493d]">Pure Sine Wave Hybrid with MPPT solar charge controller.</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#e0e4db] text-[11px] font-semibold text-[#0f631b]">
                  Supports Surge Loads
                </div>
              </div>

              <div className="bg-[#fff8f5] p-6 rounded-[20px] border border-[#c0c9bb]/40 shadow-sm flex flex-col justify-between hover-lift">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#003006]/10 text-[#003006] flex items-center justify-center mb-3">
                    <Battery size={20} />
                  </div>
                  <div className="text-xs text-[#707a6c] font-semibold uppercase tracking-wider">Storage Bank</div>
                  <div className="font-display text-3xl font-extrabold text-[#003006] my-1">
                    {liveSizing.storageKwh} kWh
                  </div>
                  <p className="text-xs text-[#40493d]">Tier-1 LiFePO4 (Lithium Iron Phosphate) with 6,000+ cycle lifespan.</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#e0e4db] text-[11px] font-semibold text-[#0f631b]">
                  ~{autonomyHours} hrs Autonomy
                </div>
              </div>

              <div className="bg-[#fff8f5] p-6 rounded-[20px] border border-[#c0c9bb]/40 shadow-sm flex flex-col justify-between hover-lift">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#003006]/10 text-[#003006] flex items-center justify-center mb-3">
                    <Sun size={20} />
                  </div>
                  <div className="text-xs text-[#707a6c] font-semibold uppercase tracking-wider">Solar Array</div>
                  <div className="font-display text-3xl font-extrabold text-[#003006] my-1">
                    {liveSizing.kwp} kWp
                  </div>
                  <p className="text-xs text-[#40493d]">Tier-1 Monocrystalline N-Type TOPCon high-yield panels ({liveSizing.panels} modules).</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#e0e4db] text-[11px] font-semibold text-[#0f631b]">
                  ~{Math.round(liveSizing.kwp * 4.4)} kWh Daily Harvest
                </div>
              </div>
            </div>

            {/* Financial & Cost Summary */}
            <div className="bg-[#f6ece6] p-6 sm:p-8 rounded-[20px] border border-[#c0c9bb]/40 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold text-[#707a6c] uppercase tracking-wider">Estimated Turnkey Investment</span>
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-[#003006] mt-1">
                  ₦{costMin.toLocaleString()} – ₦{costMax.toLocaleString()}
                </div>
                <p className="text-xs text-[#40493d] mt-1">
                  Includes Tier-1 hardware, professional mounting, surge protection, and verified warranty.
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
                className="bg-[#003006] text-white text-sm font-semibold px-8 py-3.5 rounded-full hover:bg-[#0f631b] transition-all shadow-md flex items-center gap-2 hover-lift"
              >
                Discover Matched Installers
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 5: INSTALLER DISCOVERY & DUAL PROPOSAL MATCHING (Stitch 808292ae... / 02d7e573... / 50678543...)
            (Reordered: Appears BEFORE Account Creation Gate)
           ========================================================================= */}
        {step === 5 && (
          <div className="max-w-6xl mx-auto w-full">

            {/* Sub-view A: Installer Directory & Matchmaking */}
            {distributionSubView === 'directory' && (
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Left: Directory Listings */}
                <div className="flex-1 w-full space-y-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ceee93] text-[#374e03] text-xs font-semibold uppercase tracking-wider mb-2">
                      Step 5 of 7: Installer Matchmaking
                    </span>
                    <h1 className="font-display text-3xl font-extrabold text-[#003006]">
                      Installers serving your area
                    </h1>
                    <div className="flex items-center gap-2 text-[#40493d] text-xs mt-1">
                      <MapPin size={14} className="text-[#00490E]" />
                      <span>Showing vetted Tier-1 partners for {location.split(' ')[0]}</span>
                    </div>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#707a6c]" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search installers by name or specialty..."
                        className="w-full pl-10 pr-4 py-3 bg-[#fff8f5] border border-[#c0c9bb]/40 rounded-xl text-xs text-[#1F1B17] focus:border-[#00490E] outline-none"
                      />
                    </div>
                  </div>

                  {/* Installers Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredInstallers.map((installer) => {
                      const isSelected = selectedInstallerIds.includes(installer.id);
                      return (
                        <div
                          key={installer.id}
                          className={`bg-[#fff8f5] rounded-[20px] overflow-hidden border transition-all flex flex-col justify-between hover-lift ${
                            isSelected
                              ? 'border-[#003006] shadow-md ring-2 ring-[#003006]/20'
                              : 'border-[#c0c9bb]/40 hover:shadow-sm'
                          }`}
                        >
                          <div className="relative h-40 w-full bg-[#f6ece6] overflow-hidden">
                            <img
                              src={installer.imageUrl}
                              alt={installer.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 left-3 flex gap-2">
                              <span className="bg-[#003006] text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                                <ShieldCheck size={12} />
                                {installer.badge}
                              </span>
                            </div>
                            <div className="absolute top-3 right-3">
                              <button
                                type="button"
                                onClick={() => toggleSelectInstaller(installer.id)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                  isSelected
                                    ? 'bg-[#003006] text-white shadow-md'
                                    : 'bg-white/90 text-[#40493d] hover:bg-white'
                                }`}
                              >
                                {isSelected ? <Check size={16} /> : <div className="w-3.5 h-3.5 rounded border border-[#707a6c]" />}
                              </button>
                            </div>
                          </div>

                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-display font-bold text-base text-[#191d17]">
                                  {installer.name}
                                </h3>
                                <div className="flex items-center gap-1 bg-[#ECEFE6] px-2 py-0.5 rounded text-xs font-bold text-[#003006]">
                                  <Star size={12} className="fill-[#003006]" />
                                  <span>{installer.rating}</span>
                                  <span className="text-[#707a6c] font-normal">({installer.reviewsCount})</span>
                                </div>
                              </div>

                              <div className="space-y-1.5 text-xs text-[#40493d] mb-4">
                                <div className="flex items-center gap-1.5">
                                  <MapPin size={13} className="text-[#00490E]" />
                                  <span>{installer.coverage}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Clock size={13} className="text-[#00490E]" />
                                  <span>{installer.responseTime}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Award size={13} className="text-[#00490E]" />
                                  <span>{installer.experience} • {installer.completedJobs} projects</span>
                                </div>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-[#e0e4db] flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setViewingProfile(installer)}
                                className="flex-1 py-2 px-3 rounded-full border border-[#c0c9bb] text-xs font-semibold text-[#40493d] hover:bg-[#f6ece6] transition-colors"
                              >
                                View Profile
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleSelectInstaller(installer.id)}
                                className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold transition-all ${
                                  isSelected
                                    ? 'bg-[#003006] text-white shadow-sm'
                                    : 'bg-[#f6ece6] text-[#003006] hover:bg-[#003006] hover:text-white'
                                }`}
                              >
                                {isSelected ? 'Selected' : 'Select Partner'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Fallback Marketplace Broadcast Banner */}
                  <div className="p-6 bg-[#f6ece6] rounded-[20px] border border-[#c0c9bb]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="font-display text-sm font-bold text-[#003006] mb-0.5">
                        Can&apos;t decide on a specific installer?
                      </h4>
                      <p className="text-xs text-[#40493d]">
                        Let vetted installers bid openly on your project. Anonymously broadcast your RFQ to our certified marketplace.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDistributionSubView('marketplace_broadcast')}
                      className="shrink-0 py-3 px-6 rounded-full bg-[#003006] text-white text-xs font-semibold hover:bg-[#00490E] transition-all flex items-center gap-2 shadow-sm hover-lift"
                    >
                      <Sparkles size={14} />
                      Broadcast to Marketplace
                    </button>
                  </div>
                </div>

                {/* Right: Sticky Project Summary & Action Center */}
                <aside className="w-full lg:w-80 shrink-0 sticky top-24 space-y-4">
                  <div className="bg-[#fff8f5] rounded-[20px] border border-[#c0c9bb]/40 p-6 shadow-sm">
                    <h3 className="font-display text-base font-bold text-[#003006] mb-4 flex items-center gap-2">
                      <Sun size={18} className="text-[#00490E]" />
                      Project Specifications
                    </h3>

                    <div className="bg-[#f6ece6] rounded-xl p-4 mb-4">
                      <div className="text-[10px] font-bold text-[#707a6c] uppercase tracking-wider mb-1">
                        RECOMMENDED SYSTEM
                      </div>
                      <div className="font-display text-2xl font-bold text-[#00490E]">
                        {liveSizing.kwp} kWp Solar
                      </div>
                      <div className="text-xs text-[#40493d] mt-0.5">
                        {liveSizing.storageKwh} kWh LiFePO4 Storage
                      </div>
                    </div>

                    <div className="space-y-3 text-xs border-b border-[#e0e4db] pb-4 mb-4">
                      <div className="flex justify-between">
                        <span className="text-[#707a6c]">Location:</span>
                        <span className="font-semibold text-[#191d17] text-right truncate max-w-[140px]">{location.split(' ')[0]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#707a6c]">Daily Sizing:</span>
                        <span className="font-semibold text-[#191d17]">{dailyKwh} kWh/day</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#707a6c]">Est. Investment:</span>
                        <span className="font-bold text-[#00490E]">₦{costMin.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#707a6c]">Selected Partners:</span>
                        <span className="font-bold text-[#003006]">{selectedInstallerIds.length} Selected</span>
                      </div>
                    </div>

                    {/* Dual Action Buttons */}
                    <div className="space-y-2.5">
                      <button
                        type="button"
                        disabled={selectedInstallerIds.length === 0}
                        onClick={() => setDistributionSubView('confirm_selected')}
                        className="w-full py-3.5 px-4 rounded-full bg-[#003006] text-white text-xs font-semibold hover:bg-[#00490E] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 hover-lift"
                      >
                        Request Quotes ({selectedInstallerIds.length})
                        <ArrowRight size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDistributionSubView('marketplace_broadcast')}
                        className="w-full py-3 px-4 rounded-full border border-[#003006] text-[#003006] text-xs font-semibold hover:bg-[#f6ece6] transition-all flex items-center justify-center gap-2"
                      >
                        Broadcast to Marketplace
                      </button>

                      <div className="pt-2 text-center">
                        <button
                          type="button"
                          onClick={() => setStep(4)}
                          className="text-xs text-[#707a6c] hover:underline"
                        >
                          ← Back to system sizing
                        </button>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            )}

            {/* Sub-view B: Installer Selection Confirmation (Stitch 506785436100412cbdbfe44b9794b67b) */}
            {distributionSubView === 'confirm_selected' && (
              <div className="max-w-2xl mx-auto w-full bg-[#fff8f5] rounded-[24px] shadow-sm border border-[#c0c9bb]/40 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-[#e0e4db] text-center">
                  <div className="w-16 h-16 bg-[#003006] text-[#aef4a5] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <CheckCircle2 size={32} />
                  </div>
                  <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#003006] mb-2">
                    {selectedInstallersData.length === 1
                      ? `You've selected ${selectedInstallersData[0].name}`
                      : `You've selected ${selectedInstallersData.length} Certified Partners`}
                  </h1>
                  <p className="text-xs sm:text-sm text-[#40493d] max-w-md mx-auto">
                    Review your project specifications before finalizing your quote request.
                  </p>
                </div>

                <div className="p-6 md:p-8 bg-[#f6ece6] space-y-4">
                  <h3 className="text-xs font-bold text-[#707a6c] uppercase tracking-wider">
                    Assigned Partners &amp; Project Summary
                  </h3>

                  {/* Selected Installers Badges */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedInstallersData.map(inst => (
                      <div key={inst.id} className="bg-white px-3 py-1.5 rounded-xl border border-[#c0c9bb]/40 text-xs font-semibold text-[#003006] flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-[#00490E]" />
                        {inst.name} ({inst.rating}★)
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-[#fff8f5] p-4 rounded-xl border border-[#c0c9bb]/40 flex items-start gap-3">
                      <Zap size={18} className="text-[#00490E] mt-0.5" />
                      <div>
                        <div className="text-[11px] font-semibold text-[#707a6c]">System Size</div>
                        <div className="text-xs font-bold text-[#191d17]">{liveSizing.kwp}kWp PV / {liveSizing.inverterKva}kVA Inverter</div>
                      </div>
                    </div>

                    <div className="bg-[#fff8f5] p-4 rounded-xl border border-[#c0c9bb]/40 flex items-start gap-3">
                      <Battery size={18} className="text-[#00490E] mt-0.5" />
                      <div>
                        <div className="text-[11px] font-semibold text-[#707a6c]">Storage Capacity</div>
                        <div className="text-xs font-bold text-[#191d17]">{liveSizing.storageKwh} kWh LiFePO4</div>
                      </div>
                    </div>

                    <div className="bg-[#fff8f5] p-4 rounded-xl border border-[#c0c9bb]/40 flex items-start gap-3">
                      <MapPin size={18} className="text-[#00490E] mt-0.5" />
                      <div>
                        <div className="text-[11px] font-semibold text-[#707a6c]">Location</div>
                        <div className="text-xs font-bold text-[#191d17]">{location.split(' ')[0]}, Nigeria</div>
                      </div>
                    </div>

                    <div className="bg-[#fff8f5] p-4 rounded-xl border border-[#c0c9bb]/40 flex items-start gap-3">
                      <Clock size={18} className="text-[#00490E] mt-0.5" />
                      <div>
                        <div className="text-[11px] font-semibold text-[#707a6c]">Quote SLA</div>
                        <div className="text-xs font-bold text-[#191d17]">Within 24 Hours</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-3">
                  <button
                    type="button"
                    onClick={() => setStep(6)}
                    className="w-full bg-[#003006] text-white text-sm font-semibold py-4 px-6 rounded-full hover:bg-[#00490E] transition-all shadow-md flex items-center justify-center gap-2 hover-lift"
                  >
                    <Send size={16} />
                    Continue to Account Creation &amp; Request Quotes
                  </button>

                  <div className="flex items-center gap-3 py-1">
                    <div className="flex-1 border-t border-[#c0c9bb]/30" />
                    <span className="text-[11px] font-bold text-[#707a6c]">OR</span>
                    <div className="flex-1 border-t border-[#c0c9bb]/30" />
                  </div>

                  <button
                    type="button"
                    onClick={() => setDistributionSubView('marketplace_broadcast')}
                    className="w-full bg-[#f6ece6] text-[#003006] text-xs font-semibold py-3.5 px-6 rounded-full border border-[#c0c9bb]/40 hover:bg-white transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles size={14} />
                    Broadcast to Marketplace for more quotes
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setDistributionSubView('directory')}
                      className="text-xs text-[#707a6c] hover:underline"
                    >
                      ← Back to installer list
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-view C: Marketplace Broadcast (Stitch 02d7e573956241b18d8994c92913ca35 / f57348c176864c0fa7d902bfc7855f4a) */}
            {distributionSubView === 'marketplace_broadcast' && (
              <div className="max-w-4xl mx-auto w-full space-y-6">
                <header className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ceee93] text-[#374e03] text-xs font-semibold uppercase tracking-wider mb-3">
                    <Sparkles size={14} /> Step 5: Marketplace Broadcast
                  </div>
                  <h1 className="font-display text-3xl md:text-4xl font-extrabold text-[#003006] mb-2">
                    Request proposals from qualified installers
                  </h1>
                  <p className="text-xs sm:text-sm text-[#40493d]">
                    Your project will be broadcast to all certified installers serving {location.split(' ')[0]}. Qualified professionals will review your telemetry and submit competitive bids.
                  </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-8 space-y-6">
                    {/* Project Overview */}
                    <div className="bg-[#fff8f5] rounded-[20px] p-6 border border-[#c0c9bb]/40 shadow-sm space-y-4">
                      <h3 className="font-display text-base font-bold text-[#003006] flex items-center gap-2">
                        <Building2 size={18} className="text-[#00490E]" />
                        Project Scope &amp; Overview
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-[#f6ece6] border border-[#c0c9bb]/30">
                          <div className="text-[10px] font-bold text-[#707a6c] uppercase">Client Profile</div>
                          <div className="text-sm font-semibold text-[#191d17] capitalize mt-0.5">{customerType} Power</div>
                        </div>
                        <div className="p-4 rounded-xl bg-[#f6ece6] border border-[#c0c9bb]/30">
                          <div className="text-[10px] font-bold text-[#707a6c] uppercase">Project Region</div>
                          <div className="text-sm font-semibold text-[#191d17] mt-0.5">{location.split(' ')[0]}</div>
                        </div>
                      </div>
                    </div>

                    {/* Technical Profile Card */}
                    <div className="bg-[#fff8f5] rounded-[20px] p-6 border border-[#c0c9bb]/40 shadow-sm space-y-4">
                      <h3 className="font-display text-base font-bold text-[#003006] flex items-center gap-2">
                        <Zap size={18} className="text-[#00490E]" />
                        Technical Sizing Profile
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-[#f6ece6] text-center border border-[#c0c9bb]/30">
                          <div className="text-[10px] font-bold text-[#707a6c] uppercase">Daily Energy</div>
                          <div className="font-display text-xl font-bold text-[#00490E] mt-1">{dailyKwh} kWh</div>
                        </div>
                        <div className="p-4 rounded-xl bg-[#f6ece6] text-center border border-[#c0c9bb]/30">
                          <div className="text-[10px] font-bold text-[#707a6c] uppercase">Solar PV</div>
                          <div className="font-display text-xl font-bold text-[#00490E] mt-1">{liveSizing.kwp} kWp</div>
                        </div>
                        <div className="p-4 rounded-xl bg-[#f6ece6] text-center border border-[#c0c9bb]/30">
                          <div className="text-[10px] font-bold text-[#707a6c] uppercase">Storage</div>
                          <div className="font-display text-xl font-bold text-[#00490E] mt-1">{liveSizing.storageKwh} kWh</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Confirmation Box */}
                  <div className="lg:col-span-4 bg-[#fff8f5] rounded-[20px] p-6 border border-[#c0c9bb]/40 shadow-sm space-y-4">
                    <h3 className="font-display text-base font-bold text-[#003006]">
                      Marketplace Guarantees
                    </h3>
                    <ul className="space-y-2.5 text-xs text-[#40493d]">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-[#00490E] shrink-0 mt-0.5" />
                        <span>3-5 competitive quotes within 24-48 hours</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-[#00490E] shrink-0 mt-0.5" />
                        <span>100% verified EPCs with COREN/NEMSA credentials</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-[#00490E] shrink-0 mt-0.5" />
                        <span>Sunlit milestone escrow payment protection</span>
                      </li>
                    </ul>

                    <div className="pt-4 border-t border-[#e0e4db] space-y-2">
                      <button
                        type="button"
                        onClick={() => setStep(6)}
                        className="w-full py-3.5 px-4 rounded-full bg-[#003006] text-white text-xs font-semibold hover:bg-[#00490E] transition-all shadow-md flex items-center justify-center gap-2 hover-lift"
                      >
                        Continue to Create Account
                        <ArrowRight size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDistributionSubView('directory')}
                        className="w-full py-2.5 text-xs text-[#707a6c] hover:underline text-center"
                      >
                        Back to installer directory
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Installer Profile Modal / Drawer (Stitch 48d2e22388364a95923982e25fab3518) */}
            {viewingProfile && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#fff8f5] rounded-[24px] max-w-xl w-full border border-[#c0c9bb]/40 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-fade-in-up">
                  <div className="relative h-48 w-full bg-[#f6ece6]">
                    <img src={viewingProfile.imageUrl} alt={viewingProfile.name} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setViewingProfile(null)}
                      className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 text-[#191d17] flex items-center justify-center hover:bg-white shadow-md"
                    >
                      <X size={18} />
                    </button>
                    <div className="absolute bottom-3 left-4">
                      <span className="bg-[#003006] text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        {viewingProfile.badge}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 overflow-y-auto space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="font-display text-xl font-bold text-[#003006]">
                          {viewingProfile.name}
                        </h2>
                        <p className="text-xs text-[#40493d] flex items-center gap-1 mt-0.5">
                          <MapPin size={13} className="text-[#00490E]" />
                          {viewingProfile.coverage}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-[#ECEFE6] px-2.5 py-1 rounded-lg text-xs font-bold text-[#003006]">
                        <Star size={14} className="fill-[#003006]" />
                        <span>{viewingProfile.rating}</span>
                        <span className="text-[#707a6c] font-normal">({viewingProfile.reviewsCount})</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#40493d] leading-relaxed">
                      {viewingProfile.description}
                    </p>

                    <div>
                      <h4 className="text-xs font-bold text-[#707a6c] uppercase mb-2">Accreditations &amp; Badges</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {viewingProfile.certifications.map((c) => (
                          <span key={c} className="bg-[#f6ece6] text-[#003006] px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-[#c0c9bb]/30">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 bg-[#f6ece6] rounded-xl text-xs">
                        <div className="text-[#707a6c] font-medium">Completed Projects</div>
                        <div className="font-bold text-[#191d17] text-sm mt-0.5">{viewingProfile.completedJobs}+ Installations</div>
                      </div>
                      <div className="p-3 bg-[#f6ece6] rounded-xl text-xs">
                        <div className="text-[#707a6c] font-medium">Response SLA</div>
                        <div className="font-bold text-[#191d17] text-sm mt-0.5">{viewingProfile.responseTime}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 border-t border-[#e0e4db] bg-[#f6ece6] flex gap-3">
                    <button
                      type="button"
                      onClick={() => setViewingProfile(null)}
                      className="flex-1 py-3 rounded-full border border-[#c0c9bb] text-xs font-semibold text-[#40493d]"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!selectedInstallerIds.includes(viewingProfile.id)) {
                          setSelectedInstallerIds([...selectedInstallerIds, viewingProfile.id]);
                        }
                        setViewingProfile(null);
                      }}
                      className="flex-1 py-3 rounded-full bg-[#003006] text-white text-xs font-semibold hover:bg-[#00490E]"
                    >
                      Select This Partner
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* =========================================================================
            STEP 6: REGISTRATION GATE & ACCOUNT CREATION (Stitch 7e85a9fced5f4af69bb082cc85ccaea4)
            (Reordered: Appears AFTER Installer Matchmaking)
           ========================================================================= */}
        {step === 6 && (
          <div className="max-w-4xl mx-auto w-full bg-[#fff8f5] rounded-[24px] border border-[#c0c9bb]/40 shadow-xl overflow-hidden flex flex-col md:flex-row">
            {/* Left Column: Atmospheric Context */}
            <div className="hidden md:flex md:w-5/12 relative bg-[#f6ece6] p-8 flex-col justify-between overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-85"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAPJXzSpiKfVI5yPO65RZGLhMkwrLICvzvjF90EkxBvTPhCNYNLO3SXUowNmjgCuYfv4Hzy3yKtK2raic-v4loJoKUoJJJnL0uK9oIZkXHuRneg-XvubVGTjjauoL7Lbn6yveAmiUhAZgRKybg16l7Nswb4ZPb33tKP3Whayjt-B0bkLCfQqonAaD_TOEErMfzDB4QFNaVYmcCtzXGefKXACEUWx4VjreVj9eQQbSxZHkTYPi7kxE5gXQ')`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#003006] via-[#003006]/70 to-transparent" />

              <div className="relative z-10 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-white text-[#003006] flex items-center justify-center font-bold">
                    <Sun size={18} />
                  </div>
                  <span className="font-display font-bold text-lg">Sunlit Energy</span>
                </div>
                <h3 className="font-display text-2xl font-extrabold leading-tight">
                  Powering the future, together.
                </h3>
              </div>

              <div className="relative z-10 text-white space-y-2 mt-auto pt-8">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/20 text-xs">
                  <div className="font-bold text-[#CEEE93]">Assessment &amp; Request Ready:</div>
                  <div>{liveSizing.kwp}kWp Solar • {liveSizing.storageKwh}kWh Storage</div>
                  <div className="text-white/80 mt-1">
                    {distributionSubView === 'confirm_selected'
                      ? `Assigned: ${selectedInstallerIds.length} Certified Partner(s)`
                      : 'Marketplace Open RFQ Broadcast'}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Account Creation Form */}
            <div className="w-full md:w-7/12 p-6 sm:p-10 flex flex-col justify-center">
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECEFE6] text-[#00490E] text-xs font-semibold uppercase tracking-wider mb-2 border border-[#BFCABA]/40">
                  Step 6 of 7: Account Creation
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#003006] mb-1">
                  Create your Sunlit account
                </h2>
                <p className="text-xs text-[#40493d]">
                  Save your assessment, track bids from your matched installers, and access escrow milestone security.
                </p>
              </div>

              {authError && (
                <div className="p-3.5 mb-5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleAccountCreation} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#40493d] uppercase tracking-wider mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jane"
                      className="w-full px-4 py-3 rounded-xl border border-[#c0c9bb] bg-[#f6ece6] text-sm focus:border-[#00490E] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#40493d] uppercase tracking-wider mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="w-full px-4 py-3 rounded-xl border border-[#c0c9bb] bg-[#f6ece6] text-sm focus:border-[#00490E] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#40493d] uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane.doe@company.com"
                    className="w-full px-4 py-3 rounded-xl border border-[#c0c9bb] bg-[#f6ece6] text-sm focus:border-[#00490E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#40493d] uppercase tracking-wider mb-1">
                    Phone (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="w-full px-4 py-3 rounded-xl border border-[#c0c9bb] bg-[#f6ece6] text-sm focus:border-[#00490E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#40493d] uppercase tracking-wider mb-1">
                    Create Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl border border-[#c0c9bb] bg-[#f6ece6] text-sm focus:border-[#00490E] focus:outline-none pr-11"
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

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    className="py-3.5 px-5 rounded-full border border-[#c0c9bb] text-xs font-semibold text-[#40493d] hover:bg-[#f6ece6] transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-[#003006] text-white text-sm font-semibold py-3.5 px-6 rounded-full hover:bg-[#0f631b] transition-all shadow-md flex justify-center items-center gap-2 disabled:opacity-50 hover-lift"
                  >
                    {isLoading ? 'Creating Workspace...' : 'Create Account & Dispatch RFQ'}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 7: SUCCESS & FINAL HAND-OFF (Stitch ffb67aa494b843028fb48f31a27cc7e5)
           ========================================================================= */}
        {step === 7 && (
          <div className="max-w-2xl mx-auto w-full bg-[#fff8f5] p-8 sm:p-12 rounded-[28px] border border-[#c0c9bb]/40 shadow-2xl text-center animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-[#003006] text-[#aef4a5] flex items-center justify-center mx-auto mb-6 shadow-md">
              <FileCheck size={32} />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ceee93] text-[#374e03] text-xs font-semibold uppercase tracking-wider mb-3">
              Assessment Successfully Saved
            </span>

            <h1 className="font-display text-3xl font-extrabold text-[#003006] mb-3">
              Your Project Is Live on Sunlit
            </h1>

            <p className="text-sm text-[#40493d] max-w-md mx-auto mb-8 leading-relaxed">
              Your {liveSizing.kwp}kWp energy profile for {location.split(' ')[0]} has been submitted. Certified EPC contractors are reviewing your telemetry.
            </p>

            <div className="bg-[#f6ece6] rounded-2xl p-5 border border-[#c0c9bb]/30 max-w-md mx-auto mb-8 text-left space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#707a6c]">Reference ID:</span>
                <span className="font-mono font-bold text-[#003006]">SL-RFQ-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#707a6c]">System Capacity:</span>
                <span className="font-bold text-[#191d17]">{liveSizing.inverterKva} kVA Inverter / {liveSizing.storageKwh} kWh LiFePO4</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#707a6c]">Estimated Investment:</span>
                <span className="font-bold text-[#003006]">₦{costMin.toLocaleString()} – ₦{costMax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#707a6c]">Matching Distribution:</span>
                <span className="font-bold text-[#191d17]">
                  {distributionSubView === 'confirm_selected'
                    ? `Direct Request: ${selectedInstallerIds.length} Installers`
                    : 'Open Marketplace Broadcast'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard/project-owner"
                className="bg-[#003006] text-white text-sm font-semibold py-3.5 px-8 rounded-full hover:bg-[#0f631b] transition-all shadow-md flex items-center justify-center gap-2 hover-lift"
              >
                Go to Customer Workspace
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/installers"
                className="bg-transparent text-[#003006] text-sm font-semibold py-3.5 px-6 rounded-full border border-[#003006]/30 hover:bg-[#003006]/5 transition-all flex items-center justify-center"
              >
                Browse Full Directory
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
    <Suspense fallback={<div className="min-h-screen bg-[#f7fbf1] flex items-center justify-center text-xs text-[#707a6c]">Loading Sunlit Onboarding...</div>}>
      <GetStartedFlowInner />
    </Suspense>
  );
}
