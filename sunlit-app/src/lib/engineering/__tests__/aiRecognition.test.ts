import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { parseNaturalLanguageLoadDescription } from '../ai/applianceRecognition';

describe('AI-Assisted Natural Language Appliance Recognition', () => {
  test('Parses natural language sentence with quantities and runtime', () => {
    const input = '2 1.5hp acs running 8 hours, 1 double door fridge, and 10 LED bulbs';
    const result = parseNaturalLanguageLoadDescription(input);

    assert.ok(result.parsedItems.length >= 3);
    assert.ok(result.estimatedDailyEnergyKwh > 0);

    const ac = result.parsedItems.find((i) => i.name.includes('1.5 HP'));
    assert.ok(ac !== undefined);
    assert.equal(ac.quantity, 2);
    assert.equal(ac.hoursPerDay, 8);

    const fridge = result.parsedItems.find((i) => i.name.includes('Refrigerator'));
    assert.ok(fridge !== undefined);
    assert.equal(fridge.quantity, 1);
  });

  test('Handles unrecognized appliances gracefully with suggestions', () => {
    const input = '1 nuclear reactor running 24h, 1 1hp water pump';
    const result = parseNaturalLanguageLoadDescription(input);

    assert.ok(result.unrecognizedClauses.length >= 1);
    assert.ok(result.unrecognizedClauses.some((c) => c.includes('nuclear')));
    assert.ok(result.parsedItems.some((i) => i.name.includes('Pump')));
  });
});
