/**
 * Sunlit Security — State Machine Test Suite
 *
 * Tests the lifecycle state machine engine for:
 * 1. Valid RFQ status transitions
 * 2. Invalid transition rejection (no skip-ahead)
 * 3. Escrow engine deterministic rules
 * 4. Escrow dispute blocking
 * 5. Escrow KYC enforcement
 * 6. Escrow freeze integrity
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { EscrowEngine, type EscrowReleaseContext } from '../../core/escrow/engine';

describe('State Machine — Escrow Engine Determinism', () => {
  test('Dispute blocks all escrow release attempts', () => {
    const disputedContext: EscrowReleaseContext = {
      milestone_complete: true,
      dispute_active: true,
      approved_by_owner: true,
      current_status: 'funded',
      kyc_verified: true,
    };

    const nextState = EscrowEngine.calculateNextState(disputedContext);
    assert.equal(nextState, 'disputed', 'Active dispute must block release regardless of other conditions');
    assert.equal(EscrowEngine.canRelease(disputedContext), false);
  });

  test('Disputed status blocks release even without active dispute flag', () => {
    const disputedStatus: EscrowReleaseContext = {
      milestone_complete: true,
      dispute_active: false,
      approved_by_owner: true,
      current_status: 'disputed',
      kyc_verified: true,
    };

    const nextState = EscrowEngine.calculateNextState(disputedStatus);
    assert.equal(nextState, 'disputed', 'Disputed status must block release');
    assert.equal(EscrowEngine.canRelease(disputedStatus), false);
  });

  test('Incomplete milestone holds escrow', () => {
    const context: EscrowReleaseContext = {
      milestone_complete: false,
      dispute_active: false,
      approved_by_owner: true,
      current_status: 'funded',
      kyc_verified: true,
    };

    const nextState = EscrowEngine.calculateNextState(context);
    assert.equal(nextState, 'held', 'Incomplete milestone must hold escrow');
    assert.equal(EscrowEngine.canRelease(context), false);
  });

  test('Unverified KYC holds escrow', () => {
    const context: EscrowReleaseContext = {
      milestone_complete: true,
      dispute_active: false,
      approved_by_owner: true,
      current_status: 'funded',
      kyc_verified: false,
    };

    const nextState = EscrowEngine.calculateNextState(context);
    assert.equal(nextState, 'held', 'Unverified KYC must hold escrow');
    assert.equal(EscrowEngine.canRelease(context), false);
  });

  test('All conditions met — escrow releases', () => {
    const context: EscrowReleaseContext = {
      milestone_complete: true,
      dispute_active: false,
      approved_by_owner: true,
      current_status: 'funded',
      kyc_verified: true,
    };

    const nextState = EscrowEngine.calculateNextState(context);
    assert.equal(nextState, 'released', 'All conditions met must release escrow');
    assert.equal(EscrowEngine.canRelease(context), true);
  });

  test('Owner not approved — escrow stays in current state', () => {
    const context: EscrowReleaseContext = {
      milestone_complete: true,
      dispute_active: false,
      approved_by_owner: false,
      current_status: 'funded',
      kyc_verified: true,
    };

    const nextState = EscrowEngine.calculateNextState(context);
    assert.equal(nextState, 'funded', 'Unapproved owner must maintain current state');
    assert.equal(EscrowEngine.canRelease(context), false);
  });

  test('Pending escrow cannot release even with all approvals', () => {
    const context: EscrowReleaseContext = {
      milestone_complete: true,
      dispute_active: false,
      approved_by_owner: true,
      current_status: 'pending',
      kyc_verified: true,
    };

    const nextState = EscrowEngine.calculateNextState(context);
    assert.equal(nextState, 'pending', 'Pending escrow must not release — only funded escrow can release');
    assert.equal(EscrowEngine.canRelease(context), false);
  });

  test('EscrowEngine is frozen — cannot be mutated at runtime', () => {
    assert.ok(Object.isFrozen(EscrowEngine), 'EscrowEngine instance must be frozen');
    
    // Attempt to add a method — in strict mode this throws, in non-strict it silently fails
    try {
      (EscrowEngine as any).backdoor = () => 'released';
    } catch {
      // Expected in strict mode
    }
    // Verify the property was NOT added regardless of strict mode behavior
    assert.equal(
      (EscrowEngine as any).backdoor,
      undefined,
      'Must not be able to add properties to frozen EscrowEngine'
    );
  });

  test('Priority order: dispute > milestone > KYC > approval', () => {
    // All flags true except different priority levels — highest priority wins
    
    // Dispute overrides everything
    const disputeOverride: EscrowReleaseContext = {
      milestone_complete: true,
      dispute_active: true,
      approved_by_owner: true,
      current_status: 'funded',
      kyc_verified: true,
    };
    assert.equal(
      EscrowEngine.calculateNextState(disputeOverride),
      'disputed',
      'Dispute must have highest priority'
    );

    // Milestone not complete blocks KYC and approval
    const milestoneBlocks: EscrowReleaseContext = {
      milestone_complete: false,
      dispute_active: false,
      approved_by_owner: true,
      current_status: 'funded',
      kyc_verified: false,
    };
    assert.equal(
      EscrowEngine.calculateNextState(milestoneBlocks),
      'held',
      'Incomplete milestone has priority over KYC check'
    );
  });
});
