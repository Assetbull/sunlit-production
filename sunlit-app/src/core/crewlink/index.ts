/**
 * CrewLink Module Exports
 * 
 * Centralized exports for CrewLink functionality including EPC enhancements.
 * 
 * Feature: EPC Dashboard Enterprise System
 * Task: 10.1 Extend CrewLink job posting for project assignment
 * Task: 10.2 Implement crew-to-project assignment logic
 */

// EPC CrewLink Service
export {
  createEPCCrewJob,
  getEPCCrewJobs,
  publishEPCCrewJob,
  getEPCCrewJobById,
} from './epc-crewlink-service';

// Crew Assignment Service
export {
  assignCrewToProject,
  validateCrewAssignment,
  getProjectCrewAssignments,
} from './crew-assignment-service';

// Crew Performance Service
export {
  updateCrewPerformanceMetrics,
  recordCrewWorkCompletion,
  getCrewPerformanceHistory,
  calculateAggregatePerformance,
  submitPerformanceRating,
} from './crew-performance-service';

// Types
export type {
  EPCCrewJobData,
  EPCCrewJobResult,
  EPCCrewLinkServiceContext,
  MilestoneIntegration,
  CrewCoordinationConfig,
} from './epc-crewlink-service';

export type {
  CrewAssignmentData,
  CrewAssignmentServiceContext,
  MilestoneAssignmentData,
  CrewCapacity,
  SchedulingConflict,
  AssignmentValidationResult,
} from './crew-assignment-service';

export type {
  PerformanceMetrics,
  MilestoneCompletion,
  AggregateScores,
  CrewWorkCompletionData,
  PerformanceRatingData,
  PerformanceHistoryEntry,
  CrewPerformanceServiceContext,
} from './crew-performance-service';