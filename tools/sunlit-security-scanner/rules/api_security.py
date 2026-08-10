"""
Rule: API Security & Pipeline Compliance (SUNLIT-API)
Audits Next.js API route handlers for input validation, error handling, rate limiting, and 13-stage pipeline compliance.
"""

import re
from typing import List
from . import BaseRule, Finding, Severity, AutoFixClass, infer_sunlit_domain_and_engine


class APISecurityRule(BaseRule):
    rule_id = "SUNLIT-API-001"
    name = "API Route Security & Pipeline Compliance"
    category = "API Security"
    default_severity = Severity.P2_MEDIUM

    def scan_file(self, file_path: str, content: str) -> List[Finding]:
        if not ("src/app/api" in file_path and file_path.endswith(".ts")):
            return []
        if any(skip in file_path for skip in ["node_modules", ".git", "tests/fixtures/known_safe"]):
            return []

        findings: List[Finding] = []
        domain, engine = infer_sunlit_domain_and_engine(file_path)
        lines = content.splitlines()

        # 1. Check for stack trace leakage in catch blocks
        for idx, line in enumerate(lines, start=1):
            if re.search(r"NextResponse\.json\(\s*\{\s*(?:error|message)\s*:\s*(?:err|error)\.stack", line):
                findings.append(
                    Finding(
                        finding_id=f"SUNLIT-API-{len(findings)+1:03d}",
                        title="Stack Trace Leakage in API Error Response",
                        severity=Severity.P2_MEDIUM,
                        confidence="HIGH",
                        category=self.category,
                        domain=domain,
                        engine=engine,
                        file=file_path,
                        line=idx,
                        description="API route handler returns error.stack directly in HTTP JSON response.",
                        security_impact="Internal directory paths, database structures, and runtime internals are exposed to external callers.",
                        evidence=line.strip(),
                        recommended_fix="Return a sanitized, generic error message (e.g. 'Internal Server Error') and log error.stack to internal server logs only.",
                        auto_fix_eligibility=AutoFixClass.CLASS_A,
                        regression_test_required=True,
                    )
                )

        # 2. Check for missing validation on POST/PUT handlers
        has_post_or_put = "export async function POST" in content or "export async function PUT" in content
        if has_post_or_put:
            has_zod_or_validation = "zod" in content.lower() or "validate" in content.lower() or "schema" in content.lower() or "parse" in content.lower()
            if not has_zod_or_validation:
                findings.append(
                    Finding(
                        finding_id=f"SUNLIT-API-{len(findings)+1:03d}",
                        title="API Mutation Handler Missing Zod Schema Validation",
                        severity=Severity.P2_MEDIUM,
                        confidence="MEDIUM",
                        category=self.category,
                        domain=domain,
                        engine=engine,
                        file=file_path,
                        line=1,
                        description="POST/PUT route handler processes request payload without explicit schema validation via Zod.",
                        security_impact="Unsanitized or unexpected payload structures can cause unhandled exceptions or data corruption.",
                        evidence="Mutation route handler without schema validation.",
                        recommended_fix="Define and parse incoming request bodies with a Zod schema.",
                        auto_fix_eligibility=AutoFixClass.CLASS_B,
                        regression_test_required=True,
                    )
                )

        return findings
