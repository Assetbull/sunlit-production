/**
 * V3 Mock Repositories
 * Sunlit Enterprise Engineering Platform
 *
 * In-memory implementations of IEquipmentRepository and ILocationRepository
 * backed by the existing static catalog data.
 *
 * These are used during development and testing.
 * Swap to DatabaseRepository implementations when Supabase is connected.
 *
 * NEVER modify catalog data through these repositories.
 * They are READ-ONLY views of the static catalog.
 */

import {
  PV_MODULE_CATALOG,
  INVERTER_CATALOG,
  BATTERY_CATALOG,
  CABLE_CATALOG,
  LOCATION_SOLAR_CATALOG,
  PvModuleCatalogItem,
  InverterCatalogItem,
  BatteryCatalogItem,
  CableCatalogItem,
  LocationSolarMetadata,
} from '../../catalog/equipmentCatalog';
import { IEquipmentRepository } from './IEquipmentRepository';
import { ILocationRepository } from './ILocationRepository';

// ============================================================
// MOCK EQUIPMENT REPOSITORY
// ============================================================

export class MockEquipmentRepository implements IEquipmentRepository {
  getAllPvModules(): PvModuleCatalogItem[] {
    return [...PV_MODULE_CATALOG];
  }

  getPvModuleById(id: string): PvModuleCatalogItem | null {
    return PV_MODULE_CATALOG.find((m) => m.id === id) ?? null;
  }

  getPvModulesByWattage(wattageW: number): PvModuleCatalogItem[] {
    return PV_MODULE_CATALOG.filter((m) => m.ratedPowerW === wattageW);
  }

  getAllInverters(): InverterCatalogItem[] {
    return [...INVERTER_CATALOG];
  }

  getInverterById(id: string): InverterCatalogItem | null {
    return INVERTER_CATALOG.find((inv) => inv.id === id) ?? null;
  }

  getInvertersByCapacity(params: {
    minKva: number;
    surgeKva: number;
    phaseType?: 'single-phase' | 'three-phase';
  }): InverterCatalogItem[] {
    return INVERTER_CATALOG.filter(
      (inv) =>
        inv.ratedKva >= params.minKva &&
        inv.surgeKva >= params.surgeKva &&
        (!params.phaseType || inv.phaseType === params.phaseType)
    );
  }

  getAllBatteries(): BatteryCatalogItem[] {
    return [...BATTERY_CATALOG];
  }

  getBatteryById(id: string): BatteryCatalogItem | null {
    return BATTERY_CATALOG.find((b) => b.id === id) ?? null;
  }

  getBatteriesByChemistry(chemistry: BatteryCatalogItem['chemistry']): BatteryCatalogItem[] {
    return BATTERY_CATALOG.filter((b) => b.chemistry === chemistry);
  }

  getAllCables(): CableCatalogItem[] {
    return [...CABLE_CATALOG].sort((a, b) => a.crossSectionMm2 - b.crossSectionMm2);
  }

  getCablesByMaterial(material: 'copper' | 'aluminum'): CableCatalogItem[] {
    return CABLE_CATALOG
      .filter((c) => c.conductorMaterial === material)
      .sort((a, b) => a.crossSectionMm2 - b.crossSectionMm2);
  }
}

// ============================================================
// MOCK LOCATION REPOSITORY
// ============================================================

export class MockLocationRepository implements ILocationRepository {
  private readonly defaultLocation: LocationSolarMetadata = LOCATION_SOLAR_CATALOG[0]; // Lagos

  getAllLocations(): LocationSolarMetadata[] {
    return [...LOCATION_SOLAR_CATALOG];
  }

  getLocationByName(name: string): LocationSolarMetadata | null {
    const normalized = name.trim().toLowerCase();
    return (
      LOCATION_SOLAR_CATALOG.find(
        (l) => l.name.toLowerCase() === normalized || l.locationId === normalized
      ) ?? null
    );
  }

  getLocationById(id: string): LocationSolarMetadata | null {
    return LOCATION_SOLAR_CATALOG.find((l) => l.locationId === id) ?? null;
  }

  getDefaultLocation(): LocationSolarMetadata {
    return this.defaultLocation;
  }

  getLocationsByState(state: string): LocationSolarMetadata[] {
    const normalized = state.trim().toLowerCase();
    return LOCATION_SOLAR_CATALOG.filter(
      (l) => l.state.toLowerCase().includes(normalized)
    );
  }
}

// ============================================================
// SINGLETON INSTANCES
// Used by default throughout the engineering engine.
// Swap these for DatabaseRepository instances when DB is connected.
// ============================================================

export const equipmentRepository: IEquipmentRepository = new MockEquipmentRepository();
export const locationRepository: ILocationRepository = new MockLocationRepository();
