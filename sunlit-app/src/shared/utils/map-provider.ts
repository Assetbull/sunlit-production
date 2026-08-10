/**
 * Map Provider Abstraction
 * 
 * Architecture decision: Map UI/interaction layer is SEPARATED from 
 * map tile provider. The installer directory domain is NOT dependent 
 * on Leaflet-specific data structures.
 * 
 * Phase 1: Leaflet (no API key required)
 * Future: Mapbox or Google Maps via environment configuration
 * 
 * IMPORTANT: OpenStreetMap tiles are NOT suitable as unlimited production
 * tile service. A production tile provider should be configured via
 * NEXT_PUBLIC_MAP_TILE_URL and NEXT_PUBLIC_MAP_TILE_ATTRIBUTION env vars.
 */

// =============================================
// Provider-Agnostic Types
// =============================================

export interface MapCoordinates {
  latitude: number;
  longitude: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapMarker {
  id: string;
  coordinates: MapCoordinates;
  label?: string;
  popupContent?: string;
  iconUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface MapCluster {
  id: string;
  coordinates: MapCoordinates;
  count: number;
  markers: MapMarker[];
}

export interface MapViewport {
  center: MapCoordinates;
  zoom: number;
  bounds?: MapBounds;
}

export interface MapSearchResult {
  coordinates: MapCoordinates;
  displayName: string;
  state?: string;
  city?: string;
}

// =============================================
// Tile Configuration
// =============================================

export interface TileLayerConfig {
  url: string;
  attribution: string;
  maxZoom: number;
  minZoom: number;
}

/**
 * Get tile layer configuration from environment or defaults.
 * Production deployments should set NEXT_PUBLIC_MAP_TILE_URL 
 * to a commercial tile provider.
 */
export function getTileConfig(): TileLayerConfig {
  return {
    url: process.env.NEXT_PUBLIC_MAP_TILE_URL 
      || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: process.env.NEXT_PUBLIC_MAP_TILE_ATTRIBUTION
      || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
    minZoom: 4,
  };
}

// =============================================
// Map Provider Interface
// =============================================

/**
 * Provider-agnostic map interface.
 * The directory domain interacts with this interface only —
 * never with Leaflet/Mapbox/Google Maps directly.
 */
export interface IMapProvider {
  /** Set the viewport center and zoom */
  setViewport(viewport: MapViewport): void;
  
  /** Add markers to the map */
  setMarkers(markers: MapMarker[]): void;
  
  /** Get current viewport bounds */
  getBounds(): MapBounds | null;
  
  /** Fit the map to show all given markers */
  fitToMarkers(markers: MapMarker[], padding?: number): void;
  
  /** Geocode an address to coordinates */
  geocode?(query: string): Promise<MapSearchResult[]>;
  
  /** Clean up map resources */
  destroy(): void;
}

// =============================================
// Default Map Centers (Nigeria)
// =============================================

export const NIGERIA_CENTER: MapCoordinates = {
  latitude: 9.0820,
  longitude: 8.6753,
};

export const LAGOS_CENTER: MapCoordinates = {
  latitude: 6.5244,
  longitude: 3.3792,
};

export const ABUJA_CENTER: MapCoordinates = {
  latitude: 9.0579,
  longitude: 7.4951,
};

export const DEFAULT_ZOOM = {
  country: 6,
  state: 10,
  city: 13,
  neighborhood: 15,
} as const;

/**
 * Get the map center for a given state.
 */
export function getStateCenterCoordinates(stateSlug: string): MapCoordinates {
  const centers: Record<string, MapCoordinates> = {
    'lagos': LAGOS_CENTER,
    'abuja': ABUJA_CENTER,
    'ogun': { latitude: 7.1608, longitude: 3.3486 },
    'rivers': { latitude: 4.8156, longitude: 7.0498 },
    'kano': { latitude: 12.0022, longitude: 8.5920 },
  };
  return centers[stateSlug] || NIGERIA_CENTER;
}
