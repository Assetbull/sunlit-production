'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FEATURES } from '@/config/features';
import { CreateRfqFormSchema } from '@/dashboards/project-owner/validators/rfq-form';
import { createRfq } from '@/dashboards/project-owner/services/project-owner-api';
import { screenRegistry } from '@/shared/screens';
import { RFQData } from '@/shared/screens/rfq/types';

export default function CreateRfqPage() {
  const router = useRouter();
  
  const [stepIndex, setStepIndex] = useState(0);

  const [state, setState] = useState<RFQData>({
    projectType: '',
    projectPath: '',
    invCapacity: '',
    invType: '',
    battCapacity: '',
    battUnits: '1',
    battChem: '',
    panelWattage: '',
    panelCount: '10',
    panelType: '',
    systemSizeKw: '0',
    selectedAppliances: [],
    projectTitle: '',
    locationState: '',
    locationCity: '',
    timelineDays: '30',
    description: '',
    budgetRangeMin: '',
    budgetRangeMax: '',
    status: 'idle',
    errors: {},
    serverError: '',
  });

  const updateState = (updates: Partial<RFQData>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (stepIndex === 0 && !state.projectType) return;
    if (stepIndex === 1 && !state.projectPath) return;
    setStepIndex(s => Math.min(s + 1, 6));
  };

  const handleBack = () => {
    if (stepIndex === 0) {
      router.push('/dashboard/project-owner');
    } else {
      setStepIndex(s => Math.max(s - 1, 0));
    }
  };

  const handleSubmit = async () => {
    updateState({ errors: {}, serverError: '', status: 'loading' });

    let finalAppliances = state.selectedAppliances;
    let finalSizeKw = state.systemSizeKw;
    let finalDescription = state.description;

    if (state.projectPath === 'installation') {
      finalAppliances = [
        `Inverter: ${state.invCapacity} ${state.invType}`,
        `Battery: ${state.battUnits}x ${state.battCapacity}kWh ${state.battChem}`,
        `Panels: ${state.panelCount}x ${state.panelWattage}W ${state.panelType}`
      ].filter(s => !s.includes('undefined') && !s.includes('  ') && s.trim() !== '');
      
      if (finalAppliances.length === 0) finalAppliances = ['Hardware Installation'];
      
      if (state.panelCount && state.panelWattage) {
        finalSizeKw = ((parseInt(state.panelCount) * parseInt(state.panelWattage)) / 1000).toString();
      } else {
        finalSizeKw = '5';
      }
    }

    const raw = {
      projectTitle: state.projectTitle || `${state.projectType} Solar Project`,
      description: finalDescription,
      locationState: state.locationState,
      locationCity: state.locationCity,
      systemSizeKw: finalSizeKw || '5',
      budgetRangeMin: state.budgetRangeMin,
      budgetRangeMax: state.budgetRangeMax,
      timelineDays: state.timelineDays,
      projectType: state.projectType || 'Residential',
      appliances: finalAppliances.length > 0 ? finalAppliances : ['General Load'],
    };

    const result = CreateRfqFormSchema.safeParse(raw);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0]?.toString();
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      updateState({ errors: fieldErrors, status: 'idle' });
      // Go back to the step where the error is to show it, or stay and show generic
      return;
    }

    const res = await createRfq(result.data);
    if (!res.success) {
      updateState({ serverError: res.error || 'Failed to create RFQ', status: 'idle' });
      return;
    }

    updateState({ status: 'success' });
    setStepIndex(6); // Move to Success Screen
  };

  if (!FEATURES.RFQ) {
    return (
      <div className="max-w-lg mx-auto py-16 px-4 text-center bg-surface min-h-screen">
        <h1 className="font-headline text-2xl font-bold mb-4">RFQ creation is temporarily off</h1>
        <p className="font-body text-on-surface-variant mb-8">
          This module is behind a feature flag so deployments stay stable while we finish the flow.
        </p>
        <Link href="/dashboard/project-owner" className="px-6 py-3 bg-primary text-white rounded-lg font-medium">
          Back to overview
        </Link>
      </div>
    );
  }

  const steps = [
    'c69183e744a54506b11a5b763ab132da', // Step 1: Project Type
    '15fa5aaa85454603b4509e4c7265f7a5', // Step 2: Project Path
    state.projectPath === 'appliance' 
      ? 'c76eeba52b744ee8ac5bc5de5da3818c' // Step 3a: Appliance Load Profile
      : '74aacbdf19874ebf94ceefded6b79aad', // Step 3b: Commercial Load Profile
    '053e04c0923c4306a1d3d250a1a8e1bf', // Step 4: Location
    '6b4f50320f324f748a7632da5aae3554', // Step 5: Budget
    'b3594681cfb947eab609a78c21666246', // Step 6: Review
    '5cf0a57f6084494d8d83da5a491ddb82', // Step 7: Success
  ];

  const CurrentScreen = screenRegistry[steps[stepIndex]];

  if (!CurrentScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-error">Screen not found in registry.</p>
      </div>
    );
  }

  // Pass necessary props based on screen ID (Final screen doesn't need RFQData, it handles its own routing)
  if (stepIndex === 6) {
    return <CurrentScreen />;
  }

  return (
    <div className="flex-1 min-h-screen bg-surface font-body overflow-x-hidden flex flex-col relative selection:bg-secondary-container selection:text-on-secondary-container pb-32">
      {/* Ambient Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-primary-fixed-dim/10 blur-[100px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-surface-container-high/40 blur-[120px]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <CurrentScreen 
          data={{
            state,
            onUpdate: updateState,
            onNext: handleNext,
            onBack: handleBack,
            onSubmit: handleSubmit
          }} 
        />
      </div>
    </div>
  );
}
