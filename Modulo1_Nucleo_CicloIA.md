# Módulo 1 — Núcleo: Ecosistema de desarrollo inteligente (ChatGPT → Codex/Copilot → Warp → VSCode)

> **Objetivo del módulo**  
> Establecer y documentar un **circuito IA determinista y auditable** que conecte ChatGPT, Codex/Copilot, Warp Terminal y VSCode. El resultado será un **Playbook del Ciclo IA** (README), un **diagrama del flujo**, una **tabla de artefactos**, y un **procedimiento reproducible** en 5–7 pasos.

---

## 1) Resultados de aprendizaje

Al completar este módulo, el alumno podrá:

1. **Describir y ejecutar** el flujo ChatGPT → Codex/Copilot → Warp → VSCode.  
2. **Definir y versionar** los artefactos mínimos (código, docs, scripts, tests) por herramienta.  
3. **Aplicar checkpoints de validación** (lint, formato, build, tests) antes de ejecutar código.  
4. **Documentar prompts y decisiones** en una bitácora auditable.  
5. **Realizar rollback** de cambios de forma segura.

---

## 2) Prerrequisitos

- Cuenta activa en **GitHub** (o GitLab) y repositorio vacío o plantilla propia.  
- **VSCode** instalado con **GitHub Copilot** y **Copilot Chat** (o Codex equivalente en VibesCoding).  
- **Warp Terminal** (o terminal equivalente) con Git y motor de dependencias (npm/poetry/maven/gradle, según stack).  
- Proyecto base con estructura vacía (ver §5.1) o un repositorio nuevo.

---

## 3) Vista general del flujo

```text
+-----------+         +----------------------+         +------------+         +---------+
|  ChatGPT  |  --->   | Codex / Copilot Chat |  --->   |   VSCode   |  --->   |  Warp   |
| (prompts) |         | (genera esqueleto)   |         | (edición,  |         | (scripts|
|           |  <---   | (corrige sintaxis)   |  <---   |  refactor) |  <---   |  CI,    |
| (revisión)|         |                      |         | (commits)  |         |  tests) |
+-----------+         +----------------------+         +------------+         +---------+
     ^                                                                                  |
     |                             Documentación & Bitácora (README + /docs)            |
     +----------------------------------------------------------------------------------+
```

**Principio rector:** cada salto de herramienta deja **artefactos trazables** (archivos, commits, entradas en bitácora) y pasa por **checkpoints de validación**.

---

## 4) Tabla de artefactos por herramienta

| Herramienta | Entradas (inputs) | Salidas (artefactos) | Evidencia/Ubicación |
|---|---|---|---|
| ChatGPT | Prompt multifase (texto) | Especificaciones, listas, contratos (MD) | `/docs/prompts.md`, `/docs/specs/*.md` |
| Codex/Copilot Chat | Prompt técnico (del output de ChatGPT) | Esqueleto de carpetas, archivos fuente, stubs de tests | `/domain`, `/app`, `/infrastructure`, `/tests` |
| VSCode (+Copilot) | Código esqueleto | Refactors locales, ajustes de naming, cambios de firmas | Commits firmados, PRs |
| Warp Terminal | Scripts declarativos | Ejecución de lint/format/build/test, logs, seeds | `scripts/*`, `warpflows/*`, registro en CI |

> **Recomendación**: mantener un archivo **`/docs/artefactos.md`** que enlace cada salida con su commit y prompt de origen.

---

## 5) Entregables del módulo

1. **Playbook del ciclo IA** en `README.md`.  
2. **Diagrama simple** del flujo (ASCII o imagen) en `/docs/diagramas/flujo_ia.md`.  
3. **Tabla de artefactos** en `/docs/artefactos.md`.  
4. **Bitácora de prompts** en `/docs/prompts.md`.  
5. **Procedimiento reproducible** (5–7 pasos) en `README.md#procedimiento-reproducible`.

---

## 6) Guía paso a paso (procedimiento reproducible)

> **Tiempo estimado**: 45–60 minutos en la primera ejecución.

### 6.1 Estructura mínima de carpetas (lista “lista para copiar”)

```bash
mkdir -p docs/diagramas docs/decisiones domain app infrastructure tests scripts
touch README.md docs/artefactos.md docs/prompts.md docs/decisiones/ADR-0001.md
```

**Convención sugerida**:
- `domain/`: entidades, value objects, casos de uso, **interfaces (puertos)**.  
- `infrastructure/`: adaptadores concretos, mappers, configuración de persistencia.  
- `app/`: controladores/API, DTOs, validación, middlewares.  
- `tests/`: unit (domain), integration (infra), contract/api.  
- `scripts/`: shell/npx/poetry para lint/format/build/test/seed/smoke.

### 6.2 Inicializar repositorio y convenciones de commit

```bash
git init
git add .
git commit -m "chore(repo): bootstrap estructura núcleo + docs básicas"
git branch -M main
```

> **Sugerencia**: usar prefijos convencionales: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`.

### 6.3 Prompt multifase (Yeray) para **inicializar el ciclo IA**

Copia en **ChatGPT** y adapta `[módulo X]`:

```text
Título: Inicializar ciclo IA del módulo [X]

Contexto: Proyecto modular, arquitectura hexagonal, DDD básico. Necesito un flujo determinista y auditable entre ChatGPT → Codex/Copilot → Warp → VSCode.

Objetivo: Definir prompts, artefactos esperados y checkpoints de calidad para [módulo X].

Restricciones: Evitar acoplamientos, dependencias cíclicas y efectos secundarios. Mantener las firmas públicas estables.

Fases:
1) Inventario de entradas/salidas por herramienta (ChatGPT, Codex, VSCode, Warp) específico para [módulo X].
2) Definición de artefactos mínimos (código, docs, scripts, tests) y ubicación exacta en el repo.
3) Checkpoints de validación: linters, formato, compilación, pruebas unitarias mínimas, y comando único para ejecutarlas.
4) Plan de rollback: escenarios comunes y comandos Git para revertir estados con seguridad.
5) Bitácora: plantilla de changelog con motivo, decisión, enlace a prompt y commit asociado.

Entrega en formato Markdown, con listas y tablas listas para pegar en /docs. Incluye ejemplos antes/después cuando proceda.
```

Pega la salida en:  
- `/docs/prompts.md` (prompt + respuesta)  
- Actualiza `README.md` y `/docs/artefactos.md` con lo recibido.

### 6.4 Generación de esqueleto con **Codex/Copilot Chat**

- **Entrada**: transfiere a Copilot Chat las **especificaciones** consolidadas de ChatGPT (pega el bloque de artefactos y rutas).  
- **Salida**: genera **archivos vacíos** y **stubs** (p. ej., contratos en `domain/`, controladores vacíos en `app/`, test de humo en `tests/`).  
- **Commit**:

```bash
git add .
git commit -m "feat(skeleton): generar esqueleto de [módulo X] según artefactos definidos"
```

### 6.5 Checkpoints de validación (Warp)

Ejemplos de scripts (ajuste al stack):

```bash
# scripts/lint.sh
#!/usr/bin/env bash
set -euo pipefail
echo "[lint] iniciando..."
# ejemplo: npm run lint  | flake8 | golangci-lint | ktlint
echo "[lint] OK"

# scripts/test.sh
#!/usr/bin/env bash
set -euo pipefail
echo "[test] unitarios e integración mínimos..."
# ejemplo: npm test -- --runInBand | pytest -q | go test ./...
echo "[test] OK"

# scripts/smoke.sh
#!/usr/bin/env bash
set -euo pipefail
echo "[smoke] comprobación de arranque mínimo..."
# ejemplo: curl http://localhost:8080/health || exit 1
echo "[smoke] OK"
```

**Ejecución en Warp**:

```bash
chmod +x scripts/*.sh
./scripts/lint.sh && ./scripts/test.sh
```

> **Criterio**: no avanzar si lint/tests fallan. Documentar el fallo en la bitácora.

### 6.6 Plan de rollback (seguro y auditable)

Escenarios frecuentes y comandos:

- **Revertir último commit pero conservar cambios en el árbol de trabajo**:
  ```bash
  git reset --soft HEAD~1
  ```
- **Deshacer cambios y el commit (volver al estado anterior)**:
  ```bash
  git reset --hard HEAD~1
  ```
- **Revertir un commit ya empujado (crea un commit inverso)**:
  ```bash
  git revert <hash>
  ```
- **Crear rama de rescate antes de experimentar**:
  ```bash
  git checkout -b chore/safe-playground
  ```

Registrar en `/docs/decisiones/ADR-XXXX.md` el motivo del rollback y la alternativa elegida.

### 6.7 Bitácora de prompts y cambios

Plantilla en `/docs/prompts.md`:

```md
## Entrada 2025-10-23 13:00 CET
- Módulo: [X]
- Prompt (ChatGPT):
  > [pegar prompt]
- Respuesta clave:
  - [bullets con decisiones/artefactos]
- Commit asociado: `feat(skeleton): ...`
- Riesgos detectados: [lista breve]
- Próximos pasos: [lista breve]
```

---

## 7) Criterios de aceptación (DoD del Módulo 1)

- [ ] **README** incluye el **flujo ChatGPT → Codex → Warp → VSCode** y un **diagrama sencillo**.  
- [ ] Existe `/docs/artefactos.md` con **tabla de entradas/salidas** por herramienta y rutas.  
- [ ] **Procedimiento reproducible** (5–7 pasos) probado en local.  
- [ ] **Checkpoints de validación** funcionando: `./scripts/lint.sh`, `./scripts/test.sh` (y opcional `./scripts/smoke.sh`).  
- [ ] **Plan de rollback** documentado con comandos y escenarios.  
- [ ] **Bitácora** (`/docs/prompts.md`) con al menos **1 entrada real** enlazada a un commit.

---

## 8) Ejemplo aplicado (mini-ejercicio guiado)

> **Contexto de ejemplo**: módulo “Catálogo de Productos”.

1. **ChatGPT** (prompt multifase): solicitar **contratos** para `Producto`, **casos de uso** “ListarProductos”, **artefactos** y **tests mínimos**.  
2. **Copilot Chat**: generar  
   - `domain/entities/Producto.ts` (o equivalente en tu stack).  
   - `domain/usecases/ListarProductos.ts` (firma sin persistencia).  
   - `tests/unit/ListarProductos.spec.ts` con 1 caso feliz y 1 borde.
3. **Warp**: ejecutar `./scripts/test.sh` (test de dominio en memoria).  
4. **VSCode**: refactor de nombres y separación de responsabilidades si Copilot unió lógicas.  
5. **Commit**: `feat(domain): contratos de Producto + caso de uso listar`.  
6. **Bitácora**: registrar prompt, salida clave, riesgos (p. ej., paginación futura), y enlace al commit.

---

## 9) Plantillas listas para uso

### 9.1 README — Playbook del Ciclo IA (secciones obligatorias)

```md
# Playbook del Ciclo IA

## Propósito
Establecer un flujo determinista y auditable entre ChatGPT → Codex/Copilot → Warp → VSCode.

## Diagrama
(ASCII o imagen) ver `/docs/diagramas/flujo_ia.md`.

## Procedimiento reproducible (resumen)
1) Estructura base del repo.
2) Prompt multifase en ChatGPT.
3) Generación de esqueleto con Codex/Copilot Chat.
4) Validaciones con Warp (lint/test).
5) Commit y registro en bitácora.
6) (Opcional) Smoke test local.
7) Revisión en VSCode y PR.

## Artefactos
Véase `/docs/artefactos.md`.

## Checkpoints de calidad
- Lint y formato obligatorios antes de commit.
- Tests unitarios mínimos por caso de uso.
- Prohibido acoplar dominio a infraestructura.

## Rollback
Comandos y escenarios descritos en `/docs/decisiones/ADR-0001.md`.
```

### 9.2 `docs/artefactos.md` — Tabla base

```md
# Artefactos por herramienta

| Herramienta | Input | Output | Ruta | Commit/PR |
|---|---|---|---|---|
| ChatGPT | Prompt multifase | Especificación del módulo | /docs/specs/<modulo>.md | <hash/pr> |
| Codex/Copilot | Especificación | Esqueleto de código | /domain /app /tests | <hash/pr> |
| VSCode | Código esqueleto | Refactors y ajustes | repo | <hash/pr> |
| Warp | Scripts | Informes de lint/test/smoke | /scripts | logs/CI |
```

### 9.3 `docs/decisiones/ADR-0001.md` — Registro de decisiones

```md
# ADR-0001 — Núcleo del Ciclo IA
- Fecha: 2025-10-23
- Decisión: Adoptar flujo ChatGPT → Codex/Copilot → Warp → VSCode con bitácora obligatoria.
- Estado: Aprobada
- Consecuencias: Trazabilidad de prompts a commits; puerta de calidad antes de ejecutar.
```

---

## 10) Buenas prácticas y anti-patrones

**Buenas prácticas**
- “**Diseñar en texto, codificar en IA**”: especificar primero en ChatGPT, luego generar en Codex.  
- **Una cosa por commit** y mensajes claros.  
- **Prohibir lógica de negocio** fuera de `domain/`.  
- **Scripts idempotentes** (pueden correr varias veces sin efectos colaterales).

**Anti-patrones**
- Pegar código grande de IA **sin** pasar por la **plantilla de revisión** (Capa 2).  
- Introducir dependencias de infraestructura en el dominio.  
- No registrar prompts: **pierdes trazabilidad** y no hay auditoría.

---

## 11) Rúbrica de evaluación del módulo

| Criterio | Excelente (A) | Aceptable (B) | Insuficiente (C) |
|---|---|---|---|
| Documentación del flujo | README completo + diagrama claro | README sin diagrama o viceversa | Documentación incompleta |
| Tabla de artefactos | Completa y enlazada a commits | Completa sin enlaces | Incompleta |
| Checkpoints | Lint y tests automatizados | Solo lint o solo tests | Sin checkpoints |
| Bitácora | ≥1 entrada trazable y clara | Entrada escueta o sin enlace | Sin bitácora |
| Rollback | Escenarios + comandos probados | Comandos listados | No documentado |

---

## 12) Cierre del módulo (Definition of Done)

- [ ] Se ha **ejecutado** el procedimiento reproducible end-to-end.  
- [ ] Existen evidencias (commits, logs, bitácora).  
- [ ] Los **checkpoints pasan** localmente.  
- [ ] El equipo puede **repetir** el flujo sin asistencia.

---

### Apéndice A — Prompt “Revisión estructural” (para encadenar con el Módulo 2)

> Úsalo inmediatamente después de que Codex/Copilot genere código esqueleto.

```text
Contexto: Tengo el esqueleto de [módulo X] generado por IA.
Objetivo: Revisar y refactorizar para legibilidad, bajo acoplamiento y alta cohesión.
Restricciones: Mantener la API pública estable; no romper contratos.
Fases:
1) Diagnóstico de code smells y acoplamientos.
2) Propuesta de refactor según SOLID/DRY/KISS/YAGNI.
3) Diffs sugeridos por archivo (alto nivel).
4) Checklist de aceptación: nombres, complejidad, dependencias hacia abstracciones, tests.
5) Resumen de riesgos y próximos pasos.
```
