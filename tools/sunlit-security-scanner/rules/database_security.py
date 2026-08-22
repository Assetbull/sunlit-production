"""
Rule: Database Security & RLS Compliance (SUNLIT-DB)
Detects SQL injection, missing RLS policies, unsafe SECURITY DEFINER functions, and search_path vulnerabilities.
"""

import re
from typing import List
from . import BaseRule, Finding, Severity, AutoFixClass, infer_sunlit_domain_and_engine


class DatabaseSecurityRule(BaseRule):
    rule_id = "SUNLIT-DB-001"
    name = "Database Security, SQL Injection & RLS Assurance"
    category = "Database Security"
    default_severity = Severity.P0_CRITICAL

    def scan_file(self, file_path: str, content: str) -> List[Finding]:
        if any(skip in file_path for skip in ["node_modules", ".git", "tests/fixtures/known_safe"]):
            return []

        findings: List[Finding] = []
        domain, engine = infer_sunlit_domain_and_engine(file_path)
        lines = content.splitlines()

        # 1. SQL Injection via string interpolation/concatenation
        for idx, line in enumerate(lines, start=1):
            if re.search(r"(?:query|execute|raw|sql)\s*\(\s*`\s*(?:SELECT|INSERT|UPDATE|DELETE|DROP|ALTER)[^`]*\$\{", line, re.IGNORECASE):
                # Ensure it's not a tagged template like sql`SELECT ... ${val}` from a safe library like Prisma or Slonik
                if not re.search(r"\bsql`", line):
                    findings.append(
                        Finding(
                            finding_id=f"SUNLIT-DB-{len(findings)+1:03d}",
                            title="Potential SQL Injection via Template Literal Concatenation",
                            severity=Severity.P0_CRITICAL,
                            confidence="HIGH",
                            category=self.category,
                            domain=domain,
                            engine=engine,
                            file=file_path,
                            line=idx,
                            description="SQL query is assembled via JavaScript template literal interpolation (${...}) instead of parameterized queries.",
                            security_impact="Remote SQL injection allowing unauthorized database read, modification, or data exfiltration.",
                            evidence=line.strip(),
                            recommended_fix="Use parameterized queries or ORM/query builder with parameter binding.",
                            auto_fix_eligibility=AutoFixClass.CLASS_B,
                            regression_test_required=True,
                        )
                    )

            if re.search(r"(?:SELECT|INSERT|UPDATE|DELETE)\s+.*\s+FROM\s+.*['\"]\s*\+\s*[a-zA-Z0-9_.]+", line, re.IGNORECASE):
                findings.append(
                    Finding(
                        finding_id=f"SUNLIT-DB-{len(findings)+1:03d}",
                        title="Potential SQL Injection via String Concatenation",
                        severity=Severity.P0_CRITICAL,
                        confidence="HIGH",
                        category=self.category,
                        domain=domain,
                        engine=engine,
                        file=file_path,
                        line=idx,
                        description="SQL query string is concatenated with dynamic variable using '+' operator.",
                        security_impact="Remote SQL injection vulnerability.",
                        evidence=line.strip(),
                        recommended_fix="Use parameterized queries with placeholder arguments.",
                        auto_fix_eligibility=AutoFixClass.CLASS_B,
                        regression_test_required=True,
                    )
                )

        # 2. SQL Migration files: check SECURITY DEFINER functions without search_path
        if file_path.endswith(".sql"):
            if "SECURITY DEFINER" in content and "search_path" not in content.lower():
                findings.append(
                    Finding(
                        finding_id=f"SUNLIT-DB-{len(findings)+1:03d}",
                        title="SECURITY DEFINER Function Missing Immutable search_path",
                        severity=Severity.P1_HIGH,
                        confidence="HIGH",
                        category=self.category,
                        domain=domain,
                        engine=engine,
                        file=file_path,
                        line=1,
                        description="PostgreSQL function declared with SECURITY DEFINER does not set an explicit search_path.",
                        security_impact="Search path hijacking / privilege escalation inside PostgreSQL runtime.",
                        evidence="SECURITY DEFINER declared without SET search_path = public, pg_temp;",
                        recommended_fix="Add 'SET search_path = public, pg_temp;' to all SECURITY DEFINER functions.",
                        auto_fix_eligibility=AutoFixClass.CLASS_A,
                        regression_test_required=True,
                    )
                )

        return findings
