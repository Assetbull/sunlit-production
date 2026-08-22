"""
JSON Reporter for Sunlit Security Scanner
Generates machine-readable security scan results.
"""

import json
from typing import List, Dict, Any
from rules import Finding


class JsonReporter:
    def generate(self, findings: List[Finding], metadata: Dict[str, Any]) -> str:
        payload = {
            "metadata": metadata,
            "summary": {
                "total_findings": len(findings),
                "critical": sum(1 for f in findings if f.severity.value == "P0_CRITICAL"),
                "high": sum(1 for f in findings if f.severity.value == "P1_HIGH"),
                "medium": sum(1 for f in findings if f.severity.value == "P2_MEDIUM"),
                "low": sum(1 for f in findings if f.severity.value == "P3_LOW"),
                "informational": sum(1 for f in findings if f.severity.value == "P4_INFORMATIONAL"),
            },
            "findings": [f.to_dict() for f in findings],
        }
        return json.dumps(payload, indent=2)
