/**
 * V3 Location Repository Interface
 * Sunlit Enterprise Engineering Platform
 *
 * Thin abstraction over location solar metadata.
 * Current: MockRepository backed by static catalog.
 * Future: DatabaseRepository backed by Supabase with dynamic PSH data.
 */

import { LocationSolarMetadata } from '../../catalog/equipmentCatalog';

export interface ILocationRepository {
  /** Returns all locations in the catalog */
  getAllLocations(): LocationSolarMetadata[];

  /** Returns a location by exact name (case-insensitive), or null */
  getLocationByName(name: string): LocationSolarMetadata | null;

  /** Returns a location by ID, or null */
  getLocationById(id: string): LocationSolarMetadata | null;

  /** Returns the default location (Lagos) when none specified */
  getDefaultLocation(): LocationSolarMetadata;

  /** Returns all locations in a given state */
  getLocationsByState(state: string): LocationSolarMetadata[];
}
