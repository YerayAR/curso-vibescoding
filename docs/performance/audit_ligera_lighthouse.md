# Auditoría ligera tipo Lighthouse

## Pasos sugeridos
1. Abrir la landing en modo incógnito sin extensiones.
2. Ejecutar Lighthouse en Chrome o alternativa equivalente.
3. Revisar métricas de rendimiento, accesibilidad, SEO y buenas prácticas.
4. Repetir con red simulada "Slow 4G" y CPU ralentizada x4.
5. TODO: Documentar variaciones por dispositivo crítico.

## Expectativas mínimas
- Performance ≥ 85 con énfasis en LCP y CLS.
- Accesibilidad ≥ 90 validando foco y contraste.
- Best Practices ≥ 90 asegurando uso de HTTPS y recursos seguros.
- SEO ≥ 90 con metas y estructura correcta.
- TODO: Registrar resultados por fecha y versión.

## Observaciones manuales
- Verificar tamaño de bundles y recursos bloqueantes.
- Confirmar que no haya redirecciones innecesarias.
- Revisar que `manifest.webmanifest` y `service worker` respondan.
- Anotar oportunidades sugeridas por Lighthouse con responsables.
- TODO: Planificar mejoras en roadmap de optimización.
