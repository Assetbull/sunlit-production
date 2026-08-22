#!/usr/bin/env python3
"""
Sunlit Security Code Assurance Scanner
Authoritative Security Orchestrator & Rule Engine
"""

import argparse
import datetime
import os
import shutil
import subprocess
import sys
import time
from typing import List, Dict, Any

# Ensure scanner directory is on pythonpath for direct script execution
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from rules import Finding, Severity, AutoFixClass, FindingStatus
from rules.secrets import SecretDetectionRule
from rules.authentication import AuthenticationRule
from rules.authorization import AuthorizationRule
from rules.rbac import RBACIntegrityRule
from rules.tenant_isolation import TenantIsolationRule
from rules.api_security import APISecurityRule
from rules.database_security import DatabaseSecurityRule
from rules.frontend_security import FrontendSecurityRule
from rules.dependency_security import DependencySecurityRule
from rules.input_validation import InputValidationRule
from rules.file_security import FileSecurityRule
from rules.crypto_security import CryptoSecurityRule
from rules.logging_security import LoggingSecurityRule
from rules.redirect_security import RedirectSecurityRule
from rules.infrastructure_security import InfrastructureSecurityRule
from reporters import JsonReporter, MarkdownReporter, ConsoleReporter, SarifReporter


class SunlitSecurityScanner:
    def __init__(self, root_dir: str):
        self.root_dir = os.path.abspath(root_dir)
        self.rules = [
            SecretDetectionRule(),
            AuthenticationRule(),
            AuthorizationRule(),
            RBACIntegrityRule(),
            TenantIsolationRule(),
            APISecurityRule(),
            DatabaseSecurityRule(),
            FrontendSecurityRule(),
            InputValidationRule(),
            FileSecurityRule(),
            CryptoSecurityRule(),
            LoggingSecurityRule(),
            RedirectSecurityRule(),
            InfrastructureSecurityRule(),
        ]
        self.dependency_rule = DependencySecurityRule()

    def detect_external_tools(self) -> Dict[str, Dict[str, str]]:
        """Detects presence and status of external security tools"""
        tools = {
            "TypeScript (tsc)": {"cmd": "npx", "args": ["tsc", "--version"], "installed": False},
            "npm audit": {"cmd": "npm", "args": ["--version"], "installed": False},
            "Semgrep": {"cmd": "semgrep", "args": ["--version"], "installed": False},
            "Gitleaks": {"cmd": "gitleaks", "args": ["version"], "installed": False},
            "Bandit": {"cmd": "bandit", "args": ["--version"], "installed": False},
            "Trivy": {"cmd": "trivy", "args": ["--version"], "installed": False},
        }

        status_report = {}
        for name, conf in tools.items():
            executable = shutil.which(conf["cmd"])
            if executable:
                try:
                    res = subprocess.run([executable] + conf["args"], capture_output=True, text=True, timeout=5)
                    if res.returncode == 0:
                        status_report[name] = {"status": "AVAILABLE", "message": res.stdout.strip().split("\n")[0]}
                    else:
                        status_report[name] = {"status": "AVAILABLE", "message": "Executable present"}
                except Exception as e:
                    status_report[name] = {"status": "FAILED", "message": str(e)}
            else:
                status_report[name] = {"status": "NOT INSTALLED", "message": f"Command '{conf['cmd']}' not found in PATH"}

        return status_report

    def collect_files(self, mode: str, target_dir: str, explicit_files: List[str] = None) -> List[str]:
        """Collects files to scan based on operational mode"""
        if explicit_files:
            return [os.path.abspath(f) for f in explicit_files if os.path.exists(f)]

        scannable_extensions = {".ts", ".tsx", ".js", ".jsx", ".py", ".sql", ".json", ".env", ".yml", ".yaml"}
        ignore_dirs = {
            "node_modules",
            ".git",
            ".next",
            "dist",
            "build",
            ".gemini",
            "tests",
            "fixtures",
            "scratch",
            "tools",
        }

        ignore_files = {"security-report.json", "security-report.md", "security-report.sarif", "package-lock.json"}
        collected = []
        for root, dirs, files in os.walk(target_dir):
            # Prune ignore directories
            dirs[:] = [d for d in dirs if d not in ignore_dirs and not d.startswith(".")]

            for file in files:
                if file in ignore_files:
                    continue
                _, ext = os.path.splitext(file)
                if ext.lower() in scannable_extensions:
                    full_path = os.path.join(root, file)
                    if os.path.getsize(full_path) < 1_500_000:
                        collected.append(full_path)

        return collected

    def scan(self, mode: str = "full", explicit_files: List[str] = None) -> Dict[str, Any]:
        start_time = time.time()
        external_tools = self.detect_external_tools()
        files = self.collect_files(mode, self.root_dir, explicit_files)

        all_findings: List[Finding] = []

        # 1. Run Sunlit AST/Pattern Rules across files
        for file_path in files:
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()

                rel_path = os.path.relpath(file_path, self.root_dir)
                for rule in self.rules:
                    if rule.applies_to(file_path):
                        findings = rule.scan_file(rel_path, content)
                        all_findings.extend(findings)
            except Exception:
                pass

        # 2. Run Dependency Scan (npm audit)
        sunlit_app_dir = os.path.join(self.root_dir, "sunlit-app")
        if os.path.exists(sunlit_app_dir):
            dep_findings = self.dependency_rule.scan_dependencies(sunlit_app_dir)
            all_findings.extend(dep_findings)
        else:
            dep_findings = self.dependency_rule.scan_dependencies(self.root_dir)
            all_findings.extend(dep_findings)

        duration = time.time() - start_time
        metadata = {
            "scan_date": datetime.datetime.now().isoformat(),
            "mode": mode,
            "root_dir": self.root_dir,
            "files_scanned": len(files),
            "duration_seconds": duration,
            "external_tools": external_tools,
        }

        return {
            "metadata": metadata,
            "findings": all_findings,
        }


def main():
    parser = argparse.ArgumentParser(description="Sunlit Security Code Assurance Scanner")
    parser.add_argument("--mode", choices=["fast", "targeted", "full", "gate"], default="full", help="Scan mode")
    parser.add_argument("--target", default=".", help="Target root directory")
    parser.add_argument("--files", help="Comma-separated list of files to scan")
    parser.add_argument("--output-dir", default=".", help="Directory to output reports")
    parser.add_argument("--format", choices=["console", "json", "markdown", "sarif", "all"], default="all", help="Output format")

    args = parser.parse_args()

    explicit_files = [f.strip() for f in args.files.split(",")] if args.files else None
    scanner = SunlitSecurityScanner(root_dir=args.target)

    scan_mode = "targeted" if explicit_files else ("full" if args.mode == "gate" else args.mode)
    results = scanner.scan(mode=scan_mode, explicit_files=explicit_files)

    findings = results["findings"]
    metadata = results["metadata"]

    # Generate reporters
    console_reporter = ConsoleReporter()
    console_reporter.print_summary(findings, metadata)

    os.makedirs(args.output_dir, exist_ok=True)

    if args.format in ["json", "all"]:
        json_content = JsonReporter().generate(findings, metadata)
        with open(os.path.join(args.output_dir, "security-report.json"), "w", encoding="utf-8") as f:
            f.write(json_content)

    if args.format in ["markdown", "all"]:
        md_content = MarkdownReporter().generate(findings, metadata)
        with open(os.path.join(args.output_dir, "security-report.md"), "w", encoding="utf-8") as f:
            f.write(md_content)

    if args.format in ["sarif", "all"]:
        sarif_content = SarifReporter().generate(findings, metadata)
        with open(os.path.join(args.output_dir, "security-report.sarif"), "w", encoding="utf-8") as f:
            f.write(sarif_content)

    # Gate enforcement
    crit_count = sum(1 for f in findings if f.severity == Severity.P0_CRITICAL)
    high_count = sum(1 for f in findings if f.severity == Severity.P1_HIGH)

    if args.mode == "gate" and (crit_count > 0 or high_count > 0):
        print(f"\n[SECURITY GATE FAILED] Deployment Blocked: {crit_count} Critical, {high_count} High security finding(s).\n")
        sys.exit(1)

    sys.exit(0)


if __name__ == "__main__":
    main()
