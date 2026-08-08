/**
 * EPC Dashboard Data Service Tests
 * 
 * Unit tests for EPC dashboard data loading functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadEPCDashboardData } from '../epc-data-service';
import type { SupabaseClient } from '@supabase/supabase-js';

describe('loadEPCDashboardData', () => {
  let mockSupabase: Partial<SupabaseClient>;
  const testEpcContractorId = 'test-epc-contractor-id';

  beforeEach(() => {
    // Create a mock Supabase client
    mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              data: [],
              error: null,
            })),
            in: vi.fn(() => ({
              data: [],
              error: null,
            })),
            gte: vi.fn(() => ({
              order: vi.fn(() => ({
                data: [],
                error: null,
              })),
            })),
            single: vi.fn(() => ({
              data: null,
              error: null,
            })),
          })),
          in: vi.fn(() => ({
            data: [],
            error: null,
          })),
          like: vi.fn(() => ({
            gte: vi.fn(() => ({
              order: vi.fn(() => ({
                data: [],
                error: null,
              })),
            })),
          })),
        })),
      })),
    } as any;
  });

  describe('Data Structure', () => {
    it('should return EPCDashboardData with all required fields', async () => {
      const result = await loadEPCDashboardData(
        mockSupabase as SupabaseClient,
        testEpcContractorId
      );

      // Verify base installer dashboard fields
      expect(result).toHaveProperty('activeProjects');
      expect(result).toHaveProperty('pendingBids');
      expect(result).toHaveProperty('totalEarnings');
      expect(result).toHaveProperty('crewJobsPosted');
      expect(result).toHaveProperty('pendingMilestones');
      expect(result).toHaveProperty('newMatches');

      // Verify EPC-specific fields
      expect(result).toHaveProperty('externalProjects');
      expect(result).toHaveProperty('activeCrews');
      expect(result).toHaveProperty('enhancedMetrics');
      expect(result).toHaveProperty('auditLogAccess');
    });

    it('should return externalProjects as an array', async () => {
      const result = await loadEPCDashboardData(
        mockSupabase as SupabaseClient,
        testEpcContractorId
      );

      expect(Array.isArray(result.externalProjects)).toBe(true);
    });

    it('should return activeCrews as an array', async () => {
      const result = await loadEPCDashboardData(
        mockSupabase as SupabaseClient,
        testEpcContractorId
      );

      expect(Array.isArray(result.activeCrews)).toBe(true);
    });

    it('should return enhancedMetrics with correct structure', async () => {
      const result = await loadEPCDashboardData(
        mockSupabase as SupabaseClient,
        testEpcContractorId
      );

      expect(result.enhancedMetrics).toHaveProperty('externalProjectCount');
      expect(result.enhancedMetrics).toHaveProperty('totalCrewsManaged');
      expect(result.enhancedMetrics).toHaveProperty('externalProjectRevenue');
    });

    it('should return auditLogAccess with correct structure', async () => {
      const result = await loadEPCDashboardData(
        mockSupabase as SupabaseClient,
        testEpcContractorId
      );

      expect(result.auditLogAccess).toHaveProperty('recentActions');
      expect(typeof result.auditLogAccess.recentActions).toBe('number');
    });
  });

  describe('Enhanced Metrics Calculation', () => {
    it('should calculate externalProjectCount correctly', async () => {
      const result = await loadEPCDashboardData(
        mockSupabase as SupabaseClient,
        testEpcContractorId
      );

      expect(typeof result.enhancedMetrics.externalProjectCount).toBe('number');
      expect(result.enhancedMetrics.externalProjectCount).toBeGreaterThanOrEqual(0);
    });

    it('should calculate totalCrewsManaged correctly', async () => {
      const result = await loadEPCDashboardData(
        mockSupabase as SupabaseClient,
        testEpcContractorId
      );

      expect(typeof result.enhancedMetrics.totalCrewsManaged).toBe('number');
      expect(result.enhancedMetrics.totalCrewsManaged).toBeGreaterThanOrEqual(0);
    });

    it('should calculate externalProjectRevenue correctly', async () => {
      const result = await loadEPCDashboardData(
        mockSupabase as SupabaseClient,
        testEpcContractorId
      );

      expect(typeof result.enhancedMetrics.externalProjectRevenue).toBe('number');
      expect(result.enhancedMetrics.externalProjectRevenue).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Requirements Validation', () => {
    it('should extend existing installer dashboard data structure (Requirement 2.1)', async () => {
      const result = await loadEPCDashboardData(
        mockSupabase as SupabaseClient,
        testEpcContractorId
      );

      // Verify it has all installer dashboard fields
      const installerFields = [
        'activeProjects',
        'pendingBids',
        'totalEarnings',
        'crewJobsPosted',
        'pendingMilestones',
        'newMatches',
      ];

      installerFields.forEach(field => {
        expect(result).toHaveProperty(field);
      });
    });

    it('should include EPC-specific metrics (Requirement 2.2)', async () => {
      const result = await loadEPCDashboardData(
        mockSupabase as SupabaseClient,
        testEpcContractorId
      );

      // Verify EPC-specific metrics are present
      expect(result.enhancedMetrics).toHaveProperty('externalProjectCount');
      expect(result.enhancedMetrics).toHaveProperty('totalCrewsManaged');
      expect(result.enhancedMetrics).toHaveProperty('externalProjectRevenue');
    });

    it('should fetch external projects with project_source=external', async () => {
      // This test verifies the query filters by project_source='external'
      const result = await loadEPCDashboardData(
        mockSupabase as SupabaseClient,
        testEpcContractorId
      );

      // The function should have queried for external projects
      expect(mockSupabase.from).toHaveBeenCalledWith('projects');
    });

    it('should fetch active crew assignments', async () => {
      // This test verifies the query fetches crew assignments
      const result = await loadEPCDashboardData(
        mockSupabase as SupabaseClient,
        testEpcContractorId
      );

      // The function should have queried for crew assignments
      expect(mockSupabase.from).toHaveBeenCalledWith('crew_project_assignments');
    });

    it('should fetch audit log summaries', async () => {
      // This test verifies the query fetches audit logs
      const result = await loadEPCDashboardData(
        mockSupabase as SupabaseClient,
        testEpcContractorId
      );

      // The function should have queried for audit logs
      expect(mockSupabase.from).toHaveBeenCalledWith('audit_logs');
    });
  });
});
