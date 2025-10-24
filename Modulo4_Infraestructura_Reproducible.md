# Módulo 4 — Infraestructura (reproducible y desacoplada)
> **Objetivo del módulo**
> Entregar una **infraestructura reproducible** y **desacoplada del negocio**, con contenedores, redes, volúmenes, semillas de datos y scripts de ciclo de vida. Se trabajará con **Docker / Docker Compose**, **control de versiones con Git**, adaptadores de persistencia y **scripts declarativos** que puedas ejecutar desde cualquier terminal (Warp u otro).

> **Nota para quienes nunca tocaron infraestructura**
> Pensá en esta parte como armar cajas ordenadas donde vive tu aplicación. Explicamos cada paso en lenguaje simple para que puedas montar y repetir el entorno sin conocimientos previos de servidores.

---

## 1) Resultados de aprendizaje
Al finalizar, podrás:
1. Diseñar una **topología mínima** por servicios (web estática, API placeholder, base de datos).  
2. Crear **contenedores** con *healthchecks*, **volúmenes persistentes** y **redes privadas**.  
3. Preparar **semillas de datos** (SQL/JSON) y **scripts de ciclo de vida**: up, down, logs, seed, status.  
4. Establecer una **convención de ramas y PRs** y un **flujo de versionado** claro.  
5. Documentar la infraestructura y verificarla con **pruebas de humo** reproducibles.

---

## 2) Herramientas (rol en esta capa)
- **ChatGPT**: diseña la topología, redacta `docker-compose.yml`, `Dockerfile` y *healthchecks*.  
- **Copilot/Codex**: genera bloques de configuración y archivos de seeds; propone mejoras sintácticas.  
- **VSCode**: edición de manifiestos, *diff view* y navegación por carpetas.  
- **Terminal** (Warp o similar): ejecutar scripts (`./scripts/up.sh`, `./scripts/seed.sh`, etc.).  
- **Git**: ramas por feature, PRs, etiquetas (tags) para releases, y registro de cambios.

> **Nota:** mantenemos esta capa **independiente del dominio**. La lógica de negocio **no** se introduce aquí.

---

## 3) Estructura base de infraestructura
```text
/infrastructure
  ├─ docker/
  │  ├─ Dockerfile.web          # para servir la web estática con Nginx
  │  ├─ Dockerfile.api          # placeholder de API (servidor mínimo)
  │  └─ nginx.conf              # config opcional de Nginx (CSP/caché)
  ├─ compose.yml                # orquestación de servicios
  ├─ seeds/
  │  ├─ init.sql                # ejemplo de semilla para PostgreSQL
  │  └─ demo.json               # ejemplo para seeds en adaptadores
  └─ README.md                  # instrucciones de uso
/scripts
  ├─ up.sh       # levanta servicios
  ├─ down.sh     # para y limpia
  ├─ logs.sh     # follow logs por servicio
  ├─ seed.sh     # ejecuta semillas
  └─ smoke.sh    # pruebas de humo (conexión/health)
```

---

## 4) Topología mínima (ejemplo reproducible)
Servicios:
- **web**: sirve tu **web estática** del Módulo 1 desde Nginx.  
- **api** *(placeholder)*: un contenedor con un “health endpoint” para validar red y dependencias.  
- **db**: base de datos (ej. PostgreSQL) con volumen persistente y **semillas** (`init.sql`).  
- **admin** *(opcional)*: cliente web de administración (ej. Adminer) para inspección manual.

---

## 5) Manifiestos de contenedores y Compose

### 5.1 `infrastructure/docker/Dockerfile.web`
```dockerfile
FROM nginx:alpine
# Copia la web estática al docroot de Nginx
COPY ./public /usr/share/nginx/html

# Config opcional (CSP/headers) si defines nginx.conf
# COPY ./infrastructure/docker/nginx.conf /etc/nginx/conf.d/default.conf

HEALTHCHECK --interval=10s --timeout=3s --retries=5 CMD wget -qO- http://localhost/ || exit 1
```

> **Nota:** coloca tu web estática (del Módulo 1) en `/public` en la raíz del repo.

### 5.2 `infrastructure/docker/Dockerfile.api` (placeholder, sin lógica de negocio)
```dockerfile
FROM busybox:stable
# Simula un servicio API con un health simple (puerto 8080)
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s --retries=5 CMD wget -qO- http://localhost:8080/health || exit 1
CMD sh -c "printf 'HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n{\"status\":\"ok\"}' | nc -l -p 8080 -q 1"
```

> Más adelante podrás reemplazar este contenedor por tu API real, sin cambiar la topología.

### 5.3 `infrastructure/compose.yml`
```yaml
version: "3.9"

networks:
  appnet:
    driver: bridge

volumes:
  pgdata:

services:
  web:
    build:
      context: ..
      dockerfile: infrastructure/docker/Dockerfile.web
    container_name: demo_web
    ports:
      - "8080:80"
    networks: [appnet]
    depends_on:
      - api
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost"]
      interval: 10s
      timeout: 3s
      retries: 5

  api:
    build:
      context: ..
      dockerfile: infrastructure/docker/Dockerfile.api
    container_name: demo_api
    ports:
      - "8081:8080"
    networks: [appnet]
    depends_on:
      - db
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:8080/health"]
      interval: 10s
      timeout: 3s
      retries: 5

  db:
    image: postgres:16-alpine
    container_name: demo_db
    environment:
      POSTGRES_USER: demo
      POSTGRES_PASSWORD: demo
      POSTGRES_DB: app
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./seeds/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks: [appnet]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U demo -d app"]
      interval: 10s
      timeout: 5s
      retries: 10

  admin:
    image: adminer:latest
    container_name: demo_admin
    depends_on:
      - db
    ports:
      - "8082:8080"
    environment:
      - ADMINER_DEFAULT_SERVER=db
    networks: [appnet]
```

---

## 6) Semillas de datos (ejemplo)
### 6.1 `infrastructure/seeds/init.sql`
```sql
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL
);

INSERT INTO products (id, name, brand) VALUES
  ('p1','Cámara compacta','Lumix'),
  ('p2','Trípode aluminio','Manfrotto')
ON CONFLICT (id) DO NOTHING;
```

### 6.2 `infrastructure/seeds/demo.json`
```json
{
  "rentals": [
    {"id":"r1","productId":"p1","customerEmail":"demo@acme.test","from":"2025-10-25","to":"2025-10-28"}
  ]
}
```

---

## 7) Scripts de ciclo de vida (terminal simple)

### `/scripts/up.sh`
```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
docker compose -f infrastructure/compose.yml up -d --build
docker compose -f infrastructure/compose.yml ps
```

### `/scripts/down.sh`
```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
docker compose -f infrastructure/compose.yml down -v
```

### `/scripts/logs.sh`
```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
service="${1:-web}"
docker compose -f infrastructure/compose.yml logs -f "$service"
```

### `/scripts/seed.sh`
```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
# Ejemplo: cargar un JSON a la API placeholder (a futuro, un endpoint /seed)
if command -v jq >/dev/null 2>&1; then
  echo "[seed] Nota: la API real deberá exponer un endpoint para cargar seeds."
else
  echo "[seed] jq no está disponible. Este seed es un placeholder para futuras integraciones."
fi
```

### `/scripts/smoke.sh`
```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

ok=1
curl -fsS http://localhost:8080 >/dev/null || ok=0
curl -fsS http://localhost:8081/health >/dev/null || ok=0

if [ "$ok" -eq 1 ]; then
  echo "[smoke] OK: web y api responden"
  exit 0
else
  echo "[smoke] ERROR: algún servicio no responde"
  exit 1
fi
```

> Asegura permisos: `chmod +x scripts/*.sh`.

---

## 8) Flujo de trabajo con Git (sugerido)
- **Ramas**: `main` protegido; `feature/*` para cambios; `hotfix/*` para urgencias.  
- **PRs**: una mejora por PR; descripción con **qué**, **por qué** y **cómo probar** (incluye `./scripts/smoke.sh`).  
- **Etiquetas (tags)**: `v0.1.0`, `v0.2.0` para releases; documenta cambios en `CHANGELOG.md`.  
- **Política de commits**: mensajes claros (prefijos `feat`, `fix`, `chore`, `docs`, `refactor`, `infra`).

---

## 9) Seguridad (aplicable a la infraestructura)
- **Secrets fuera del repo**: variables de entorno, ficheros montados, almacenes seguros.  
- **Red de contenedores** cerrada (solo exponer puertos necesarios).  
- **CSP/headers** en `nginx.conf` para la web estática (CSP, Referrer-Policy, X-Content-Type-Options, etc.).  
- **Usuarios de BD** con **mínimo privilegio**; conexiones cifradas cuando aplique.  
- **Logs** sin datos sensibles; rotación definida.  
- **Healthchecks** activos: detectan fallos rápido.

> Más adelante habrá una **capa dedicada a seguridad** con mayor detalle (modelado de amenazas, hardening, políticas y automatización).

---

## 10) Procedimiento reproducible (paso a paso)
1. Copia la **web estática** del Módulo 1 a `./public`.  
2. Crea los archivos de `infrastructure/docker/*`, `infrastructure/compose.yml` y `infrastructure/seeds/*`.  
3. Crea los **scripts** en `/scripts` y dales permisos (`chmod +x`).  
4. Ejecuta: `./scripts/up.sh` y verifica `http://localhost:8080` (web) y `http://localhost:8081/health` (api).  
5. Ejecuta: `./scripts/smoke.sh` (prueba de humo).  
6. (Opcional) Abre **Adminer** en `http://localhost:8082` y comprueba la tabla `products`.  
7. Documenta en `infrastructure/README.md` y registra cambios con Git.

**Checklist de aceptación**
- [ ] `compose.yml` con servicios **web/api/db** y **healthchecks** activos.  
- [ ] Web estática servida por **Nginx** en `:8080`.  
- [ ] API placeholder responde `status: ok` en `:8081/health`.  
- [ ] BD con **seeds** aplicados y volumen persistente.  
- [ ] Scripts `up/down/logs/seed/smoke` funcionando.  
- [ ] Documentación y PR con pasos de verificación.

---

## 11) Anti‑patrones y correcciones rápidas
- **Aislamiento deficiente**: todos los servicios en la red pública → usa una **red privada** y expón solo lo necesario.  
- **Sin healthchecks**: difícil detectar fallos → añade pruebas en `compose.yml`.  
- **Secretos en el repo**: nunca; usa variables de entorno/volúmenes/almacenes.  
- **Logs ruidosos**: filtra y centraliza si crece el proyecto.

**Correcciones rápidas**
- Añadir `networks`, `healthcheck`, y mover secretos a entorno seguro.  
- Dividir `compose.yml` por perfiles si crece (`compose.override.yml`).

---

## 12) Entregables del módulo
- `infrastructure/compose.yml` y `infrastructure/docker/*` con **healthchecks**.
- `infrastructure/seeds/*` con datos de ejemplo.
- Scripts en `/scripts` para el ciclo de vida.
- `infrastructure/README.md` con instrucciones y **prueba de humo**.
- PR con evidencia (capturas/registro) del **arranque correcto**.

---

## Glosario esencial del módulo
- **Contenedor:** paquete que agrupa aplicación y dependencias para ejecutarse igual en cualquier máquina.
- **Docker Compose:** archivo que describe cómo se relacionan varios contenedores y cómo se inician juntos.
- **Healthcheck:** verificación automática que confirma si un servicio está funcionando correctamente.
- **Semilla de datos:** conjunto de datos de ejemplo para poblar una base y probar comportamientos.
- **Script de ciclo de vida:** comando preparado que automatiza tareas repetitivas (iniciar, detener, revisar).

---

### Apéndice A — Prompt para diseñar la topología
```text
Título: Diseñar topología de contenedores (web estática + api placeholder + db)

Contexto: Quiero una topología mínima con web estática servida por Nginx, un contenedor API con health simple y PostgreSQL con seeds. Todo orquestado en compose, con healthchecks, volúmenes y red privada.

Solicito:
- compose.yml completo (servicios, redes, volúmenes, health).
- Dockerfile.web y Dockerfile.api.
- init.sql de ejemplo y notas de seguridad (secrets/headers).
- Scripts de ciclo de vida (up/down/logs/seed/smoke).
```

### Apéndice B — Prompt para hardening de Nginx (web estática)
```text
Propón una `nginx.conf` para servir contenido estático con:
- Cabeceras seguras (CSP, Referrer-Policy, X-Content-Type-Options, Frame-Options/Frame-Ancestors).
- Cache estática razonable para assets.
- Gzip/Brotli (si aplica).
Devuélvela como bloque listo para `infrastructure/docker/nginx.conf`.
```

---

Con este módulo dispones de una **infra base reproducible**, alineada con el modelo cebolla inversa y lista para conectar con tu **dominio (Módulo 3)** y la **API (Módulo 5)**.
