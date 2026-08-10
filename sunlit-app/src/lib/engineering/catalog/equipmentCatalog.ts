/**
 * Equipment & Location Catalog Library
 * Sunlit Enterprise Engineering Platform
 */

export interface PvModuleCatalogItem {
  id: string;
  manufacturer: string;
  model: string;
  ratedPowerW: number;
  vocStcV: number;
  vmpStcV: number;
  iscStcA: number;
  impStcA: number;
  tempCoeffVocPercentPerC: number;
  tempCoeffPmaxPercentPerC: number;
  efficiencyPercent: number;
  dimensionsMm: { length: number; width: number; height: number };
  cellTechnology: 'N-Type TOPCon' | 'Monocrystalline PERC' | 'HJT';
  source: string;
}

export interface InverterCatalogItem {
  id: string;
  manufacturer: string;
  model: string;
  ratedKva: number;
  ratedKw: number;
  surgeKva: number;
  surgeDurationSec: number;
  maxPvPowerW: number;
  maxDcVoltageV: number;
  mpptVoltageRangeV: { min: number; max: number };
  maxMpptCurrentA: number;
  mpptTrackerCount: number;
  batteryVoltageRangeV: { min: number; max: number; nominal: number };
  phaseType: 'single-phase' | 'three-phase';
  topology: 'hybrid' | 'offgrid' | 'grid-tied';
  source: string;
}

export interface BatteryCatalogItem {
  id: string;
  manufacturer: string;
  model: string;
  chemistry: 'LITHIUM_LIFEPO4' | 'TUBULAR_GEL' | 'AGM';
  nominalVoltageV: number;
  capacityKwh: number;
  usableCapacityKwh: number;
  recommendedDodPercent: number;
  maxDodPercent: number;
  maxContinuousDischargeCurrentA: number;
  maxChargeCurrentA: number;
  roundTripEfficiencyPercent: number;
  operatingTempRangeC: { min: number; max: number };
  source: string;
}

export interface CableCatalogItem {
  id: string;
  conductorMaterial: 'copper' | 'aluminum';
  crossSectionMm2: number;
  insulationType: 'XLPE' | 'PVC';
  dcAmpacityA: number;
  acAmpacityA: number;
  resistanceOhmPerKm: number;
  voltageRatingV: number;
  source: string;
}

export interface LocationSolarMetadata {
  locationId: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  annualMeanPsh: number; // Peak Sun Hours
  monthlyPsh: number[]; // 12-month array Jan..Dec
  designTempMinC: number;
  designTempMaxC: number;
}

export const PV_MODULE_CATALOG: PvModuleCatalogItem[] = [
  {
    id: 'ja-solar-550w',
    manufacturer: 'JA Solar',
    model: 'JAM72S30-550/MR',
    ratedPowerW: 550,
    vocStcV: 49.90,
    vmpStcV: 41.96,
    iscStcA: 14.00,
    impStcA: 13.11,
    tempCoeffVocPercentPerC: -0.275,
    tempCoeffPmaxPercentPerC: -0.350,
    efficiencyPercent: 21.3,
    dimensionsMm: { length: 2278, width: 1134, height: 35 },
    cellTechnology: 'Monocrystalline PERC',
    source: 'JA Solar Official Datasheet V2024',
  },
  {
    id: 'canadian-solar-550w',
    manufacturer: 'Canadian Solar',
    model: 'CS6W-550MS',
    ratedPowerW: 550,
    vocStcV: 49.60,
    vmpStcV: 41.70,
    iscStcA: 14.00,
    impStcA: 13.20,
    tempCoeffVocPercentPerC: -0.260,
    tempCoeffPmaxPercentPerC: -0.340,
    efficiencyPercent: 21.5,
    dimensionsMm: { length: 2278, width: 1134, height: 35 },
    cellTechnology: 'Monocrystalline PERC',
    source: 'Canadian Solar Datasheet 2024',
  },
  {
    id: 'jinko-tiger-575w',
    manufacturer: 'Jinko Solar',
    model: 'JKM575N-72HL4-V',
    ratedPowerW: 575,
    vocStcV: 51.70,
    vmpStcV: 43.15,
    iscStcA: 13.99,
    impStcA: 13.33,
    tempCoeffVocPercentPerC: -0.250,
    tempCoeffPmaxPercentPerC: -0.300,
    efficiencyPercent: 22.26,
    dimensionsMm: { length: 2278, width: 1134, height: 35 },
    cellTechnology: 'N-Type TOPCon',
    source: 'Jinko Solar Tiger Neo Datasheet',
  },
];

export const INVERTER_CATALOG: InverterCatalogItem[] = [
  {
    id: 'deye-5kva-hybrid',
    manufacturer: 'Deye',
    model: 'SUN-5K-SG04LP1-EU',
    ratedKva: 5.0,
    ratedKw: 5.0,
    surgeKva: 10.0,
    surgeDurationSec: 10,
    maxPvPowerW: 6500,
    maxDcVoltageV: 500,
    mpptVoltageRangeV: { min: 125, max: 425 },
    maxMpptCurrentA: 13.0,
    mpptTrackerCount: 2,
    batteryVoltageRangeV: { min: 40, max: 60, nominal: 48 },
    phaseType: 'single-phase',
    topology: 'hybrid',
    source: 'Deye Official User Specification Manual',
  },
  {
    id: 'deye-8kva-hybrid',
    manufacturer: 'Deye',
    model: 'SUN-8K-SG01LP1-EU',
    ratedKva: 8.0,
    ratedKw: 8.0,
    surgeKva: 16.0,
    surgeDurationSec: 10,
    maxPvPowerW: 10400,
    maxDcVoltageV: 500,
    mpptVoltageRangeV: { min: 125, max: 425 },
    maxMpptCurrentA: 26.0,
    mpptTrackerCount: 2,
    batteryVoltageRangeV: { min: 40, max: 60, nominal: 48 },
    phaseType: 'single-phase',
    topology: 'hybrid',
    source: 'Deye Datasheet 2024',
  },
  {
    id: 'sunsynk-10k-3P',
    manufacturer: 'SunSynk',
    model: 'SUNSYNK-10K-SG04LP3',
    ratedKva: 10.0,
    ratedKw: 10.0,
    surgeKva: 20.0,
    surgeDurationSec: 10,
    maxPvPowerW: 13000,
    maxDcVoltageV: 800,
    mpptVoltageRangeV: { min: 200, max: 700 },
    maxMpptCurrentA: 26.0,
    mpptTrackerCount: 2,
    batteryVoltageRangeV: { min: 40, max: 60, nominal: 48 },
    phaseType: 'three-phase',
    topology: 'hybrid',
    source: 'SunSynk Engineering Guide 2024',
  },
];

export const BATTERY_CATALOG: BatteryCatalogItem[] = [
  {
    id: 'felicity-10kwh-lifepo4',
    manufacturer: 'Felicity Solar',
    model: 'LPBF48200-N',
    chemistry: 'LITHIUM_LIFEPO4',
    nominalVoltageV: 51.2,
    capacityKwh: 10.24,
    usableCapacityKwh: 8.19,
    recommendedDodPercent: 80,
    maxDodPercent: 90,
    maxContinuousDischargeCurrentA: 120,
    maxChargeCurrentA: 100,
    roundTripEfficiencyPercent: 95,
    operatingTempRangeC: { min: 0, max: 55 },
    source: 'Felicity Solar Factory Spec Sheet',
  },
  {
    id: 'pylontech-us5000',
    manufacturer: 'Pylontech',
    model: 'US5000',
    chemistry: 'LITHIUM_LIFEPO4',
    nominalVoltageV: 48.0,
    capacityKwh: 4.8,
    usableCapacityKwh: 4.56,
    recommendedDodPercent: 90,
    maxDodPercent: 95,
    maxContinuousDischargeCurrentA: 80,
    maxChargeCurrentA: 80,
    roundTripEfficiencyPercent: 96,
    operatingTempRangeC: { min: -10, max: 50 },
    source: 'Pylontech US5000 Official Datasheet',
  },
];

export const CABLE_CATALOG: CableCatalogItem[] = [
  { id: 'cable-4mm2-cu', conductorMaterial: 'copper', crossSectionMm2: 4, insulationType: 'XLPE', dcAmpacityA: 55, acAmpacityA: 42, resistanceOhmPerKm: 4.61, voltageRatingV: 1000, source: 'IEC 60287 Cable Standard' },
  { id: 'cable-6mm2-cu', conductorMaterial: 'copper', crossSectionMm2: 6, insulationType: 'XLPE', dcAmpacityA: 70, acAmpacityA: 54, resistanceOhmPerKm: 3.08, voltageRatingV: 1000, source: 'IEC 60287 Cable Standard' },
  { id: 'cable-10mm2-cu', conductorMaterial: 'copper', crossSectionMm2: 10, insulationType: 'XLPE', dcAmpacityA: 98, acAmpacityA: 75, resistanceOhmPerKm: 1.83, voltageRatingV: 1000, source: 'IEC 60287 Cable Standard' },
  { id: 'cable-16mm2-cu', conductorMaterial: 'copper', crossSectionMm2: 16, insulationType: 'XLPE', dcAmpacityA: 132, acAmpacityA: 100, resistanceOhmPerKm: 1.15, voltageRatingV: 1000, source: 'IEC 60287 Cable Standard' },
  { id: 'cable-25mm2-cu', conductorMaterial: 'copper', crossSectionMm2: 25, insulationType: 'XLPE', dcAmpacityA: 176, acAmpacityA: 135, resistanceOhmPerKm: 0.727, voltageRatingV: 1000, source: 'IEC 60287 Cable Standard' },
  { id: 'cable-35mm2-cu', conductorMaterial: 'copper', crossSectionMm2: 35, insulationType: 'XLPE', dcAmpacityA: 218, acAmpacityA: 169, resistanceOhmPerKm: 0.524, voltageRatingV: 1000, source: 'IEC 60287 Cable Standard' },
];

export const LOCATION_SOLAR_CATALOG: LocationSolarMetadata[] = [
  {
    locationId: 'lagos',
    name: 'Lagos',
    state: 'Lagos State',
    latitude: 6.5244,
    longitude: 3.3792,
    annualMeanPsh: 4.8,
    monthlyPsh: [4.9, 5.2, 5.1, 4.8, 4.5, 4.1, 3.8, 4.0, 4.3, 4.7, 5.1, 5.0],
    designTempMinC: 18,
    designTempMaxC: 36,
  },
  {
    locationId: 'abuja',
    name: 'Abuja',
    state: 'Federal Capital Territory',
    latitude: 9.0765,
    longitude: 7.3986,
    annualMeanPsh: 5.4,
    monthlyPsh: [5.8, 6.1, 5.9, 5.4, 5.0, 4.6, 4.2, 4.3, 4.8, 5.5, 6.0, 5.9],
    designTempMinC: 15,
    designTempMaxC: 38,
  },
  {
    locationId: 'kano',
    name: 'Kano',
    state: 'Kano State',
    latitude: 12.0022,
    longitude: 8.5920,
    annualMeanPsh: 6.1,
    monthlyPsh: [6.3, 6.6, 6.5, 6.2, 6.0, 5.7, 5.2, 5.4, 5.9, 6.4, 6.5, 6.2],
    designTempMinC: 12,
    designTempMaxC: 42,
  },
  {
    locationId: 'port_harcourt',
    name: 'Port Harcourt',
    state: 'Rivers State',
    latitude: 4.8156,
    longitude: 7.0498,
    annualMeanPsh: 4.2,
    monthlyPsh: [4.5, 4.7, 4.4, 4.2, 4.0, 3.6, 3.3, 3.4, 3.8, 4.1, 4.4, 4.6],
    designTempMinC: 20,
    designTempMaxC: 34,
  },
];
