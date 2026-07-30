"""Make `codebase/mcp`'s packages importable from the backend without installing them.

`gmail_mcp_client` ships as a real package but was never `pip install`-ed into
any venv here (its own package dir sits one level under a `pyproject.toml`
that nothing has run). Rather than depend on that install step, we just add
its directory to `sys.path` before anything imports it.
"""

from __future__ import annotations

import sys
from pathlib import Path

MCP_ROOT = Path(__file__).resolve().parents[2] / "mcp"
GMAIL_CLIENT_ROOT = MCP_ROOT / "gmail_mcp_client"

for _path in (GMAIL_CLIENT_ROOT,):
    _path_str = str(_path)
    if _path.exists() and _path_str not in sys.path:
        sys.path.insert(0, _path_str)
