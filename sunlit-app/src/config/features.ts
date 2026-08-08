/**
 * Safe feature toggles — keep routing/auth on; isolate incomplete product areas.
 * 
 * GEMINI.md §3: Build sequence — PO → Installer → CrewLink → EPC → Admin
 * Future domains (Supplier, Logistics, Mini-grid, Solar Loan) remain OFF.
 */
export const FUTURE_DOMAINS_ENABLED = false;

export const FEATURES = {
  /** Core auth + dashboard shell */
  AUTH: true,
  DASHBOARD: true,

  /** Project Owner features */
  RFQ: true,
  BIDDING: true,
  CONTRACTS: true,
  PAYMENT_CONTROL: true,

  /** Installer features */
  INSTALLER: true,
  INSTALLER_MARKETPLACE: true,
  INSTALLER_BIDS: true,
  INSTALLER_PROJECTS: true,

  /** CrewLink (labor marketplace) */
  CREWLINK: true,
  CREWLINK_JOBS: true,
  CREWLINK_APPLICATIONS: true,

  /** Cross-system features */
  MARKETPLACE: true,
  CHAT: true,
  REVIEWS: true,
} as const;
