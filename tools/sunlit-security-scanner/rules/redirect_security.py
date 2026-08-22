"""
Rule: Open Redirect & Navigation Security (SUNLIT-REDIR)
Detects unvalidated external redirects, protocol scheme injection, and open redirect vulnerabilities.
"""

import re
from typing import List
from . import BaseRule, Finding, Severity, AutoFixClass, infer_sunlit_domain_and_engine


class RedirectSecurityRule(BaseRule):
    rule_id = "SUNLIT-REDIR-001"
    name = "Open Redirect & URL Validation Assurance"
    category = "Redirect Security"
    default_severity = Severity.P1_HIGH

    def scan_file(self, file_path: str, content: str) -> List[Finding]:
        if any(skip in file_path for skip in ["node_modules", ".git", "tests/fixtures/known_safe"]):
            return []

        findings: List[Finding] = []
        domain, engine = infer_sunlit_domain_and_engine(file_path)
        lines = content.splitlines()

        for idx, line in enumerate(lines, start=1):
            # Check for redirect using direct query parameter without validation
            if re.search(r"NextResponse\.redirect\(\s*new\s+URL\(\s*(?:redirect|url|returnTo|targetUrl)\b", line):
                if "startsWith('/')" not in content and "isSunlitHost" not in content and "isValidRedirect" not in content:
                    findings.append(
                        Finding(
                            finding_id=f"SUNLIT-REDIR-{len(findings)+1:03d}",
                            title="Unvalidated Open Redirect via URL Parameter",
                            severity=Severity.P1_HIGH,
                            confidence="MEDIUM",
                            category=self.category,
                            domain=domain,
                            engine=engine,
                            file=file_path,
                            line=idx,
                            description="NextResponse.redirect directs user to an unvalidated URL parameter, allowing arbitrary external destinations.",
                            security_impact="Phishing attacks and credential harvesting via open redirect.",
                            evidence=line.strip(),
                            recommended_fix="Validate that redirect URL is a relative path starting with '/' and not '//' before redirecting.",
                            auto_fix_eligibility=AutoFixClass.CLASS_B,
                            regression_test_required=True,
                        )
                    )

        return findings
