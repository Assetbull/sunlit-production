/**
 * Safe feature toggles — keep routing/auth on; isolate incomplete product areas.
 */
export const FEATURES = {
  AUTH: true,
  DASHBOARD: true,
  RFQ: false,
  BIDDING: false,
} as const;
