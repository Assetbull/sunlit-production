"""
Markdown Reporter for Sunlit Security Scanner
Generates human-readable executive and detailed Markdown security reports.
"""

from typing import List, Dict, Any
from rules import Finding, Severity


class MarkdownReporter:
    def generate(self, findings: List[Finding], metadata: Dict[str, Any]) -> str:
        crit_count = sum(1 for f in findings if f.severity == Severity.P0_CRITICAL)
        high_count = sum(1 for f in findings if f.severity == Severity.P1_HIGH)
        med_count = sum(1 for f in findings if f.severity == Severity.P2_MEDIUM)
        low_count = sum(1 for f in findings if f.severity == Severity.P3_LOW)
        info_count = sum(1 for f in findings if f.severity == Severity.P4_INFORMATIONAL)

        gate_status = "BLOCKED" if (crit_count > 0 or high_count > 0) else "PASS"

        lines = [
            "# Sunlit Energy Security Assurance Scan Report",
            "",
            f"**Scan Date**: {metadata.get('scan_date', 'N/A')}  ",
            f"**Scan Mode**: `{metadata.get('mode', 'full')}`  ",
            f"**Files Scanned**: {metadata.get('files_scanned', 0)}  ",
            f"**Execution Duration**: {metadata.get('duration_seconds', 0.0):.2f}s  ",
            f"**Security Gate Verdict**: **{gate_status}**  ",
            "",
            "## 1. Executive Summary",
            "",
            "| Priority / Severity | Count | Gate Policy |",
            "| :--- | :--- | :--- |",
            f"| **P0 — Critical** | `{crit_count}` | HARD BLOCK |",
            f"| **P1 — High** | `{high_count}` | HARD BLOCK |",
            f"| **P2 — Medium** | `{med_count}` | CONDITIONAL |",
            f"| **P3 — Low** | `{low_count}` | MONITORED |",
            f"| **P4 — Informational** | `{info_count}` | INFORMATIONAL |",
            f"| **TOTAL FINDINGS** | **`{len(findings)}`** | |",
            "",
            "## 2. External Tools & Orchestration Status",
            "",
            "| Tool | Status | Details |",
            "| :--- | :--- | :--- |",
        ]

        for tool_name, tool_status in metadata.get("external_tools", {}).items():
            lines.append(f"| **{tool_name}** | `{tool_status.get('status', 'UNKNOWN')}` | {tool_status.get('message', '')} |")

        lines.extend([
            "",
            "## 3. Itemized Security Findings",
            "",
        ])

        if not findings:
            lines.append("*No security findings detected in target scope.*")
        else:
            for idx, f in enumerate(findings, start=1):
                lines.extend([
                    f"### {idx}. [{f.severity.value}] {f.finding_id}: {f.title}",
                    f"- **File**: `{f.file}:{f.line}`",
                    f"- **Category**: {f.category}",
                    f"- **Domain / Engine**: `{f.domain}` / `{f.engine}`",
                    f"- **Confidence**: `{f.confidence}`",
                    f"- **Auto-Fix Tier**: `{f.auto_fix_eligibility.value}`",
                    f"- **Description**: {f.description}",
                    f"- **Security Impact**: {f.security_impact}",
                    f"- **Evidence**: `{f.evidence}`",
                    f"- **Recommended Fix**: {f.recommended_fix}",
                    f"- **Status**: `{f.status.value}`",
                    "",
                ])

        lines.extend([
            "## 4. Residual Risk & Limitations Statement",
            "",
            "- **Tested**: AST patterns, secrets, auth/RBAC integrity, tenant isolation, SQL injection, frontend XSS, external npm dependencies.",
            "- **Not Tested**: Dynamic live penetration testing against staging/production cloud infrastructure.",
            "- **Limitations**: Static pattern matching cannot replace comprehensive end-to-end integration testing.",
            "",
            "*Report generated automatically by Sunlit Security Code Assurance System.*",
        ])

        return "\n".join(lines)
