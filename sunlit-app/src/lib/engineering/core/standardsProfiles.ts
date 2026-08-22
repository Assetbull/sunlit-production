/**
 * V3 Standards Profiles
 * Sunlit Enterprise Engineering Platform
 * Engine Version 3.0.0
 *
 * Standards profiles define per-sector engineering margins, limits,
 * and regulatory requirements that govern sizing decisions.
 *
 * Profiles:
 *   NG-RESIDENTIAL  — Nigerian residential installations (NBRDA / SON standards)
 *   NG-COMMERCIAL   — Nigerian commercial buildings (NEC / IEC 60364)
 *   NG-INDUSTRIAL   — Nigerian industrial / critical infrastructure (IEC 61936)
 *   INTERNATIONAL   — IEC / IEEE generic profile for international projects
 */

export type StandardsProfileId =
  | 'NG-RESIDENTIAL'
  | 'NG-COMMERCIAL'
  | 'NG-INDUSTRIAL'
  | 'INTERNATIONAL';

export interface StandardsProfile {
  id: StandardsProfileId;
  name: string;
  version: string;
  applicableStandards: string[];
  description: string;

  // Safety margins
  pvDesignMarginPercent: number;          // % design margin on PV array sizing
  inverterHeadroomPercent: number;        // % headroom over peak continuous load
  minBatteryAutonomyHours: number;        // Minimum required overnight autonomy
  minBatteryAutonomyDays: number;         // Minimum days of full autonomy

  // Electrical limits
  maxDcVoltageDropPercent: number;        // Max DC cable voltage drop
  maxAcVoltageDropPercent: number;        // Max AC cable voltage drop
  minPowerFactor: number;                 // Minimum acceptable power factor

  // Thermal requirements
  cableAmbientDesignTempC: number;        // Design ambient temperature for cable derating

  // PV string limits
  minStringVoltageMarginPercent: number;  // MPPT low-voltage margin

  // Financial
  defaultDiscountRatePercent: number;     // For NPV/IRR calculations
  defaultSystemLifetimeYears: number;     // System design life

  // Operational
  defaultDaysOfAutonomyResidential: number;
  defaultDaysOfAutonomyCommercial: number;
  defaultDaysOfAutonomyIndustrial: number;
}

// ============================================================
// PROFILE REGISTRY
// ============================================================

const NG_RESIDENTIAL: StandardsProfile = {
  id: 'NG-RESIDENTIAL',
  name: 'Nigerian Residential Solar Standard',
  version: '1.0',
  applicableStandards: [
    'NEC 690 (Solar Photovoltaic Systems)',
    'IEC 60364-7-712 (Solar PV Installations)',
    'BS 7671 18th Edition (Wiring Regulations)',
    'SON NIS 457 (Nigerian Electrical Standard)',
    'NERC Codes — Off-Grid Systems',
  ],
  description: 'Standard profile for Nigerian residential off-grid and hybrid solar systems. Sized for single-phase loads up to 10 kVA, 1–3 days of autonomy, and Nigerian climate conditions.',
  pvDesignMarginPercent: 15,
  inverterHeadroomPercent: 25,
  minBatteryAutonomyHours: 6,
  minBatteryAutonomyDays: 1,
  maxDcVoltageDropPercent: 1.5,
  maxAcVoltageDropPercent: 2.5,
  minPowerFactor: 0.80,
  cableAmbientDesignTempC: 40,
  minStringVoltageMarginPercent: 10,
  defaultDiscountRatePercent: 12,
  defaultSystemLifetimeYears: 25,
  defaultDaysOfAutonomyResidential: 1.0,
  defaultDaysOfAutonomyCommercial: 0.5,
  defaultDaysOfAutonomyIndustrial: 0.5,
};

const NG_COMMERCIAL: StandardsProfile = {
  id: 'NG-COMMERCIAL',
  name: 'Nigerian Commercial Solar Standard',
  version: '1.0',
  applicableStandards: [
    'IEC 60364-7-712',
    'IEC 62548 (PV Array Design)',
    'IEEE 1547 (DER Interconnection)',
    'IEC 61724-1 (PV System Performance Monitoring)',
    'NERC Business Premises MYTO',
    'NEC 690.7 (String Voltage Limits)',
  ],
  description: 'Profile for Nigerian commercial and SME solar installations. Supports single and three-phase systems, larger battery banks, and commercial-grade equipment.',
  pvDesignMarginPercent: 20,
  inverterHeadroomPercent: 30,
  minBatteryAutonomyHours: 8,
  minBatteryAutonomyDays: 1.5,
  maxDcVoltageDropPercent: 1.0,
  maxAcVoltageDropPercent: 2.0,
  minPowerFactor: 0.85,
  cableAmbientDesignTempC: 45,
  minStringVoltageMarginPercent: 15,
  defaultDiscountRatePercent: 15,
  defaultSystemLifetimeYears: 25,
  defaultDaysOfAutonomyResidential: 1.5,
  defaultDaysOfAutonomyCommercial: 1.0,
  defaultDaysOfAutonomyIndustrial: 0.5,
};

const NG_INDUSTRIAL: StandardsProfile = {
  id: 'NG-INDUSTRIAL',
  name: 'Nigerian Industrial & Critical Infrastructure Solar Standard',
  version: '1.0',
  applicableStandards: [
    'IEC 61936-1 (Power Installations > 1 kV)',
    'IEC 62548',
    'IEC 61724-1',
    'IEEE 519 (Harmonic Limits)',
    'IEEE 1547.4 (Islanding)',
    'IEC 62619 (Battery Safety)',
    'OSHA / NFPA 70E (Electrical Safety)',
  ],
  description: 'Profile for industrial facilities, data centers, hospitals, and critical infrastructure. Mandates extended autonomy, harmonic analysis, protection coordination, and formal engineering sign-off.',
  pvDesignMarginPercent: 25,
  inverterHeadroomPercent: 40,
  minBatteryAutonomyHours: 12,
  minBatteryAutonomyDays: 2,
  maxDcVoltageDropPercent: 0.5,
  maxAcVoltageDropPercent: 1.5,
  minPowerFactor: 0.90,
  cableAmbientDesignTempC: 50,
  minStringVoltageMarginPercent: 20,
  defaultDiscountRatePercent: 12,
  defaultSystemLifetimeYears: 30,
  defaultDaysOfAutonomyResidential: 2.0,
  defaultDaysOfAutonomyCommercial: 2.0,
  defaultDaysOfAutonomyIndustrial: 2.0,
};

const INTERNATIONAL: StandardsProfile = {
  id: 'INTERNATIONAL',
  name: 'International Generic Solar Standard',
  version: '1.0',
  applicableStandards: [
    'IEC 60364-7-712',
    'IEC 62548',
    'IEC 61724-1',
    'IEC 61730 (PV Module Safety)',
    'IEC 62619 (Battery Safety)',
    'IEEE 1547',
  ],
  description: 'Generic IEC/IEEE international profile suitable for projects outside Nigeria or where no local standard is specified.',
  pvDesignMarginPercent: 15,
  inverterHeadroomPercent: 25,
  minBatteryAutonomyHours: 6,
  minBatteryAutonomyDays: 1,
  maxDcVoltageDropPercent: 1.0,
  maxAcVoltageDropPercent: 2.0,
  minPowerFactor: 0.80,
  cableAmbientDesignTempC: 40,
  minStringVoltageMarginPercent: 10,
  defaultDiscountRatePercent: 10,
  defaultSystemLifetimeYears: 25,
  defaultDaysOfAutonomyResidential: 1.0,
  defaultDaysOfAutonomyCommercial: 1.0,
  defaultDaysOfAutonomyIndustrial: 1.5,
};

export const STANDARDS_PROFILE_REGISTRY: Record<StandardsProfileId, StandardsProfile> = {
  'NG-RESIDENTIAL': NG_RESIDENTIAL,
  'NG-COMMERCIAL': NG_COMMERCIAL,
  'NG-INDUSTRIAL': NG_INDUSTRIAL,
  'INTERNATIONAL': INTERNATIONAL,
};

/**
 * Resolves a standards profile by ID.
 * Defaults to NG-RESIDENTIAL if no profile specified.
 */
export function getStandardsProfile(id?: StandardsProfileId): StandardsProfile {
  if (!id) return NG_RESIDENTIAL;
  return STANDARDS_PROFILE_REGISTRY[id] ?? NG_RESIDENTIAL;
}

/**
 * Auto-selects an appropriate profile based on project characteristics.
 */
export function autoSelectProfile(params: {
  projectType?: 'residential' | 'commercial' | 'industrial';
  inverterKva?: number;
  phaseType?: 'single-phase' | 'three-phase';
}): StandardsProfile {
  const { projectType, inverterKva, phaseType } = params;

  if (projectType === 'industrial' || (inverterKva && inverterKva > 15)) {
    return NG_INDUSTRIAL;
  }
  if (projectType === 'commercial' || phaseType === 'three-phase' || (inverterKva && inverterKva > 5)) {
    return NG_COMMERCIAL;
  }
  return NG_RESIDENTIAL;
}
