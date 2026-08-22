"""
Rule: Frontend & React/Next.js Security (SUNLIT-FE)
Detects dangerouslySetInnerHTML, reverse tabnabbing, unvalidated postMessage, and client-side security flaws.
"""

import re
from typing import List
from . import BaseRule, Finding, Severity, AutoFixClass, infer_sunlit_domain_and_engine


class FrontendSecurityRule(BaseRule):
    rule_id = "SUNLIT-FE-001"
    name = "Frontend React / Next.js Security Assurance"
    category = "Frontend Security"
    default_severity = Severity.P2_MEDIUM

    def scan_file(self, file_path: str, content: str) -> List[Finding]:
        if not (file_path.endswith(".tsx") or file_path.endswith(".jsx") or file_path.endswith(".js") or file_path.endswith(".ts")):
            return []
        if any(skip in file_path for skip in ["node_modules", ".git", "tests/fixtures/known_safe"]):
            return []

        findings: List[Finding] = []
        domain, engine = infer_sunlit_domain_and_engine(file_path)
        lines = content.splitlines()

        for idx, line in enumerate(lines, start=1):
            # 1. dangerouslySetInnerHTML without DOMPurify or sanitize
            if "dangerouslySetInnerHTML" in line and "DOMPurify" not in content and "sanitize" not in content.lower():
                # Allow safe JSON-LD structured data: <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(...) }} />
                if "application/ld+json" in content or "JSON.stringify" in line:
                    continue
                findings.append(
                    Finding(
                        finding_id=f"SUNLIT-FE-{len(findings)+1:03d}",
                        title="Unsanitized dangerouslySetInnerHTML Usage (XSS Risk)",
                        severity=Severity.P1_HIGH,
                        confidence="HIGH",
                        category=self.category,
                        domain=domain,
                        engine=engine,
                        file=file_path,
                        line=idx,
                        description="React dangerouslySetInnerHTML is used without explicit HTML sanitization (e.g. DOMPurify).",
                        security_impact="Cross-Site Scripting (XSS) vulnerability allowing arbitrary JavaScript execution in user browser.",
                        evidence=line.strip(),
                        recommended_fix="Sanitize untrusted HTML with DOMPurify.sanitize() or use standard React text nodes.",
                        auto_fix_eligibility=AutoFixClass.CLASS_B,
                        regression_test_required=True,
                    )
                )

            # 2. Reverse Tabnabbing (target="_blank" without rel="noopener noreferrer")
            if 'target="_blank"' in line or "target='_blank'" in line:
                if "rel=" not in line and "noopener" not in line:
                    findings.append(
                        Finding(
                            finding_id=f"SUNLIT-FE-{len(findings)+1:03d}",
                            title="Reverse Tabnabbing: target='_blank' Missing rel='noopener noreferrer'",
                            severity=Severity.P3_LOW,
                            confidence="HIGH",
                            category=self.category,
                            domain=domain,
                            engine=engine,
                            file=file_path,
                            line=idx,
                            description="Anchor tag opens external target with _blank but lacks rel='noopener noreferrer'.",
                            security_impact="Target page can access window.opener and potentially redirect original page to phishing site.",
                            evidence=line.strip(),
                            recommended_fix="Add rel='noopener noreferrer' to external anchor links.",
                            auto_fix_eligibility=AutoFixClass.CLASS_A,
                            regression_test_required=False,
                        )
                    )

            # 3. Insecure postMessage target origin "*"
            if re.search(r"\.postMessage\([^,]+,\s*['\"]\*['\"]\)", line):
                findings.append(
                    Finding(
                        finding_id=f"SUNLIT-FE-{len(findings)+1:03d}",
                        title="Insecure window.postMessage with Wildcard Target Origin (*)",
                        severity=Severity.P2_MEDIUM,
                        confidence="HIGH",
                        category=self.category,
                        domain=domain,
                        engine=engine,
                        file=file_path,
                        line=idx,
                        description="window.postMessage sends data to wildcard origin ('*'), allowing any embedded iframe or origin to intercept message payload.",
                        security_impact="Information disclosure across window/iframe boundaries.",
                        evidence=line.strip(),
                        recommended_fix="Specify the exact target origin URL instead of '*'.",
                        auto_fix_eligibility=AutoFixClass.CLASS_A,
                        regression_test_required=False,
                    )
                )

        return findings
