/**
 * EPC Dashboard API Service
 * 
 * Client-side functions for fetching EPC-specific dashboard data.
 * All calls go through the authenticated API layer.
 * 
 * Feature: EPC Dashboard Enterprise System
 * Task: 4.2 Enhance installer dashboard page with EPC features
 */

import { EPCDashboardData } from '../types';

interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function apiCall<T>(url: string, options?: RequestInit): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.error || `HTTP ${res.status}` };
    }
    return { success: true, data: json.data as T };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Network error' };
  }
}

/**
 * Fetch EPC dashboard data
 */
export async function fetchEPCDashboard(): Promise<ApiResult<EPCDashboardData>> {
  return apiCall<EPCDashboardData>('/api/v1/dashboard/epc');
}
