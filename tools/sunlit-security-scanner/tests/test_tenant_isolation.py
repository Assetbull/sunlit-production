"""
Unit Tests: Tenant Isolation Rule (SUNLIT-TENANT)
"""

import unittest
import os
import sys

SCANNER_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if SCANNER_DIR not in sys.path:
    sys.path.insert(0, SCANNER_DIR)

from rules.tenant_isolation import TenantIsolationRule
from rules import Severity


class TestTenantIsolationRule(unittest.TestCase):
    def setUp(self):
        self.rule = TenantIsolationRule()

    def test_detect_unscoped_idor_mutation(self):
        vulnerable_code = """
        export async function updateBid(bidId: string, payload: any) {
            return await db.update('bids', { id: bidId }, payload);
        }
        """
        findings = self.rule.scan_file("src/services/bid-service.ts", vulnerable_code)
        self.assertTrue(len(findings) >= 1)
        self.assertEqual(findings[0].severity, Severity.P1_HIGH)
        self.assertIn("Potential IDOR/BOLA", findings[0].title)

    def test_safe_tenant_scoped_mutation(self):
        safe_code = """
        export async function updateBid(bidId: string, orgId: string, payload: any) {
            return await db.update('bids', { id: bidId, organization_id: orgId }, payload);
        }
        """
        findings = self.rule.scan_file("src/services/bid-service.ts", safe_code)
        self.assertEqual(len(findings), 0)


if __name__ == "__main__":
    unittest.main()
