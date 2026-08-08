export type EngineeringAnalyticsEvent =
  | 'waitlist_view'
  | 'waitlist_started'
  | 'waitlist_submitted'
  | 'waitlist_duplicate'
  | 'waitlist_error'
  | 'tool_calculation_run'
  | 'report_unlocked'
  | 'rfq_created';

export interface EventPayload {
  eventName: EngineeringAnalyticsEvent;
  toolId?: string;
  userType?: string;
  location?: string;
  timestamp?: string;
  metadata?: Record<string, any>;
}

export function trackEngineeringEvent(payload: EventPayload): void {
  const data = {
    ...payload,
    timestamp: payload.timestamp || new Date().toISOString(),
  };

  // Safe client analytics logging
  if (typeof window !== 'undefined') {
    console.log('[Sunlit Engineering Analytics]', data);
    // Interface to Google Analytics / PostHog / Plausible if available
    if ((window as any).gtag) {
      (window as any).gtag('event', data.eventName, data.metadata);
    }
  }
}
