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
2. GLOBAL SYSTEM ARCHITECTURE (NON-MODIFIABLE)
======================================================================

Architecture:

→ MODULAR MONOLITH (STRICT)
→ EVENT BUS (REAL-TIME CORE)
→ POLYGLOT COMPUTE (NODE + PYTHON)

----------------------------------------------------------------------
TECH STACK (MANDATORY)
----------------------------------------------------------------------

Frontend:
- Next.js (SSR + ISR)
- TypeScript (strict)
- Stitch Design System (Project ID: 10188232242382894236)
- UI/UX PRO MAX Layer

Backend:
- Node.js (API Layer)
- Express / Fastify

Authentication:
- Clerk (JWT-based)

Database:
- Supabase (PostgreSQL + RLS + Realtime)

Compute:
- Python services (AI + calculations)

Cache:
- Redis

CMS:
- Sanity.io

----------------------------------------------------------------------
ROOT STRUCTURE
----------------------------------------------------------------------

/src
  /dashboards
    /project-owner
    /installer
    /crewlink
    /epc
    /admin
  /modules
    /solar-loan (BACKEND ONLY — DISABLED)
  /core
    /event-bus
    /matching-engine
    /escrow
    /payments
    /rbac
    /audit
    /fraud-detection
    /ai-engine
  /design
    /stitch
    /pro-max
    /tokens
    /motion
    /patterns

RULES:

- NO duplicate logic
- shared logic centralized
- modules isolated
- communication via event bus ONLY

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

Acceptance Criteria:

- RFQ form validates:
  - location (required)
  - budget range (numeric)
  - timeline (valid date)
- RFQ emits event: rfq_created
- user sees real-time bids
- escrow funding triggers escrow_funded event
- payment release only after approval

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
14. FINAL DIRECTIVE
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