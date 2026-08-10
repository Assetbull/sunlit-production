import { LoadElectricalType } from '../types';

export interface CatalogApplianceItem {
  id: string;
  category: 'air_conditioning' | 'pumping' | 'refrigeration' | 'lighting' | 'computing' | 'entertainment' | 'kitchen' | 'laundry' | 'water_heating' | 'security' | 'general';
  name: string;
  variant: string;
  loadType?: LoadElectricalType;
  ratedPowerW: number;
  startingPowerW?: number;
  powerFactor: number;
  startupMultiplier: number;
  startupDurationSec: number;
  dutyCycle: number;
  typicalHoursPerDay: number;
  simultaneityFactor?: number;
  aliases: string[];
  source: string;
  catalogVersion: string;
  defaultPriority?: 'CRITICAL' | 'IMPORTANT' | 'FLEXIBLE' | 'NON_CRITICAL';
  isDaytimeShiftable?: boolean;
  minWatts?: number;
  maxWatts?: number;
  voltage?: number;
}

/**
 * Enterprise Structured Appliance Data Model
 * Governed by Section 4.2 of Sunlit Solar Engineering Standards
 * Distinguishes Rated Power, Starting Power, Operating Power, Duty Cycle, and Coincidence.
 */
export interface StructuredApplianceModel {
  appliance_id: string;
  name: string;
  category: string;
  loadType: LoadElectricalType;
  ratedWatts: number;             // Nameplate continuous power (W)
  startingWatts: number;          // Peak starting / inductive surge power (W)
  typicalOperatingWatts: number;  // Average operating power factoring duty cycle (W)
  dutyCycle: number;              // 0.05 to 1.0 (e.g. 0.60 for washing machine, 0.45 for inverter AC)
  typicalHoursPerDay: number;     // User specified or catalog typical operating duration
  quantity: number;               // Unit count
  simultaneityFactor: number;     // Coincidence factor (0.1 to 1.0)
  powerFactor: number;            // 0.75 to 1.0
  voltage: number;                // 230V or 400V
  isDaytimeShiftable?: boolean;
  isCritical?: boolean;

  // Backward-compatibility aliases
  default_watts: number;
  min_watts: number;
  max_watts: number;
  typical_hours: number;
  duty_cycle: number;
  surge_multiplier: number;
  source: string;
  confidence: 'VERIFIED' | 'ESTIMATED' | 'USER_DEFINED';
  updated_at: string;
}


export const APPLIANCE_CATALOG: CatalogApplianceItem[] = [
  // Air Conditioners
  {
    id: 'ac-0-75hp',
    category: 'air_conditioning',
    name: 'Air Conditioner',
    variant: '0.75 HP (Inverter / Split)',
    ratedPowerW: 750,
    powerFactor: 0.85,
    startupMultiplier: 2.2,
    startupDurationSec: 2,
    dutyCycle: 0.7,
    typicalHoursPerDay: 8,
    aliases: ['0.75hp ac', 'ac 0.75hp', '0.75 hp air conditioner', 'small ac', 'split ac 0.75hp'],
    source: 'Manufacturer Tested Specification (LG / Panasonic)',
    catalogVersion: '2.0.0',
  },
  {
    id: 'ac-1-0hp',
    category: 'air_conditioning',
    name: 'Air Conditioner',
    variant: '1.0 HP (Split)',
    ratedPowerW: 1000,
    powerFactor: 0.85,
    startupMultiplier: 2.5,
    startupDurationSec: 2,
    dutyCycle: 0.7,
    typicalHoursPerDay: 8,
    aliases: ['1hp ac', '1.0hp ac', 'ac 1hp', '1 hp air conditioner', 'split ac 1hp'],
    source: 'Manufacturer Tested Specification (Hisense / LG)',
    catalogVersion: '2.0.0',
  },
  {
    id: 'ac-1-5hp',
    category: 'air_conditioning',
    name: 'Air Conditioner',
    variant: '1.5 HP (Split)',
    ratedPowerW: 1500,
    powerFactor: 0.85,
    startupMultiplier: 2.5,
    startupDurationSec: 2,
    dutyCycle: 0.7,
    typicalHoursPerDay: 8,
    aliases: ['1.5hp ac', 'ac 1.5hp', '1.5 hp air conditioner', '1.5hp split ac', '1.5 hp ac'],
    source: 'Manufacturer Tested Specification (Samsung / Hisense / LG)',
    catalogVersion: '2.0.0',
  },
  {
    id: 'ac-2-0hp',
    category: 'air_conditioning',
    name: 'Air Conditioner',
    variant: '2.0 HP (Split)',
    ratedPowerW: 2000,
    powerFactor: 0.85,
    startupMultiplier: 2.8,
    startupDurationSec: 3,
    dutyCycle: 0.75,
    typicalHoursPerDay: 8,
    aliases: ['2hp ac', '2.0hp ac', 'ac 2hp', '2 hp air conditioner', '2hp split ac'],
    source: 'Manufacturer Tested Specification (Panasonic / Gree)',
    catalogVersion: '2.0.0',
  },
  {
    id: 'ac-3-0hp',
    category: 'air_conditioning',
    name: 'Air Conditioner',
    variant: '3.0 HP (Floor Standing / Heavy Duty)',
    ratedPowerW: 3000,
    powerFactor: 0.85,
    startupMultiplier: 3.2,
    startupDurationSec: 3,
    dutyCycle: 0.8,
    typicalHoursPerDay: 8,
    aliases: ['3hp ac', '3.0hp ac', 'ac 3hp', '3 hp air conditioner', 'floor standing ac'],
    source: 'Manufacturer Tested Specification (Carrier / Daikin)',
    catalogVersion: '2.0.0',
  },

  // Water Pumps
  {
    id: 'pump-0-5hp',
    category: 'pumping',
    name: 'Water Pump',
    variant: '0.5 HP (Surface / Pumping)',
    ratedPowerW: 375,
    powerFactor: 0.75,
    startupMultiplier: 3.5,
    startupDurationSec: 3,
    dutyCycle: 1.0,
    typicalHoursPerDay: 1.5,
    aliases: ['0.5hp pump', 'half hp pump', '0.5hp water pump', 'small water pump'],
    source: 'Manufacturer Tested Specification (Pedrollo)',
    catalogVersion: '2.0.0',
  },
  {
    id: 'pump-1-0hp',
    category: 'pumping',
    name: 'Water Pump',
    variant: '1.0 HP (Submersible / Pumping)',
    ratedPowerW: 750,
    powerFactor: 0.80,
    startupMultiplier: 3.5,
    startupDurationSec: 3,
    dutyCycle: 1.0,
    typicalHoursPerDay: 2,
    aliases: ['1hp pump', '1.0hp pump', '1hp water pump', 'submersible pump 1hp', 'pumping machine'],
    source: 'Manufacturer Tested Specification (Pedrollo / DAB)',
    catalogVersion: '2.0.0',
  },
  {
    id: 'pump-1-5hp',
    category: 'pumping',
    name: 'Water Pump',
    variant: '1.5 HP (Borehole Submersible)',
    ratedPowerW: 1100,
    powerFactor: 0.82,
    startupMultiplier: 3.5,
    startupDurationSec: 3,
    dutyCycle: 1.0,
    typicalHoursPerDay: 2,
    aliases: ['1.5hp pump', '1.5hp water pump', 'borehole pump 1.5hp'],
    source: 'Manufacturer Tested Specification (Grundfos / Pedrollo)',
    catalogVersion: '2.0.0',
  },

  // Refrigeration
  {
    id: 'fridge-standard',
    category: 'refrigeration',
    name: 'Refrigerator',
    variant: 'Standard Double Door (Inverter)',
    ratedPowerW: 150,
    powerFactor: 0.85,
    startupMultiplier: 2.5,
    startupDurationSec: 2,
    dutyCycle: 0.45,
    typicalHoursPerDay: 24,
    aliases: ['fridge', 'refrigerator', 'fridge standard', 'double door fridge', 'lg fridge'],
    source: 'Manufacturer Tested Specification (Haier / Thermocool / LG)',
    catalogVersion: '2.0.0',
  },
  {
    id: 'freezer-chest',
    category: 'refrigeration',
    name: 'Deep Freezer',
    variant: 'Chest Freezer 200L–350L',
    ratedPowerW: 220,
    powerFactor: 0.80,
    startupMultiplier: 3.0,
    startupDurationSec: 3,
    dutyCycle: 0.5,
    typicalHoursPerDay: 24,
    aliases: ['freezer', 'deep freezer', 'chest freezer', 'thermocool freezer'],
    source: 'Manufacturer Tested Specification (Thermocool / Nexus)',
    catalogVersion: '2.0.0',
  },

  // Kitchen & Home Appliances
  {
    id: 'microwave-standard',
    category: 'kitchen',
    name: 'Microwave Oven',
    variant: 'Standard 800W–1200W',
    ratedPowerW: 1200,
    powerFactor: 0.95,
    startupMultiplier: 1.1,
    startupDurationSec: 1,
    dutyCycle: 1.0,
    typicalHoursPerDay: 0.3,
    aliases: ['microwave', 'microwave oven'],
    source: 'Standard Appliance Rating',
    catalogVersion: '2.0.0',
  },
  {
    id: 'kettle-electric',
    category: 'kitchen',
    name: 'Electric Kettle',
    variant: 'Rapid Boil 1.7L',
    ratedPowerW: 1800,
    powerFactor: 1.0,
    startupMultiplier: 1.0,
    startupDurationSec: 0,
    dutyCycle: 1.0,
    typicalHoursPerDay: 0.25,
    aliases: ['kettle', 'electric kettle', 'hot water kettle'],
    source: 'Standard Appliance Rating',
    catalogVersion: '2.0.0',
  },
  {
    id: 'washing-machine-auto',
    category: 'laundry',
    name: 'Washing Machine',
    variant: 'Front Load Automatic (7kg–9kg)',
    ratedPowerW: 600,
    powerFactor: 0.85,
    startupMultiplier: 2.0,
    startupDurationSec: 2,
    dutyCycle: 0.7,
    typicalHoursPerDay: 1,
    aliases: ['washing machine', 'washer', 'laundry machine'],
    source: 'Manufacturer Specification (Samsung / LG)',
    catalogVersion: '2.0.0',
  },

  // Computing & Entertainment
  {
    id: 'tv-led-55',
    category: 'entertainment',
    name: 'Smart TV',
    variant: '55" LED Smart TV',
    ratedPowerW: 110,
    powerFactor: 0.95,
    startupMultiplier: 1.1,
    startupDurationSec: 1,
    dutyCycle: 1.0,
    typicalHoursPerDay: 6,
    aliases: ['tv', 'television', 'smart tv', '55 inch tv', 'led tv'],
    source: 'Standard Appliance Rating',
    catalogVersion: '2.0.0',
  },
  {
    id: 'computing-desktop',
    category: 'computing',
    name: 'Desktop Computer & Monitor',
    variant: 'Workstation PC + 24" Monitor',
    ratedPowerW: 250,
    powerFactor: 0.90,
    startupMultiplier: 1.2,
    startupDurationSec: 1,
    dutyCycle: 1.0,
    typicalHoursPerDay: 8,
    aliases: ['pc', 'desktop', 'computer', 'workstation'],
    source: 'Standard Appliance Rating',
    catalogVersion: '2.0.0',
  },
  {
    id: 'router-wifi',
    category: 'computing',
    name: 'WiFi Router & Fiber Modem',
    variant: 'Dual-Band Router',
    ratedPowerW: 18,
    powerFactor: 0.90,
    startupMultiplier: 1.0,
    startupDurationSec: 0,
    dutyCycle: 1.0,
    typicalHoursPerDay: 24,
    aliases: ['router', 'wifi', 'modem', 'internet router', 'wifi router'],
    source: 'Standard Appliance Rating',
    catalogVersion: '2.0.0',
  },

  // Lighting
  {
    id: 'lighting-led-pack',
    category: 'lighting',
    name: 'LED Lighting',
    variant: '10× 9W High-Efficiency LED Bulbs',
    ratedPowerW: 90,
    powerFactor: 0.95,
    startupMultiplier: 1.0,
    startupDurationSec: 0,
    dutyCycle: 1.0,
    typicalHoursPerDay: 8,
    aliases: ['lights', 'led lights', 'lighting', 'bulbs'],
    source: 'Standard Appliance Rating',
    catalogVersion: '2.0.0',
    defaultPriority: 'CRITICAL',
    isDaytimeShiftable: false,
  },

  // Security & Telecom
  {
    id: 'cctv-system',
    category: 'security',
    name: 'CCTV Security System',
    variant: '8-Channel NVR + Cameras + Monitor',
    ratedPowerW: 80,
    powerFactor: 0.90,
    startupMultiplier: 1.0,
    startupDurationSec: 0,
    dutyCycle: 1.0,
    typicalHoursPerDay: 24,
    aliases: ['cctv', 'security camera', 'cctv cameras', 'nvr', 'dvr', 'security system'],
    source: 'Hikvision / Dahua Manufacturer Spec',
    catalogVersion: '3.0.0',
    defaultPriority: 'CRITICAL',
    isDaytimeShiftable: false,
  },
  {
    id: 'starlink-terminal',
    category: 'computing',
    name: 'Starlink Satellite Internet',
    variant: 'Standard Dish + Wi-Fi 6 Router',
    ratedPowerW: 65,
    powerFactor: 0.95,
    startupMultiplier: 1.2,
    startupDurationSec: 2,
    dutyCycle: 1.0,
    typicalHoursPerDay: 24,
    aliases: ['starlink', 'satellite internet', 'starlink dish', 'spacex starlink'],
    source: 'Starlink Technical Datasheet',
    catalogVersion: '3.0.0',
    defaultPriority: 'CRITICAL',
    isDaytimeShiftable: false,
  },

  // Laundry & Heating
  {
    id: 'washing-machine-auto',
    category: 'laundry',
    name: 'Washing Machine',
    variant: 'Front Load Automatic 8kg (Inverter)',
    ratedPowerW: 500,
    powerFactor: 0.85,
    startupMultiplier: 2.0,
    startupDurationSec: 2,
    dutyCycle: 0.7,
    typicalHoursPerDay: 1.5,
    aliases: ['washing machine', 'washer', 'front load washer', 'inverter washing machine'],
    source: 'LG / Samsung Manufacturer Testing',
    catalogVersion: '3.0.0',
    defaultPriority: 'FLEXIBLE',
    isDaytimeShiftable: true,
  },
  {
    id: 'pressing-iron-dry',
    category: 'general',
    name: 'Electric Pressing Iron',
    variant: 'Dry / Steam Iron 1200W–1600W',
    ratedPowerW: 1200,
    powerFactor: 1.0,
    startupMultiplier: 1.0,
    startupDurationSec: 0,
    dutyCycle: 0.6,
    typicalHoursPerDay: 1.0,
    aliases: ['iron', 'pressing iron', 'flat iron', 'electric iron', 'clothes iron'],
    source: 'Standard Appliance Rating (Philips / Binatone)',
    catalogVersion: '3.0.0',
    defaultPriority: 'FLEXIBLE',
    isDaytimeShiftable: true,
  },
  {
    id: 'water-heater-instant',
    category: 'water_heating',
    name: 'Water Heater',
    variant: 'Instant Point-of-Use Shower Heater',
    ratedPowerW: 3000,
    powerFactor: 1.0,
    startupMultiplier: 1.0,
    startupDurationSec: 0,
    dutyCycle: 1.0,
    typicalHoursPerDay: 0.5,
    aliases: ['water heater', 'instant water heater', 'shower heater', 'ariston'],
    source: 'Standard Rating (Ariston / Thermocool)',
    catalogVersion: '3.0.0',
    defaultPriority: 'NON_CRITICAL',
    isDaytimeShiftable: true,
  },
];


/**
 * Searches appliance catalog by query term and optional category filter
 */
export function searchApplianceCatalog(query: string, category?: string): CatalogApplianceItem[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery && !category) return APPLIANCE_CATALOG.slice(0, 10);

  return APPLIANCE_CATALOG.filter((item) => {
    const matchesCategory = !category || item.category === category;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;

    const matchesName = item.name.toLowerCase().includes(normalizedQuery);
    const matchesVariant = item.variant.toLowerCase().includes(normalizedQuery);
    const matchesAlias = item.aliases.some((alias) => alias.toLowerCase().includes(normalizedQuery));

    return matchesName || matchesVariant || matchesAlias;
  });
}

/**
 * Automatic Appliance Recognition Engine
 * Resolves user input strings to canonical catalog items or returns resolution status.
 */
export function resolveApplianceInput(inputString: string): {
  status: 'EXACT_MATCH' | 'AMBIGUOUS_MATCH' | 'NOT_FOUND';
  matches: CatalogApplianceItem[];
  exactMatch?: CatalogApplianceItem;
} {
  const cleanInput = inputString.trim().toLowerCase();
  if (!cleanInput) {
    return { status: 'NOT_FOUND', matches: [] };
  }

  const directMatches = APPLIANCE_CATALOG.filter((item) =>
    item.aliases.some((alias) => alias === cleanInput) ||
    item.id === cleanInput
  );

  if (directMatches.length === 1) {
    return {
      status: 'EXACT_MATCH',
      matches: directMatches,
      exactMatch: directMatches[0],
    };
  }

  const fuzzyMatches = searchApplianceCatalog(cleanInput);
  if (fuzzyMatches.length === 1) {
    return {
      status: 'EXACT_MATCH',
      matches: fuzzyMatches,
      exactMatch: fuzzyMatches[0],
    };
  } else if (fuzzyMatches.length > 1) {
    return {
      status: 'AMBIGUOUS_MATCH',
      matches: fuzzyMatches,
    };
  }

  return { status: 'NOT_FOUND', matches: [] };
}

/**
 * Converts a catalog appliance item into the structured enterprise appliance model.
 */
export function toStructuredApplianceModel(
  item: CatalogApplianceItem,
  customQuantity = 1,
  customHours?: number
): StructuredApplianceModel {
  const loadType: LoadElectricalType =
    item.loadType ||
    (item.category === 'air_conditioning' || item.category === 'pumping'
      ? 'INDUCTIVE_MOTOR'
      : item.category === 'kitchen' || item.category === 'water_heating'
      ? 'HEATING'
      : item.category === 'computing' || item.category === 'entertainment'
      ? 'ELECTRONIC'
      : 'RESISTIVE');

  const operatingHours = customHours !== undefined ? Math.min(Math.max(customHours, 0.1), 24) : item.typicalHoursPerDay;
  const startingWatts = item.startingPowerW || Math.round(item.ratedPowerW * (item.startupMultiplier || 1.0));
  const typicalOperatingWatts = Math.round(item.ratedPowerW * (item.dutyCycle || 1.0));

  return {
    appliance_id: item.id,
    name: `${item.name}${item.variant ? ` (${item.variant})` : ''}`,
    category: item.category,
    loadType,
    ratedWatts: item.ratedPowerW,
    startingWatts,
    typicalOperatingWatts,
    dutyCycle: item.dutyCycle,
    typicalHoursPerDay: operatingHours,
    quantity: Math.max(customQuantity, 1),
    simultaneityFactor: item.simultaneityFactor || (customQuantity > 2 ? 0.75 : 1.0),
    powerFactor: item.powerFactor,
    voltage: item.voltage ?? 230,
    isDaytimeShiftable: item.isDaytimeShiftable,
    isCritical: item.defaultPriority === 'CRITICAL',

    // Compatibility aliases
    default_watts: item.ratedPowerW,
    min_watts: item.minWatts ?? Math.round(item.ratedPowerW * 0.7),
    max_watts: item.maxWatts ?? Math.round(item.ratedPowerW * 1.3),
    typical_hours: operatingHours,
    duty_cycle: item.dutyCycle,
    surge_multiplier: item.startupMultiplier,
    source: item.source,
    confidence: 'VERIFIED',
    updated_at: '2026-01-01T00:00:00Z',
  };
}

/**
 * Creates a manual, user-defined appliance model when an appliance is not in the database.
 * Ensures users are never blocked from entering custom loads with realistic electrical dynamics.
 */
export function createManualAppliance(params: {
  name: string;
  ratedWatts: number;
  startingWatts?: number;
  quantity?: number;
  hoursPerDay?: number;
  surgeMultiplier?: number;
  dutyCycle?: number;
  simultaneityFactor?: number;
  powerFactor?: number;
  category?: string;
  loadType?: LoadElectricalType;
  voltage?: number;
}): StructuredApplianceModel {
  const rated = Math.max(Number(params.ratedWatts) || 100, 1);
  const surgeMult = Math.max(Number(params.surgeMultiplier) || 1.0, 1.0);
  const starting = params.startingWatts ? Math.max(Number(params.startingWatts), rated) : Math.round(rated * surgeMult);
  const duty = Math.min(Math.max(Number(params.dutyCycle) || 1.0, 0.05), 1.0);
  const pf = Math.min(Math.max(Number(params.powerFactor) || 0.90, 0.5), 1.0);
  const qty = Math.max(Number(params.quantity) || 1, 1);
  const hours = Math.min(Math.max(Number(params.hoursPerDay) || 4, 0.1), 24);
  const sim = params.simultaneityFactor !== undefined ? Math.min(Math.max(params.simultaneityFactor, 0.1), 1.0) : (qty > 2 ? 0.75 : 1.0);

  const loadType: LoadElectricalType =
    params.loadType ||
    (surgeMult > 1.8 ? 'INDUCTIVE_MOTOR' : duty < 0.7 ? 'INTERMITTENT' : 'RESISTIVE');

  return {
    appliance_id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: params.name.trim() || 'Custom Equipment',
    category: params.category || 'general',
    loadType,
    ratedWatts: rated,
    startingWatts: starting,
    typicalOperatingWatts: Math.round(rated * duty),
    dutyCycle: duty,
    typicalHoursPerDay: hours,
    quantity: qty,
    simultaneityFactor: sim,
    powerFactor: pf,
    voltage: params.voltage || 230,

    // Compatibility aliases
    default_watts: rated,
    min_watts: Math.round(rated * 0.8),
    max_watts: Math.round(rated * 1.5),
    typical_hours: hours,
    duty_cycle: duty,
    surge_multiplier: surgeMult,
    source: 'USER_SUPPLIED_MANUAL_ENTRY',
    confidence: 'USER_DEFINED',
    updated_at: new Date().toISOString(),
  };
}
