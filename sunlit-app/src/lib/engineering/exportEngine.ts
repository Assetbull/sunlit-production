/**
 * Engineering Report Export Engine
 * Sunlit Enterprise Engineering Platform
 * Engine Version 3.0.0
 *
 * Supports JSON, CSV, and Markdown structured exports of single tool reports
 * and unified end-to-end solar engineering pipeline reports.
 */

import { EngineeringReport } from './reportingEngine';
import { AccessTier } from './types';
import { UnifiedSolarSystemResult } from './core/calculationPipeline';

export type ExportFormat = 'JSON' | 'CSV' | 'MARKDOWN';

export function exportReportData(report: EngineeringReport, format: ExportFormat, tier: AccessTier = 'PUBLIC'): string {
  if (tier === 'PUBLIC' && format !== 'JSON') {
    return `Access Restricted. Please register to export ${format} engineering reports.`;
  }

  switch (format) {
    case 'JSON':
      return JSON.stringify(report, null, 2);

    case 'CSV': {
      const rows: string[] = ['Parameter,Value'];
      Object.entries(report.summary).forEach(([k, v]) => {
        rows.push(`"${k}","${v}"`);
      });
      return rows.join('\n');
    }

    case 'MARKDOWN': {
      const lines: string[] = [];
      lines.push(`# ${report.title}`);
      lines.push(`**Generated At**: ${report.generatedAt}`);
      lines.push(`**Engineering Confidence**: ${report.confidence}`);
      lines.push(`\n## Engineering Results Summary`);
      Object.entries(report.summary).forEach(([k, v]) => {
        lines.push(`- **${k}**: ${v}`);
      });

      if (report.equipmentBOM.length > 0) {
        lines.push(`\n## Recommended Bill of Materials (BOM)`);
        report.equipmentBOM.forEach((item) => {
          lines.push(`- **${item.name}** (Qty: ${item.recommendedQuantity}) — ${item.reason}`);
        });
      }

      return lines.join('\n');
    }

    default:
      return JSON.stringify(report, null, 2);
  }
}

export function exportUnifiedPipelineReport(
  unified: UnifiedSolarSystemResult,
  format: ExportFormat = 'MARKDOWN'
): string {
  const rec = unified.recommendations.recommended;

  if (format === 'JSON') {
    return JSON.stringify(unified, null, 2);
  }

  if (format === 'CSV') {
    const rows: string[] = [
      'Metric,Recommended Value,Unit',
      `Solar Array Capacity,${rec.solarCapacityKwp},kWp`,
      `Panel Count,${rec.panelCount},units`,
      `Battery Storage,${rec.batteryNominalKwh},kWh`,
      `Inverter Rating,${rec.inverterRatingKva},kVA`,
      `Daily Solar Generation,${rec.expectedDailyGenerationKwh.toFixed(1)},kWh/day`,
      `Night Battery Autonomy,${rec.autonomyHours.toFixed(1)},hours`,
      `Estimated Turnkey CAPEX,${rec.estimatedCAPEXNaira},NGN`,
      `Annual Financial Savings,${unified.summary.estimatedAnnualSavingsNaira},NGN`,
      `Simple Payback Period,${unified.summary.estimatedSimplePaybackYears},years`,
      `Confidence Level,${unified.confidence.level},rating`,
      `Confidence Score,${unified.confidence.score},out of 100`,
    ];
    return rows.join('\n');
  }

  // MARKDOWN format
  const lines: string[] = [
    '# SUNLIT SOLAR SYSTEM PRELIMINARY ENGINEERING REPORT',
    `**Calculated At**: ${unified.versionBlock.calculatedAt}`,
    `**Engine Version**: ${unified.versionBlock.calculationEngineVersion} | **Standards Profile**: ${unified.versionBlock.standardsProfileVersion}`,
    `**Certification Level**: PRELIMINARY_ESTIMATE (Site survey required by certified installer)`,
    `**Confidence Assessment**: ${unified.confidence.level} (${unified.confidence.score}/100) — ${unified.confidence.reasoning}`,
    '',
    '## 1. Executive Summary',
    `- **Recommended Solar Array**: ${rec.solarCapacityKwp} kWp (${rec.panelCount}× ${rec.panelWattageW}W Tier-1 Modules)`,
    `- **Recommended Battery Storage**: ${rec.batteryNominalKwh} kWh LiFePO4 (${rec.batteryUsableKwh} kWh usable @ 80% DoD)`,
    `- **Recommended Inverter Rating**: ${rec.inverterRatingKva} kVA Pure Sine Wave Hybrid (${rec.systemVoltage}V DC)`,
    `- **Expected Daily Generation**: ~${rec.expectedDailyGenerationKwh.toFixed(1)} kWh/day`,
    `- **Battery Night Autonomy**: ~${rec.autonomyHours.toFixed(1)} hours of continuous backup`,
    `- **Estimated Turnkey Investment**: ~₦${rec.estimatedCAPEXNaira.toLocaleString('en-NG')} (${rec.caution})`,
    `- **Estimated Annual Savings**: ~₦${unified.summary.estimatedAnnualSavingsNaira.toLocaleString('en-NG')}/year`,
    `- **Estimated Payback Period**: ~${unified.summary.estimatedSimplePaybackYears.toFixed(1)} years`,
    '',
    '## 2. Multi-Tier Recommendation Comparison',
    '| Specification | Baseline | Recommended | Upgrade |',
    '| :--- | :--- | :--- | :--- |',
    `| **Solar Capacity** | ${unified.recommendations.baseline.solarCapacityKwp} kWp | **${rec.solarCapacityKwp} kWp** | ${unified.recommendations.upgrade.solarCapacityKwp} kWp |`,
    `| **Battery Capacity** | ${unified.recommendations.baseline.batteryNominalKwh} kWh | **${rec.batteryNominalKwh} kWh** | ${unified.recommendations.upgrade.batteryNominalKwh} kWh |`,
    `| **Inverter Rating** | ${unified.recommendations.baseline.inverterRatingKva} kVA | **${rec.inverterRatingKva} kVA** | ${unified.recommendations.upgrade.inverterRatingKva} kVA |`,
    `| **Load Coverage** | ${unified.recommendations.baseline.loadCoveragePercent}% | **${rec.loadCoveragePercent}%** | ${unified.recommendations.upgrade.loadCoveragePercent}% |`,
    `| **Night Autonomy** | ${unified.recommendations.baseline.autonomyHours} hrs | **${rec.autonomyHours} hrs** | ${unified.recommendations.upgrade.autonomyHours} hrs |`,
    `| **Estimated CAPEX** | ₦${unified.recommendations.baseline.estimatedCAPEXNaira.toLocaleString('en-NG')} | **₦${rec.estimatedCAPEXNaira.toLocaleString('en-NG')}** | ₦${unified.recommendations.upgrade.estimatedCAPEXNaira.toLocaleString('en-NG')} |`,
    '',
    '## 3. Physical & Electrical Constraints Validation',
    `- **Cross-Calculator Integrity**: ${unified.crossValidation.isValid ? 'PASSED — All physical equations balanced' : 'ATTENTION REQUIRED'}`,
  ];

  if (unified.crossValidation.findings.length > 0) {
    unified.crossValidation.findings.forEach((f) => {
      lines.push(`- **[${f.severity}] ${f.category}**: ${f.message} (Action: ${f.recommendedAction})`);
    });
  } else {
    lines.push('- No electrical overvoltage, undersizing, or excessive voltage drop detected.');
  }

  lines.push('');
  lines.push('---');
  lines.push('*Disclaimer: This report is a preliminary engineering estimate generated by the Sunlit Enterprise Engineering Platform based on user inputs and regional irradiance benchmarks. It does not constitute a final engineering design or a binding installer quote. A verified installer site survey is required prior to contract execution.*');

  return lines.join('\n');
}
