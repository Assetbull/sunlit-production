"""
Sunlit Performance Scanner — Core Models and Finding Definitions
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional


class PerformanceSeverity(Enum):
    CRITICAL = "P0_CRITICAL"
    HIGH = "P1_HIGH"
    MEDIUM = "P2_MEDIUM"
    LOW = "P3_LOW"
    INFORMATIONAL = "P4_INFORMATIONAL"


class GateVerdict(Enum):
    PASS = "PASS"
    WARNING = "WARNING"
    BLOCKED = "BLOCKED"


@dataclass
class PerformanceFinding:
    rule_id: str
    rule_name: str
    severity: PerformanceSeverity
    category: str
    message: str
    file_path: str
    line_number: int = 0
    code_snippet: str = ""
    remediation: str = ""
    impact: str = ""
    metadata: Dict = field(default_factory=dict)


@dataclass
class PerformanceScanResult:
    target_path: str
    mode: str
    files_scanned: int
    duration_seconds: float
    findings: List[PerformanceFinding] = field(default_factory=list)
    verdict: GateVerdict = GateVerdict.PASS
    stats: Dict = field(default_factory=dict)

    def get_findings_by_severity(self, severity: PerformanceSeverity) -> List[PerformanceFinding]:
        return [f for f in self.findings if f.severity == severity]
