"""
Rule: Multi-Tenant Isolation & Anti-IDOR (SUNLIT-TENANT)
Enforces organization_id scoping, IDOR/BOLA prevention, and cross-tenant mutation denial.
"""

import re
from typing import List
from . import BaseRule, Finding, Severity, AutoFixClass, infer_sunlit_domain_and_engine


class TenantIsolationRule(BaseRule):
    rule_id = "SUNLIT-TENANT-001"
    name = "Multi-Tenant Isolation & IDOR/BOLA Prevention"
    category = "Tenant Isolation"
    default_severity = Severity.P1_HIGH

    MULTI_TENANT_RESOURCES = [
        "bids",
        "projects",
        "contracts",
        "milestones",
        "crew_jobs",
        "invoices",
        "epc_funding",
        "rfqs",
    ]

    def scan_file(self, file_path: str, content: str) -> List[Finding]:
        if any(skip in file_path for skip in ["node_modules", ".git", "tests/fixtures/known_safe"]):
            return []

        findings: List[Finding] = []
        domain, engine = infer_sunlit_domain_and_engine(file_path)
        lines = content.splitlines()

        # Check API routes and data services for un-scoped IDOR mutations/queries
        is_service_or_route = "/api/" in file_path or "/services/" in file_path or "/data-service" in file_path

        if is_service_or_route:
            for idx, line in enumerate(lines, start=1):
                # Pattern: Direct update/delete by ID without checking organization_id or session ownership
                match = re.search(r"\.(?:update|delete)\(['\"]([a-zA-Z0-9_]+)['\"]\s*,\s*\{\s*id\s*:\s*([a-zA-Z0-9_]+)\s*\}", line)
                if match:
                    table_name = match.group(1)
                    has_owner_check = any(term in content for term in ["owner_id", "creator_id", "organization_id", "guardCtx.userId"])
                    if table_name in self.MULTI_TENANT_RESOURCES and "organization_id" not in line and "user_id" not in line and not has_owner_check:
                        findings.append(
                            Finding(
                                finding_id=f"SUNLIT-TENANT-{len(findings)+1:03d}",
                                title=f"Potential IDOR/BOLA: Unscoped Mutation on Multi-Tenant Table '{table_name}'",
                                severity=Severity.P1_HIGH,
                                confidence="MEDIUM",
                                category=self.category,
                                domain=domain,
                                engine=engine,
                                file=file_path,
                                line=idx,
                                description=f"Database operation on multi-tenant table '{table_name}' filters only by entity ID without verifying organization_id or actor ownership.",
                                security_impact="Cross-tenant modification or deletion; an attacker from Organization A can mutate resources belonging to Organization B.",
                                evidence=line.strip(),
                                recommended_fix=f"Include organization_id or verified owner check: where: {{ id, organization_id: session.organization_id }}.",
                                auto_fix_eligibility=AutoFixClass.CLASS_B,
                                regression_test_required=True,
                            )
                        )

        return findings
