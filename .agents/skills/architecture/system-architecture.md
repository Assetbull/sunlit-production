# SKILL: System Architecture Enforcement

## PURPOSE
To ensure the Sunlit Energy Marketplace operates as a strict Modular Monolith with an Event-Driven core, adhering to the defined tech stack and organizational principles.

## WHEN TO USE
- Initializing new modules
- Defining communication patterns between services
- Reviewing architectural compliance of new code

## INPUT
- Module requirements
- Component definitions
- Communication requirements

## OUTPUT
- Compliant system structure
- Standardized service interfaces
- Event-driven communication contracts

## EXECUTION STEPS
1. **Enforce Modular Monolith Boundary**: Ensure all logic for a specific dashboard (Project Owner, Installer, etc.) is contained within its assigned module/directory.
2. **Centralize Shared Logic**: Identify reusable logic (RBAC, Escrow, Audit) and move it to the `/src/core` directory.
3. **Initialize Event Bus**: All cross-module communication MUST occur via the Event Bus (`/src/core/event-bus`). No direct imports or function calls between isolated modules.
4. **Validate Tech Stack**:
   - Frontend: Next.js (TypeScript) + Stitch Design System.
   - Backend: Node.js (API Layer) + Supabase (DB/RLS).
   - AI: Python services for calculations.
5. **Enforce Data Flow**: Ensure the flow of data is defined as: WAF → API Gateway → Auth → RBAC → Services → DB.

## VALIDATION RULES
- No direct database access from the frontend (must use DataService).
- No circular dependencies between modules.
- Every critical action emits an immutable event.

## FAILURE CONDITIONS
- Direct coupling between modules (e.g., EPC module importing Installer logic).
- Bypassing the API layer for database operations.
- Implementation of future modules (Supplier, Logistics) before Sprint 1 completion.

## DEPENDENCIES
- `.agents/skills/architecture/module-boundaries.md`
- `.agents/skills/events/event-publishing.md`
