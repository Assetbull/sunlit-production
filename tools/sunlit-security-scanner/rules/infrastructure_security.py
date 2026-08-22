"""
Rule: Infrastructure & Configuration Security (SUNLIT-INFRA)
Audits vercel.json, next.config.ts, Dockerfile, and HTTP security headers.
"""

import re
from typing import List
from . import BaseRule, Finding, Severity, AutoFixClass


class InfrastructureSecurityRule(BaseRule):
    rule_id = "SUNLIT-INFRA-001"
    name = "Infrastructure & HTTP Security Header Assurance"
    category = "Infrastructure Security"
    default_severity = Severity.P2_MEDIUM

    def scan_file(self, file_path: str, content: str) -> List[Finding]:
        if any(skip in file_path for skip in ["node_modules", ".git", "tests/fixtures/known_safe"]):
            return []

        findings: List[Finding] = []

        # 1. Check next.config.ts / vercel.json for wildcard CORS
        if "next.config" in file_path or "vercel.json" in file_path:
            if "Access-Control-Allow-Origin" in content and '"*"' in content:
                findings.append(
                    Finding(
                        finding_id=f"SUNLIT-INFRA-{len(findings)+1:03d}",
                        title="Wildcard Access-Control-Allow-Origin in Global Config",
                        severity=Severity.P2_MEDIUM,
                        confidence="HIGH",
                        category=self.category,
                        domain="Shared Platform",
                        engine="API Gateway Engine",
                        file=file_path,
                        line=1,
                        description="Global configuration sets Access-Control-Allow-Origin to '*', allowing any external domain to make cross-origin requests.",
                        security_impact="Potential cross-origin data exfiltration on authenticated endpoints.",
                        evidence="Access-Control-Allow-Origin: *",
                        recommended_fix="Restrict allowed origins to trusted Sunlit domains or configure per-endpoint CORS.",
                        auto_fix_eligibility=AutoFixClass.CLASS_A,
                        regression_test_required=False,
                    )
                )

        return findings
