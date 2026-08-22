"""
Rule: File & Upload Security (SUNLIT-FILE)
Detects path traversal, unrestricted file upload handlers, and unsafe filesystem access.
"""

import re
from typing import List
from . import BaseRule, Finding, Severity, AutoFixClass, infer_sunlit_domain_and_engine


class FileSecurityRule(BaseRule):
    rule_id = "SUNLIT-FILE-001"
    name = "File System & Upload Security"
    category = "File & Upload Security"
    default_severity = Severity.P1_HIGH

    def scan_file(self, file_path: str, content: str) -> List[Finding]:
        if any(skip in file_path for skip in ["node_modules", ".git", "tests/fixtures/known_safe"]):
            return []

        findings: List[Finding] = []
        domain, engine = infer_sunlit_domain_and_engine(file_path)
        lines = content.splitlines()

        for idx, line in enumerate(lines, start=1):
            # 1. Path traversal via user input in fs.readFile / readFileSync
            if re.search(r"fs\.(?:readFile|readFileSync|createReadStream)\([^)]*(?:req\.|params\.|searchParams\.)", line):
                findings.append(
                    Finding(
                        finding_id=f"SUNLIT-FILE-{len(findings)+1:03d}",
                        title="Potential Path Traversal in File Read Operation",
                        severity=Severity.P0_CRITICAL,
                        confidence="HIGH",
                        category=self.category,
                        domain=domain,
                        engine=engine,
                        file=file_path,
                        line=idx,
                        description="Filesystem read operation uses user-supplied path without sanitization or directory sandboxing.",
                        security_impact="Arbitrary file read on host filesystem, potentially leaking secrets, environment files, or system files.",
                        evidence=line.strip(),
                        recommended_fix="Sanitize paths using path.basename() and verify destination remains within allowed root directory.",
                        auto_fix_eligibility=AutoFixClass.CLASS_B,
                        regression_test_required=True,
                    )
                )

        return findings
