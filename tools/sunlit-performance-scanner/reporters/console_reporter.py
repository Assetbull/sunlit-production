"""
Console Reporter for Sunlit Performance Scanner
"""

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from models import PerformanceScanResult, PerformanceSeverity, GateVerdict


class Colors:
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    RED = "\033[91m"
    BLUE = "\033[94m"
    CYAN = "\033[96m"
    BOLD = "\033[1m"
    RESET = "\033[0m"


def render_console_report(result: PerformanceScanResult) -> str:
    lines = []
    lines.append(f"\n{Colors.BOLD}{Colors.CYAN}{'=' * 70}{Colors.RESET}")
    lines.append(f"{Colors.BOLD}{Colors.CYAN}SUNLIT PERFORMANCE ENGINEERING SCANNER & GATE{Colors.RESET}")
    lines.append(f"{Colors.BOLD}{Colors.CYAN}{'=' * 70}{Colors.RESET}")
    lines.append(f"Mode: {result.mode} | Files Scanned: {result.files_scanned} | Time: {result.duration_seconds:.2f}s")
    lines.append(f"{'-' * 70}")

    crit_count = len(result.get_findings_by_severity(PerformanceSeverity.CRITICAL))
    high_count = len(result.get_findings_by_severity(PerformanceSeverity.HIGH))
    med_count = len(result.get_findings_by_severity(PerformanceSeverity.MEDIUM))
    low_count = len(result.get_findings_by_severity(PerformanceSeverity.LOW))

    lines.append(f"Findings Breakdown:")
    lines.append(f"  • {Colors.RED}P0 CRITICAL      : {crit_count}{Colors.RESET}")
    lines.append(f"  • {Colors.RED}P1 HIGH          : {high_count}{Colors.RESET}")
    lines.append(f"  • {Colors.YELLOW}P2 MEDIUM        : {med_count}{Colors.RESET}")
    lines.append(f"  • {Colors.BLUE}P3 LOW           : {low_count}{Colors.RESET}")
    lines.append(f"  • TOTAL FINDINGS   : {len(result.findings)}")
    lines.append(f"{'-' * 70}")

    if result.findings and result.mode != "gate":
        lines.append(f"{Colors.BOLD}Performance Diagnostic Findings:{Colors.RESET}")
        for finding in result.findings:
            sev_color = Colors.RED if "CRITICAL" in finding.severity.value or "HIGH" in finding.severity.value else (Colors.YELLOW if "MEDIUM" in finding.severity.value else Colors.BLUE)
            lines.append(f"\n  [{sev_color}{finding.severity.name}{Colors.RESET}] {finding.rule_id} — {finding.rule_name}")
            lines.append(f"    File: {finding.file_path}:{finding.line_number}")
            lines.append(f"    Issue: {finding.message}")
            if finding.code_snippet:
                lines.append(f"    Code:  {finding.code_snippet}")
            lines.append(f"    Fix:   {finding.remediation}")
        lines.append(f"{'-' * 70}")

    if result.verdict == GateVerdict.PASS:
        verdict_color = Colors.GREEN
        status_text = "PASS"
    elif result.verdict == GateVerdict.WARNING:
        verdict_color = Colors.YELLOW
        status_text = "WARNING"
    else:
        verdict_color = Colors.RED
        status_text = "BLOCKED"

    lines.append(f"PERFORMANCE GATE VERDICT: {verdict_color}{Colors.BOLD}{status_text}{Colors.RESET}")
    lines.append(f"{Colors.BOLD}{Colors.CYAN}{'=' * 70}{Colors.RESET}\n")

    return "\n".join(lines)
