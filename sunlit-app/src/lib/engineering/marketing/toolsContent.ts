/**
 * Authoritative Content, SEO Metadata & Engineering Specifications for Public Tools
 * Conforming strictly to BRAND_OS.md, CONTENT_ENGINE_OS.md, and SERVICE_PAGE_OS.md
 */

export interface ToolPageContent {
  id: string;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  heroHeadline: string;
  heroDescription: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  mathematicalModel: string;
  governingStandards: string[];
  keyEquations: string[];
  methodologyDescription: string;
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  trustPoints: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  seo: {
    title: string;
    description: string;
    keywords: string;
    canonical: string;
  };
}

export const TOOLS_CONTENT: Record<string, ToolPageContent> = {
  'solar-system-sizing': {
    id: 'solar-system-sizing',
    slug: 'solar-system-sizing',
    name: 'Solar System Sizing Calculator',
    category: 'System Design & Autonomy',
    tagline: 'Multi-Variable Solar Sizing Engine',
    heroHeadline: 'Engineered Solar System Sizing for Nigerian Homes & Businesses',
    heroDescription:
      'Determine the optimal solar panel wattage (kWp), battery storage capacity (kWh), and inverter rating (kVA) based on verified load profiles, regional Nigerian peak sun hours, and generator displacement economics.',
    primaryCtaText: 'Use Solar System Sizing',
    secondaryCtaText: 'Explore Engineering Tools',
    mathematicalModel: 'Sunlit Enterprise Master System Sizing Orchestration Engine',
    governingStandards: ['IEC 60364-7-712', 'IEEE 1562', 'NEC Article 690', 'NERC Mini-Grid Code'],
    keyEquations: [
      'P_array_req (kWp) = (E_daily_kWh / (1 - LossFactor)) × DesignMargin / PSH',
      'E_battery_req (kWh) = (E_daily_kWh × Autonomy_days) / (DoD × η_inverter × η_battery)',
      'S_inverter_req (kVA) = Max(P_continuous × 1.25, P_surge) / (1000 × PowerFactor)',
    ],
    methodologyDescription:
      'Our master sizing model cross-validates daily energy demand, nighttime autonomy requirements, and motor startup surges to prevent undersizing common in simple rule-of-thumb estimates.',
    features: [
      {
        title: 'Solar Irradiation Mapping',
        description: 'Calculates solar kWp requirements matching regional peak sun hours across Lagos, Abuja, Kano, and Port Harcourt.',
        icon: 'Sun',
      },
      {
        title: 'Battery Autonomy Sizing',
        description: 'Determines LiFePO4 storage capacity for 0.5, 1.0, 1.5, or 2.0 days of continuous grid blackout protection.',
        icon: 'Battery',
      },
      {
        title: 'Hybrid Inverter Rating',
        description: 'Engineers apparent kVA inverter capacity to handle continuous connected power and inductive appliance motor surges.',
        icon: 'Cpu',
      },
    ],
    trustPoints: [
      'Eliminates guesswork in generator displacement and battery bank sizing.',
      'Calibrated for Nigerian DISCO grid availability and Band A electricity tariffs.',
      'Directly generates an equipment Bill of Materials (BOM) for verified EPC installers.',
    ],
    faqs: [
      {
        question: 'How does the Solar System Sizing Calculator work?',
        answer:
          'The calculator takes your daily energy consumption (or monthly DISCO electricity bill / appliance list) and calculates the exact solar panel capacity (kWp), battery storage (kWh), and inverter rating (kVA) needed for reliable 24/7 power in Nigeria.',
      },
      {
        question: 'What information do I need before sizing my solar system?',
        answer:
          'You need either your monthly electricity bill in Naira, your estimated daily kWh usage, or a list of major appliances (air conditioners, pumping machines, refrigerators) along with their daily operating hours.',
      },
      {
        question: 'Why does the calculator recommend specific battery autonomy days?',
        answer:
          'Autonomy days represent how long your property can run on battery power without grid electricity or solar generation (e.g. during overcast weather). In Nigeria, 1.0 to 1.5 days is standard for residential reliability.',
      },
    ],
    seo: {
      title: 'Solar System Sizing Calculator Nigeria — System Design | Sunlit Energy',
      description:
        'Free, deterministic solar system sizing calculator for Nigeria. Accurately calculate solar panels, battery storage, and inverter ratings for homes and businesses.',
      keywords: 'solar system sizing calculator nigeria, solar calculator lagos, solar power sizing abuja, solar battery sizing nigeria',
      canonical: 'https://sunlit.energy/tools/solar-system-sizing',
    },
  },

  'load-calculator': {
    id: 'load-calculator',
    slug: 'load-calculator',
    name: 'Appliance Load Calculator',
    category: 'Load Sizing & Energy Consumption',
    tagline: 'Appliance Inventory & Surge Modeling',
    heroHeadline: 'Accurately Calculate Your Property’s Daily Energy Demand',
    heroDescription:
      'The foundation of every reliable solar design is a precise load profile. Account for connected appliances, operating duty cycles, and inductive motor startup surges for Nigerian residential and commercial facilities.',
    primaryCtaText: 'Calculate Appliance Load',
    secondaryCtaText: 'Launch Load Wizard',
    mathematicalModel: 'Deterministic Multi-Appliance Load Aggregation Model',
    governingStandards: ['IEEE 141 Red Book', 'IEC 60364-8-1', 'NSPM Electrical Standards'],
    keyEquations: [
      'P_total_connected (W) = Σ (P_rated_W × Quantity)',
      'E_daily_total (Wh) = Σ (P_rated_W × Quantity × Hours/day × DutyCycle × DaysMultiplier)',
      'S_peak_surge (kVA) = Max(P_connected × SurgeFactor, Σ Surge_watts) / (1000 × PowerFactor)',
    ],
    methodologyDescription:
      'Our catalog uses verified field power profiles for common Nigerian appliances, factoring in compressor duty cycles and startup surges for air conditioners and water pumps.',
    features: [
      {
        title: 'Active Power Aggregation',
        description: 'Aggregates baseline running wattage across cooling, HVAC, lighting, computing, and utility equipment.',
        icon: 'Zap',
      },
      {
        title: 'Motor Surge Modeling',
        description: 'Applies inductive startup surge multipliers (up to 4.0×) to ensure adequate inverter surge headroom.',
        icon: 'Gauge',
      },
      {
        title: 'System Sizer Integration',
        description: 'Directly exports calculated daily kWh energy demand into the Sunlit Solar System Sizer.',
        icon: 'ArrowRight',
      },
    ],
    trustPoints: [
      'Prevents undersizing of battery storage and inverter capacity.',
      'Includes typical ratings for Nigerian 1.0HP, 1.5HP, and 2.0HP inverter and non-inverter ACs.',
      'Calculates both continuous load (kW) and peak inductive surge demand (kVA).',
    ],
    faqs: [
      {
        question: 'Why is an appliance load calculation necessary before buying solar?',
        answer:
          'Solar systems sized purely on estimated roof size or guesswork often fail during peak appliance usage. An itemized load calculation ensures your inverter and batteries can handle simultaneous loads and compressor startup surges.',
      },
      {
        question: 'How do air conditioners and pumping machines affect solar sizing?',
        answer:
          'Inductive loads like AC compressors and water pumps draw 2× to 4× their rated power for a few seconds during startup. Our calculator factors in surge multipliers to prevent inverter overload trips.',
      },
    ],
    seo: {
      title: 'Solar Appliance Load Calculator Nigeria — Energy Consumption | Sunlit Energy',
      description:
        'Calculate electrical appliance load, peak surge demand, and daily kWh energy consumption for solar sizing in Nigeria.',
      keywords: 'appliance load calculator nigeria, solar energy load calculation, daily kwh calculator lagos, solar power requirement',
      canonical: 'https://sunlit.energy/tools/load-calculator',
    },
  },

  'battery-capacity': {
    id: 'battery-capacity',
    slug: 'battery-capacity',
    name: 'Battery Capacity Calculator',
    category: 'Energy Storage & Autonomy',
    tagline: 'Electrochemical Storage Sizing',
    heroHeadline: 'Engineer Reliable Battery Storage for Grid Blackout Protection',
    heroDescription:
      'Size lithium iron phosphate (LiFePO4) or tubular gel battery banks for continuous energy autonomy during grid outages, accounting for Depth of Discharge (DoD), round-trip efficiency, and peak discharge currents.',
    primaryCtaText: 'Calculate Battery Capacity',
    secondaryCtaText: 'Size Battery Storage',
    mathematicalModel: 'Deterministic Electrochemical Usable Energy Sizing Model',
    governingStandards: ['IEEE 1013', 'IEC 62619', 'IEC 61427'],
    keyEquations: [
      'E_usable_req (kWh) = (E_daily_kWh × Autonomy_days) / η_inverter',
      'E_installed_req (kWh) = E_usable_req / (DoD × η_battery)',
      'C_amp_hours (Ah) = (E_installed_req × 1000) / V_system_dc',
    ],
    methodologyDescription:
      'Calculates usable versus installed nameplate capacity based on battery chemistry limits (80% DoD for LiFePO4, 50% for Gel Lead-Acid) and inverter conversion losses.',
    features: [
      {
        title: 'Chemistry DoD Constraints',
        description: 'Enforces safe Depth of Discharge limits to maximize battery cycle life (6,000+ cycles for LiFePO4).',
        icon: 'Battery',
      },
      {
        title: 'Peak Discharge Current Verification',
        description: 'Verifies continuous discharge amperage against Battery Management System (BMS) current limits.',
        icon: 'Zap',
      },
      {
        title: 'Standard DC Bus Architecture',
        description: 'Sizes battery banks configured for 24V DC and 48V DC telecom and residential bus bars.',
        icon: 'Cpu',
      },
    ],
    trustPoints: [
      'Prevents premature battery degradation from over-discharging.',
      'Pre-configured with Tier-1 lithium rack and wall-mount module capacities.',
      'Outputs exact battery module count and parallel string requirements.',
    ],
    faqs: [
      {
        question: 'What is the difference between usable capacity and installed capacity?',
        answer:
          'Installed capacity is the total nameplate rating of the battery. Usable capacity is the portion you can safely discharge without damaging the cells. LiFePO4 batteries allow 80–90% usable capacity, whereas lead-acid only allows 50%.',
      },
      {
        question: 'How many days of battery autonomy do I need in Nigeria?',
        answer:
          'For residential properties in Nigeria with frequent grid blackouts, 1.0 day (24 hours of blackout coverage) is the recommended standard. Critical installations may opt for 1.5 to 2.0 days.',
      },
    ],
    seo: {
      title: 'Solar Battery Capacity Calculator Nigeria — Storage Sizing | Sunlit Energy',
      description:
        'Calculate lithium LiFePO4 and tubular gel solar battery capacity, amp-hours (Ah), and backup autonomy hours for Nigerian homes and businesses.',
      keywords: 'solar battery calculator nigeria, lifepo4 battery sizing, solar storage calculator lagos, inverter battery capacity',
      canonical: 'https://sunlit.energy/tools/battery-capacity',
    },
  },

  'inverter-sizing': {
    id: 'inverter-sizing',
    slug: 'inverter-sizing',
    name: 'Inverter Sizing Calculator',
    category: 'Power Inverter & Conversion Sizing',
    tagline: 'Continuous Load & Motor Surge Matching',
    heroHeadline: 'Select an Inverter That Handles Your Real-World Power Peaks',
    heroDescription:
      'Move beyond daily energy averages. Size your solar inverter based on continuous connected wattage, power factor derating, and motor startup surge capacity to prevent inverter tripping.',
    primaryCtaText: 'Size Your Inverter',
    secondaryCtaText: 'Launch Inverter Sizer',
    mathematicalModel: 'Deterministic Apparent Power & Inductive Surge Matching Engine',
    governingStandards: ['IEC 62109-1', 'IEEE 1547', 'UL 1741'],
    keyEquations: [
      'S_continuous (kVA) = P_active_kW / PowerFactor',
      'S_surge (kVA) = P_surge_kW / PowerFactor',
      'S_min_rating (kVA) = S_continuous × (1 + GrowthMargin / 100)',
    ],
    methodologyDescription:
      'Sizes pure sine wave hybrid and off-grid inverters based on apparent power (kVA) rather than active power (kW) alone, ensuring adequate headroom for inductive reactive loads.',
    features: [
      {
        title: 'Continuous kVA / kW Output',
        description: 'Calculates nominal active and apparent power to sustain active connected loads without thermal throttling.',
        icon: 'Zap',
      },
      {
        title: 'Motor Startup Surge Buffer',
        description: 'Evaluates 2× to 3× inrush startup surge current for air conditioners, pumping machines, and refrigerators.',
        icon: 'Gauge',
      },
      {
        title: 'Single & Three-Phase Architectures',
        description: 'Supports single-phase 230V residential and three-phase 400V commercial inverter sizing configurations.',
        icon: 'Layers',
      },
    ],
    trustPoints: [
      'Prevents nuisance inverter shutdown during motor compressor startup.',
      'Matches inverter MPPT DC voltage input ranges to PV string configurations.',
      'Recommends verified pure sine wave inverter models from the Sunlit equipment catalog.',
    ],
    faqs: [
      {
        question: 'Why is an inverter sized in kVA instead of kW?',
        answer:
          'Electrical appliances with motors (like ACs and refrigerators) have a power factor less than 1.0, meaning they draw more apparent power (kVA) than active power (kW). Sizing in kVA ensures the inverter does not overload.',
      },
      {
        question: 'What type of inverter is best for Nigerian power conditions?',
        answer:
          'Pure sine wave hybrid inverters with wide MPPT voltage windows and built-in generator synchronization are optimal for Nigerian grid fluctuations and solar-generator hybrid systems.',
      },
    ],
    seo: {
      title: 'Solar Inverter Sizing Calculator Nigeria — kVA & Surge Sizer | Sunlit Energy',
      description:
        'Determine required solar inverter kVA rating, continuous wattage, and surge capacity for residential and commercial solar systems in Nigeria.',
      keywords: 'solar inverter sizing calculator nigeria, inverter kva calculator, hybrid inverter sizing lagos, solar power converter',
      canonical: 'https://sunlit.energy/tools/inverter-sizing',
    },
  },

  'solar-panel-sizing': {
    id: 'solar-panel-sizing',
    slug: 'solar-panel-sizing',
    name: 'Solar Panel Sizing Tool',
    category: 'Photovoltaic Array Sizing',
    tagline: 'Solar Array Capacity & Module Sizing',
    heroHeadline: 'Determine Exact Solar Panel Capacity for Your Energy Needs',
    heroDescription:
      'Calculate the required photovoltaic array capacity in kWp, total module count, and estimated roof area in square meters, accounting for system losses, dust soiling, and regional Nigerian sun hours.',
    primaryCtaText: 'Size Solar Panels',
    secondaryCtaText: 'Explore Module Options',
    mathematicalModel: 'Deterministic Irradiance-Loss Derated PV Sizing Model',
    governingStandards: ['IEC 61724-1', 'IEEE 1562', 'IEC 61215'],
    keyEquations: [
      'P_req_kWp = (E_daily_demand_kWh / (1 - LossFactor)) × DesignMargin / PSH',
      'Module_Count = Ceil((P_req_kWp × 1000) / P_module_W)',
      'A_roof_est (m²) = Module_Count × Area_per_module (2.2 m²)',
    ],
    methodologyDescription:
      'Applies a 14% balance-of-system loss factor (dust, wiring, inverter efficiency) and 15% design safety margin against 12-month regional Nigerian irradiance averages.',
    features: [
      {
        title: 'Tier-1 Mono-PERC / N-Type Modules',
        description: 'Sized using standard 550W, 580W, and 600W high-efficiency monocrystalline solar panels.',
        icon: 'Sun',
      },
      {
        title: 'Roof Space Estimation',
        description: 'Calculates physical roof space requirements (m²) to ensure structural and layout feasibility.',
        icon: 'Layers',
      },
      {
        title: 'Regional Irradiance Calibration',
        description: 'Calibrated to local Peak Sun Hours across Nigeria (4.8 PSH Lagos, 5.5 PSH Abuja, 6.2 PSH Kano).',
        icon: 'MapPin',
      },
    ],
    trustPoints: [
      'Guarantees sufficient daytime solar harvest to power loads and recharge battery storage.',
      'Avoids oversizing and unnecessary capital expense.',
      'Directly links with the PV String Layout Configurator for electrical validation.',
    ],
    faqs: [
      {
        question: 'How many solar panels do I need for my home in Nigeria?',
        answer:
          'The number of solar panels depends on your daily kWh consumption and the panel wattage (e.g. 550W). For example, a 20 kWh/day home in Lagos typically requires 10 to 12 panels (5.5 kWp to 6.6 kWp).',
      },
      {
        question: 'How much roof space is required for solar panels?',
        answer:
          'Modern 550W solar panels require approximately 2.2 m² of roof space per panel. A 10-panel array (5.5 kWp) requires about 22 to 25 m² of unshaded roof area.',
      },
    ],
    seo: {
      title: 'Solar Panel Sizing Calculator Nigeria — kWp & Module Sizer | Sunlit Energy',
      description:
        'Calculate required solar panel capacity (kWp), module count, and roof area (m²) for homes and businesses in Nigeria.',
      keywords: 'solar panel sizing calculator nigeria, how many solar panels do i need, pv array sizing lagos, solar wattage calculator',
      canonical: 'https://sunlit.energy/tools/solar-panel-sizing',
    },
  },

  'cable-sizing': {
    id: 'cable-sizing',
    slug: 'cable-sizing',
    name: 'Solar Cable Sizing Calculator',
    category: 'Electrical Cabling & Voltage Drop',
    tagline: 'Conductor Ampacity & Voltage Drop Engine',
    heroHeadline: 'Engineer Safe Conductor Sizing and Minimize Voltage Drop',
    heroDescription:
      'Determine the required cable cross-sectional area (mm²) for DC solar strings, battery interconnects, and AC mains, enforcing thermal ampacity limits and strict voltage drop thresholds.',
    primaryCtaText: 'Size Solar Cable',
    secondaryCtaText: 'Calculate Voltage Drop',
    mathematicalModel: 'IEC 60287 Cable Thermal Ampacity & Loop Resistance Voltage Drop Model',
    governingStandards: ['IEC 60364-5-52', 'BS 7671 18th Edition', 'NEC Article 310'],
    keyEquations: [
      'I_design = I_circuit / K_thermal_derating',
      'V_drop (V) = (Multiplier × Length_m × R_ohm_per_km × I_amps) / 1000',
      'V_drop_% = (V_drop / V_system) × 100 ≤ Max_allowable_%',
    ],
    methodologyDescription:
      'Calculates conductor resistance and thermal derating for elevated ambient temperatures (35°C–50°C), ensuring voltage drop stays below 1.5% for DC battery runs and 2.5% for AC mains.',
    features: [
      {
        title: 'DC Battery & PV String Validation',
        description: 'Specialized calculations for high-current low-voltage DC circuits and high-voltage PV strings.',
        icon: 'Cable',
      },
      {
        title: 'Thermal Derating for Tropical Climates',
        description: 'Applies temperature correction factors for Nigerian conduit and rooftop cable tray environments.',
        icon: 'Thermometer',
      },
      {
        title: 'Copper & Aluminum Comparison',
        description: 'Evaluates copper (Cu) and aluminum (Al) conductor alternatives for cost-effective installations.',
        icon: 'Sliders',
      },
    ],
    trustPoints: [
      'Eliminates fire hazards caused by undersized, overheating cables.',
      'Prevents inverter undervoltage shutdown during high-current battery discharge.',
      'Complies with IEC 60364-5-52 international electrical installation standards.',
    ],
    faqs: [
      {
        question: 'Why is cable sizing critical for solar installations?',
        answer:
          'Undersized cables create excessive resistance, leading to energy loss, voltage drops that cause inverters to trip, and severe fire risks due to overheating.',
      },
      {
        question: 'What is the maximum allowable voltage drop for solar systems?',
        answer:
          'Industry standards recommend a maximum voltage drop of 1.5% to 2.0% for DC battery cables and solar strings, and no more than 2.5% to 3.0% for AC circuits.',
      },
    ],
    seo: {
      title: 'Solar Cable Sizing Calculator Nigeria — Voltage Drop & mm² Sizer | Sunlit Energy',
      description:
        'Calculate solar cable cross-section (mm²), thermal ampacity derating, and voltage drop percent for DC battery, PV strings, and AC circuits.',
      keywords: 'solar cable sizing calculator nigeria, voltage drop calculator lagos, dc cable sizing, solar wire gauge mm2',
      canonical: 'https://sunlit.energy/tools/cable-sizing',
    },
  },

  'pv-configuration': {
    id: 'pv-configuration',
    slug: 'pv-configuration',
    name: 'PV String Layout Configurator',
    category: 'Photovoltaic Architecture & String Sizing',
    tagline: 'MPPT Voltage Window & String Layout Validator',
    heroHeadline: 'Verify Inverter MPPT Voltage Bounds and Series String Layouts',
    heroDescription:
      'Configure solar panel series strings and parallel configurations, validating cold-weather open-circuit voltage (Voc) and hot-weather maximum power voltage (Vmp) against inverter MPPT windows.',
    primaryCtaText: 'Configure PV Strings',
    secondaryCtaText: 'Validate String Layout',
    mathematicalModel: 'IEC 62548 PV Array String Voltage & MPPT Thermal Boundary Model',
    governingStandards: ['IEC 62548', 'NEC 690.7', 'IEC 61730'],
    keyEquations: [
      'Voc_cold = Voc_stc × [1 + α_Voc × (T_min_C - 25)]',
      'Vmp_hot = Vmp_stc × [1 + α_Voc × (T_max_C - 25)]',
      'String_Voc_cold = Modules_per_string × Voc_cold ≤ Inverter_Max_DC_Voltage',
      'String_Vmp_hot = Modules_per_string × Vmp_hot ≥ Inverter_Min_MPPT_Voltage',
    ],
    methodologyDescription:
      'Ensures string voltages never exceed the inverter max DC limit on cold mornings (15°C) and never drop below the minimum MPPT tracking threshold on hot afternoons (65°C cell temp).',
    features: [
      {
        title: 'Thermal Voltage Derating',
        description: 'Models temperature coefficients of Voc and Vmp across regional extreme temperature swings.',
        icon: 'Thermometer',
      },
      {
        title: 'Inverter MPPT Window Matching',
        description: 'Verifies string operating voltages stay within optimal inverter MPPT tracking efficiency ranges.',
        icon: 'Layers',
      },
      {
        title: 'Parallel String Current Limits',
        description: 'Checks combined array short-circuit current (Isc) against maximum inverter DC input ampacity.',
        icon: 'Zap',
      },
    ],
    trustPoints: [
      'Protects inverters from catastrophic over-voltage damage.',
      'Prevents energy harvest clipping on high-temperature days.',
      'Outputs ready-to-wire string connection diagrams for solar technicians.',
    ],
    faqs: [
      {
        question: 'What is MPPT voltage matching in solar design?',
        answer:
          'MPPT (Maximum Power Point Tracking) matching ensures that the total voltage of solar panels connected in series stays within the voltage range where the inverter can extract maximum solar energy.',
      },
      {
        question: 'What happens if a solar string voltage is too high?',
        answer:
          'If a string Voc exceeds the inverter maximum DC input voltage (e.g. on a cold morning), it can permanently destroy the inverter electronics and void manufacturer warranty.',
      },
    ],
    seo: {
      title: 'PV String Layout Configurator — Inverter MPPT Voltage Sizer | Sunlit Energy',
      description:
        'Validate solar panel string layouts, cold Voc, hot Vmp, and inverter MPPT voltage windows for safe solar installations in Nigeria.',
      keywords: 'pv string layout configurator, solar string sizing calculator, mppt voltage calculator nigeria, solar panel series parallel',
      canonical: 'https://sunlit.energy/tools/pv-configuration',
    },
  },

  'energy-yield': {
    id: 'energy-yield',
    slug: 'energy-yield',
    name: 'Solar Energy Yield Estimator',
    category: 'Solar Production & Generation Forecasting',
    tagline: '12-Month Clean Energy Harvest Modeling',
    heroHeadline: 'Predict Your Annual Solar Energy Production with Confidence',
    heroDescription:
      'Estimate monthly and annual clean energy generation (kWh/year), specific yield (kWh/kWp/year), and performance ratio for any location in Nigeria using regional solar irradiance datasets.',
    primaryCtaText: 'Estimate Solar Yield',
    secondaryCtaText: 'View Yield Simulation',
    mathematicalModel: 'IEC 61724 Photovoltaic Performance Ratio & Yield Simulation Model',
    governingStandards: ['IEC 61724-1', 'NREL SAM Photovoltaic Model', 'ISO 9060'],
    keyEquations: [
      'E_daily (kWh) = P_kWp × PSH × (1 - LossFactor) × Derating_thermal',
      'E_annual (kWh) = E_daily × 365',
      'PR (%) = (E_actual / (P_kWp × Irradiance_total)) × 100',
      'Specific_Yield = E_annual_kWh / P_kWp (kWh/kWp/yr)',
    ],
    methodologyDescription:
      'Simulates 12-month solar harvest factoring in rainy season cloud cover, Harmattan dust soiling, thermal cell derating, and tilt angle orientation.',
    features: [
      {
        title: '12-Month Generation Breakdown',
        description: 'Detailed monthly production forecasting accounting for wet and dry season variations in Nigeria.',
        icon: 'Calendar',
      },
      {
        title: 'Specific Yield (kWh/kWp/yr)',
        description: 'Standardized performance benchmark enabling easy comparison across system sizes and locations.',
        icon: 'Activity',
      },
      {
        title: 'Performance Ratio (PR) Assessment',
        description: 'Evaluates system efficiency against international IEC 61724 Class-A benchmarks (78%–86%).',
        icon: 'Gauge',
      },
    ],
    trustPoints: [
      'Provides realistic production numbers for bankable energy yield assessments.',
      'Accounts for Nigerian Harmattan dust attenuation and wet season cloud cover.',
      'Helps homeowners and businesses verify installer generation claims.',
    ],
    faqs: [
      {
        question: 'How much energy does a 5kW solar system produce in Nigeria?',
        answer:
          'In Nigeria, a well-designed 5 kWp solar system produces approximately 20 to 24 kWh per day on average, resulting in 7,300 to 8,700 kWh of clean electricity annually depending on location.',
      },
      {
        question: 'How does the rainy season and Harmattan affect solar output?',
        answer:
          'During the peak rainy season (June–August) and heavy Harmattan dust haze, daily solar production may decrease by 20–35%. Our yield model incorporates 12-month regional historical data to reflect this.',
      },
    ],
    seo: {
      title: 'Solar Energy Yield Estimator Nigeria — Annual kWh Production | Sunlit Energy',
      description:
        'Forecast daily, monthly, and annual solar energy production (kWh) and performance ratio for solar PV systems across Nigeria.',
      keywords: 'solar energy yield estimator nigeria, solar production calculator lagos, annual kwh solar generation, solar psh nigeria',
      canonical: 'https://sunlit.energy/tools/energy-yield',
    },
  },

  'solar-savings': {
    id: 'solar-savings',
    slug: 'solar-savings',
    name: 'Solar Savings Calculator',
    category: 'Energy Economics & Cost Reduction',
    tagline: 'Grid Tariff & Diesel Fuel Displacement',
    heroHeadline: 'Calculate Your Monthly & 25-Year Electricity Cost Savings',
    heroDescription:
      'Model exact financial savings from displacing expensive DISCO Band A electricity bills and costly diesel generator fueling with clean, dependable solar energy.',
    primaryCtaText: 'Calculate Solar Savings',
    secondaryCtaText: 'Analyze Diesel Displacement',
    mathematicalModel: 'Deterministic Tariff & Diesel Displacement Cashflow Model',
    governingStandards: ['NERC Band A MYTO', 'NMDPRA Market Benchmark', 'World Bank ESMAP'],
    keyEquations: [
      'Savings_grid_monthly (₦) = Monthly_grid_bill × Displacement_grid_%',
      'Savings_gen_monthly (₦) = Monthly_diesel_expense × Displacement_gen_%',
      'Savings_annual (₦) = (Savings_grid_monthly + Savings_gen_monthly) × 12',
      'Savings_25yr (₦) = Σ (Savings_annual × (1 + Inflation_tariff)^t)',
    ],
    methodologyDescription:
      'Calculates combined monthly and lifetime savings using official NERC Band A grid tariffs (₦225/kWh) and commercial diesel price benchmarks (₦1,350/L), with annual tariff escalation.',
    features: [
      {
        title: 'DISCO Band A Grid Displacement',
        description: 'Quantifies electricity bill reductions across Eko, Ikeja, Abuja, and other Nigerian electricity DISCOs.',
        icon: 'Zap',
      },
      {
        title: 'Diesel Generator Fuel Avoidance',
        description: 'Calculates direct savings from eliminating 80%–95% of generator run hours and fuel expenses.',
        icon: 'Fuel',
      },
      {
        title: '25-Year Cumulative Forecast',
        description: 'Projects lifetime financial savings factoring in 8% annual energy tariff inflation.',
        icon: 'TrendingUp',
      },
    ],
    trustPoints: [
      'Gives realistic, transparent Nigerian Naira financial projections.',
      'Reflects recent NERC Multi-Year Tariff Order (MYTO) rate adjustments.',
      'Directly feeds into the Solar ROI & Payback Calculator.',
    ],
    faqs: [
      {
        question: 'How much money can solar save in Nigeria?',
        answer:
          'A typical Nigerian home spending ₦150,000/month on DISCO bills and ₦200,000/month on generator diesel can save ₦250,000 to ₦300,000 monthly (over ₦3.5 million annually) with an appropriately sized solar hybrid system.',
      },
      {
        question: 'What is the biggest source of solar savings in Nigeria?',
        answer:
          'For most Nigerian households and businesses, diesel and petrol generator fuel displacement represents 60% to 75% of total monthly cost savings due to high fuel prices.',
      },
    ],
    seo: {
      title: 'Solar Savings Calculator Nigeria — Monthly & 25-Yr Savings | Sunlit Energy',
      description:
        'Calculate how much money you can save by switching to solar in Nigeria. Compares DISCO Band A tariffs and diesel generator fuel costs.',
      keywords: 'solar savings calculator nigeria, solar cost savings lagos, diesel generator savings solar, disco electricity bill savings',
      canonical: 'https://sunlit.energy/tools/solar-savings',
    },
  },

  'roi-calculator': {
    id: 'roi-calculator',
    slug: 'roi-calculator',
    name: 'Solar ROI & Payback Calculator',
    category: 'Financial Modeling & Capital Investment',
    tagline: 'Discounted Cashflow & IRR Financial Engine',
    heroHeadline: 'Evaluate Solar Payback Period, Net Present Value, and IRR',
    heroDescription:
      'Analyze the financial returns of your solar investment using discounted cash flow (DCF) modeling, Net Present Value (NPV), simple and discounted payback periods, and Internal Rate of Return (IRR).',
    primaryCtaText: 'Calculate Solar ROI',
    secondaryCtaText: 'Evaluate Investment',
    mathematicalModel: 'SciPy Discounted Cash Flow & Internal Rate of Return (IRR) Financial Model',
    governingStandards: ['ISO 15686-5 Life Cycle Costing', 'IEEE 1547.6 Financial Metrics'],
    keyEquations: [
      'Simple_Payback_years = CAPEX / Net_Annual_Savings',
      'NPV (₦) = Σ [CF_t / (1 + r)^t] - CAPEX',
      'IRR (%) = Discount rate r where NPV(r) = 0',
      'ROI (%) = ((Total_Lifetime_Savings - CAPEX) / CAPEX) × 100',
    ],
    methodologyDescription:
      'Applies rigorous financial discounting (12% discount rate, 0.5% annual PV degradation, 1% annual maintenance OPEX) to calculate institutional-grade return metrics.',
    features: [
      {
        title: 'Simple & Discounted Payback',
        description: 'Computes exact timeline in years until cumulative energy savings fully recover initial capital expenditure.',
        icon: 'Clock',
      },
      {
        title: 'Net Present Value (NPV)',
        description: 'Calculates total net financial value created by the solar system over its 25-year design lifespan.',
        icon: 'DollarSign',
      },
      {
        title: 'Internal Rate of Return (IRR)',
        description: 'Computes annualized percentage return on investment to compare solar against other financial assets.',
        icon: 'TrendingUp',
      },
    ],
    trustPoints: [
      'Institutional financial methodology used by banks and commercial solar developers.',
      'Factors in inverter replacement and ongoing maintenance expenses.',
      'Demonstrates that solar in Nigeria typically pays for itself in 3.5 to 5.0 years.',
    ],
    faqs: [
      {
        question: 'What is the typical solar payback period in Nigeria?',
        answer:
          'Due to high diesel fuel costs and Band A electricity tariffs, high-quality solar systems in Nigeria typically achieve full financial payback within 3.0 to 4.5 years.',
      },
      {
        question: 'What does a solar Internal Rate of Return (IRR) of 25%+ mean?',
        answer:
          'An IRR of 25%+ means your solar system delivers a financial return higher than fixed deposits, treasury bills, and most commercial investments, simply through avoided electricity and fuel expenses.',
      },
    ],
    seo: {
      title: 'Solar ROI & Payback Calculator Nigeria — NPV & IRR Sizer | Sunlit Energy',
      description:
        'Calculate solar payback period in years, Net Present Value (NPV in Naira), and Internal Rate of Return (IRR) for solar installations in Nigeria.',
      keywords: 'solar roi calculator nigeria, solar payback period lagos, solar investment return abuja, solar npv irr calculator',
      canonical: 'https://sunlit.energy/tools/roi-calculator',
    },
  },
};
