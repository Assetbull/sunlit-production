/**
 * Legal & Compliance Registry — Authoritative Sunlit Legal Document Index
 *
 * Governance Authority: LEGAL_COMPLIANCE_ENGINE_OS.md
 * Classification: PUBLIC TRUST / LEGAL COMPLIANCE
 */

export interface LegalSection {
  id: string;
  number: string;
  title: string;
  content: string[];
  subsections?: Array<{
    number: string;
    title: string;
    content: string[];
  }>;
}

export interface LegalDocumentMetadata {
  id: string;
  slug: string;
  title: string;
  documentType: string;
  version: string;
  status: 'PUBLISHED' | 'UNDER_REVIEW' | 'ARCHIVED';
  lastUpdated: string;
  effectiveDate: string;
  audience: string;
  jurisdiction: string;
  governingLaw: string;
  summary: string;
  downloadPdfName?: string;
  sections: LegalSection[];
  relatedStatutes?: Array<{ name: string; citation: string }>;
  keyDefinitions?: Array<{ term: string; definition: string }>;
}

export const LEGAL_DOCUMENTS: Record<string, LegalDocumentMetadata> = {
  privacy: {
    id: 'DOC-PRIV-2026-V214',
    slug: 'privacy',
    title: 'Privacy Policy',
    documentType: 'PRIVACY_POLICY',
    version: '2.1.4',
    status: 'PUBLISHED',
    lastUpdated: 'February 2026',
    effectiveDate: 'January 1, 2026',
    audience: 'All Users (Homeowners, Businesses, Installers, EPC Contractors)',
    jurisdiction: 'Federal Republic of Nigeria',
    governingLaw: 'Nigeria Data Protection Act (NDPA) 2023',
    summary:
      'At Sunlit Energy, we believe transparency is the foundation of trust. We are committed to protecting your personal data and ensuring compliance with the Nigerian Data Protection Act (NDPA) while delivering clean, reliable solar energy solutions.',
    downloadPdfName: 'Sunlit_Energy_Privacy_Policy_v2.1.4.pdf',
    relatedStatutes: [
      { name: 'Nigeria Data Protection Act (NDPA)', citation: 'Act No. 12 of 2023' },
      { name: 'Nigeria Data Protection Commission (NDPC) Guidelines', citation: 'NDPC Reg. 2024' },
      { name: 'Cybercrimes (Prohibition, Prevention, etc.) Act', citation: 'Act No. 17 of 2015' },
    ],
    keyDefinitions: [
      { term: 'Personal Data', definition: 'Any information relating to an identified or identifiable natural person (Data Subject).' },
      { term: 'Data Controller', definition: 'Sunlit Global Energy Co. Ltd., determining the purposes and means of processing personal data.' },
      { term: 'Data Processor', definition: 'A natural or legal person that processes personal data on behalf of Sunlit Energy.' },
    ],
    sections: [
      {
        id: 'collect',
        number: '1',
        title: 'Information We Collect',
        content: [
          'We collect information you provide directly to Sunlit Energy when you request solar quotes, configure energy systems, register as an installer, create project designs, or contact our support team.',
          'Personal Identifiers: Full name, residential or commercial address, email address, telephone and WhatsApp contact numbers.',
          'Technical & Energy Data: Utility electricity bills, Disco provider names, tariff bands (e.g. Band A), generator runtime telemetry, roof dimensions, and connected electrical appliance inventories.',
          'Financial & Milestone Data: Bank verification information, transaction identifiers, escrow milestone confirmations, and VAT invoicing details.',
        ],
      },
      {
        id: 'use',
        number: '2',
        title: 'How We Use Your Information',
        content: [
          'Matching & Procurement: To evaluate energy requirements, calculate preliminary system sizing (PV kWp, Inverter kVA, LiFePO4 battery storage), and route quote requests to verified installers.',
          'Milestone Escrow Administration: To disburse contractual milestone payments upon validated project sign-off and commissioning.',
          'Safety & Regulatory Compliance: To ensure solar installations comply with Nigerian electrical codes (NEMSA standards) and maintain mandatory safety records.',
          'Communications: To transmit quotation updates, contract signing requests, milestone OTP codes, and operational status notifications.',
        ],
      },
      {
        id: 'share',
        number: '3',
        title: 'Data Sharing & Third Parties',
        content: [
          'Verified Installers & EPC Contractors: Project site addresses, energy requirements, and contact details are shared exclusively with the installers you select or match with for quotation.',
          'Licensed Payment Gateways & Escrow Custodians: Payment details are securely processed via CBN-licensed payment partners and segregated bank escrow accounts.',
          'Regulatory Authorities: Where required by lawful process, court order, or formal request from the Nigeria Data Protection Commission (NDPC) or Nigerian Electricity Regulatory Commission (NERC).',
          'We do not sell, rent, or trade your personal data to third-party marketing companies under any circumstances.',
        ],
      },
      {
        id: 'rights',
        number: '4',
        title: 'Your Data Subject Rights Under NDPA',
        content: [
          'Under the Nigeria Data Protection Act 2023, you retain the following statutory rights:',
          'Right of Access: Request a copy of the personal data Sunlit Energy holds about you.',
          'Right to Rectification: Request correction of inaccurate, incomplete, or outdated personal data.',
          'Right to Erasure (Right to Be Forgotten): Request deletion of your data where continued retention is no longer legally mandated.',
          'Right to Object & Restrict: Object to specific processing activities, including automated profiling or marketing communications.',
          'Right to Data Portability: Request your system sizing data and project histories in a structured, machine-readable format.',
        ],
      },
      {
        id: 'security',
        number: '5',
        title: 'Security & Data Retention',
        content: [
          'We implement enterprise cryptographic controls, TLS 1.3 encryption in transit, AES-256 encryption at rest, and strict role-based access control (RBAC).',
          'Customer project and milestone records are retained for the statutory period required for tax, warranty enforcement, and regulatory compliance (typically 6 years following project completion).',
        ],
      },
      {
        id: 'contact',
        number: '6',
        title: 'Data Protection Officer (DPO) Contact',
        content: [
          'If you have questions about this Privacy Policy or wish to exercise your statutory data subject rights, contact our Data Protection Officer:',
          'Email: privacy@sunlit.energy | dpo@sunlit.energy',
          'Physical Address: Sunlit Global Energy Co. Ltd., Lagos, Nigeria.',
          'You also have the right to lodge a complaint with the Nigeria Data Protection Commission (NDPC) at ndpc.gov.ng.',
        ],
      },
    ],
  },

  terms: {
    id: 'DOC-TERMS-2026-V210',
    slug: 'terms',
    title: 'Terms of Service',
    documentType: 'TERMS_OF_SERVICE',
    version: '2.1.0',
    status: 'PUBLISHED',
    lastUpdated: 'February 2026',
    effectiveDate: 'January 1, 2026',
    audience: 'All Users (Customers, Project Owners, Installers, EPC Contractors)',
    jurisdiction: 'Federal Republic of Nigeria',
    governingLaw: 'Laws of the Federal Republic of Nigeria',
    summary:
      'These Terms of Service govern your access to and use of the Sunlit Energy marketplace, engineering sizing calculators, milestone escrow payment framework, and verified installer directory.',
    downloadPdfName: 'Sunlit_Energy_Terms_of_Service_v2.1.0.pdf',
    relatedStatutes: [
      { name: 'Federal Competition and Consumer Protection Act', citation: 'FCCPA 2018' },
      { name: 'Arbitration and Mediation Act', citation: 'Act No. 18 of 2023' },
    ],
    keyDefinitions: [
      { term: 'Platform', definition: 'The website, web applications, and services operated by Sunlit Global Energy Co. Ltd.' },
      { term: 'Project Owner', definition: 'A property owner, commercial entity, or individual soliciting solar installation services.' },
      { term: 'Verified Installer', definition: 'An independent solar contractor vetted and registered on the Sunlit platform.' },
    ],
    sections: [
      {
        id: 'acceptance',
        number: '1',
        title: 'Acceptance of Terms',
        content: [
          'By accessing or using Sunlit Energy, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service.',
          'If you are entering into these terms on behalf of a company or legal entity, you represent and warrant that you have full legal authority to bind that entity.',
        ],
      },
      {
        id: 'platform_role',
        number: '2',
        title: 'Sunlit Marketplace Role & Independent Contractors',
        content: [
          'Sunlit Energy operates as an intelligent marketplace and technology platform connecting Project Owners with independent Verified Installers and EPC Contractors.',
          'Installers and EPC Contractors are independent legal entities and not employees, agents, or joint-venture partners of Sunlit Energy.',
          'Turnkey project contracts, workmanship warranties, and site-specific equipment designs are entered into directly between the Project Owner and the selected Installer.',
        ],
      },
      {
        id: 'escrow',
        number: '3',
        title: 'Milestone Escrow & Payment Protection',
        content: [
          'To protect all participants, payments for solar installations are held in regulated milestone escrow accounts.',
          'Funds are disbursed to the installer only after the Project Owner reviews and confirms completion of verified engineering milestones (e.g. equipment arrival, roof mounting, inverter commissioning).',
          'In the event of a dispute, funds remain securely held in escrow until mutual resolution or binding dispute adjudication.',
        ],
      },
      {
        id: 'calculations',
        number: '4',
        title: 'Engineering Calculations & Preliminary Sizing',
        content: [
          'Solar sizing calculations (PV kWp, Inverter kVA, Battery storage, ROI estimates) provided on the platform are preliminary planning tools.',
          'The certified installer will verify roof structural integrity, shading, electrical phase balance, and site cable lengths during physical inspection prior to issuing a binding contract.',
        ],
      },
      {
        id: 'disputes',
        number: '5',
        title: 'Dispute Resolution & Governing Law',
        content: [
          'These Terms shall be governed by and construed in accordance with the Laws of the Federal Republic of Nigeria.',
          'Any dispute arising from or related to these Terms shall first be submitted to good-faith mediation under the Sunlit Dispute Resolution Framework.',
          'If unresolved within 30 days, disputes shall be settled by binding arbitration in Lagos, Nigeria under the Arbitration and Mediation Act 2023.',
        ],
      },
    ],
  },

  cookies: {
    id: 'DOC-COOK-2026-V140',
    slug: 'cookies',
    title: 'Cookie & Tracking Policy',
    documentType: 'COOKIE_POLICY',
    version: '1.4.0',
    status: 'PUBLISHED',
    lastUpdated: 'February 2026',
    effectiveDate: 'January 1, 2026',
    audience: 'All Website Visitors',
    jurisdiction: 'Federal Republic of Nigeria',
    governingLaw: 'Nigeria Data Protection Act (NDPA) 2023',
    summary:
      'We use cookies and similar technologies to ensure our engineering tools, user sessions, and verified marketplace operate smoothly, securely, and with respect for your privacy.',
    downloadPdfName: 'Sunlit_Energy_Cookie_Policy_v1.4.0.pdf',
    sections: [
      {
        id: 'what_are_cookies',
        number: '1',
        title: 'What Are Cookies?',
        content: [
          'Cookies are small text files placed on your computer or mobile device when you visit our web application. They allow us to remember your session, keep you signed in, preserve energy sizing calculator inputs, and enhance site security.',
        ],
      },
      {
        id: 'categories',
        number: '2',
        title: 'Categories of Cookies We Use',
        content: [
          'Essential Cookies: Strictly necessary for authentication, CSRF security tokens, and session maintenance. These cannot be disabled.',
          'Functional Cookies: Remember your preferences, such as selected Nigerian state (Lagos, Abuja, Ogun) and calculator load profiles.',
          'Analytics Cookies: Measure aggregated page performance, calculator tool usage, and load times to improve responsiveness under low-bandwidth network conditions.',
          'Marketing Cookies: Help measure the reach of educational clean energy campaigns across Nigeria.',
        ],
      },
      {
        id: 'managing_cookies',
        number: '3',
        title: 'Managing Your Cookie Preferences',
        content: [
          'You can customize your cookie preferences at any time using our Cookie Consent Manager or through your web browser settings.',
        ],
      },
    ],
  },

  'marketplace-terms': {
    id: 'DOC-MKT-2026-V180',
    slug: 'marketplace-terms',
    title: 'Marketplace & EPC Contractor Terms',
    documentType: 'MARKETPLACE_TERMS',
    version: '1.8.0',
    status: 'PUBLISHED',
    lastUpdated: 'February 2026',
    effectiveDate: 'January 1, 2026',
    audience: 'Solar Installers, EPC Contractors & Project Owners',
    jurisdiction: 'Federal Republic of Nigeria',
    governingLaw: 'Laws of the Federal Republic of Nigeria',
    summary:
      'Governs installer vetting, proposal submission standards, milestone bidding, performance warranties, and EPC contractor obligations on the Sunlit platform.',
    downloadPdfName: 'Sunlit_Energy_Marketplace_Terms_v1.8.0.pdf',
    relatedStatutes: [
      { name: 'Nigerian Electricity Management Services Agency (NEMSA) Act', citation: 'Act No. 6 of 2015' },
      { name: 'Federal Competition and Consumer Protection Act', citation: 'FCCPA 2018' },
    ],
    sections: [
      {
        id: 'vetting',
        number: '1',
        title: 'Installer Accreditation & Vetting Standards',
        content: [
          'All solar installers and EPC contractors listed on Sunlit must complete verification, including CAC registration check, technical certifications (e.g. COREN / NEMSA accreditation), and validated project portfolio audits.',
          'Installers agree to maintain active professional indemnity and public liability insurance suitable for the scale of projects undertaken.',
        ],
      },
      {
        id: 'bidding',
        number: '2',
        title: 'Proposal & Bidding Integrity',
        content: [
          'Installers must provide accurate bill of quantities (BOQ), verified Tier-1 equipment models (Bloomberg NEF Tier-1 solar panels, certified inverters, LiFePO4 batteries), and realistic project timelines.',
          'Bid manipulation, collusive pricing, or misrepresentation of equipment ratings results in immediate platform disqualification.',
        ],
      },
      {
        id: 'warranties',
        number: '3',
        title: 'Workmanship Warranties & Performance Guarantees',
        content: [
          'Installers must provide a minimum 12-month direct workmanship warranty covering all mounting, electrical conduit work, DC/AC cabling, and inverter commissioning.',
          'Manufacturer equipment warranties (typically 10–25 years for solar panels and 5–10 years for lithium batteries) must be transferred in full to the Project Owner upon commissioning.',
        ],
      },
      {
        id: 'subcontracting',
        number: '4',
        title: 'Crew & Subcontractor Governance',
        content: [
          'All field technicians and electricians assigned to Sunlit projects must adhere to Nigerian electrical safety codes and the Sunlit CrewLink Verification Standard.',
        ],
      },
    ],
  },

  'escrow-terms': {
    id: 'DOC-ESC-2026-V200',
    slug: 'escrow-terms',
    title: 'Milestone Escrow & Payment Disclosures',
    documentType: 'PAYMENT_TERMS',
    version: '2.0.0',
    status: 'PUBLISHED',
    lastUpdated: 'February 2026',
    effectiveDate: 'January 1, 2026',
    audience: 'All Transacting Users',
    jurisdiction: 'Federal Republic of Nigeria',
    governingLaw: 'Central Bank of Nigeria (CBN) Payments Framework',
    summary:
      'Explains how solar project funds are safeguarded in CBN-regulated milestone escrow accounts and released progressively upon verified engineering milestone approvals.',
    downloadPdfName: 'Sunlit_Energy_Escrow_Terms_v2.0.0.pdf',
    relatedStatutes: [
      { name: 'CBN Regulatory Framework for Mobile Money and Escrow', citation: 'CBN Circular 2020' },
      { name: 'Banks and Other Financial Institutions Act (BOFIA)', citation: 'BOFIA 2020' },
    ],
    sections: [
      {
        id: 'custody',
        number: '1',
        title: 'Custody of Funds in Segregated Accounts',
        content: [
          'All customer project funds are held in segregated, audited escrow accounts managed by licensed Nigerian commercial banking partners and CBN-regulated payment settlement entities.',
          'Sunlit Energy does not commingle operational funds with client project deposits.',
        ],
      },
      {
        id: 'milestones',
        number: '2',
        title: 'Milestone Disbursement Structure',
        content: [
          'Standard milestone releases typically adhere to verified project progress: Milestone 1 (Equipment Procurement & Delivery to Site), Milestone 2 (Structural Mounting & Wiring), and Milestone 3 (Final Commissioning, Grid Inversion Test & Handover).',
          'Milestone funds are released to the installer only after the Project Owner inspects the work and validates the release via secure One-Time Password (OTP) authorization.',
        ],
      },
      {
        id: 'dispute_hold',
        number: '3',
        title: 'Dispute Freezes & Engineering Audit',
        content: [
          'If either party raises a formal dispute, remaining escrow funds are automatically locked. An independent Sunlit technical auditor is assigned to conduct on-site inspection before funds are disbursed or refunded.',
        ],
      },
    ],
  },

  refunds: {
    id: 'DOC-REF-2026-V120',
    slug: 'refunds',
    title: 'Refund & Cancellation Policy',
    documentType: 'REFUND_POLICY',
    version: '1.2.0',
    status: 'PUBLISHED',
    lastUpdated: 'February 2026',
    effectiveDate: 'January 1, 2026',
    audience: 'Project Owners & Customers',
    jurisdiction: 'Federal Republic of Nigeria',
    governingLaw: 'Federal Competition and Consumer Protection Act (FCCPA) 2018',
    summary:
      'Clear consumer safeguards detailing refund eligibility, cancellation timeframes, equipment restocking conditions, and dispute resolution.',
    downloadPdfName: 'Sunlit_Energy_Refund_Policy_v1.2.0.pdf',
    relatedStatutes: [
      { name: 'FCCPA Consumer Rights Provisions', citation: 'FCCPA 2018 Part XV' },
    ],
    sections: [
      {
        id: 'pre_installation',
        number: '1',
        title: 'Pre-Installation Cancellation Rights',
        content: [
          'Project Owners may cancel a quote or project agreement prior to equipment procurement for a full refund of any deposited funds, less documented site engineering audit expenses.',
        ],
      },
      {
        id: 'equipment_defect',
        number: '2',
        title: 'Defective Equipment & Replacement Protocol',
        content: [
          'Any solar panel, inverter, or battery demonstrating manufacturing defects upon delivery will be replaced immediately at zero additional cost under the manufacturer warranty protocol.',
        ],
      },
      {
        id: 'processing_time',
        number: '3',
        title: 'Refund Processing & Settlement Timeline',
        content: [
          'Approved refunds are settled directly to the originating Nigerian bank account within 3 to 5 business days following formal cancellation approval.',
        ],
      },
    ],
  },

  'security-disclosure': {
    id: 'DOC-SEC-2026-V150',
    slug: 'security-disclosure',
    title: 'Security & Responsible Disclosure Policy',
    documentType: 'SECURITY_DISCLOSURE',
    version: '1.5.0',
    status: 'PUBLISHED',
    lastUpdated: 'February 2026',
    effectiveDate: 'January 1, 2026',
    audience: 'Security Researchers, Developers, & Platform Users',
    jurisdiction: 'Federal Republic of Nigeria / Global',
    governingLaw: 'Cybercrimes (Prohibition, Prevention, etc.) Act 2015',
    summary:
      'Guidelines for security researchers to responsibly report vulnerabilities in Sunlit infrastructure, sizing APIs, and authentication services under safe harbor protection.',
    downloadPdfName: 'Sunlit_Energy_Responsible_Disclosure_v1.5.0.pdf',
    sections: [
      {
        id: 'safe_harbor',
        number: '1',
        title: 'Safe Harbor Commitment',
        content: [
          'Sunlit Energy supports security researchers who discover and responsibly disclose potential vulnerabilities. We will not pursue legal action against researchers operating in good faith within the scope of this policy.',
        ],
      },
      {
        id: 'reporting',
        number: '2',
        title: 'Vulnerability Reporting Pathway',
        content: [
          'Please send detailed proof-of-concept reports to security@sunlit.energy with subject line [VULNERABILITY REPORT].',
          'Include steps to reproduce, impact assessment, and affected URLs or endpoints. Do not access or modify customer data or disrupt production energy operations.',
        ],
      },
      {
        id: 'response_sla',
        number: '3',
        title: 'Response & Remediation SLA',
        content: [
          'We acknowledge receipt within 24 hours and provide an initial assessment within 72 hours. Critical vulnerabilities are prioritized for immediate remediation.',
        ],
      },
    ],
  },

  'intellectual-property': {
    id: 'DOC-IP-2026-V110',
    slug: 'intellectual-property',
    title: 'Intellectual Property Policy',
    documentType: 'IP_POLICY',
    version: '1.1.0',
    status: 'PUBLISHED',
    lastUpdated: 'February 2026',
    effectiveDate: 'January 1, 2026',
    audience: 'All Users & Partners',
    jurisdiction: 'Federal Republic of Nigeria',
    governingLaw: 'Copyright Act 2022 & Trademarks Act',
    summary:
      'Governs ownership over Sunlit proprietary solar sizing calculation engines, brand marks, website designs, and platform source code.',
    downloadPdfName: 'Sunlit_Energy_IP_Policy_v1.1.0.pdf',
    sections: [
      {
        id: 'ownership',
        number: '1',
        title: 'Proprietary Algorithms & Calculation Engines',
        content: [
          'All software code, engineering sizing algorithms, load calculation models, visual UI designs, and database architectures are the exclusive intellectual property of Sunlit Global Energy Co. Ltd.',
        ],
      },
      {
        id: 'trademarks',
        number: '2',
        title: 'Trademarks & Brand Identity',
        content: [
          '“Sunlit”, “Sunlit Energy”, and associated logos are registered trademarks of Sunlit Global Energy Co. Ltd. Unauthorized commercial use without express written consent is prohibited.',
        ],
      },
    ],
  },

  'community-guidelines': {
    id: 'DOC-COM-2026-V130',
    slug: 'community-guidelines',
    title: 'Community Guidelines & Platform Conduct',
    documentType: 'COMMUNITY_GUIDELINES',
    version: '1.3.0',
    status: 'PUBLISHED',
    lastUpdated: 'February 2026',
    effectiveDate: 'January 1, 2026',
    audience: 'All Platform Members',
    jurisdiction: 'Federal Republic of Nigeria',
    governingLaw: 'Laws of the Federal Republic of Nigeria',
    summary:
      'Standards of professional conduct, authentic project reviews, anti-harassment rules, and content moderation across the Sunlit marketplace and forums.',
    downloadPdfName: 'Sunlit_Energy_Community_Guidelines_v1.3.0.pdf',
    sections: [
      {
        id: 'reviews',
        number: '1',
        title: 'Authentic Project Reviews & Ratings',
        content: [
          'Reviews and ratings may only be submitted by verified Project Owners who have engaged an installer through the Sunlit platform.',
          'Fabricated reviews, competitor disparagement, and incentivized testimonials are strictly forbidden and subject to account suspension.',
        ],
      },
      {
        id: 'conduct',
        number: '2',
        title: 'Professional Communication & Safety',
        content: [
          'All interactions between customers, installers, crew members, and Sunlit staff must remain respectful, professional, and free from discrimination or harassment.',
        ],
      },
    ],
  },

  compliance: {
    id: 'DOC-COMP-2026-V210',
    slug: 'compliance',
    title: 'Compliance & Regulatory Information',
    documentType: 'REGULATORY_COMPLIANCE',
    version: '2.1.0',
    status: 'PUBLISHED',
    lastUpdated: 'February 2026',
    effectiveDate: 'January 1, 2026',
    audience: 'Regulators, Investors, & Public',
    jurisdiction: 'Federal Republic of Nigeria',
    governingLaw: 'Nigerian Electricity Act 2023 & NDPA 2023',
    summary:
      'Comprehensive public compliance overview detailing regulatory adherence to NERC mini-grid standards, NEMSA safety codes, NDPC data protection, and CBN payments.',
    downloadPdfName: 'Sunlit_Energy_Compliance_Overview_v2.1.0.pdf',
    relatedStatutes: [
      { name: 'Electricity Act 2023', citation: 'Federal Republic of Nigeria' },
      { name: 'Nigeria Data Protection Act', citation: 'Act No. 12 of 2023' },
    ],
    sections: [
      {
        id: 'nerc',
        number: '1',
        title: 'Renewable Energy & NERC Standards',
        content: [
          'Sunlit designs and installer workflows align with the Nigerian Electricity Regulatory Commission (NERC) regulations for captive power generation, rooftop solar, and distributed renewable energy.',
        ],
      },
      {
        id: 'nemsa',
        number: '2',
        title: 'NEMSA Electrical Code Enforcement',
        content: [
          'Installers on the platform are required to adhere to Nigerian Electricity Management Services Agency (NEMSA) wiring regulations, proper DC earthing, surge protection device (SPD) installation, and lightning arrestor protocols.',
        ],
      },
    ],
  },

  contact: {
    id: 'DOC-CON-2026-V100',
    slug: 'contact',
    title: 'Legal Contact & Statutory Inquiries',
    documentType: 'LEGAL_CONTACT',
    version: '1.0.0',
    status: 'PUBLISHED',
    lastUpdated: 'February 2026',
    effectiveDate: 'January 1, 2026',
    audience: 'Regulators, Legal Representatives, & General Public',
    jurisdiction: 'Federal Republic of Nigeria',
    governingLaw: 'Laws of the Federal Republic of Nigeria',
    summary:
      'Official statutory communication pathways for regulatory notices, Data Protection Officer inquiries, IP notices, and dispute escalation.',
    downloadPdfName: 'Sunlit_Energy_Legal_Contact_Directory.pdf',
    sections: [
      {
        id: 'channels',
        number: '1',
        title: 'Official Legal Communication Channels',
        content: [
          'For Data Protection & NDPA Inquiries: privacy@sunlit.energy | dpo@sunlit.energy',
          'For General Legal & Regulatory Notices: legal@sunlit.energy',
          'For Escrow & Payment Disputes: disputes@sunlit.energy',
          'For Security & Vulnerability Disclosures: security@sunlit.energy',
        ],
      },
      {
        id: 'address',
        number: '2',
        title: 'Physical & Registered Corporate Address',
        content: [
          'Sunlit Global Energy Co. Ltd.',
          'Victoria Island / Lekki Phase 1, Lagos State, Federal Republic of Nigeria.',
        ],
      },
    ],
  },
};
