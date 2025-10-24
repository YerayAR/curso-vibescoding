# Módulo 8 — Debugging y Control Operacional con IA
> **Objetivo del módulo**
> Dominar el **diagnóstico rápido de problemas**, **respuesta a errores en producción** y **control operacional** del sistema con ayuda de la IA. Aprenderás a dar **órdenes claras y precisas** a asistentes IA (como Warp Agent) para investigar logs, reiniciar servicios, verificar estados y aplicar correcciones sin romper el entorno.

> **Nota para quien nunca ha debuggeado en producción**
> Piensa en este módulo como tu kit de emergencias. Aprenderás a mantener la calma, diagnosticar con método y resolver problemas reales que surgen cuando el código está vivo.

---

## 1) Resultados de aprendizaje
Al finalizar, podrás:
1. **Diagnosticar** problemas comunes (servicio caído, errores 403/404/500, conexión rechazada).
2. **Formular comandos precisos** para IA: verificar logs, estado de contenedores, puertos, archivos.
3. **Aplicar correcciones rápidas** con supervisión de IA: reiniciar servicios, corregir permisos, copiar archivos faltantes.
4. **Documentar incidentes** con causa raíz y solución aplicada.
5. **Prevenir recurrencias** con checklists y validaciones automatizadas.

---

## 2) Herramientas: papel en este módulo
- **Warp Agent / ChatGPT**: asistente para diagnóstico guiado, sugerencia de comandos y explicaciones.
- **Terminal**: ejecución de comandos de inspección y corrección.
- **Docker / Docker Compose**: verificar estado de contenedores, logs, reiniciar servicios.
- **Navegador DevTools**: inspeccionar errores HTTP, red, consola JavaScript.
- **Bitácora** (`/docs/incidentes.md`): registro de problemas y soluciones.

---

## 3) Estructura de respuesta a incidentes

```text
/docs
  └─ incidentes/
     ├─ 2025-10-24_error-403-web.md
     ├─ 2025-10-24_db-connection-refused.md
     └─ template-incidente.md
```

**Plantilla de incidente** (`template-incidente.md`):
```markdown
# Incidente: [Título breve]
**Fecha**: YYYY-MM-DD HH:MM
**Severidad**: P0 (crítico) / P1 (alto) / P2 (medio) / P3 (bajo)
**Servicios afectados**: web / api / db

## Síntomas
- ¿Qué observó el usuario/operador?
- Errores visibles (screenshots, códigos de error)

## Investigación
- Comandos ejecutados para diagnosticar
- Salida relevante de logs
- Estado de servicios (docker compose ps, curl, etc.)

## Causa raíz
- ¿Qué causó el problema?
- ¿Cambio reciente? ¿Configuración incorrecta?

## Solución aplicada
- Comandos ejecutados para resolver
- Cambios en código/configuración

## Prevención
- Checklist o validación para evitar recurrencia
- Cambios en CI/CD o documentación

## Timeline
- 11:10 - Detectado error 403 en localhost:8080
- 11:12 - Verificado logs del contenedor web
- 11:15 - Identificado: falta index.html en /public
- 11:16 - Copiado index.html desde /catalogo-alquiler/public
- 11:17 - Verificado: sitio funcional
- 11:18 - Documentado en este incidente
```

---

## 4) Escenarios comunes y comandos de diagnóstico

### 4.1 Servicio caído o no responde

**Síntomas**: `curl: (7) Failed to connect`, navegador no carga.

**Diagnóstico con IA**:
```text
Prompt: "El servicio en localhost:8080 no responde. Ayúdame a diagnosticar:
1. Verifica si el contenedor está corriendo
2. Muestra logs recientes
3. Revisa si el puerto está abierto"
```

**Comandos ejecutados** (por ti o sugeridos por IA):
```bash
# 1. Estado de contenedores
docker compose ps

# 2. Logs del servicio web
docker compose logs web --tail 50

# 3. Verificar puerto
netstat -tuln | grep 8080
# o en Windows:
netstat -an | findstr 8080
```

**Solución común**: reiniciar el servicio
```bash
docker compose restart web
```

---

### 4.2 Error 403 Forbidden

**Síntomas**: Navegador muestra "403 Forbidden".

**Diagnóstico con IA**:
```text
Prompt: "Recibo error 403 al acceder a localhost:8080. Los logs de nginx muestran:
'directory index of /usr/share/nginx/html/ is forbidden'
¿Qué significa y cómo lo soluciono?"
```

**Comandos sugeridos**:
```bash
# 1. Verificar contenido del directorio en el contenedor
docker compose exec web ls -la /usr/share/nginx/html/

# 2. Revisar si existe index.html
docker compose exec web ls /usr/share/nginx/html/index.html
```

**Causa raíz**: Falta `index.html` en el directorio servido.

**Solución**:
```bash
# Copiar index.html desde fuente correcta
cp catalogo-alquiler/public/index.html public/index.html

# No hace falta reiniciar si usas volumen bind
# Si no, reconstruir:
docker compose up -d --build web
```

---

### 4.3 Error 500 Internal Server Error

**Síntomas**: API responde con código 500.

**Diagnóstico con IA**:
```text
Prompt: "La API en localhost:8081 devuelve error 500. Muéstrame cómo:
1. Ver logs del contenedor api
2. Identificar el stack trace o mensaje de error
3. Verificar conexión a base de datos"
```

**Comandos**:
```bash
# 1. Logs de la API
docker compose logs api --tail 100

# 2. Estado de la base de datos
docker compose ps db
docker compose logs db --tail 30

# 3. Probar conexión desde el contenedor api
docker compose exec api ping db
```

**Causas comunes**:
- Base de datos no disponible → verificar `depends_on` y healthcheck
- Error en código de la API → revisar stack trace en logs
- Variables de entorno incorrectas → verificar `.env` o `compose.yml`

---

### 4.4 CSS/JS no se cargan (404)

**Síntomas**: Página HTML carga pero sin estilos/interactividad.

**Diagnóstico con IA**:
```text
Prompt: "El HTML carga pero los estilos no. En DevTools veo errores 404 para:
- assets/css/styles.css
- js/main.js
¿Cómo verifico la estructura de archivos?"
```

**Comandos**:
```bash
# 1. Listar estructura de archivos públicos
ls -R public/

# 2. Verificar dentro del contenedor
docker compose exec web ls -R /usr/share/nginx/html/
```

**Solución**: Copiar archivos faltantes
```bash
cp -r catalogo-alquiler/public/assets public/
cp -r catalogo-alquiler/public/js public/
```

---

### 4.5 Base de datos: Connection refused

**Síntomas**: API no puede conectarse a PostgreSQL.

**Diagnóstico**:
```bash
# 1. Estado del contenedor db
docker compose ps db

# 2. Logs de PostgreSQL
docker compose logs db --tail 50

# 3. Healthcheck
docker inspect infrastructure-db-1 | grep -A 10 Health
```

**Solución común**: Esperar a que el healthcheck pase o reiniciar
```bash
# Reiniciar solo la base de datos
docker compose restart db

# Esperar a que esté healthy
docker compose ps
```

---

## 5) Prompts efectivos para debugging con IA

### 5.1 Diagnóstico guiado paso a paso
```text
Título: Diagnóstico estructurado de servicio caído

Contexto: El servicio [nombre] no responde en [URL/puerto].

Solicito una investigación en 4 fases:
1) Verificar estado del contenedor (comando docker compose ps)
2) Revisar logs recientes (últimas 50 líneas)
3) Comprobar conectividad de red (puertos, DNS)
4) Proponer soluciones ordenadas por probabilidad

Devuelve comandos completos listos para copiar y ejecutar.
```

### 5.2 Análisis de logs
```text
Título: Interpretar logs de error

Contexto: Tengo estos logs [pegar logs]. 

Solicito:
- Identificar líneas críticas (errores, warnings)
- Explicar causa probable en lenguaje simple
- Sugerir 2-3 comandos de verificación adicional
- Proponer solución concreta
```

### 5.3 Corrección supervisada
```text
Título: Aplicar corrección con validación

Contexto: Identifiqué que falta el archivo [ruta]. Quiero copiarlo desde [origen].

Solicito:
1) Comando para copiar el archivo
2) Comando para verificar que se copió correctamente
3) Comando para reiniciar el servicio si es necesario
4) Prueba de humo (curl o similar)

Devuelve secuencia completa con verificaciones.
```

---

## 6) Checklists operacionales

### Checklist de diagnóstico rápido (primeros 2 minutos)
- [ ] **Servicios**: `docker compose ps` → ¿Todos "Up" y "healthy"?
- [ ] **Logs**: `docker compose logs --tail 20` → ¿Errores evidentes?
- [ ] **Conectividad**: `curl localhost:8080` y `curl localhost:8081/health` → ¿Responden?
- [ ] **Archivos**: `ls public/` → ¿index.html existe?
- [ ] **Permisos**: Si hay errores de acceso, verificar `chmod` y ownership

### Checklist antes de reiniciar un servicio
- [ ] **Logs guardados**: Copiar logs antes de reiniciar (para análisis posterior)
- [ ] **Estado documentado**: Anotar qué estaba mal
- [ ] **Impacto**: ¿Hay usuarios conectados? ¿Datos en memoria?
- [ ] **Comando seguro**: Usar `restart` en lugar de `down`/`up` (preserva volúmenes)

### Checklist post-corrección
- [ ] **Verificación funcional**: Probar manualmente el flujo afectado
- [ ] **Smoke tests**: Ejecutar `./scripts/smoke.sh`
- [ ] **Logs limpios**: Revisar que no haya nuevos errores
- [ ] **Documentación**: Crear archivo en `/docs/incidentes/`
- [ ] **Prevención**: Agregar validación a CI/CD si aplica

---

## 7) Comandos útiles para operaciones

### Inspección de contenedores
```bash
# Ver todos los contenedores (incluso detenidos)
docker compose ps -a

# Inspeccionar configuración de un contenedor
docker inspect infrastructure-web-1

# Ver recursos (CPU, memoria)
docker stats

# Logs en tiempo real
docker compose logs -f web
```

### Acceso interactivo a contenedores
```bash
# Shell en contenedor (útil para debugging)
docker compose exec web sh
docker compose exec api sh
docker compose exec db psql -U appuser -d appdb

# Ejecutar comando sin entrar al shell
docker compose exec web ls /usr/share/nginx/html
```

### Gestión de volúmenes
```bash
# Listar volúmenes
docker volume ls

# Inspeccionar volumen
docker volume inspect infrastructure_pgdata

# Limpiar volúmenes huérfanos (¡cuidado!)
docker volume prune
```

### Red y conectividad
```bash
# Listar redes
docker network ls

# Inspeccionar red
docker network inspect infrastructure_appnet

# Probar conectividad entre contenedores
docker compose exec web ping api
docker compose exec api ping db
```

---

## 8) Ejemplo real: Caso resuelto paso a paso

**Incidente**: Error 403 al acceder a `localhost:8080`

**Timeline**:

**11:13** - Usuario reporta: "No puedo ver la página web"

**11:14** - Verifico con navegador: Aparece "403 Forbidden"

**11:15** - Ejecuto diagnóstico:
```bash
docker compose ps
# Resultado: web está "Up (healthy)"

docker compose logs web --tail 20
# Resultado: "[error] directory index forbidden"
```

**11:16** - Prompt a IA:
```
"nginx muestra 'directory index of /usr/share/nginx/html/ is forbidden'. 
¿Qué significa y cómo lo verifico?"
```

**11:17** - IA responde:
```
Significa que nginx intenta servir un directorio sin index.html.
Verifica con: docker compose exec web ls /usr/share/nginx/html/
```

**11:18** - Ejecuto:
```bash
docker compose exec web ls /usr/share/nginx/html/
# Resultado: assets/ metadata/ favicon.ico (¡falta index.html!)
```

**11:19** - Localizo el archivo correcto:
```bash
ls catalogo-alquiler/public/index.html
# Existe aquí
```

**11:20** - Aplico corrección:
```bash
cp catalogo-alquiler/public/index.html public/index.html
cp -r catalogo-alquiler/public/assets public/
cp -r catalogo-alquiler/public/js public/
```

**11:21** - Verifico:
```bash
curl -I localhost:8080
# HTTP/1.1 200 OK ✓
```

**11:22** - Pruebo en navegador: ✅ Funciona

**11:23** - Documento incidente en `docs/incidentes/2025-10-24_error-403-web.md`

**Prevención**: Agregar validación en CI que verifique existencia de `index.html` antes de deploy.

---

## 9) Anti-patrones y buenas prácticas

### ❌ Anti-patrones
- **Reiniciar sin diagnosticar**: "A ver si con restart se arregla" → Pierdes información valiosa de logs
- **Cambios en producción sin backup**: Modificar archivos directamente sin respaldo
- **No documentar**: Resolver y olvidar → El problema volverá y nadie sabrá cómo se arregló
- **Comandos destructivos**: `docker compose down -v` elimina volúmenes (¡datos!)

### ✅ Buenas prácticas
- **Diagnosticar primero**: Recopilar evidencia antes de tocar nada
- **Comandos incrementales**: Probar con el cambio mínimo necesario
- **Documentar en caliente**: Anotar comandos y resultados mientras resuelves
- **Validar después**: Siempre ejecutar smoke tests post-corrección
- **Automatizar prevención**: Si un problema es recurrente, agregar validación automatizada

---

## 10) Procedimiento reproducible (ejercicio práctico)

### Ejercicio 1: Simular y resolver error 403
1. Renombra `public/index.html` a `public/index.html.bak`
2. Recarga `localhost:8080` → Deberías ver 403
3. Usa prompts de IA para diagnosticar
4. Restaura el archivo
5. Documenta en `/docs/incidentes/ejercicio-403.md`

### Ejercicio 2: Simular caída de servicio
1. Detén el contenedor web: `docker compose stop web`
2. Intenta acceder → Deberías ver "Connection refused"
3. Diagnostica con `docker compose ps`
4. Reinicia con `docker compose start web`
5. Verifica con `curl localhost:8080`

### Ejercicio 3: Analizar logs de error
1. Introduce un error en `infrastructure/docker/api_server.py` (typo intencional)
2. Reinicia API: `docker compose restart api`
3. Accede a `localhost:8081/health` → Debería fallar
4. Usa logs para identificar el error: `docker compose logs api`
5. Corrige y verifica

---

## 11) Integración con el flujo del curso

**Conexión con otros módulos**:
- **Módulo 4** (Infraestructura): Entender qué servicios existen y cómo están configurados
- **Módulo 7** (Despliegue): Usar `smoke.sh` y `status.sh` como primera línea de defensa
- **Proyecto Final**: Aplicar estos procedimientos cuando algo falle en integración

**Preparación para producción**:
- Logs centralizados (Loki, Elasticsearch)
- Alertas automáticas (Prometheus + Alertmanager)
- Runbooks detallados por tipo de incidente

---

## 12) Entregables del módulo
- `/docs/incidentes/` con al menos 2 casos documentados (reales o simulados)
- Checklist operacional personalizado para tu proyecto
- Prompts guardados en `/docs/prompts-debugging.md`
- Script de diagnóstico rápido: `/scripts/diagnose.sh`

---

## Glosario esencial del módulo
- **Debugging**: proceso de identificar y corregir errores en el sistema.
- **Causa raíz**: razón fundamental que originó el problema (no solo el síntoma).
- **Healthcheck**: verificación automática que confirma si un servicio está operativo.
- **Incidente**: evento que interrumpe o degrada el servicio normal del sistema.
- **Logs**: registros cronológicos de eventos, errores y operaciones del sistema.
- **Runbook**: guía operativa paso a paso para responder a situaciones específicas.
- **Smoke test**: prueba básica que verifica funcionalidad crítica tras un cambio.

---

## Apéndice A — Script de diagnóstico rápido

`/scripts/diagnose.sh`:
```bash
#!/usr/bin/env bash
set -euo pipefail

echo "=== DIAGNÓSTICO RÁPIDO ==="
echo ""

echo "[1/5] Estado de contenedores:"
docker compose ps
echo ""

echo "[2/5] Healthchecks:"
docker compose ps | grep -E "Up|healthy|unhealthy" || echo "No hay contenedores corriendo"
echo ""

echo "[3/5] Últimos logs (web):"
docker compose logs web --tail 10
echo ""

echo "[4/5] Últimos logs (api):"
docker compose logs api --tail 10
echo ""

echo "[5/5] Conectividad:"
echo -n "Web (8080): "
curl -sf localhost:8080 >/dev/null && echo "✓ OK" || echo "✗ FAIL"
echo -n "API (8081): "
curl -sf localhost:8081/health >/dev/null && echo "✓ OK" || echo "✗ FAIL"
echo ""

echo "=== FIN DEL DIAGNÓSTICO ==="
```

Uso: `chmod +x scripts/diagnose.sh && ./scripts/diagnose.sh`

---

## Apéndice B — Prompts guardados

`/docs/prompts-debugging.md`:
```markdown
# Prompts para Debugging

## Diagnóstico general
\`\`\`
Mi servicio [nombre] no responde. Dame una secuencia de comandos para:
1. Verificar estado del contenedor
2. Revisar logs recientes (50 líneas)
3. Comprobar conectividad
4. Proponer soluciones
\`\`\`

## Análisis de logs
\`\`\`
Estos son los logs de error:
[pegar logs]

Ayúdame a:
- Identificar líneas críticas
- Explicar causa raíz
- Sugerir solución
\`\`\`

## Corrección guiada
\`\`\`
Necesito copiar [archivo] desde [origen] a [destino].
Dame comandos con validación en cada paso.
\`\`\`
```

---

Con este módulo, dominas el **control operacional con IA como copiloto**, manteniendo sistemas funcionando y documentando el conocimiento para tu equipo y tu yo futuro.