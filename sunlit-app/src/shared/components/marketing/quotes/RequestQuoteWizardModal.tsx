'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  X,
  Zap,
  CheckCircle2,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Sun,
  Battery,
  ShieldCheck,
  Building,
  Home,
  Factory,
  Sparkles,
  HelpCircle,
  Clock,
  UserCheck,
  AlertTriangle,
  Store,
  GraduationCap,
  Hospital,
  Wrench,
  Sliders,
  DollarSign,
  TrendingUp,
  Cpu,
  Layers,
} from 'lucide-react';
import { executeSolarEngineeringPipeline } from '@/lib/engineering/core/calculationPipeline';
import { buildStructuredSolarAssessmentPayload } from '@/lib/engineering/marketplaceAdapter';
import { LoadItem } from '@/lib/engineering/calculators/loadCalculator';
import { LoadElectricalType } from '@/lib/engineering/types';

export interface InstallerSummary {
  id?: string;
  slug: string;
  business_name: string;
  headquarters_city?: string;
  headquarters_state?: string;
  sunlit_score?: number;
  rating?: number;
  review_count?: number;
  verified_projects_count?: number;
  tier?: string;
}

export interface CustomAppliance {
  id: string;
  name: string;
  ratedWatts: number;
  startingWatts: number;
  quantity: number;
  hours: number;
  dutyCycle: number;
  loadType: LoadElectricalType;
}

interface RequestQuoteWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  installer: InstallerSummary;
  source: 'DIRECTORY' | 'DIRECT_PROFILE';
  onViewMoreInstallers?: () => void;
}

type WizardStep = 'scope' | 'questionnaire' | 'recommendation' | 'contact' | 'continuation_decision' | 'confirmation' | 'success';

interface StandardApplianceMeta {
  key: string;
  name: string;
  category: 'Cooling' | 'Lighting' | 'HVAC' | 'Utilities' | 'Entertainment' | 'Computing' | 'Kitchen' | 'General';
  loadType: LoadElectricalType;
  ratedWatts: number;
  startingWatts: number;
  typicalHours: number;
  dutyCycle: number;
  defaultQty: number;
  description: string;
}

const STANDARD_APPLIANCES: StandardApplianceMeta[] = [
  {
    key: 'refrigerator',
    name: 'Refrigerator / Freezer',
    category: 'Kitchen',
    loadType: 'INDUCTIVE_MOTOR',
    ratedWatts: 250,
    startingWatts: 650,
    typicalHours: 24,
    dutyCycle: 0.45,
    defaultQty: 1,
    description: 'Compressor cycles automatically (45% duty cycle)',
  },
  {
    key: 'tv',
    name: 'Television & Sound System',
    category: 'Entertainment',
    loadType: 'ELECTRONIC',
    ratedWatts: 120,
    startingWatts: 150,
    typicalHours: 6,
    dutyCycle: 1.0,
    defaultQty: 1,
    description: 'Smart TV, decoder, soundbar',
  },
  {
    key: 'ac',
    name: 'Air Conditioner (1.5 HP Inverter)',
    category: 'Cooling',
    loadType: 'INDUCTIVE_MOTOR',
    ratedWatts: 1100,
    startingWatts: 2400,
    typicalHours: 8,
    dutyCycle: 0.60,
    defaultQty: 1,
    description: 'Modulates power once room reaches setpoint',
  },
  {
    key: 'fan',
    name: 'Ceiling / Standing Fan',
    category: 'Cooling',
    loadType: 'INDUCTIVE_MOTOR',
    ratedWatts: 75,
    startingWatts: 110,
    typicalHours: 10,
    dutyCycle: 1.0,
    defaultQty: 3,
    description: 'Continuous airflow',
  },
  {
    key: 'lighting',
    name: 'LED Lighting Package',
    category: 'Lighting',
    loadType: 'ELECTRONIC',
    ratedWatts: 100,
    startingWatts: 100,
    typicalHours: 8,
    dutyCycle: 1.0,
    defaultQty: 1,
    description: '10–15 energy-efficient LED bulbs',
  },
  {
    key: 'pump',
    name: 'Water Pumping Machine (1 HP)',
    category: 'Utilities',
    loadType: 'INDUCTIVE_MOTOR',
    ratedWatts: 900,
    startingWatts: 2800,
    typicalHours: 1.5,
    dutyCycle: 1.0,
    defaultQty: 1,
    description: 'Overhead tank filling, high starting torque',
  },
  {
    key: 'washing_machine',
    name: 'Washing Machine',
    category: 'Utilities',
    loadType: 'INDUCTIVE_MOTOR',
    ratedWatts: 500,
    startingWatts: 1200,
    typicalHours: 1.5,
    dutyCycle: 0.60,
    defaultQty: 1,
    description: 'Wash/spin cycle motor variation',
  },
  {
    key: 'iron',
    name: 'Electric Pressing Iron',
    category: 'Utilities',
    loadType: 'HEATING',
    ratedWatts: 1500,
    startingWatts: 1500,
    typicalHours: 1.0,
    dutyCycle: 0.50,
    defaultQty: 1,
    description: 'Thermostat cycles heating element',
  },
  {
    key: 'microwave',
    name: 'Microwave Oven',
    category: 'Kitchen',
    loadType: 'HEATING',
    ratedWatts: 1200,
    startingWatts: 1600,
    typicalHours: 0.5,
    dutyCycle: 0.80,
    defaultQty: 1,
    description: 'Short bursts for food prep',
  },
  {
    key: 'computer',
    name: 'Computer & Workstation',
    category: 'Computing',
    loadType: 'ELECTRONIC',
    ratedWatts: 150,
    startingWatts: 180,
    typicalHours: 8,
    dutyCycle: 0.80,
    defaultQty: 1,
    description: 'Laptop/Desktop, monitor, router',
  },
];

export function RequestQuoteWizardModal({
  isOpen,
  onClose,
  installer,
  source,
  onViewMoreInstallers,
}: RequestQuoteWizardModalProps) {
  // Wizard Navigation
  const [currentStep, setCurrentStep] = useState<WizardStep>('scope');

  // Step 1: Facility Type & Location
  const [facilityType, setFacilityType] = useState<'Home' | 'Apartment' | 'Office' | 'Shop' | 'School' | 'Hospital' | 'Factory' | 'Custom'>('Home');
  const [state, setState] = useState(installer.headquarters_state || 'Lagos');
  const [city, setCity] = useState(installer.headquarters_city || 'Lekki');

  // Step 2: Estimation Mode
  const [estimationMode, setEstimationMode] = useState<'electricity_usage' | 'appliances' | 'both'>('appliances');
  const [monthlyBillNaira, setMonthlyBillNaira] = useState<number>(45000);
  const [dailyKwhInput, setDailyKwhInput] = useState<number>(20);

  // Step 3: Granular Appliances Selection
  const [applianceState, setApplianceState] = useState<
    Record<string, { enabled: boolean; quantity: number; hours: number; ratedWatts: number; startingWatts: number; dutyCycle: number }>
  >(() => {
    const init: Record<string, any> = {};
    STANDARD_APPLIANCES.forEach((app) => {
      init[app.key] = {
        enabled: app.key === 'refrigerator' || app.key === 'tv' || app.key === 'fan' || app.key === 'lighting',
        quantity: app.defaultQty,
        hours: app.typicalHours,
        ratedWatts: app.ratedWatts,
        startingWatts: app.startingWatts,
        dutyCycle: app.dutyCycle,
      };
    });
    return init;
  });

  const [customAppliances, setCustomAppliances] = useState<CustomAppliance[]>([]);
  const [newCustomName, setNewCustomName] = useState('');
  const [newCustomWatts, setNewCustomWatts] = useState(500);
  const [newCustomStartingWatts, setNewCustomStartingWatts] = useState(1200);
  const [newCustomHours, setNewCustomHours] = useState(3);
  const [newCustomDutyCycle, setNewCustomDutyCycle] = useState(0.7);
  const [showAddCustomForm, setShowAddCustomForm] = useState(false);

  // Step 4: Customer Value Priority ("What matters most?")
  const [customerPriority, setCustomerPriority] = useState<'BALANCED' | 'LOWER_CAPEX' | 'MAXIMUM_RESILIENCE' | 'REDUCE_GEN' | 'FUTURE_EXPANSION'>('BALANCED');

  // Step 5: Selected Recommendation Tier
  const [selectedOptionTier, setSelectedOptionTier] = useState<'BASELINE' | 'RECOMMENDED' | 'UPGRADE'>('RECOMMENDED');

  // Step 6: Contact & Registration
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [projectBrief, setProjectBrief] = useState('');
  const [createAccount, setCreateAccount] = useState(true);

  // Submission & Idempotency
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idempotencyKey] = useState<string>(() => `quote_req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
  const [rfqId, setRfqId] = useState<string | null>(null);

  // Auto-sync customer priority to initial recommendation tier
  useEffect(() => {
    if (customerPriority === 'LOWER_CAPEX') {
      setSelectedOptionTier('BASELINE');
    } else if (customerPriority === 'MAXIMUM_RESILIENCE' || customerPriority === 'FUTURE_EXPANSION') {
      setSelectedOptionTier('UPGRADE');
    } else {
      setSelectedOptionTier('RECOMMENDED');
    }
  }, [customerPriority]);

  // Compile Load Items with Full Electrical Dynamics
  const loadItems: LoadItem[] = useMemo(() => {
    const items: LoadItem[] = [];

    // Add standard appliances
    STANDARD_APPLIANCES.forEach((meta) => {
      const stateItem = applianceState[meta.key];
      if (stateItem && stateItem.enabled && stateItem.quantity > 0) {
        items.push({
          name: meta.name,
          category: meta.category,
          quantity: stateItem.quantity,
          powerWatts: stateItem.ratedWatts,
          hoursPerDay: stateItem.hours,
          dutyCycle: stateItem.dutyCycle,
          surgeMultiplier: Number((stateItem.startingWatts / stateItem.ratedWatts).toFixed(2)),
          priority: meta.key === 'refrigerator' || meta.key === 'lighting' ? 'CRITICAL' : 'IMPORTANT',
        });
      }
    });

    // Add custom appliances
    customAppliances.forEach((c) => {
      if (c.quantity > 0 && c.ratedWatts > 0) {
        items.push({
          name: c.name,
          category: 'General',
          quantity: c.quantity,
          powerWatts: c.ratedWatts,
          hoursPerDay: c.hours,
          dutyCycle: c.dutyCycle,
          surgeMultiplier: Number((c.startingWatts / c.ratedWatts).toFixed(2)),
          priority: 'IMPORTANT',
        });
      }
    });

    return items;
  }, [applianceState, customAppliances]);

  // Compute calculated daily kWh from bill if in electricity usage mode
  const derivedDailyKwh = useMemo(() => {
    if (estimationMode === 'electricity_usage') {
      // Estimated at ₦225/kWh Band A tariff in Nigeria
      const kwhFromBill = monthlyBillNaira > 0 ? Number((monthlyBillNaira / 225 / 30).toFixed(1)) : dailyKwhInput;
      return Math.max(kwhFromBill, 5);
    }
    return undefined;
  }, [estimationMode, monthlyBillNaira, dailyKwhInput]);

  // Execute Authoritative Unified Solar Pipeline
  const pipelineResult = useMemo(() => {
    const mappedPriority =
      customerPriority === 'LOWER_CAPEX' ? 'LOWER_CAPEX' :
      customerPriority === 'MAXIMUM_RESILIENCE' || customerPriority === 'FUTURE_EXPANSION' ? 'MAXIMUM_RESILIENCE' :
      'BALANCED';

    const projectType =
      facilityType === 'Factory' ? 'industrial' :
      facilityType === 'Office' || facilityType === 'Shop' || facilityType === 'School' || facilityType === 'Hospital' ? 'commercial' :
      'residential';

    return executeSolarEngineeringPipeline({
      inputMethod: estimationMode === 'electricity_usage' ? 'KWH_DIRECT' : estimationMode === 'both' ? 'COMBINED' : 'APPLIANCE_LIST',
      dailyKwhDemand: derivedDailyKwh,
      appliances: estimationMode !== 'electricity_usage' ? loadItems : undefined,
      location: state,
      targetAutonomyHours: customerPriority === 'MAXIMUM_RESILIENCE' ? 36 : 24,
      projectType,
    });
  }, [estimationMode, derivedDailyKwh, loadItems, state, customerPriority, facilityType]);

  // Active option based on user selection
  const activeOption = useMemo(() => {
    if (selectedOptionTier === 'BASELINE') return pipelineResult.recommendations.baseline;
    if (selectedOptionTier === 'UPGRADE') return pipelineResult.recommendations.upgrade;
    return pipelineResult.recommendations.recommended;
  }, [selectedOptionTier, pipelineResult]);

  const handleAddCustomAppliance = () => {
    if (!newCustomName.trim() || newCustomWatts <= 0) return;
    setCustomAppliances((prev) => [
      ...prev,
      {
        id: `custom_${Date.now()}`,
        name: newCustomName.trim(),
        ratedWatts: newCustomWatts,
        startingWatts: newCustomStartingWatts,
        quantity: 1,
        hours: newCustomHours,
        dutyCycle: newCustomDutyCycle,
        loadType: newCustomStartingWatts > newCustomWatts * 1.8 ? 'INDUCTIVE_MOTOR' : 'RESISTIVE',
      },
    ]);
    setNewCustomName('');
    setNewCustomWatts(500);
    setNewCustomStartingWatts(1200);
    setNewCustomHours(3);
    setShowAddCustomForm(false);
  };

  const handleConfirmAndSubmit = async () => {
    setIsSubmitting(true);
    try {
      const assessmentPayload = buildStructuredSolarAssessmentPayload(pipelineResult, {
        selectedOptionTier,
        targetInstallerId: installer.id,
        installerSlug: installer.slug,
        notes: projectBrief,
        facilityType,
        customerPriority,
      });

      const response = await fetch('/api/v1/rfq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          password: createAccount ? password : undefined,
          targetInstallerId: installer.id,
          installerSlug: installer.slug,
          state,
          city,
          projectCategory: facilityType === 'Factory' ? 'industrial' : facilityType === 'Home' || facilityType === 'Apartment' ? 'residential' : 'commercial',
          notes: projectBrief,
          solar_assessment: assessmentPayload,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit quote request');
      }

      setRfqId(data.data?.rfq_id || `RFQ-${Date.now().toString().slice(-6)}`);
      setCurrentStep('success');
    } catch (err: any) {
      alert(err.message || 'An error occurred while submitting your request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#faf8f3] rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-[#c0c9bb]/60 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#c0c9bb]/40 bg-[#f6ece6] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#003006] text-[#ceee93] flex items-center justify-center font-bold text-base shadow-sm">
              <Sun size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-[Manrope] text-base font-bold text-[#003006]">
                  Request Engineering Quote
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ceee93] text-[#003006] font-bold">
                  Adaptive Solar Wizard
                </span>
              </div>
              <p className="text-xs text-[#707a6c]">
                Routing directly to: <strong>{installer.business_name}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 border border-[#c0c9bb]/60 text-[#40493d] flex items-center justify-center hover:bg-white hover:text-black transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body / Steps */}
        <div className="p-6 overflow-y-auto flex-grow space-y-6">
          {/* STEP 1: WHAT ARE YOU POWERING? */}
          {currentStep === 'scope' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-[Manrope] text-base font-bold text-[#1a1c1b] mb-1">
                  1. What are you powering?
                </h3>
                <p className="text-xs text-[#40493d]">
                  Select the facility type so {installer.business_name} can calibrate equipment sizing and load profiles.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'Home', label: 'Home / Duplex', icon: Home },
                  { id: 'Apartment', label: 'Apartment / Flat', icon: Building },
                  { id: 'Office', label: 'Office / Corporate', icon: Building },
                  { id: 'Shop', label: 'Shop / Retail Store', icon: Store },
                  { id: 'School', label: 'School / Campus', icon: GraduationCap },
                  { id: 'Hospital', label: 'Clinic / Hospital', icon: Hospital },
                  { id: 'Factory', label: 'Factory / Industrial', icon: Factory },
                  { id: 'Custom', label: 'Custom Facility', icon: Wrench },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFacilityType(item.id as any)}
                    className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                      facilityType === item.id
                        ? 'bg-[#003006] text-[#ceee93] border-[#003006] shadow-sm font-semibold'
                        : 'bg-white border-[#c0c9bb]/60 text-[#40493d] hover:border-[#003006]/40'
                    }`}
                  >
                    <item.icon size={18} />
                    <span className="text-xs">{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#1a1c1b] mb-1.5">
                    Installation State
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#c0c9bb]/60 text-xs text-[#1a1c1b] focus:outline-none focus:border-[#003006]"
                  >
                    <option value="Lagos">Lagos State</option>
                    <option value="Abuja">Abuja FCT</option>
                    <option value="Ogun">Ogun State</option>
                    <option value="Rivers">Rivers State (Port Harcourt)</option>
                    <option value="Oyo">Oyo State (Ibadan)</option>
                    <option value="Edo">Edo State (Benin)</option>
                    <option value="Enugu">Enugu State</option>
                    <option value="Kano">Kano State</option>
                    <option value="Other">Other State</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1a1c1b] mb-1.5">
                    City / Neighborhood
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Lekki Phase 1, Maitama, Ikeja"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#c0c9bb]/60 text-xs text-[#1a1c1b] focus:outline-none focus:border-[#003006]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: QUESTIONNAIRE & ESTIMATION */}
          {currentStep === 'questionnaire' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-[Manrope] text-base font-bold text-[#1a1c1b] mb-1">
                  2. How do you want to estimate your energy needs?
                </h3>
                <p className="text-xs text-[#40493d]">
                  Choose your preferred estimation method. Appliance scheduling produces the highest engineering confidence.
                </p>
              </div>

              {/* Method Selector Tabs */}
              <div className="grid grid-cols-3 rounded-xl bg-[#ede4dc] p-1 gap-1">
                {[
                  { id: 'appliances', label: '○ Appliances', desc: 'Granular load list' },
                  { id: 'electricity_usage', label: '○ Electricity usage', desc: 'Monthly DISCO bill' },
                  { id: 'both', label: '○ Both', desc: 'Highest confidence' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setEstimationMode(m.id as any)}
                    className={`py-2 px-2 text-center rounded-lg transition-all ${
                      estimationMode === m.id
                        ? 'bg-white text-[#003006] shadow-sm font-bold'
                        : 'text-[#40493d] hover:text-[#003006]'
                    }`}
                  >
                    <div className="text-xs">{m.label}</div>
                    <div className="text-[10px] text-[#707a6c] hidden sm:block">{m.desc}</div>
                  </button>
                ))}
              </div>

              {/* ELECTRICITY USAGE INPUT (IF ACTIVE) */}
              {(estimationMode === 'electricity_usage' || estimationMode === 'both') && (
                <div className="p-4 bg-white rounded-xl border border-[#c0c9bb]/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#1a1c1b]">
                      Average Monthly Electricity Bill (₦)
                    </label>
                    <span className="text-xs font-mono font-bold text-[#00490e]">
                      ~{derivedDailyKwh?.toFixed(1)} kWh/day
                    </span>
                  </div>
                  <input
                    type="number"
                    min="5000"
                    step="5000"
                    value={monthlyBillNaira}
                    onChange={(e) => setMonthlyBillNaira(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-bold text-[#003006] bg-[#faf8f3] border border-[#c0c9bb] rounded-lg"
                    placeholder="e.g. 50000"
                  />
                </div>
              )}

              {/* APPLIANCES PICKER (IF ACTIVE) */}
              {(estimationMode === 'appliances' || estimationMode === 'both') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#1a1c1b]">Select Appliances & Operating Hours</div>
                      <div className="text-[11px] text-[#707a6c]">Specify actual daily usage hours to prevent over-sizing.</div>
                    </div>
                    <span className="text-[11px] font-bold text-[#00490e]">
                      {loadItems.length} active load{loadItems.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Standard Appliance List */}
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {STANDARD_APPLIANCES.map((meta) => {
                      const item = applianceState[meta.key] || {
                        enabled: false,
                        quantity: meta.defaultQty,
                        hours: meta.typicalHours,
                        ratedWatts: meta.ratedWatts,
                        startingWatts: meta.startingWatts,
                        dutyCycle: meta.dutyCycle,
                      };

                      return (
                        <div
                          key={meta.key}
                          className={`p-2.5 rounded-xl border transition-all ${
                            item.enabled
                              ? 'bg-white border-[#003006]/30 shadow-xs'
                              : 'bg-[#faf8f3]/60 border-[#c0c9bb]/40 opacity-75'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <label className="flex items-center gap-2 cursor-pointer flex-grow">
                              <input
                                type="checkbox"
                                checked={item.enabled}
                                onChange={(e) =>
                                  setApplianceState((prev) => ({
                                    ...prev,
                                    [meta.key]: { ...item, enabled: e.target.checked },
                                  }))
                                }
                                className="rounded text-[#003006]"
                              />
                              <div>
                                <span className="text-xs font-semibold text-[#1a1c1b] block">
                                  {meta.name}
                                </span>
                                <span className="text-[10px] text-[#707a6c]">
                                  {meta.ratedWatts}W rated • {meta.startingWatts}W surge • {meta.description}
                                </span>
                              </div>
                            </label>

                            {item.enabled && (
                              <div className="flex items-center gap-2 shrink-0">
                                <div className="flex items-center gap-1 bg-[#faf8f3] px-2 py-1 rounded-lg border border-[#c0c9bb]/60">
                                  <span className="text-[10px] text-[#707a6c]">Qty:</span>
                                  <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={item.quantity}
                                    onChange={(e) =>
                                      setApplianceState((prev) => ({
                                        ...prev,
                                        [meta.key]: { ...item, quantity: Math.max(1, Number(e.target.value)) },
                                      }))
                                    }
                                    className="w-10 text-xs font-bold text-center bg-transparent focus:outline-none"
                                  />
                                </div>

                                <div className="flex items-center gap-1 bg-[#faf8f3] px-2 py-1 rounded-lg border border-[#c0c9bb]/60">
                                  <span className="text-[10px] text-[#707a6c]">Hours:</span>
                                  <input
                                    type="number"
                                    min="0.5"
                                    max="24"
                                    step="0.5"
                                    value={item.hours}
                                    onChange={(e) =>
                                      setApplianceState((prev) => ({
                                        ...prev,
                                        [meta.key]: { ...item, hours: Math.min(24, Math.max(0.5, Number(e.target.value))) },
                                      }))
                                    }
                                    className="w-12 text-xs font-bold text-center bg-transparent focus:outline-none"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Custom Appliances */}
                    {customAppliances.map((c) => (
                      <div
                        key={c.id}
                        className="p-2.5 rounded-xl border bg-[#f7fbf1] border-[#003006]/30 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-[#1a1c1b] flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-[#ceee93] text-[9px] font-bold text-[#003006]">Custom</span>
                            {c.name} ({c.ratedWatts}W continuous / {c.startingWatts}W start)
                          </div>
                          <div className="text-[10px] text-[#707a6c]">
                            Qty: {c.quantity} • {c.hours} hrs/day • Duty: {Math.round(c.dutyCycle * 100)}%
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCustomAppliances((prev) => prev.filter((item) => item.id !== c.id))}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Custom Appliance Trigger */}
                  {!showAddCustomForm ? (
                    <button
                      type="button"
                      onClick={() => setShowAddCustomForm(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00490e] hover:underline pt-1"
                    >
                      <Plus size={14} /> + Add appliance manually
                    </button>
                  ) : (
                    <div className="p-3.5 bg-white rounded-xl border border-[#003006]/30 space-y-3">
                      <div className="text-xs font-bold text-[#003006]">Add Custom Appliance</div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] text-[#707a6c] mb-0.5">Appliance Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Grain Mill, Server"
                            value={newCustomName}
                            onChange={(e) => setNewCustomName(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs bg-[#faf8f3] border border-[#c0c9bb] rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#707a6c] mb-0.5">Rated Power (Watts)</label>
                          <input
                            type="number"
                            value={newCustomWatts}
                            onChange={(e) => setNewCustomWatts(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 text-xs bg-[#faf8f3] border border-[#c0c9bb] rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#707a6c] mb-0.5">Daily Hours</label>
                          <input
                            type="number"
                            step="0.5"
                            value={newCustomHours}
                            onChange={(e) => setNewCustomHours(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 text-xs bg-[#faf8f3] border border-[#c0c9bb] rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleAddCustomAppliance}
                          className="px-3.5 py-1.5 bg-[#003006] text-white text-xs font-semibold rounded-lg hover:bg-[#0f631b]"
                        >
                          Save Appliance
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddCustomForm(false)}
                          className="px-3 py-1.5 text-xs text-[#707a6c] hover:text-[#1a1c1b]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4 OF QUESTIONNAIRE: CUSTOMER VALUE PREFERENCE */}
              <div className="pt-2 border-t border-[#c0c9bb]/40 space-y-2">
                <div>
                  <label className="block text-xs font-bold text-[#1a1c1b] mb-1">
                    What matters most to you?
                  </label>
                  <p className="text-[11px] text-[#707a6c]">
                    Your priority calibrates the recommended balance between upfront CAPEX and battery backup.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'LOWER_CAPEX', label: '○ Lower upfront cost', sub: 'Essential daytime coverage' },
                    { id: 'BALANCED', label: '○ Balanced system', sub: 'Optimal cost-to-backup' },
                    { id: 'MAXIMUM_RESILIENCE', label: '○ Maximum backup', sub: 'Extended night autonomy' },
                    { id: 'REDUCE_GEN', label: '○ Reduce generator usage', sub: 'Fuel displacement focus' },
                    { id: 'FUTURE_EXPANSION', label: '○ Future expansion', sub: 'Surplus solar capacity' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setCustomerPriority(p.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        customerPriority === p.id
                          ? 'bg-[#003006] text-white border-[#003006] shadow-xs font-bold'
                          : 'bg-white border-[#c0c9bb]/60 text-[#40493d] hover:border-[#003006]/40'
                      }`}
                    >
                      <div className="text-xs">{p.label}</div>
                      <div className={`text-[10px] mt-0.5 ${customerPriority === p.id ? 'text-[#ceee93]' : 'text-[#707a6c]'}`}>
                        {p.sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PRELIMINARY RECOMMENDATION & CONFIDENCE LAYER */}
          {currentStep === 'recommendation' && (
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ceee93] text-[#003006] text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  <Sparkles size={12} />
                  Solar Intelligence Recommendation
                </div>
                <h3 className="font-[Manrope] text-lg font-bold text-[#1a1c1b]">
                  Calculated Solar System Options
                </h3>
                <p className="text-xs text-[#40493d]">
                  Derived from your {pipelineResult.normalizedLoad.dailyEnergyKwh.toFixed(1)} kWh/day requirement in {state}.
                </p>
              </div>

              {/* Option Selector Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-[#ede4dc]/60 rounded-xl border border-[#c0c9bb]/40">
                {(['BASELINE', 'RECOMMENDED', 'UPGRADE'] as const).map((tier) => {
                  const opt =
                    tier === 'BASELINE'
                      ? pipelineResult.recommendations.baseline
                      : tier === 'UPGRADE'
                      ? pipelineResult.recommendations.upgrade
                      : pipelineResult.recommendations.recommended;
                  const isSelected = selectedOptionTier === tier;
                  return (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setSelectedOptionTier(tier)}
                      className={`p-2 sm:p-2.5 rounded-lg text-left transition-all ${
                        isSelected
                          ? 'bg-[#003006] text-white shadow-sm'
                          : 'bg-transparent text-[#40493d] hover:bg-white/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {tier === 'BASELINE' ? 'Option A' : tier === 'RECOMMENDED' ? 'Option B' : 'Option C'}
                        </span>
                        {tier === 'RECOMMENDED' && (
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${isSelected ? 'bg-[#ceee93] text-[#003006]' : 'bg-[#003006]/10 text-[#003006]'}`}>
                            Optimal
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-xs mt-0.5 truncate">
                        {tier === 'BASELINE' ? 'Essential' : tier === 'RECOMMENDED' ? 'Recommended' : 'Expansion'}
                      </div>
                      <div className="text-[10px] opacity-80 mt-0.5 font-mono truncate">
                        {opt.formattedPriceRange || `₦${(opt.estimatedCAPEXNaira * 0.9 / 1000000).toFixed(1)}M–₦${(opt.estimatedCAPEXNaira * 1.15 / 1000000).toFixed(1)}M`}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active System Specs Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-white rounded-xl border border-[#c0c9bb]/50 text-center">
                  <Sun size={18} className="text-[#00490e] mx-auto mb-1" />
                  <div className="font-[Manrope] font-extrabold text-sm text-[#003006]">
                    {activeOption.solarCapacityKwp} kWp
                  </div>
                  <div className="text-[10px] text-[#707a6c]">
                    {activeOption.panelCount}× 550W Tier-1 PV
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#c0c9bb]/50 text-center">
                  <Zap size={18} className="text-[#00490e] mx-auto mb-1" />
                  <div className="font-[Manrope] font-extrabold text-sm text-[#003006]">
                    {activeOption.inverterRatingKva} kVA
                  </div>
                  <div className="text-[10px] text-[#707a6c]">Hybrid Pure Sine</div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#c0c9bb]/50 text-center">
                  <Battery size={18} className="text-[#00490e] mx-auto mb-1" />
                  <div className="font-[Manrope] font-extrabold text-sm text-[#003006]">
                    {activeOption.batteryNominalKwh} kWh
                  </div>
                  <div className="text-[10px] text-[#707a6c]">LiFePO4 Storage</div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#c0c9bb]/50 text-center">
                  <Clock size={18} className="text-[#00490e] mx-auto mb-1" />
                  <div className="font-[Manrope] font-extrabold text-sm text-[#003006]">
                    {activeOption.autonomyHours.toFixed(1)} Hours
                  </div>
                  <div className="text-[10px] text-[#707a6c]">Estimated Backup</div>
                </div>
              </div>

              {/* SOLAR ENGINEERING CONFIDENCE ASSESSMENT LAYER */}
              <div className="p-3.5 bg-white rounded-xl border border-[#003006]/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#003006] flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-[#00490e]" />
                    Solar Engineering Confidence Layer
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f0f7ea] text-[#00490e] font-bold">
                    Score: {activeOption.confidenceLayer?.score ?? 88}/100
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-[#faf8f3] border border-[#c0c9bb]/40">
                    <div className="text-[10px] text-[#707a6c]">Engineering Confidence</div>
                    <div className="font-bold text-[#003006] mt-0.5">
                      {activeOption.engineeringConfidence || activeOption.confidence}
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-[#faf8f3] border border-[#c0c9bb]/40">
                    <div className="text-[10px] text-[#707a6c]">Input Quality</div>
                    <div className="font-bold text-[#003006] mt-0.5">
                      {activeOption.inputQuality || 'HIGH'}
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-[#faf8f3] border border-[#c0c9bb]/40">
                    <div className="text-[10px] text-[#707a6c]">Pricing Confidence</div>
                    <div className="font-bold text-[#003006] mt-0.5">
                      {activeOption.pricingConfidence || 'MEDIUM'}
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-[#faf8f3] border border-[#c0c9bb]/40">
                    <div className="text-[10px] text-[#707a6c]">Requires Site Verification</div>
                    <div className="font-bold text-[#00490e] mt-0.5">
                      YES
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-[#40493d] leading-relaxed pt-1">
                  <strong>Daily Energy:</strong> {pipelineResult.normalizedLoad.dailyEnergyKwh.toFixed(1)} kWh/day • <strong>Estimated PV Generation:</strong> {activeOption.expectedDailyGenerationKwh.toFixed(1)} kWh/day • <strong>Night Autonomy:</strong> {activeOption.autonomyHours.toFixed(1)} hours.
                </div>
              </div>

              {/* Investment Planning Range */}
              <div className="p-4 rounded-xl bg-[#003006] text-white space-y-1">
                <div className="text-[11px] uppercase tracking-wider text-[#ceee93] font-bold">
                  Reference Investment Estimate ({activeOption.label})
                </div>
                <div className="font-[Manrope] text-xl sm:text-2xl font-extrabold text-[#ceee93]">
                  {activeOption.formattedPriceRange || `₦${(activeOption.estimatedCAPEXNaira * 0.9).toLocaleString('en-NG')} – ₦${(activeOption.estimatedCAPEXNaira * 1.15).toLocaleString('en-NG')}`}
                </div>
                <p className="text-[11px] text-white/80 leading-relaxed pt-1">
                  {activeOption.description}
                </p>
              </div>

              {/* THREE-STAGE COMMERCIAL MARKETPLACE BOUNDARY */}
              <div className="p-3 rounded-xl bg-[#ede4dc]/70 border border-[#c0c9bb]/60 space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#003006]">
                  Sunlit Verified Commercial Lifecycle
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                  <div className="p-1.5 rounded bg-white font-semibold text-[#003006] border border-[#003006]/30">
                    1. Preliminary Sizing
                  </div>
                  <div className="p-1.5 rounded bg-white/70 text-[#40493d]">
                    2. Installer Site Survey
                  </div>
                  <div className="p-1.5 rounded bg-white/70 text-[#40493d]">
                    3. Binding BOM & Price
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: CONTACT & REGISTRATION */}
          {currentStep === 'contact' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-[Manrope] text-base font-bold text-[#1a1c1b] mb-1">
                  4. Your Contact Details
                </h3>
                <p className="text-xs text-[#40493d]">
                  {installer.business_name} will use these details to dispatch your formal quote.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1a1c1b] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Babatunde Adeleke"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#c0c9bb]/60 text-xs text-[#1a1c1b] focus:outline-none focus:border-[#003006]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1a1c1b] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="babatunde@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#c0c9bb]/60 text-xs text-[#1a1c1b] focus:outline-none focus:border-[#003006]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1a1c1b] mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 803 000 0000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#c0c9bb]/60 text-xs text-[#1a1c1b] focus:outline-none focus:border-[#003006]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1a1c1b] mb-1">
                    Project Notes / Special Requirements
                  </label>
                  <textarea
                    rows={2}
                    value={projectBrief}
                    onChange={(e) => setProjectBrief(e.target.value)}
                    placeholder="Mention specific generator fuel displacement targets, roof type, or day/night preferences..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#c0c9bb]/60 text-xs text-[#1a1c1b] focus:outline-none focus:border-[#003006]"
                  />
                </div>

                {/* Account Creation Option */}
                <div className="p-3 bg-white rounded-xl border border-[#c0c9bb]/50 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={createAccount}
                      onChange={(e) => setCreateAccount(e.target.checked)}
                      className="rounded text-[#003006]"
                    />
                    <span className="text-xs font-semibold text-[#1a1c1b]">
                      Create a Sunlit Account to track quotes & milestone escrow payments
                    </span>
                  </label>
                  {createAccount && (
                    <div className="pt-1">
                      <input
                        type="password"
                        placeholder="Create a secure password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#faf8f3] border border-[#c0c9bb] text-xs text-[#1a1c1b]"
                      />
                      <span className="text-[10px] text-[#707a6c]">
                        You can review installer milestone bids and sign contracts securely in your dashboard.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: CONTINUATION DECISION (DIRECTORY ONLY) */}
          {currentStep === 'continuation_decision' && (
            <div className="space-y-6 text-center py-4">
              <div className="w-14 h-14 rounded-full bg-[#003006] text-[#ceee93] flex items-center justify-center mx-auto">
                <UserCheck size={28} />
              </div>
              <div>
                <h3 className="font-[Manrope] text-xl font-bold text-[#003006] mb-2">
                  Would you like to look at more installers before continuing?
                </h3>
                <p className="text-xs text-[#40493d] max-w-md mx-auto leading-relaxed">
                  You have selected <strong>{installer.business_name}</strong>. You can proceed directly to send your quote request, or explore other verified installers in {installer.headquarters_state}.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onViewMoreInstallers) {
                      onViewMoreInstallers();
                    } else {
                      onClose();
                    }
                  }}
                  className="px-5 py-3 rounded-full border border-[#003006] text-[#003006] text-xs font-semibold hover:bg-[#003006]/5 transition-all"
                >
                  View More Installers
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep('confirmation')}
                  className="px-6 py-3 rounded-full bg-[#003006] text-white text-xs font-semibold hover:bg-[#0f631b] transition-all shadow-md"
                >
                  Continue With {installer.business_name}
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: CONFIRMATION */}
          {currentStep === 'confirmation' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-[Manrope] text-base font-bold text-[#1a1c1b] mb-1">
                  Review & Send Quote Request
                </h3>
                <p className="text-xs text-[#40493d]">
                  Confirm your project summary before sending it directly to {installer.business_name}.
                </p>
              </div>

              {/* Review Summary */}
              <div className="p-4 bg-white rounded-xl border border-[#c0c9bb]/60 space-y-3 text-xs">
                <div className="flex justify-between border-b border-[#c0c9bb]/30 pb-2">
                  <span className="text-[#707a6c]">Target Installer:</span>
                  <span className="font-bold text-[#003006]">{installer.business_name}</span>
                </div>
                <div className="flex justify-between border-b border-[#c0c9bb]/30 pb-2">
                  <span className="text-[#707a6c]">Facility Type:</span>
                  <span className="font-semibold text-[#1a1c1b]">{facilityType}</span>
                </div>
                <div className="flex justify-between border-b border-[#c0c9bb]/30 pb-2">
                  <span className="text-[#707a6c]">Customer Name:</span>
                  <span className="font-semibold text-[#1a1c1b]">{fullName || 'Project Owner'}</span>
                </div>
                <div className="flex justify-between border-b border-[#c0c9bb]/30 pb-2">
                  <span className="text-[#707a6c]">Location:</span>
                  <span className="font-semibold text-[#1a1c1b]">{city}, {state}</span>
                </div>
                <div className="flex justify-between border-b border-[#c0c9bb]/30 pb-2">
                  <span className="text-[#707a6c]">Daily Energy Demand:</span>
                  <span className="font-semibold text-[#1a1c1b]">{pipelineResult.normalizedLoad.dailyEnergyKwh.toFixed(1)} kWh/day</span>
                </div>
                <div className="flex justify-between border-b border-[#c0c9bb]/30 pb-2">
                  <span className="text-[#707a6c]">Selected Configuration:</span>
                  <span className="font-bold text-[#003006]">
                    {activeOption.solarCapacityKwp} kWp Solar • {activeOption.inverterRatingKva} kVA Inverter • {activeOption.batteryNominalKwh} kWh LiFePO4
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#c0c9bb]/30 pb-2">
                  <span className="text-[#707a6c]">Engineering Confidence:</span>
                  <span className="font-bold text-[#00490e]">{activeOption.engineeringConfidence || 'HIGH'} (Requires Site Verification)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#707a6c]">Estimated Investment:</span>
                  <span className="font-bold text-[#00490e]">{activeOption.formattedPriceRange || `₦${(activeOption.estimatedCAPEXNaira * 0.9).toLocaleString('en-NG')} – ₦${(activeOption.estimatedCAPEXNaira * 1.15).toLocaleString('en-NG')}`}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#f7fbf1] border border-[#003006]/20 flex items-center gap-2 text-xs text-[#00490e]">
                <ShieldCheck size={16} />
                <span>Protected by Sunlit Milestone Escrow framework. Zero upfront payment risk.</span>
              </div>
            </div>
          )}

          {/* STEP 7: SUCCESS */}
          {currentStep === 'success' && (
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#003006] text-[#ceee93] flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-[Manrope] text-2xl font-bold text-[#003006]">
                Quote Request Dispatched!
              </h3>
              <p className="text-xs text-[#707a6c] uppercase tracking-wider font-bold">
                Reference ID: {rfqId}
              </p>
              <p className="text-sm text-[#40493d] max-w-md mx-auto leading-relaxed">
                Your structured load requirements, appliance dynamics, and preliminary recommendation have been routed to <strong>{installer.business_name}</strong>. Their lead engineer will review and respond with a formal milestone quotation within 24–48 hours.
              </p>
              <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-[#003006] text-white text-xs font-semibold px-6 py-3 rounded-full hover:bg-[#0f631b] transition-all shadow-md"
                >
                  Done
                </button>
                <Link
                  href={`/installers/${installer.slug}`}
                  className="bg-transparent border border-[#003006]/30 text-[#003006] text-xs font-semibold px-6 py-3 rounded-full hover:bg-[#003006]/5 transition-all flex items-center justify-center gap-1.5"
                >
                  View Full Profile <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {currentStep !== 'success' && currentStep !== 'continuation_decision' && (
          <div className="px-6 py-3.5 border-t border-[#c0c9bb]/40 bg-[#f6ece6]/60 flex items-center justify-between gap-3 shrink-0">
            {currentStep !== 'scope' ? (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 'questionnaire') setCurrentStep('scope');
                  else if (currentStep === 'recommendation') setCurrentStep('questionnaire');
                  else if (currentStep === 'contact') setCurrentStep('recommendation');
                  else if (currentStep === 'confirmation') setCurrentStep('contact');
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#40493d] hover:text-[#003006] px-3 py-2 rounded-lg"
              >
                <ArrowLeft size={14} /> Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-[#707a6c] hover:text-[#1a1c1b] px-3 py-2"
              >
                Cancel
              </button>
            )}

            <div className="flex items-center gap-2">
              {currentStep === 'scope' && (
                <button
                  type="button"
                  onClick={() => setCurrentStep('questionnaire')}
                  className="px-5 py-2.5 bg-[#003006] text-white text-xs font-semibold rounded-full hover:bg-[#0f631b] transition-all inline-flex items-center gap-1.5 shadow-sm"
                >
                  Next: Energy Requirements <ArrowRight size={14} />
                </button>
              )}

              {currentStep === 'questionnaire' && (
                <button
                  type="button"
                  onClick={() => setCurrentStep('recommendation')}
                  className="px-5 py-2.5 bg-[#003006] text-white text-xs font-semibold rounded-full hover:bg-[#0f631b] transition-all inline-flex items-center gap-1.5 shadow-sm"
                >
                  Calculate Recommendation <ArrowRight size={14} />
                </button>
              )}

              {currentStep === 'recommendation' && (
                <button
                  type="button"
                  onClick={() => setCurrentStep('contact')}
                  className="px-5 py-2.5 bg-[#003006] text-white text-xs font-semibold rounded-full hover:bg-[#0f631b] transition-all inline-flex items-center gap-1.5 shadow-sm"
                >
                  Next: Contact Details <ArrowRight size={14} />
                </button>
              )}

              {currentStep === 'contact' && (
                <button
                  type="button"
                  disabled={!fullName.trim() || !email.trim() || !phone.trim()}
                  onClick={() => {
                    if (source === 'DIRECTORY') {
                      setCurrentStep('continuation_decision');
                    } else {
                      setCurrentStep('confirmation');
                    }
                  }}
                  className={`px-5 py-2.5 text-xs font-semibold rounded-full transition-all inline-flex items-center gap-1.5 shadow-sm ${
                    !fullName.trim() || !email.trim() || !phone.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#003006] text-white hover:bg-[#0f631b]'
                  }`}
                >
                  Review Request <ArrowRight size={14} />
                </button>
              )}

              {currentStep === 'confirmation' && (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmAndSubmit}
                  className="px-6 py-2.5 bg-[#003006] text-[#ceee93] text-xs font-bold rounded-full hover:bg-[#0f631b] transition-all inline-flex items-center gap-1.5 shadow-md"
                >
                  {isSubmitting ? 'Dispatching Request...' : 'Submit Quote Request'}
                  <Zap size={14} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
