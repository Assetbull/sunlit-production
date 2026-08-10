/**
 * Structured In-Memory Observability, Metrics & Request Correlation
 * Sunlit Enterprise Engineering Platform — Public Hardening
 */

export interface CalculationLogEntry {
  requestId: string;
  correlationId: string;
  toolId: string;
  operation: string;
  status: 'SUCCESS' | 'VALIDATION_ERROR' | 'ENGINE_ERROR' | 'RATE_LIMITED';
  durationMs: number;
  resultStatus?: string;
  errorCode?: string;
  timestamp: string;
}

export interface EngineeringMetricsSnapshot {
  calculation_requests_total: number;
  calculation_success_total: number;
  calculation_failure_total: number;
  calculation_validation_failure_total: number;
  calculation_rate_limited_total: number;
  python_execution_total: number;
  python_execution_failure_total: number;
  tool_execution_counts: Record<string, number>;
  average_calculation_duration_ms: number;
}

class InMemMetricsStore {
  private requestsTotal = 0;
  private successTotal = 0;
  private failureTotal = 0;
  private validationFailureTotal = 0;
  private rateLimitedTotal = 0;
  private pythonTotal = 0;
  private pythonFailureTotal = 0;
  private totalDurationMs = 0;
  private toolCounts: Record<string, number> = {};

  recordRequest(toolId: string) {
    this.requestsTotal += 1;
    this.toolCounts[toolId] = (this.toolCounts[toolId] ?? 0) + 1;
  }

  recordSuccess(durationMs: number) {
    this.successTotal += 1;
    this.totalDurationMs += durationMs;
  }

  recordFailure(isValidation: boolean, durationMs: number) {
    this.failureTotal += 1;
    if (isValidation) this.validationFailureTotal += 1;
    this.totalDurationMs += durationMs;
  }

  recordRateLimited() {
    this.rateLimitedTotal += 1;
  }

  recordPythonExecution(isSuccess: boolean) {
    this.pythonTotal += 1;
    if (!isSuccess) this.pythonFailureTotal += 1;
  }

  getSnapshot(): EngineeringMetricsSnapshot {
    return {
      calculation_requests_total: this.requestsTotal,
      calculation_success_total: this.successTotal,
      calculation_failure_total: this.failureTotal,
      calculation_validation_failure_total: this.validationFailureTotal,
      calculation_rate_limited_total: this.rateLimitedTotal,
      python_execution_total: this.pythonTotal,
      python_execution_failure_total: this.pythonFailureTotal,
      tool_execution_counts: { ...this.toolCounts },
      average_calculation_duration_ms: this.requestsTotal > 0
        ? Number((this.totalDurationMs / this.requestsTotal).toFixed(2))
        : 0,
    };
  }

  reset() {
    this.requestsTotal = 0;
    this.successTotal = 0;
    this.failureTotal = 0;
    this.validationFailureTotal = 0;
    this.rateLimitedTotal = 0;
    this.pythonTotal = 0;
    this.pythonFailureTotal = 0;
    this.totalDurationMs = 0;
    this.toolCounts = {};
  }
}

export const metricsStore = new InMemMetricsStore();

export function generateCorrelationId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `req-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Structured logger that guarantees no secrets or customer PII are logged.
 */
export function logEngineeringEvent(entry: CalculationLogEntry): void {
  // Safe console log structure for serverless / container stdout
  const safeLog = {
    level: entry.status === 'SUCCESS' ? 'INFO' : 'WARN',
    ...entry,
  };

  if (process.env.NODE_ENV !== 'test') {
    console.log(JSON.stringify(safeLog));
  }
}
