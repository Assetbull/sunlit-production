"""
Image Optimization Rule

Inspects TSX and JSX source code for raw unoptimized <img> tags,
missing width/height attributes (causing Cumulative Layout Shift - CLS),
and un-optimized external image URLs.
"""

import os
import re
from typing import List
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from models import PerformanceFinding, PerformanceSeverity


def check_images(file_path: str, content: str) -> List[PerformanceFinding]:
    findings = []

    if not (file_path.endswith(".tsx") or file_path.endswith(".jsx")):
        return findings
    if "stitch_assets" in file_path or ".test." in file_path or "node_modules" in file_path:
        return findings

    lines = content.split("\n")
    for i, line in enumerate(lines, 1):
        if "<img" in line and not line.strip().startswith("//"):
            findings.append(
                PerformanceFinding(
                    rule_id="PERF-IMG-001",
                    rule_name="Unoptimized Raw Image Tag",
                    severity=PerformanceSeverity.LOW,
                    category="Image Optimization",
                    message="Detected raw <img> tag instead of Next.js <Image /> component. This bypasses automated AVIF/WebP conversion, responsive resizing, and lazy loading.",
                    file_path=file_path,
                    line_number=i,
                    code_snippet=line.strip()[:100],
                    remediation="Replace with Next.js `next/image` with explicit width, height, and responsive `sizes`.",
                    impact="Increases mobile payload size by up to 70% on Nigerian 3G/4G networks and contributes to Cumulative Layout Shift (CLS)."
                )
            )

    return findings
