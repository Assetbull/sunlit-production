"""
Sunlit Security Scanner - Rule Engine Base Framework
"""

import os
import re
from dataclasses import dataclass, field
from enum import Enum
from typing import List, Optional, Dict, Any


class Severity(str, Enum):
    P0_CRITICAL = "P0_CRITICAL"
    P1_HIGH = "P1_HIGH"
    P2_MEDIUM = "P2_MEDIUM"
    P3_LOW = "P3_LOW"
    P4_INFORMATIONAL = "P4_INFORMATIONAL"

    @property
    def level_rank(self) -> int:
        ranks = {
            "P0_CRITICAL": 0,
            "P1_HIGH": 1,
            "P2_MEDIUM": 2,
            "P3_LOW": 3,
            "P4_INFORMATIONAL": 4,
        }
        return ranks.get(self.value, 5)


class AutoFixClass(str, Enum):
    CLASS_A = "CLASS_A"  # Safe automated remediation
    CLASS_B = "CLASS_B"  # Agent remediation with validation
    CLASS_C = "CLASS_C"  # Human review required


class FindingStatus(str, Enum):
    DISCOVERED = "DISCOVERED"
    TRIAGED = "TRIAGED"
    ACCEPTED = "ACCEPTED"
    REMEDIATING = "REMEDIATING"
    VALIDATING = "VALIDATING"
    RESOLVED = "RESOLVED"
    RISK_ACCEPTED = "RISK_ACCEPTED"
    FALSE_POSITIVE = "FALSE_POSITIVE"


@dataclass
class Finding:
    finding_id: str
    title: str
    severity: Severity
    confidence: str  # HIGH, MEDIUM, LOW
    category: str
    domain: str
    engine: str
    file: str
    line: int
    description: str
    security_impact: str
    evidence: str
    recommended_fix: str
    auto_fix_eligibility: AutoFixClass
    regression_test_required: bool
    status: FindingStatus = FindingStatus.DISCOVERED
    first_detected: str = "2026-08-10"
    last_detected: str = "2026-08-10"
    resolved_at: Optional[str] = None
    resolution: Optional[str] = None
    reviewer: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "finding_id": self.finding_id,
            "title": self.title,
            "severity": self.severity.value,
            "confidence": self.confidence,
            "category": self.category,
            "domain": self.domain,
            "engine": self.engine,
            "file": self.file,
            "line": self.line,
            "description": self.description,
            "security_impact": self.security_impact,
            "evidence": self.evidence,
            "recommended_fix": self.recommended_fix,
            "auto_fix_eligibility": self.auto_fix_eligibility.value,
            "regression_test_required": self.regression_test_required,
            "status": self.status.value,
            "first_detected": self.first_detected,
            "last_detected": self.last_detected,
            "resolved_at": self.resolved_at,
            "resolution": self.resolution,
            "reviewer": self.reviewer,
        }


def redact_secret(val: str) -> str:
    """Redacts secret value showing only first 3 and last 3 characters"""
    if not val:
        return ""
    if len(val) <= 8:
        return "[REDACTED]"
    return f"{val[:3]}...[REDACTED]...{val[-3:]}"


def infer_sunlit_domain_and_engine(file_path: str) -> tuple:
    """Infers Sunlit domain and engine from file path"""
    path_lower = file_path.lower()
    if "marketplace" in path_lower or "bids" in path_lower or "rfq" in path_lower:
        return ("Marketplace", "Bidding / RFQ Engine")
    elif "payment" in path_lower or "escrow" in path_lower or "fund" in path_lower:
        return ("Financial", "Payment & Escrow Engine")
    elif "installer" in path_lower or "epc" in path_lower:
        return ("Installer Operations", "Installer Workspace Engine")
    elif "crew" in path_lower or "technician" in path_lower:
        return ("Field Operations", "CrewLink Engine")
    elif "auth" in path_lower or "login" in path_lower or "register" in path_lower or "session" in path_lower:
        return ("Identity & Access", "Identity & Auth Engine")
    elif "engineering" in path_lower or "calculator" in path_lower or "solar" in path_lower:
        return ("Engineering", "Solar Sizing & Yield Engine")
    elif "admin" in path_lower or "dispute" in path_lower:
        return ("Governance & Oversight", "Dispute & Admin Engine")
    else:
        return ("Shared Platform", "Core Platform Services")


class BaseRule:
    rule_id: str = "SUNLIT-BASE"
    name: str = "Base Security Rule"
    category: str = "General Security"
    default_severity: Severity = Severity.P3_LOW
    applies_to_extensions: List[str] = [".ts", ".tsx", ".js", ".jsx", ".py", ".json", ".sql", ".env", ".yml", ".yaml"]

    def applies_to(self, file_path: str) -> bool:
        _, ext = os.path.splitext(file_path)
        return ext.lower() in self.applies_to_extensions

    def scan_file(self, file_path: str, content: str) -> List[Finding]:
        raise NotImplementedError("Subclasses must implement scan_file")
