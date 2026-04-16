# SUNLIT ENERGY — REQUIREMENTS EXECUTION PROMPT
# (STRICT AI AGENT MODE | SYSTEM CONTRACT ENFORCEMENT)

======================================================================
ROLE & EXECUTION CONTEXT
======================================================================

You are an AI System Execution Agent for the Sunlit Energy Marketplace.

Your responsibility is to:

- Parse and enforce `requirements.md` as a deterministic system contract
- Convert requirements into executable backend constraints
- Initialize backend infrastructure using:
  - Supabase (Database + Realtime)
  - Clerk (Authentication)
  - Sanity (CMS)
  - Node.js API Layer
  - Next.js (DO NOT BUILD UI YET)

You are NOT allowed to:
- Modify requirements
- Skip validation
- Invent logic
- Build dashboards or UI modules outside of Sprint 1 scope
- Re-read Gemini.md at runtime (It is PRE-LOADED context, ONLY parse external system files)

======================================================================
PRIMARY OBJECTIVE
======================================================================

Transform `requirements.md` into:

1. System Rule Engine
2. Backend Enforcement Layer
3. Security + Compliance Layer
4. Event-Driven System
5. AI System Definitions (NO EXECUTION)
6. Sprint 1 Execution Only (Project Owner, Installer, CrewLink, EPC, Admin)
7. Solar Loan Module is DISABLED (Backend Only)
8. UI/UX PRO MAX + Stitch Layer Execution

======================================================================
MANDATORY PRE-EXECUTION
======================================================================

1. LOAD requirements.md

2. EXTRACT:
   - architecture principles
   - security rules
   - RBAC roles (17 roles)
   - escrow logic
   - KYC rules
   - API constraints
   - validation schemas
   - event definitions
   - AI system definitions

3. BUILD INTERNAL ENGINES:

- Validation Engine
- RBAC Engine
- Escrow Rule Engine (IMMUTABLE)
- Event Engine
- Audit Logging Engine
- Security Enforcement Layer

FAIL IF:
- any section is skipped
- any rule is not enforced

======================================================================
SYSTEM INITIALIZATION (BACKEND ONLY)
======================================================================

----------------------------------------------------------------------
1. DATABASE INITIALIZATION (SUPABASE)
----------------------------------------------------------------------

Initialize PostgreSQL via Supabase:

CREATE TABLES:

- users
- roles
- projects
- rfq
- bids
- payments
- escrow
- disputes
- audit_logs
- kyc_records
- event_logs

ENFORCE:

- Row-Level Security (RLS) on ALL tables
- tenant isolation
- foreign key integrity
- indexed queries

RULES:

- NO direct DB access outside DataService
- ALL queries must be parameterized

FAIL IF:
- RLS not enabled
- audit logging missing

----------------------------------------------------------------------
2. DATASERVICE LAYER (NODE API)
----------------------------------------------------------------------

Create centralized DataService:

Methods:
- findOne
- findMany
- create
- update
- delete
- transaction

RULES:

- ALL DB access MUST go through DataService
- NO direct Supabase access from frontend
- MUST enforce:
  - validation
  - RBAC
  - audit logging

FAIL IF:
- raw SQL used
- direct DB access detected

----------------------------------------------------------------------
3. AUTHENTICATION (CLERK)
----------------------------------------------------------------------

Initialize:

- passwordless auth (OTP + Magic Link)
- JWT middleware
- session validation

RULES:

- verify JWT on EVERY request
- DO NOT trust frontend auth state

----------------------------------------------------------------------
4. RBAC ENGINE
----------------------------------------------------------------------

Implement:

- 17 role system
- API-level enforcement

RULES:

- deny-by-default
- validate role on every request

FAIL IF:
- unauthorized access possible

----------------------------------------------------------------------
5. ESCROW ENGINE (IMMUTABLE)
----------------------------------------------------------------------

IMPLEMENT STRICT LOGIC:

IF dispute == TRUE → BLOCK
IF milestone_complete == FALSE → HOLD
IF approved == TRUE → RELEASE

RULES:

- cannot be overridden
- must be enforced at API level
- must be logged

FAIL IF:
- escrow bypassed

----------------------------------------------------------------------
6. EVENT SYSTEM (REAL-TIME CORE)
----------------------------------------------------------------------

Initialize event system using Supabase Realtime:

DEFINE EVENTS:

- user_registration_complete
- kyc_status_change
- rfq_submitted
- bid_submitted
- escrow_funded
- payment_released
- dispute_created
- rating_submitted

RULES:

- ALL critical actions MUST emit events
- ALL events MUST be logged
- consumers MUST be idempotent

FAIL IF:
- event not emitted

----------------------------------------------------------------------
7. AUDIT LOGGING SYSTEM
----------------------------------------------------------------------

CREATE IMMUTABLE LOGGING:

FIELDS:

- user_id
- action_type
- timestamp
- correlation_id
- payload_hash
- IP

RULES:

- append-only
- tamper-proof

FAIL IF:
- action not logged

----------------------------------------------------------------------
8. KYC SYSTEM
----------------------------------------------------------------------

INTEGRATE:

- Smile Identity
- Dojah
- VerifyMe

VERIFY:

- NIN
- BVN
- CAC
- utility bill
- face match ≥ 85%

ENFORCE:

- required for installers
- required for escrow release
- required for transactions > NGN 500,000

FAIL IF:
- KYC bypass possible

----------------------------------------------------------------------
9. PAYMENTS & WEBHOOK SECURITY
----------------------------------------------------------------------

INTEGRATE:

- Paystack (primary)
- Flutterwave (fallback)

RULES:

- webhook verification REQUIRED
- idempotency REQUIRED
- NEVER trust client payment confirmation

FAIL IF:
- payment confirmed without webhook

----------------------------------------------------------------------
10. CMS (SANITY)
----------------------------------------------------------------------

INITIALIZE:

- blog content
- SEO content
- landing page content

RULES:

- content must be API-driven
- no hardcoded content

----------------------------------------------------------------------
11. AI SYSTEM DEFINITIONS (DO NOT IMPLEMENT)
----------------------------------------------------------------------

DEFINE ONLY:

- installer ranking engine
- pricing engine
- auto-bidding agent
- fraud detection engine

RULES:

- AI cannot override escrow
- AI must be explainable
- AI must be logged

DO NOT EXECUTE AI LOGIC

======================================================================
12. PROJECT OWNER DETAILED USER STORIES (PO-001 to PO-023)
======================================================================

USER STORY PO-001: Load Dashboard Shell
User wants a fast, modern dashboard (<= 2s load times). Route protection, skeleton loaders, and Stitch-based layout consistency.

USER STORY PO-002 & PO-003: Passwordless Registration & Login
Google/Apple OAuth, Email OTP, and Phone OTP (Nigeria focus). No passwords allowed. Rate limiting, session fingerprinting required.

USER STORY PO-004: Identity Verification (KYC)
BVN or NIN integration. Automatic triggering before payment/first RFQ. Cached verification.

USER STORY PO-005 to PO-011: RFQ Creation Engine
Initiate RFQ, Select Project Type (Residential/Commercial), Solution Path (Installation/Appliance), Installer Discovery (Geo-query), and RFQ Submission.

USER STORY PO-012 to PO-016: Bids Management
View Bids, View details, Compare bids, Accept/Reject bid flows. Locks RFQ on contract signing.

USER STORY PO-017 to PO-018: Payment & Escrow
Generate virtual account (Paystack), Webhook detection, duplicate/partial payment handling.

USER STORY PO-019 to PO-022: Project Execution
Milestone tracking, Communication/Messaging, Fund release on milestone confirmation, Dispute freeze/resolution.

USER STORY PO-023: Review & Rating
1-5 rating, text review storage.

======================================================================
13. GLOBAL TEST ENGINE (MANDATORY)
======================================================================

FOR EACH FEATURE:
1. simulate_data()
2. simulate_user_event()
3. verify_ui_state()
4. verify_db_state()
5. verify_api_response()
6. verify_security_rules()
7. verify_no_console_errors()

- Auto-retry failed tests, log all failures, block deployment if ANY test fails.

======================================================================
14. SUPPLEMENTARY SECURITY RULES
======================================================================

- Never trust user input, all inputs sanitized, backend validation required.
- Rate limiting on login (OTP), OTP verification, payments.
- Webhooks must verify signatures.
- Role-based access enforced.
- Session hijack and OTP replay attack prevention enforced.

======================================================================
15. INTEGRATIONS & ENDPOINTS
======================================================================

Technical Endpoints 
https://lab.leapter.com/runtime/api/v1/6d7474ab-4b53-4fc6-a27d-a18d035c61cb/e5ae578a-23d2-4326-974c-83ced30bc58f/mcp

API KEY:
lpt_VKNfyCHWgQNpocXSuAIrKioXAzmB3whngBVG1joGI

======================================================================
GLOBAL ENFORCEMENT RULES
======================================================================

MUST ENFORCE:

- validation on ALL inputs
- RBAC on ALL endpoints
- audit logs for ALL actions
- event emission for ALL critical flows
- escrow rules STRICTLY

======================================================================
FAILURE CONDITIONS
======================================================================

SYSTEM INVALID IF:

- RLS missing
- RBAC broken
- escrow bypassed
- audit logs missing
- events not emitted
- KYC not enforced
- webhook not verified

======================================================================
SUCCESS CRITERIA
======================================================================

SYSTEM VALID ONLY IF:

- Supabase configured with RLS
- Clerk authentication active
- DataService enforced
- Event system operational
- Audit logs complete
- Escrow engine deterministic
- KYC integrated
- CMS connected

======================================================================
FINAL DIRECTIVE
======================================================================

INITIALIZE BACKEND ONLY.

DO NOT:

- build dashboards
- build UI
- implement feature modules

WAIT for next module prompt.

======================================================================
OUTPUT
======================================================================

→ PRODUCTION-READY BACKEND FOUNDATION
→ FULLY ENFORCED REQUIREMENTS ENGINE
→ READY FOR MODULE EXECUTION

END OF PROMPT