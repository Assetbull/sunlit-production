#!/usr/bin/env python3
"""
Sunlit Performance Engineering Scanner & CI/CD Gate CLI

Executes automated AST and static performance auditing across the Sunlit codebase.
Evaluates bundle bloat, image optimization, dynamic imports, query performance,
and network caching rules according to the Sunlit Performance Engineering Standard.

Usage:
  python3 tools/sunlit-performance-scanner/scanner.py --mode=full
  python3 tools/sunlit-performance-scanner/scanner.py --mode=gate
"""

import argparse
import os
import sys
import time
from typing import List

# Internal modules
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
from models import PerformanceFinding, PerformanceScanResult, PerformanceSeverity, GateVerdict
from rules.bundle_analyzer import check_bundle_and_routes
from rules.image_optimizer import check_images
from rules.dependency_analyzer import check_dependencies
from rules.database_query_rule import check_queries
from rules.network_cache_rule import check_network_and_cache
from reporters.console_reporter import render_console_report
from reporters.json_reporter import render_json_report, render_sarif_report


def scan_workspace(workspace_root: str, mode: str = "full") -> PerformanceScanResult:
    start_time = time.time()
    findings: List[PerformanceFinding] = []
    scanned_file_count = 0

    # 1. Global workspace-level checks
    findings.extend(check_bundle_and_routes(workspace_root))
    findings.extend(check_network_and_cache(workspace_root))

    # 2. File-by-file AST and source scanning
    app_src = os.path.join(workspace_root, "sunlit-app", "src")
    if not os.path.isdir(app_src):
        app_src = os.path.join(workspace_root, "src")

    if os.path.isdir(app_src):
        for root, dirs, files in os.walk(app_src):
            dirs[:] = [d for d in dirs if d not in ["node_modules", ".next", ".git", "coverage", ".turbo"]]

            for file in files:
                if not (file.endswith(".ts") or file.endswith(".tsx") or file.endswith(".js") or file.endswith(".jsx")):
                    continue

                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, workspace_root)
                scanned_file_count += 1

                try:
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()

                    findings.extend(check_images(rel_path, content))
                    findings.extend(check_dependencies(rel_path, content))
                    findings.extend(check_queries(rel_path, content))

                except Exception:
                    pass

    duration = time.time() - start_time

    crit_count = sum(1 for f in findings if f.severity == PerformanceSeverity.CRITICAL)
    high_count = sum(1 for f in findings if f.severity == PerformanceSeverity.HIGH)
    med_count = sum(1 for f in findings if f.severity == PerformanceSeverity.MEDIUM)

    if crit_count > 0 or high_count > 0:
        verdict = GateVerdict.BLOCKED
    elif med_count > 0:
        verdict = GateVerdict.WARNING
    else:
        verdict = GateVerdict.PASS

    return PerformanceScanResult(
        target_path=workspace_root,
        mode=mode,
        files_scanned=scanned_file_count,
        duration_seconds=duration,
        findings=findings,
        verdict=verdict,
    )


def main():
    parser = argparse.ArgumentParser(description="Sunlit Performance Scanner & Gate")
    parser.add_argument("--workspace", default=".", help="Root directory of workspace")
    parser.add_argument("--mode", choices=["full", "gate", "audit"], default="full", help="Scan mode")
    parser.add_argument("--format", choices=["console", "json", "sarif", "all"], default="console", help="Output format")
    parser.add_argument("--output-dir", default=None, help="Directory to save reports")
    args = parser.parse_args()

    workspace_root = os.path.abspath(args.workspace)
    if os.path.basename(workspace_root) in ["tools", "sunlit-app", "sunlit-performance-scanner"]:
        workspace_root = os.path.abspath(os.path.join(workspace_root, ".."))
        if os.path.basename(workspace_root) == "tools":
            workspace_root = os.path.abspath(os.path.join(workspace_root, ".."))

    result = scan_workspace(workspace_root, mode=args.mode)

    if args.format in ["console", "all"]:
        print(render_console_report(result))

    if args.output_dir:
        os.makedirs(args.output_dir, exist_ok=True)
        if args.format in ["json", "all"]:
            json_path = os.path.join(args.output_dir, "sunlit-performance-report.json")
            with open(json_path, "w", encoding="utf-8") as f:
                f.write(render_json_report(result))
            print(f"[PERF] Saved JSON report to: {json_path}")

        if args.format in ["sarif", "all"]:
            sarif_path = os.path.join(args.output_dir, "sunlit-performance.sarif")
            with open(sarif_path, "w", encoding="utf-8") as f:
                f.write(render_sarif_report(result))
            print(f"[PERF] Saved SARIF report to: {sarif_path}")

    if args.mode == "gate" and result.verdict == GateVerdict.BLOCKED:
        sys.exit(1)
    else:
        sys.exit(0)


if __name__ == "__main__":
    main()
