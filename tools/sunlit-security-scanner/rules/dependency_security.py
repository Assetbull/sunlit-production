"""
Rule: Dependency & Supply Chain Security (SUNLIT-DEP)
Audits package.json / package-lock.json and integrates npm audit output.
"""

import json
import os
import subprocess
from typing import List, Dict, Any
from . import BaseRule, Finding, Severity, AutoFixClass


class DependencySecurityRule(BaseRule):
    rule_id = "SUNLIT-DEP-001"
    name = "Dependency & Software Supply Chain Assurance"
    category = "Dependency Security"
    default_severity = Severity.P1_HIGH

    def scan_dependencies(self, project_dir: str) -> List[Finding]:
        findings: List[Finding] = []
        package_json_path = os.path.join(project_dir, "package.json")
        if not os.path.exists(package_json_path):
            return findings

        # Run npm audit --json
        try:
            res = subprocess.run(
                ["npm", "audit", "--json"],
                cwd=project_dir,
                capture_output=True,
                text=True,
                timeout=30,
            )
            raw_json = res.stdout or res.stderr
            if raw_json and raw_json.strip().startswith("{"):
                audit_data = json.loads(raw_json)
                vulnerabilities = audit_data.get("vulnerabilities", {})

                for pkg_name, details in vulnerabilities.items():
                    sev_str = str(details.get("severity", "")).lower()
                    if sev_str == "critical":
                        sev = Severity.P0_CRITICAL
                    elif sev_str == "high":
                        sev = Severity.P1_HIGH
                    elif sev_str == "moderate":
                        sev = Severity.P2_MEDIUM
                    else:
                        sev = Severity.P3_LOW

                    via_list = details.get("via", [])
                    advisories = [v for v in via_list if isinstance(v, dict)]
                    adv_title = advisories[0].get("title", f"Vulnerable dependency {pkg_name}") if advisories else f"Vulnerable dependency {pkg_name}"
                    adv_url = advisories[0].get("url", "https://npmjs.com/advisories") if advisories else ""

                    findings.append(
                        Finding(
                            finding_id=f"SUNLIT-DEP-{len(findings)+1:03d}",
                            title=f"Vulnerable Package: {pkg_name} ({sev_str.upper()})",
                            severity=sev,
                            confidence="HIGH",
                            category=self.category,
                            domain="Shared Platform",
                            engine="Supply Chain Engine",
                            file=os.path.relpath(package_json_path, os.getcwd()),
                            line=1,
                            description=f"Package '{pkg_name}' has a known vulnerability: {adv_title}.",
                            security_impact=f"Potential exploit via vulnerable third-party package dependency. Advisory: {adv_url}",
                            evidence=f"Dependency: {pkg_name} | Range: {details.get('range', '')}",
                            recommended_fix=f"Run 'npm audit fix' or upgrade '{pkg_name}' to the latest secure version.",
                            auto_fix_eligibility=AutoFixClass.CLASS_A if details.get("fixAvailable") else AutoFixClass.CLASS_B,
                            regression_test_required=False,
                        )
                    )
        except Exception:
            # npm audit not runnable or timed out
            pass

        return findings

    def scan_file(self, file_path: str, content: str) -> List[Finding]:
        # Scanned via project root hook
        return []
