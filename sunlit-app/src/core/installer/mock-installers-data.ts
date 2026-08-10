/**
 * Sunlit Installer Intelligence — Deterministic Development Mock Dataset
 * 
 * CLEARLY MARKED: DEVELOPMENT / TEST FIXTURES ONLY
 * 
 * Provides 12+ realistic, fictional solar installer organizations covering:
 * - States: Lagos, Abuja (FCT), Ogun, Rivers, Oyo, Edo, Delta, Enugu, Kano, Kaduna
 * - Cities: Lekki, Ikeja, Victoria Island, Ikoyi, Ajah, Maitama, Wuse, Garki, Port Harcourt, Ibadan, Sagamu, Warri, Benin City
 * - Tiers: enterprise, advanced, standard, basic
 * - Services: Residential, Commercial, Industrial, Battery Storage, Microgrids, O&M
 */

import type {
  PublicInstallerView,
  PublicInstallerCardView,
  PublicServiceView,
  PublicServiceAreaView,
  PublicCertificationView,
} from '@/shared/types/installer-intelligence';

export interface MockProject {
  id: string;
  project_name: string;
  location_city: string;
  location_state: string;
  capacity_kw: number;
  battery_storage_kwh?: number;
  completion_date: string;
  description: string;
  gallery_urls?: string[];
}

export interface MockReview {
  id: string;
  reviewer_name: string;
  reviewer_company?: string;
  rating: number;
  review_text: string;
  created_at: string;
  is_verified_project: boolean;
}

export interface MockInstallerData extends PublicInstallerView {
  projects?: MockProject[];
  reviews?: MockReview[];
  verification_badge?: string;
}

export const MOCK_INSTALLERS_DATA: MockInstallerData[] = [
  {
    slug: 'solarcraft-energy-a8f42c',
    business_name: 'SolarCraft Energy',
    business_description:
      'SolarCraft Energy is a premier tier-1 engineering and EPC contractor specializing in high-capacity commercial, industrial, and microgrid solar installations across Southwest and North-Central Nigeria.',
    business_type: 'epc_contractor',
    logo_url: undefined,
    cover_image_url: undefined,
    website_url: 'https://solarcraft.sunlit.energy',
    public_email: 'projects@solarcraftenergy.ng',
    public_phone: '+234 1 800 2345',
    headquarters_state: 'Lagos',
    headquarters_city: 'Lekki Phase 1',
    residential: false,
    commercial: true,
    industrial: true,
    battery_storage: true,
    microgrid: true,
    ev_infrastructure: true,
    system_size_min_kw: 25,
    system_size_max_kw: 5000,
    verification_level: 'enterprise',
    verification_badge: 'Enterprise Verified',
    verified_at: '2025-01-10T00:00:00Z',
    sunlit_score: 94,
    availability_status: 'accepting_projects',
    completed_projects_count: 48,
    total_capacity_installed_kw: 3850,
    average_rating: 4.9,
    review_count: 38,
    years_experience: 8,
    offers_warranty: true,
    offers_maintenance: true,
    offers_financing: true,
    published_at: '2025-01-15T00:00:00Z',
    services: [
      {
        slug: 'commercial-solar',
        name: 'Commercial Solar EPC',
        category: 'commercial_solar',
        description: 'Turnkey solar PV engineering and procurement for commercial towers and manufacturing plants.',
      },
      {
        slug: 'battery-storage',
        name: 'Industrial BESS Storage',
        category: 'battery_storage',
        description: 'Utility-grade energy storage systems providing 24/7 power backup and intelligent peak-shaving.',
      },
      {
        slug: 'microgrids',
        name: 'Islanded Microgrids',
        category: 'microgrids',
        description: 'Autonomous microgrids for remote industrial complexes and agricultural estates.',
      },
    ],
    service_areas: [
      { state: 'Lagos', city: 'Lekki', is_primary: true },
      { state: 'Lagos', city: 'Victoria Island', is_primary: false },
      { state: 'Lagos', city: 'Ikoyi', is_primary: false },
      { state: 'Ogun', city: 'Sagamu', is_primary: false },
      { state: 'Abuja (FCT)', city: 'Maitama', is_primary: false },
    ],
    certifications: [
      {
        name: 'COREN Corporate Engineering License',
        issuing_body: 'Council for the Regulation of Engineering in Nigeria',
        status: 'verified',
        issued_at: '2019-04-12',
        verified_at: '2025-01-10',
      },
      {
        name: 'NEMSA Electrical Installation Class 1',
        issuing_body: 'Nigerian Electricity Management Services Agency',
        status: 'verified',
        issued_at: '2021-08-20',
        verified_at: '2025-01-10',
      },
    ],
    projects: [
      {
        id: 'proj-01',
        project_name: 'TechPark Lagos Microgrid Array',
        location_city: 'Lekki',
        location_state: 'Lagos',
        capacity_kw: 1200,
        battery_storage_kwh: 2500,
        completion_date: 'Nov 2025',
        description: '1.2 MWp commercial rooftop and carport solar deployment providing uninterrupted green power to a technology campus.',
        gallery_urls: [
          'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=60',
        ],
      },
      {
        id: 'proj-02',
        project_name: 'Sagamu Agro-Processing Hybrid System',
        location_city: 'Sagamu',
        location_state: 'Ogun',
        capacity_kw: 450,
        battery_storage_kwh: 900,
        completion_date: 'Jun 2025',
        description: 'High-reliability solar-plus-storage installation eliminating diesel generator run-hours for automated grain mills.',
        gallery_urls: [
          'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=800&auto=format&fit=crop&q=60',
        ],
      },
    ],
    reviews: [
      {
        id: 'rev-01',
        reviewer_name: 'Babajide O.',
        reviewer_company: 'Lekki Tech Hub Holdings',
        rating: 5,
        review_text: 'SolarCraft delivered our 1.2MW tech park microgrid on time and strictly to international standards. Diesel runtime dropped by 84%.',
        created_at: '2025-12-02',
        is_verified_project: true,
      },
    ],
  },

  {
    slug: 'heliocore-energy-b91c3d',
    business_name: 'HelioCore Energy',
    business_description:
      'HelioCore Energy is Abuja’s leading residential and commercial hybrid solar installer. Known for high-end residential rooftop integrations and zero-noise battery backup systems.',
    business_type: 'installer',
    logo_url: undefined,
    cover_image_url: undefined,
    website_url: 'https://heliocore.sunlit.energy',
    public_email: 'info@heliocore.ng',
    public_phone: '+234 9 461 9000',
    headquarters_state: 'Abuja (FCT)',
    headquarters_city: 'Maitama',
    residential: true,
    commercial: true,
    industrial: false,
    battery_storage: true,
    microgrid: false,
    ev_infrastructure: false,
    system_size_min_kw: 5,
    system_size_max_kw: 150,
    verification_level: 'enterprise',
    verification_badge: 'Enterprise Verified',
    verified_at: '2025-02-01T00:00:00Z',
    sunlit_score: 91,
    availability_status: 'accepting_projects',
    completed_projects_count: 36,
    total_capacity_installed_kw: 1850,
    average_rating: 4.8,
    review_count: 27,
    years_experience: 6,
    offers_warranty: true,
    offers_maintenance: true,
    offers_financing: true,
    published_at: '2025-02-01T00:00:00Z',
    services: [
      {
        slug: 'residential-solar',
        name: 'Premium Residential Solar',
        category: 'solar_installation',
        description: 'Sleek rooftop solar systems with integrated lithium storage for luxury residences and estates.',
      },
      {
        slug: 'commercial-solar',
        name: 'Commercial Office Solar',
        category: 'commercial_solar',
        description: 'Office building solar power solutions reducing daytime grid and generator energy consumption.',
      },
    ],
    service_areas: [
      { state: 'Abuja (FCT)', city: 'Maitama', is_primary: true },
      { state: 'Abuja (FCT)', city: 'Wuse', is_primary: false },
      { state: 'Abuja (FCT)', city: 'Asokoro', is_primary: false },
      { state: 'Kaduna', city: 'Kaduna South', is_primary: false },
    ],
    certifications: [
      {
        name: 'NEMSA Certified Solar PV Installer Grade A',
        issuing_body: 'NEMSA Nigeria',
        status: 'verified',
        issued_at: '2022-03-10',
        verified_at: '2025-02-01',
      },
    ],
    projects: [
      {
        id: 'proj-03',
        project_name: 'Maitama Diplomatic Villa Solar Array',
        location_city: 'Maitama',
        location_state: 'Abuja (FCT)',
        capacity_kw: 25,
        battery_storage_kwh: 60,
        completion_date: 'Sep 2025',
        description: '25 kWp hybrid installation with 60 kWh high-voltage LFP storage providing 24/7 seamless energy.',
        gallery_urls: [
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=60',
        ],
      },
    ],
    reviews: [
      {
        id: 'rev-03',
        reviewer_name: 'Musa A.',
        reviewer_company: 'Private Residence, Maitama',
        rating: 5,
        review_text: 'Flawless neat wiring and clean roof layout. Inverter switchover is completely seamless.',
        created_at: '2025-10-04',
        is_verified_project: true,
      },
    ],
  },

  {
    slug: 'lagos-solar-works-c37f1e',
    business_name: 'Lagos Solar Works',
    business_description:
      'Fast, reliable, and cost-effective solar energy and inverter installations for homes, retail clinics, and schools across Mainland and Island Lagos.',
    business_type: 'installer',
    logo_url: undefined,
    cover_image_url: undefined,
    website_url: 'https://lagossolar.sunlit.energy',
    public_email: 'sales@lagossolarworks.ng',
    public_phone: '+234 1 342 8819',
    headquarters_state: 'Lagos',
    headquarters_city: 'Ikeja',
    residential: true,
    commercial: true,
    industrial: false,
    battery_storage: true,
    microgrid: false,
    ev_infrastructure: false,
    system_size_min_kw: 3,
    system_size_max_kw: 100,
    verification_level: 'standard',
    verification_badge: 'Verified Partner',
    verified_at: '2025-01-20T00:00:00Z',
    sunlit_score: 87,
    availability_status: 'accepting_projects',
    completed_projects_count: 29,
    total_capacity_installed_kw: 980,
    average_rating: 4.7,
    review_count: 19,
    years_experience: 5,
    offers_warranty: true,
    offers_maintenance: true,
    offers_financing: false,
    published_at: '2025-01-20T00:00:00Z',
    services: [
      {
        slug: 'residential-solar',
        name: 'Home Solar & Inverter Backup',
        category: 'solar_installation',
        description: 'Complete 3kVA to 15kVA solar systems designed for 24-hour home power and AC operation.',
      },
      {
        slug: 'solar-maintenance',
        name: 'Solar Health Check & Panel Cleaning',
        category: 'solar_maintenance',
        description: 'Comprehensive maintenance, thermal imaging inspection, and solar panel deep-cleaning service.',
      },
    ],
    service_areas: [
      { state: 'Lagos', city: 'Ikeja', is_primary: true },
      { state: 'Lagos', city: 'Yaba', is_primary: false },
      { state: 'Lagos', city: 'Surulere', is_primary: false },
      { state: 'Lagos', city: 'Maryland', is_primary: false },
    ],
    certifications: [
      {
        name: 'Renewable Energy Association of Nigeria Member',
        issuing_body: 'REAN',
        status: 'verified',
        issued_at: '2023-01-15',
        verified_at: '2025-01-20',
      },
    ],
    projects: [
      {
        id: 'proj-04',
        project_name: 'Ikeja Medical Center Solar Backup',
        location_city: 'Ikeja',
        location_state: 'Lagos',
        capacity_kw: 35,
        battery_storage_kwh: 72,
        completion_date: 'Apr 2025',
        description: 'Critical care solar power system ensuring continuous power for ICU and laboratory analyzers.',
      },
    ],
    reviews: [
      {
        id: 'rev-04',
        reviewer_name: 'Dr. Adeyemi K.',
        reviewer_company: 'Lifeline Health Diagnostic Clinic',
        rating: 5,
        review_text: 'Installed our clinic system with zero downtime. Responsive customer service and excellent after-sales support.',
        created_at: '2025-05-19',
        is_verified_project: true,
      },
    ],
  },

  {
    slug: 'greengrid-power-d48e2f',
    business_name: 'GreenGrid Power',
    business_description:
      'Industrial renewable energy engineering and solar utility developer focused on manufacturing plants, FMCG factories, and industrial estates in Ogun and Lagos.',
    business_type: 'epc_contractor',
    headquarters_state: 'Ogun',
    headquarters_city: 'Sagamu',
    residential: false,
    commercial: true,
    industrial: true,
    battery_storage: true,
    microgrid: true,
    ev_infrastructure: false,
    system_size_min_kw: 100,
    system_size_max_kw: 10000,
    verification_level: 'enterprise',
    verification_badge: 'Enterprise Verified',
    sunlit_score: 89,
    availability_status: 'accepting_projects',
    completed_projects_count: 22,
    total_capacity_installed_kw: 4200,
    average_rating: 4.9,
    review_count: 14,
    years_experience: 9,
    offers_warranty: true,
    offers_maintenance: true,
    offers_financing: true,
    services: [
      {
        slug: 'industrial-solar',
        name: 'MegaWatt Industrial Solar',
        category: 'industrial_solar',
        description: 'Multi-megawatt factory roof and ground solar systems engineered for 3-phase industrial heavy loads.',
      },
    ],
    service_areas: [
      { state: 'Ogun', city: 'Sagamu', is_primary: true },
      { state: 'Ogun', city: 'Abeokuta', is_primary: false },
      { state: 'Ogun', city: 'Ota', is_primary: false },
      { state: 'Lagos', city: 'Ikorodu', is_primary: false },
    ],
    certifications: [
      {
        name: 'ISO 9001:2015 Quality Management Systems',
        issuing_body: 'Standards Organisation of Nigeria (SON)',
        status: 'verified',
      },
    ],
  },

  {
    slug: 'terravolt-energy-e59f3a',
    business_name: 'TerraVolt Energy Systems',
    business_description:
      'Marine, offshore, and heavy commercial solar systems provider operating from Port Harcourt. Specializes in ruggedized corrosion-resistant PV arrays for coastal environments.',
    business_type: 'epc_contractor',
    headquarters_state: 'Rivers',
    headquarters_city: 'Port Harcourt',
    residential: false,
    commercial: true,
    industrial: true,
    battery_storage: true,
    microgrid: true,
    ev_infrastructure: false,
    system_size_min_kw: 15,
    system_size_max_kw: 3000,
    verification_level: 'enterprise',
    verification_badge: 'Enterprise Verified',
    sunlit_score: 92,
    availability_status: 'accepting_projects',
    completed_projects_count: 31,
    total_capacity_installed_kw: 2600,
    average_rating: 4.8,
    review_count: 22,
    years_experience: 7,
    offers_warranty: true,
    offers_maintenance: true,
    offers_financing: true,
    services: [
      {
        slug: 'coastal-solar',
        name: 'Coastal Commercial Solar',
        category: 'commercial_solar',
        description: 'Anti-corrosion anodized aluminum mounting and IP66 inverters for high-salinity coastal environments.',
      },
    ],
    service_areas: [
      { state: 'Rivers', city: 'Port Harcourt', is_primary: true },
      { state: 'Delta', city: 'Warri', is_primary: false },
      { state: 'Delta', city: 'Asaba', is_primary: false },
    ],
    certifications: [
      {
        name: 'NUPRC Renewable Energy Permit',
        issuing_body: 'Nigerian Upstream Petroleum Regulatory Commission',
        status: 'verified',
      },
    ],
  },

  {
    slug: 'brightaxis-solar-f60a4b',
    business_name: 'BrightAxis Solar EPC',
    business_description:
      'Institutional and corporate energy infrastructure engineering. Certified EPC contractor delivering utility-scale and luxury high-rise solar energy plants.',
    business_type: 'epc_contractor',
    headquarters_state: 'Lagos',
    headquarters_city: 'Ikoyi',
    residential: false,
    commercial: true,
    industrial: true,
    battery_storage: true,
    microgrid: true,
    ev_infrastructure: true,
    system_size_min_kw: 50,
    system_size_max_kw: 20000,
    verification_level: 'enterprise',
    verification_badge: 'Enterprise Verified',
    sunlit_score: 96,
    availability_status: 'accepting_projects',
    completed_projects_count: 54,
    total_capacity_installed_kw: 6800,
    average_rating: 5.0,
    review_count: 42,
    years_experience: 11,
    offers_warranty: true,
    offers_maintenance: true,
    offers_financing: true,
    services: [
      {
        slug: 'solar-epc',
        name: 'Turnkey Solar EPC & Financing',
        category: 'commercial_solar',
        description: 'Complete engineering, balance-of-plant procurement, PPA structuring, and commissioning.',
      },
    ],
    service_areas: [
      { state: 'Lagos', city: 'Ikoyi', is_primary: true },
      { state: 'Lagos', city: 'Victoria Island', is_primary: false },
      { state: 'Abuja (FCT)', city: 'Maitama', is_primary: false },
    ],
    certifications: [
      {
        name: 'COREN Certified Engineering Firm',
        issuing_body: 'COREN Nigeria',
        status: 'verified',
      },
    ],
  },

  {
    slug: 'sunpeak-systems-a71b5c',
    business_name: 'SunPeak Systems',
    business_description:
      'Victoria Island-based commercial solar integrator focusing on retail banking branches, boutique hotels, and restaurants with rapid-deployment inverter storage.',
    business_type: 'installer',
    headquarters_state: 'Lagos',
    headquarters_city: 'Victoria Island',
    residential: true,
    commercial: true,
    industrial: false,
    battery_storage: true,
    microgrid: false,
    ev_infrastructure: false,
    system_size_min_kw: 10,
    system_size_max_kw: 100,
    verification_level: 'standard',
    verification_badge: 'Verified Partner',
    sunlit_score: 85,
    availability_status: 'accepting_projects',
    completed_projects_count: 19,
    total_capacity_installed_kw: 620,
    average_rating: 4.6,
    review_count: 15,
    years_experience: 4,
    offers_warranty: true,
    offers_maintenance: true,
    offers_financing: false,
    services: [
      {
        slug: 'commercial-solar',
        name: 'Hospitality & Retail Solar',
        category: 'commercial_solar',
        description: 'Acoustic-silent solar inverters and battery systems preventing disruption in hospitality venues.',
      },
    ],
    service_areas: [
      { state: 'Lagos', city: 'Victoria Island', is_primary: true },
      { state: 'Lagos', city: 'Lekki', is_primary: false },
    ],
    certifications: [
      {
        name: 'NEMSA Solar PV Certification',
        issuing_body: 'NEMSA',
        status: 'verified',
      },
    ],
  },

  {
    slug: 'novasun-power-b82c6d',
    business_name: 'NovaSun Power Ltd',
    business_description:
      'Ibadan and Oyo State solar contractor delivering clean solar systems for universities, agricultural cold storage, and private residential estates.',
    business_type: 'installer',
    headquarters_state: 'Oyo',
    headquarters_city: 'Ibadan',
    residential: true,
    commercial: true,
    industrial: false,
    battery_storage: true,
    microgrid: false,
    ev_infrastructure: false,
    system_size_min_kw: 5,
    system_size_max_kw: 50,
    verification_level: 'standard',
    verification_badge: 'Verified Partner',
    sunlit_score: 82,
    availability_status: 'accepting_projects',
    completed_projects_count: 18,
    total_capacity_installed_kw: 740,
    average_rating: 4.6,
    review_count: 12,
    years_experience: 5,
    offers_warranty: true,
    offers_maintenance: true,
    offers_financing: false,
    services: [
      {
        slug: 'residential-solar',
        name: 'Residential Solar Rooftop',
        category: 'solar_installation',
        description: 'Reliable rooftop solar and inverter systems for villas and estates in Ibadan.',
      },
    ],
    service_areas: [
      { state: 'Oyo', city: 'Ibadan', is_primary: true },
    ],
    certifications: [
      {
        name: 'REAN Registered Installer',
        issuing_body: 'REAN',
        status: 'verified',
      },
    ],
  },

  {
    slug: 'gridbridge-energy-c93d7e',
    business_name: 'GridBridge Energy',
    business_description:
      'Abuja-based hybrid solar specialist providing robust power conversion systems for residences, legal chambers, and financial offices in Wuse and Garki.',
    business_type: 'installer',
    headquarters_state: 'Abuja (FCT)',
    headquarters_city: 'Wuse 2',
    residential: true,
    commercial: true,
    industrial: false,
    battery_storage: true,
    microgrid: false,
    ev_infrastructure: false,
    system_size_min_kw: 5,
    system_size_max_kw: 40,
    verification_level: 'standard',
    verification_badge: 'Verified Partner',
    sunlit_score: 83,
    availability_status: 'accepting_projects',
    completed_projects_count: 15,
    total_capacity_installed_kw: 510,
    average_rating: 4.5,
    review_count: 11,
    years_experience: 4,
    offers_warranty: true,
    offers_maintenance: true,
    offers_financing: false,
    services: [
      {
        slug: 'hybrid-solar',
        name: 'Hybrid Inverter Solar Systems',
        category: 'solar_installation',
        description: 'Complete turnkey solar PV and lithium battery installation with remote monitoring.',
      },
    ],
    service_areas: [
      { state: 'Abuja (FCT)', city: 'Wuse', is_primary: true },
      { state: 'Abuja (FCT)', city: 'Garki', is_primary: false },
      { state: 'Abuja (FCT)', city: 'Jabi', is_primary: false },
    ],
    certifications: [
      {
        name: 'NEMSA Solar PV Certificate',
        issuing_body: 'NEMSA',
        status: 'verified',
      },
    ],
  },

  {
    slug: 'savanna-solar-d04e8f',
    business_name: 'Savanna Solar Technologies',
    business_description:
      'Northern Nigeria solar engineering company specializing in solar-powered irrigation, agricultural water pumping, and off-grid mini-grids in Kano and Kaduna.',
    business_type: 'installer',
    headquarters_state: 'Kano',
    headquarters_city: 'Nassarawa',
    residential: false,
    commercial: true,
    industrial: true,
    battery_storage: false,
    microgrid: true,
    ev_infrastructure: false,
    system_size_min_kw: 5,
    system_size_max_kw: 100,
    verification_level: 'standard',
    verification_badge: 'Verified Partner',
    sunlit_score: 79,
    availability_status: 'accepting_projects',
    completed_projects_count: 12,
    total_capacity_installed_kw: 890,
    average_rating: 4.4,
    review_count: 8,
    years_experience: 6,
    offers_warranty: true,
    offers_maintenance: true,
    offers_financing: false,
    services: [
      {
        slug: 'ag-solar',
        name: 'Solar Water Pumping & Ag-Solar',
        category: 'solar_installation',
        description: 'Submersible solar pump systems with MPPT frequency drives for farm irrigation.',
      },
    ],
    service_areas: [
      { state: 'Kano', city: 'Nassarawa', is_primary: true },
      { state: 'Kaduna', city: 'Kaduna South', is_primary: false },
    ],
    certifications: [
      {
        name: 'REAN Northern Chapter Accreditation',
        issuing_body: 'REAN',
        status: 'verified',
      },
    ],
  },

  {
    slug: 'apex-solar-e15f9a',
    business_name: 'Apex Solar Solutions',
    business_description:
      'Ajah and Lekki residential solar installer specializing in roof space optimization, high-yield bifacial panels, and safe wall-mounted battery setups.',
    business_type: 'installer',
    headquarters_state: 'Lagos',
    headquarters_city: 'Ajah',
    residential: true,
    commercial: false,
    industrial: false,
    battery_storage: true,
    microgrid: false,
    ev_infrastructure: false,
    system_size_min_kw: 5,
    system_size_max_kw: 25,
    verification_level: 'standard',
    verification_badge: 'Verified Partner',
    sunlit_score: 84,
    availability_status: 'accepting_projects',
    completed_projects_count: 23,
    total_capacity_installed_kw: 580,
    average_rating: 4.7,
    review_count: 21,
    years_experience: 5,
    offers_warranty: true,
    offers_maintenance: true,
    offers_financing: false,
    services: [
      {
        slug: 'residential-solar',
        name: 'Residential Solar Backup',
        category: 'solar_installation',
        description: 'High-efficiency residential rooftop arrays engineered for high-humidity coastal Lekki-Epe corridor.',
      },
    ],
    service_areas: [
      { state: 'Lagos', city: 'Ajah', is_primary: true },
      { state: 'Lagos', city: 'Lekki', is_primary: false },
    ],
    certifications: [
      {
        name: 'NEMSA Solar Competency Certificate',
        issuing_body: 'NEMSA',
        status: 'verified',
      },
    ],
  },

  {
    slug: 'enugu-cleanpower-f26a0b',
    business_name: 'Enugu CleanPower Ltd',
    business_description:
      'South-East renewable energy contractor delivering solar power solutions for hospitals, commercial bakeries, and private estates in Enugu and Anambra.',
    business_type: 'installer',
    headquarters_state: 'Enugu',
    headquarters_city: 'Independence Layout',
    residential: true,
    commercial: true,
    industrial: false,
    battery_storage: true,
    microgrid: false,
    ev_infrastructure: false,
    system_size_min_kw: 8,
    system_size_max_kw: 80,
    verification_level: 'standard',
    verification_badge: 'Verified Partner',
    sunlit_score: 81,
    availability_status: 'accepting_projects',
    completed_projects_count: 11,
    total_capacity_installed_kw: 490,
    average_rating: 4.6,
    review_count: 9,
    years_experience: 4,
    offers_warranty: true,
    offers_maintenance: true,
    offers_financing: false,
    services: [
      {
        slug: 'commercial-solar',
        name: 'Commercial Solar & Battery',
        category: 'commercial_solar',
        description: 'Turnkey solar PV systems designed for commercial bakeries, clinics, and hotels.',
      },
    ],
    service_areas: [
      { state: 'Enugu', city: 'Independence Layout', is_primary: true },
      { state: 'Anambra', city: 'Awka', is_primary: false },
    ],
    certifications: [
      {
        name: 'REAN South-East Member',
        issuing_body: 'REAN',
        status: 'verified',
      },
    ],
  },

  // --- Additional profiles for directory hub coverage ---

  {
    slug: 'ibadan-volt-grid-g82c5e',
    business_name: 'Ibadan Volt Grid',
    business_description:
      'Southwest Nigeria\'s foremost solar EPC contractor, delivering hybrid microgrids and distributed energy systems for agro-industrial clusters, estates, and polytechnic campuses across Oyo and Osun.',
    business_type: 'epc_contractor',
    logo_url: undefined,
    cover_image_url: undefined,
    website_url: 'https://ibadanvoltgrid.sunlit.energy',
    public_email: 'projects@ibadanvoltgrid.ng',
    public_phone: '+234 2 819 4500',
    headquarters_state: 'Oyo',
    headquarters_city: 'Ibadan (Ring Road)',
    residential: false,
    commercial: true,
    industrial: true,
    battery_storage: true,
    microgrid: true,
    ev_infrastructure: false,
    system_size_min_kw: 30,
    system_size_max_kw: 3000,
    verification_level: 'enterprise',
    verification_badge: 'Enterprise Verified',
    verified_at: '2025-03-10T00:00:00Z',
    sunlit_score: 92,
    availability_status: 'accepting_projects',
    completed_projects_count: 41,
    total_capacity_installed_kw: 3200,
    average_rating: 4.9,
    review_count: 32,
    years_experience: 9,
    offers_warranty: true,
    offers_maintenance: true,
    offers_financing: true,
    published_at: '2025-03-10T00:00:00Z',
    services: [
      {
        slug: 'industrial-solar',
        name: 'Industrial Microgrid EPC',
        category: 'industrial_solar',
        description: 'Complete design, procurement, and commissioning of solar-plus-storage microgrids for agro-industrial facilities.',
      },
      {
        slug: 'battery-storage',
        name: 'High-Voltage LiFePO4 Storage',
        category: 'battery_storage',
        description: 'Utility-grade lithium iron phosphate battery arrays with BMS and remote telemetry.',
      },
    ],
    service_areas: [
      { state: 'Oyo', city: 'Ibadan', is_primary: true },
      { state: 'Osun', city: 'Osogbo', is_primary: false },
      { state: 'Ekiti', city: 'Ado-Ekiti', is_primary: false },
    ],
    certifications: [
      {
        name: 'COREN Registered Engineering Firm',
        issuing_body: 'Council for the Regulation of Engineering in Nigeria',
        status: 'verified',
        issued_at: '2019-07-01',
        verified_at: '2025-03-10',
      },
    ],
    projects: [
      {
        id: 'proj-ibv-01',
        project_name: 'Oyo Agro-Park Hybrid Microgrid',
        location_city: 'Ibadan',
        location_state: 'Oyo',
        capacity_kw: 850,
        battery_storage_kwh: 1800,
        completion_date: 'Feb 2026',
        description: '850 kWp solar microgrid with 1.8 MWh LFP storage for integrated agro-processing park, replacing 100% diesel runtime.',
      },
    ],
    reviews: [
      {
        id: 'rev-ibv-01',
        reviewer_name: 'Afolabi T.',
        reviewer_company: 'Oyo Agro Holdings',
        rating: 5,
        review_text: 'Ibadan Volt Grid delivered the full microgrid ahead of schedule. Our diesel spend dropped to near zero in month one.',
        created_at: '2026-02-28',
        is_verified_project: true,
      },
    ],
  },

  {
    slug: 'benin-suntech-h73d2f',
    business_name: 'Benin SunTech Energy',
    business_description:
      'South-South Nigeria\'s premium commercial and residential solar installer. Specializing in rooftop PV systems, hybrid inverter integration, and grid-tied solar for SMEs and estates in Edo, Delta, and Ondo.',
    business_type: 'installer',
    logo_url: undefined,
    cover_image_url: undefined,
    website_url: 'https://beninsutech.sunlit.energy',
    public_email: 'hello@beninsutech.ng',
    public_phone: '+234 52 291 8870',
    headquarters_state: 'Edo',
    headquarters_city: 'Benin City (GRA)',
    residential: true,
    commercial: true,
    industrial: false,
    battery_storage: true,
    microgrid: false,
    ev_infrastructure: false,
    system_size_min_kw: 5,
    system_size_max_kw: 200,
    verification_level: 'advanced',
    verification_badge: 'Advanced EPC',
    verified_at: '2025-04-15T00:00:00Z',
    sunlit_score: 88,
    availability_status: 'accepting_projects',
    completed_projects_count: 34,
    total_capacity_installed_kw: 1420,
    average_rating: 4.8,
    review_count: 26,
    years_experience: 7,
    offers_warranty: true,
    offers_maintenance: true,
    offers_financing: false,
    published_at: '2025-04-15T00:00:00Z',
    services: [
      {
        slug: 'commercial-solar',
        name: 'Commercial Rooftop PV',
        category: 'commercial_solar',
        description: 'High-performance commercial rooftop solar arrays for hotels, banks, and retail centres.',
      },
      {
        slug: 'residential-solar',
        name: 'Estate Solar Backup',
        category: 'solar_installation',
        description: 'Elegant residential solar integrations with silent LFP battery banks for mid- and high-end estates.',
      },
    ],
    service_areas: [
      { state: 'Edo', city: 'Benin City', is_primary: true },
      { state: 'Delta', city: 'Warri', is_primary: false },
      { state: 'Ondo', city: 'Akure', is_primary: false },
    ],
    certifications: [
      {
        name: 'NEMSA Solar PV Installation Grade A',
        issuing_body: 'NEMSA',
        status: 'verified',
        issued_at: '2022-01-15',
        verified_at: '2025-04-15',
      },
    ],
    projects: [
      {
        id: 'proj-bst-01',
        project_name: 'Benin City Hotel Rooftop Array',
        location_city: 'Benin City',
        location_state: 'Edo',
        capacity_kw: 120,
        battery_storage_kwh: 240,
        completion_date: 'Dec 2025',
        description: '120 kWp rooftop array with 240 kWh LFP for a 4-star hotel, cutting energy spend by 68%.',
      },
    ],
    reviews: [
      {
        id: 'rev-bst-01',
        reviewer_name: 'Kingsley E.',
        reviewer_company: 'Regency Hotels Ltd, Benin City',
        rating: 5,
        review_text: 'Professional team, clean installation. Our generator barely runs anymore and the savings are exceptional.',
        created_at: '2026-01-08',
        is_verified_project: true,
      },
    ],
  },

  {
    slug: 'portharc-power-i64b1a',
    business_name: 'Port Harcourt Power Systems',
    business_description:
      'Rivers State\'s leading industrial and commercial solar EPC contractor. Delivering high-reliability solar-plus-storage systems for oil industry logistics, cold chain facilities, and offshore support bases.',
    business_type: 'epc_contractor',
    logo_url: undefined,
    cover_image_url: undefined,
    website_url: 'https://phpower.sunlit.energy',
    public_email: 'energy@phpowersystems.ng',
    public_phone: '+234 8 431 2200',
    headquarters_state: 'Rivers',
    headquarters_city: 'Port Harcourt (GRA)',
    residential: false,
    commercial: true,
    industrial: true,
    battery_storage: true,
    microgrid: true,
    ev_infrastructure: false,
    system_size_min_kw: 50,
    system_size_max_kw: 8000,
    verification_level: 'enterprise',
    verification_badge: 'Enterprise Verified',
    verified_at: '2025-02-20T00:00:00Z',
    sunlit_score: 93,
    availability_status: 'accepting_projects',
    completed_projects_count: 52,
    total_capacity_installed_kw: 6400,
    average_rating: 4.9,
    review_count: 44,
    years_experience: 11,
    offers_warranty: true,
    offers_maintenance: true,
    offers_financing: true,
    published_at: '2025-02-20T00:00:00Z',
    services: [
      {
        slug: 'industrial-solar',
        name: 'Industrial Solar EPC',
        category: 'industrial_solar',
        description: 'Turnkey solar EPC for oil logistics bases, cold chain warehouses, and heavy-industry facilities.',
      },
      {
        slug: 'microgrids',
        name: 'Resilient Microgrids',
        category: 'microgrids',
        description: 'Islanded solar microgrids with SCADA-grade telemetry for remote and industrial complexes.',
      },
      {
        slug: 'battery-storage',
        name: 'BESS Energy Storage',
        category: 'battery_storage',
        description: 'Container-grade LFP battery energy storage systems with active cooling and BMS.',
      },
    ],
    service_areas: [
      { state: 'Rivers', city: 'Port Harcourt', is_primary: true },
      { state: 'Bayelsa', city: 'Yenagoa', is_primary: false },
      { state: 'Akwa Ibom', city: 'Uyo', is_primary: false },
    ],
    certifications: [
      {
        name: 'COREN Corporate Engineering License',
        issuing_body: 'COREN',
        status: 'verified',
        issued_at: '2017-09-01',
        verified_at: '2025-02-20',
      },
      {
        name: 'ISO 9001:2015 Quality Management',
        issuing_body: 'Bureau Veritas',
        status: 'verified',
        issued_at: '2023-11-01',
        verified_at: '2025-02-20',
      },
    ],
    projects: [
      {
        id: 'proj-php-01',
        project_name: 'PH Cold Chain Logistics Solar Hub',
        location_city: 'Port Harcourt',
        location_state: 'Rivers',
        capacity_kw: 2200,
        battery_storage_kwh: 4800,
        completion_date: 'Mar 2026',
        description: '2.2 MWp solar hub with 4.8 MWh containerized BESS for multinational cold-chain and logistics corridor.',
      },
    ],
    reviews: [
      {
        id: 'rev-php-01',
        reviewer_name: 'Chidi O.',
        reviewer_company: 'Atlantic Cold Logistics Ltd',
        rating: 5,
        review_text: 'PH Power Systems delivered an ISO-compliant 2.2MW solar project on time within the Niger Delta industrial zone. Exceptional execution.',
        created_at: '2026-03-15',
        is_verified_project: true,
      },
    ],
  },
];

// =============================================
// Directory UI Display Fields (client-side only)
// Extends PublicInstallerCardView with display metadata for
// the interactive installer directory. NOT part of the API contract.
// =============================================
export interface DirectoryInstallerCard extends PublicInstallerCardView {
  hub: 'Lagos Hub' | 'Abuja Hub' | 'Ogun Hub' | 'Rivers Hub' | 'Oyo Hub' | 'Other';
  tier: 'Tier 1 Enterprise' | 'Commercial & EPC' | 'Residential Solar';
  specialization: string;
  escrowProtected: boolean;
  slaResponse: string;
}

function resolveHub(state?: string): DirectoryInstallerCard['hub'] {
  if (!state) return 'Other';
  const s = state.toLowerCase();
  if (s.includes('lagos')) return 'Lagos Hub';
  if (s.includes('abuja') || s.includes('fct')) return 'Abuja Hub';
  if (s.includes('ogun')) return 'Ogun Hub';
  if (s.includes('rivers')) return 'Rivers Hub';
  if (s.includes('oyo')) return 'Oyo Hub';
  return 'Other';
}

function resolveTier(inst: MockInstallerData): DirectoryInstallerCard['tier'] {
  if (inst.verification_level === 'enterprise') {
    return 'Tier 1 Enterprise';
  }
  if (inst.commercial || inst.industrial || inst.microgrid || inst.business_type === 'epc_contractor') {
    return 'Commercial & EPC';
  }
  return 'Residential Solar';
}

function resolveSpecialization(inst: MockInstallerData): string {
  if (inst.microgrid) return 'Hybrid Microgrids';
  if (inst.industrial && inst.battery_storage) return 'High-Voltage LiFePO4 Storage';
  if (inst.commercial && inst.battery_storage) return 'Commercial Rooftop PV';
  if (inst.residential && inst.battery_storage) return 'Residential Storage Systems';
  if (inst.residential) return 'Residential Solar';
  if (inst.commercial) return 'Commercial Solar EPC';
  return 'Solar Energy Systems';
}

export function getMockInstallerCards(): DirectoryInstallerCard[] {
  return MOCK_INSTALLERS_DATA.map((inst) => ({
    slug: inst.slug,
    business_name: inst.business_name,
    business_type: inst.business_type,
    logo_url: inst.logo_url,
    headquarters_state: inst.headquarters_state,
    headquarters_city: inst.headquarters_city,
    verification_level: inst.verification_level,
    sunlit_score: inst.sunlit_score,
    availability_status: inst.availability_status,
    completed_projects_count: inst.completed_projects_count,
    average_rating: inst.average_rating,
    review_count: inst.review_count,
    residential: inst.residential,
    commercial: inst.commercial,
    industrial: inst.industrial,
    services: (inst.services || []).map((s) => s.name),
    // Directory display fields
    hub: resolveHub(inst.headquarters_state),
    tier: resolveTier(inst),
    specialization: resolveSpecialization(inst),
    escrowProtected: true,
    slaResponse: 'Under 2 Hours',
  }));
}

export function findMockInstallerBySlug(slug: string): MockInstallerData | null {
  const found = MOCK_INSTALLERS_DATA.find((inst) => inst.slug.toLowerCase() === slug.toLowerCase());
  return found || null;
}
