/**
 * Numeric Safety and Sanity Layer
 * Sunlit Enterprise Engineering Platform — Public Hardening
 */

/**
 * Checks if a value is a strictly valid finite number (not NaN, not +/-Infinity).
 */
export function isFiniteNumber(val: unknown): val is number {
  return typeof val === 'number' && Number.isFinite(val);
}

/**
 * Recursively scans an object, array, or primitive for any non-finite number values.
 * Returns an array of paths containing non-finite numbers (e.g., "engineering_results.dailyEnergyDemandKwh").
 */
export function findNonFinitePaths(data: unknown, currentPath = ''): string[] {
  const violations: string[] = [];

  if (typeof data === 'number') {
    if (!Number.isFinite(data)) {
      violations.push(currentPath || 'value');
    }
  } else if (Array.isArray(data)) {
    data.forEach((item, index) => {
      violations.push(...findNonFinitePaths(item, `${currentPath}[${index}]`));
    });
  } else if (typeof data === 'object' && data !== null) {
    for (const [key, val] of Object.entries(data as Record<string, unknown>)) {
      const nextPath = currentPath ? `${currentPath}.${key}` : key;
      violations.push(...findNonFinitePaths(val, nextPath));
    }
  }

  return violations;
}

/**
 * Recursively sanitizes data by replacing NaN / Infinity with fallback (0 or null) to prevent json serialization breaks.
 */
export function sanitizeNonFiniteValues<T>(data: T, fallbackValue = 0): T {
  if (typeof data === 'number') {
    if (!Number.isFinite(data)) {
      return fallbackValue as unknown as T;
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeNonFiniteValues(item, fallbackValue)) as unknown as T;
  }

  if (typeof data === 'object' && data !== null) {
    const sanitizedObj: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(data as Record<string, unknown>)) {
      sanitizedObj[key] = sanitizeNonFiniteValues(val, fallbackValue);
    }
    return sanitizedObj as T;
  }

  return data;
}

/**
 * Validates that an engineering result contains only finite numbers.
 * If non-finite values are found, returns sanitized copy with validation failure flags.
 */
export function enforceNumericSafety<T extends Record<string, unknown>>(result: T): {
  isClean: boolean;
  violations: string[];
  sanitizedResult: T;
} {
  const violations = findNonFinitePaths(result);
  const isClean = violations.length === 0;

  if (!isClean) {
    return {
      isClean: false,
      violations,
      sanitizedResult: sanitizeNonFiniteValues(result),
    };
  }

  return {
    isClean: true,
    violations: [],
    sanitizedResult: result,
  };
}
