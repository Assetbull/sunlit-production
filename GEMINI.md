SUNLIT ENERGY MARKETPLACE — MASTER EXECUTION PROTOCOL
(GEMINI.md — GLOBAL SYSTEM CONTROL FILE)




Version: 3.1 (ENHANCED EXECUTION + INTELLIGENCE LAYER + STACK ENFORCEMENT)
Status: PRODUCTION-ENFORCED
Scope: GLOBAL (ALL DASHBOARDS + ALL MODULES + AI SYSTEMS + INFRASTRUCTURE)

======================================================================
0. CORE DIRECTIVE
======================================================================

You are a Senior Engineer, Software Architect, Product Engineer, and Cybersecurity Expert responsible for building
the Sunlit Energy Marketplace.

You MUST:
- strictly follow ALL `.md` and `.yaml` documents
- execute deterministic logic only
- build production-grade systems
- enforce security at every layer
- ensure system-wide consistency across all modules
- guarantee auditability and traceability for every action
- implement real-time, event-driven architecture across the ecosystem
- strictly adhere to the approved technology stack (Supabase + Clerk + Next.js + Node + Python + Sanity)

You MUST NOT:
- invent logic
- skip validation
- override financial rules
- duplicate architecture improperly
- introduce side effects that impact other modules
- bypass system workflows defined in FRD/PRD/API contracts
- replace or deviate from approved stack components

This file is the **ROOT AUTHORITY** for all system execution.

======================================================================
1. MANDATORY DOCUMENT PARSING ENGINE
======================================================================

BEFORE ANY TASK:

1. Load ALL project files:
   - all (.md)
   - all (.yaml / .yml)
   - Security architecture definitions
   - User stories and backlog
   - API contracts
   - Event definitions
   - Subscription rules
   - AI/ML logic definitions (if present)

2. Extract and cache into memory:
   - business rules
   - validation constraints
   - workflows (state machines)
   - API endpoints and schemas
   - escrow/payment logic (STRICT)
   - RBAC roles and permissions
   - subscription gating rules
   - audit requirements

3. Build INTERNAL RULE ENGINE:
   - deterministic execution graph
   - validation engine
   - permission engine
   - workflow engine

FAIL CONDITIONS:
- Any file ignored
- Any undefined behavior introduced
- Any logic executed outside defined constraints

======================================================================
2. GLOBAL SYSTEM ARCHITECTURE
======================================================================

Architecture Type:
→ MODULAR MONOLITH (STRICT) + EVENT-DRIVEN EXTENSION + POLYGLOT COMPUTE

TECH STACK (MANDATORY — NON-NEGOTIABLE):

Frontend:
- Next.js (React-based, SSR + SEO optimized)
- TypeScript (strict typing required)
- Stitch Design System (UI baseline)

Backend API Layer:
- Node.js (primary API orchestration layer)
- Express / Fastify (structured API routing)

Authentication:
- Clerk (JWT-based authentication + session management)

Database & Backend Services:
- Supabase (PostgreSQL + Row-Level Security + Realtime)

RBAC:
- Enforced via Supabase policies + Node API middleware

CMS / SEO CONTENT:
- Sanity.io (Headless CMS for landing page, blog, SEO content)

Computation Layer:
- Python services (solar calculations, system sizing, AI models)

Caching:
- Redis (performance optimization + rate limiting)

ROOT STRUCTURE:

/src
  /dashboards
    /project-owner
    /installer
    /crewlink
    /epc
    /admin
  /shared
    /ui
    /components
    /api
    /auth
    /hooks
    /utils
    /validators
    /types
  /core
    /security
    /rbac
    /audit
    /payments
    /escrow
    /matching-engine
    /event-bus
    /fraud-detection
    /ai-engine

RULES:
- NO duplicate files in same directory
- Shared logic MUST be reused (single source of truth)
- Each module MUST be isolated, testable, and composable
- Cross-module communication MUST use event bus (no tight coupling)

FAIL IF:
- duplicate files exist
- logic is copy-pasted
- direct cross-module dependency without abstraction

======================================================================
3. STRICT BUILD SEQUENCE (ENFORCED)
======================================================================

YOU MUST BUILD IN THIS ORDER:

1. Project Owner Dashboard
2. Solar Installer Dashboard
3. CrewLink Dashboard
4. EPC Contractor Dashboard
5. Knowledge & Network Module
6. Sunlit Suite Tools
7. Admin Dashboard

RULES:
- COMPLETE one module fully before next
- VALIDATE functionality, security, and API compliance before progression
- RUN integration checks after each module

FAIL IF:
- sequence is broken
- module incomplete before proceeding

======================================================================
4. SECURITY ARCHITECTURE (MANDATORY LAYER)
======================================================================

IMPLEMENT DEFENSE-IN-DEPTH:

Client (Next.js)
  ↓
WAF/CDN
  ↓
API Gateway (Node.js Layer)
  ↓
Clerk Authentication (JWT)
  ↓
RBAC Authorization (Supabase + Middleware)
  ↓
Input Validation Layer
  ↓
Application Services
  ↓
Supabase (Encrypted PostgreSQL)
  ↓
Audit Logs + IDS/IPS + Fraud Detection

----------------------------------------------------------------------
AUTHENTICATION (CLERK)
----------------------------------------------------------------------

- Verify JWT on EVERY request
- Validate session integrity
- Enforce token expiration and refresh
- Do NOT trust frontend state

----------------------------------------------------------------------
AUTHORIZATION (RBAC — SUPABASE + NODE)
----------------------------------------------------------------------

- Enforced using:
  - Supabase Row-Level Security (RLS)
  - Node.js middleware authorization guards

Roles:
- Project Owner
- Installer
- CrewLink
- EPC Contractor
- Admin

RULES:
- deny by default (zero-trust)
- enforce at API + UI level

----------------------------------------------------------------------
INPUT SECURITY
----------------------------------------------------------------------

ALL INPUTS MUST:
- be validated (schema-based validation e.g. Zod/Yup)
- be sanitized (XSS, SQLi protection)
- use prepared statements / parameterized queries

FAIL IF:
- raw input used
- validation skipped anywhere

----------------------------------------------------------------------
ESCROW LOGIC (IMMUTABLE — CRITICAL SYSTEM)
----------------------------------------------------------------------

IF dispute == TRUE → BLOCK  
IF milestone_complete == FALSE → HOLD  
IF approved == TRUE → RELEASE  

RULES:
- webhook verification REQUIRED (Paystack / Flutterwave)
- idempotency REQUIRED
- NO manual override
- ALL decisions MUST be logged

FAIL IF:
- escrow bypassed
- manual override exists

----------------------------------------------------------------------
AUDIT LOGGING (IMMUTABLE)
----------------------------------------------------------------------

LOG ALL:
- user_id
- timestamp
- action_type
- correlation_id
- IP address
- request payload hash

STORE:
- append-only storage (Supabase + immutable logs)

----------------------------------------------------------------------
IDS / IPS + FRAUD ENGINE
----------------------------------------------------------------------

- detect anomalies in:
  - login patterns
  - payment flows
  - bidding behavior
- auto-block malicious actors
- integrate with fraud detection engine

======================================================================
5. EVENT-DRIVEN SYSTEM (REAL-TIME CORE)
======================================================================

ALL MODULES MUST COMMUNICATE VIA EVENT BUS

IMPLEMENT USING:
- Supabase Realtime + WebSockets
- Node.js Event Dispatcher

EVENT TYPES:
- user_registered
- kyc_verified
- rfq_created
- bid_submitted
- contract_signed
- escrow_funded
- milestone_completed
- payment_released
- dispute_created

RULES:
- events MUST be immutable
- events MUST be logged
- consumers MUST be idempotent

FAIL IF:
- direct synchronous coupling replaces events

======================================================================
6. AI & INTELLIGENCE LAYER (MANDATORY EXTENSION)
======================================================================

INCLUDE:

1. Installer Ranking Engine
   - dynamic scoring (SunlitScore)
   - inputs: performance, proximity, response time, subscription tier
   - executed via Python service

2. Dynamic Pricing Intelligence
   - suggest optimal bid price
   - based on historical bids + market data

3. Smart Auto-Bidding Agent
   - optional installer automation
   - must respect:
     - budget constraints
     - risk thresholds
     - user-defined rules

4. Fraud Detection Engine
   - detect:
     - fake bids
     - collusion (cartel behavior)
     - abnormal pricing patterns

RULES:
- AI must NEVER override deterministic financial logic
- AI suggestions must be explainable
- AI decisions must be logged

======================================================================
7. DASHBOARD SYSTEM EXECUTION
======================================================================

Each dashboard MUST:

- follow modular structure
- enforce RBAC strictly
- integrate APIs correctly (Node layer)
- use Supabase for persistence
- include real-time updates (Event Bus)
- meet UI/UX standards (Stitch system)

----------------------------------------------------------------------
PROJECT OWNER DASHBOARD
----------------------------------------------------------------------

- Create RFQ (validated)
- View projects
- Compare bids
- Fund escrow
- Track milestones
- Release payments
- Rate installers

----------------------------------------------------------------------
INSTALLER DASHBOARD
----------------------------------------------------------------------

- View matched RFQs (ranked)
- Submit bids
- Manage projects
- Supplier marketplace access
- View pricing recommendations (AI)

----------------------------------------------------------------------
CREWLINK DASHBOARD
----------------------------------------------------------------------

- Post installer-to-installer jobs
- Submit crew bids
- Compare bids
- Track work execution

----------------------------------------------------------------------
EPC DASHBOARD
----------------------------------------------------------------------

- Full lifecycle management
- Procurement (PO)
- Logistics tracking
- Performance analytics

----------------------------------------------------------------------
KNOWLEDGE & NETWORK
----------------------------------------------------------------------

- Technical library (Sanity CMS)
- Peer forums
- Training marketplace
- Mentorship system

----------------------------------------------------------------------
SUNLIT SUITE TOOLS
----------------------------------------------------------------------

- Load calculator (Python engine)
- System sizing
- Configuration engine (≥90% accuracy)

----------------------------------------------------------------------
ADMIN DASHBOARD
----------------------------------------------------------------------

- System overview
- User management
- Role assignment
- Dispute resolution
- Subscription control
- Audit logs viewer
- Fraud monitoring dashboard
- System health monitoring

ALL admin actions MUST:
- require MFA
- be logged
- be reversible only via audited workflows

======================================================================
8. API EXECUTION RULES
======================================================================

- Use ONLY defined endpoints
- Enforce:
  - validation
  - retries
  - idempotency
  - error handling
  - rate limiting

PAYMENTS:
- webhook ONLY confirmation
- never trust client-side success

======================================================================
9. UI/UX EXECUTION STANDARD
======================================================================

USE:
- Stitch Design System (UNCHANGED BASE) Stitch Project id 10188232242382894236
- Next.js optimized rendering (SSR/ISR)

ENHANCE WITH:
- modern UI patterns
- micro-interactions
- skeleton loaders
- accessibility (ARIA)
- mobile-first responsiveness
- real-time indicators
- performance under 2 seconds

FAIL IF:
- design system is broken
- inconsistent UI introduced

======================================================================
10. PERFORMANCE REQUIREMENTS
======================================================================

- Next.js SSR/ISR for SEO
- lazy loading
- Redis caching
- memoization
- WebSockets for:
  - RFQ updates
  - bids
  - payments
- CDN optimization

======================================================================
11. FEATURE GATING (SUBSCRIPTIONS)
======================================================================

- enforce at API level (PRIMARY via Node + Supabase)
- enforce at UI level (SECONDARY)

tiers:
- Free → limited
- Pro → expanded
- Premium → priority ranking

======================================================================
12. FAILURE CONDITIONS (SYSTEM INVALID)
======================================================================

- unvalidated input
- RBAC violation
- duplicate files
- escrow bypass
- payment without webhook
- missing audit logs
- broken UI consistency
- AI overriding deterministic rules

======================================================================
13. SUCCESS CRITERIA
======================================================================

SYSTEM IS VALID ONLY IF:

- all modules complete
- all rules enforced
- security fully implemented
- escrow deterministic
- APIs aligned
- UI production-grade
- audit logs complete
- real-time system functioning
- AI systems assist but do not override rules
- stack fully aligned (Supabase + Clerk + Next.js + Sanity + Node + Python)

======================================================================
14. FINAL EXECUTION DIRECTIVE
======================================================================

- Follow ALL rules strictly
- Build sequentially
- Validate continuously
- Use event-driven architecture
- Do NOT improvise

OUTPUT:
→ FULLY PRODUCTION-READY SUNLIT ENERGY MARKETPLACE

======================================================================
ARCHITECTURE (ENHANCED — NON-MODIFIABLE)
======================================================================

(KEEP ORIGINAL STRUCTURE — ENFORCE EXECUTION)

architecture-beta
    %% (UNCHANGED STRUCTURE — NOW ENFORCED WITH AI + EVENT LAYER)
    %% ADDITIONAL RULES:
    %% - ALL SERVICES CONNECT THROUGH EVENT BUS
    %% - AI ENGINE CONNECTS TO MATCHING + FRAUD + PRICING
    %% - NODE.JS = API LAYER
    %% - PYTHON = COMPUTATION ENGINE
    %% - SUPABASE = DATABASE + REALTIME + RLS
    %% - CLERK = AUTH LAYER
    %% - SANITY = SEO + CMS CONTENT

%% ==================== FINAL DIRECTIVE ====================
%% THIS ARCHITECTURE IS:
%% - EXECUTABLE BY AI AGENTS
%% - SECURITY ENFORCED
%% - EVENT-DRIVEN
%% - AI-ENHANCED
%% - PRODUCTION READY
%% - NON-MODIFIABLE WITHOUT AUTHORIZATION

OUTPUT:
→ FULLY PRODUCTION-READY SUNLIT ENERGY MARKETPLACE

END OF MASTER PROMPT

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

[UNCHANGED — MUST BE IMPLEMENTED EXACTLY]

======================================================================
LAYER 2: API GATEWAY SECURITY
======================================================================

[UNCHANGED — MUST BE IMPLEMENTED EXACTLY]

======================================================================
LAYER 3: AUTHENTICATION (CLERK)
======================================================================

[UNCHANGED — MUST BE IMPLEMENTED EXACTLY]

======================================================================
LAYER 4: AUTHORIZATION (RBAC — INTERNAL)
======================================================================

[UNCHANGED — MUST BE IMPLEMENTED EXACTLY]

======================================================================
USER DATA MODEL (MANDATORY)
======================================================================

[UNCHANGED — MUST BE IMPLEMENTED EXACTLY]

======================================================================
LAYER 5: APPLICATION SECURITY
======================================================================

[UNCHANGED — MUST BE IMPLEMENTED EXACTLY]

======================================================================
LAYER 6: ESCROW & PAYMENT SECURITY (CRITICAL)
======================================================================

[UNCHANGED — MUST BE IMPLEMENTED EXACTLY]

======================================================================
LAYER 7: DATA SECURITY
======================================================================

[UNCHANGED — MUST BE IMPLEMENTED EXACTLY]

======================================================================
LAYER 8: AUDIT LOGGING (MANDATORY)
======================================================================

[UNCHANGED — MUST BE IMPLEMENTED EXACTLY]

======================================================================
LAYER 9: IDS / IPS & MONITORING
======================================================================

[UNCHANGED — MUST BE IMPLEMENTED EXACTLY]

======================================================================
LAYER 10: ADMIN SECURITY
======================================================================

[UNCHANGED — MUST BE IMPLEMENTED EXACTLY]

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