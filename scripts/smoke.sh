#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
COMPOSE_FILE="${REPO_ROOT}/infrastructure/compose.yml"

if [[ ! -f "${COMPOSE_FILE}" ]]; then
  echo "No se encontró ${COMPOSE_FILE}." >&2
  exit 1
fi

check_endpoint() {
  local name="$1"
  local url="$2"
  echo "Verificando ${name} (${url})..."
  if curl -fsS --max-time 5 "${url}" > /dev/null; then
    echo "${name}: OK"
    return 0
  else
    echo "${name}: FAIL" >&2
    return 1
  fi
}

main() {
  local status=0

  check_endpoint "web" "http://localhost:8080" || status=1
  check_endpoint "api" "http://localhost:8081/health" || status=1

  if [[ ${status} -eq 0 ]]; then
    echo "Smoke tests completados correctamente."
  else
    echo "Alguna verificación falló." >&2
  fi

  return "${status}"
}

main "$@"
