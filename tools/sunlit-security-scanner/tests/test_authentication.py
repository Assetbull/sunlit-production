"""
Unit Tests: Authentication & Session Rule (SUNLIT-AUTH)
"""

import unittest
import os
import sys

SCANNER_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if SCANNER_DIR not in sys.path:
    sys.path.insert(0, SCANNER_DIR)

from rules.authentication import AuthenticationRule
from rules import Severity


class TestAuthenticationRule(unittest.TestCase):
    def setUp(self):
        self.rule = AuthenticationRule()

    def test_detect_httponly_false(self):
        vulnerable_code = """
        cookies.set('sunlit_session', token, {
            httpOnly: false,
            secure: true,
            sameSite: 'lax'
        });
        """
        findings = self.rule.scan_file("src/app/api/v1/auth/session/route.ts", vulnerable_code)
        self.assertTrue(len(findings) >= 1)
        self.assertEqual(findings[0].severity, Severity.P1_HIGH)
        self.assertIn("httpOnly", findings[0].title)

    def test_detect_auth_bypass_flag(self):
        vulnerable_code = "const bypass_auth = true; // Temporary debug override"
        findings = self.rule.scan_file("src/app/api/v1/projects/route.ts", vulnerable_code)
        self.assertTrue(len(findings) >= 1)
        self.assertEqual(findings[0].severity, Severity.P0_CRITICAL)

    def test_safe_cookie_config(self):
        safe_code = """
        cookies.set('sunlit_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
        """
        findings = self.rule.scan_file("src/app/api/v1/auth/session/route.ts", safe_code)
        self.assertEqual(len(findings), 0)


if __name__ == "__main__":
    unittest.main()
