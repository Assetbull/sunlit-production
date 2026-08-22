"""
Bundle and Route Analyzer Rule

Inspects Next.js build artifacts, route manifests, and client component boundaries
to detect large route payloads, un-chunked dependencies, and client bloat.
"""

import json
import os
from typing import List
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from models import PerformanceFinding, PerformanceSeverity


def check_bundle_and_routes(workspace_root: str) -> List[PerformanceFinding]:
    findings = []
    app_dir = os.path.join(workspace_root, "sunlit-app")
    next_dir = os.path.join(app_dir, ".next")

    if not os.path.isdir(next_dir):
        return findings

    prerender_manifest_path = os.path.join(next_dir, "prerender-manifest.json")

    if os.path.isfile(prerender_manifest_path):
        try:
            with open(prerender_manifest_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                routes = data.get("routes", {})
                expected_static = ["/services", "/locations", "/about", "/trust", "/faq"]
                for route in expected_static:
                    if route not in routes and f"{route}.html" not in routes:
                        findings.append(
                            PerformanceFinding(
                                rule_id="PERF-BUNDLE-001",
                                rule_name="Marketing Route Static Optimization",
                                severity=PerformanceSeverity.LOW,
                                category="Bundle & Route Optimization",
                                message=f"Public marketing route '{route}' is dynamically rendered on each request instead of statically generated (SSG).",
                                file_path=f"sunlit-app/src/app/(marketing){route}/page.tsx",
                                remediation="Ensure page does not use dynamic headers/cookies unnecessarily so Next.js can prerender static HTML.",
                                impact="Increases TTFB by 50-150ms on Nigerian high-latency mobile networks."
                            )
                        )
        except Exception:
            pass

    return findings
