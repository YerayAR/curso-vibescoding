#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
COMPOSE_FILE="${REPO_ROOT}/infrastructure/compose.yml"

if [[ ! -f "${COMPOSE_FILE}" ]]; then
  echo "No se encontró ${COMPOSE_FILE}." >&2
  exit 1
fi

run_compose() {
  docker compose -f "${COMPOSE_FILE}" "$@"
}

main() {
  echo "Construyendo imágenes..."
  run_compose build

  echo "Levantando servicios en segundo plano..."
  run_compose up -d

  echo "Estado actual de los contenedores:"
  run_compose ps
}

main "$@"
