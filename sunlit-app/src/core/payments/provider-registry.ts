/**
 * Payment Provider Registry
 *
 * Implements PAYMENT_ORCHESTRATOR_ENGINE_OS.md (Registry ID 32)
 *
 * Centralizes resolution of external payment providers and enforces capability verification.
 * Prevents hardcoding `if provider === 'pandascrow'` across business services.
 */

import { PaymentProvider } from './provider-abstraction';
import { PandascrowPaymentProvider } from './providers/pandascrow-adapter';
import { PaystackPaymentProvider } from './providers/paystack-adapter';

export class PaymentProviderRegistry {
  private static providers: Map<string, PaymentProvider> = new Map();
  private static defaultProviderName = 'PANDASCROW';

  static {
    // Register canonical providers
    this.registerProvider(new PandascrowPaymentProvider());
    this.registerProvider(new PaystackPaymentProvider());
  }

  static registerProvider(provider: PaymentProvider): void {
    this.providers.set(provider.name.toUpperCase(), provider);
  }

  static getProvider(name?: string): PaymentProvider {
    const target = (name || this.defaultProviderName).toUpperCase();
    const provider = this.providers.get(target);
    if (!provider) {
      throw new Error(
        `Payment Provider Error: Provider '${target}' is not registered in PaymentProviderRegistry.`
      );
    }
    return provider;
  }

  static getEscrowProvider(): PaymentProvider {
    for (const provider of this.providers.values()) {
      if (provider.capabilities.supportsEscrow) {
        return provider;
      }
    }
    throw new Error('Payment Provider Error: No registered provider supports escrow capabilities.');
  }

  static listProviders(): Array<{ name: string; capabilities: unknown }> {
    return Array.from(this.providers.values()).map((p) => ({
      name: p.name,
      capabilities: p.capabilities,
    }));
  }
}
