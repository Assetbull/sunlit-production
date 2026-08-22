/**
 * V3 Equipment Repository Interface
 * Sunlit Enterprise Engineering Platform
 *
 * Thin abstraction over equipment catalog data.
 * Current implementation: MockRepository backed by static catalog.
 * Future implementation: DatabaseRepository backed by Supabase.
 *
 * The calculation engine MUST NOT depend on database calls directly.
 * All equipment lookups flow through this interface.
 */

import {
  PvModuleCatalogItem,
  InverterCatalogItem,
  BatteryCatalogItem,
  CableCatalogItem,
} from '../../catalog/equipmentCatalog';

export interface IEquipmentRepository {
  /** Returns all PV modules in the catalog */
  getAllPvModules(): PvModuleCatalogItem[];

  /** Returns a PV module by ID, or null if not found */
  getPvModuleById(id: string): PvModuleCatalogItem | null;

  /** Returns PV modules matching optional wattage filter */
  getPvModulesByWattage(wattageW: number): PvModuleCatalogItem[];

  /** Returns all inverters in the catalog */
  getAllInverters(): InverterCatalogItem[];

  /** Returns an inverter by ID, or null if not found */
  getInverterById(id: string): InverterCatalogItem | null;

  /** Returns inverters that satisfy minimum kVA and surge requirements */
  getInvertersByCapacity(params: {
    minKva: number;
    surgeKva: number;
    phaseType?: 'single-phase' | 'three-phase';
  }): InverterCatalogItem[];

  /** Returns all batteries in the catalog */
  getAllBatteries(): BatteryCatalogItem[];

  /** Returns a battery by ID, or null if not found */
  getBatteryById(id: string): BatteryCatalogItem | null;

  /** Returns batteries matching optional chemistry filter */
  getBatteriesByChemistry(chemistry: BatteryCatalogItem['chemistry']): BatteryCatalogItem[];

  /** Returns all cables in the catalog */
  getAllCables(): CableCatalogItem[];

  /** Returns cables of specified material, sorted by cross-section ascending */
  getCablesByMaterial(material: 'copper' | 'aluminum'): CableCatalogItem[];
}
