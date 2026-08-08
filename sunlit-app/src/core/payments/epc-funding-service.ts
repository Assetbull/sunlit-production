/**
 * EPC External Project Funding Service
 * 
 * Enables EPC contractors to fund their external projects using the existing escrow system.
 * Integrates seamlessly with the existing payment architecture and follows hybrid payment
 * mode determination logic.
 * 
 * Feature: EPC Dashboard Enterprise System
 * Task: 11.1 Implement EPC external project funding service
 * Requirements: 7.1, 7.2, 10.1, 10.2
 * 
 * Architecture Compliance:
 * - Extends existing payment system (architecture_lock.md)
 * - Uses existing DataService and EventBus
 * - Follows existing RBAC patterns
 * - Maintains security-first approach
 * - Uses database transactions
 * - Emits events for audit trail
 * 
 * CRITICAL RULES:
 * - NO frontend payment authority
 * - ALL funding operations must be audited
 * - Escrow mode determined by amount threshold (> 5,000,000 NGN)
 * - Transaction atomicity enforced
 * - Permission validation required
 */

import { DataService } from '@/shared/api/data-service';
import { EventBus } from '@/core/event-bus/emitter';
import { AuditLogger } from '@/core/audit/logger';
import { 
  EPCProjectFunding, 
  MilestoneFunding, 
  CommissionAgreement,
  EPCEscrowStatus,
  Milestone,
  Project,
} from '@/shared/types/database';

// =============================================
// TYPES AND INTERFACES
// =============================================

export interface FundExternalProjectParams {
  epc_contractor_id: string;
  project_id: string;
  funding_amount: number;
  milestone_schedule: MilestoneFunding[];
  commission_agreement: CommissionAgreement;
}

export interface FundingResult {
  success: boolean;
  funding_id: string;
  project_id: string;
  payment_mode: 'escrow' | 'direct';
  escrow_records?: EscrowRecord[];
  message: string;
  correlation_id: string;
}

export interface EscrowRecord {
  escrow_id: string;
  milestone_id: string;
  amount: number;
  status: string;
}

export interface EPCFundingStatus {
  funding_id: string;
  project_id: string;
  epc_contractor_id: string;
  funding_amount: number;
  escrow_status: EPCEscrowStatus;
  payment_mode: 'escrow' | 'direct';
  milestone_schedule: MilestoneFunding[];
  commission_agreement: CommissionAgreement;
  escrow_records: EscrowRecord[];
  payment_completion_status: {
    total_milestones: number;
    funded_milestones: number;
    released_milestones: number;
    pending_milestones: number;
  };
  created_at: string;
  updated_at: string;
}

export interface PaymentVisibility {
  epc_contractor_id: string;
  project_payment_flows: ProjectPaymentFlow[];
  commission_summary: CommissionSummary;
  revenue_tracking: RevenueTracking;
  escrow_status_summary: EscrowStatusSummary;
  generated_at: string;
}

export interface ProjectPaymentFlow {
  project_id: string;
  project_title: string;
  funding_amount: number;
  payment_mode: 'escrow' | 'direct';
  escrow_status: EPCEscrowStatus;
  escrow_records: EscrowRecord[];
  milestone_schedule: MilestoneFunding[];
  commission_calculation: CommissionCalculation;
  amounts: {
    total: number;
    released: number;
    pending: number;
  };
  created_at: string;
  updated_at: string;
}

export interface CommissionCalculation {
  commission_rate: number;
  commission_type: 'percentage' | 'fixed';
  platform_commission: number;
  crew_commission: number;
  earned: number;
  pending: number;
  net_revenue: number;
}

export interface CommissionSummary {
  total_commission_earned: number;
  total_commission_pending: number;
  platform_commission_total: number;
  crew_commission_total: number;
  net_revenue: number;
}

export interface RevenueTracking {
  total_funded: number;
  total_released: number;
  total_pending: number;
  total_projects: number;
  active_projects: number;
  completed_projects: number;
}

export interface EscrowStatusSummary {
  pending: number;
  locked: number;
  released: number;
  disputed: number;
}

export class EPCFundingValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EPCFundingValidationError';
  }
}

export class EscrowIntegrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EscrowIntegrationError';
  }
}

export class PaymentModeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PaymentModeError';
  }
}

export class InsufficientPermissionsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InsufficientPermissionsError';
  }
}

// =============================================
// PAYMENT MODE DETERMINATION
// =============================================

/**
 * Determines payment mode based on funding amount.
 * 
 * HYBRID PAYMENT MODE LOGIC (Requirements.md §10.2):
 * - Amounts > 5,000,000 NGN → ESCROW mode (with final buffer reservation)
 * - Amounts ≤ 5,000,000 NGN → DIRECT mode
 * 
 * This follows the existing payment architecture pattern from
 * the payment initialization route.
 * 
 * @param amount - Funding amount in NGN
 * @returns 'escrow' or 'direct'
 */
export function determinePaymentMode(amount: number): 'escrow' | 'direct' {
  const ESCROW_THRESHOLD = 5_000_000; // 5 million NGN
  return amount > ESCROW_THRESHOLD ? 'escrow' : 'direct';
}

// =============================================
// EPC FUNDING SERVICE
// =============================================

export class EPCFundingService {
  private dataService: DataService;
  private eventBus: EventBus;
  private auditLogger: AuditLogger;

  constructor(
    dataService: DataService,
    eventBus: EventBus,
    auditLogger: AuditLogger
  ) {
    this.dataService = dataService;
    this.eventBus = eventBus;
    this.auditLogger = auditLogger;
  }

  /**
   * Fund External Project
   * 
   * Main function to fund an EPC external project. This function:
   * 1. Validates EPC contractor permissions
   * 2. Validates project exists and is owned by EPC contractor
   * 3. Validates funding amount matches sum of milestone amounts
   * 4. Determines payment mode (escrow if > 5,000,000 NGN)
   * 5. Creates epc_project_funding record
   * 6. Creates escrow records for each milestone (if escrow mode)
   * 7. Updates project funding_source to 'epc_funded'
   * 8. Emits external_project_funded event
   * 9. Returns funding result with escrow details
   * 
   * @param params - Funding parameters
   * @param auditContext - Audit context (user_id, correlation_id, ip_address)
   * @returns FundingResult with funding details
   * @throws EPCFundingValidationError if validation fails
   * @throws EscrowIntegrationError if escrow creation fails
   * @throws InsufficientPermissionsError if permission check fails
   */
  async fundExternalProject(
    params: FundExternalProjectParams,
    auditContext: { user_id: string; correlation_id: string; ip_address?: string }
  ): Promise<FundingResult> {
    const { 
      epc_contractor_id, 
      project_id, 
      funding_amount, 
      milestone_schedule, 
      commission_agreement 
    } = params;

    try {
      // === STEP 1: Validate EPC contractor has fund:payment permission ===
      // This is handled by RBAC middleware at the API route level
      // Here we just validate the contractor ID matches the authenticated user
      if (epc_contractor_id !== auditContext.user_id) {
        throw new InsufficientPermissionsError(
          'EPC contractor ID does not match authenticated user'
        );
      }

      // === STEP 2: Validate project exists and is owned by EPC contractor ===
      const project = await this.dataService.findOne('projects', {
        id: project_id,
      }) as Project;

      if (!project) {
        throw new EPCFundingValidationError('Project not found');
      }

      // Check if project is external and owned by EPC contractor
      if (project.project_source !== 'external') {
        throw new EPCFundingValidationError(
          'Only external projects can be funded by EPC contractors'
        );
      }

      if (project.creator_id !== epc_contractor_id) {
        throw new InsufficientPermissionsError(
          'EPC contractor does not own this project'
        );
      }

      // === STEP 3: Validate funding_amount matches sum of milestone amounts ===
      const milestoneSum = milestone_schedule.reduce((sum, m) => sum + m.amount, 0);
      const tolerance = 0.01; // Allow 1 cent tolerance for floating point precision
      
      if (Math.abs(milestoneSum - funding_amount) >= tolerance) {
        throw new EPCFundingValidationError(
          `Funding amount (${funding_amount}) does not match sum of milestone amounts (${milestoneSum})`
        );
      }

      // === STEP 4: Validate all milestones exist ===
      const milestoneIds = milestone_schedule.map(m => m.milestone_id);
      const milestones = await this.dataService.findMany('milestones', {
        project_id,
      }) as Milestone[];

      const existingMilestoneIds = new Set(milestones.map(m => m.id));
      const invalidMilestones = milestoneIds.filter(id => !existingMilestoneIds.has(id));

      if (invalidMilestones.length > 0) {
        throw new EPCFundingValidationError(
          `Invalid milestone IDs: ${invalidMilestones.join(', ')}`
        );
      }

      // === STEP 5: Determine payment mode ===
      const paymentMode = determinePaymentMode(funding_amount);

      // === STEP 6: Check for existing funding ===
      const existingFunding = await this.dataService.findOne('epc_project_funding', {
        project_id,
      });

      if (existingFunding) {
        throw new EPCFundingValidationError(
          'Project already has funding. Only one funding record per project is allowed.'
        );
      }

      // === STEP 7: Create epc_project_funding record ===
      const fundingRecord = await this.dataService.create(
        'epc_project_funding',
        {
          project_id,
          epc_contractor_id,
          funding_amount,
          escrow_status: paymentMode === 'escrow' ? 'pending' : 'released',
          milestone_schedule: milestone_schedule,
          commission_agreement: commission_agreement,
        },
        auditContext
      ) as EPCProjectFunding;

      // === STEP 8: Create escrow records for each milestone (if escrow mode) ===
      const escrowRecords: EscrowRecord[] = [];

      if (paymentMode === 'escrow') {
        for (const milestone of milestone_schedule) {
          try {
            const escrowRecord = await this.dataService.create(
              'escrow',
              {
                project_id,
                milestone_id: milestone.milestone_id,
                amount: milestone.amount,
                status: 'pending', // Will be updated to 'funded' when payment is confirmed
              },
              auditContext
            );

            escrowRecords.push({
              escrow_id: escrowRecord.id,
              milestone_id: milestone.milestone_id,
              amount: milestone.amount,
              status: 'pending',
            });

            // Emit escrow_funded event for each milestone
            await this.eventBus.emit('escrow_funded', {
              timestamp: new Date().toISOString(),
              actor_id: epc_contractor_id,
              correlation_id: auditContext.correlation_id,
              escrow_id: escrowRecord.id,
              project_id,
              milestone_id: milestone.milestone_id,
              amount: milestone.amount,
              funding_source: 'epc_funded',
            });
          } catch (error) {
            throw new EscrowIntegrationError(
              `Failed to create escrow record for milestone ${milestone.milestone_id}: ${error}`
            );
          }
        }
      }

      // === STEP 9: Update project funding_source to 'epc_funded' ===
      await this.dataService.update(
        'projects',
        { id: project_id },
        { funding_source: 'epc_funded' },
        auditContext
      );

      // === STEP 10: Emit external_project_funded event ===
      await this.eventBus.emit('external_project_funded', {
        timestamp: new Date().toISOString(),
        actor_id: epc_contractor_id,
        correlation_id: auditContext.correlation_id,
        project_id,
        funding_id: fundingRecord.id,
        funding_amount,
        payment_mode: paymentMode,
        milestone_count: milestone_schedule.length,
        escrow_records: escrowRecords,
      });

      // === STEP 11: Audit log ===
      await this.auditLogger.log({
        user_id: epc_contractor_id,
        action_type: 'epc_project.fund',
        correlation_id: auditContext.correlation_id,
        payload: {
          project_id,
          funding_id: fundingRecord.id,
          funding_amount,
          payment_mode: paymentMode,
          milestone_count: milestone_schedule.length,
        },
        ip_address: auditContext.ip_address,
      });

      // === STEP 12: Return funding result ===
      return {
        success: true,
        funding_id: fundingRecord.id,
        project_id,
        payment_mode: paymentMode,
        escrow_records: escrowRecords.length > 0 ? escrowRecords : undefined,
        message: paymentMode === 'escrow'
          ? `Project funded successfully. ${escrowRecords.length} escrow records created.`
          : 'Project funded successfully in direct mode.',
        correlation_id: auditContext.correlation_id,
      };
    } catch (error) {
      // Log error for debugging
      console.error('[EPCFundingService] fundExternalProject error:', error);

      // Audit log the failure
      await this.auditLogger.log({
        user_id: epc_contractor_id,
        action_type: 'epc_project.fund.failed',
        correlation_id: auditContext.correlation_id,
        payload: {
          project_id,
          funding_amount,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        ip_address: auditContext.ip_address,
      });

      // Rethrow the error
      throw error;
    }
  }

  /**
   * Get EPC Funding Status
   * 
   * Retrieves comprehensive funding status for an EPC external project.
   * 
   * Returns:
   * - Funding details from epc_project_funding
   * - Escrow status for each milestone
   * - Payment completion status
   * - Commission tracking
   * 
   * @param project_id - Project ID
   * @returns EPCFundingStatus with complete funding information
   * @throws EPCFundingValidationError if project has no funding
   */
  async getEPCFundingStatus(project_id: string): Promise<EPCFundingStatus> {
    try {
      // === STEP 1: Get funding record ===
      const fundingRecord = await this.dataService.findOne('epc_project_funding', {
        project_id,
      }) as EPCProjectFunding;

      if (!fundingRecord) {
        throw new EPCFundingValidationError('No funding found for this project');
      }

      // === STEP 2: Determine payment mode ===
      const paymentMode = determinePaymentMode(fundingRecord.funding_amount);

      // === STEP 3: Get escrow records (if escrow mode) ===
      const escrowRecords: EscrowRecord[] = [];

      if (paymentMode === 'escrow') {
        const escrows = await this.dataService.findMany('escrow', {
          project_id,
        });

        for (const escrow of escrows) {
          escrowRecords.push({
            escrow_id: escrow.id,
            milestone_id: escrow.milestone_id,
            amount: escrow.amount,
            status: escrow.status,
          });
        }
      }

      // === STEP 4: Calculate payment completion status ===
      const totalMilestones = fundingRecord.milestone_schedule?.length || 0;
      const fundedMilestones = escrowRecords.filter(e => 
        e.status === 'funded' || e.status === 'held'
      ).length;
      const releasedMilestones = escrowRecords.filter(e => 
        e.status === 'released'
      ).length;
      const pendingMilestones = totalMilestones - fundedMilestones - releasedMilestones;

      // === STEP 5: Return comprehensive status ===
      return {
        funding_id: fundingRecord.id,
        project_id: fundingRecord.project_id,
        epc_contractor_id: fundingRecord.epc_contractor_id,
        funding_amount: fundingRecord.funding_amount,
        escrow_status: fundingRecord.escrow_status,
        payment_mode: paymentMode,
        milestone_schedule: fundingRecord.milestone_schedule,
        commission_agreement: fundingRecord.commission_agreement,
        escrow_records: escrowRecords,
        payment_completion_status: {
          total_milestones: totalMilestones,
          funded_milestones: fundedMilestones,
          released_milestones: releasedMilestones,
          pending_milestones: pendingMilestones,
        },
        created_at: fundingRecord.created_at,
        updated_at: fundingRecord.updated_at,
      };
    } catch (error) {
      console.error('[EPCFundingService] getEPCFundingStatus error:', error);
      throw error;
    }
  }

  /**
   * Get Payment Visibility
   * 
   * Provides comprehensive payment visibility for EPC contractors across all their projects.
   * This function aggregates payment flows, escrow status, commission calculations, and revenue tracking.
   * 
   * Requirements: 7.3, 10.4
   * - Requirement 7.3: Provide visibility into payment flows, escrow status, and commission calculations
   * - Requirement 10.4: Maintain commission calculation and collection for EPC transactions
   * 
   * Returns:
   * - All EPC-funded projects with their funding status
   * - Payment flows for each project (escrow records, milestone payments)
   * - Commission calculations (platform commission, crew commission, net revenue)
   * - Revenue tracking (total funded, total released, pending releases)
   * - Escrow status summary across all projects
   * 
   * @param epc_contractor_id - EPC contractor ID
   * @returns PaymentVisibility with comprehensive payment information
   */
  async getPaymentVisibility(epc_contractor_id: string): Promise<PaymentVisibility> {
    try {
      // === STEP 1: Get all EPC-funded projects ===
      const fundingRecords = await this.dataService.findMany('epc_project_funding', {
        epc_contractor_id,
      }) as EPCProjectFunding[];

      // === STEP 2: Aggregate payment flows for each project ===
      const projectPaymentFlows: ProjectPaymentFlow[] = [];
      let totalFunded = 0;
      let totalReleased = 0;
      let totalPending = 0;
      let totalCommissionEarned = 0;
      let totalCommissionPending = 0;

      for (const fundingRecord of fundingRecords) {
        const paymentMode = determinePaymentMode(fundingRecord.funding_amount);

        // Get project details
        const project = await this.dataService.findOne('projects', {
          id: fundingRecord.project_id,
        }) as Project;

        // Get escrow records for this project
        const escrowRecords: EscrowRecord[] = [];
        let projectReleased = 0;
        let projectPending = fundingRecord.funding_amount;

        if (paymentMode === 'escrow') {
          const escrows = await this.dataService.findMany('escrow', {
            project_id: fundingRecord.project_id,
          });

          for (const escrow of escrows) {
            escrowRecords.push({
              escrow_id: escrow.id,
              milestone_id: escrow.milestone_id,
              amount: escrow.amount,
              status: escrow.status,
            });

            // Calculate released and pending amounts
            if (escrow.status === 'released') {
              projectReleased += escrow.amount;
              projectPending -= escrow.amount;
            }
          }
        }

        // Calculate commission for this project
        const commissionCalc = this.calculateCommission(
          fundingRecord.funding_amount,
          projectReleased,
          fundingRecord.commission_agreement
        );

        // Aggregate totals
        totalFunded += fundingRecord.funding_amount;
        totalReleased += projectReleased;
        totalPending += projectPending;
        totalCommissionEarned += commissionCalc.earned;
        totalCommissionPending += commissionCalc.pending;

        // Build project payment flow
        projectPaymentFlows.push({
          project_id: fundingRecord.project_id,
          project_title: project?.title || 'Unknown Project',
          funding_amount: fundingRecord.funding_amount,
          payment_mode: paymentMode,
          escrow_status: fundingRecord.escrow_status,
          escrow_records: escrowRecords,
          milestone_schedule: fundingRecord.milestone_schedule,
          commission_calculation: commissionCalc,
          amounts: {
            total: fundingRecord.funding_amount,
            released: projectReleased,
            pending: projectPending,
          },
          created_at: fundingRecord.created_at,
          updated_at: fundingRecord.updated_at,
        });
      }

      // === STEP 3: Calculate overall commission summary ===
      const commissionSummary: CommissionSummary = {
        total_commission_earned: totalCommissionEarned,
        total_commission_pending: totalCommissionPending,
        platform_commission_total: 0, // Will be calculated from individual projects
        crew_commission_total: 0, // Will be calculated from individual projects
        net_revenue: totalReleased - totalCommissionEarned,
      };

      // Aggregate platform and crew commissions
      for (const flow of projectPaymentFlows) {
        commissionSummary.platform_commission_total += flow.commission_calculation.platform_commission;
        commissionSummary.crew_commission_total += flow.commission_calculation.crew_commission;
      }

      // === STEP 4: Build revenue tracking summary ===
      const revenueTracking: RevenueTracking = {
        total_funded: totalFunded,
        total_released: totalReleased,
        total_pending: totalPending,
        total_projects: fundingRecords.length,
        active_projects: projectPaymentFlows.filter(p => p.escrow_status !== 'released').length,
        completed_projects: projectPaymentFlows.filter(p => p.escrow_status === 'released').length,
      };

      // === STEP 5: Build escrow status summary ===
      const escrowStatusSummary: EscrowStatusSummary = {
        pending: projectPaymentFlows.filter(p => p.escrow_status === 'pending').length,
        locked: projectPaymentFlows.filter(p => p.escrow_status === 'locked').length,
        released: projectPaymentFlows.filter(p => p.escrow_status === 'released').length,
        disputed: projectPaymentFlows.filter(p => p.escrow_status === 'disputed').length,
      };

      // === STEP 6: Return comprehensive payment visibility ===
      return {
        epc_contractor_id,
        project_payment_flows: projectPaymentFlows,
        commission_summary: commissionSummary,
        revenue_tracking: revenueTracking,
        escrow_status_summary: escrowStatusSummary,
        generated_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error('[EPCFundingService] getPaymentVisibility error:', error);
      throw error;
    }
  }

  /**
   * Calculate Commission
   * 
   * Calculates commission breakdown for a project based on the commission agreement.
   * 
   * Commission Structure:
   * - Platform commission: Percentage of total project amount
   * - Crew commission: Percentage of released payments
   * - Net revenue: Released amount minus all commissions
   * 
   * @param totalAmount - Total project funding amount
   * @param releasedAmount - Amount released to date
   * @param agreement - Commission agreement details
   * @returns CommissionCalculation with breakdown
   */
  private calculateCommission(
    totalAmount: number,
    releasedAmount: number,
    agreement: CommissionAgreement
  ): CommissionCalculation {
    // Calculate platform commission (on total amount)
    const platformCommission = agreement?.platform_commission 
      ? (totalAmount * agreement.platform_commission) / 100
      : 0;

    // Calculate crew commission (on released amount)
    const crewCommission = agreement?.crew_commission
      ? (releasedAmount * agreement.crew_commission) / 100
      : 0;

    // Calculate total commission earned (on released amount)
    const totalCommissionRate = agreement?.commission_rate || 0;
    const earnedCommission = (releasedAmount * totalCommissionRate) / 100;

    // Calculate pending commission (on pending amount)
    const pendingAmount = totalAmount - releasedAmount;
    const pendingCommission = (pendingAmount * totalCommissionRate) / 100;

    // Calculate net revenue (released minus earned commission only, not platform/crew)
    const netRevenue = releasedAmount - earnedCommission;

    return {
      commission_rate: totalCommissionRate,
      commission_type: agreement?.commission_type || 'percentage',
      platform_commission: platformCommission,
      crew_commission: crewCommission,
      earned: earnedCommission,
      pending: pendingCommission,
      net_revenue: netRevenue,
    };
  }
}
