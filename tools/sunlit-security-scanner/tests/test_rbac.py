"""
Unit Tests: RBAC Integrity Rule (SUNLIT-RBAC)
"""

import unittest
import os
import sys

SCANNER_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if SCANNER_DIR not in sys.path:
    sys.path.insert(0, SCANNER_DIR)

from rules.rbac import RBACIntegrityRule
from rules import Severity


class TestRBACIntegrityRule(unittest.TestCase):
    def setUp(self):
        self.rule = RBACIntegrityRule()

    def test_detect_stub_basic_rbac(self):
        vulnerable_code = """
        export function basicRBAC(user: any, action: string) {
            if (!user) return false;
            if (user.role === 'project_owner') return true;
            return false;
        }
        """
        findings = self.rule.scan_file("src/security/basicRBAC.ts", vulnerable_code)
        self.assertTrue(len(findings) >= 1)
        self.assertEqual(findings[0].severity, Severity.P1_HIGH)
        self.assertIn("basicRBAC", findings[0].title)

    def test_detect_admin_route_missing_admin_role_check(self):
        vulnerable_code = """
        export async function DELETE(req: Request) {
            await deleteUser(req.query.id);
            return NextResponse.json({ ok: true });
        }
        """
        findings = self.rule.scan_file("src/app/api/v1/admin/users/route.ts", vulnerable_code)
        self.assertTrue(len(findings) >= 1)
        self.assertEqual(findings[0].severity, Severity.P0_CRITICAL)


if __name__ == "__main__":
    unittest.main()
