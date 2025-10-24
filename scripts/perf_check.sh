#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Verificando elementos clave de rendimiento..."

if [[ -f "${ROOT_DIR}/public/manifest.webmanifest" ]]; then
  echo "[ok] manifest.webmanifest encontrado."
else
  echo "[pendiente] Falta manifest.webmanifest." >&2
fi

BASE_META="${ROOT_DIR}/public/metadata/base-meta.html"
if [[ -f "${BASE_META}" ]]; then
  echo "[ok] base-meta.html listo para revisar el orden de CSS/JS."
else
  echo "[pendiente] Falta base-meta.html." >&2
fi

echo "Recordatorio de presupuestos: imágenes ≤ 120 KB, JS inicial ≤ 150 KB, CSS crítico ≤ 25 KB."
echo "TODO: Registrar pesos reales y anotar recursos bloqueantes detectados."
