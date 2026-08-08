/**
 * Stitch Screen Registry
 *
 * Maps Stitch Screen IDs to their React-transformed implementations.
 * All screens are registered here for centralized orchestration.
 *
 * Project ID: 38898312367090366
 */

// RFQ Flow
import { ProjectTypeSelection } from './rfq/ProjectTypeSelection';
import { ModelingTypeSelection } from './rfq/ModelingTypeSelection';
import { ResidentialLoadProfile } from './rfq/ResidentialLoadProfile';
import { CommercialLoadProfile } from './rfq/CommercialLoadProfile';
import { LocationIntelligence } from './rfq/LocationIntelligence';
import { BudgetPreferences } from './rfq/BudgetPreferences';
import { ReviewSummary } from './rfq/ReviewSummary';
import { FinalPublishEngine } from './rfq/FinalPublishEngine';

// Bid Flow
import { CompareBids } from './bids/CompareBids';
import { BidDetailReview } from './bids/BidDetailReview';
import { BidAcceptanceConfirmation } from './bids/BidAcceptanceConfirmation';
import { BidRejectedFeedback } from './bids/BidRejectedFeedback';

export const screenRegistry: Record<string, React.ComponentType<any>> = {
  // ── RFQ Flow ───────────────────────────────────────────────────────────────
  // Desktop Screens
  'c69183e744a54506b11a5b763ab132da': ProjectTypeSelection,   // Create RFQ | Project Type Selection
  '15fa5aaa85454603b4509e4c7265f7a5': ModelingTypeSelection,  // Create RFQ | Modeling Type Selection
  'c76eeba52b744ee8ac5bc5de5da3818c': ResidentialLoadProfile, // Create RFQ | Residential Load Profile
  '74aacbdf19874ebf94ceefded6b79aad': CommercialLoadProfile,  // Create RFQ | Commercial Load Profile
  '053e04c0923c4306a1d3d250a1a8e1bf': LocationIntelligence,   // Create RFQ | Location Intelligence
  '6b4f50320f324f748a7632da5aae3554': BudgetPreferences,      // Create RFQ | Budget & Preferences
  'b3594681cfb947eab609a78c21666246': ReviewSummary,          // Create RFQ | Review & AI Summary
  '5cf0a57f6084494d8d83da5a491ddb82': FinalPublishEngine,     // Create RFQ | Final Publish Engine

  // Mobile Variants (responsive — map to same components, handled by CSS breakpoints)
  'dbff820fc1d94cd5960c791b2ac1d803': ProjectTypeSelection,   // Mobile RFQ | Project Type Selection
  'f1f4402ef2384db78dc480c5a40ad686': ResidentialLoadProfile, // Mobile RFQ | Appliance Load Profile
  '317f3a0013274f4cbd6930edbf65254d': FinalPublishEngine,     // Mobile RFQ | Final Publish Engine

  // ── Bid Flow ──────────────────────────────────────────────────────────────
  // Desktop Screens
  'ed5fd6f90de0415da7e544a839cec46e': CompareBids,             // Bid Comparison | Technical Matrix
  '93f2e38aac1d4cba82bbe41c7ec856a0': CompareBids,             // Bid Management | Active RFQs
  'f734a94fbfc04a10b0ecb809402238bb': BidDetailReview,         // Bid Detail | Technical Proposal Deep-Dive
  'a46ba38372ba451ba32b5cb8cfc34917': BidAcceptanceConfirmation, // Bid Accepted | Trust Confirmation
  'c63a442c05784f3e9e8d912e3245f878': BidRejectedFeedback,     // Bid Rejected | Operational Feedback

  // Mobile Variants (responsive — same components, CSS handles layout)
  'd70be1ce32934272ae1acbbca82900d3': CompareBids,             // Mobile Bid Comparison | Proposal Triage
  'ce171b3bad944b88b09386d8e594bec3': BidDetailReview,         // Mobile Bid Detail | Technical Summary
  'e5658ae0d7e149789d3dda0266565d77': BidAcceptanceConfirmation, // Mobile Bid Accepted | Payout Setup
  '632c3951bb754f9698bbb37b52e8cd58': CompareBids,             // Mobile Bid Management | RFQ List
};

