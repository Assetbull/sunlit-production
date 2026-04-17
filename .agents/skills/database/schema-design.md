# SKILL: Database Schema Design Standard

## PURPOSE
To ensure consistent, normalized, and indexed table structures within the Supabase (PostgreSQL) database.

## WHEN TO USE
- Creating new tables
- Modifying existing relations
- Optimizing database performance

## INPUT
- Data entity requirements
- Performance targets (index needs)

## OUTPUT
- Compliant SQL Schema
- Entity Relationship definitions

## EXECUTION STEPS
1. **Define Core Tables**: Ensure mandatory tables exist: `users`, `roles`, `projects`, `rfq`, `bids`, `payments`, `escrow`, `disputes`, `audit_logs`, `kyc_records`, `event_logs`.
2. **Apply Normalization**: Reduce redundancy by splitting entities into logical tables (e.g., `user_profiles` vs `roles`).
3. **Use UUIDs**: Standardize on UUID for primary keys across the entire system.
4. **Enforce Foreign Key Integrity**: Link all related entities via explicit constraints.
5. **Implement Indexing**: Add indexes on frequently queried fields (`user_id`, `project_id`, `status`, `created_at`).

## VALIDATION RULES
- No table can exist without Row-Level Security (RLS) enabled.
- All timestamps must use `TIMESTAMPTZ`.

## FAILURE CONDITIONS
- Using serial integers for primary keys.
- Missing foreign key indexes causing `n+1` performance degradation.

## DEPENDENCIES
- `.agents/skills/database/rls-policies.md`
