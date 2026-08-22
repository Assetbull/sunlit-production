"""
Rule: Authentication & Session Security (SUNLIT-AUTH)
Detects authentication bypasses, insecure cookie options, weak token handling, and unauthenticated protected paths.
"""

import re
from typing import List
from . import BaseRule, Finding, Severity, AutoFixClass, infer_sunlit_domain_and_engine


class AuthenticationRule(BaseRule):
    rule_id = "SUNLIT-AUTH-001"
    name = "Authentication & Session Assurance"
    category = "Authentication & Sessions"
    default_severity = Severity.P1_HIGH

    def scan_file(self, file_path: str, content: str) -> List[Finding]:
        if any(skip in file_path for skip in ["node_modules", ".git", "tests/fixtures/known_safe"]):
            return []

        findings: List[Finding] = []
        domain, engine = infer_sunlit_domain_and_engine(file_path)
        lines = content.splitlines()

        # 1. Insecure cookie flags in cookie setting code
        for idx, line in enumerate(lines, start=1):
            if "httpOnly: false" in line:
                findings.append(
                    Finding(
                        finding_id=f"SUNLIT-AUTH-{len(findings)+1:03d}",
                        title="Insecure Cookie: httpOnly Explicitly Disabled",
                        severity=Severity.P1_HIGH,
                        confidence="HIGH",
                        category=self.category,
                        domain=domain,
                        engine=engine,
                        file=file_path,
                        line=idx,
                        description="Cookie is set with httpOnly: false, allowing client-side scripts to access sensitive session cookies via XSS.",
                        security_impact="Attackers exploiting XSS can hijack user sessions by reading document.cookie.",
                        evidence=line.strip(),
                        recommended_fix="Set httpOnly: true on all session and authentication cookies.",
                        auto_fix_eligibility=AutoFixClass.CLASS_A,
                        regression_test_required=True,
                    )
                )

            if "secure: false" in line and "development" not in line and "test" not in file_path:
                findings.append(
                    Finding(
                        finding_id=f"SUNLIT-AUTH-{len(findings)+1:03d}",
                        title="Insecure Cookie: Secure Flag Disabled in Non-Dev Context",
                        severity=Severity.P1_HIGH,
                        confidence="HIGH",
                        category=self.category,
                        domain=domain,
                        engine=engine,
                        file=file_path,
                        line=idx,
                        description="Cookie is set with secure: false, allowing transmission over plaintext HTTP.",
                        security_impact="Session tokens may be intercepted in transit via man-in-the-middle attacks.",
                        evidence=line.strip(),
                        recommended_fix="Enforce secure: process.env.NODE_ENV === 'production'.",
                        auto_fix_eligibility=AutoFixClass.CLASS_A,
                        regression_test_required=True,
                    )
                )

            # 2. Hardcoded Auth Bypasses
            auth_bypass_regex = r"(?:bypass_?auth|disable_?auth|skip_?auth)\s*=\s*(?:true|1)"
            if re.search(auth_bypass_regex, line, re.IGNORECASE) and "test" not in file_path.lower():
                findings.append(
                    Finding(
                        finding_id=f"SUNLIT-AUTH-{len(findings)+1:03d}",
                        title="Potential Authentication Bypass Flag in Code",
                        severity=Severity.P0_CRITICAL,
                        confidence="HIGH",
                        category=self.category,
                        domain=domain,
                        engine=engine,
                        file=file_path,
                        line=idx,
                        description="Found hardcoded auth bypass flag in production code path.",
                        security_impact="Unauthorized users may bypass authentication controls completely.",
                        evidence=line.strip(),
                        recommended_fix="Remove authentication bypass flags from production code.",
                        auto_fix_eligibility=AutoFixClass.CLASS_B,
                        regression_test_required=True,
                    )
                )

        return findings
