/**
 * Checkpoint 9 Test Runner
 * 
 * Executes the comprehensive validation for external projects and milestone approval.
 * This script can be run independently to validate the EPC system functionality.
 * 
 * Usage:
 * npm run test:checkpoint-9
 * or
 * npx tsx src/test-utils/run-checkpoint-9.ts
 */

import { runCheckpoint9Validation } from './checkpoint-9-validation';
import type { ValidationContext } from './checkpoint-9-validation';

/**
 * Mock validation context for testing
 * In a real implementation, this would use actual Supabase and service instances
 */
function createMockValidationContext(): ValidationContext {
  return {
    supabase: {} as any, // Mock Supabase client
    dataService: {
      create: async (table: string, data: any) => ({ id: `mock-${Date.now()}`, ...data }),
      findMany: async (table: string, filters: any) => [],
      findOne: async (table: string, filters: any) => null,
      update: async (table: string, filters: any, data: any) => ({ ...data }),
    } as any,
    eventBus: {
      emit: async (eventName: string, data: any) => {
        console.log(`📡 Event emitted: ${eventName}`, data);
        return Promise.resolve();
      }
    } as any,
    testUserId: `test-epc-contractor-${Date.now()}`,
    correlationId: `checkpoint-9-${Date.now()}`
  };
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting Checkpoint 9 Validation');
  console.log('Feature: EPC Dashboard Enterprise System');
  console.log('Task: 9. Checkpoint - Verify external projects and milestones');
  console.log('');

  try {
    const context = createMockValidationContext();
    const results = await runCheckpoint9Validation(context);

    // Calculate summary statistics
    const passCount = results.filter(r => r.status === 'PASS').length;
    const failCount = results.filter(r => r.status === 'FAIL').length;
    const warningCount = results.filter(r => r.status === 'WARNING').length;
    const totalCount = results.length;

    console.log('\n🏁 VALIDATION COMPLETE');
    console.log(`Total: ${totalCount}, Passed: ${passCount}, Failed: ${failCount}, Warnings: ${warningCount}`);

    // Exit with appropriate code
    if (failCount > 0) {
      console.log('\n❌ Validation failed - critical issues found');
      process.exit(1);
    } else if (warningCount > 0) {
      console.log('\n⚠️  Validation passed with warnings - review recommended');
      process.exit(0);
    } else {
      console.log('\n✅ Validation passed - all systems operational');
      process.exit(0);
    }

  } catch (error) {
    console.error('\n💥 Validation runner failed:', error);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main().catch(console.error);
}

export { main as runCheckpoint9 };