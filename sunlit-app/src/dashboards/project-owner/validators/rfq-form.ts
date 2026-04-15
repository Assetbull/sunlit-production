import { z } from 'zod';
import { NIGERIA_STATES } from '../types/dashboard';

/**
 * Client-side form validators for the Project Owner Dashboard.
 * These mirror the server-side schemas in shared/validators/schemas.ts
 * but are safe for client-side use (no server imports).
 */

export const CreateRfqFormSchema = z.object({
    projectTitle: z.string().min(5, 'Project title must be at least 5 characters').max(255),
    description: z.string().min(10, 'Description must be at least 10 characters').optional().or(z.literal('')),
    locationState: z.enum(NIGERIA_STATES as readonly [string, ...string[]], {
        message: 'Please select a valid Nigerian state',
    }),
    locationCity: z.string().min(2, 'City name must be at least 2 characters'),
    projectType: z.enum(['Residential', 'Commercial'] as [string, ...string[]]),
    appliances: z.array(z.string()).min(1, 'Select at least one appliance'),
    systemSizeKw: z.coerce.number().positive('System size must be greater than 0'),
    budgetRangeMin: z.coerce.number().positive('Minimum budget must be greater than 0'),
    budgetRangeMax: z.coerce.number().positive('Maximum budget must be greater than 0'),
    timelineDays: z.coerce.number().int().positive('Timeline must be at least 1 day'),
}).refine(
    (data) => data.budgetRangeMax > data.budgetRangeMin,
    { message: 'Maximum budget must be greater than minimum budget', path: ['budgetRangeMax'] }
);

export const DisputeFormSchema = z.object({
    projectId: z.string().uuid('Invalid project ID'),
    escrowId: z.string().uuid('Invalid escrow ID'),
    reason: z.string().min(20, 'Reason must be at least 20 characters').max(1000, 'Reason cannot exceed 1000 characters'),
});

export type CreateRfqFormValues = z.infer<typeof CreateRfqFormSchema>;
export type DisputeFormValues = z.infer<typeof DisputeFormSchema>;
