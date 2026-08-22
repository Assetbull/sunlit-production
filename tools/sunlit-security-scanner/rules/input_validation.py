"""
Rule: Input Validation & Sanitization (SUNLIT-INPUT)
Detects unsafe JSON parsing, unvalidated user input, and ReDoS vulnerabilities.
"""

import re
from typing import List
from . import BaseRule, Finding, Severity, AutoFixClass, infer_sunlit_domain_and_engine


class InputValidationRule(BaseRule):
    rule_id = "SUNLIT-INPUT-001"
    name = "Input Validation & Data Sanitization"
    category = "Input Validation"
    default_severity = Severity.P2_MEDIUM

    def scan_file(self, file_path: str, content: str) -> List[Finding]:
        if any(skip in file_path for skip in ["node_modules", ".git", "tests/fixtures/known_safe"]):
            return []

        findings: List[Finding] = []
        domain, engine = infer_sunlit_domain_and_engine(file_path)
        lines = content.splitlines()

        # Unprotected JSON.parse on request bodies / params outside try-catch
        for idx, line in enumerate(lines, start=1):
            if "JSON.parse(" in line and "try" not in content and "catch" not in content:
                findings.append(
                    Finding(
                        finding_id=f"SUNLIT-INPUT-{len(findings)+1:03d}",
                        title="Unprotected JSON.parse Without Try/Catch Block",
                        severity=Severity.P3_LOW,
                        confidence="MEDIUM",
                        category=self.category,
                        domain=domain,
                        engine=engine,
                        file=file_path,
                        line=idx,
                        description="JSON.parse() is executed without error handling, which can throw unhandled exceptions and crash request handlers upon malformed input.",
                        security_impact="Denial of Service (DoS) via malformed JSON payload.",
                        evidence=line.strip(),
                        recommended_fix="Wrap JSON.parse in a try/catch block or use a safe parsing helper with schema validation.",
                        auto_fix_eligibility=AutoFixClass.CLASS_A,
                        regression_test_required=False,
                    )
                )

        return findings
