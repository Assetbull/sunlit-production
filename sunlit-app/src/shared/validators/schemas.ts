import { z } from 'zod';
export * from './sanitize';

// =====================================
// AUTH / KYC
// =====================================

export const RegisterUserSchema = z.object({
  email: z.string().email(),
  first_name: z.string().min(2).max(100).optional(),
  last_name: z.string().min(2).max(100).optional(),
  phone_number: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  role: z.enum(['project_owner', 'installer', 'crewlink', 'epc_contractor']),
});

/**
 * H6 fix: At least one KYC field must be provided.
 * Requirements.md §8: NIN, BVN, CAC verification required.
 */
export const KycVerifySchema = z.object({
  bvn: z.string().length(11).optional(),
  nin: z.string().length(11).optional(),
  cac: z.string().min(5).optional(),
  document_type: z.enum(['drivers_license', 'utility_bill', 'proof_of_address']).optional(),
  document_url: z.string().url().optional(),
}).refine(
  (data) => data.bvn || data.nin || data.cac,
  { message: 'At least one verification field (bvn, nin, or cac) is required.' }
);

// =====================================
// PROJECTS & RFQ
// =====================================

export const CreateProjectSchema = z.object({
  title: z.string().min(5).max(255),
  description: z.string().min(10).optional(),
  location_state: z.string().min(2),
  location_city: z.string().min(2),
  system_size_kw: z.number().positive().optional(),
});

/**
 * Nigerian states whitelist for location validation.
 * Requirement: Nigeria-only enforcement (PO Dashboard §STEP 4).
 */
const NIGERIA_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
] as const;

/**
 * Step 3A: Appliance item schema for Residential Appliance-Based flow.
 * Default template: AC(3), Pumping machine(1), Fans(4), TVs(4), Bulbs(10)
 */
export const ApplianceItemSchema = z.object({
  name: z.string().min(1).max(100),
  quantity: z.number().int().min(1).max(500),
  wattage: z.number().positive().optional(),
});

/**
 * Step 3B: System component schema for System Configuration flow.
 * Captures inverter, battery, solar panel specs per spec.
 */
export const SystemComponentSchema = z.object({
  type: z.enum(['inverter', 'battery', 'solar_panel', 'charge_controller', 'other']),
  brand: z.string().min(1).max(100).optional(),
  size: z.string().max(50).optional(),       // e.g. '15KVA', '30KWh'
  wattage: z.number().positive().optional(),  // e.g. 620
  quantity: z.number().int().min(1).optional(),
});

/**
 * Enhanced RFQ Creation Schema — Full Multi-Step Wizard
 *
 * Maps directly to Leapter MCP `create_rfq` tool input schema:
 *   - projectType: Residential | Commercial  (Step 1)
 *   - configMode: System | Appliance          (Step 2)
 *   - appliances / components                 (Step 3A / 3B)
 *   - location, budget, timeline              (Step 4)
 *
 * Validation enforces:
 *   - Nigeria-only location
 *   - Appliance mode requires appliances array
 *   - System mode requires components array
 *   - Budget is required and must be positive
 */
export const CreateRfqSchema = z.object({
  projectType: z.enum(['Residential', 'Commercial']),
  configMode: z.enum(['System', 'Appliance']),
  location: z.string().min(2).max(200).optional(),
  location_state: z.enum(NIGERIA_STATES).optional(),
  budget: z.number().positive({ message: 'Budget must be a positive number.' }),
  timeline: z.string().max(200).optional(),
  appliances: z.array(ApplianceItemSchema).optional(),
  components: z.array(SystemComponentSchema).optional(),
}).refine(
  (data) => {
    // Appliance mode requires at least one appliance
    if (data.configMode === 'Appliance') {
      return data.appliances && data.appliances.length > 0;
    }
    return true;
  },
  { message: 'Appliance-based projects must include at least one appliance.', path: ['appliances'] }
).refine(
  (data) => {
    // System mode requires at least one component
    if (data.configMode === 'System') {
      return data.components && data.components.length > 0;
    }
    return true;
  },
  { message: 'System configuration projects must include at least one component.', path: ['components'] }
);

// =====================================
// BIDS
// =====================================

export const SubmitBidSchema = z.object({
  rfq_id: z.string().uuid(),
  amount: z.number().positive(),
  proposed_timeline_days: z.number().int().positive().optional(),
  proposal_text: z.string().min(10),
});

// =====================================
// ESCROW / PAYMENTS
// =====================================

export const InitializePaymentSchema = z.object({
  amount: z.number().positive(),
  milestone_id: z.string().uuid(),
  project_id: z.string().uuid(),
});

export const ReleaseEscrowSchema = z.object({
  escrow_id: z.string().uuid(),
  project_id: z.string().uuid(),
  milestone_id: z.string().uuid(),
});

export const DisputeSchema = z.object({
  project_id: z.string().uuid(),
  escrow_id: z.string().uuid(),
  reason: z.string().min(20).max(1000),
});
