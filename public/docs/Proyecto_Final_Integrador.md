# Proyecto Final Integrador — “Catálogo y Alquiler” (end‑to‑end con IA)
> **Propósito**
> Integrar todo lo aprendido en los módulos 1–7 para entregar una aplicación **profesional, trazable y reproducible**: dominio claro, UI coherente, API limpia, infraestructura con contenedores, CI/CD, seguridad práctica y documentación auditable. **Stack‑agnostic** y **sin gestores de paquetes** en los ejemplos (puedes mapear a tu tecnología).

> **Nota para equipos mixtos**
> Este proyecto está redactado en un lenguaje claro para que perfiles técnicos y no técnicos puedan colaborar. Cada sección incluye recordatorios y enlaces mentales hacia los módulos previos.

---

## 1) Alcance funcional (mínimo viable)
- **Catálogo** de productos (listar, detalle simple).
- **Alquiler** (crear y cancelar), con **regla de disponibilidad** (sin solapamiento de fechas).  
- **UI estática** (HTML/CSS/JS puro) con integración básica (p. ej., lectura de JSON simulado o wiring hacia la API).  
- **API REST** mínima: `GET /products`, `POST /rentals`, `DELETE /rentals/{id}`, `GET /health`.  
- **Persistencia**: base de datos contenedorizada (ej., PostgreSQL) con **seeds**.  
- **Despliegue** con **healthchecks** y **smoke/status**; **rollback** documentado.

**No objetivos**: autenticación real de terceros, pasarelas de pago, frontends con frameworks.

---

## 2) Entregables (estructura del repo)
```text
/
├─ public/                         # web estática (M1, mejorada en M6)
│  ├─ index.html
│  ├─ assets/css/styles.css
│  └─ js/main.js
├─ domain/                         # modelo de dominio (M3)
│  ├─ glossary.md
│  ├─ entities/
│  ├─ value-objects/
│  ├─ ports/
│  ├─ use-cases/
│  └─ fakes/
├─ app/                            # capa de aplicación/API (M5, pseudocódigo neutral)
│  ├─ routes/
│  ├─ controllers/
│  ├─ dto/
│  ├─ schemas/
│  ├─ middlewares/
│  ├─ adapters/
│  └─ server/
├─ infrastructure/                 # contenedores y orquestación (M4)
│  ├─ docker/
│  │  ├─ Dockerfile.web
│  │  ├─ Dockerfile.api
│  │  └─ nginx.conf
│  ├─ compose.yml
│  └─ seeds/
│     ├─ init.sql
│     └─ demo.json
├─ scripts/                        # ciclo de vida (M4/M7)
│  ├─ up.sh  ├─ down.sh ├─ logs.sh ├─ seed.sh ├─ smoke.sh └─ status.sh
├─ docs/                           # documentación (M1, M5, M6, M7)
│  ├─ openapi.yaml
│  ├─ tests.http
│  ├─ ui-review.md
│  ├─ runbooks/
│  │  ├─ rollback.md
│  │  ├─ incidentes.md
│  │  └─ post-mortem.md
│  ├─ prompts.md
│  ├─ decisiones.md
│  ├─ artefactos.md
│  └─ diagramas/
│     └─ flujo_ia.md
└─ .github/workflows/deploy.yml    # CI/CD (M7)
```
> Ajusta nombres y rutas si lo necesitas, manteniendo la **trazabilidad** entre capas.

---

## 3) Reglas del juego
- **Sin dependencias externas obligatorias** en los ejemplos; puedes implementar la API en tu stack preferido cuando corresponda.  
- **ChatGPT y Copilot** se usan con **prompts multifase** (ver §6).  
- Toda modificación pasa por **checklists** (principios, seguridad, accesibilidad).  
- **Bitácora** obligatoria: cada bloque de trabajo deja un rastro en `docs/prompts.md` y `docs/decisiones.md`.

---

## 4) Criterios de éxito (DoD global)
- [ ] **UI**: semántica correcta, contraste y estados definidos (M6).  
- [ ] **Dominio**: entidades y VOs con invariantes; casos de uso operativos (M3).  
- [ ] **API**: controladores delgados, validación, errores uniformes, contrato OpenAPI (M5).  
- [ ] **Infra**: compose con web/api/db y healthchecks; seeds aplicadas (M4).  
- [ ] **CI/CD**: workflow ejecuta validaciones y “deploy” de referencia; smoke/status (M7).  
- [ ] **Seguridad**: checklist aplicada en frontera (API) e infraestructura (ver §9).  
- [ ] **Documentación**: README de proyecto + playbook del ciclo IA (M1) + runbooks (M7).

---

## 5) Roadmap del proyecto (fases y tiempo sugerido)
1. **Brief & alcance** (0.5d): definir contenidos de la landing y reglas clave del dominio.  
2. **Dominio** (1d): entidades, VOs, puertos, caso de uso principal “Crear alquiler”.  
3. **Infra** (0.5d): compose, seeds, healthchecks y scripts.  
4. **API** (1d): rutas ↔ casos de uso, validación y OpenAPI + pruebas de contrato.  
5. **UI** (0.5d): integración mínima (datos simulados o wiring a API), accesibilidad y coherencia.  
6. **CI/CD + Resiliencia** (0.5d): pipeline, smoke/status, rollback.  
7. **Revisión de seguridad** (0.25d): checklist y hardening básico.  
8. **Cierre** (0.25d): demo + documentación final.

> Ajusta a tu ritmo; la prioridad es **calidad y trazabilidad** sobre la cantidad.

---

## 6) Prompts clave (Yeray Style)

### 6.1 Playbook del ciclo IA (M1, adaptado al proyecto)
```text
Título: Inicializar ciclo IA del proyecto integrador

Contexto: Proyecto modular, arquitectura hexagonal, dominio “Catálogo y Alquiler”. Busco flujo determinista y auditable.

Objetivo: Definir prompts, artefactos esperados y checkpoints de calidad.

Fases:
1) Inventario de entradas/salidas por herramienta (ChatGPT, Copilot, VSCode, Terminal).
2) Artefactos mínimos (código, docs, scripts, tests/manual).
3) Checkpoints de validación (lint semántico, build estático, tests.http simulados).
4) Plan de rollback (estrategias y guías operativas).
5) Bitácora: estructura de changelog con motivo, decisión y enlace a prompt.

Criterios de aceptación: README con flujo, diagrama simple y 5–7 pasos reproducibles.
```

### 6.2 Revisión estructural (M2)
```text
Título: Revisión estructural integral (SOLID/DRY/KISS/YAGNI + Clean)

Contexto: Revisa dominio, app y adapters. Detecta acoplamientos, duplicación y violaciones de principios.

Fases: diagnóstico, refactor propuesto, patrones aplicables, validación, entregables (diffs de alto nivel).
```

### 6.3 Diseño de dominio (M3)
```text
Título: Entidades, VOs y casos de uso (alquiler sin solape)

Contexto: Define VOs [Email, DateRange], Entidades [Product, Rental], puertos y caso de uso createRental. Incluye invariantes y ejemplos GWT.
```

### 6.4 Infra y seeds (M4)
```text
Título: Topología y seeds

Contexto: Web por Nginx, API placeholder con health, PostgreSQL con init.sql. Scripts up/down/logs/seed/smoke/status. Notas de seguridad (secrets/headers).
```

### 6.5 API y OpenAPI (M5)
```text
Título: Tabla de rutas y contratos

Contexto: GET /products, POST /rentals, DELETE /rentals/{id}, GET /health. Genera DTOs, esquemas, errores uniformes y openapi.yaml + tests.http.
```

### 6.6 Coherencia UI (M6)
```text
Título: Auditoría UI ↔ dominio ↔ API

Contexto: Ver semántica, microcopys, estados y nombres alineados con OpenAPI y el glosario. Proponer difs mínimos.
```

### 6.7 CI/CD y resiliencia (M7)
```text
Título: Pipeline CI/CD y rollback

Contexto: Validaciones, build de contenedores, despliegue a staging y producción (blue/green), smoke/status post-deploy y runbook de rollback.
```

---

## 7) Datos de ejemplo y seeds
**PostgreSQL** (`infrastructure/seeds/init.sql`):
```sql
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS rentals (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  from_date DATE NOT NULL,
  to_date   DATE NOT NULL
);

INSERT INTO products (id, name, brand) VALUES
  ('p1','Cámara compacta','Lumix'),
  ('p2','Trípode aluminio','Manfrotto')
ON CONFLICT (id) DO NOTHING;
```

**JSON demo** (`infrastructure/seeds/demo.json`):
```json
{
  "products": [
    {"id":"p1","name":"Cámara compacta","brand":"Lumix"},
    {"id":"p2","name":"Trípode aluminio","brand":"Manfrotto"}
  ]
}
```

---

## 8) Pruebas de contrato (archivo `.http`)
`docs/tests.http` (VSCode REST Client, ajusta URL si cambias puertos):
```http
### Health
GET http://localhost:8081/health

### Listar productos
GET http://localhost:8081/products

### Crear alquiler OK
POST http://localhost:8081/rentals
Authorization: Bearer demo-token
Content-Type: application/json

{
  "id": "r100",
  "productId": "p1",
  "customerEmail": "a@b.com",
  "range": { "from":"2025-10-25", "to":"2025-10-28" }
}

### Crear alquiler con solape → 409
POST http://localhost:8081/rentals
Authorization: Bearer demo-token
Content-Type: application/json

{
  "id": "r101",
  "productId": "p1",
  "customerEmail": "x@y.com",
  "range": { "from":"2025-10-27", "to":"2025-10-29" }
}

### Cancelar alquiler
DELETE http://localhost:8081/rentals/r100
Authorization: Bearer demo-token
```

---

## 9) Seguridad (resumen operativo para el proyecto)
- **Frontera API**: exigir **AuthN/AuthZ** en mutaciones; validación estricta; **cabeceras** (CORS, no revelar versión).  
- **Dominio**: reglas de permiso explícitas en casos de uso (no en controladores).  
- **Infra**: secretos fuera del repo; **TLS** donde aplique; **healthchecks** activos; volúmenes con permisos mínimos.  
- **UI**: **CSP** desde Nginx; evitar recursos de tracking; accesibilidad y privacidad.  
- **Prompts**: no colocar secretos ni datos reales; usar datos sintéticos.

**Checklist breve**
- [ ] Todas las mutaciones verifican identidad/permisos.  
- [ ] Validación de payload y tamaños máximos.  
- [ ] Secretos gestionados fuera del código.  
- [ ] Logs sin PII; política de retención.  
- [ ] CSP y headers seguros en la web.

---

## 10) Proceso reproducible (paso a paso)
1. **Brief**: generar `docs/brief.md` (M1) y definir alcance exacto (textos, paleta, CTAs).  
2. **Dominio**: construir `domain/*` con prompts §6.3 y validar **createRental** con fakes.  
3. **Infra**: preparar `infrastructure/*` y `scripts/*`; comprobar con `smoke.sh` y `status.sh`.  
4. **API**: mapear rutas ↔ casos de uso; generar `openapi.yaml` y `tests.http`; validar manualmente.  
5. **UI**: generar/ajustar landing y secciones; ejecutar auditorías (M6) y corregir difs.  
6. **CI/CD**: activar workflow y simular despliegue a staging; preparar **rollback**.  
7. **Seguridad**: pasar checklist §9 y registrar hallazgos.  
8. **Demo final**: grabar una **secuencia** de uso (capturas o gif) y anexarla a `README`.

---

## 11) Evaluación (rúbrica)
| Criterio | Excelente (A) | Bueno (B) | A mejorar (C) |
|---|---|---|---|
| Dominio | Entidades/VOs sólidos; reglas claras y fakes útiles | Entidades/VOs correctos con detalles menores | Reglas implícitas o VO faltantes |
| API | Controladores delgados; OpenAPI fiable; pruebas de contrato | OpenAPI con leves inconsistencias | Controlador con lógica; contrato desincronizado |
| UI | Semántica y accesibilidad OK; coherencia con dominio/API | Pequeñas incoherencias o contrastes | Semántica pobre; estados ausentes |
| Infra | Compose limpio; healthchecks y seeds | Compose funcional con detalles | Falta health/volúmenes/seeds |
| CI/CD | Pipeline con puertas de calidad y rollback probado | Pipeline sin rollback simulado | Sin pipeline |
| Seguridad | Checklist satisfecho; headers y secretos correctos | Menores ajustes pendientes | Faltan controles clave |
| Trazabilidad | Bitácora completa y ADRs clave | Bitácora parcial | Sin trazabilidad |

---

## 12) README de proyecto (plantilla)
```md
# Catálogo y Alquiler — Proyecto Integrador

## Descripción
Landing estática + API mínima + dominio con reglas de disponibilidad. Infra reproducible y CI/CD.

## Cómo correr (local)
1) `./scripts/up.sh`
2) Web: http://localhost:8080
3) API: http://localhost:8081/health
4) Smoke: `./scripts/smoke.sh`

## Documentación
- Contrato API: `docs/openapi.yaml`
- Pruebas: `docs/tests.http`
- Bitácora: `docs/prompts.md`
- Decisiones: `docs/decisiones.md`
- Runbooks: `docs/runbooks/*`

## Seguridad
CSP, validación, Auth para mutaciones, secretos fuera del repo.

## Licencia
[MIT] u otra aplicable.
```

---

## 13) Consejos finales
- **Primero claridad, luego complejidad**: KISS y YAGNI siempre.
- **Una cosa por commit** y mensajes con intención.
- **Prompts** como contrato: pide tablas de archivos y criterios de aceptación.
- **Documenta** fallos y aprendizajes: serán oro para la siguiente versión.

---

## Glosario esencial del proyecto
- **ADR (Architecture Decision Record):** documento corto donde explicas una decisión técnica importante y su motivo.
- **Go-Live:** momento en el que tu sistema comienza a ser utilizado por personas reales.
- **Hito end-to-end:** recorrido completo desde la idea hasta el despliegue y monitoreo de la solución.
- **Smoke test:** prueba rápida que confirma que las funciones básicas siguen vivas después de un cambio.
- **Trazabilidad:** capacidad de seguir cada cambio desde la idea hasta su implementación y validación.

---

### Apéndice A — Prompt de demo final
```text
Quiero un guion de demo en 6–8 pasos que muestre: web, contrato API, creación de alquiler (OK y solape), healthchecks, smoke/status y plan de rollback. Incluye comandos (si aplica), URLs y resultados esperados.
```

### Apéndice B — Prompt de hardening rápido (24h antes del Go‑Live)
```text
Hazme un checklist de hardening exprés para web estática + API + DB + CI/CD: secretos, headers, permisos de volúmenes, rotación de logs, backups y alertas de disponibilidad.
```

---

Con este **Proyecto Final Integrador** cierras el circuito IA **de forma profesional**: diseño, generación asistida, validación, despliegue y operación segura, todo **trazable** y **reproducible**.
