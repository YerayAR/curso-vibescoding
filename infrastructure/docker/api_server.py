"""Minimal HTTP server exposing a health endpoint.

The server is intentionally lightweight to act as a placeholder API while
remaining production-friendly: it uses a threading server for concurrency,
implements structured responses, and defends against malformed requests.
"""
from __future__ import annotations

import json
import logging
import os
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Dict

LOGGER = logging.getLogger("placeholder_api")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")


def _safe_load_env(name: str, default: str) -> str:
    """Read an environment variable returning a sanitized fallback when missing."""
    value = os.getenv(name, default)
    if not value:
        LOGGER.warning("Environment variable %s is empty; using default %s", name, default)
        return default
    return value


def build_payload(status: str) -> Dict[str, str]:
    """Return a JSON-serialisable payload for the API responses."""
    return {"status": status}


class HealthHandler(BaseHTTPRequestHandler):
    """Serve a basic health endpoint with defensive defaults."""

    server_version = "PlaceholderAPI/1.0"

    def _set_common_headers(self, status_code: int) -> None:
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()

    def _write_response(self, payload: Dict[str, str]) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.wfile.write(body)

    def do_GET(self) -> None:  # noqa: N802 (BaseHTTPRequestHandler API)
        """Handle GET requests with explicit routing."""
        if self.path == "/health":
            self._set_common_headers(HTTPStatus.OK)
            self._write_response(build_payload("ok"))
            return

        LOGGER.warning("Unsupported path requested: %s", self.path)
        self._set_common_headers(HTTPStatus.NOT_FOUND)
        self._write_response(build_payload("not_found"))

    def log_message(self, format: str, *args: object) -> None:  # noqa: A003 - inherited name
        """Route default access logs through the Python logger."""
        LOGGER.info("%s - %s", self.address_string(), format % args)


def main() -> None:
    """Start the HTTP server with safe defaults."""
    host = _safe_load_env("SERVICE_HOST", "0.0.0.0")
    port = int(_safe_load_env("SERVICE_PORT", "8000"))

    server = ThreadingHTTPServer((host, port), HealthHandler)
    LOGGER.info("Starting placeholder API on %s:%s", host, port)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        LOGGER.info("Received shutdown request.")
    finally:
        server.server_close()
        LOGGER.info("Server stopped cleanly.")


if __name__ == "__main__":
    main()
