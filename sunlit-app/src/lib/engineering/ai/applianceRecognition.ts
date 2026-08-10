/**
 * AI-Assisted Input Recognition & Specification Extraction Engine
 * Sunlit Enterprise Engineering Platform
 * Engine Version 3.0.0
 *
 * Provides intelligent natural language parsing, appliance recognition, and missing information detection.
 *
 * ARCHITECTURAL BOUNDARY:
 * - AI/LLM assistance is strictly confined to:
 *   1. Natural-language input interpretation
 *   2. Appliance recognition & specification extraction
 *   3. Missing-information detection & user prompt generation
 *   4. Translating human language into structured engineering inputs
 * - Mathematical and physical calculation MUST ALWAYS remain in deterministic engineering engines.
 */

import { APPLIANCE_CATALOG, CatalogApplianceItem, resolveApplianceInput } from '../catalog/applianceCatalog';
import { V3LoadItem, ApplianceLoadPriority } from '../types';

export interface ParsedApplianceSentence {
  rawText: string;
  matchedAppliance?: CatalogApplianceItem;
  recognizedQuantity: number;
  recognizedHoursDaily?: number;
  recognizedPowerWatts?: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  detectedPriority: ApplianceLoadPriority;
  missingInformationPrompts: string[];
}

export interface NaturalLanguageLoadParseResult {
  parsedItems: V3LoadItem[];
  itemDetails: ParsedApplianceSentence[];
  unrecognizedClauses: string[];
  suggestions: string[];
  estimatedDailyEnergyKwh: number;
  missingDataWarnings: string[];
}

/**
 * Natural language parser for converting user descriptions (e.g. "I have 2 1.5hp acs running 8 hours and a double door fridge")
 * into structured V3LoadItem records.
 */
export function parseNaturalLanguageLoadDescription(input: string): NaturalLanguageLoadParseResult {
  if (!input || !input.trim()) {
    return {
      parsedItems: [],
      itemDetails: [],
      unrecognizedClauses: [],
      suggestions: ['Enter appliances, e.g.: "2 1.5hp ACs running 8 hours, 1 chest freezer, 10 LED bulbs"'],
      estimatedDailyEnergyKwh: 0,
      missingDataWarnings: ['No input text provided.'],
    };
  }

  // Split by common delimiters: comma, 'and', '+', newline, semicolon
  const clauses = input
    .split(/[,;\n+]|\band\b/i)
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  const parsedItems: V3LoadItem[] = [];
  const itemDetails: ParsedApplianceSentence[] = [];
  const unrecognizedClauses: string[] = [];
  const suggestions: string[] = [];
  const missingDataWarnings: string[] = [];

  for (const clause of clauses) {
    // 1. Extract Quantity (e.g. "2 ACs", "3 units of fridge")
    const qtyMatch = clause.match(/^(\d+)\s*(?:units?|pieces?|nos?|x)?\s*(.+)$/i) ||
                     clause.match(/(.+?)\s*x\s*(\d+)$/i) ||
                     clause.match(/(\d+)\s+(.+)$/i);

    let quantity = 1;
    let applianceText = clause;

    if (qtyMatch) {
      if (!isNaN(Number(qtyMatch[1]))) {
        quantity = Math.max(1, parseInt(qtyMatch[1], 10));
        applianceText = qtyMatch[2].trim();
      } else if (!isNaN(Number(qtyMatch[2]))) {
        quantity = Math.max(1, parseInt(qtyMatch[2], 10));
        applianceText = qtyMatch[1].trim();
      }
    }

    // 2. Extract Run Hours if specified (e.g. "running 8 hours", "8hrs daily", "24/7")
    let hoursDaily: number | undefined;
    if (clause.match(/24\/7|all\s*day|all\s*night/i)) {
      hoursDaily = 24;
    } else {
      const hoursMatch = clause.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)\b/i);
      if (hoursMatch) {
        hoursDaily = Math.min(24, Math.max(0.1, parseFloat(hoursMatch[1])));
      }
    }

    // 3. Clean search query for appliance matching
    let cleanSearchQuery = applianceText
      .replace(/\b(?:running|used\s+for|for|about|approx|approximate|daily|everyday)\b/gi, '')
      .replace(/\b\d+(?:\.\d+)?\s*(?:hours?|hrs?|h)\b/gi, '')
      .trim();

    let resolution = resolveApplianceInput(cleanSearchQuery);
    if (resolution.status === 'NOT_FOUND') {
      const singularized = cleanSearchQuery
        .replace(/\bacs\b/gi, 'ac')
        .replace(/\bair\s+conditioners\b/gi, 'air conditioner')
        .replace(/\bfridges\b/gi, 'fridge')
        .replace(/\bfreezers\b/gi, 'freezer')
        .replace(/\bpumps\b/gi, 'pump')
        .replace(/\bfans\b/gi, 'fan')
        .replace(/\bheaters\b/gi, 'heater')
        .replace(/\btvs\b/gi, 'tv')
        .replace(/s\b/gi, '')
        .trim();
      const singularRes = resolveApplianceInput(singularized);
      if (singularRes.status !== 'NOT_FOUND') {
        resolution = singularRes;
      }
    }
    const missingPrompts: string[] = [];


    if (resolution.status === 'EXACT_MATCH' && resolution.exactMatch) {
      const match = resolution.exactMatch;
      const effectiveHours = hoursDaily !== undefined ? hoursDaily : match.typicalHoursPerDay;
      const powerW = match.ratedPowerW;

      const v3Item: V3LoadItem = {
        name: `${match.name} (${match.variant})`,
        powerWatts: powerW,
        quantity,
        hoursPerDay: effectiveHours,
        priority: match.defaultPriority || 'IMPORTANT',
        surgeMultiplier: match.startupMultiplier,
        powerFactor: match.powerFactor,
        dutyCycle: match.dutyCycle,
        isDaytimeShiftable: match.isDaytimeShiftable,
      };

      if (hoursDaily === undefined) {
        missingPrompts.push(`Assumed typical runtime of ${match.typicalHoursPerDay} hrs/day for ${match.name}. Adjust if your usage differs.`);
      }

      parsedItems.push(v3Item);
      itemDetails.push({
        rawText: clause,
        matchedAppliance: match,
        recognizedQuantity: quantity,
        recognizedHoursDaily: effectiveHours,
        recognizedPowerWatts: powerW,
        confidence: 'HIGH',
        detectedPriority: match.defaultPriority || 'IMPORTANT',
        missingInformationPrompts: missingPrompts,
      });
    } else if (resolution.status === 'AMBIGUOUS_MATCH' && resolution.matches.length > 0) {
      const topPick = resolution.matches[0];
      const effectiveHours = hoursDaily !== undefined ? hoursDaily : topPick.typicalHoursPerDay;

      const v3Item: V3LoadItem = {
        name: `${topPick.name} (${topPick.variant})`,
        powerWatts: topPick.ratedPowerW,
        quantity,
        hoursPerDay: effectiveHours,
        priority: topPick.defaultPriority || 'IMPORTANT',
        surgeMultiplier: topPick.startupMultiplier,
        powerFactor: topPick.powerFactor,
        dutyCycle: topPick.dutyCycle,
        isDaytimeShiftable: topPick.isDaytimeShiftable,
      };

      suggestions.push(`Multiple variants match "${clause}". Selected "${topPick.variant}" (${topPick.ratedPowerW}W). Alternative options: ${resolution.matches.slice(1, 3).map((m) => m.variant).join(', ')}.`);

      parsedItems.push(v3Item);
      itemDetails.push({
        rawText: clause,
        matchedAppliance: topPick,
        recognizedQuantity: quantity,
        recognizedHoursDaily: effectiveHours,
        recognizedPowerWatts: topPick.ratedPowerW,
        confidence: 'MEDIUM',
        detectedPriority: topPick.defaultPriority || 'IMPORTANT',
        missingInformationPrompts: [`Verify if ${topPick.variant} matches your exact model.`],
      });
    } else {
      unrecognizedClauses.push(clause);
      missingDataWarnings.push(`Could not identify appliance in "${clause}". You can add it manually with wattage and hours.`);
    }
  }

  // Calculate preliminary estimated daily energy from parsed items
  const totalDailyKwh = parsedItems.reduce((acc, item) => {
    const duty = item.dutyCycle || 1.0;
    return acc + (item.powerWatts * item.quantity * item.hoursPerDay * duty) / 1000;
  }, 0);

  return {
    parsedItems,
    itemDetails,
    unrecognizedClauses,
    suggestions,
    estimatedDailyEnergyKwh: Number(totalDailyKwh.toFixed(2)),
    missingDataWarnings,
  };
}
