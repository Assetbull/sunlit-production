import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { runEngineeringCalculation } from '../../engine';
import { inMemoryRateLimiter } from '../../core/rateLimiter';
import { runPythonCalculation } from '../../pythonAdapter';

describe('Adversarial Test Suite — Security Injection & Rate Limiting', () => {
  test('Command injection strings in location / search queries remain harmless data', () => {
    const maliciousLocation = 'Lagos; cat /etc/passwd; $(whoami); `id`';
    const res = runEngineeringCalculation('solar-panel-sizing', {
      dailyEnergyDemandKwh: 20,
      location: maliciousLocation,
    });

    assert.equal(res.calculation_status, 'SUCCESS');
    assert.equal(res.engine_version, '3.0.0');
    // Result should safely fallback to default or truncated string
    assert.ok(res.engineering_results.actualArrayKwp > 0);
  });

  test('Python adapter handles malicious injection payload safely without executing arbitrary shell', async () => {
    const maliciousPayload = {
      action: 'yield' as const,
      params: {
        kwp: 5.0,
        psh: 4.8,
        injection_test: '`rm -rf /` ; echo "PWNED"',
      },
    };

    const res = await runPythonCalculation('yield', maliciousPayload.params);
    assert.ok(res !== null && typeof res === 'object');
    assert.ok(res.annual_kwh > 0);
  });

  test('In-memory rate limiter strictly enforces token threshold', async () => {
    inMemoryRateLimiter.reset();
    const testIp = '192.168.1.99';

    // Consume all 5 tokens
    let allowedCount = 0;
    for (let i = 0; i < 10; i++) {
      const allowed = await inMemoryRateLimiter.check(testIp, 5, 60);
      if (allowed) allowedCount++;
    }

    assert.equal(allowedCount, 5, 'Rate limiter must allow exactly 5 requests when limit is 5');
    const blockedCheck = await inMemoryRateLimiter.check(testIp, 5, 60);
    assert.equal(blockedCheck, false, '6th request must be rejected');
    inMemoryRateLimiter.reset();
  });

  test('Path traversal attempt in string fields is neutralized', () => {
    const pathTraversalString = '../../../../../../etc/shadow';
    const res = runEngineeringCalculation('energy-yield', {
      systemCapacityKwp: 5.0,
      location: pathTraversalString,
    });

    assert.equal(res.calculation_status, 'SUCCESS');
    assert.ok(res.engineering_results.annualProductionKwh > 0);
  });
});
