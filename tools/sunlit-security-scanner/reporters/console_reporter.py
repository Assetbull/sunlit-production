"""
Console Reporter for Sunlit Security Scanner
Displays clean, structured summary output to stdout with ANSI formatting.
"""

from typing import List, Dict, Any
from rules import Finding, Severity


class ConsoleReporter:
    RED = "\033[91m"
    YELLOW = "\033[93m"
    GREEN = "\033[92m"
    CYAN = "\033[96m"
    BOLD = "\033[1m"
    RESET = "\033[0m"

    def print_summary(self, findings: List[Finding], metadata: Dict[str, Any]):
        crit_count = sum(1 for f in findings if f.severity == Severity.P0_CRITICAL)
        high_count = sum(1 for f in findings if f.severity == Severity.P1_HIGH)
        med_count = sum(1 for f in findings if f.severity == Severity.P2_MEDIUM)
        low_count = sum(1 for f in findings if f.severity == Severity.P3_LOW)
        info_count = sum(1 for f in findings if f.severity == Severity.P4_INFORMATIONAL)

        gate_status = "BLOCKED" if (crit_count > 0 or high_count > 0) else "PASS"
        gate_color = self.RED if gate_status == "BLOCKED" else self.GREEN

        print("\n" + "=" * 70)
        print(f"{self.BOLD}SUNLIT SECURITY CODE ASSURANCE SCANNER{self.RESET}")
        print("=" * 70)
        print(f"Mode: {metadata.get('mode', 'full')} | Files Scanned: {metadata.get('files_scanned', 0)} | Time: {metadata.get('duration_seconds', 0.0):.2f}s")
        print("-" * 70)
        print(f"{self.BOLD}External Tools Status:{self.RESET}")
        for tool_name, status_dict in metadata.get("external_tools", {}).items():
            st = status_dict.get("status", "UNKNOWN")
            color = self.GREEN if st == "AVAILABLE" else (self.YELLOW if st == "NOT INSTALLED" else self.RED)
            print(f"  • {tool_name:20s}: {color}{st:15s}{self.RESET} ({status_dict.get('message', '')})")
        print("-" * 70)
        print(f"{self.BOLD}Findings Breakdown:{self.RESET}")
        print(f"  • P0 CRITICAL      : {self.RED if crit_count > 0 else self.GREEN}{crit_count}{self.RESET}")
        print(f"  • P1 HIGH          : {self.RED if high_count > 0 else self.GREEN}{high_count}{self.RESET}")
        print(f"  • P2 MEDIUM        : {self.YELLOW if med_count > 0 else self.GREEN}{med_count}{self.RESET}")
        print(f"  • P3 LOW           : {low_count}")
        print(f"  • P4 INFORMATIONAL : {info_count}")
        print(f"  • TOTAL FINDINGS   : {len(findings)}")
        print("-" * 70)
        print(f"{self.BOLD}SECURITY GATE VERDICT:{self.RESET} {gate_color}{self.BOLD}{gate_status}{self.RESET}")
        print("=" * 70 + "\n")
