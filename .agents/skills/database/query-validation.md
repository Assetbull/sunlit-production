# SKILL: Query Optimization & Validation

## PURPOSE
To ensure all database interactions are performant, safe, and parameterised.

## WHEN TO USE
- Writing new data fetching logic in DataService
- Debugging slow API responses
- Reviewing SQL/Supabase client usage

## INPUT
- Raw query or client-side filter
- Target performance SLA (< 100ms for interaction)

## OUTPUT
- Optimized and safe data request

## EXECUTION STEPS
1. **Use Parameterized Queries**: Never concatenate strings into SQL. Use Supabase client filters or prepared statements.
2. **Apply Pagination**: Enforce limits and offsets for all list queries (`bids`, `projects`, `logs`).
3. **Select Specific Columns**: Do not use `SELECT *`. Only fetch exactly what the UI needs.
4. **Verify Index Usage**: Use `EXPLAIN ANALYZE` for complex queries to confirm index hits.
5. **Fail-Fast on Large Results**: Reject queries that would return > 1000 records without explicit pagination.

## VALIDATION RULES
- No direct database access outside the `DataService` layer.

## FAILURE CONDITIONS
- Raw SQL detected in frontend or non-core service code.
- Query nesting beyond 3 levels deep.

## DEPENDENCIES
- `.agents/skills/database/schema-design.md`
