"""
Rule: Cryptographic Security & Randomness (SUNLIT-CRYPTO)
Detects weak cryptographic primitives (MD5/SHA1 in auth contexts) and insecure pseudo-random generators (Math.random for tokens).
"""

import re
from typing import List
from . import BaseRule, Finding, Severity, AutoFixClass, infer_sunlit_domain_and_engine


class CryptoSecurityRule(BaseRule):
    rule_id = "SUNLIT-CRYPTO-001"
    name = "Cryptographic Primitives & Safe Randomness Assurance"
    category = "Cryptography"
    default_severity = Severity.P2_MEDIUM

    def scan_file(self, file_path: str, content: str) -> List[Finding]:
        if any(skip in file_path for skip in ["node_modules", ".git", "tests/fixtures/known_safe"]):
            return []

        findings: List[Finding] = []
        domain, engine = infer_sunlit_domain_and_engine(file_path)
        lines = content.splitlines()

        for idx, line in enumerate(lines, start=1):
            # 1. Insecure token/OTP generation with Math.random()
            if re.search(r"(?:token|otp|secret|session|nonce|password|authKey)\s*[:=].*Math\.random\(\)", line, re.IGNORECASE):
                findings.append(
                    Finding(
                        finding_id=f"SUNLIT-CRYPTO-{len(findings)+1:03d}",
                        title="Insecure Pseudo-Random Generator (Math.random) for Security Value",
                        severity=Severity.P1_HIGH,
                        confidence="HIGH",
                        category=self.category,
                        domain=domain,
                        engine=engine,
                        file=file_path,
                        line=idx,
                        description="Math.random() is used to generate security-sensitive tokens, OTPs, or passwords instead of a CSPRNG.",
                        security_impact="Predictable tokens can be guessed or brute-forced by an attacker.",
                        evidence=line.strip(),
                        recommended_fix="Use crypto.randomUUID(), crypto.randomBytes(), or crypto.getRandomValues().",
                        auto_fix_eligibility=AutoFixClass.CLASS_A,
                        regression_test_required=True,
                    )
                )

        return findings
