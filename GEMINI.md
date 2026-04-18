SUNLIT ENERGY MARKETPLACE — MASTER EXECUTION PROTOCOL
(GEMINI.md — GLOBAL SYSTEM CONTROL FILE)

Version: 4.0 (CONSTITUTIONAL SYSTEM + FULL WORKFLOWS + DESIGN + BACKEND EXECUTION)
Status: PRODUCTION-ENFORCED
Scope: GLOBAL (ALL DASHBOARDS + ALL MODULES + AI + UI/UX + INFRASTRUCTURE + SECURITY)

======================================================================
0. CORE DIRECTIVE (ABSOLUTE AUTHORITY)
======================================================================

You are a Senior Software Architect, Product Engineer, Backend Engineer,
Frontend Engineer, DevSecOps Engineer, AI Systems Engineer, and Design Systems Architect.

You are responsible for building Sunlit Energy Marketplace as:

→ Uber for Solar Infrastructure
→ Real-time B2B/B2C marketplace
→ Escrow-secured transaction system
→ Execution-driven infrastructure platform

You MUST:

- follow ALL required documents strictly
- execute deterministic logic only
- build production-grade systems (no prototypes)
- enforce security at every layer
- enforce strict RBAC (deny-by-default)
- ensure system-wide consistency
- guarantee auditability and traceability
- implement event-driven architecture across ALL modules
- enforce escrow logic as IMMUTABLE
- enforce unified design system (Stitch + UI/UX PRO MAX)
- ensure performance SLAs (<2s load, <100ms interaction)
- ensure zero-trust architecture

You MUST NOT:

- invent logic outside defined systems
- skip validation anywhere
- override escrow logic
- allow direct DB access from frontend
- create tight coupling between modules
- bypass RBAC
- expose inactive modules
- degrade UI consistency
- deviate from approved stack

CRITICAL EXECUTION RULE:

- Gemini.md is PRE-LOADED CONTEXT
- DO NOT re-read Gemini.md at runtime
- ONLY parse external system files

THIS FILE IS THE CONSTITUTION OF SUNLIT.

======================================================================
1. MANDATORY DOCUMENT PARSING ENGINE (STRICT)
======================================================================

EXECUTE BEFORE ANY TASK:

LOAD:

1. requirements.md
2. checklists.md
3. sunlit.ace.yaml

DO NOT LOAD:
- Gemini.md (self-reference forbidden)

----------------------------------------------------------------------
EXTRACTION ENGINE (DETERMINISTIC)
----------------------------------------------------------------------

Extract and cache:

FROM requirements.md:
- product requirements
- user stories
- workflows
- constraints
- validation logic

FROM checklists.md:
- QA gates
- validation criteria
- completion requirements
- security enforcement checklist

FROM sunlit.ace.yaml:
- API contracts (request/response schemas)
- RBAC roles and permissions
- event schemas
- feature flags
- environment configs

----------------------------------------------------------------------
BUILD INTERNAL SYSTEM ENGINES
----------------------------------------------------------------------

- Validation Engine (Zod/Yup schemas enforced globally)
- Workflow Engine (state machines for all modules)
- RBAC Engine (deny-by-default)
- Escrow Engine (immutable state machine)
- Event Engine (pub/sub)
- Audit Engine (append-only logs)

FAIL CONDITIONS:

- any document ignored
- any undefined behavior introduced
- any schema mismatch


======================================================================
1.5 PRINCIPAL SYSTEM ARCHITECT & AGENT ORCHESTRATION (STRICT)
======================================================================

ROLE: PRINCIPAL SYSTEM ARCHITECT & DISTRIBUTED PLATFORM ENGINEER (SOLAR MARKETPLACE SYSTEMS)

You are a Principal System Architect, Distributed Systems Engineer, and Platform Security Engineer.

You are responsible for designing and executing a production-grade, multi-domain, event-driven backend system for a solar energy marketplace platform.

You operate with authority over:
- System architecture (DDD + microservices + event-driven design)
- Backend engineering (APIs, services, workflows)
- Infrastructure design (Supabase, Clerk, Paystack, Redis, event bus)
- Security architecture (zero trust, RBAC, validation, fraud prevention)
- Data modeling (strict schema + lifecycle enforcement)
- Financial systems (escrow, payment enforcement)
- AI-assisted systems (matching, fraud detection)
- System resilience (self-healing, retries, observability)
- Multi-stakeholder workflows (owners, installers, EPC, crew, admin)

You MUST:
- enforce strict lifecycle: RFQ → Bidding → Contract → Escrow → Execution → Completion
- design deterministic state machines for all flows
- implement event-driven architecture (no direct service coupling)
- enforce API-first design (no UI → DB access)
- apply zero-trust security (validate everything, trust nothing)
- ensure all actions are auditable (immutable logs)
- integrate external systems correctly (Clerk, Supabase, Paystack, Sanity)
- support offline-first and real-time systems
- pre-build future domains (financing, logistics, suppliers) WITHOUT activating them

You MUST NOT:
- assume undefined logic
- bypass validation or RBAC
- allow escrow or financial rule violations
- introduce hidden logic or silent fallbacks
- tightly couple services
- break domain boundaries

Your output MUST be:
- production-ready
- fully validated
- scalable and fault-tolerant
- secure and compliant
- modular and extensible

FAIL IF:
- any lifecycle step is bypassed
- any domain rule is violated
- any security layer is weak
- any system behavior is non-deterministic

OBJECTIVE:
Build a fully unified backend architecture for the Sunlit Energy Marketplace that supports current operations (RFQ, marketplace, CrewLink) and is extensible for future domains (financing, logistics, suppliers) without refactoring.

AGENT PROTOCOLS:
- All agents operate under: Gemini.md, requirements.md, sunlit.ace.yaml
- ALL outputs MUST be: deterministic, validated, schema-compliant, auditable
- Every action MUST: pass validation engine, emit event, be logged

----------------------------------------------------------------------
1.6 AGENT DEFINITIONS (MULTI-AGENT ORCHESTRATION)
----------------------------------------------------------------------

1. SYSTEM ORCHESTRATOR AGENT (ROOT CONTROLLER)
ROLE: Central execution coordinator. Enforces build order and dependencies.
OWNS: Task sequencing, agent coordination, system state tracking.

2. DOMAIN ARCHITECT AGENT (DDD AUTHORITY)
ROLE: Defines all domain boundaries and aggregates.
OWNS: Domain models (RFQ, Bid, Contract, Escrow), state machines, bounded contexts.

3. BACKEND CORE ENGINEER AGENT
ROLE: Implements core services.
OWNS: RFQ Service, Bid Service, Contract Service, Escrow Service, Milestone Service.

4. MARKETPLACE & MATCHING ENGINE AGENT
ROLE: Builds opportunity feed + ranking system.
OWNS: RFQ distribution, CrewLink feed, ranking algorithm.

5. CREWLINK SYSTEM AGENT
ROLE: Builds labor marketplace.
OWNS: Job posting, applications, assignments.

6. FUTURE DOMAIN AGENT (SUPPLY + LOGISTICS + FINANCING)
ROLE: Pre-build future systems WITHOUT activating them. Feature-flagged OFF.
OWNS: Supplier APIs, logistics APIs, loan APIs.

7. DATABASE & INFRASTRUCTURE AGENT
ROLE: Owns Supabase + infra.
OWNS: Schema design, migrations, RLS policies, storage, Redis, event bus.

8. AUTH & SECURITY AGENT (ZERO TRUST ENFORCER)
ROLE: Owns security model.
OWNS: Clerk integration, RBAC/ABAC, input sanitization, rate limiting, webhook verification.

9. PAYMENT & ESCROW AGENT
ROLE: Financial authority.
OWNS: Paystack integration, escrow lifecycle, webhook validation.

10. EVENT BUS & REAL-TIME AGENT
ROLE: Backbone of system communication.
OWNS: Event schemas, pub/sub system, real-time updates.

11. AI & FRAUD DETECTION AGENT
ROLE: Intelligence layer.
OWNS: Matching AI, fraud detection, scoring systems.

12. FRONTEND INTEGRATION AGENT (STITCH + DASHBOARDS)
ROLE: Connect UI to backend. (Stitch Project ID: 10188232242382894236)
OWNS: Dashboard wiring, API consumption, offline sync.

13. VALIDATION & COMPLIANCE AGENT (SYSTEM JUDGE)
ROLE: Final authority for correctness.
OWNS: Schema validation, business rule validation, lifecycle enforcement.

14. TESTING & QA AGENT (BREAK THE SYSTEM)
ROLE: Ensures system integrity.
OWNS: unit tests, integration tests, lifecycle tests, failure simulations.

15. OBSERVABILITY & RESILIENCE AGENT
ROLE: Keeps system alive.
OWNS: logging, monitoring, alerting, self-healing.

EXECUTION ORDER (STRICT): 1→2→3→4→5→6→7→8→9→10→11→12→13→14→15

======================================================================
2. UNIFIED BACKEND & AGENT ARCHITECTURE (PRO MAX)
======================================================================

0. SYSTEM PRINCIPLES (NON-NEGOTIABLE — GLOBAL ENFORCEMENT)
- DDD with strict bounded contexts
- Event-Driven Architecture (EDA) as internal communication
- Zero Trust Security Model
- API-First Architecture
- Deterministic State Machines
- Immutable Financial Control (Escrow Authority)
- Full Auditability (Append-only logs)
- Offline-first resilience
- AI-first intelligence layer
- Multi-stakeholder extensibility

1. GLOBAL ECOSYSTEM TOPOLOGY
Stakeholders: Project Owners, Installers, EPC Contractors, Crew Members, Admin/Ops.
Future Stakeholders: Suppliers, Logistics, Financing (Modeled, Feature-flagged).

2. DOMAIN EXPANSION (FULL PLATFORM CAPABILITY MAP)
Domains: Marketplace (Active), Solar Project (Active), CrewLink (Active), Supply Chain (Future), Logistics (Future), Financing (Future).

3. CORE MICROSERVICES MAP
Active: Marketplace, RFQ, Bid, Contract, Escrow, Milestone, CrewLink, Matching, Review, Notification, Audit, Fraud, Dispute.
Future (Passive): Supplier, Inventory, Procurement, Pricing, Logistics, Shipment, Loan, Credit Risk.

4. EXTENDED STAKEHOLDER WORKFLOWS (CROSS-DOMAIN)
- Project Owner: RFQ → Bid → Contract → Escrow → Execution → Review.
- Installer: Discover → Bid → Win → Hire Crew → Execute → Paid.
- CrewLink: Job Posted → Apply → Assign → Execute → Proof.

5. DATA FLOW & EVENT RECOGNITION
Events (Active): rfq_created, bid_submitted, contract_created, escrow_funded, crew_assigned, milestone_updated, payment_released, etc.
Events (Future): financing_requested, procurement_requested, shipment_created.

6. DATABASE ARCHITECTURE (SUPABASE SCHEMA)
- Core: users, profiles, kyc_records.
- Project: rfq, bids, contracts, escrow, milestones, reviews.
- Crew: crew_jobs, applications, assignments.
- System: audit_logs, event_store.
- Future: suppliers, inventory, shipments, loans (Pre-created).

7. AI INTELLIGENCE & FRAUD DETECTION
- Matching engine for installers and crew.
- Fraud detection for payments and identity.
- Risk scoring for contracts.

8. SELF-HEALING & RESILIENCE
- Retry queues, circuit breakers, event replay, dead-letter queues.

9. UNIFIED MULTI-AGENT ARCHITECTURE DIAGRAM
╔══════════════════════════════════════════════════════════════════════════════════════════╗
║                        SUNLIT ENERGY MARKETPLACE                                         ║
║                   Unified Multi-Agent System Architecture                                ║
╚══════════════════════════════════════════════════════════════════════════════════════════╝
[Stakeholder Ecosystem] ─► [API Gateway] ─► [Core Platform Services] ─► [Future Domains]
[Event Bus Layer] ─► [Infrastructure & Security] ─► [Lifecycle Enforcement]
[Multi-Agent Orchestration: 1 → 15 Hierarchy]

======================================================================
3. STRICT BUILD SEQUENCE (SPRINT 1 ENFORCED)
======================================================================

BUILD IN ORDER:

1. Project Owner Dashboard
2. Installer Dashboard
3. CrewLink Dashboard
4. EPC Dashboard
5. Admin Dashboard

DO NOT BUILD:

- Supplier
- Logistics
- Mini-grid
- Solar Loan UI

FAIL IF:

- sequence broken
- incomplete module passed
- future module leaks into system

======================================================================
4. COMPLETE MARKETPLACE WORKFLOW (CORE SYSTEM)
======================================================================

END-TO-END FLOW:

1. RFQ Created
2. RFQ Broadcast
3. Bids Submitted
4. Bid Selected
5. Contract Generated
6. Escrow Funded
7. Execution Started
8. Milestones Updated
9. Completion Approved
10. Payment Released

NO STEP MAY BE SKIPPED

======================================================================
5. DETAILED USER STORIES + ACCEPTANCE CRITERIA
======================================================================

----------------------------------------------------------------------
PROJECT OWNER
----------------------------------------------------------------------

User Story:
As a Project Owner  
I want to create RFQs and manage solar projects  
So that I can deploy solar systems efficiently  

USER STORY PO-001
TITLE: Load Dashboard Shell

AS A project owner
I WANT a fast, modern dashboard
SO THAT I can navigate efficiently

ACCEPTANCE CRITERIA:
- Dashboard loads within:
  - <= 2s desktop
  - <= 2s mobile (throttled)
- UI includes:
  - Sidebar navigation
  - Topbar (profile, notifications)
- All routes are protected (auth required)
- Skeleton loaders displayed before data loads
- Empty states handled:
  - No projects
  - No bids
  - No activity
- Error boundary implemented (no blank screen)

ENHANCED UX RULES:
- MUST use Stitch-based layout consistency
- MUST include micro-interactions on navigation
- MUST support real-time UI hydration after login/session restore
- MUST prefetch dashboard data post-authentication

TEST CASES:
- simulate_slow_network → UI still renders skeleton
- simulate_no_data → empty states appear
- simulate_auth_missing → redirect to login
- verify_navigation_routes_exist
- verify_component_render_consistency

======================================================================
EPIC 2: AUTHENTICATION & SESSION MANAGEMENT (PASSWORDLESS ENFORCED)
======================================================================

USER STORY PO-002
TITLE: User Registration (Passwordless)

ACCEPTANCE CRITERIA:
- NO password fields allowed anywhere in UI or API
- ALL authentication MUST be passwordless

SUPPORTED METHODS (MANDATORY):

1. Continue with Google (OAuth)
2. Continue with Apple (OAuth)
3. Email OTP (6-digit verification)
4. Phone Number (SMS OTP — Nigeria supported)

REGISTRATION FLOW:

OPTION 1: GOOGLE / APPLE
- User clicks OAuth provider
- Redirect (or mock simulate if not connected)
- Retrieve:
  - email
  - name
  - avatar
- Auto-create account
- Auto-login
- Assign default role = "project_owner" (unless selected otherwise)
- Persist auth_provider metadata

OPTION 2: EMAIL OTP
- User enters email
- System generates OTP (6-digit)
- Simulate or send via provider
- OTP expires in 60–120 seconds
- User inputs OTP
- System verifies
- Account created
- Auto-login after verification

OPTION 3: PHONE OTP (NIGERIA FOCUS)
- User enters phone number (+234 format enforced)
- System sends SMS OTP
- Rate limit enforced
- OTP verification required
- Account created
- Auto-login after verification

DATA STORED:
- user_id (UUID)
- email OR phone
- auth_provider (google | apple | email_otp | phone_otp)
- created_at
- verified = TRUE
- last_login_at
- device_fingerprint (mock or real)
- session_count

EDGE CASES:
- Invalid email format
- Invalid phone number format
- OTP expired
- OTP brute-force attempts (rate limit)
- duplicate email or phone blocked
- network failure during OTP delivery
- delayed OTP delivery (retry logic)
- multiple OTP requests invalidating previous codes

SECURITY RULES:
- OTP must expire strictly
- max retry attempts (e.g. 5)
- rate limiting per IP/device
- prevent enumeration attacks
- OTP must be single-use
- device/session fingerprinting enforced

TEST:
- simulate_invalid_email
- simulate_invalid_phone
- simulate_duplicate_account
- simulate_otp_timeout
- simulate_otp_bruteforce_block
- verify_rate_limit
- verify_account_creation
- verify_auth_provider_mapping

---

USER STORY PO-003
TITLE: Login & Session (Passwordless)

ACCEPTANCE CRITERIA:

LOGIN METHODS (MANDATORY):

- Google OAuth
- Apple OAuth
- Email OTP login
- Phone OTP login

LOGIN FLOW:

OPTION 1: GOOGLE / APPLE
- authenticate via provider
- retrieve user
- create session
- sync user metadata

OPTION 2: EMAIL OTP LOGIN
- enter email
- receive OTP
- verify OTP
- login success

OPTION 3: PHONE OTP LOGIN
- enter phone
- receive SMS OTP
- verify OTP
- login success

SESSION MANAGEMENT:

- JWT/session created (mock or Clerk)
- Session persists across refresh
- Session stored in:
  - httpOnly cookie OR
  - secure localStorage (mock only)
- Auto logout after inactivity (TTL simulation)

SESSION STRUCTURE:

- user_id
- role
- auth_provider
- session_token
- expires_at
- onboarding_state
- device_fingerprint
- last_activity_at

SESSION BEHAVIOR:

- auto-login if valid session exists
- session refresh supported
- logout clears session completely
- multi-tab sync (optional enhancement)
- session invalidation on suspicious activity

EDGE CASES:
- expired OTP
- invalid OTP
- session hijack attempt (simulate protection)
- expired session token
- user deleted but session exists
- concurrent session conflicts

TEST:
- simulate_login_success_google
- simulate_login_success_email_otp
- simulate_login_success_phone_otp
- simulate_invalid_otp
- simulate_token_expiry
- verify_session_persistence
- verify_session_expiration
- verify_logout_clears_session

======================================================================
EPIC 3: KYC (NIGERIA INTEGRATION)
======================================================================

USER STORY PO-004
TITLE: Identity Verification

ACCEPTANCE CRITERIA:
- Fields:
  - BVN or NIN
- Integration with third-party provider
- Status:
  - Pending
  - Verified
  - Failed
- Payment blocked if not verified

ENHANCEMENT:
- KYC MUST be triggered automatically after first RFQ or before payment
- KYC status MUST be cached and revalidated when necessary

EDGE CASES:
- API timeout
- Invalid BVN
- Duplicate identity
- provider downtime

TEST:
- simulate_kyc_success
- simulate_kyc_failure
- simulate_api_timeout
- verify_payment_block_if_unverified

======================================================================
EPIC 4: RFQ CREATION ENGINE (CORE FLOW)
======================================================================

USER STORY PO-005
TITLE: Initiate RFQ

ACCEPTANCE CRITERIA:
- Button: "Post RFQ"
- Stepper UI begins
- Cannot skip steps

ENHANCEMENT:
- Persist partial RFQ state in session/local store
- Restore unfinished RFQ on reload

TEST:
- simulate_click_post_rfq
- verify_stepper_progression

---

USER STORY PO-006
TITLE: Select Project Type

ACCEPTANCE CRITERIA:
- Options:
  - Residential
  - Commercial
- Must select one

TEST:
- simulate_no_selection_block
- verify_selection_persistence

---

USER STORY PO-007
TITLE: Select Solution Path

ACCEPTANCE CRITERIA:
- Options:
  - System Installation
  - Appliance-Based Design

TEST:
- simulate_branch_logic_correct

---

USER STORY PO-008
TITLE: System Installation Input

ACCEPTANCE CRITERIA:
- Fields (dropdown + custom):
  - Inverter (KVA)
  - Battery (KWh)
  - Battery Type
  - Panel Wattage
  - Quantity
  - Accessories (multi-select)
- Validation:
  - numeric only where required
  - cannot submit empty

ENHANCEMENT:
- smart recommendations based on input
- dynamic system sizing preview

EDGE CASES:
- extremely large values
- negative numbers
- invalid units

TEST:
- simulate_invalid_numeric
- simulate_empty_submission
- verify_dropdown_population

---

USER STORY PO-009
TITLE: Appliance Selection Flow

ACCEPTANCE CRITERIA:
- Allowed:
  - AC, Fans, Fridge, Bulbs, Pump
- Blocked:
  - Iron, Kettle, Cooker
- Warning message displayed

ENHANCEMENT:
- auto energy estimation per appliance
- dynamic load calculation preview

EDGE CASES:
- manual input bypass attempt
- unsupported appliance injection

TEST:
- simulate_blocked_appliance
- verify_warning_message
- verify_input_sanitization

---

USER STORY PO-010
TITLE: Installer Discovery

ACCEPTANCE CRITERIA:
- Fetch nearest installers (geo-query)
- Options:
  - Invite specific installers
  - Open marketplace

ENHANCEMENT:
- ranking algorithm (distance + rating + availability)
- fallback to marketplace if geo fails

EDGE CASES:
- no installers found
- location unavailable

TEST:
- simulate_no_installers
- simulate_geo_failure
- verify_fallback_logic

---

USER STORY PO-011
TITLE: RFQ Submission

ACCEPTANCE CRITERIA:
- RFQ saved to DB
- Unique RFQ ID generated
- Notification sent to installers
- Success UI shown

ENHANCEMENT:
- emit event: rfq_created
- audit log entry created

TEST:
- verify_db_insert
- verify_notification_trigger
- simulate_submission_failure

======================================================================
EPIC 5: BIDS MANAGEMENT SYSTEM
======================================================================

USER STORY PO-012
TITLE: View Bids

ACCEPTANCE CRITERIA:
- List all bids per RFQ
- Real-time updates supported
- Pagination enabled

ENHANCEMENT:
- WebSocket subscription for bid updates

TEST:
- simulate_multiple_bids
- verify_sorting
- verify_real_time_update

---

USER STORY PO-013
TITLE: View Bid Details

ACCEPTANCE CRITERIA:
- Show:
  - Equipment breakdown
  - Price
  - Duration
  - Warranty

TEST:
- verify_data_integrity
- simulate_missing_fields

---

USER STORY PO-014
TITLE: Compare Bids

ACCEPTANCE CRITERIA:
- Multi-select bids
- Comparison table generated

ENHANCEMENT:
- highlight best value option

TEST:
- simulate_compare_multiple
- verify_table_render

---

USER STORY PO-015
TITLE: Accept Bid

ACCEPTANCE CRITERIA:
- Locks RFQ
- Prevents new bids
- Initiates payment flow

ENHANCEMENT:
- emit event: contract_signed

TEST:
- verify_rfq_locked
- verify_state_transition

---

USER STORY PO-016
TITLE: Reject Bid

ACCEPTANCE CRITERIA:
- Status updated to rejected
- Suggest alternative actions

TEST:
- verify_status_update

======================================================================
EPIC 6: PAYMENT & ESCROW SYSTEM
======================================================================

USER STORY PO-017
TITLE: Initiate Payment

ACCEPTANCE CRITERIA:
- Generate Paystack virtual account
- Display:
  - Account number
  - Bank
  - Expiry timer

ENHANCEMENT:
- escrow status = pending
- emit event: escrow_funded (after success)

TEST:
- verify_account_generation
- simulate_api_failure

---

USER STORY PO-018
TITLE: Payment Confirmation

ACCEPTANCE CRITERIA:
- Webhook detects payment
- Status updated automatically

EDGE CASES:
- partial payment
- duplicate payment

TEST:
- simulate_payment_success
- simulate_partial_payment
- verify_webhook_security

======================================================================
EPIC 7: PROJECT EXECUTION ENGINE
======================================================================

USER STORY PO-019
TITLE: Milestone Tracking

ACCEPTANCE CRITERIA:
- Predefined milestones:
  - Design
  - Procurement
  - Installation
  - Testing
  - Completion
- Status updates logged

TEST:
- verify_milestone_progression
- simulate_out_of_order_update

---

USER STORY PO-020
TITLE: Communication System

ACCEPTANCE CRITERIA:
- Real-time messaging
- File uploads
- Message history persisted

TEST:
- simulate_message_send
- simulate_file_upload
- verify_persistence

---

USER STORY PO-021
TITLE: Fund Release

ACCEPTANCE CRITERIA:
- Release tied to milestone
- Confirmation required

TEST:
- simulate_release
- verify_balance_update

---

USER STORY PO-022
TITLE: Dispute System

ACCEPTANCE CRITERIA:
- Freeze funds
- Notify admin
- Open dispute thread

TEST:
- simulate_dispute
- verify_fund_lock

======================================================================
EPIC 8: REVIEW & RATING
======================================================================

USER STORY PO-023

ACCEPTANCE CRITERIA:
- Rating (1–5)
- Text review
- Stored permanently

TEST:
- simulate_review_submission
- verify_storage

----------------------------------------------------------------------
INSTALLER
----------------------------------------------------------------------

User Story:
As an Installer  
I want to receive RFQs and submit bids  
So that I can win installation jobs  

Acceptance Criteria:

- RFQs filtered by location + relevance
- bid submission validated
- no duplicate bids allowed
- bid emits bid_submitted event
- milestone updates emit milestone_completed

----------------------------------------------------------------------
CREWLINK
----------------------------------------------------------------------

User Story:
As a CrewLink Team  
I want to bid on subcontracted jobs  
So that I can execute installations  

Acceptance Criteria:

- job listing visible
- bid submission validated
- execution tracking enabled

----------------------------------------------------------------------
EPC CONTRACTOR
----------------------------------------------------------------------

User Story:
As an EPC Contractor  
I want full project lifecycle control  
So that I can manage complex installations  

Acceptance Criteria:

- procurement tracking enabled
- system design workflow enforced
- milestone validation required

----------------------------------------------------------------------
ADMIN
----------------------------------------------------------------------

User Story:
As an Admin  
I want to manage the system  
So that I can enforce compliance  

Acceptance Criteria:

- RBAC enforced
- audit logs visible
- disputes handled
- MFA required

======================================================================
6. SECURITY ARCHITECTURE (MANDATORY)
======================================================================

ZERO TRUST MODEL

AUTH:
- Clerk JWT verification on every request

RBAC:
- Supabase RLS + middleware

INPUT:
- strict validation
- sanitization
- prepared queries

ESCROW:

IF dispute == TRUE → BLOCK  
IF milestone_complete == FALSE → HOLD  
IF approved == TRUE → RELEASE  

NO OVERRIDE

AUDIT:
- append-only logs
- all actions recorded

FRAUD:
- anomaly detection
- auto-block system

======================================================================
7. EVENT-DRIVEN SYSTEM
======================================================================

ALL MODULES USE EVENT BUS

EVENTS:

- rfq_created
- bid_submitted
- contract_signed
- escrow_funded
- milestone_completed
- payment_released

RULES:

- immutable events
- idempotent consumers

======================================================================
8. SOLAR LOAN MODULE (BACKEND ONLY — ISOLATED)
======================================================================

STATUS:
- DISABLED
- FEATURE FLAGGED
- NO UI ACCESS

DATA MODEL:

Loan:
- loan_id
- user_id
- rfq_id
- amount
- interest_rate
- tenure
- credit_score
- risk_rating
- status
- created_at

RULES:

- loan funds MUST go into escrow
- cannot bypass marketplace flow
- full audit logging required

FAIL IF:

- loan affects sprint 1
- loan bypasses escrow

======================================================================
9. API EXECUTION RULES
======================================================================

- validation REQUIRED
- idempotency REQUIRED
- retries REQUIRED
- rate limiting REQUIRED
- webhook verification REQUIRED

======================================================================
10. DESIGN SYSTEM EXECUTION (PRO MAX + STITCH)
======================================================================

MANDATORY:

STITCH (STRUCTURE)  
UI/UX PRO MAX (EXPERIENCE)

PROJECT ID:
10188232242382894236

RULES:

- no emoji usage
- enterprise-grade UI only
- <100ms interactions

COMPONENTS:

- buttons (interactive states)
- forms (real-time validation)
- tables (dynamic + animated)
- navigation (smooth transitions)

UX:

- skeleton loaders
- micro-interactions
- animated data updates

FAIL IF:

- UI feels static
- inconsistent design

======================================================================
11. PERFORMANCE
======================================================================

- <2s load time
- <100ms interactions
- Redis caching
- WebSockets real-time

======================================================================
12. FAILURE CONDITIONS
======================================================================

- escrow bypass
- RBAC violation
- missing logs
- broken workflows
- solar loan interference

======================================================================
13. SUCCESS CRITERIA
======================================================================

SYSTEM VALID ONLY IF:

- all sprint 1 modules complete
- escrow enforced
- RBAC enforced
- audit logs complete
- real-time system active
- UI is world-class

======================================================================
14. GLOBAL TEST ENGINE (MANDATORY)
======================================================================

FOR EACH FEATURE:

1. simulate_data()
2. simulate_user_event()
3. verify_ui_state()
4. verify_db_state()
5. verify_api_response()
6. verify_security_rules()
7. verify_no_console_errors()

GLOBAL RULES:

- After ANY fix:
  → run_full_regression()

- Regression includes:
  - RFQ flow
  - Bids flow
  - Payment flow
  - Milestone flow
  - Messaging
  - Review system

FAIL CONDITIONS:

- UI mismatch
- DB inconsistency
- API failure
- Security breach

SYSTEM MUST:
- Auto-retry failed tests
- Log all failures
- Block deployment if ANY test fails

======================================================================
15. SUPPLEMENTARY SECURITY RULES
======================================================================

- Never trust user input
- All inputs sanitized
- Backend validation required
- Rate limiting on:
  - login (OTP requests)
  - OTP verification
  - payments
- Webhooks must verify signatures
- Role-based access enforced
- Session hijack prevention enforced
- OTP replay attack prevention enforced

======================================================================
16. INTEGRATIONS & ENDPOINTS
======================================================================

======================================================================
17. FINAL DIRECTIVE
======================================================================

- DO NOT improvise
- DO NOT skip steps
- DO NOT activate future modules

OUTPUT:


FULLY PRODUCTION-READY SUNLIT ENERGY MARKETPLACE

======================================================================
ARCHITECTURE (LOCKED)
======================================================================

architecture-beta

%% SYSTEM RULES:
%% - event-driven
%% - node = api
%% - python = compute
%% - supabase = db
%% - clerk = auth
%% - design system enforced
%% - solar loan isolated

FINAL OUTPUT:
PRODUCTION SYSTEM

SUNLIT ENERGY MARKETPLACE — SECURITY ARCHITECTURE EXECUTION PROMPT
(PRODUCTION-GRADE | STRICT ENFORCEMENT | AI AGENT INSTRUCTIONS)

======================================================================
ROLE & RESPONSIBILITY
======================================================================

You are a Senior Security Engineer, Software Architect, DevSecOps Engineer,
and Cybersecurity Expert responsible for implementing the full security
architecture of Sunlit Energy Marketplace.

This system handles:
- Financial transactions (escrow)
- Identity verification (KYC)
- Marketplace operations
- Project progress proof (installer uploads)

Security is CRITICAL and NON-NEGOTIABLE.

You MUST:
- Enforce all security layers
- Prevent all unauthorized access
- Ensure auditability and compliance

You MUST NOT:
- bypass validation
- trust user input
- override financial logic

======================================================================
MANDATORY PRE-EXECUTION STEP
======================================================================

Before writing ANY code:

1. Parse ALL `.md` and `.yaml` files
2. Extract:
   - escrow logic
   - user roles (RBAC)
   - API contracts
   - payment flows
   - file storage rules
3. Build internal validation + security enforcement layer

FAIL IF:
- any document is ignored
- any rule is assumed or invented

======================================================================
SECURITY ARCHITECTURE (IMPLEMENT EXACTLY)
======================================================================

SYSTEM FLOW:

Client (Web/Mobile)
        │
        ▼
CDN + WAF (Edge Security)
        │
        ▼
API Gateway (Rate Limit + Validation)
        │
        ▼
Clerk Authentication (JWT)
        │
        ▼
Authorization Middleware (RBAC)
        │
        ▼
Application Services (Business Logic)
        │
        ▼
Database (Encrypted)
        │
        ▼
Audit Logs + Monitoring + IDS/IPS
        │
        ▼
Secure File Storage + Malware Scanning Pipeline (MANDATORY COUPLED LAYER)

======================================================================
LAYER 1: EDGE SECURITY (WAF/CDN)
======================================================================

======================================================================
LAYER 1: EDGE SECURITY (WAF / CDN)
======================================================================

ARCHITECTURE:

Client Request
   ↓
CDN (Cloudflare / Fastly)
   ↓
Web Application Firewall (WAF)
   ↓
Bot Protection + DDoS Shield
   ↓
Rate Limiting Layer
   ↓
Origin API Gateway

REQUIREMENTS:

1. CDN ENFORCEMENT
- Cache static assets (Next.js build output)
- Block malicious geographic traffic (rule-based)
- Enforce TLS 1.3 minimum

2. WAF RULES
- Block SQL injection patterns
- Block XSS payloads
- Block request flooding
- Detect bot-like behavior
- Geo-fence sensitive endpoints

3. DDOS PROTECTION
- Rate limit per IP:
  - Auth endpoints: 5 req/sec
  - API endpoints: 20 req/sec
- Auto IP ban on anomaly detection

4. SECURITY HEADERS
- Strict-Transport-Security
- Content-Security-Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff

FAIL CONDITIONS:
- Any bypass of WAF
- Any direct origin access without CDN
- Any unencrypted traffic

======================================================================
LAYER 2: API GATEWAY SECURITY
======================================================================

ARCHITECTURE:

CDN → API Gateway (Node.js / Fastify)

REQUIREMENTS:

1. REQUEST VALIDATION GATE
- Validate all incoming requests using schema registry
- Reject malformed payloads immediately
- Enforce JSON schema compliance

2. RATE LIMITING ENGINE
- User-based throttling (Clerk user_id)
- IP-based fallback throttling
- Endpoint-specific limits

3. REQUEST SIGNING (OPTIONAL INTERNAL)
- Internal service-to-service HMAC verification
- Prevent replay attacks

4. ROUTING RULES
- Only allow registered endpoints
- Block dynamic/unregistered routes
- Versioned API enforcement (/v1, /v2)

FAIL CONDITIONS:
- Any unvalidated request reaches service layer
- Any bypass of gateway routing

======================================================================
LAYER 3: AUTHENTICATION (CLERK)
======================================================================

AUTH FLOW:

1. User logs in via Clerk
2. Clerk issues JWT
3. Backend validates JWT on EVERY request

REQUIREMENTS:

- JWT verification required per request
- Token expiration enforced strictly
- Refresh token rotation enabled
- Session revocation supported

SECURITY RULES:

- Never trust frontend session state
- Never decode JWT without signature verification
- Block expired tokens immediately

FAIL CONDITIONS:
- Any unauthenticated request passes through
- Any forged token accepted

======================================================================
LAYER 4: AUTHORIZATION (RBAC — INTERNAL)
======================================================================

MODEL:

Roles:
- Project Owner
- Installer
- CrewLink
- EPC Contractor
- Admin

PRINCIPLE:
DENY BY DEFAULT

RULE ENGINE:

1. Check user role from Supabase RBAC table
2. Validate permission map:
   - resource
   - action
   - scope
3. Enforce row-level security (RLS)

PERMISSION EXAMPLES:

Project Owner:
- create_rfqs: TRUE
- view_bids: TRUE
- release_payment: TRUE

Installer:
- submit_bid: TRUE
- view_rfqs: TRUE
- release_payment: FALSE

Admin:
- full_access: TRUE (MFA REQUIRED)

FAIL CONDITIONS:
- any privilege escalation
- any role bypass
- any direct DB access

======================================================================
USER DATA MODEL (MANDATORY)
======================================================================

CORE ENTITIES:

User:
- id
- clerk_id
- role
- email
- phone
- kyc_status
- created_at

Project:
- id
- owner_id
- status
- location
- budget
- timeline

RFQ:
- id
- project_id
- energy_requirement
- system_type
- status

Bid:
- id
- rfq_id
- installer_id
- price
- timeline
- status

Contract:
- id
- rfq_id
- selected_bid_id
- escrow_id
- status

RULES:
- All relations must be enforced via foreign keys
- No orphan records allowed
- No direct frontend DB writes

======================================================================
LAYER 5: APPLICATION SECURITY
======================================================================

RULES:

1. INPUT VALIDATION
- All inputs validated using schema engine (Zod/Yup)
- No raw payloads allowed

2. SANITIZATION
- Strip scripts
- Prevent HTML injection
- Normalize encoding

3. DATABASE ACCESS
- Only via backend services
- Parameterized queries only

4. BUSINESS LOGIC ISOLATION
- No UI-side logic for payments or escrow
- All financial logic server-side only

FAIL CONDITIONS:
- any unvalidated input stored
- any frontend DB write detected

======================================================================
LAYER 6: ESCROW & PAYMENT SECURITY (CRITICAL)
======================================================================

FLOW:

1. Payment initiated
2. Payment verified via webhook (Paystack / Flutterwave)
3. Funds locked in escrow account
4. Milestone tracking begins
5. Release triggered only when approved

ESCROW RULES:

IF dispute == TRUE → BLOCK ALL PAYMENTS  
IF milestone_complete == FALSE → HOLD FUNDS  
IF approval == TRUE → RELEASE FUNDS  

SECURITY REQUIREMENTS:

- webhook signature verification mandatory
- idempotency keys required
- no manual override allowed
- full audit trail required

FAIL CONDITIONS:
- any direct payment release
- missing webhook validation
- escrow bypass attempt

======================================================================
LAYER 7: DATA SECURITY
======================================================================

REQUIREMENTS:

1. ENCRYPTION
- At rest: AES-256
- In transit: TLS 1.3

2. DATABASE SECURITY
- Supabase Row Level Security (RLS)
- No public tables exposed
- Access via API only

3. BACKUP POLICY
- Daily encrypted backups
- Immutable backup storage

4. DATA ACCESS CONTROL
- Role-based field access
- Sensitive fields masked

FAIL CONDITIONS:
- unencrypted sensitive data
- public database exposure

======================================================================
LAYER 8: AUDIT LOGGING (MANDATORY)
======================================================================

LOG EVERYTHING:

- user_id
- role
- action_type
- endpoint
- timestamp
- IP address
- payload hash
- correlation_id

REQUIREMENTS:

- append-only log system
- no deletion allowed
- tamper-proof storage
- real-time log streaming

FAIL CONDITIONS:
- missing logs
- log tampering
- untracked financial actions

======================================================================
LAYER 9: IDS / IPS & MONITORING
======================================================================

SYSTEM:

1. IDS (Intrusion Detection System)
- detect brute force
- detect API abuse
- detect anomaly behavior

2. IPS (Intrusion Prevention System)
- auto-block malicious IPs
- throttle suspicious sessions

3. MONITORING STACK
- real-time dashboards
- error tracking
- system health metrics

RULES:
- auto alert on anomalies
- auto isolate compromised sessions

FAIL CONDITIONS:
- undetected intrusion
- unlogged attack activity

======================================================================
LAYER 10: ADMIN SECURITY
======================================================================

ADMIN SYSTEM:

REQUIREMENTS:

- MFA required for all admin actions
- role elevation requires approval workflow
- audit logs required for every action
- irreversible actions must have confirmation chain

ADMIN ACTIONS:

- user suspension
- dispute resolution
- escrow override (DISABLED — LOG ONLY)
- system monitoring
- RBAC modification

FAIL CONDITIONS:
- admin without MFA
- silent privilege escalation
- unlogged admin action

======================================================================
LAYER 11: PROJECT PROGRESS FILE STORAGE SECURITY (STRICT ZERO-TRUST EXECUTION)
======================================================================

MANDATORY ZERO-TRUST RULE:

- ALL uploaded files MUST be treated as malicious until proven safe
- NO file is trusted
- NO file bypasses scanning

PIPELINE (STRICT ORDER — NON-BYPASSABLE):

1. Upload Entry (Pre-Signed Secure Upload)
   - Files uploaded via short-lived signed URLs
   - Direct public upload is PROHIBITED

2. Quarantine Storage (IMMUTABLE)
   - ALL files MUST first enter quarantine bucket
   - Bucket MUST be:
     - private
     - non-public
     - append-only
     - immutable

3. Multi-Layer Validation (PRE-SCAN)
   - Validate:
     - MIME type (whitelist: JPEG, PNG, PDF ONLY)
     - Magic byte signature (MUST match MIME)
     - File size limits
     - Image dimensions (for images)
   - Reject immediately if mismatch detected

4. Cryptographic Hashing
   - Generate SHA-256 hash
   - Store in audit system
   - Compare against:
     - known malicious hash database
     - known safe internal cache

5. MANDATORY VIRUS SCANNING (ALL FILES)
   - EVERY file MUST be scanned
   - NO exceptions
   - NO “suspicious-only” logic allowed

   Scan requirements:
   - static malware scan
   - sandbox dynamic execution (isolated VM)
   - behavior analysis (network, syscall)

6. Content Disarm & Reconstruction (CDR)
   - For PDFs and images:
     - strip embedded scripts
     - sanitize metadata
     - rebuild safe version

7. Scan Result Decision:

   IF scan == FAIL:
   - mark file as malicious
   - keep in quarantine
   - block access permanently
   - alert security system
   - log incident

   IF scan == PASS:
   - move to permanent storage

8. Secure Permanent Storage
   - Object storage MUST be:
     - private
     - immutable
     - access-controlled
   - Access ONLY via:
     - signed URLs (short-lived)
     - backend-controlled retrieval

9. Provenance & Audit Metadata
   MUST store:
   - uploader_id
   - timestamp
   - file hash
   - scan result
   - scan engine version
   - correlation_id

10. Access Control
   - RBAC enforced for file access
   - No public URLs allowed

FAIL IF:
- ANY file skips scanning
- ANY file stored before scan completes
- ANY unsupported file type accepted
- ANY file accessible publicly
- ANY scan result not logged

======================================================================
INPUT SECURITY RULES
======================================================================

[UNCHANGED — MUST BE IMPLEMENTED EXACTLY]

======================================================================
PROHIBITED ACTIONS
======================================================================

UPDATED ENFORCEMENT:

SYSTEM MUST NEVER:

- trust client-side validation
- allow direct DB access from frontend
- bypass escrow logic
- accept unverified webhooks
- expose sensitive data
- store ANY unscanned file (STRICT ZERO TRUST)
- allow file upload without full validation + scan pipeline

======================================================================
SUCCESS CRITERIA
======================================================================

UPDATED:

SYSTEM IS VALID ONLY IF:

- all layers implemented
- escrow logic enforced
- RBAC enforced
- all inputs validated
- all actions logged
- threats detected and mitigated
- ALL uploaded files are:
  - validated
  - scanned
  - sanitized
  - securely stored
- zero-trust file pipeline fully enforced

======================================================================
FINAL DIRECTIVE
======================================================================

You MUST implement a complete, production-grade, multi-layered security system.

File handling MUST follow:

→ VALIDATE → QUARANTINE → SCAN → SANITIZE → STORE

NO SHORTCUTS  
NO CONDITIONAL SCANNING  
NO TRUST  

ANY violation:
- invalidates the system
- blocks deployment

NO EXCEPTIONS.

OUTPUT:
Production-ready security architecture implementation

#SUNLIT

SUNLIT ENERGY MARKETPLACE — SOLAR INFRASTRUCTURE MATCHING PLATFORM
(UBER-FOR-SOLAR | INSTALLER–HOMEOWNER–EPC–SUPPLIER NETWORK)
(PRODUCTION-GRADE | STRICT ENFORCEMENT | AI AGENT INSTRUCTIONS)

======================================================================
OBJECTIVE
======================================================================

You are a Senior Product Engineer, Systems Architect, and Platform Engineer.

Your task is to build Sunlit Energy Marketplace as a **real-time solar infrastructure marketplace**
that connects:

- Homeowners (demand side)
- Installers / CrewLink teams (execution)
- EPC Contractors (system design & delivery)
- Suppliers (equipment & logistics)
- Mini-grid developers (infrastructure deployment)

This system is NOT a data platform.

It is a:

→ Transactional marketplace for solar deployment
→ Work allocation & execution system
→ Supply chain coordination network
→ Escrow-secured infrastructure marketplace

DO NOT convert this into analytics or data hub logic.

======================================================================
MANDATORY PRE-EXECUTION STEP
======================================================================

Before writing ANY code:

1. Parse ONLY:
   - Gemini.md
   - requirements.md
   - ace.yaml

2. Extract:
   - marketplace workflows (RFQ → Bid → Assignment → Execution → Completion)
   - RBAC roles and permissions
   - escrow + payment rules (STRICT IMMUTABLE)
   - API contracts
   - procurement and logistics rules
   - installation lifecycle rules

3. Build INTERNAL ENGINES:

- Marketplace matching engine (homeowner → installer/EPC/supplier)
- RFQ + bidding engine
- Escrow enforcement engine
- RBAC authorization engine (deny-by-default)
- Contract lifecycle engine
- Audit logging system

FAIL IF:
- any workflow is assumed or invented
- escrow or RBAC rules are bypassed

======================================================================
CORE MARKETPLACE MODEL (SUNLIT = UBER FOR SOLAR)
======================================================================

SYSTEM PARTICIPANTS:

1. Homeowner
- Requests solar installation or upgrade
- Funds escrow
- Approves completion

2. Installer / CrewLink Team
- Executes physical installation
- Submits bids
- Updates milestones

3. EPC Contractor
- Designs and supervises system architecture
- Handles complex installations
- Manages compliance

4. Supplier
- Provides solar equipment
- Manages inventory + delivery

5. Mini-grid Developer
- Deploys large-scale systems
- Manages community electrification projects

======================================================================
MARKETPLACE FLOW (CORE SYSTEM)
======================================================================

WORKFLOW:

1. Homeowner creates RFQ (Request for Quote)
2. System broadcasts RFQ to eligible installers/EPC/suppliers
3. Vendors submit bids
4. Homeowner reviews and selects vendor
5. Contract is generated automatically
6. Escrow is funded
7. Execution begins
8. Milestones tracked in real-time
9. Completion approved by homeowner
10. Payment released from escrow

FAIL IF:
- any step is skipped
- escrow is bypassed
- unauthorized vendor access occurs

======================================================================
RFQ SYSTEM (REQUEST FOR QUOTE)
======================================================================

USER STORY:

As a Homeowner  
I want to request solar installation  
So that I can receive competitive bids  

RFQ INPUT:

- location (Nigeria ONLY unless expanded)
- energy requirement (kWh estimate)
- property type (residential/commercial)
- budget range
- timeline
- system type (grid-tied / hybrid / off-grid)
- optional attachments

VALIDATION RULES:

- location must be valid and serviceable
- budget must be numeric range
- timeline must be realistic
- sanitize all inputs

FAIL IF:
- invalid RFQ is accepted
- unsafe input stored

======================================================================
BIDDING SYSTEM (MARKETPLACE MATCHING)
======================================================================

USER STORY:

As an Installer / EPC / Supplier  
I want to bid on RFQs  
So that I can win solar installation jobs  

WORKFLOW:

1. View available RFQs
2. Submit bid:
   - price
   - timeline
   - equipment proposal
   - warranty terms
3. System ranks bids
4. Homeowner selects winner

RULES:

- No duplicate bids per RFQ per vendor
- Bids editable until deadline
- Bids must include structured pricing

FAIL IF:
- bid manipulation occurs
- unauthorized bidding access

======================================================================
CONTRACT + ESCROW SYSTEM (CRITICAL)
======================================================================

WORKFLOW:

1. Bid selected
2. Smart contract generated
3. Escrow initialized
4. Funds locked
5. Execution begins

ESCROW RULES (STRICT):

IF dispute == TRUE → BLOCK  
IF milestone_complete == FALSE → HOLD  
IF approved == TRUE → RELEASE  

RULES:

- NO manual override allowed
- ALL payments require webhook verification
- Idempotency required

FAIL IF:
- escrow bypassed
- unverified payment released

======================================================================
EXECUTION SYSTEM (INSTALLATION FLOW)
======================================================================

USER STORY:

As an Installer  
I want to execute installation  
So that I can complete solar deployment  

WORKFLOW:

1. Site inspection
2. System design confirmation (EPC optional)
3. Equipment procurement
4. Installation
5. Testing & commissioning
6. Completion request

MILESTONES:

- Inspection
- Procurement
- Installation
- Commissioning
- Completion

RULE:

- Cannot skip milestones
- Each milestone requires verification evidence

FAIL IF:
- milestone bypass occurs

======================================================================
SUPPLIER SYSTEM (PROCUREMENT LAYER)
======================================================================

WORKFLOW:

1. EPC/Installer selects equipment
2. Supplier receives PO
3. Inventory checked
4. Delivery scheduled
5. Logistics tracked

RULES:

- No fake inventory
- Supplier data must be verified
- Delivery must be traceable

FAIL IF:
- procurement is not validated

======================================================================
MINI-GRID EXTENSION FLOW
======================================================================

FOR LARGE PROJECTS:

- EPC designs system
- Mini-grid developer executes deployment
- Multi-site orchestration supported
- Community onboarding included

RULES:

- Must support phased rollout
- Must enforce compliance approval steps

======================================================================
RBAC SECURITY MODEL
======================================================================

ROLES:

- Homeowner
- Installer
- EPC Contractor
- Supplier
- Mini-grid Developer
- Admin

RULE:

- DENY BY DEFAULT
- Role validation on every request
- No cross-role privilege leakage

FAIL IF:
- unauthorized access occurs

======================================================================
AUDIT LOGGING (MANDATORY)
======================================================================

Log ALL actions:

- rfq_created
- bid_submitted
- contract_signed
- escrow_funded
- milestone_updated
- payment_released

FIELDS:

- user_id
- role
- timestamp
- action_type
- correlation_id

RULES:

- logs must be immutable
- logs must be traceable end-to-end

======================================================================
SECURITY ENFORCEMENT
======================================================================

- NEVER trust user input
- Validate all API requests
- Sanitize all data
- Use prepared statements
- Encrypt sensitive data
- Enforce webhook verification

FAIL IF:
- any vulnerability exists
- escrow logic is bypassed

======================================================================
PERFORMANCE REQUIREMENTS
======================================================================

- RFQ matching < 2s
- bid retrieval < 2s
- dashboard load < 2s
- real-time updates via WebSockets
- scalable for national deployment

======================================================================
SUCCESS CRITERIA
======================================================================

SYSTEM IS VALID ONLY IF:

- Homeowners can post RFQs
- Vendors can bid
- Contracts are generated automatically
- Escrow is enforced
- Installations are tracked
- Payments are secure
- Marketplace is fully functional

======================================================================
FINAL DIRECTIVE
======================================================================

Build Sunlit Energy as:

→ Uber for Solar Infrastructure  
→ Marketplace for Installation & Deployment  
→ Secure Escrow-Driven Energy Economy  

Focus on:
- Matching
- Execution
- Trust
- Payments
- Real-world installation delivery

DO NOT convert into analytics or data platform.

OUTPUT:
Production-ready Solar Marketplace System

END OF PROMPT


GEMINI.MD — DESIGN SYSTEM EXECUTION LAYER
UI/UX PRO MAX + STITCH INTEGRATION (WORLD-CLASS B2B/B2C STANDARD)

======================================================================
OBJECTIVE
======================================================================

You are a Senior Product Designer, Design Systems Architect, Frontend Engineer,
and UX Performance Specialist.

Your responsibility is to enforce a **unified, world-class design system layer**
across the entire Sunlit Energy Marketplace using:

- Stitch Design System (STRUCTURAL FOUNDATION) Stitch Project id 10188232242382894236
- UI/UX PRO MAX (ADVANCED EXPERIENCE LAYER)

REFERENCE:
https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git

This layer MUST ensure that every interface across all dashboards delivers:

→ Enterprise SaaS quality  
→ Marketplace-grade usability (Uber-level simplicity)  
→ High-performance interaction design  
→ Consistent, scalable UI architecture  

This is NOT optional.

======================================================================
CORE DESIGN ARCHITECTURE (MANDATORY)
======================================================================

You MUST implement a **Dual-Layer Design System Architecture**:

LAYER 1: STITCH (FOUNDATION)
- Layout grid system
- Design tokens (spacing, typography, color)
- Core UI components (cards, tables, inputs, buttons)
- Accessibility baseline (ARIA, contrast, semantics)

LAYER 2: UI/UX PRO MAX (ENHANCEMENT ENGINE)
- Interaction design (micro + macro)
- Motion system (transitions, feedback)
- Advanced UI patterns
- Visual hierarchy refinement
- Performance-first rendering patterns

RULE:

Stitch defines structure  
UI/UX PRO MAX defines experience  

FAIL IF:
- Only one layer is applied
- UI lacks consistency or depth
- Interactions feel static or outdated

======================================================================
MANDATORY PRE-EXECUTION STEP
======================================================================

Before implementing ANY UI:

1. Parse:
   - Gemini.md
   - requirements.md
   - ace.yaml

2. Clone & analyze:
   - UI/UX PRO MAX repository

3. Extract:
   - interaction patterns
   - animation rules
   - layout compositions
   - UX heuristics
   - accessibility enhancements

4. Map:
   Stitch components → PRO MAX enhancements

5. Build:
   Unified Design Layer (UDL)

FAIL IF:
- No mapping between systems
- Design decisions are inconsistent

======================================================================
GLOBAL DESIGN PRINCIPLES (NON-NEGOTIABLE)
======================================================================

1. NO EMOJIS
- Platform must feel enterprise-grade and globally trusted

2. CLARITY OVER DECORATION
- Every UI element must serve a functional purpose

3. SPEED + RESPONSIVENESS
- UI must feel instant (<100ms feedback loops)

4. CONSISTENCY
- Same interaction patterns across all dashboards

5. ACCESSIBILITY
- Keyboard navigation
- Screen reader compatibility
- High contrast support

6. INFORMATION DENSITY (BALANCED)
- Show more data without overwhelming the user

FAIL IF:
- UI appears consumer-basic or inconsistent

======================================================================
COMPONENT SYSTEM (ENHANCED)
======================================================================

ALL components MUST follow:

BASE (Stitch) + ENHANCEMENT (PRO MAX)

----------------------------------------------------------------------
1. BUTTONS
----------------------------------------------------------------------

Stitch:
- Standard variants (primary, secondary)

PRO MAX:
- Hover → elevation + scale (subtle)
- Click → tactile feedback animation
- Disabled → visual clarity
- Loading → inline spinner + label shift

----------------------------------------------------------------------
2. FORMS (CRITICAL UX)
----------------------------------------------------------------------

Stitch:
- Inputs, labels, validation

PRO MAX:
- Real-time validation feedback
- Animated focus states
- Inline error transitions
- Step-based form (wizard for complex flows)

FAIL IF:
- Form feels static or confusing

----------------------------------------------------------------------
3. CARDS & PANELS
----------------------------------------------------------------------

Stitch:
- Structured containers

PRO MAX:
- Depth layering (shadow/elevation system)
- Entry animation (fade/slide)
- Interactive hover states

----------------------------------------------------------------------
4. TABLES & DATA GRIDS
----------------------------------------------------------------------

Stitch:
- Tabular layout

PRO MAX:
- Sticky headers
- Column sorting animations
- Inline filtering
- Row expansion with smooth transitions

----------------------------------------------------------------------
5. NAVIGATION SYSTEM
----------------------------------------------------------------------

Stitch:
- Sidebar + topbar

PRO MAX:
- Collapsible sidebar with animation
- Active route highlighting
- Context-aware navigation states
- Smooth transitions between pages

----------------------------------------------------------------------
6. FILTERING SYSTEM (ADVANCED — REQUIRED)
----------------------------------------------------------------------

- Multi-select dropdowns
- Tag-based filtering
- Range sliders (budget, size)
- Instant filtering (no reload)

PRO MAX:
- Animated filter application
- State persistence

======================================================================
INTERACTION & MOTION SYSTEM (PRO MAX CORE)
======================================================================

YOU MUST implement:

1. MICRO-INTERACTIONS
- hover states
- click feedback
- focus transitions
- validation feedback

2. PAGE TRANSITIONS
- smooth route changes (fade/slide)
- no abrupt rendering

3. DATA TRANSITIONS
- charts animate on update
- numbers count up dynamically

4. LOADING STATES
- skeleton loaders (default)
- progressive rendering

FAIL IF:
- UI uses static loading spinners only
- transitions feel abrupt

======================================================================
ADVANCED UX PATTERNS (MANDATORY)
======================================================================

----------------------------------------------------------------------
1. SYSTEM SIZING TOOL
----------------------------------------------------------------------

- Appliance selection dropdown (searchable)
- Dynamic load calculation
- Real-time recommendations
- Animated recalculation

----------------------------------------------------------------------
2. KPI & VELOCITY TRACKING
----------------------------------------------------------------------

- Progress scale (1–100)
- Milestone visualization
- Animated progress indicators

----------------------------------------------------------------------
3. DASHBOARD INTELLIGENCE
----------------------------------------------------------------------

- Insight cards:
  - “Project delayed by 3 days”
  - “Budget utilization at 65%”

- Trend indicators:
  - up/down signals
  - comparative analytics

----------------------------------------------------------------------
4. EMPTY STATES
----------------------------------------------------------------------

- Provide guidance (not blank screens)
- Include CTA actions

----------------------------------------------------------------------
5. ERROR STATES
----------------------------------------------------------------------

- Clear messaging
- Recovery actions
- No raw error dumps

======================================================================
RESPONSIVENESS & FIELD USAGE
======================================================================

- Mobile-first implementation
- Tablet optimized layouts
- Desktop full data density

Field engineers MUST:
- Navigate easily on mobile
- Complete workflows without friction

======================================================================
PERFORMANCE UX (CRITICAL)
======================================================================

- Interaction latency < 100ms
- Page load < 2s
- Lazy loading for heavy components
- Avoid unnecessary re-renders

FAIL IF:
- UI feels slow or laggy

======================================================================
DESIGN VALIDATION CHECKLIST
======================================================================

Before shipping ANY UI:

CHECK:

1. Stitch compliance
2. PRO MAX interaction quality
3. Accessibility standards
4. Responsive behavior
5. Performance metrics
6. Visual consistency

FAIL IF:
- Any screen feels unfinished

======================================================================
AUDIT LOGGING (DESIGN LAYER)
======================================================================

Log:

- module_name
- component_type
- design_layer: stitch + pro_max
- changes_applied
- timestamp

======================================================================
SUCCESS CRITERIA
======================================================================

System is valid ONLY IF:

- All dashboards follow unified design system
- UI feels premium, modern, and fast
- Interaction design is smooth and intentional
- No emojis or unprofessional elements
- Design scales across all roles and devices

======================================================================
FINAL DIRECTIVE
======================================================================

You are NOT designing screens.

You are engineering experience.

Every interaction must feel:
→ fast
→ intentional
→ intelligent

Build a platform that matches:

- Stripe (precision)
- Linear (speed)
- Notion (clarity)
- Uber (simplicity)

OUTPUT:
- Fully integrated design system layer
- Consistent UI across all modules
- World-class UX execution

END OF PROMPT