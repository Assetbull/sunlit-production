"""
SARIF Reporter for Sunlit Security Scanner
Generates OASIS SARIF v2.1.0 compliant output for GitHub Code Scanning integration.
"""

import json
from typing import List, Dict, Any
from rules import Finding, Severity


class SarifReporter:
    def generate(self, findings: List[Finding], metadata: Dict[str, Any]) -> str:
        sarif_level_map = {
            Severity.P0_CRITICAL: "error",
            Severity.P1_HIGH: "error",
            Severity.P2_MEDIUM: "warning",
            Severity.P3_LOW: "note",
            Severity.P4_INFORMATIONAL: "note",
        }

        # Build distinct rule definitions
        rules_map: Dict[str, Dict[str, Any]] = {}
        results: List[Dict[str, Any]] = []

        for f in findings:
            if f.finding_id not in rules_map:
                rules_map[f.finding_id] = {
                    "id": f.finding_id,
                    "name": f.title,
                    "shortDescription": {"text": f.title},
                    "fullDescription": {"text": f.description},
                    "defaultConfiguration": {
                        "level": sarif_level_map.get(f.severity, "warning")
                    },
                    "properties": {
                        "category": f.category,
                        "domain": f.domain,
                        "engine": f.engine,
                        "auto_fix_class": f.auto_fix_eligibility.value,
                    },
                }

            results.append({
                "ruleId": f.finding_id,
                "level": sarif_level_map.get(f.severity, "warning"),
                "message": {
                    "text": f"{f.title}: {f.description} Impact: {f.security_impact} Fix: {f.recommended_fix}"
                },
                "locations": [
                    {
                        "physicalLocation": {
                            "artifactLocation": {
                                "uri": f.file,
                                "uriBaseId": "%SRCROOT%"
                            },
                            "region": {
                                "startLine": max(1, f.line),
                                "startColumn": 1
                            }
                        }
                    }
                ]
            })

        sarif_payload = {
            "$schema": "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
            "version": "2.1.0",
            "runs": [
                {
                    "tool": {
                        "driver": {
                            "name": "Sunlit Security Code Assurance Scanner",
                            "version": "1.0.0",
                            "informationUri": "https://sunlit.energy/security",
                            "rules": list(rules_map.values()),
                        }
                    },
                    "results": results,
                }
            ],
        }

        return json.dumps(sarif_payload, indent=2)
