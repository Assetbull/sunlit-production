/**
 * CONTRACT FLOW WORKFLOW TESTING ENGINE
 * 
 * Tests the complete contract generation, signing, and activation workflow
 * following the governance guardrails for non-destructive testing.
 */

import { fetchContracts, fetchContract } from '@/dashboards/project-owner/services/project-owner-api';
import type { ContractListItem, ContractView } from '@/dashboards/project-owner/types/dashboard';

interface ContractTestResult {
  step: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  details: string;
  data?: any;
  error?: string;
  timestamp: string;
}

interface ContractFlowTestSuite {
  testId: string;
  results: ContractTestResult[];
  summary: {
    totalSteps: number;
    passed: number;
    failed: number;
    skipped: number;
  };
  overallStatus: 'PASS' | 'FAIL' | 'PARTIAL';
}

export class ContractFlowTestEngine {
  private testId: string;
  private results: ContractTestResult[] = [];

  constructor() {
    this.testId = `contract_test_${Date.now()}`;
  }

  private addResult(step: string, status: 'PASS' | 'FAIL' | 'SKIP', details: string, data?: any, error?: string) {
    this.results.push({
      step,
      status,
      details,
      data,
      error,
      timestamp: new Date().toISOString()
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * STEP 1: Test Contract List Fetching
   */
  async testContractListFetching(): Promise<ContractListItem[]> {
    try {
      const response = await fetchContracts();

      if (response.success && response.data) {
        this.addResult(
          "CONTRACT_LIST_FETCHING",
          "PASS",
          `Successfully fetched ${response.data.length} contracts`,
          { 
            contractCount: response.data.length,
            contracts: response.data.map(c => ({ 
              id: c.id, 
              projectTitle: c.projectTitle, 
              status: c.status,
              totalAmount: c.totalAmount
            })),
            correlationId: response.correlation_id
          }
        );
        return response.data;
      } else {
        this.addResult(
          "CONTRACT_LIST_FETCHING",
          "FAIL",
          "Failed to fetch contract list",
          { response },
          response.error || "Unknown error"
        );
        return [];
      }
    } catch (error) {
      this.addResult(
        "CONTRACT_LIST_FETCHING",
        "FAIL",
        "Contract list fetching threw exception",
        undefined,
        error instanceof Error ? error.message : String(error)
      );
      return [];
    }
  }

  /**
   * STEP 2: Validate Contract List Structure
   */
  private validateContractListStructure(contracts: ContractListItem[]): void {
    try {
      if (contracts.length === 0) {
        this.addResult(
          "CONTRACT_LIST_VALIDATION",
          "SKIP",
          "No contracts available for structure validation"
        );
        return;
      }

      const validationResults = contracts.map(contract => {
        const validations = [
          {
            property: 'id',
            valid: typeof contract.id === 'string' && contract.id.length > 0,
            value: contract.id
          },
          {
            property: 'rfqId',
            valid: typeof contract.rfqId === 'string' && contract.rfqId.length > 0,
            value: contract.rfqId
          },
          {
            property: 'projectTitle',
            valid: typeof contract.projectTitle === 'string' && contract.projectTitle.length > 0,
            value: contract.projectTitle
          },
          {
            property: 'installerName',
            valid: typeof contract.installerName === 'string' && contract.installerName.length > 0,
            value: contract.installerName
          },
          {
            property: 'totalAmount',
            valid: typeof contract.totalAmount === 'number' && contract.totalAmount > 0,
            value: contract.totalAmount
          },
          {
            property: 'status',
            valid: ['pending_signatures', 'active', 'completed', 'cancelled'].includes(contract.status),
            value: contract.status
          },
          {
            property: 'createdAt',
            valid: typeof contract.createdAt === 'string' && !isNaN(Date.parse(contract.createdAt)),
            value: contract.createdAt
          }
        ];

        const failedValidations = validations.filter(v => !v.valid);
        return {
          contractId: contract.id,
          projectTitle: contract.projectTitle,
          validations,
          failedValidations,
          isValid: failedValidations.length === 0
        };
      });

      const allValid = validationResults.every(r => r.isValid);
      const invalidContracts = validationResults.filter(r => !r.isValid);

      if (allValid) {
        this.addResult(
          "CONTRACT_LIST_VALIDATION",
          "PASS",
          "All contract list structures are valid",
          { validationResults }
        );
      } else {
        this.addResult(
          "CONTRACT_LIST_VALIDATION",
          "FAIL",
          `${invalidContracts.length} contracts have invalid structure`,
          { validationResults, invalidContracts }
        );
      }
    } catch (error) {
      this.addResult(
        "CONTRACT_LIST_VALIDATION",
        "FAIL",
        "Contract list validation threw exception",
        undefined,
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  /**
   * STEP 3: Test Contract Detail Fetching
   */
  async testContractDetailFetching(contracts: ContractListItem[]): Promise<ContractView | null> {
    try {
      if (contracts.length === 0) {
        this.addResult(
          "CONTRACT_DETAIL_FETCHING",
          "SKIP",
          "No contracts available for detail fetching"
        );
        return null;
      }

      const testContract = contracts[0];
      const response = await fetchContract(testContract.id);

      if (response.success && response.data) {
        this.addResult(
          "CONTRACT_DETAIL_FETCHING",
          "PASS",
          "Successfully fetched contract details",
          { 
            contractId: testContract.id,
            contractDetails: {
              projectTitle: response.data.projectTitle,
              installerName: response.data.installerName,
              totalAmount: response.data.totalAmount,
              status: response.data.status,
              milestonesCount: response.data.milestones?.length || 0
            },
            correlationId: response.correlation_id
          }
        );
        return response.data;
      } else {
        this.addResult(
          "CONTRACT_DETAIL_FETCHING",
          "FAIL",
          "Failed to fetch contract details",
          { contractId: testContract.id, response },
          response.error || "Unknown error"
        );
        return null;
      }
    } catch (error) {
      this.addResult(
        "CONTRACT_DETAIL_FETCHING",
        "FAIL",
        "Contract detail fetching threw exception",
        undefined,
        error instanceof Error ? error.message : String(error)
      );
      return null;
    }
  }

  /**
   * STEP 4: Validate Contract Detail Structure
   */
  private validateContractDetailStructure(contract: ContractView): void {
    try {
      const validations: { property: string; valid: boolean; value: any }[] = [
        {
          property: 'id',
          valid: typeof contract.id === 'string' && contract.id.length > 0,
          value: contract.id
        },
        {
          property: 'rfqId',
          valid: typeof contract.rfqId === 'string' && contract.rfqId.length > 0,
          value: contract.rfqId
        },
        {
          property: 'projectId',
          valid: typeof contract.projectId === 'string' && contract.projectId.length > 0,
          value: contract.projectId
        },
        {
          property: 'installerId',
          valid: typeof contract.installerId === 'string' && contract.installerId.length > 0,
          value: contract.installerId
        },
        {
          property: 'signatures',
          valid: contract.signatures && typeof contract.signatures === 'object',
          value: contract.signatures
        },
        {
          property: 'milestones',
          valid: Array.isArray(contract.milestones) && contract.milestones.length > 0,
          value: contract.milestones?.length || 0
        }
      ];

      // Validate signature structure
      if (contract.signatures) {
        const signatureValidations = [
          {
            property: 'ownerSigned',
            valid: typeof contract.signatures.ownerSigned === 'boolean',
            value: contract.signatures.ownerSigned
          },
          {
            property: 'installerSigned',
            valid: typeof contract.signatures.installerSigned === 'boolean',
            value: contract.signatures.installerSigned
          }
        ];
        validations.push(...signatureValidations);
      }

      // Validate milestone structure
      if (contract.milestones && contract.milestones.length > 0) {
        const milestoneValidation = contract.milestones.every(milestone => 
          typeof milestone.id === 'string' &&
          typeof milestone.title === 'string' &&
          typeof milestone.amount === 'number' &&
          typeof milestone.position === 'number' &&
          typeof milestone.isCompleted === 'boolean' &&
          typeof milestone.isApproved === 'boolean' &&
          ['pending', 'funded', 'released'].includes(milestone.paymentStatus ?? '')
        );

        validations.push({
          property: 'milestones_structure',
          valid: milestoneValidation,
          value: `${contract.milestones.length} milestones`
        });
      }

      const failedValidations = validations.filter(v => !v.valid);

      if (failedValidations.length === 0) {
        this.addResult(
          "CONTRACT_DETAIL_VALIDATION",
          "PASS",
          "Contract detail structure is valid",
          { 
            validations,
            milestonesCount: contract.milestones?.length || 0,
            signaturesStatus: contract.signatures
          }
        );
      } else {
        this.addResult(
          "CONTRACT_DETAIL_VALIDATION",
          "FAIL",
          "Contract detail structure has invalid properties",
          { validations, failedValidations }
        );
      }
    } catch (error) {
      this.addResult(
        "CONTRACT_DETAIL_VALIDATION",
        "FAIL",
        "Contract detail validation threw exception",
        undefined,
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  /**
   * STEP 5: Test Contract Signature Flow
   */
  private testContractSignatureFlow(contract: ContractView): void {
    try {
      const signatures = contract.signatures;
      
      if (!signatures) {
        this.addResult(
          "CONTRACT_SIGNATURE_FLOW",
          "FAIL",
          "Contract signatures object is missing"
        );
        return;
      }

      // Analyze signature states
      const signatureStates = {
        ownerSigned: signatures.ownerSigned,
        installerSigned: signatures.installerSigned,
        ownerSignedAt: signatures.ownerSignedAt,
        installerSignedAt: signatures.installerSignedAt
      };

      // Determine contract readiness
      const fullyExecuted = signatures.ownerSigned && signatures.installerSigned;
      const partiallyExecuted = signatures.ownerSigned || signatures.installerSigned;

      // Validate signature flow logic
      const expectedStatus = fullyExecuted ? 'active' : 'pending_signatures';
      const statusMatches = contract.status === expectedStatus;

      if (statusMatches) {
        this.addResult(
          "CONTRACT_SIGNATURE_FLOW",
          "PASS",
          "Contract signature flow is consistent with status",
          { 
            signatureStates,
            fullyExecuted,
            partiallyExecuted,
            contractStatus: contract.status,
            expectedStatus
          }
        );
      } else {
        this.addResult(
          "CONTRACT_SIGNATURE_FLOW",
          "FAIL",
          "Contract status doesn't match signature state",
          { 
            signatureStates,
            contractStatus: contract.status,
            expectedStatus
          }
        );
      }
    } catch (error) {
      this.addResult(
        "CONTRACT_SIGNATURE_FLOW",
        "FAIL",
        "Contract signature flow test threw exception",
        undefined,
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  /**
   * STEP 6: Test Milestone Structure and Sequencing
   */
  private testMilestoneStructure(contract: ContractView): void {
    try {
      if (!contract.milestones || contract.milestones.length === 0) {
        this.addResult(
          "MILESTONE_STRUCTURE",
          "FAIL",
          "Contract has no milestones defined"
        );
        return;
      }

      const milestones = contract.milestones;

      // Test milestone sequencing
      const positions = milestones.map(m => m.position).sort((a, b) => a - b);
      const expectedPositions = Array.from({ length: milestones.length }, (_, i) => i + 1);
      const sequenceValid = JSON.stringify(positions) === JSON.stringify(expectedPositions);

      // Test milestone amounts sum to total
      const totalMilestoneAmount = milestones.reduce((sum, m) => sum + m.amount, 0);
      const amountMatches = Math.abs(totalMilestoneAmount - contract.totalAmount) < 1; // Allow for rounding

      // Test milestone payment status logic
      const paymentStatusValid = milestones.every(m => 
        ['pending', 'funded', 'released'].includes(m.paymentStatus ?? '')
      );

      // Test completion/approval logic
      const completionLogicValid = milestones.every(m => 
        !m.isApproved || m.isCompleted // Can't be approved without being completed
      );

      const allValidations = [
        { test: 'sequence', valid: sequenceValid, details: `Positions: ${positions.join(', ')}` },
        { test: 'amounts', valid: amountMatches, details: `Total: ${totalMilestoneAmount} vs ${contract.totalAmount}` },
        { test: 'payment_status', valid: paymentStatusValid, details: 'All payment statuses valid' },
        { test: 'completion_logic', valid: completionLogicValid, details: 'Approval requires completion' }
      ];

      const failedValidations = allValidations.filter(v => !v.valid);

      if (failedValidations.length === 0) {
        this.addResult(
          "MILESTONE_STRUCTURE",
          "PASS",
          "Milestone structure and sequencing is valid",
          { 
            milestonesCount: milestones.length,
            totalAmount: totalMilestoneAmount,
            validations: allValidations
          }
        );
      } else {
        this.addResult(
          "MILESTONE_STRUCTURE",
          "FAIL",
          "Milestone structure has validation issues",
          { validations: allValidations, failedValidations }
        );
      }
    } catch (error) {
      this.addResult(
        "MILESTONE_STRUCTURE",
        "FAIL",
        "Milestone structure test threw exception",
        undefined,
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  /**
   * STEP 7: Test Contract Activation Logic
   */
  private testContractActivation(contract: ContractView): void {
    try {
      // Contract should be active if both parties have signed
      const shouldBeActive = contract.signatures?.ownerSigned && contract.signatures?.installerSigned;
      const isActive = contract.status === 'active';

      // If contract is active, milestones should be ready for execution
      const milestonesReady = contract.milestones && contract.milestones.length > 0;

      if (shouldBeActive === isActive) {
        this.addResult(
          "CONTRACT_ACTIVATION",
          "PASS",
          "Contract activation logic is consistent",
          { 
            shouldBeActive,
            isActive,
            milestonesReady,
            contractStatus: contract.status,
            signatureStatus: contract.signatures
          }
        );
      } else {
        this.addResult(
          "CONTRACT_ACTIVATION",
          "FAIL",
          "Contract activation logic is inconsistent",
          { 
            shouldBeActive,
            isActive,
            contractStatus: contract.status
          }
        );
      }
    } catch (error) {
      this.addResult(
        "CONTRACT_ACTIVATION",
        "FAIL",
        "Contract activation test threw exception",
        undefined,
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  /**
   * Execute Complete Contract Flow Test
   */
  async executeFullContractFlowTest(): Promise<ContractFlowTestSuite> {
    console.log(`🔄 Starting Contract Flow Test Suite: ${this.testId}`);

    // Step 1: Fetch Contract List
    const contracts = await this.testContractListFetching();

    // Step 2: Validate Contract List Structure
    this.validateContractListStructure(contracts);

    // Step 3: Fetch Contract Details
    const contractDetail = await this.testContractDetailFetching(contracts);

    if (contractDetail) {
      // Step 4: Validate Contract Detail Structure
      this.validateContractDetailStructure(contractDetail);

      // Step 5: Test Signature Flow
      this.testContractSignatureFlow(contractDetail);

      // Step 6: Test Milestone Structure
      this.testMilestoneStructure(contractDetail);

      // Step 7: Test Contract Activation
      this.testContractActivation(contractDetail);
    } else {
      this.addResult("CONTRACT_DETAIL_TESTS", "SKIP", "Skipped detail tests due to failed contract fetching");
    }

    // Calculate summary
    const summary = {
      totalSteps: this.results.length,
      passed: this.results.filter(r => r.status === 'PASS').length,
      failed: this.results.filter(r => r.status === 'FAIL').length,
      skipped: this.results.filter(r => r.status === 'SKIP').length
    };

    const overallStatus: 'PASS' | 'FAIL' | 'PARTIAL' = 
      summary.failed === 0 ? 'PASS' : 
      summary.passed === 0 ? 'FAIL' : 'PARTIAL';

    const testSuite: ContractFlowTestSuite = {
      testId: this.testId,
      results: this.results,
      summary,
      overallStatus
    };

    console.log(`✅ Contract Flow Test Complete: ${overallStatus}`, summary);

    return testSuite;
  }
}

/**
 * Utility function to run contract flow test
 */
export async function runContractFlowTest(): Promise<ContractFlowTestSuite> {
  const testEngine = new ContractFlowTestEngine();
  return await testEngine.executeFullContractFlowTest();
}