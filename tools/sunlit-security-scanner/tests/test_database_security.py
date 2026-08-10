"""
Unit Tests: Database Security & SQL Injection Rule (SUNLIT-DB)
"""

import unittest
import os
import sys

SCANNER_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if SCANNER_DIR not in sys.path:
    sys.path.insert(0, SCANNER_DIR)

from rules.database_security import DatabaseSecurityRule
from rules import Severity


class TestDatabaseSecurityRule(unittest.TestCase):
    def setUp(self):
        self.rule = DatabaseSecurityRule()

    def test_detect_template_literal_sql_injection(self):
        vulnerable_code = "const result = await db.query(`SELECT * FROM users WHERE email = '${userEmail}'`);"
        findings = self.rule.scan_file("src/services/user-service.ts", vulnerable_code)
        self.assertTrue(len(findings) >= 1)
        self.assertEqual(findings[0].severity, Severity.P0_CRITICAL)
        self.assertIn("SQL Injection", findings[0].title)

    def test_detect_security_definer_without_search_path(self):
        vulnerable_sql = """
        CREATE OR REPLACE FUNCTION promote_admin(user_id UUID)
        RETURNS VOID
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
            UPDATE users SET role = 'admin' WHERE id = user_id;
        END;
        $$;
        """
        findings = self.rule.scan_file("supabase/migrations/20260810_admin.sql", vulnerable_sql)
        self.assertTrue(len(findings) >= 1)
        self.assertEqual(findings[0].severity, Severity.P1_HIGH)
        self.assertIn("search_path", findings[0].title)

    def test_safe_parameterized_query(self):
        safe_code = "const result = await db.query('SELECT * FROM users WHERE email = $1', [userEmail]);"
        findings = self.rule.scan_file("src/services/user-service.ts", safe_code)
        self.assertEqual(len(findings), 0)


if __name__ == "__main__":
    unittest.main()
