'use client';

import React, { useState } from 'react';
import { Check, Lock, AlertCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

export interface WorkflowStep {
  id: number;
  title: string;
  shortTitle?: string;
  status: 'LOCKED' | 'ACTIVE' | 'COMPLETED' | 'INVALID' | 'REQUIRES_REVIEW';
}

interface WorkflowStepperProps {
  steps: WorkflowStep[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

export function WorkflowStepper({
  steps,
  currentStep,
  onStepClick,
}: WorkflowStepperProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const activeStepObj = steps.find((s) => s.id === currentStep) || steps[0];

  return (
    <div className="w-full bg-white border border-stone-200 rounded-2xl p-4 md:p-6 mb-8 shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 animate-pulse" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-950">
            Engineering Workflow — Step {currentStep} of {steps.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-600 font-bold bg-stone-100 px-2.5 py-1 rounded-full">
            {Math.round((currentStep / steps.length) * 100)}% Completed
          </span>
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="sm:hidden text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1"
          >
            {mobileDrawerOpen ? 'Close Menu' : 'All Steps'} {mobileDrawerOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Active step quick summary for mobile */}
      <div className="sm:hidden mb-3 bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase font-bold text-emerald-800">Current Active Stage</p>
          <p className="text-xs font-extrabold text-stone-900">{activeStepObj.title}</p>
        </div>
        <span className="text-[10px] font-bold bg-emerald-800 text-white px-2 py-0.5 rounded-md">
          {activeStepObj.status}
        </span>
      </div>

      {/* Responsive step grid / drawer */}
      <div className={`grid gap-2 sm:gap-2.5 transition-all ${mobileDrawerOpen ? 'grid-cols-1' : 'hidden sm:grid'} ${steps.length >= 8 ? 'sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9' : 'sm:grid-cols-3 md:grid-cols-5'}`}>
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.status === 'COMPLETED';
          const isLocked = step.status === 'LOCKED';
          const isInvalid = step.status === 'INVALID';
          const isRequiresReview = step.status === 'REQUIRES_REVIEW';

          return (
            <button
              key={step.id}
              onClick={() => {
                if (!isLocked) {
                  onStepClick(step.id);
                  setMobileDrawerOpen(false);
                }
              }}
              disabled={isLocked}
              className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all text-xs font-semibold ${
                isActive
                  ? 'bg-emerald-50 border-emerald-700 text-emerald-950 shadow-sm ring-1 ring-emerald-700'
                  : isCompleted
                  ? 'bg-stone-50 border-stone-300 text-stone-800 hover:bg-stone-100 cursor-pointer'
                  : isRequiresReview
                  ? 'bg-amber-50 border-amber-300 text-amber-900 cursor-pointer'
                  : isInvalid
                  ? 'bg-red-50 border-red-300 text-red-900 cursor-pointer'
                  : 'bg-stone-50/50 border-stone-200 text-stone-400 opacity-60 cursor-not-allowed'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isActive
                    ? 'bg-emerald-800 text-white'
                    : isCompleted
                    ? 'bg-emerald-700 text-white'
                    : isRequiresReview
                    ? 'bg-amber-600 text-white'
                    : isInvalid
                    ? 'bg-red-600 text-white'
                    : 'bg-stone-200 text-stone-500'
                }`}
              >
                {isCompleted ? (
                  <Check size={13} strokeWidth={3} />
                ) : isLocked ? (
                  <Lock size={12} />
                ) : isRequiresReview ? (
                  <RefreshCw size={12} className="animate-spin" />
                ) : isInvalid ? (
                  <AlertCircle size={13} />
                ) : (
                  step.id
                )}
              </div>
              <div className="truncate flex-1">
                <p className="truncate text-[11px] leading-tight font-bold">
                  {step.shortTitle || step.title}
                </p>
                <p className="text-[10px] opacity-75 font-normal truncate">
                  {isActive
                    ? 'Active'
                    : isCompleted
                    ? 'Done'
                    : isRequiresReview
                    ? 'Review'
                    : isLocked
                    ? 'Locked'
                    : 'Error'}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

