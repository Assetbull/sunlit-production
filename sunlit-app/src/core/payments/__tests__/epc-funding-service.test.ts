/**
 * EPC Funding Service Tests
 * 
 * Integration tests for EPC external project funding service.
 * 
 * Feature: EPC Dashboard Enterprise System
 * Task: 11.1 Implement EPC external project funding service
 * Requirements: 7.1, 7.2, 10.1, 10.2
 * 
 * Test Coverage:
 * - Payment mode determination (escrow vs direct)
 * - Funding validation
 * - Escrow integration
 * - Event emission
 * - Error handling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  EPCFundingService,
  determinePaymentMode,
  EPCFundingValidationError,
  EscrowIntegrationError,
  InsufficientPermissionsError,
} from '../epc-funding-service';
import type { FundExternalProjectParams } from '../epc-funding-service';

// Mock dependencies
const mockDataService = {
  findOne: vi.fn(),
  findMany: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
};

const mockEventBus = {
  emit: vi.fn(),
};

const mockAuditLogger = {
  log: vi.fn(),
};

describe('EPC Funding Service', () => {
  let fundingService: EPCFundingService;

  beforeEach(() => {
    vi.clearAllMocks();
    fundingService = new EPCFundingService(
      mockDataService as any,
      mockEventBus as any,
      mockAuditLogger as any
    );
  });

  describe('determinePaymentMode', () => {
    it('should return "escrow" for amounts > 5,000,000 NGN', () => {
      expect(determinePaymentMode(5_000_001)).toBe('escrow');
      expect(determinePaymentMode(10_000_000)).toBe('escrow');
      expect(determinePaymentMode(100_000_000)).toBe('escrow');
    });

    it('should return "direct" for amounts <= 5,000,000 NGN', () => {
      expect(determinePaymentMode(5_000_000)).toBe('direct');
      expect(determinePaymentMode(1_000_000)).toBe('direct');
      expect(determinePaymentMode(100_000)).toBe('direct');
    });
  });

  describe('fundExternalProject', () => {
    const validFundingParams: FundExternalProjectParams = {
      epc_contractor_id: 'epc-123',
      project_id: 'project-456',
      funding_amount: 10_000_000,
      milestone_schedule: [
        { milestone_id: 'milestone-1', amount: 5_000_000 },
        { milestone_id: 'milestone-2', amount: 5_000_000 },
      ],
      commission_agreement: {
        commission_rate: 5,
        commission_type: 'percentage',
        payment_terms: 'Net 30 days',
      },
    };

    const auditContext = {
      user_id: 'epc-123',
      correlation_id: 'corr-789',
      ip_address: '127.0.0.1',
    };

    it('should successfully fund external project in escrow mode', async () => {
      // Mock project lookup
      mockDataService.findOne.mockResolvedValueOnce({
        id: 'project-456',
        project_source: 'external',
        creator_id: 'epc-123',
      });

      // Mock no existing funding
      mockDataService.findOne.mockResolvedValueOnce(null);

      // Mock milestones lookup
      mockDataService.findMany.mockResolvedValueOnce([
        { id: 'milestone-1', project_id: 'project-456' },
        { id: 'milestone-2', project_id: 'project-456' },
      ]);

      // Mock funding record creation
      mockDataService.create.mockResolvedValueOnce({
        id: 'funding-123',
        project_id: 'project-456',
        epc_contractor_id: 'epc-123',
        funding_amount: 10_000_000,
        escrow_status: 'pending',
        milestone_schedule: validFundingParams.milestone_schedule,
        commission_agreement: validFundingParams.commission_agreement,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // Mock escrow record creation
      mockDataService.create.mockResolvedValue({
        id: 'escrow-1',
        project_id: 'project-456',
        milestone_id: 'milestone-1',
        amount: 5_000_000,
        status: 'pending',
      });

      // Mock project update
      mockDataService.update.mockResolvedValueOnce({});

      const result = await fundingService.fundExternalProject(
        validFundingParams,
        auditContext
      );

      expect(result.success).toBe(true);
      expect(result.payment_mode).toBe('escrow');
      expect(result.escrow_records).toHaveLength(2);
      expect(mockEventBus.emit).toHaveBeenCalledWith(
        'external_project_funded',
        expect.objectContaining({
          project_id: 'project-456',
          funding_amount: 10_000_000,
          payment_mode: 'escrow',
        })
      );
    });

    it('should successfully fund external project in direct mode', async () => {
      const directFundingParams = {
        ...validFundingParams,
        funding_amount: 1_000_000,
        milestone_schedule: [
          { milestone_id: 'milestone-1', amount: 500_000 },
          { milestone_id: 'milestone-2', amount: 500_000 },
        ],
      };

      // Mock project lookup
      mockDataService.findOne.mockResolvedValueOnce({
        id: 'project-456',
        project_source: 'external',
        creator_id: 'epc-123',
      });

      // Mock no existing funding
      mockDataService.findOne.mockResolvedValueOnce(null);

      // Mock milestones lookup
      mockDataService.findMany.mockResolvedValueOnce([
        { id: 'milestone-1', project_id: 'project-456' },
        { id: 'milestone-2', project_id: 'project-456' },
      ]);

      // Mock funding record creation
      mockDataService.create.mockResolvedValueOnce({
        id: 'funding-123',
        project_id: 'project-456',
        epc_contractor_id: 'epc-123',
        funding_amount: 1_000_000,
        escrow_status: 'released',
        milestone_schedule: directFundingParams.milestone_schedule,
        commission_agreement: directFundingParams.commission_agreement,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // Mock project update
      mockDataService.update.mockResolvedValueOnce({});

      const result = await fundingService.fundExternalProject(
        directFundingParams,
        auditContext
      );

      expect(result.success).toBe(true);
      expect(result.payment_mode).toBe('direct');
      expect(result.escrow_records).toBeUndefined();
    });

    it('should throw InsufficientPermissionsError if user does not match contractor', async () => {
      const invalidAuditContext = {
        ...auditContext,
        user_id: 'different-user',
      };

      await expect(
        fundingService.fundExternalProject(validFundingParams, invalidAuditContext)
      ).rejects.toThrow(InsufficientPermissionsError);
    });

    it('should throw EPCFundingValidationError if project not found', async () => {
      mockDataService.findOne.mockResolvedValueOnce(null);

      await expect(
        fundingService.fundExternalProject(validFundingParams, auditContext)
      ).rejects.toThrow(EPCFundingValidationError);
    });

    it('should throw EPCFundingValidationError if project is not external', async () => {
      mockDataService.findOne.mockResolvedValueOnce({
        id: 'project-456',
        project_source: 'marketplace',
        creator_id: 'epc-123',
      });

      await expect(
        fundingService.fundExternalProject(validFundingParams, auditContext)
      ).rejects.toThrow(EPCFundingValidationError);
    });

    it('should throw InsufficientPermissionsError if contractor does not own project', async () => {
      mockDataService.findOne.mockResolvedValueOnce({
        id: 'project-456',
        project_source: 'external',
        creator_id: 'different-contractor',
      });

      await expect(
        fundingService.fundExternalProject(validFundingParams, auditContext)
      ).rejects.toThrow(InsufficientPermissionsError);
    });

    it('should throw EPCFundingValidationError if funding amount does not match milestone sum', async () => {
      const invalidFundingParams = {
        ...validFundingParams,
        funding_amount: 8_000_000, // Does not match milestone sum
      };

      mockDataService.findOne.mockResolvedValueOnce({
        id: 'project-456',
        project_source: 'external',
        creator_id: 'epc-123',
      });

      mockDataService.findOne.mockResolvedValueOnce(null);

      mockDataService.findMany.mockResolvedValueOnce([
        { id: 'milestone-1', project_id: 'project-456' },
        { id: 'milestone-2', project_id: 'project-456' },
      ]);

      await expect(
        fundingService.fundExternalProject(invalidFundingParams, auditContext)
      ).rejects.toThrow(EPCFundingValidationError);
    });

    it('should throw EPCFundingValidationError if milestone IDs are invalid', async () => {
      mockDataService.findOne.mockResolvedValueOnce({
        id: 'project-456',
        project_source: 'external',
        creator_id: 'epc-123',
      });

      mockDataService.findOne.mockResolvedValueOnce(null);

      // Mock milestones lookup - only one milestone exists
      mockDataService.findMany.mockResolvedValueOnce([
        { id: 'milestone-1', project_id: 'project-456' },
      ]);

      await expect(
        fundingService.fundExternalProject(validFundingParams, auditContext)
      ).rejects.toThrow(EPCFundingValidationError);
    });

    it('should throw EPCFundingValidationError if project already has funding', async () => {
      mockDataService.findOne.mockResolvedValueOnce({
        id: 'project-456',
        project_source: 'external',
        creator_id: 'epc-123',
      });

      // Mock existing funding - this should be the second findOne call
      mockDataService.findOne.mockResolvedValueOnce({
        id: 'existing-funding',
        project_id: 'project-456',
      });

      await expect(
        fundingService.fundExternalProject(validFundingParams, auditContext)
      ).rejects.toThrow(EPCFundingValidationError);
    });
  });

  describe('getEPCFundingStatus', () => {
    it('should return comprehensive funding status for escrow mode', async () => {
      const projectId = 'project-456';

      // Mock funding record
      mockDataService.findOne.mockResolvedValueOnce({
        id: 'funding-123',
        project_id: projectId,
        epc_contractor_id: 'epc-123',
        funding_amount: 10_000_000,
        escrow_status: 'pending',
        milestone_schedule: [
          { milestone_id: 'milestone-1', amount: 5_000_000 },
          { milestone_id: 'milestone-2', amount: 5_000_000 },
        ],
        commission_agreement: {
          commission_rate: 5,
          commission_type: 'percentage',
          payment_terms: 'Net 30 days',
        },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      });

      // Mock escrow records
      mockDataService.findMany.mockResolvedValueOnce([
        {
          id: 'escrow-1',
          project_id: projectId,
          milestone_id: 'milestone-1',
          amount: 5_000_000,
          status: 'funded',
        },
        {
          id: 'escrow-2',
          project_id: projectId,
          milestone_id: 'milestone-2',
          amount: 5_000_000,
          status: 'held',
        },
      ]);

      const status = await fundingService.getEPCFundingStatus(projectId);

      expect(status.funding_id).toBe('funding-123');
      expect(status.payment_mode).toBe('escrow');
      expect(status.escrow_records).toHaveLength(2);
      expect(status.payment_completion_status.total_milestones).toBe(2);
      expect(status.payment_completion_status.funded_milestones).toBe(2);
      expect(status.payment_completion_status.released_milestones).toBe(0);
    });

    it('should throw EPCFundingValidationError if no funding found', async () => {
      mockDataService.findOne.mockResolvedValueOnce(null);

      await expect(
        fundingService.getEPCFundingStatus('project-456')
      ).rejects.toThrow(EPCFundingValidationError);
    });
  });

  describe('getPaymentVisibility', () => {
    it('should return comprehensive payment visibility for EPC contractor with multiple projects', async () => {
      const epcContractorId = 'epc-123';

      // Mock funding records for multiple projects
      mockDataService.findMany.mockResolvedValueOnce([
        {
          id: 'funding-1',
          project_id: 'project-1',
          epc_contractor_id: epcContractorId,
          funding_amount: 10_000_000,
          escrow_status: 'pending',
          milestone_schedule: [
            { milestone_id: 'milestone-1', amount: 5_000_000 },
            { milestone_id: 'milestone-2', amount: 5_000_000 },
          ],
          commission_agreement: {
            commission_rate: 5,
            commission_type: 'percentage',
            payment_terms: 'Net 30 days',
            platform_commission: 2,
            crew_commission: 1,
          },
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 'funding-2',
          project_id: 'project-2',
          epc_contractor_id: epcContractorId,
          funding_amount: 3_000_000,
          escrow_status: 'released',
          milestone_schedule: [
            { milestone_id: 'milestone-3', amount: 3_000_000 },
          ],
          commission_agreement: {
            commission_rate: 5,
            commission_type: 'percentage',
            payment_terms: 'Net 30 days',
            platform_commission: 2,
            crew_commission: 1,
          },
          created_at: '2024-01-02T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
        },
      ]);

      // Mock project details
      mockDataService.findOne
        .mockResolvedValueOnce({
          id: 'project-1',
          title: 'Solar Installation Project 1',
          project_source: 'external',
        })
        .mockResolvedValueOnce({
          id: 'project-2',
          title: 'Solar Installation Project 2',
          project_source: 'external',
        });

      // Mock escrow records for project 1
      mockDataService.findMany
        .mockResolvedValueOnce([
          {
            id: 'escrow-1',
            project_id: 'project-1',
            milestone_id: 'milestone-1',
            amount: 5_000_000,
            status: 'released',
          },
          {
            id: 'escrow-2',
            project_id: 'project-1',
            milestone_id: 'milestone-2',
            amount: 5_000_000,
            status: 'pending',
          },
        ])
        // Mock escrow records for project 2 (direct mode, no escrow)
        .mockResolvedValueOnce([]);

      const visibility = await fundingService.getPaymentVisibility(epcContractorId);

      // Verify overall structure
      expect(visibility.epc_contractor_id).toBe(epcContractorId);
      expect(visibility.project_payment_flows).toHaveLength(2);
      expect(visibility.generated_at).toBeDefined();

      // Verify revenue tracking
      expect(visibility.revenue_tracking.total_funded).toBe(13_000_000);
      expect(visibility.revenue_tracking.total_released).toBe(5_000_000);
      expect(visibility.revenue_tracking.total_pending).toBe(8_000_000);
      expect(visibility.revenue_tracking.total_projects).toBe(2);
      expect(visibility.revenue_tracking.active_projects).toBe(1);
      expect(visibility.revenue_tracking.completed_projects).toBe(1);

      // Verify escrow status summary
      expect(visibility.escrow_status_summary.pending).toBe(1);
      expect(visibility.escrow_status_summary.released).toBe(1);

      // Verify commission summary
      expect(visibility.commission_summary.total_commission_earned).toBeGreaterThan(0);
      expect(visibility.commission_summary.platform_commission_total).toBeGreaterThan(0);
      expect(visibility.commission_summary.crew_commission_total).toBeGreaterThan(0);

      // Verify project payment flows
      const project1Flow = visibility.project_payment_flows[0];
      expect(project1Flow.project_id).toBe('project-1');
      expect(project1Flow.project_title).toBe('Solar Installation Project 1');
      expect(project1Flow.payment_mode).toBe('escrow');
      expect(project1Flow.escrow_records).toHaveLength(2);
      expect(project1Flow.amounts.total).toBe(10_000_000);
      expect(project1Flow.amounts.released).toBe(5_000_000);
      expect(project1Flow.amounts.pending).toBe(5_000_000);
    });

    it('should return empty payment visibility for EPC contractor with no projects', async () => {
      const epcContractorId = 'epc-456';

      // Mock no funding records
      mockDataService.findMany.mockResolvedValueOnce([]);

      const visibility = await fundingService.getPaymentVisibility(epcContractorId);

      expect(visibility.epc_contractor_id).toBe(epcContractorId);
      expect(visibility.project_payment_flows).toHaveLength(0);
      expect(visibility.revenue_tracking.total_funded).toBe(0);
      expect(visibility.revenue_tracking.total_released).toBe(0);
      expect(visibility.revenue_tracking.total_pending).toBe(0);
      expect(visibility.revenue_tracking.total_projects).toBe(0);
    });

    it('should correctly calculate commission for released payments', async () => {
      const epcContractorId = 'epc-789';

      // Mock funding record with released payment
      mockDataService.findMany.mockResolvedValueOnce([
        {
          id: 'funding-1',
          project_id: 'project-1',
          epc_contractor_id: epcContractorId,
          funding_amount: 10_000_000,
          escrow_status: 'pending',
          milestone_schedule: [
            { milestone_id: 'milestone-1', amount: 10_000_000 },
          ],
          commission_agreement: {
            commission_rate: 5,
            commission_type: 'percentage',
            payment_terms: 'Net 30 days',
            platform_commission: 2,
            crew_commission: 1,
          },
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ]);

      // Mock project details
      mockDataService.findOne.mockResolvedValueOnce({
        id: 'project-1',
        title: 'Solar Installation Project',
        project_source: 'external',
      });

      // Mock escrow record with released status
      mockDataService.findMany.mockResolvedValueOnce([
        {
          id: 'escrow-1',
          project_id: 'project-1',
          milestone_id: 'milestone-1',
          amount: 10_000_000,
          status: 'released',
        },
      ]);

      const visibility = await fundingService.getPaymentVisibility(epcContractorId);

      const projectFlow = visibility.project_payment_flows[0];
      
      // Verify commission calculations
      expect(projectFlow.commission_calculation.commission_rate).toBe(5);
      expect(projectFlow.commission_calculation.earned).toBe(500_000); // 5% of 10M released
      expect(projectFlow.commission_calculation.platform_commission).toBe(200_000); // 2% of 10M total
      expect(projectFlow.commission_calculation.crew_commission).toBe(100_000); // 1% of 10M released
      
      // Net revenue = released - earned commission
      // = 10M - 500K = 9.5M
      expect(projectFlow.commission_calculation.net_revenue).toBe(9_500_000);
    });

    it('should handle direct payment mode correctly', async () => {
      const epcContractorId = 'epc-999';

      // Mock funding record with direct payment (amount <= 5M)
      mockDataService.findMany.mockResolvedValueOnce([
        {
          id: 'funding-1',
          project_id: 'project-1',
          epc_contractor_id: epcContractorId,
          funding_amount: 2_000_000,
          escrow_status: 'released',
          milestone_schedule: [
            { milestone_id: 'milestone-1', amount: 2_000_000 },
          ],
          commission_agreement: {
            commission_rate: 5,
            commission_type: 'percentage',
            payment_terms: 'Net 30 days',
            platform_commission: 2,
            crew_commission: 1,
          },
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ]);

      // Mock project details
      mockDataService.findOne.mockResolvedValueOnce({
        id: 'project-1',
        title: 'Small Solar Project',
        project_source: 'external',
      });

      // Mock no escrow records (direct mode)
      mockDataService.findMany.mockResolvedValueOnce([]);

      const visibility = await fundingService.getPaymentVisibility(epcContractorId);

      const projectFlow = visibility.project_payment_flows[0];
      
      // Verify direct payment mode
      expect(projectFlow.payment_mode).toBe('direct');
      expect(projectFlow.escrow_records).toHaveLength(0);
      expect(projectFlow.amounts.total).toBe(2_000_000);
    });
  });

});
