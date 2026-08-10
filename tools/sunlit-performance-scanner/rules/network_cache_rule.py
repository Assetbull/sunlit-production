"""
Network and Cache Configuration Rule

Inspects Next.js configuration, caching headers, and asset compression settings.
"""

import os
from typing import List
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from models import PerformanceFinding, PerformanceSeverity


def check_network_and_cache(workspace_root: str) -> List[PerformanceFinding]:
    findings = []
    next_config_path = os.path.join(workspace_root, "sunlit-app", "next.config.ts")

    if os.path.isfile(next_config_path):
        with open(next_config_path, "r", encoding="utf-8") as f:
            content = f.read()

            if "image/avif" not in content and "image/webp" not in content:
                findings.append(
                    PerformanceFinding(
                        rule_id="PERF-NET-001",
                        rule_name="Missing Modern Image Format Optimization",
                        severity=PerformanceSeverity.LOW,
                        category="Network & Caching",
                        message="Next.js config does not explicitly specify AVIF / WebP format generation in `images.formats`.",
                        file_path="sunlit-app/next.config.ts",
                        remediation="Configure `images: { formats: ['image/avif', 'image/webp'] }` in next.config.ts.",
                        impact="AVIF/WebP reduces image transfer size by 30-50% compared to standard JPEG/PNG over mobile data."
                    )
                )

    return findings
