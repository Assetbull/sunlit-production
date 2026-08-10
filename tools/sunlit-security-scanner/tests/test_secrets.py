"""
Unit Tests: Secret Detection Rule (SUNLIT-SEC)
"""

import unittest
import os
import sys

# Ensure scanner path is available
SCANNER_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if SCANNER_DIR not in sys.path:
    sys.path.insert(0, SCANNER_DIR)

from rules.secrets import SecretDetectionRule
from rules import Severity


class TestSecretDetectionRule(unittest.TestCase):
    def setUp(self):
        self.rule = SecretDetectionRule()

    def test_detect_supabase_service_role_key(self):
        vulnerable_code = """
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIn0.fake_signature_for_testing_12345678'
        );
        """
        findings = self.rule.scan_file("src/services/db.ts", vulnerable_code)
        self.assertTrue(len(findings) >= 1)
        self.assertEqual(findings[0].severity, Severity.P0_CRITICAL)
        self.assertIn("[REDACTED]", findings[0].evidence)
        self.assertNotIn("fake_signature_for_testing_12345678", findings[0].evidence)

    def test_detect_hardcoded_db_connection_string(self):
        vulnerable_code = "const DB_URL = 'postgres://postgres:SuperSecretP@ssw0rd@db.sunlit.energy:5432/sunlit';"
        findings = self.rule.scan_file("config/database.ts", vulnerable_code)
        self.assertTrue(len(findings) >= 1)
        self.assertIn("[REDACTED]", findings[0].evidence)

    def test_safe_env_variable_lookup_ignored(self):
        safe_code = """
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const supabase = createClient(supabaseUrl, serviceKey);
        """
        findings = self.rule.scan_file("src/services/db.ts", safe_code)
        self.assertEqual(len(findings), 0)


if __name__ == "__main__":
    unittest.main()
