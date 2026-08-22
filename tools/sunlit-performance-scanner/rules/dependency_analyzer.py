"""
Dependency and Dynamic Import Analyzer Rule

Inspects source code for heavy third-party client imports (e.g. three.js, heavy charts,
complex 3D engines) imported directly into top-level client bundles without dynamic splitting.
"""

import os
import re
from typing import List
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from models import PerformanceFinding, PerformanceSeverity


HEAVY_LIBS = [
    ("three", "Three.js 3D Engine (approx 600KB uncompressed)", "PERF-DEP-001"),
    ("chart.js", "Chart.js Library", "PERF-DEP-002"),
    ("pdfjs-dist", "PDF.js Engine", "PERF-DEP-003"),
]


def check_dependencies(file_path: str, content: str) -> List[PerformanceFinding]:
    findings = []

    if not (file_path.endswith(".tsx") or file_path.endswith(".ts")):
        return findings
    if "node_modules" in file_path or ".test." in file_path:
        return findings

    for lib, description, rule_id in HEAVY_LIBS:
        pattern = rf'import\s+(?!type\s)(?:[\w*\s{{}},]+)\s+from\s+[\'"]{lib}[\'"]'
        match = re.search(pattern, content)
        if match:
            if "dynamic(" not in content and "lazy(" not in content:
                line_no = content[:match.start()].count("\n") + 1
                findings.append(
                    PerformanceFinding(
                        rule_id=rule_id,
                        rule_name=f"Heavy Static Import: {lib}",
                        severity=PerformanceSeverity.MEDIUM,
                        category="Bundle Splitting & Dynamic Imports",
                        message=f"Direct static import of {description} in '{os.path.basename(file_path)}' inflates the initial route JavaScript bundle.",
                        file_path=file_path,
                        line_number=line_no,
                        code_snippet=match.group(0),
                        remediation=f"Use Next.js dynamic import (`dynamic(() => import('{lib}'), {{ ssr: false }})`) to load this module only when requested by the user.",
                        impact="Adds substantial blocking JS parse and execution time, degrading Interaction to Next Paint (INP) and Time to Interactive (TTI)."
                    )
                )

    return findings
