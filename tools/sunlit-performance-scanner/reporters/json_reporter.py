"""
JSON and SARIF Reporters for Sunlit Performance Scanner
"""

import json
import os
import sys
from typing import Dict

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from models import PerformanceScanResult


def render_json_report(result: PerformanceScanResult) -> str:
    data = {
        "scan_target": result.target_path,
        "mode": result.mode,
        "files_scanned": result.files_scanned,
        "duration_seconds": result.duration_seconds,
        "verdict": result.verdict.value,
        "total_findings": len(result.findings),
        "findings": [
            {
                "rule_id": f.rule_id,
                "rule_name": f.rule_name,
                "severity": f.severity.name,
                "category": f.category,
                "message": f.message,
                "file_path": f.file_path,
                "line_number": f.line_number,
                "code_snippet": f.code_snippet,
                "remediation": f.remediation,
                "impact": f.impact,
            }
            for f in result.findings
        ],
    }
    return json.dumps(data, indent=2)


def render_sarif_report(result: PerformanceScanResult) -> str:
    rules = {}
    results = []

    for f in result.findings:
        if f.rule_id not in rules:
            rules[f.rule_id] = {
                "id": f.rule_id,
                "name": f.rule_name,
                "shortDescription": {"text": f.rule_name},
                "fullDescription": {"text": f.message},
                "help": {"text": f.remediation},
            }

        level = "error" if "CRITICAL" in f.severity.value or "HIGH" in f.severity.value else ("warning" if "MEDIUM" in f.severity.value else "note")

        results.append({
            "ruleId": f.rule_id,
            "level": level,
            "message": {"text": f.message},
            "locations": [
                {
                    "physicalLocation": {
                        "artifactLocation": {"uri": f.file_path},
                        "region": {"startLine": f.line_number or 1},
                    }
                }
            ],
        })

    sarif = {
        "$schema": "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
        "version": "2.1.0",
        "runs": [
            {
                "tool": {
                    "driver": {
                        "name": "SunlitPerformanceScanner",
                        "version": "1.0.0",
                        "rules": list(rules.values()),
                    }
                },
                "results": results,
            }
        ],
    }
    return json.dumps(sarif, indent=2)
