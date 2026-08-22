"""
Unit Tests for Sunlit Performance Scanner
"""

import os
import sys
import unittest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from models import PerformanceSeverity, GateVerdict
from rules.image_optimizer import check_images
from rules.dependency_analyzer import check_dependencies
from rules.database_query_rule import check_queries
from scanner import scan_workspace


class TestPerformanceScanner(unittest.TestCase):

    def test_image_optimizer_detects_raw_img(self):
        code = 'export function Card() { return <div><img src="/hero.png" /></div>; }'
        findings = check_images("src/components/Card.tsx", code)
        self.assertEqual(len(findings), 1)
        self.assertEqual(findings[0].rule_id, "PERF-IMG-001")
        self.assertEqual(findings[0].severity, PerformanceSeverity.LOW)

    def test_dependency_analyzer_detects_heavy_static_three_import(self):
        code = "import * as THREE from 'three';\nexport function Canvas() { return <div />; }"
        findings = check_dependencies("src/components/Canvas.tsx", code)
        self.assertEqual(len(findings), 1)
        self.assertEqual(findings[0].rule_id, "PERF-DEP-001")
        self.assertEqual(findings[0].severity, PerformanceSeverity.MEDIUM)

    def test_database_query_rule_detects_unbounded_select(self):
        code = "const { data } = await supabase.from('projects').select('*');"
        findings = check_queries("src/app/api/projects/route.ts", code)
        self.assertEqual(len(findings), 1)
        self.assertEqual(findings[0].rule_id, "PERF-DB-001")

    def test_database_query_rule_permits_bounded_query(self):
        code = "const { data } = await supabase.from('projects').select('*').limit(20);"
        findings = check_queries("src/app/api/projects/route.ts", code)
        self.assertEqual(len(findings), 0)

    def test_scanner_workspace_execution(self):
        workspace_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
        result = scan_workspace(workspace_root, mode="gate")
        self.assertIsNotNone(result)
        self.assertGreater(result.files_scanned, 0)
        self.assertIn(result.verdict, [GateVerdict.PASS, GateVerdict.WARNING, GateVerdict.BLOCKED])


if __name__ == "__main__":
    unittest.main()
