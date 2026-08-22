"""
Unit Tests: End-to-End Scanner Orchestration (SUNLIT-SCANNER)
"""

import unittest
import os
import sys
import tempfile
import json

SCANNER_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if SCANNER_DIR not in sys.path:
    sys.path.insert(0, SCANNER_DIR)

from scanner import SunlitSecurityScanner
from reporters.sarif_reporter import SarifReporter
from reporters.json_reporter import JsonReporter
from reporters.markdown_reporter import MarkdownReporter
from rules import Finding, Severity, AutoFixClass


class TestScannerOrchestrator(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()

    def test_tool_detection_returns_all_tools(self):
        scanner = SunlitSecurityScanner(root_dir=self.temp_dir)
        tools_status = scanner.detect_external_tools()
        self.assertIn("npm audit", tools_status)
        self.assertIn("TypeScript (tsc)", tools_status)
        self.assertIn("Semgrep", tools_status)
        self.assertIn("Gitleaks", tools_status)
        self.assertIn("Bandit", tools_status)
        self.assertIn("Trivy", tools_status)

        for _, status_dict in tools_status.items():
            self.assertIn(status_dict["status"], ["AVAILABLE", "NOT INSTALLED", "SKIPPED", "FAILED"])

    def test_sarif_reporter_schema_validity(self):
        reporter = SarifReporter()
        dummy_finding = Finding(
            finding_id="SUNLIT-TEST-001",
            title="Test Finding Title",
            severity=Severity.P1_HIGH,
            confidence="HIGH",
            category="Test Category",
            domain="Shared Platform",
            engine="Test Engine",
            file="src/test.ts",
            line=10,
            description="Test finding description",
            security_impact="High security impact",
            evidence="const x = 1;",
            recommended_fix="Fix line 10",
            auto_fix_eligibility=AutoFixClass.CLASS_A,
            regression_test_required=False,
        )

        sarif_json = reporter.generate([dummy_finding], {"mode": "fast", "files_scanned": 1})
        parsed = json.loads(sarif_json)
        self.assertEqual(parsed["version"], "2.1.0")
        self.assertEqual(len(parsed["runs"]), 1)
        self.assertEqual(len(parsed["runs"][0]["results"]), 1)
        self.assertEqual(parsed["runs"][0]["results"][0]["ruleId"], "SUNLIT-TEST-001")

    def test_markdown_and_json_reports(self):
        dummy_finding = Finding(
            finding_id="SUNLIT-TEST-002",
            title="Another Test Title",
            severity=Severity.P0_CRITICAL,
            confidence="HIGH",
            category="Test",
            domain="Financial",
            engine="Escrow Engine",
            file="src/escrow.ts",
            line=5,
            description="Critical finding test",
            security_impact="Critical impact",
            evidence="critical_code();",
            recommended_fix="Patch escrow.ts",
            auto_fix_eligibility=AutoFixClass.CLASS_B,
            regression_test_required=True,
        )

        md = MarkdownReporter().generate([dummy_finding], {"mode": "full", "files_scanned": 1, "external_tools": {}})
        self.assertIn("P0 — Critical", md)
        self.assertIn("SUNLIT-TEST-002", md)
        self.assertIn("BLOCKED", md)

        js = JsonReporter().generate([dummy_finding], {"mode": "full", "files_scanned": 1})
        js_data = json.loads(js)
        self.assertEqual(js_data["summary"]["critical"], 1)


if __name__ == "__main__":
    unittest.main()
