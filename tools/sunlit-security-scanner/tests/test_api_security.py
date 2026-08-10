"""
Unit Tests: API Security Rule (SUNLIT-API)
"""

import unittest
import os
import sys

SCANNER_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if SCANNER_DIR not in sys.path:
    sys.path.insert(0, SCANNER_DIR)

from rules.api_security import APISecurityRule
from rules import Severity


class TestAPISecurityRule(unittest.TestCase):
    def setUp(self):
        self.rule = APISecurityRule()

    def test_detect_stack_trace_leakage(self):
        vulnerable_code = """
        export async function GET(req: Request) {
            try {
                return NextResponse.json({ data: [] });
            } catch (err: any) {
                return NextResponse.json({ error: err.stack }, { status: 500 });
            }
        }
        """
        findings = self.rule.scan_file("src/app/api/v1/projects/route.ts", vulnerable_code)
        self.assertTrue(len(findings) >= 1)
        self.assertEqual(findings[0].severity, Severity.P2_MEDIUM)
        self.assertIn("Stack Trace Leakage", findings[0].title)

    def test_safe_error_handling(self):
        safe_code = """
        import { z } from 'zod';
        export async function POST(req: Request) {
            try {
                const body = await req.json();
                const validated = z.object({ name: z.string() }).parse(body);
                return NextResponse.json({ data: validated });
            } catch (err: any) {
                console.error('[API_ERROR]', err);
                return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
            }
        }
        """
        findings = self.rule.scan_file("src/app/api/v1/projects/route.ts", safe_code)
        self.assertEqual(len(findings), 0)


if __name__ == "__main__":
    unittest.main()
