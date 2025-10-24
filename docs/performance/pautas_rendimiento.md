# Pautas de rendimiento

## Imágenes
- Utilizar dimensiones exactas según el layout.
- Formatos modernos (WebP/AVIF) con fallback cuando sea necesario.
- Comprimir manteniendo calidad percibida > 85 %.
- TODO: Documentar herramienta de compresión aprobada.

## Carga diferida
- Lazy load para imágenes fuera del viewport.
- Defer o async para scripts no críticos.
- TODO: Evaluar precarga selectiva de fuentes.

## CSS crítico
- Inline del CSS esencial para LCP.
- Diferir hojas no críticas tras el primer render.
- Agrupar reglas compartidas para reducir duplicidad.

## Orden de recursos
1. Metas y preloads críticos.
2. CSS crítico inline.
3. CSS diferido con `media="print"` + swap.
4. Scripts esenciales antes del cierre de `<body>`.
5. Scripts secundarios con `defer`.

## Presupuesto de tamaño
- HTML inicial ≤ 50 KB.
- CSS crítico ≤ 25 KB.
- JS cargado en primera vista ≤ 150 KB.
- Imágenes hero ≤ 120 KB cada una.
- TODO: Registrar métricas reales tras la primera release.
