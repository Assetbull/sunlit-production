# SKILL: Module Boundary Enforcement

## PURPOSE
To maintain strict isolation between system dashboards and core services, preventing logic leakage and ensuring independent scalability.

## WHEN TO USE
- Creating new features for a specific dashboard
- Refactoring existing module code
- Reviewing cross-module dependencies

## INPUT
- Dashboard feature requirements
- Current project structure: `/src/dashboards/` and `/src/modules/`

## OUTPUT
- Isolated module logic
- Clean entry points for module-specific functionality
- Validated dependency tree

## EXECUTION STEPS
1. **Identify Module Scope**: Assign every new feature to one of the approved Sprint 1 dashboards:
   - Project Owner
   - Installer
   - CrewLink
   - EPC Contractor
   - Admin
2. **Prevent Logic Leaks**: Ensure `/src/dashboards/[role]` does not import from other dashboard directories.
3. **Externalize Shared Services**: Move logic required by multiple modules (e.g., Payment processing) to `/src/core`.
4. **Enforce RBAC isolation**: Ensure each module's API routes are protected by role-specific middleware derived from `sunlit.ace.yaml`.
5. **Disable Inactive Modules**: Explicitly block any execution in forbidden modules for Sprint 1 (Solar Loan, Supplier, etc.).

## VALIDATION RULES
- Module isolation index = 100% (No unauthorized cross-imports).
- All module communication is asynchronous via the event bus for non-read operations.

## FAILURE CONDITIONS
- Importing EPC logic into the Installer dashboard.
- Modifying core services to accommodate a single module's unconventional requirement.

## DEPENDENCIES
- `.agents/skills/architecture/system-architecture.md`
- `.agents/skills/security/rbac-enforcement.md`
