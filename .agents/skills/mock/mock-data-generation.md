# SKILL: Mock Data Seeding Logic

## PURPOSE
To populate the UI and test environment with rich, realistic, and consistent dummy data.

## WHEN TO USE
- Initializing local development
- Demonstrating dashboard capabilities to stakeholders
- Generating regression test scenarios

## INPUT
- Target Object (e.g., RFQ, Bid, Project)
- Geographic/Persona context

## OUTPUT
- Record-set (JSON Array)

## EXECUTION STEPS
1. **Assign Realistic Values**: Use valid Nigerian names, phone numbers (+234), and addresses.
2. **Ensure Temporal Logic**: Timestamps must be sequential (Project Created < Contract Signed < Milestone Approved).
3. **Link Relationships**: Maintain referential integrity (Bid `projectId` must match an existing Project `id`).
4. **Variety in Status**: Provide a mix of `PENDING`, `COMPLETED`, and `DISPUTED` records to test all UI states.
5. **Asset-Specific Data**: For PV systems, include logical pairings (e.g., 5KVA Inverter with 10KWh Battery).

## VALIDATION RULES
- Mock data must be deterministic (same seeds produce same results).

## FAILURE CONDITIONS
- Data that causes UI breakage due to missing optional fields.
- Using generic "Lorem Ipsum" instead of industry-specific terms (KVA, KWp, KWh).

## DEPENDENCIES
- `.agents/skills/testing/scenario-generation.md`
