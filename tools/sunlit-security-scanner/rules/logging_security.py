"""
Rule: Logging & Sensitive Data Redaction (SUNLIT-LOG)
Detects logging of passwords, tokens, full credit cards, and authorization headers in plaintext console logs.
"""

import re
from typing import List
from . import BaseRule, Finding, Severity, AutoFixClass, infer_sunlit_domain_and_engine


class LoggingSecurityRule(BaseRule):
    rule_id = "SUNLIT-LOG-001"
    name = "Logging Security & Sensitive Data Leakage Prevention"
    category = "Logging & Observability"
    default_severity = Severity.P2_MEDIUM

    def scan_file(self, file_path: str, content: str) -> List[Finding]:
        if any(skip in file_path for skip in ["node_modules", ".git", "tests/fixtures/known_safe"]):
            return []

        findings: List[Finding] = []
        domain, engine = infer_sunlit_domain_and_engine(file_path)
        lines = content.splitlines()

        for idx, line in enumerate(lines, start=1):
            # Check for console.log logging sensitive fields
            if re.search(r"console\.(?:log|debug|info|warn|error)\([^)]*(?:password|token|secret|authorization|apiKey|creditCard)", line, re.IGNORECASE):
                # Ensure it's not just a message string like console.log("Password reset email sent")
                if not re.search(r"console\.[a-z]+\(['\"][^'\"]*['\"]\)", line):
                    findings.append(
                        Finding(
                            finding_id=f"SUNLIT-LOG-{len(findings)+1:03d}",
                            title="Sensitive Variable Logged to Standard Output",
                            severity=Severity.P2_MEDIUM,
                            confidence="MEDIUM",
                            category=self.category,
                            domain=domain,
                            engine=engine,
                            file=file_path,
                            line=idx,
                            description="Sensitive parameter (password, token, secret, or authorization header) is logged to console.",
                            security_impact="Credentials and tokens may be exposed in log aggregators, monitoring services, and terminal history.",
                            evidence=line.strip(),
                            recommended_fix="Redact sensitive properties before logging or remove console statements.",
                            auto_fix_eligibility=AutoFixClass.CLASS_A,
                            regression_test_required=False,
                        )
                    )

        return findings
