"""
Database Query and API Efficiency Rule

Inspects API endpoints and database service files for performance anti-patterns:
  - Unbounded queries (`SELECT *` without explicit limits)
  - Missing pagination on collections
  - Cascading N+1 queries in loops
  - Sequential requests that can be parallelized with Promise.all
"""

import os
import re
from typing import List
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from models import PerformanceFinding, PerformanceSeverity


def check_queries(file_path: str, content: str) -> List[PerformanceFinding]:
    findings = []

    if not ("/api/" in file_path or "/services/" in file_path or "/core/" in file_path):
        return findings
    if not (file_path.endswith(".ts") or file_path.endswith(".tsx")):
        return findings
    if ".test." in file_path:
        return findings

    # 1. Unbounded Supabase .select('*') without .limit() or pagination
    if ".from(" in content and ".select(" in content:
        lines = content.split("\n")
        for i, line in enumerate(lines, 1):
            if ".select(" in line and ".limit(" not in line and "count(" not in line:
                surrounding = "\n".join(lines[i-1:min(len(lines), i+4)])
                if ".limit(" not in surrounding and ".single()" not in surrounding and ".maybeSingle()" not in surrounding and ".range(" not in surrounding:
                    findings.append(
                        PerformanceFinding(
                            rule_id="PERF-DB-001",
                            rule_name="Unbounded Database Query Projection",
                            severity=PerformanceSeverity.LOW,
                            category="Database & Query Performance",
                            message="Database query executes without explicit row limit (`.limit()`, `.range()`, or `.single()`).",
                            file_path=file_path,
                            line_number=i,
                            code_snippet=line.strip()[:100],
                            remediation="Add explicit pagination (`.limit(pageSize).range(from, to)`) or project only required columns.",
                            impact="As table rows grow, unbounded queries cause memory pressure, slow database queries (>1s), and high egress costs."
                        )
                    )

    # 2. Sequential await inside for-loops (Potential N+1 waterfall)
    for_loop_match = re.search(r'for\s*\([^)]+\)\s*\{[^}]*await\s+(?:fetch|supabase|db\.)[^}]*\}', content, re.DOTALL)
    if for_loop_match:
        line_no = content[:for_loop_match.start()].count("\n") + 1
        findings.append(
            PerformanceFinding(
                rule_id="PERF-DB-002",
                rule_name="Sequential Await Loop (N+1 Waterfall)",
                severity=PerformanceSeverity.MEDIUM,
                category="Database & Query Performance",
                message="Sequential asynchronous operations executed inside a synchronous loop, causing request waterfalls.",
                file_path=file_path,
                line_number=line_no,
                code_snippet=for_loop_match.group(0)[:120] + "...",
                remediation="Refactor to batch queries using `IN (...)` or parallelize safe concurrent queries using `Promise.all()`.",
                impact="Multiplies network latency linearly by item count (N * latency), easily exceeding 1-second response targets."
            )
        )

    return findings
