# SKILL: Bid Management Workflow

## PURPOSE
To manage the lifecycle of bids from submission by Installers to acceptance by Project Owners.

## WHEN TO USE
- An Installer responds to an RFQ
- A Project Owner reviews/compares bids
- Finalizing a bid selection

## INPUT
- RFQ ID
- Bid details (Equipment, Price, Duration, Warranty)

## OUTPUT
- Bid record in DB
- `bid_submitted` or `contract_signed` event
- Linked project state update

## EXECUTION STEPS
1. **Validate Installer**: Ensure bidder has `installer` role and verified KYC.
2. **Submit Bid**: Store bid details linked to RFQ ID. Emit `bid_submitted`.
3. **Comparison Layer**: Present bids in a structured comparison table for Project Owner.
4. **Accept Bid**: Project Owner selects bid. RFQ state moves to `LOCKED`.
5. **Contract Generation**: Generate project contract and emit `contract_signed`.

## VALIDATION RULES
- Multiple bids per installer per RFQ are forbidden.
- Accepting a bid must lock all other bids for that RFQ.

## FAILURE CONDITIONS
- RFQ status not transition to LOCKED after selection.
- Bypassing the contract generation phase.

## DEPENDENCIES
- `.agents/skills/events/event-publishing.md`
- `.agents/skills/security/escrow-rules.md`
