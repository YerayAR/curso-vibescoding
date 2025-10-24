# Módulo 7 — Despliegue y resiliencia (CI/CD, observabilidad y rollback)
> **Objetivo del módulo**  
> Ejecutar el **despliegue final** con **automatización CI/CD**, definir **mecanismos de observabilidad** (logs, métricas mínimas, healthchecks), y establecer **estrategias de resiliencia** (rollback seguro, backups, políticas de escalabilidad y disponibilidad). Todo **agnóstico de stack** y coherente con la infraestructura del Módulo 4 y la API del Módulo 5.

---

## 1) Resultados de aprendizaje
Al finalizar, podrás:
1. Configurar una **pipeline CI/CD** reproducible con **puertas de calidad** (validaciones y pruebas de contrato).  
2. Desplegar en **entornos separados** (dev/staging/prod) con **configuración declarativa**.  
3. Implementar **observabilidad mínima**: healthchecks, logs centralizados y **sondeos de disponibilidad**.  
4. Aplicar **rollback** y **estrategias de despliegue** (blue/green o canary) con seguridad.  
5. Documentar **runbooks** de operación: respuesta a incidentes, backups y recuperación.

---

## 2) Herramientas en esta capa
- **GitHub Actions (o equivalente)**: CI/CD declarativo (YAML).  
- **ChatGPT**: generación de workflows, *runbooks* y listas de verificación; revisión de seguridad de la pipeline.  
- **VSCode**: edición de manifiestos CI/CD y archivos de entorno.  
- **Terminal** (Warp u otro): verificación manual (curl, scripts `smoke.sh`, `status.sh`).  
- **Hosting**: Render, Vercel, Docker host propio u otro proveedor. Mantén **interfaces claras** (URLs, claves, variables).

> No dependemos de gestores de paquetes; los ejemplos usan **curl**, **Docker** y archivos de texto.

---

## 3) Matriz de entornos y configuración
```md
| Entorno | Propósito       | URL base             | Llaves/Secretos            | Estrategia de datos       |
|---------|------------------|----------------------|----------------------------|---------------------------|
| dev     | Desarrollo       | http://localhost     | .env.local (no en el repo) | Volúmenes efímeros        |
| staging | Pre‑producción   | https://staging.app  | Store seguro del proveedor | Copia reducida y anonim.  |
| prod    | Producción       | https://app          | Store seguro del proveedor | Backups + retención N días |
```
**Reglas**:  
- Secretos **fuera del repo**.  
- Config por **variables de entorno** y ficheros montados.  
- Misma **topología** (compose) entre entornos, con diferencias en *overrides*.

---

## 4) Healthchecks, status y pruebas de humo
### 4.1 Healthchecks (servicios)
- **web**: `GET /` responde 200.  
- **api**: `GET /health` 200 con `{"status":"ok"}` y, opcional, dependencias básicas.  
- **db**: comando nativo (`pg_isready`) o query trivial `SELECT 1`.

### 4.2 Sondeo de disponibilidad (externo)
`/scripts/status.sh`
```bash
#!/usr/bin/env bash
set -euo pipefail
host="${1:-http://localhost}"
web="$host:8080"
api="$host:8081"

echo "[status] comprobando web y api..."
curl -fsS "$web" >/dev/null && echo "[status] web OK" || echo "[status] web FAIL"
curl -fsS "$api/health" | sed 's/.*/[status] api &/' || echo "[status] api FAIL"
```
> Programable como **cron** o *scheduled workflow* para detectar caídas.

### 4.3 Prueba de humo integrada
Reutiliza `scripts/smoke.sh` (Módulo 4) después de cada despliegue.

---

## 5) Pipeline CI/CD (GitHub Actions — plantilla agnóstica)
Ruta: `.github/workflows/deploy.yml`
```yaml
name: ci-cd

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Validaciones estáticas
        run: |
          echo "[lint] validaciones mínimas (HTML/CSS/JS)"
          # Coloca aquí validadores o scripts simples (sin dependencias externas)

      - name: Pruebas de contrato
        run: |
          echo "[contract] validar docs/tests.http de forma simulada"
          # Puedes imprimir los requests esperados o usar curl contra un entorno de staging

      - name: Build de contenedores
        run: |
          docker build -f infrastructure/docker/Dockerfile.web -t app/web:$(git rev-parse --short HEAD) .
          docker build -f infrastructure/docker/Dockerfile.api -t app/api:$(git rev-parse --short HEAD) .

  cd-staging:
    needs: [ci]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Despliegue a staging
        run: |
          echo "[deploy] staging"
          # Usa CLI del proveedor o SSH a host con docker compose pull/up
          # Ejemplo conceptual:
          # ssh user@host "docker pull app/web:${GITHUB_SHA::7} && docker pull app/api:${GITHUB_SHA::7} && cd /srv/app && docker compose up -d"

  cd-prod:
    needs: [cd-staging]
    runs-on: ubuntu-latest
    environment:
      name: production
    steps:
      - name: Despliegue a producción (blue/green o rolling)
        run: |
          echo "[deploy] prod"
          # Estrategia: levantar stack paralelo (green), pruebas de humo y switch de tráfico
          # ssh user@host "./deploy_blue_green.sh ${GITHUB_SHA::7}"
```

> Adapta comandos a tu proveedor. Mantén **scripts idempotentes** y **logs** claros.

---

## 6) Estrategias de despliegue y rollback
### 6.1 Blue/Green (recomendado)
- Levanta **“green”** con nueva versión.  
- Ejecuta **smoke** y **status** contra *green*.  
- **Cambia el tráfico** (switch) si todo pasa.  
- **Rollback**: vuelve a *blue* si fallan las comprobaciones.

### 6.2 Canary (progresivo)
- Dirige un **porcentaje pequeño** de tráfico a la nueva versión.  
- Monitorea errores/latencia.  
- Incrementa gradualmente si está sano.  
- **Abortar** si hay degradación.

### 6.3 Rollback rápido (instrucciones operativas)
- **Docker images**: etiqueta estable `:stable` y `:candidate`; `docker compose pull && up -d`.  
- **Git**: `git revert <hash>` de la PR de despliegue; redeploy del commit revertido.  
- **Datos**: revertir solo si no hay **migraciones destructivas**; si las hay, aplicar **migración inversa**.

**Runbook de Rollback (resumen)**
```md
1) Detectar -> Alertas o fallos en smoke/status.
2) Confirmar alcance -> ¿solo API/web? ¿datos afectados?
3) Accionar:
   - Switch a versión anterior (blue/green) o despliegue de imagen :stable.
   - Bloquear nuevos cambios.
4) Comunicar -> canal #incidentes con estado y ETA de recuperación.
5) Post-mortem -> causa raíz, acción preventiva.
```

---

## 7) Observabilidad mínima
### 7.1 Logs (nivel app e infra)
- **Formato estructurado** (clave:valor) para grep/parseo sencillo.  
- **Correlación** por `requestId` en la API (si aplica).  
- **No** registrar **PII** ni secretos.  
- **Rotación** y retención acorde al entorno.

### 7.2 Métricas ligeras
- **Tasa de error** (5xx, 4xx clave), **latencia** (p50/p95) y **uptime**.  
- Exportables vía **endpoint** simple (`/metrics` plano) o por logs contados.

### 7.3 Alertas (umbrales)
- **Disponibilidad**: `health` fallando > N minutos.  
- **Errores**: tasa de 5xx > umbral.  
- **Latencia**: p95 > umbral.  
- **Capacidad**: disco/CPU/memoria en niveles críticos.

> Define **SLO/SLI** básicos (ej.: *Disponibilidad 99.5% mensual*; *p95 de /rentals < 400ms*).

---

## 8) Seguridad operacional (resumen)
- **Secrets** en *stores* de proveedor o variables de entorno **encriptadas**.  
- **Cabeceras seguras** en la web (CSP, Referrer-Policy, X-Content-Type-Options, Frame-Ancestors).  
- **Principio de mínimo privilegio** en base de datos y servidores.  
- **Backups automáticos** y **pruebas periódicas de restauración**.  
- **Listas de control** previas a release (ver §10).

> Habrá un **módulo dedicado de seguridad extendida** con más detalle (modelado de amenazas y hardening).

---

## 9) Prompts de trabajo (multifase Yeray)

### 9.1 Diseño de pipeline CI/CD
```text
Título: Pipeline CI/CD con puertas de calidad y despliegue controlado

Contexto: Quiero validar web y API, construir contenedores y desplegar a staging y luego a producción con blue/green.

Solicito:
- Workflow YAML para CI (validaciones, contrato, build).
- Pasos de CD a staging y producción (agnóstico de proveedor).
- Puertas de calidad: smoke/status después de cada despliegue.
- Instrucciones de rollback y variables/secretos necesarios.
```

### 9.2 Observabilidad y alertas
```text
Título: Observabilidad mínima y alertas

Contexto: Disponibilidad, latencia p95 y tasa de error.

Solicito:
- Endpoints o logs que expongan métricas.
- Umbrales de alertas y ejemplos de reglas.
- Formato de logs estructurados y correlación requestId.
```

### 9.3 Runbook de incidentes
```text
Título: Runbook de incidentes (clasificación y respuesta)

Contexto: Quiero un procedimiento para P0, P1, P2 con comunicación y acciones.

Solicito:
- Definiciones de severidad.
- Árbol de decisión (¿rollback? ¿mitigar?).
- Plantilla de estado público/interno y post‑mortem.
```

---

## 10) Checklist previo a release (DoR/Go‑Live)
- [ ] **OpenAPI** sincronizado con la implementación.  
- [ ] **Healthchecks** responden correctamente.  
- [ ] **Smoke/status** pasan en staging.  
- [ ] **Backups** recientes y restauración probada (al menos 1 vez).  
- [ ] **Secrets** verificados (presentes y rotables).  
- [ ] **Cabeceras** de seguridad activas en web.  
- [ ] **SLO/SLI** definidos y monitorizados.  
- [ ] **Plan de rollback** probado (simulación) y documentado.

---

## 11) Procedimiento reproducible (paso a paso)
1. Crea `.github/workflows/deploy.yml` con la plantilla §5 y adáptalo a tu hosting.  
2. Configura **secretos del repositorio** (solo los necesarios).  
3. En staging, despliega y ejecuta `scripts/smoke.sh` y `scripts/status.sh`.  
4. Aplica **blue/green** con switch de tráfico tras pasar las comprobaciones.  
5. Monitorea **errores/latencia** durante la primera hora.  
6. Documenta en `/docs/runbooks/*` el resultado y aprendizajes.

**Criterios de aceptación**
- [ ] Pipeline ejecuta CI y CD con logs claros.  
- [ ] Despliegue en staging y producción **reproducibles**.  
- [ ] **Rollback** probado y documentado.  
- [ ] Observabilidad mínima operativa (métricas/sondeos).

---

## 12) Anti‑patrones y correcciones rápidas
- **Desplegar a ciegas** sin smoke/status → añade puertas de calidad.  
- **Secretos en repositorio** → migra a store seguro y revoca los expuestos.  
- **Sin plan de rollback** → prepara `:stable` y guía de reversión.  
- **Logs con PII** → anonimiza/redacta datos sensibles; define retención.

**Correcciones rápidas**
- Añadir `status.sh`, `deploy.yml` y un *runbook de rollback*.  
- Programar un **sondeo externo** (cron o monitor) para uptime.

---

## 13) Entregables del módulo
- `.github/workflows/deploy.yml` (CI/CD).  
- `scripts/status.sh` y reuso de `scripts/smoke.sh`.  
- Documentos en `/docs/runbooks/` (rollback, incidentes, post‑mortem).  
- Checklist de **Go‑Live** completo con evidencias.

---

### Apéndice A — Script de switch Blue/Green (conceptual)
`deploy_blue_green.sh` (en el host de producción)
```bash
#!/usr/bin/env bash
set -euo pipefail
IMAGE_TAG="$1" # commit corto
STACK="app"

echo "[deploy] arrancando stack GREEN con ${IMAGE_TAG}"
docker compose -f /srv/${STACK}/compose.green.yml pull
docker compose -f /srv/${STACK}/compose.green.yml up -d

echo "[deploy] pruebas de humo GREEN"
curl -fsS http://green.app/health >/dev/null

echo "[deploy] switch de tráfico"
# Actualiza el proxy/reverso o DNS a GREEN

echo "[deploy] monitorizando 10min..."
sleep 600

echo "[deploy] mantener BLUE como respaldo durante 24h"
```

---

Con este módulo tu proyecto queda **desplegado, observable y resiliente**, listo para operación continua y evolución guiada por métricas.
