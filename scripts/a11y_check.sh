#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Recordatorios rápidos de accesibilidad:"
echo "- Garantizar foco visible en toda la interfaz."
echo "- Mantener contraste mínimo 4.5:1 en texto y botones."
echo "- Validar navegación completa mediante teclado, incluyendo modales."

echo "TODO: Documentar resultados de pruebas manuales en docs/a11y/pruebas_teclado.md."
echo "TODO: Ejecutar herramientas automáticas complementarias cuando estén disponibles."
