import crypto from 'crypto';

/**
 * Validates Paystack webhook signatures using timing-safe comparison.
 * CRITICAL: Never trust client-side payment confirmation.
 * Webhook signature verification is the ONLY trusted path.
 */
export function verifyPaystackWebhook(payload: string, signature: string): boolean {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
        throw new Error('PAYSTACK_SECRET_KEY is not configured.');
    }

    const hash = crypto.createHmac('sha512', secret).update(payload).digest('hex');

    // CRITICAL: Use timing-safe comparison to prevent timing attacks
    // Both buffers must be the same length for timingSafeEqual
    const hashBuffer = Buffer.from(hash, 'hex');
    const signatureBuffer = Buffer.from(signature, 'hex');

    if (hashBuffer.length !== signatureBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(hashBuffer, signatureBuffer);
}

/**
 * Validates Flutterwave webhook signatures using timing-safe comparison.
 */
export function verifyFlutterwaveWebhook(signature: string): boolean {
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
    if (!secretHash) {
        throw new Error('FLUTTERWAVE_SECRET_HASH is not configured.');
    }

    // CRITICAL: Use timing-safe comparison
    const sigBuffer = Buffer.from(signature);
    const secretBuffer = Buffer.from(secretHash);

    if (sigBuffer.length !== secretBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(sigBuffer, secretBuffer);
}
