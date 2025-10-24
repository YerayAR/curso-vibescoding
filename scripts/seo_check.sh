#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

check_file() {
  local path="$1"
  if [[ -f "${ROOT_DIR}/${path}" ]]; then
    echo "[ok] ${path} localizado."
  else
    echo "[pendiente] Falta ${path}." >&2
  fi
}

check_file "public/robots.txt"
check_file "public/sitemap.xml"
check_file "public/metadata/base-meta.html"
check_file "public/metadata/json-ld-organizacion.json"
check_file "public/metadata/json-ld-producto.json"

echo "Revisar manualmente: H1 único, meta description optimizada y enlaces internos actualizados."
echo "TODO: Ejecutar validación de schema con herramientas externas cuando proceda."
