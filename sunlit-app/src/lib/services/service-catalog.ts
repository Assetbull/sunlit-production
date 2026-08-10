export interface ServiceAudience {
  title: string;
  badge: string;
  description: string;
  typicalLoad: string;
  keyBenefit: string;
}

export interface ProblemSolved {
  problem: string;
  impact: string;
  solution: string;
}

export interface EngineeredPillar {
  component: string;
  specification: string;
  assurance: string;
}

export interface ServiceBenefit {
  metric: string;
  title: string;
  description: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  tag: string;
  categoryBadge: string;
  heroHeadline: string;
  heroSummary: string; // First 60-words direct answer for GEO / AI Answer Engines
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  systemSizing: string;
  batteryCycleLife: string;
  estMonthlyRoi: string;
  paybackPeriod: string;
  inverterTopology: string;
  highlight?: boolean;
  featured?: boolean;
  audiences: ServiceAudience[];
  problemsSolved: ProblemSolved[];
  pillars: EngineeredPillar[];
  benefits: ServiceBenefit[];
  faqs: ServiceFAQ[];
  relatedSlugs: string[];
}

export const SERVICE_CATALOG: Record<string, ServiceItem> = {
  'residential-solar': {
    id: 'residential-solar',
    slug: 'residential-solar',
    title: 'Residential Solar (3kVA – 15kVA)',
    shortTitle: 'Residential Solar',
    tag: 'Best For: Homeowners & Duplexes',
    categoryBadge: 'RESIDENTIAL CLEAN ENERGY',
    heroHeadline: 'Eliminate Generator Noise, Blackouts, and Fuel Bills Forever.',
    heroSummary:
      'Sunlit delivers precision-engineered rooftop solar and LiFePO4 battery systems (3kVA to 15kVA) tailored for Nigerian homes and duplexes. By coupling Tier-1 monocrystalline panels with smart hybrid inverters, we replace expensive petrol and diesel generation with 24/7 clean power, fully secured by milestone-based escrow payments.',
    metaTitle: 'Residential Solar Installation (3kVA–15kVA) Nigeria | Sunlit Energy',
    metaDescription:
      'Engineered rooftop solar systems with LiFePO4 battery storage for Nigerian homes. Eliminate generator fuel costs and blackouts with 100% escrow milestone protection.',
    keywords: [
      'residential solar nigeria',
      'solar for homes lagos',
      '5kva solar system abuja',
      '10kva solar inverter ogun',
      'lifepo4 battery residential lagos',
      'rooftop solar installation lekki',
    ],
    systemSizing: '3kVA – 15kVA (4kWp – 18kWp PV)',
    batteryCycleLife: '6,000+ Cycles (LiFePO4 Tier-1)',
    estMonthlyRoi: '₦180,000 – ₦450,000 / month saved',
    paybackPeriod: '2.4 – 3.6 Years',
    inverterTopology: 'Pure Sine Wave Smart Hybrid with Grid Shaving',
    featured: true,
    audiences: [
      {
        title: '3–5 Bedroom Duplex Owners',
        badge: 'DUPLEXES & ESTATES',
        description: 'Homeowners spending ₦200,000+ monthly on generator fueling and maintenance.',
        typicalLoad: '3 Inverter ACs, 2 Refrigerators, Pumping Machine, Lighting & Entertainment',
        keyBenefit: 'Seamless automatic changeover with zero flicker and zero generator fumes.',
      },
      {
        title: 'Gated Community Residents',
        badge: 'ESTATE LIVING',
        description: 'Residents subject to noisy estate generator schedules and expensive Band A grid tariffs.',
        typicalLoad: 'Essential 24/7 household power, Home Office, Deep Freezers',
        keyBenefit: 'Quiet daytime solar charging and overnight silent battery autonomy.',
      },
      {
        title: 'Remote Professionals & Executives',
        badge: 'REMOTE WORK',
        description: 'Professionals requiring 99.99% uninterrupted uptime for connectivity and productivity.',
        typicalLoad: 'Workstations, Starlink/Fiber Routers, Climate Control, Security Cameras',
        keyBenefit: 'Guaranteed continuity during prolonged national grid collapse events.',
      },
    ],
    problemsSolved: [
      {
        problem: 'Skyrocketing Fuel Costs',
        impact: 'Petrol and diesel prices consume over 35% of Nigerian household monthly utility budgets.',
        solution: 'Sunlit rooftop solar harnesses free sunlight, eliminating over 85% of recurring fuel costs.',
      },
      {
        problem: 'Equipment Damage from Grid Surges',
        impact: 'Erratic grid voltage spikes burn inverter circuit boards and expensive home electronics.',
        solution: 'Built-in double surge suppression and clean pure sine wave power protect all connected appliances.',
      },
      {
        problem: 'Contractor Payment Fraud',
        impact: 'Homeowners risk losing money to untrusted installers who abandon unfinished installations.',
        solution: 'Sunlit Escrow holds 100% of project funds, paying the installer only upon verified commissioning.',
      },
    ],
    pillars: [
      {
        component: 'Tier-1 Mono PERC PV Panels',
        specification: '550W+ Bifacial / Monocrystalline with 21.8%+ conversion efficiency.',
        assurance: '25-Year Linear Power Performance Warranty.',
      },
      {
        component: 'LiFePO4 Smart Battery Bank',
        specification: '51.2V 100Ah – 300Ah Wall-mount/Rack cells with integrated Smart BMS.',
        assurance: '10-Year Operational Lifespan & 6,000 cycle rating at 80% DoD.',
      },
      {
        component: 'Smart Hybrid Solar Inverter',
        specification: 'Low-frequency pure sine wave with dual MPPT charge controllers (99% efficiency).',
        assurance: '5-Year Manufacturer Warranty & Local Nigerian RMA replacement support.',
      },
      {
        component: 'Automated Class-1 ATS & SPD',
        specification: 'Fast transfer switch (<10ms) paired with Type II lightning and surge protection.',
        assurance: 'Certified electrical safety conforming to NEMSA & IEC standards.',
      },
    ],
    benefits: [
      {
        metric: '85%+',
        title: 'Fuel Expense Reduction',
        description: 'Redirect hundreds of thousands of Naira spent on monthly diesel/petrol straight to household savings.',
      },
      {
        metric: '<10ms',
        title: 'Zero-Flicker Transfer',
        description: 'Computers, TVs, and medical equipment remain fully powered when the national grid disconnects.',
      },
      {
        metric: '100%',
        title: 'Milestone Escrow Guard',
        description: 'Your capital remains in licensed escrow until site audit and telemetry verify flawless installation.',
      },
      {
        metric: '25 Yrs',
        title: 'Solar Panel Asset Life',
        description: 'Built to withstand harsh tropical heat, coastal humidity in Lagos, and dust storms in northern corridors.',
      },
    ],
    faqs: [
      {
        question: 'How many air conditioners can a 10kVA Sunlit residential solar system power?',
        answer:
          'A properly engineered 10kVA Sunlit hybrid system with a 15kWh LiFePO4 battery bank comfortably runs two 1.5HP inverter air conditioners simultaneously alongside deep freezers, pumping machines, TVs, and household lighting throughout the day and into the night.',
      },
      {
        question: 'How does Sunlit escrow protect my residential solar installation payment?',
        answer:
          'When you approve a quote, your funds are deposited into an independent, licensed milestone escrow account. The installer is paid in stages: 30% upon equipment delivery on-site, 50% upon mechanical and electrical mounting, and the final 20% only after IoT telemetry verifies correct power generation and you sign off.',
      },
      {
        question: 'What happens during prolonged cloudy or rainy days in Nigeria?',
        answer:
          'Sunlit systems utilize high-efficiency Tier-1 bifacial panels that capture diffused ambient solar radiation during overcast conditions. Additionally, smart hybrid inverters automatically prioritize utility grid or generator top-up if battery reserves fall below safe threshold limits.',
      },
      {
        question: 'What is the expected lifespan of the LiFePO4 battery compared to tubular lead-acid?',
        answer:
          'Sunlit LiFePO4 (Lithium Iron Phosphate) batteries offer 6,000+ charge cycles at 80% Depth of Discharge, translating to 10–15 years of daily use. In contrast, traditional lead-acid or tubular gel batteries degrade within 18 to 24 months in Nigerian climatic conditions.',
      },
    ],
    relatedSlugs: ['battery-storage', 'energy-audits', 'maintenance'],
  },

  'commercial-solar': {
    id: 'commercial-solar',
    slug: 'commercial-solar',
    title: 'Commercial Solar (15kVA – 100kVA)',
    shortTitle: 'Commercial Solar',
    tag: 'Best For: Offices, Retail & Schools',
    categoryBadge: 'COMMERCIAL INFRASTRUCTURE',
    heroHeadline: 'Slash Band A Tariffs and Daytime Diesel OPEX by up to 75%.',
    heroSummary:
      'Sunlit delivers enterprise-grade commercial solar systems (15kVA to 100kVA) for office complexes, private hospitals, schools, hotels, and retail plazas across Nigeria. Designed for high daytime power demands, our hybrid microgrids protect operational margins against unpredictable grid tariff spikes and diesel generator overhead.',
    metaTitle: 'Commercial Solar Systems (15kVA–100kVA) Nigeria | Sunlit Energy',
    metaDescription:
      'Commercial solar microgrids for Nigerian businesses, clinics, and retail centers. Cut daytime diesel running costs by 75% with vetted EPC installer matching.',
    keywords: [
      'commercial solar nigeria',
      'solar for businesses lagos',
      '30kva commercial inverter abuja',
      'solar for hospitals ogun',
      'diesel replacement commercial solar',
    ],
    systemSizing: '15kVA – 100kVA (20kWp – 120kWp PV)',
    batteryCycleLife: '6,000+ Cycles (Industrial LiFePO4)',
    estMonthlyRoi: '₦650,000 – ₦3,200,000 / month saved',
    paybackPeriod: '2.1 – 3.2 Years',
    inverterTopology: '3-Phase Commercial Hybrid with Parallel Scalability',
    featured: false,
    audiences: [
      {
        title: 'Corporate Offices & Tech Hubs',
        badge: 'OFFICES & HUBS',
        description: 'Multi-story offices requiring continuous cooling, server uptime, and lighting.',
        typicalLoad: 'Central HVAC, Server Rooms, Workstations, Elevators',
        keyBenefit: 'Eliminates peak-hour diesel generator running and reduces daytime OPEX.',
      },
      {
        title: 'Private Hospitals & Medical Labs',
        badge: 'HEALTHCARE',
        description: 'Diagnostic centers and clinics where power fluctuations risk lives and equipment.',
        typicalLoad: 'MRI/CT Scanners, Cold Storage, Operating Theaters, Intensive Care',
        keyBenefit: 'Pure sine wave power with zero harmonics and medical-grade voltage stabilization.',
      },
      {
        title: 'Retail Plazas, Hotels & Schools',
        badge: 'HOSPITALITY & RETAIL',
        description: 'Commercial facilities where high Band A electricity bills erode operational profitability.',
        typicalLoad: 'Commercial Refrigeration, Kitchen Equipment, Lighting, Air Conditioning',
        keyBenefit: 'Significant reduction in utility overhead with transparent tenant power sub-metering.',
      },
    ],
    problemsSolved: [
      {
        problem: 'DisCo Band A Tariff Hikes',
        impact: 'Grid electricity rates in Nigeria continue to rise, dramatically increasing business overhead.',
        solution: 'Sunlit commercial solar generates predictable, low-cost kilowatt-hours on-site for 25+ years.',
      },
      {
        problem: 'Costly Daytime Diesel Generation',
        impact: 'Running 50kVA+ generators during business hours costs over ₦1,200/liter in fuel plus maintenance.',
        solution: 'Daytime solar PV directly powers all business loads, keeping diesel generators in reserve standby.',
      },
      {
        problem: 'Inadequate EPC Engineering Standards',
        impact: 'Improper load balance on 3-phase setups causes inverter trips and transformer burnouts.',
        solution: 'Sunlit matches vetted Level-3 EPC contractors with certified engineering schematics.',
      },
    ],
    pillars: [
      {
        component: 'High-Efficiency Commercial PV Arrays',
        specification: '650W+ Tier-1 Bifacial N-Type Modules with high wind load rating.',
        assurance: '30-Year Performance Warranty with PID and LID resistance.',
      },
      {
        component: 'Industrial LiFePO4 Rack Battery Cabinets',
        specification: 'High-voltage (HV) modular lithium storage with active balancing BMS.',
        assurance: '10-Year Commercial Warranty with automated cell health telemetry.',
      },
      {
        component: '3-Phase Grid-Tied / Hybrid Inverters',
        specification: 'Dual/Triple MPPT with smart peak shaving and generator sync integration.',
        assurance: 'IEC 62109 certified with remote telemetry gateway.',
      },
      {
        component: 'Enterprise Power Monitoring Hub',
        specification: 'IoT-connected energy meters tracking sub-distribution and yield telemetry.',
        assurance: 'Sunlit Suite real-time dashboard with automated anomaly detection.',
      },
    ],
    benefits: [
      {
        metric: '75%',
        title: 'Daytime OPEX Savings',
        description: 'Shift your primary energy consumption to peak solar hours for maximum bottom-line savings.',
      },
      {
        metric: '3-Phase',
        title: 'True Phase Balancing',
        description: 'Advanced commercial inverters balance irregular load draws across L1, L2, and L3 phases.',
      },
      {
        metric: '2.1 Yrs',
        title: 'Rapid Capital Payback',
        description: 'Aggressive fuel displacement ensures commercial solar investments pay for themselves quickly.',
      },
      {
        metric: '24/7',
        title: 'Enterprise Monitoring',
        description: 'Facility managers monitor load consumption, battery state, and grid input in real time.',
      },
    ],
    faqs: [
      {
        question: 'Can commercial solar integrate with our existing diesel generator and the national grid?',
        answer:
          'Yes. Sunlit commercial hybrid inverters feature automatic generator management and grid-tie synchronization. The system intelligently prioritizes solar power first, battery second, grid third, and activates the generator only as a last resort during heavy load spikes.',
      },
      {
        question: 'How is maintenance handled for commercial solar installations?',
        answer:
          'Sunlit provides scheduled preventive maintenance contracts including quarterly thermographic panel drone inspections, inverter firmware updates, BMS impedance balancing, and a guaranteed 4-hour technical response SLA across Lagos, Abuja, and Ogun.',
      },
      {
        question: 'Can we finance commercial solar through lease-to-own or PPA structures?',
        answer:
          'Yes. Sunlit connects qualified commercial entities with structured asset financing partners offering 24 to 60-month lease-to-own plans and Power Purchase Agreements (PPA) with zero upfront CapEx required.',
      },
      {
        question: 'What size system is needed for a 3-story corporate office building?',
        answer:
          'A typical 3-story office building with 40 workstations, server room, and 10 split-unit air conditioners requires a 30kVA to 50kVA hybrid solar system with 40kWh to 60kWh of LiFePO4 battery capacity.',
      },
    ],
    relatedSlugs: ['industrial-solar', 'energy-audits', 'solar-financing'],
  },

  'industrial-solar': {
    id: 'industrial-solar',
    slug: 'industrial-solar',
    title: 'Industrial Solar (100kVA – 1MW+)',
    shortTitle: 'Industrial Solar',
    tag: 'Best For: Factories & Logistics',
    categoryBadge: 'HEAVY INDUSTRIAL MICROGRIDS',
    heroHeadline: 'Megawatt-Scale Solar Microgrids for Nigerian Manufacturing & Processing.',
    heroSummary:
      'Sunlit engineers and commissions high-capacity industrial solar microgrids (100kVA to 1MW+) for manufacturing plants, cold storage warehouses, logistics parks, and agro-processing hubs across Ogun, Lagos, and Abuja industrial corridors. We eliminate heavy industrial fuel exposure with high-voltage storage and multi-MW engineering standards.',
    metaTitle: 'Industrial Solar Microgrids (100kVA–1MW+) Nigeria | Sunlit Energy',
    metaDescription:
      'High-capacity industrial solar microgrids for factories and logistics hubs across Nigeria. Cut industrial generator expenditure with certified EPC execution.',
    keywords: [
      'industrial solar nigeria',
      'solar microgrids lagos',
      '100kva industrial inverter ogun',
      'megawatt solar factory nigeria',
      'cold storage solar agbara',
    ],
    systemSizing: '100kVA – 1MW+ (150kWp – 1.5MWp PV)',
    batteryCycleLife: '8,000+ Cycles (Utility Grade Containerized LiFePO4)',
    estMonthlyRoi: '₦4,500,000 – ₦35,000,000 / month saved',
    paybackPeriod: '1.8 – 2.9 Years',
    inverterTopology: 'Medium-Voltage Utility Microgrid Central & String Inverters',
    featured: false,
    audiences: [
      {
        title: 'Manufacturing Plants & FMCG Factories',
        badge: 'MANUFACTURING',
        description: 'Heavy industrial production lines in Agbara, Ikeja, Sagamu, and Idu industrial estates.',
        typicalLoad: 'Induction Motors, Extruders, Packaging Lines, Compressors, Factory Lighting',
        keyBenefit: 'Stabilizes heavy reactive power loads and shields factory OPEX from diesel price volatility.',
      },
      {
        title: 'Cold Storage & Agro-Processing Hubs',
        badge: 'AGRO & COLD CHAIN',
        description: 'Perishable goods storage facilities requiring non-negotiable 24/7 refrigeration.',
        typicalLoad: 'Industrial Chillers, Blast Freezers, Sorting Machinery, Conveyor Systems',
        keyBenefit: 'Guarantees uninterrupted cold chain integrity and eliminates spoiled inventory risk.',
      },
      {
        title: 'Logistics Parks & Distribution Hubs',
        badge: 'LOGISTICS & FLEET',
        description: 'Large distribution warehouses with vast open roof space ideal for megawatt PV generation.',
        typicalLoad: 'Automated Sorting, Material Handling, EV Yard Trucks, Security Perimeters',
        keyBenefit: 'Transforms dormant warehouse roofs into massive revenue-saving power generation assets.',
      },
    ],
    problemsSolved: [
      {
        problem: 'Crushing Heavy Oil & Diesel OPEX',
        impact: 'Industrial diesel consumption frequently accounts for over 45% of total manufacturing cost.',
        solution: 'Industrial solar microgrids displace millions of liters of diesel fuel each operating year.',
      },
      {
        problem: 'Factory Downtime from Grid Tripping',
        impact: 'Sudden factory power trips cause production batch loss, pipe clogging, and machine recalibration.',
        solution: 'High-speed industrial microgrid controllers transition seamlessly without a microsecond power drop.',
      },
      {
        problem: 'Poor Power Factor & Harmonic Penalties',
        impact: 'Heavy motors introduce harmonic distortion and low power factor penalties from DisCos.',
        solution: 'Integrated active power factor correction and harmonic filters optimize energy throughput.',
      },
    ],
    pillars: [
      {
        component: 'Utility-Grade N-Type Solar Arrays',
        specification: '700W+ Bifacial Tier-1 modules mounted on aerodynamic industrial racking.',
        assurance: '30-Year Performance Warranty with cyclonic wind resilience.',
      },
      {
        component: 'Containerized BESS (Battery Energy Storage)',
        specification: '0.5MWh – 4MWh liquid-cooled LiFePO4 battery storage with fire suppression.',
        assurance: '15-Year Life Cycle with HVAC temperature regulation and real-time cloud BMS.',
      },
      {
        component: 'Central / Multi-String Industrial Inverters',
        specification: 'Medium-voltage transformer-matched inverters with dynamic droop control.',
        assurance: 'IEEE 1547 and IEC 62891 microgrid compliance.',
      },
      {
        component: 'SCADA & Microgrid Energy Management (EMS)',
        specification: 'Industrial PLC telemetry with predictive AI dispatch and automated demand response.',
        assurance: 'Sunlit Industrial Command Center telemetry with 99.9% uptime SLA.',
      },
    ],
    benefits: [
      {
        metric: '₦100M+',
        title: 'Annual Fuel Savings',
        description: 'Major factories eliminate hundreds of millions of Naira in recurring diesel imports annually.',
      },
      {
        metric: '0.00%',
        title: 'Production Interruption',
        description: 'Seamless microgrid switching ensures sensitive CNC machines and automated lines never drop.',
      },
      {
        metric: '1.8 Yrs',
        title: 'Unbeatable Industrial ROI',
        description: 'High daytime energy utilization yields the fastest capital payback in the renewable energy sector.',
      },
      {
        metric: 'ISO/ESG',
        title: 'Corporate Decarbonization',
        description: 'Certified Scope 1 & Scope 2 carbon offset telemetry for multinational ESG compliance.',
      },
    ],
    faqs: [
      {
        question: 'Can Sunlit handle heavy industrial motor starting currents (inductive loads)?',
        answer:
          'Yes. Sunlit industrial microgrids are engineered with high-overload capacity inverters (up to 200% surge for 10 seconds) and active power factor compensation designed specifically to start large 3-phase industrial compressors, chillers, and induction motors without voltage sagging.',
      },
      {
        question: 'What is the implementation timeline for a 500kW to 1MW industrial solar project?',
        answer:
          'A typical 500kW to 1MW installation takes 6 to 12 weeks from finalized engineering design to commissioning: 2 weeks for site load profiling and structural roof audit, 4 weeks for equipment logistics and delivery, and 3–4 weeks for mechanical/electrical mounting and SCADA testing.',
      },
      {
        question: 'How is payment secured on large-scale industrial projects?',
        answer:
          'Industrial projects utilize Sunlit Enterprise Escrow. Capital is disbursed across 5 auditable project milestones: Engineering sign-off, Factory acceptance testing (FAT), On-site delivery, Mechanical completion, and final Grid/NEMSA commissioning verification.',
      },
    ],
    relatedSlugs: ['commercial-solar', 'energy-audits', 'marketplace'],
  },

  'marketplace': {
    id: 'marketplace',
    slug: 'marketplace',
    title: 'Solar Installer & RFQ Marketplace',
    shortTitle: 'Installer Marketplace',
    tag: 'Best For: Project Owners & EPCs',
    categoryBadge: 'VERIFIED EPC MARKETPLACE',
    heroHeadline: 'Connect with Nigeria’s Top 5% Vetted Solar Installers and EPCs.',
    heroSummary:
      'The Sunlit Marketplace connects project owners, real estate developers, and corporate enterprises directly with verified, background-checked solar installers and EPC contractors across Nigeria. Publish your project RFQ, receive multiple competitive bids, compare hardware datasheets, and execute with milestone escrow security.',
    metaTitle: 'Vetted Solar Installer & EPC Marketplace Nigeria | Sunlit Energy',
    metaDescription:
      'Compare competitive bids from verified Nigerian solar installers and EPC contractors. Guaranteed milestone escrow payments and verified engineering quality.',
    keywords: [
      'solar installer marketplace nigeria',
      'find solar installer lagos',
      'solar rfq marketplace',
      'vetted epc contractors abuja',
      'hire certified solar installer',
    ],
    systemSizing: 'All Residential, Commercial & Industrial Capacities',
    batteryCycleLife: 'Verified Equipment Warranties on All Bids',
    estMonthlyRoi: '15% – 25% Procurement Cost Reduction via Bidding',
    paybackPeriod: 'Competitive Market Pricing Guaranteed',
    inverterTopology: 'All Approved Tier-1 Global & Local Inverter Brands',
    featured: false,
    audiences: [
      {
        title: 'Project Owners & Homeowners',
        badge: 'PROPERTY OWNERS',
        description: 'Individuals seeking verified solar professionals without the risk of hiring unvetted technicians.',
        typicalLoad: 'Complete turnkey solar procurement and professional installation',
        keyBenefit: 'Guaranteed quality, standardized warranties, and 100% escrow payment protection.',
      },
      {
        title: 'Estate Developers & Architects',
        badge: 'REAL ESTATE',
        description: 'Developers planning community microgrids, solar street lighting, and residential estates.',
        typicalLoad: 'Multi-unit residential installations and commercial solar infrastructure',
        keyBenefit: 'Access to volume EPC bidding with unified project tracking and warranty management.',
      },
      {
        title: 'Certified Solar Installers & EPCs',
        badge: 'INSTALLER PARTNERS',
        description: 'Registered engineering companies looking for high-quality, funded solar installation opportunities.',
        typicalLoad: 'Receive vetted client RFQs with secured escrow funding',
        keyBenefit: 'Guaranteed milestone payment disbursement without client payment default risk.',
      },
    ],
    problemsSolved: [
      {
        problem: 'Overpriced and Inconsistent Quotes',
        impact: 'Single-source procurement often results in 30% to 50% inflated solar hardware prices.',
        solution: 'Competitive marketplace bidding ensures market-rate transparent pricing for every component.',
      },
      {
        problem: 'Unverified Installer Credentials',
        impact: 'Untrained installers make dangerous electrical wiring errors that cause fires and inverter failures.',
        solution: 'Sunlit verifies CAC registration, NEMSA certifications, past project audits, and client reviews.',
      },
      {
        problem: 'Payment Disputes and Abandoned Jobs',
        impact: 'Clients fear paying upfront; installers fear non-payment upon job completion.',
        solution: 'Sunlit Escrow balances the transaction, releasing payments only when milestones are certified.',
      },
    ],
    pillars: [
      {
        component: 'Multi-Tier Installer Vetting System',
        specification: 'CAC corporate verification, NEMSA license validation, and past installation audits.',
        assurance: 'Only the top 5% of applying contractors are admitted to the verified network.',
      },
      {
        component: 'Smart RFQ & Proposal Comparison Engine',
        specification: 'Standardized bid breakdown showing panel wattage, battery capacity, inverter model, and labor.',
        assurance: 'Transparent apples-to-apples datasheet and cost comparison.',
      },
      {
        component: 'Milestone Escrow Orchestrator',
        specification: 'Automated multi-stage funds locking and OTP-authorized release.',
        assurance: 'Licensed banking escrow partner with 100% deposit solvency.',
      },
      {
        component: 'Independent Quality Verification',
        specification: 'Physical site inspection checklists and telemetry verification before final payment signoff.',
        assurance: 'Sunlit engineering quality assurance certificate issued for every completed project.',
      },
    ],
    benefits: [
      {
        metric: '500+',
        title: 'Verified Installers',
        description: 'Pre-screened professionals across Lagos, Abuja, Ogun, Port Harcourt, and nationwide.',
      },
      {
        metric: '3+',
        title: 'Competitive Bids in 24h',
        description: 'Post your RFQ and receive itemized technical proposals from certified local experts.',
      },
      {
        metric: '0%',
        title: 'Payment Default Risk',
        description: 'Funds are securely locked in escrow before project commencement, protecting both parties.',
      },
      {
        metric: '4.9/5',
        title: 'Verified Client Rating',
        description: 'Every review is tied to an authentic, completed escrow-backed transaction.',
      },
    ],
    faqs: [
      {
        question: 'How do I submit an RFQ on the Sunlit Marketplace?',
        answer:
          'Click "Get Started", specify your property type, load requirements (or use our Solar Sizing Calculator), select your location, and submit your project. Certified local installers will review your specifications and submit structured proposals within 24 hours.',
      },
      {
        question: 'How does Sunlit vet solar installers and EPCs on the platform?',
        answer:
          'Installers undergo a 4-stage validation process: Corporate CAC verification, NEMSA certification check, on-site inspection of at least three completed historical projects, and financial creditworthiness audit.',
      },
      {
        question: 'Are there any fees for project owners to post an RFQ?',
        answer:
          'No. Submitting an RFQ and receiving bids on the Sunlit Marketplace is 100% free for homeowners, commercial property owners, and developers.',
      },
    ],
    relatedSlugs: ['residential-solar', 'commercial-solar', 'energy-audits'],
  },

  'energy-audits': {
    id: 'energy-audits',
    slug: 'energy-audits',
    title: 'Energy Audits & Load Profiling',
    shortTitle: 'Energy Audits',
    tag: 'Best For: Cost Optimization',
    categoryBadge: 'PRECISION LOAD ENGINEERING',
    heroHeadline: 'Eliminate Undersizing and Avoid Overpaying with Certified Load Measurement.',
    heroSummary:
      'Sunlit provides comprehensive on-site electrical load auditing, harmonic distortion analysis, and ROI financial modeling for residential and commercial properties in Nigeria. Our certified energy engineers capture real-time power consumption data before procurement, guaranteeing your solar system is sized with mathematical precision.',
    metaTitle: 'Solar Energy Audits & Load Profiling Nigeria | Sunlit Energy',
    metaDescription:
      'On-site solar load profiling, harmonic analysis, and system sizing audits in Nigeria. Prevent inverter undersizing and equipment burnout before buying.',
    keywords: [
      'energy audit nigeria',
      'solar load profiling lagos',
      'commercial power audit abuja',
      'harmonic analysis solar ogun',
      'solar sizing audit',
    ],
    systemSizing: 'Applicable to All Electrical Facilities (1kVA to 2MW+)',
    batteryCycleLife: 'Engineered Sizing to Maximize Battery Longevity',
    estMonthlyRoi: 'Prevents 20% – 40% in Unnecessary Hardware Over-expenditure',
    paybackPeriod: 'Immediate ROI on System Procurement',
    inverterTopology: 'Precise kVA & Surge Headroom Optimization',
    featured: false,
    audiences: [
      {
        title: 'Commercial Facilities & Warehouses',
        badge: 'COMMERCIAL',
        description: 'Businesses wanting exact electrical load duration curves before committing capital.',
        typicalLoad: 'Multi-phase motor loads, HVAC, Lighting, Machinery',
        keyBenefit: 'Prevents costly inverter trips by identifying hidden surge currents and harmonic peaks.',
      },
      {
        title: 'Homeowners Sizing New Installations',
        badge: 'RESIDENTIAL',
        description: 'Duplex owners wanting to know exactly which appliances can run simultaneously.',
        typicalLoad: 'Air conditioners, Refrigeration, Pumping machines, Electronics',
        keyBenefit: 'Determines the exact battery kWh required to eliminate midnight blackout surprises.',
      },
      {
        title: 'Existing Solar Owners with Fast Battery Drain',
        badge: 'TROUBLESHOOTING',
        description: 'Property owners whose batteries deplete prematurely despite sunny weather.',
        typicalLoad: 'Diagnosing phantom loads, inverter parasitic draw, and battery cell degradation',
        keyBenefit: 'Pinpoints electrical leakage and re-calibrates inverter charge parameters.',
      },
    ],
    problemsSolved: [
      {
        problem: 'Inverter Undersizing & Continuous Overload Trips',
        impact: 'Guessing load requirements results in inverters tripping every time a compressor or pump starts.',
        solution: 'High-frequency data logging captures true inrush current surges to size adequate kVA headroom.',
      },
      {
        problem: 'Overspending on Unnecessary Battery Capacity',
        impact: 'Unverified estimates lead to purchasing redundant battery capacity that is never utilized.',
        solution: 'Precise day/night kWh consumption profiling sizes the exact battery bank needed.',
      },
      {
        problem: 'Undetected Phantom Loads & Wiring Leakage',
        impact: 'Faulty neutral-ground bonding and phantom loads silently drain batteries even when appliances are off.',
        solution: 'Comprehensive insulation resistance and thermal audit identifies and fixes electrical leakage.',
      },
    ],
    pillars: [
      {
        component: 'Class-A Power Quality Analyzers',
        specification: 'Multi-channel data loggers capturing voltage, current, PF, THD, and active/reactive power.',
        assurance: 'Calibrated to IEC 61000-4-30 Class A standards.',
      },
      {
        component: 'Thermographic Infrared Camera Scanning',
        specification: 'High-resolution thermal imaging of distribution boards, breakers, and busbars.',
        assurance: 'Detects loose terminals and overheating conductors before fire risks emerge.',
      },
      {
        component: 'Solar Yield & Irradiance Simulation Engine',
        specification: 'Site-specific PVsyst modeling utilizing 20-year NASA solar radiation telemetry.',
        assurance: 'Predicts monthly kilowatt-hour generation with 98% statistical confidence.',
      },
      {
        component: 'Comprehensive Audit & ROI Report',
        specification: 'Engineering dossier containing load profiles, single-line diagrams (SLD), and payback charts.',
        assurance: 'Certified by registered COREN electrical engineers.',
      },
    ],
    benefits: [
      {
        metric: '100%',
        title: 'Sizing Accuracy',
        description: 'Eliminate guesswork with real empirical telemetry measuring your exact peak kilowatt demands.',
      },
      {
        metric: '₦0',
        title: 'Hardware Overspending',
        description: 'Avoid purchasing extra panels or battery capacity beyond your actual household/office needs.',
      },
      {
        metric: '72-Hour',
        title: 'Continuous Data Logging',
        description: 'We log power consumption across weekend and weekday operational cycles for full visibility.',
      },
      {
        metric: 'COREN',
        title: 'Certified Engineering Dossier',
        description: 'Receive an official engineering report suitable for bank financing and insurance validation.',
      },
    ],
    faqs: [
      {
        question: 'What is included in a Sunlit Energy Audit?',
        answer:
          'A Sunlit Energy Audit includes: 1) 48–72 hour data logging of main and sub-circuits, 2) Infrared thermographic scanning of electrical panels, 3) Harmonic distortion (THD) and power factor analysis, 4) Roof structural and shading assessment, and 5) An engineering report with single-line diagrams and system sizing recommendations.',
      },
      {
        question: 'How long does an on-site energy audit take?',
        answer:
          'Initial sensor setup takes 1–2 hours. The data logger remains connected for 48 to 72 hours to capture full weekday and weekend load cycles, after which the engineering analysis report is delivered within 48 hours.',
      },
      {
        question: 'Can the energy audit fee be deducted from a solar installation quote?',
        answer:
          'Yes. When you proceed with a solar installation through the Sunlit Marketplace or verified EPC network, the full cost of the energy audit is credited directly against your final installation invoice.',
      },
    ],
    relatedSlugs: ['residential-solar', 'commercial-solar', 'maintenance'],
  },

  'maintenance': {
    id: 'maintenance',
    slug: 'maintenance',
    title: 'Solar Maintenance & Health Audits',
    shortTitle: 'Maintenance & Health',
    tag: 'Best For: Existing Installations',
    categoryBadge: 'PROACTIVE ASSET PROTECTION',
    heroHeadline: 'Restore Peak Generation and Protect Your Solar Investment for Decades.',
    heroSummary:
      'Sunlit provides scheduled thermographic solar panel inspections, inverter firmware calibration, battery impedance testing, and rapid repair dispatch across Lagos, Abuja, and Ogun State. We diagnose why existing solar systems underperform, eliminate safety hazards, and restore maximum energy generation with certified technicians.',
    metaTitle: 'Solar Panel Maintenance & Health Audits Nigeria | Sunlit Energy',
    metaDescription:
      'Preventive solar maintenance, inverter repairs, and LiFePO4 battery testing across Nigeria. Restore peak solar yield and extend system lifespan.',
    keywords: [
      'solar maintenance nigeria',
      'solar panel cleaning lagos',
      'inverter repair abuja',
      'battery health audit ogun',
      'solar inspection lekki',
    ],
    systemSizing: 'Support for all 1kVA to 2MW+ Existing Solar Systems',
    batteryCycleLife: 'Battery State-of-Health (SoH) and Internal Resistance Testing',
    estMonthlyRoi: 'Restores 15% – 35% in Lost Solar Generation Output',
    paybackPeriod: 'Prevents Premature Multi-Million Naira Battery Failures',
    inverterTopology: 'All Inverter Brands (Victron, Deye, Growatt, Sunsynk, Felicity, etc.)',
    featured: false,
    audiences: [
      {
        title: 'Owners of Existing Underperforming Systems',
        badge: 'SYSTEM RESTORATION',
        description: 'Properties where solar output has dropped or batteries die after only 2–3 hours.',
        typicalLoad: 'Restoring full daily solar harvesting and extending battery runtime',
        keyBenefit: 'Identifies degraded cells, dirty panels, or misconfigured inverter charging curves.',
      },
      {
        title: 'Commercial Facility Managers',
        badge: 'FACILITY MANAGEMENT',
        description: 'Managers responsible for maintaining multi-million Naira commercial solar assets.',
        typicalLoad: 'Scheduled preventive maintenance, warranty compliance, and rapid breakdown dispatch',
        keyBenefit: 'Guaranteed 4-hour SLA response and quarterly thermographic drone panel audits.',
      },
      {
        title: 'Homeowners Wanting Scheduled Care',
        badge: 'ANNUAL PREVENTIVE CARE',
        description: 'Homeowners wanting peace of mind with regular de-ionized panel cleaning and electrical checks.',
        typicalLoad: 'Bi-annual panel cleaning, terminal torque checks, and SPD inspection',
        keyBenefit: 'Prevents dust buildup and hot-spot burnout, preserving 25-year panel warranties.',
      },
    ],
    problemsSolved: [
      {
        problem: 'Dust & Soot Accumulation (Harmattan Loss)',
        impact: 'Dust and generator soot deposition reduce solar panel energy production by up to 35% in Nigeria.',
        solution: 'Professional de-ionized water washing and hydrophobic coating restore 100% rated generation.',
      },
      {
        problem: 'Inverter Firmware Misconfiguration',
        impact: 'Incorrect cut-off voltage settings prematurely degrade lithium and gel battery cells.',
        solution: 'Technicians re-calibrate absorption, float, and equalization parameters to exact OEM specs.',
      },
      {
        problem: 'Dangerous Hotspots & Loose Connections',
        impact: 'Micro-cracks and loose DC terminals create high-resistance hotspots that pose serious fire hazards.',
        solution: 'Infrared thermography pinpoints loose connections and defective bypass diodes for immediate repair.',
      },
    ],
    pillars: [
      {
        component: 'FLIR Thermal Imaging Hotspot Audits',
        specification: 'High-sensitivity infrared inspection of panel cells, combiner boxes, and DC disconnects.',
        assurance: 'Detects micro-cracks and soldering defects invisible to the naked eye.',
      },
      {
        component: 'Battery Internal Resistance & SoH Testing',
        specification: 'Electronic cell impedance analysis measuring individual cell health and capacity retention.',
        assurance: 'Identifies isolated weak cells before they destroy the entire battery string.',
      },
      {
        component: 'De-ionized Chemical-Free Panel Washing',
        specification: 'Reverse-osmosis purified water with soft scratch-free rotary solar brushes.',
        assurance: 'Leaves zero mineral residue and maintains anti-reflective panel coating integrity.',
      },
      {
        component: 'Electrical Safety & Torque Certification',
        specification: 'Digital insulation testing (Megger) and calibrated torque-wrench terminal tightening.',
        assurance: 'Prevents electrical arcing, fire risks, and ground fault trips.',
      },
    ],
    benefits: [
      {
        metric: '+30%',
        title: 'Yield Recovery',
        description: 'Cleaning and calibration immediately restore lost solar generation back to factory ratings.',
      },
      {
        metric: '4-Hour',
        title: 'Rapid Emergency Dispatch',
        description: 'On-demand technical response across Lagos, Abuja, and Ogun for critical system faults.',
      },
      {
        metric: '100%',
        title: 'OEM Parameter Compliance',
        description: 'Inverter and battery settings re-tuned to exact manufacturer-approved specifications.',
      },
      {
        metric: '10 Yrs',
        title: 'Extended Battery Life',
        description: 'Proper cell balancing and temperature regulation prevent premature battery replacements.',
      },
    ],
    faqs: [
      {
        question: 'How often should solar panels be cleaned in Nigeria?',
        answer:
          'In major Nigerian cities like Lagos and Abuja, panels should be cleaned every 6 to 8 weeks during the dry season and Harmattan period due to heavy dust and soot accumulation. During the rainy season, quarterly inspections are usually sufficient.',
      },
      {
        question: 'Can Sunlit service a solar system installed by another company?',
        answer:
          'Yes. Sunlit certified engineers specialize in inspecting, diagnosing, troubleshooting, and repairing systems installed by any contractor or installer, ensuring all components operate safely and at peak efficiency.',
      },
      {
        question: 'What is included in the Sunlit Solar Health Audit report?',
        answer:
          'You receive an itemized health score report including: 1) Thermal infrared images of all solar panels, 2) Battery state-of-health (SoH) and individual cell voltage variance, 3) Inverter efficiency and error log history, 4) String open-circuit voltage (Voc) and short-circuit current (Isc) validation, and 5) Corrective action recommendations.',
      },
    ],
    relatedSlugs: ['battery-storage', 'residential-solar', 'energy-audits'],
  },

  'battery-storage': {
    id: 'battery-storage',
    slug: 'battery-storage',
    title: 'LiFePO4 Lithium Battery Storage',
    shortTitle: 'LiFePO4 Storage',
    tag: 'Best For: 24/7 Autonomy',
    categoryBadge: 'HIGH-DENSITY ENERGY STORAGE',
    heroHeadline: 'Tier-1 LiFePO4 Energy Storage Offering 6,000+ Cycles and 15-Year Life.',
    heroSummary:
      'Sunlit supplies and installs high-performance Lithium Iron Phosphate (LiFePO4) battery systems for residential homes, hospitals, and enterprise facilities in Nigeria. With 6,000+ cycle life, 80%+ Depth of Discharge (DoD), built-in intelligent Battery Management Systems (BMS), and thermal runaway immunity, we guarantee 24/7 power independence.',
    metaTitle: 'LiFePO4 Lithium Solar Battery Storage Nigeria | Sunlit Energy',
    metaDescription:
      'Tier-1 LiFePO4 solar batteries in Nigeria with 6,000+ cycle life, smart BMS, and 10-year warranty. Replace dead tubular batteries with long-lasting lithium.',
    keywords: [
      'lifepo4 battery nigeria',
      'lithium solar battery lagos',
      '51.2v 100ah lithium abuja',
      '15kwh battery storage ogun',
      'replace tubular battery with lithium',
    ],
    systemSizing: '5kWh – 500kWh Modular Storage Systems',
    batteryCycleLife: '6,000+ Cycles @ 80% DoD (15-Year Operational Life)',
    estMonthlyRoi: 'Eliminates 2-Year Battery Replacement Cycles',
    paybackPeriod: 'Lowest Cost per Stored kWh (LCOS) in Nigeria',
    inverterTopology: 'CAN/RS485 Smart BMS Communication with Leading Inverters',
    highlight: true,
    featured: false,
    audiences: [
      {
        title: 'Homes Replacing Dead Tubular Batteries',
        badge: 'UPGRADE FROM LEAD-ACID',
        description: 'Homeowners tired of replacing failed tubular/gel batteries every 18–24 months.',
        typicalLoad: '5kWh to 20kWh residential daily autonomy',
        keyBenefit: 'Zero acid fumes, 3x faster charging, and 5x longer operational lifespan.',
      },
      {
        title: '24/7 Mission-Critical Facilities',
        badge: 'CRITICAL INFRASTRUCTURE',
        description: 'Hospitals, data centers, and telecom sites where power loss cannot be tolerated.',
        typicalLoad: 'High-rate continuous discharge with automated cell balancing',
        keyBenefit: 'Smart BMS with real-time temperature, voltage, and state-of-charge telemetry.',
      },
      {
        title: 'Commercial Peak Shaving Systems',
        badge: 'COMMERCIAL OPEX',
        description: 'Businesses charging batteries from solar by day to eliminate expensive peak Band A night rates.',
        typicalLoad: '30kWh to 200kWh+ commercial energy shifting',
        keyBenefit: 'Dramatic reduction in peak grid tariff billing and diesel running hours.',
      },
    ],
    problemsSolved: [
      {
        problem: 'Frequent Tubular & Gel Battery Burnout',
        impact: 'Traditional lead-acid batteries fail rapidly under high ambient Nigerian temperatures and deep discharges.',
        solution: 'LiFePO4 chemistry easily handles 45°C ambient temperatures without thermal runaway or memory degradation.',
      },
      {
        problem: 'Slow Recharging During Short Grid Windows',
        impact: 'Lead-acid batteries require 8–10 hours to recharge, failing when grid supply only lasts 3–4 hours.',
        solution: 'LiFePO4 batteries accept fast 0.5C–1C charge rates, reaching 100% capacity in under 2 hours.',
      },
      {
        problem: 'Battery Incompatibility & Communication Drops',
        impact: 'Inverters without direct BMS communication overcharge cells, triggering sudden protective shutoffs.',
        solution: 'Direct CANbus/RS485 closed-loop communication synchronizes inverter and battery protocols perfectly.',
      },
    ],
    pillars: [
      {
        component: 'Grade-A LiFePO4 Prismatic Cells',
        specification: 'Automotive-grade prismatic lithium iron phosphate cells with laser-welded busbars.',
        assurance: '6,000 cycles at 80% Depth of Discharge with 80% remaining capacity.',
      },
      {
        component: 'Intelligent Multi-Protection BMS',
        specification: 'Dual-processor BMS guarding against over-voltage, under-voltage, over-current, and short circuit.',
        assurance: 'Independent cell temperature sensors with auto-disconnect safety.',
      },
      {
        component: 'Closed-Loop Inverter Communication',
        specification: 'Native CAN/RS485 protocol support for Deye, Victron, Sunsynk, Growatt, and Luxpower.',
        assurance: 'Real-time SoC and charge current optimization prevents over-discharge.',
      },
      {
        component: 'Modular Scalable Enclosures',
        specification: 'Wall-mount and 19-inch server rack configurations supporting up to 15 units in parallel.',
        assurance: 'Expand storage capacity effortlessly as household or business energy demands grow.',
      },
    ],
    benefits: [
      {
        metric: '6,000+',
        title: 'Verified Cycles',
        description: 'Lasts 10 to 15 years with daily full discharge and charge cycles under Nigerian conditions.',
      },
      {
        metric: '2 Hours',
        title: 'Ultra-Fast Recharging',
        description: 'Charges to full capacity in a fraction of the time required by obsolete tubular gel batteries.',
      },
      {
        metric: '95%+',
        title: 'Usable Capacity',
        description: 'Discharge up to 90%–95% of stored energy without damaging battery internal chemistry.',
      },
      {
        metric: '10 Yrs',
        title: 'Comprehensive Warranty',
        description: 'Backed by direct replacement warranties and local engineering RMA service centers.',
      },
    ],
    faqs: [
      {
        question: 'Can I replace my existing tubular gel batteries with LiFePO4 lithium without changing my inverter?',
        answer:
          'In most cases, yes. As long as your existing inverter allows custom battery voltage settings (bulk, absorption, and float voltage adjustment), it can safely charge and discharge a LiFePO4 lithium battery. However, inverters with direct CAN/RS485 BMS communication provide the highest efficiency and safety.',
      },
      {
        question: 'Why is LiFePO4 chemistry safer than other lithium-ion types (like NMC)?',
        answer:
          'Lithium Iron Phosphate (LiFePO4) has an exceptionally stable chemical structure and will not experience thermal runaway or catch fire even if punctured, overcharged, or exposed to high tropical temperatures up to 60°C.',
      },
      {
        question: 'How do I determine how many kWh of battery storage I need?',
        answer:
          'Multiply the wattage of appliances you wish to run by the number of hours of backup required, then add a 20% safety margin. For example, running 1,000W of appliances for 8 hours requires 8,000Wh (8kWh) of LiFePO4 storage. You can also use our Solar Sizing Calculator at /tools/battery-capacity.',
      },
    ],
    relatedSlugs: ['residential-solar', 'commercial-solar', 'maintenance'],
  },

  'ev-charging': {
    id: 'ev-charging',
    slug: 'ev-charging',
    title: 'EV Charging Infrastructure',
    shortTitle: 'EV Charging',
    tag: 'Best For: Commercial & Fleets',
    categoryBadge: 'CLEAN MOBILITY INFRASTRUCTURE',
    heroHeadline: 'Solar-Powered EV Charging for Commercial Fleets, Estates, and Shopping Plazas.',
    heroSummary:
      'Sunlit designs, provisions, and installs Level-2 AC and DC Fast-Charging electric vehicle stations integrated with solar canopies and LiFePO4 battery buffering across Nigeria. We empower property developers, logistics operators, and commercial plazas to monetize EV charging with zero grid dependency.',
    metaTitle: 'Solar EV Charging Station Installation Nigeria | Sunlit Energy',
    metaDescription:
      'Solar-powered Level 2 and DC fast EV charging infrastructure for estates and fleets in Nigeria. Integrated with solar canopies and smart billing.',
    keywords: [
      'ev charging nigeria',
      'electric vehicle charger lagos',
      'solar ev charging station abuja',
      'commercial dc fast charger nigeria',
      'ev canopy solar',
    ],
    systemSizing: '7kW AC to 180kW DC Ultra-Fast Charging Stations',
    batteryCycleLife: 'Battery Buffered to Eliminate Grid Transformer Overload',
    estMonthlyRoi: 'Monetized EV Charging Subscriptions and Pay-Per-kWh Revenue',
    paybackPeriod: '3.2 – 4.5 Years',
    inverterTopology: 'Solar Canopy PV with Bidirectional EV Inverters',
    featured: false,
    audiences: [
      {
        title: 'Residential Gated Estates & Plazas',
        badge: 'ESTATES & PLAZAS',
        description: 'Modern estates installing shared charging amenities for residents and visitors.',
        typicalLoad: '7kW to 22kW Level-2 AC Smart Chargers with RFID/App access',
        keyBenefit: 'Attracts premium tenants and generates recurring charging fee revenue.',
      },
      {
        title: 'Commercial Fleet & Delivery Logistics',
        badge: 'FLEET OPERATORS',
        description: 'Courier, delivery, and ride-hailing fleets transitioning from petrol to electric vans and bikes.',
        typicalLoad: '50kW to 120kW DC Fast Chargers with battery buffer',
        keyBenefit: 'Cuts per-kilometer vehicle fueling costs by over 70% using solar power.',
      },
      {
        title: 'Shopping Centers, Hotels & Fuel Stations',
        badge: 'DESTINATION CHARGING',
        description: 'Retail destinations offering high-speed EV charging to increase customer dwell time.',
        typicalLoad: 'Dual-gun DC Fast Charging Stations integrated with solar carports',
        keyBenefit: 'Increases retail footfall and creates an additional revenue stream.',
      },
    ],
    problemsSolved: [
      {
        problem: 'Grid Transformer Capacity Limitations',
        impact: 'High-power DC fast chargers trigger local DisCo transformer trips and demand charge penalties.',
        solution: 'Sunlit Battery-Buffered EV stations charge batteries from solar, discharging at high speed to EVs without straining the grid.',
      },
      {
        problem: 'Unreliable Grid Blackouts Stalling Fleets',
        impact: 'If the grid goes down, EV fleets cannot charge and delivery operations halt.',
        solution: 'Dedicated solar canopy microgrids ensure continuous charging regardless of national grid status.',
      },
      {
        problem: 'Billing and Energy Theft Challenges',
        impact: 'Unmanaged chargers lead to unpaid electricity usage and disputes.',
        solution: 'Integrated OCPP 1.6/2.0 smart software enables automated pay-per-kWh billing via Paystack or USSD.',
      },
    ],
    pillars: [
      {
        component: 'Smart Level-2 & DC Fast Charging Units',
        specification: 'OCPP 1.6/2.0.1 compliant with Type 2 and CCS2 charging connectors.',
        assurance: 'IP55 outdoor rated with IK10 impact resistance and dynamic load balancing.',
      },
      {
        component: 'Solar Carport / Canopy Structures',
        specification: 'Engineered structural steel / aluminum carports with integrated bifacial solar PV roofs.',
        assurance: 'Provides vehicle shade while generating clean power directly above parking bays.',
      },
      {
        component: 'Battery Buffer Substation (BESS)',
        specification: 'Industrial LiFePO4 battery buffering that absorbs grid spikes and delivers high charging currents.',
        assurance: 'Enables ultra-fast charging even on locations with limited grid transformer capacity.',
      },
      {
        component: 'Automated Billing & Revenue Management',
        specification: 'Cloud software platform supporting mobile app charging, RFID cards, and instant payment settlement.',
        assurance: 'Real-time revenue analytics and automated monthly payout disbursements.',
      },
    ],
    benefits: [
      {
        metric: '70%+',
        title: 'Fleet Fuel Cost Savings',
        description: 'Switching commercial delivery vans from fuel to solar-charged electricity slashes fleet OPEX.',
      },
      {
        metric: 'OCPP',
        title: 'Open Standard Compatible',
        description: 'Compatible with all modern electric vehicles including BYD, Tesla, Hyundai, and electric 2/3-wheelers.',
      },
      {
        metric: '100%',
        title: 'Solar Self-Sustaining',
        description: 'Solar canopy arrays generate clean power directly where the vehicles are parked.',
      },
      {
        metric: '₦/kWh',
        title: 'Automated Revenue Stream',
        description: 'Set your own retail tariff per kilowatt-hour and receive automated customer payments.',
      },
    ],
    faqs: [
      {
        question: 'How fast can a Sunlit EV charging station charge an electric car?',
        answer:
          'A Level-2 22kW AC charger provides approximately 80–100 km of driving range per hour of charging (ideal for homes, hotels, and office parking). A 60kW DC Fast Charger charges an average 50kWh EV battery from 20% to 80% in approximately 35–45 minutes.',
      },
      {
        question: 'Can EV charging stations operate when the national grid is completely down?',
        answer:
          'Yes. Sunlit EV stations can be engineered as off-grid or hybrid microgrids, combining rooftop/canopy solar with LiFePO4 battery storage to provide continuous EV charging independently of the DisCo grid.',
      },
      {
        question: 'How do customers pay for charging at commercial charging locations?',
        answer:
          'Customers simply scan the QR code on the charger or tap an RFID card. The Sunlit payment gateway handles instant billing via debit cards, bank transfers, or mobile wallets and automatically credits the property owner’s account.',
      },
    ],
    relatedSlugs: ['commercial-solar', 'battery-storage', 'industrial-solar'],
  },

  'solar-financing': {
    id: 'solar-financing',
    slug: 'solar-financing',
    title: 'Solar Financing & Lease-to-Own',
    shortTitle: 'Solar Financing',
    tag: 'Best For: Capital Efficiency',
    categoryBadge: 'FLEXIBLE ASSET FINANCING',
    heroHeadline: 'Convert Crushing Diesel OPEX into Clean Solar Asset Ownership with ₦0 Upfront CapEx.',
    heroSummary:
      'Sunlit partners with leading Nigerian commercial banks, impact funds, and green financing institutions to offer structured solar lease-to-own plans and Power Purchase Agreements (PPA). Businesses and qualified homeowners can deploy complete solar systems with zero upfront capital expenditure, paying predictable monthly installments.',
    metaTitle: 'Solar Financing & Lease-to-Own Nigeria | Sunlit Energy',
    metaDescription:
      'Solar financing, lease-to-own, and PPA models for Nigerian businesses and homeowners. Replace diesel OPEX with flexible 24–60 month installment plans.',
    keywords: [
      'solar financing nigeria',
      'solar lease to own lagos',
      'solar installment payment abuja',
      'commercial solar ppa nigeria',
      'clean energy finance ogun',
    ],
    systemSizing: 'Available for Residential (5kVA+) & Commercial (15kVA to 1MW+)',
    batteryCycleLife: 'Full Warranty and Maintenance Included Throughout Lease Term',
    estMonthlyRoi: 'Monthly Installments are Lower than Current Monthly Diesel Costs',
    paybackPeriod: 'Full Equipment Ownership Transferred at Term Conclusion',
    inverterTopology: 'Smart Telemetry-Guaranteed Inverter & Battery Systems',
    featured: false,
    audiences: [
      {
        title: 'Commercial Enterprises & SMEs',
        badge: 'CORPORATE LEASE',
        description: 'Businesses wanting to protect working capital rather than spending millions upfront on CapEx.',
        typicalLoad: '15kVA to 200kVA commercial solar systems',
        keyBenefit: 'Preserves liquidity; monthly lease payments are tax-deductible operating expenses.',
      },
      {
        title: 'Salary Earners & Homeowners',
        badge: 'RESIDENTIAL INSTALLMENTS',
        description: 'Verified professionals seeking structured 12 to 36-month installment plans.',
        typicalLoad: '5kVA to 15kVA complete residential rooftop solar packages',
        keyBenefit: 'Immediate clean power with zero upfront payment stress and fixed monthly deductions.',
      },
      {
        title: 'Industrial Facilities (PPA Model)',
        badge: 'POWER PURCHASE AGREEMENTS',
        description: 'Large manufacturing plants seeking energy-as-a-service with guaranteed per-kWh pricing.',
        typicalLoad: '200kVA to 1MW+ industrial microgrids',
        keyBenefit: 'Zero capital outlay; pay only for the verified kilowatt-hours generated on-site.',
      },
    ],
    problemsSolved: [
      {
        problem: 'High Upfront Solar Capital Barrier (CapEx)',
        impact: 'Quality Tier-1 solar systems require significant initial capital, delaying clean energy transition.',
        solution: 'Sunlit structured financing spreads the investment across 24 to 60 manageable monthly installments.',
      },
      {
        problem: 'Inflation & Diesel Price Volatility',
        impact: 'Fuel price volatility makes it impossible for businesses to forecast long-term operational costs.',
        solution: 'Fixed monthly solar lease payments provide budget certainty and insulate from fuel inflation.',
      },
      {
        problem: 'Performance & Breakdown Risk on Leased Assets',
        impact: 'Borrowers fear paying installments for equipment that breaks down.',
        solution: 'All financed systems include Sunlit comprehensive maintenance, insurance, and IoT performance guarantees.',
      },
    ],
    pillars: [
      {
        component: 'Direct Bank & Credit Partner Integration',
        specification: 'Pre-integrated with leading Nigerian financial institutions offering competitive green interest rates.',
        assurance: 'Streamlined credit approval process within 48 to 72 hours.',
      },
      {
        component: 'Flexible Lease-to-Own Contracts',
        specification: '12 to 60-month tenors with transparent buyout schedules and zero hidden balloon fees.',
        assurance: 'Full 100% legal asset ownership title transferred upon final milestone payment.',
      },
      {
        component: 'All-Inclusive O&M + Insurance Package',
        specification: 'Comprehensive asset insurance against theft, fire, and storm damage plus quarterly maintenance.',
        assurance: 'Guaranteed system uptime throughout the entire financing tenor.',
      },
      {
        component: 'Automated Direct Debit & Escrow Settlement',
        specification: 'Seamless NIBSS Direct Debit / card mandate integration linked to milestone verification.',
        assurance: 'Transparent transaction statements accessible 24/7 via Sunlit Suite.',
      },
    ],
    benefits: [
      {
        metric: '₦0',
        title: 'Initial CapEx Barrier',
        description: 'Deploy complete enterprise or residential solar systems without depleting your cash reserves.',
      },
      {
        metric: '24–60',
        title: 'Flexible Monthly Tenors',
        description: 'Choose repayment schedules customized to match your monthly corporate or household cash flows.',
      },
      {
        metric: '100%',
        title: 'Maintenance Included',
        description: 'System health monitoring, routine servicing, and component warranties are fully covered.',
      },
      {
        metric: 'Asset',
        title: 'Full Ownership Transfer',
        description: 'At the end of the financing period, you own a valuable clean energy asset providing free power for 20+ years.',
      },
    ],
    faqs: [
      {
        question: 'Who qualifies for Sunlit Solar Financing?',
        answer:
          'Financing is available to: 1) Registered Nigerian businesses with at least 12 months of audited bank statements, and 2) Confirmed salary earners and self-employed professionals with verifiable monthly cash flow.',
      },
      {
        question: 'What documentation is required to apply for solar lease-to-own?',
        answer:
          'For businesses: CAC certificate, 6–12 months bank statements, and utility bill. For individuals: Valid national ID (NIN/Voters/Passport), 6 months bank statement, proof of employment/income, and proof of address.',
      },
      {
        question: 'What happens if a component malfunctions during the financing term?',
        answer:
          'All financed systems are covered by Sunlit Comprehensive Warranty and O&M Support. Any defective panel, inverter, or battery cell is repaired or replaced at zero additional cost to you.',
      },
    ],
    relatedSlugs: ['commercial-solar', 'residential-solar', 'industrial-solar'],
  },

  'monitoring': {
    id: 'monitoring',
    slug: 'monitoring',
    title: 'Live Telemetry & Yield Monitoring',
    shortTitle: 'Live Telemetry',
    tag: 'Best For: Operational Visibility',
    categoryBadge: 'IOT & SMART TELEMETRY',
    heroHeadline: 'Real-Time IoT Telemetry Tracking Every Watt, Volt, and Saved Naira.',
    heroSummary:
      'Sunlit delivers unified IoT hardware telemetry and cloud energy intelligence for solar installations across Nigeria. Track live panel generation, battery State of Charge (SoC), DisCo grid uptime, generator fuel displacement, and receive instant automated failure alerts via Sunlit Suite dashboard and mobile app.',
    metaTitle: 'Solar IoT Telemetry & Live Monitoring Nigeria | Sunlit Energy',
    metaDescription:
      'Real-time solar yield telemetry, battery SoC tracking, and automated failure detection across Nigeria. Monitor energy performance 24/7 on web and mobile.',
    keywords: [
      'solar monitoring system nigeria',
      'solar iot telemetry lagos',
      'battery soc monitoring abuja',
      'inverter remote monitoring ogun',
      'solar power analytics nigeria',
    ],
    systemSizing: 'Universal Compatibility with All Major Inverter & Battery Brands',
    batteryCycleLife: 'Monitors Individual Cell Voltages and Temperature Drift',
    estMonthlyRoi: 'Prevents Up to 25% Energy Waste and Catastrophic Failures',
    paybackPeriod: 'Immediate Diagnostic Intelligence',
    inverterTopology: 'GSM 4G / Wi-Fi / Ethernet Hardware Gateway',
    featured: false,
    audiences: [
      {
        title: 'Commercial Facility Directors',
        badge: 'FACILITY PORTFOLIOS',
        description: 'Directors managing solar power across multiple branches, bank branches, or retail outlets.',
        typicalLoad: 'Centralized multi-site portfolio dashboard with aggregate yield reporting',
        keyBenefit: 'Compare performance across branches and detect equipment anomalies instantly.',
      },
      {
        title: 'Residential Tech-Forward Homeowners',
        badge: 'SMART HOMEOWNERS',
        description: 'Homeowners wanting real-time visibility into battery reserves and daily solar generation.',
        typicalLoad: 'Live mobile app tracking household consumption vs solar production',
        keyBenefit: 'Receive instant push notifications when grid fails or battery reaches low threshold.',
      },
      {
        title: 'Solar EPCs & Maintenance Teams',
        badge: 'EPC OPERATIONS',
        description: 'Contractors providing remote SLA management and predictive maintenance for client installations.',
        typicalLoad: 'Remote firmware updates, historical error log export, and yield degradation tracking',
        keyBenefit: 'Eliminates unnecessary physical truck rolls by diagnosing faults remotely in minutes.',
      },
    ],
    problemsSolved: [
      {
        problem: 'Silent Inverter Faults & Unnoticed Power Loss',
        impact: 'Tripped solar string breakers go unnoticed for weeks, forcing reliance on expensive grid/generator power.',
        solution: 'Automated AI anomaly detection alerts facility managers via SMS and email within 60 seconds of any drop.',
      },
      {
        problem: 'Lack of Real Energy Cost Accounting',
        impact: 'Companies cannot verify whether their solar system is truly delivering promised diesel cost savings.',
        solution: 'Automated monthly executive reports quantify exact kilowatt-hours produced and Naira saved.',
      },
      {
        problem: 'Unbalanced Battery Cell Degradation',
        impact: 'A single weak battery cell ruins an entire bank if left unmonitored.',
        solution: 'Cell-level voltage telemetry tracks internal resistance drift and flags weak cells before failure.',
      },
    ],
    pillars: [
      {
        component: 'Industrial Multi-Protocol IoT Gateway',
        specification: 'Dual SIM 4G LTE + Wi-Fi gateway communicating via RS485 Modbus and CANbus.',
        assurance: 'Built-in battery backup ensures telemetry transmission even during total blackout events.',
      },
      {
        component: 'Cloud Energy Intelligence Platform',
        specification: 'High-frequency time-series database processing 1-second telemetry streams.',
        assurance: '99.95% cloud API uptime with bank-grade AES-256 data encryption.',
      },
      {
        component: 'Sunlit Suite Web & Mobile Applications',
        specification: 'Native iOS, Android, and web dashboard with interactive generation graphs and load analysis.',
        assurance: 'Real-time telemetry streaming with sub-second latency.',
      },
      {
        component: 'AI Predictive Diagnostic Engine',
        specification: 'Machine learning algorithms benchmarking actual output against expected solar irradiance.',
        assurance: 'Automatically detects panel soiling, shading, and inverter clipping.',
      },
    ],
    benefits: [
      {
        metric: '60 Sec',
        title: 'Instant Fault Alerts',
        description: 'Immediate SMS and push notifications the moment an inverter error code or breaker trip occurs.',
      },
      {
        metric: '1-Sec',
        title: 'Real-Time Precision',
        description: 'Live wattage, voltage, and battery charge status updated continuously on your screen.',
      },
      {
        metric: '100%',
        title: 'Financial Transparency',
        description: 'Download audited monthly reports proving exact diesel fuel liters and Naira savings.',
      },
      {
        metric: 'Multi-Site',
        title: 'Centralized Fleet Control',
        description: 'Manage 1 or 1,000 solar installations from a single unified enterprise command dashboard.',
      },
    ],
    faqs: [
      {
        question: 'How does the Sunlit monitoring gateway connect to the internet in remote areas?',
        answer:
          'The Sunlit IoT Gateway features built-in dual-SIM 4G LTE cellular connectivity with automated network roaming across MTN, Airtel, and Glo, ensuring reliable data transmission even in remote or rural Nigerian locations without fixed broadband.',
      },
      {
        question: 'Can Sunlit monitoring be integrated into an existing solar installation?',
        answer:
          'Yes. The Sunlit IoT Gateway connects via standard RS485 Modbus, CANbus, or external CT clamps to virtually any modern inverter, battery bank, or smart energy meter currently installed.',
      },
      {
        question: 'Is my energy consumption data secure and private?',
        answer:
          'Yes. All telemetry is encrypted in transit and at rest using enterprise-grade AES-256 encryption. Your operational data is strictly private and compliant with the Nigeria Data Protection Act (NDPA) and global standards.',
      },
    ],
    relatedSlugs: ['maintenance', 'commercial-solar', 'residential-solar'],
  },
};

export const ALL_SERVICE_SLUGS = Object.keys(SERVICE_CATALOG);

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return SERVICE_CATALOG[slug];
}
