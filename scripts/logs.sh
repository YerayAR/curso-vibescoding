#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Uso: ./logs.sh [servicio]
Sigue los logs en vivo del servicio indicado (web por defecto).
USAGE
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
COMPOSE_FILE="${REPO_ROOT}/infrastructure/compose.yml"

if [[ ! -f "${COMPOSE_FILE}" ]]; then
  echo "No se encontró ${COMPOSE_FILE}." >&2
  exit 1
fi

if [[ ${1:-} == "-h" || ${1:-} == "--help" ]]; then
  usage
  exit 0
fi

SERVICE="${1:-web}"

docker compose -f "${COMPOSE_FILE}" logs -f "${SERVICE}"
