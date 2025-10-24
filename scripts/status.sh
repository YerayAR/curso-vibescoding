#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
COMPOSE_FILE="${REPO_ROOT}/infrastructure/compose.yml"

if [[ ! -f "${COMPOSE_FILE}" ]]; then
  echo "No se encontró ${COMPOSE_FILE}." >&2
  exit 1
fi

status_json="$(docker compose -f "${COMPOSE_FILE}" ps --format json || true)"

if [[ -z "${status_json}" ]]; then
  echo "No hay servicios registrados. Ejecuta ./scripts/up.sh primero." >&2
  exit 1
fi

export STATUS_JSON="${status_json}"

python3 - <<'PY'
import json
import os
import sys

try:
    entries = json.loads(os.environ["STATUS_JSON"])
except (KeyError, json.JSONDecodeError) as exc:
    print(f"No se pudo interpretar el estado de docker compose: {exc}", file=sys.stderr)
    sys.exit(1)

report = {"web": "FAIL", "api": "FAIL"}

for entry in entries:
    name = entry.get("Service")
    state = (entry.get("State") or "").lower()
    if name in report:
        report[name] = "OK" if "running" in state else f"FAIL ({entry.get('State', 'desconocido')})"

for name in ("web", "api"):
    print(f"{name} {report[name]}")

if all(value.startswith("OK") for value in report.values()):
    sys.exit(0)

sys.exit(1)
PY
