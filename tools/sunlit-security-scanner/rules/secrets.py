"""
Rule: Secret Exposure Detection (SUNLIT-SEC)
Detects leaked or hardcoded API keys, Supabase service keys, database passwords, and private keys.
"""

import re
import base64
from typing import List
from . import BaseRule, Finding, Severity, AutoFixClass, redact_secret, infer_sunlit_domain_and_engine


class SecretDetectionRule(BaseRule):
    rule_id = "SUNLIT-SEC-001"
    name = "Hardcoded Secret or Credential Exposure"
    category = "Secrets & Credentials"
    default_severity = Severity.P0_CRITICAL

    PATTERNS = [
        (
            r"-----BEGIN (?:RSA|EC|OPENSSH|DSA|PGP)? ?PRIVATE KEY-----",
            "Exposed Private Encryption Key",
            Severity.P0_CRITICAL,
        ),
        (
            r"(?:supabase_service_role_key|service_role_key|SUPABASE_SERVICE_ROLE_KEY)\s*[:=]\s*['\"]([a-zA-Z0-9._-]+)['\"]",
            "Hardcoded Supabase Service Role Key (Bypasses RLS)",
            Severity.P0_CRITICAL,
        ),
        (
            r"(?:postgres|postgresql|mysql|mongodb|redis):\/\/[a-zA-Z0-9_\-\.]+:[^\s'\"]+@[a-zA-Z0-9_\-\.]+",
            "Hardcoded Database Connection String with Plaintext Password",
            Severity.P0_CRITICAL,
        ),
        (
            r"(?:sk_live_[0-9a-zA-Z]{24,}|whsec_[0-9a-zA-Z]{24,}|SG\.[0-9a-zA-Z_\-]{22,}\.[0-9a-zA-Z_\-]{43,})",
            "Exposed Live API / Webhook Secret Key",
            Severity.P0_CRITICAL,
        ),
        (
            r"(?:aws_secret_access_key|AWS_SECRET_ACCESS_KEY)\s*[:=]\s*['\"][0-9a-zA-Z/+=]{40}['\"]",
            "Exposed AWS Secret Access Key",
            Severity.P0_CRITICAL,
        ),
        (
            r"(?:jwt_secret|JWT_SECRET|COOKIE_SECRET)\s*[:=]\s*['\"][a-zA-Z0-9_\-!@#$%^&*]{16,}['\"]",
            "Hardcoded Cryptographic / JWT Secret Token",
            Severity.P0_CRITICAL,
        ),
    ]

    def scan_file(self, file_path: str, content: str) -> List[Finding]:
        if any(skip in file_path for skip in [".env.example", "node_modules", ".git", "tests/fixtures/known_safe"]):
            return []

        findings: List[Finding] = []
        domain, engine = infer_sunlit_domain_and_engine(file_path)
        lines = content.splitlines()

        for line_idx, line in enumerate(lines, start=1):
            # Check standard patterns
            for pattern, title, severity in self.PATTERNS:
                match = re.search(pattern, line)
                if match:
                    matched_str = match.group(0)
                    if any(dummy in matched_str.lower() for dummy in ["placeholder", "dummy", "replace_me", "your_secret", "changeme"]):
                        continue

                    findings.append(
                        Finding(
                            finding_id=f"SUNLIT-SEC-{len(findings)+1:03d}",
                            title=title,
                            severity=severity,
                            confidence="HIGH",
                            category=self.category,
                            domain=domain,
                            engine=engine,
                            file=file_path,
                            line=line_idx,
                            description=f"Potential credential or secret detected: {title}.",
                            security_impact="Exposure of sensitive credentials can lead to total system compromise, database exposure, or unauthorized external service access.",
                            evidence=redact_secret(line.strip()),
                            recommended_fix="Move secret to server environment variables (e.g. process.env) and load via runtime configuration. Rotate any exposed credentials immediately.",
                            auto_fix_eligibility=AutoFixClass.CLASS_A,
                            regression_test_required=False,
                        )
                    )

            # Check for JWT tokens in code containing service_role
            jwt_match = re.search(r"['\"](ey[a-zA-Z0-9_-]{10,}\.ey[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9._-]+)['\"]", line)
            if jwt_match:
                jwt_token = jwt_match.group(1)
                parts = jwt_token.split(".")
                if len(parts) >= 2:
                    try:
                        # Decode payload
                        padded = parts[1] + "=" * ((4 - len(parts[1]) % 4) % 4)
                        decoded = base64.urlsafe_b64decode(padded.encode("ascii")).decode("utf-8", errors="ignore")
                        if "service_role" in decoded:
                            findings.append(
                                Finding(
                                    finding_id=f"SUNLIT-SEC-{len(findings)+1:03d}",
                                    title="Hardcoded Supabase Service Role JWT Key in Code",
                                    severity=Severity.P0_CRITICAL,
                                    confidence="HIGH",
                                    category=self.category,
                                    domain=domain,
                                    engine=engine,
                                    file=file_path,
                                    line=line_idx,
                                    description="Found Supabase service_role JWT key in source code. This key bypasses all Row Level Security policies.",
                                    security_impact="Total database authorization bypass; any caller can read/mutate all tables.",
                                    evidence=redact_secret(line.strip()),
                                    recommended_fix="Never bundle service_role keys into code. Load via backend environment variable SUPABASE_SERVICE_ROLE_KEY.",
                                    auto_fix_eligibility=AutoFixClass.CLASS_A,
                                    regression_test_required=False,
                                )
                            )
                    except Exception:
                        pass

        return findings
