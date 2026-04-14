/**
 * Input Sanitization — Defense in Depth
 * 
 * Parameterized queries (via Supabase SDK) prevent SQL injection natively.
 * This layer provides XSS protection by encoding HTML entities in all
 * string inputs before they reach the database or are reflected in responses.
 * 
 * Strategy: Encode dangerous characters rather than strip tags (which is bypassable).
 */

const HTML_ENTITY_MAP: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#96;',
};

const HTML_ENTITY_REGEX = /[&<>"'`/]/g;

/**
 * Encodes HTML entities in a string to prevent XSS.
 * This is more robust than tag-stripping because it handles
 * malformed HTML, event handlers, and edge cases.
 */
export function sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') return input;
    return input.replace(HTML_ENTITY_REGEX, (char) => HTML_ENTITY_MAP[char] || char);
}

/**
 * Recursively sanitizes all string values in a payload object or array.
 * Handles nested objects and arrays for complete coverage.
 */
export function sanitizePayload<T>(payload: T): T {
    if (payload === null || payload === undefined) return payload;

    if (typeof payload === 'string') {
        return sanitizeInput(payload) as unknown as T;
    }

    if (Array.isArray(payload)) {
        return payload.map((item) => sanitizePayload(item)) as unknown as T;
    }

    if (typeof payload === 'object') {
        const sanitized = { ...payload } as Record<string, unknown>;
        for (const key in sanitized) {
            if (Object.prototype.hasOwnProperty.call(sanitized, key)) {
                sanitized[key] = sanitizePayload(sanitized[key]);
            }
        }
        return sanitized as T;
    }

    return payload;
}
