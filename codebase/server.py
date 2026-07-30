#!/usr/bin/env python3
"""Local same-origin server for the VLearn CP3 prototype."""

from __future__ import annotations

import argparse
import json
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Dict

from agent_core import AgentError, health, run_agent


CODEBASE = Path(__file__).resolve().parent
ROOT = CODEBASE.parent


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def _json(self, status: int, payload: Dict[str, Any]) -> None:
        raw = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(raw)

    def do_GET(self) -> None:  # noqa: N802
        if self.path == "/api/health":
            self._json(200, health())
            return
        super().do_GET()

    def do_POST(self) -> None:  # noqa: N802
        if self.path != "/api/agent":
            self._json(404, {"error": "Not found"})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length <= 0 or length > 8_000_000:
                raise AgentError("Payload trống hoặc quá lớn.")
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            self._json(200, run_agent(payload))
        except AgentError as exc:
            self._json(422, {"error": str(exc)})
        except (json.JSONDecodeError, UnicodeDecodeError):
            self._json(400, {"error": "JSON không hợp lệ."})
        except Exception as exc:  # pragma: no cover - last-resort local demo guard
            self.log_error("agent failure: %s", exc)
            self._json(500, {"error": "Agent gặp lỗi nội bộ. Xem terminal server để biết chi tiết."})


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default=os.getenv("HOST", "127.0.0.1"))
    parser.add_argument("--port", type=int, default=int(os.getenv("PORT", "8000")))
    args = parser.parse_args()
    server = ThreadingHTTPServer((args.host, args.port), Handler)
    print(f"VLearn CP3: http://{args.host}:{args.port}/codebase/")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
