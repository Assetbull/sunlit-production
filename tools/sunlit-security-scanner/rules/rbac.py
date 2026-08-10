"""
Rule: Role-Based Access Control (RBAC) Integrity (SUNLIT-RBAC)
Audits role validation across Sunlit stakeholder roles: project_owner, installer, epc_contractor, crew_member, supplier, admin.
"""

import re
from typing import List
from . import BaseRule, Finding, Severity, AutoFixClass, infer_sunlit_domain_and_engine


class RBACIntegrityRule(BaseRule):
    rule_id = "SUNLIT-RBAC-001"
    name = "Sunlit RBAC Engine Integrity & Anti-Spoofing"
    category = "Role-Based Access Control"
    default_severity = Severity.P1_HIGH

    CANONICAL_ROLES = [
        "project_owner",
        "installer",
        "epc_contractor",
        "crew_member",
        "supplier",
        "admin",
    ]

    def scan_file(self, file_path: str, content: str) -> List[Finding]:
        if any(skip in file_path for skip in ["node_modules", ".git", "tests/fixtures/known_safe"]):
            return []

        findings: List[Finding] = []
        domain, engine = infer_sunlit_domain_and_engine(file_path)
        lines = content.splitlines()

        # 1. Detect stub/incomplete RBAC implementations
        if "basicRBAC" in content and "RbacEngine" not in content:
            for idx, line in enumerate(lines, start=1):
                if "function basicRBAC" in line or "const basicRBAC" in line:
                    findings.append(
                        Finding(
                            finding_id=f"SUNLIT-RBAC-{len(findings)+1:03d}",
                            title="Incomplete / Stub RBAC Implementation Detected (basicRBAC)",
                            severity=Severity.P1_HIGH,
                            confidence="HIGH",
                            category=self.category,
                            domain=domain,
                            engine=engine,
                            file=file_path,
                            line=idx,
                            description="basicRBAC is a simplistic stub that does not enforce granular permissions across all canonical Sunlit roles (installer, epc_contractor, crew_member, supplier, admin).",
                            security_impact="Unauthorized role access and horizontal/vertical privilege escalation.",
                            evidence=line.strip(),
                            recommended_fix="Integrate with canonical Sunlit RBAC Engine (@/core/rbac/engine.ts) with full permission matrix.",
                            auto_fix_eligibility=AutoFixClass.CLASS_B,
                            regression_test_required=True,
                        )
                    )

        # 2. Check for missing admin checks in admin API routes
        if "/api/v1/admin" in file_path or "/api/admin" in file_path:
            has_admin_check = "admin" in content and ("role" in content or "checkPermission" in content)
            if not has_admin_check:
                findings.append(
                    Finding(
                        finding_id=f"SUNLIT-RBAC-{len(findings)+1:03d}",
                        title="Admin API Route Missing Explicit Admin Role Check",
                        severity=Severity.P0_CRITICAL,
                        confidence="HIGH",
                        category=self.category,
                        domain="Governance & Oversight",
                        engine="Admin Engine",
                        file=file_path,
                        line=1,
                        description="Administrative API route handler does not explicitly enforce 'admin' role on incoming requests.",
                        security_impact="Unprivileged authenticated users could access sensitive administrative capabilities.",
                        evidence="Admin API endpoint lacks admin role gate.",
                        recommended_fix="Verify session.role === 'admin' before executing admin handler logic.",
                        auto_fix_eligibility=AutoFixClass.CLASS_B,
                        regression_test_required=True,
                    )
                )

        return findings
