"""
Unit Tests: Authorization Rule (SUNLIT-AUTHZ)
"""

import unittest
import os
import sys

SCANNER_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if SCANNER_DIR not in sys.path:
    sys.path.insert(0, SCANNER_DIR)

from rules.authorization import AuthorizationRule
from rules import Severity


class TestAuthorizationRule(unittest.TestCase):
    def setUp(self):
        self.rule = AuthorizationRule()

    def test_detect_client_trusted_user_id(self):
        vulnerable_code = """
        export async function POST(req: Request) {
            const { userId, bidAmount } = await req.json();
            await db.bids.create({ userId, amount: bidAmount });
            return NextResponse.json({ success: true });
        }
        """
        findings = self.rule.scan_file("src/app/api/v1/bids/route.ts", vulnerable_code)
        self.assertTrue(len(findings) >= 1)
        self.assertEqual(findings[0].severity, Severity.P1_HIGH)
        self.assertIn("Trusted Without Session", findings[0].title)

    def test_safe_session_derived_user_id(self):
        safe_code = """
        export async function POST(req: Request) {
            const session = await getSession(req);
            if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            const { bidAmount } = await req.json();
            await db.bids.create({ userId: session.user_id, amount: bidAmount });
            return NextResponse.json({ success: true });
        }
        """
        findings = self.rule.scan_file("src/app/api/v1/bids/route.ts", safe_code)
        self.assertEqual(len(findings), 0)


if __name__ == "__main__":
    unittest.main()
