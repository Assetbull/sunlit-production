import { EngineeringReport } from './reportingEngine';
import { AccessTier } from './types';

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
