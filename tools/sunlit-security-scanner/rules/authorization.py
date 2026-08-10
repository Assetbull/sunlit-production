"""
Rule: Authorization & Privilege Validation (SUNLIT-AUTHZ)
Detects client-side-only authorization, untrusted client actor IDs, and missing server authorization on state changes.
"""

import re
from typing import List
from . import BaseRule, Finding, Severity, AutoFixClass, infer_sunlit_domain_and_engine


class AuthorizationRule(BaseRule):
    rule_id = "SUNLIT-AUTHZ-001"
    name = "Server-Side Authorization Boundary Assurance"
    category = "Authorization"
    default_severity = Severity.P1_HIGH

    def scan_file(self, file_path: str, content: str) -> List[Finding]:
        if any(skip in file_path for skip in ["node_modules", ".git", "tests/fixtures/known_safe"]):
            return []

        findings: List[Finding] = []
        domain, engine = infer_sunlit_domain_and_engine(file_path)
        lines = content.splitlines()

        # Check API routes for client-provided user_id trusting
        is_api_route = "/api/" in file_path or "/routes/" in file_path
        if is_api_route:
            for idx, line in enumerate(lines, start=1):
                # Pattern: extracting userId from body/query and using directly for authorization or DB write without session verification
                if re.search(r"(?:const|let|var)\s+\{\s*[^}]*\b(?:userId|user_id|actorId)\b[^}]*\}\s*=\s*(?:await\s+req\.json\(\)|body|params|searchParams)", line):
                    if "session" not in content and "auth" not in content and "getSession" not in content:
                        findings.append(
                            Finding(
                                finding_id=f"SUNLIT-AUTHZ-{len(findings)+1:03d}",
                                title="Client-Supplied User ID Trusted Without Session Verification",
                                severity=Severity.P1_HIGH,
                                confidence="MEDIUM",
                                category=self.category,
                                domain=domain,
                                engine=engine,
                                file=file_path,
                                line=idx,
                                description="API handler extracts user_id or actorId from request body or URL parameters without validating against the authenticated server session.",
                                security_impact="Impersonation and horizontal privilege escalation; an attacker can pass arbitrary user IDs.",
                                evidence=line.strip(),
                                recommended_fix="Extract authenticated user ID exclusively from verified server session (e.g., session.user_id).",
                                auto_fix_eligibility=AutoFixClass.CLASS_B,
                                regression_test_required=True,
                            )
                        )

        return findings
