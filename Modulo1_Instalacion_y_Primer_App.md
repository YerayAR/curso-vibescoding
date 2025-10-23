# Módulo 1 — Núcleo (Revisado): Instalación, definición de herramientas y primera app con IA (ChatGPT → Codex/Copilot → VSCode → Warp)

> **Objetivo del módulo (revisado)**  
> Preparar el entorno local (instalación y configuración), definir el **plan de uso** de cada herramienta y construir **tu primera aplicación** generada con IA, ejecutarla, versionarla y ampliarla con un segundo prompt. Todo con un flujo **determinista y auditable**.

---

## 1) Resultados de aprendizaje

Al finalizar, podrás:
1. **Instalar y configurar** las herramientas base (ChatGPT, Copilot/Codex, VSCode, Warp/Terminal, Git, motor de dependencias).
2. **Comprender el rol** de cada herramienta en el ciclo de desarrollo asistido por IA.
3. **Crear un repositorio** y **generar la primera app** con IA a partir de prompts estandarizados.
4. **Ejecutar, depurar y versionar** la app desde VSCode y Warp.
5. **Iterar con un segundo prompt** para añadir una funcionalidad y comprobar su funcionamiento.

---

## 2) Definiciones y plan de uso de herramientas

### 2.1 Herramientas
- **ChatGPT**: diseño de prompts multifase, revisión conceptual, documentación y guías.  
- **Codex/Copilot Chat** (VibesCoding o GitHub Copilot Chat): genera código desde las instrucciones de alto nivel; corrige sintaxis y arma esqueletos de proyecto.  
- **VSCode + Copilot**: editor principal para refactor, navegación por código, depuración ligera y control de versiones local.  
- **Warp Terminal** (o equivalente): ejecución de comandos, scripts, levante de servicios, pruebas y análisis de logs.  
- **Git**: control de versiones y trazabilidad de cambios.  
- **Node.js** (stack de ejemplo): motor de ejecución para la demo (puedes sustituirlo por Python/Java si prefieres).

### 2.2 Plan de uso (circuito IA)
1. **Diseña en ChatGPT**: especifica funcionalidad y artefactos esperados.  
2. **Genera con Codex/Copilot**: traduce la especificación a código (esqueleto + primera versión).  
3. **Refina en VSCode**: ajustes locales, estructura, nombres, pequeñas mejoras.  
4. **Ejecuta en Warp**: instala dependencias, corre la app, tests de humo y scripts auxiliares.  
5. **Versiona con Git**: commits atómicos y mensajes claros.  
6. **Itera**: nuevo prompt para añadir/unificar funcionalidad → repetir 2–5.

---

## 3) Instalación y configuración

> **Sistema operativo**: las indicaciones sirven para Windows, macOS y Linux (ajusta los instaladores según tu plataforma).

### 3.1 Requisitos
- **Git**: [git-scm.com](https://git-scm.com/) (Windows incluye Git Bash).  
- **VSCode**: [code.visualstudio.com](https://code.visualstudio.com/).  
  - Extensiones: *GitHub Copilot* y *GitHub Copilot Chat* (o tu cliente Codex/VibesCoding).  
- **Node.js** LTS: [nodejs.org](https://nodejs.org/) (incluye `npm`).  
- **Warp Terminal** (macOS/Linux): [warp.dev](https://www.warp.dev/)  
  - Alternativas: **Windows Terminal** + PowerShell / Git Bash; **iTerm2** en macOS.  
- **Cuenta en GitHub** (o GitLab) para alojar el repo.

### 3.2 Verificación rápida
Ejecuta en tu terminal (Warp/PowerShell/Git Bash):
```bash
node -v
npm -v
git --version
```
Si ves números de versión, estás listo. Si no, instala/ajusta el `PATH`.

### 3.3 Configuración de Git
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@example.com"
```

---

## 4) Estructura base del proyecto

> **Elección de demo**: app **Node.js** mínima (servidor HTTP tipo Express) para asegurar ejecución rápida y multiplataforma.

```bash
mkdir ia-first-app && cd ia-first-app
mkdir -p docs/diagramas docs/decisiones src tests scripts
git init
echo "# IA First App" > README.md
git add . && git commit -m "chore(repo): bootstrap inicial"
```

---

## 5) Primeros prompts (estandarizados)

### 5.1 Prompt 1 (ChatGPT) — *Especificación inicial*
> **Cópialo en ChatGPT** y ajusta el nombre del módulo si deseas.

```text
Título: Primera app mínima con IA (servidor HTTP + endpoint /health)

Contexto: Quiero una aplicación Node.js mínima con arquitectura limpia para un servidor HTTP que exponga un endpoint GET /health devolviendo { status: "ok" }. Debe incluir scripts de npm para start, dev y test, así como un test de humo.

Objetivo: Obtener la lista de archivos a crear, contenido inicial por archivo y los comandos de instalación/ejecución.

Restricciones: Código legible y modular; sin lógica de negocio mezclada; usar import/export modernos; sin dependencias innecesarias.

Entregables:
1) Estructura de carpetas y archivos.
2) Contenido de package.json con scripts.
3) Implementación mínima del servidor y del endpoint /health.
4) Un test de humo que verifique /health == 200 y body esperado.
5) Comandos para instalar dependencias y ejecutar servidor y tests.

Formato: Markdown, listo para copiar/pegar en el repo.
```

### 5.2 Transferencia a Codex/Copilot Chat
- Pega la **especificación resultante** en Copilot Chat (o tu cliente Codex/VibesCoding).  
- Pide **generar** los archivos sugeridos dentro de `src/`, `tests/` y `package.json`.

> **Sugerencia**: si Copilot propone una estructura razonable, acepta y guarda los archivos desde VSCode.

---

## 6) Construcción y ejecución de la primera app

### 6.1 Instalación de dependencias (Warp/Terminal)
*Ejemplo con Express y Jest (tu salida de ChatGPT/Copilot puede variar ligeramente):*
```bash
npm init -y
npm install express
npm install -D nodemon jest supertest
```

### 6.2 Scripts típicos en `package.json`
*Ajusta si Copilot ya los creó:*
```json
{
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js",
    "test": "jest -i"
  }
}
```

### 6.3 Código mínimo de ejemplo
`src/index.js` (si el stack usa ESM, renombra a `.mjs` y añade `"type": "module"` en package.json):
```js
const express = require('express');
const app = express();

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`[server] listening on :${port}`));
```

`tests/health.test.js`:
```js
const request = require('supertest');
const express = require('express');

function buildApp() {
  const app = express();
  app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
  return app;
}

test('GET /health => 200 {status:"ok"}', async () => {
  const app = buildApp();
  const res = await request(app).get('/health');
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ status: 'ok' });
});
```

### 6.4 Ejecutar servidor y test (Warp)
```bash
npm run dev   # servidor en caliente
# En otra pestaña:
npm test
```

### 6.5 Primer commit funcional (VSCode o terminal)
```bash
git add .
git commit -m "feat(app): servidor mínimo con endpoint /health y test de humo"
```

---

## 7) Iteración 2: Ampliar con un segundo prompt

### 7.1 Prompt 2 (ChatGPT) — *Añadir endpoint dinámico*
```text
Título: Añadir endpoint GET /greet?name=XYZ

Contexto: Sobre la app existente (servidor HTTP Node.js con /health), quiero añadir un endpoint GET /greet que acepte un query param `name` y responda 200 con { message: "Hello, <name>!" }. Si no se envía name, devolver 400 con { error: "name is required" }.

Objetivo: Instrucciones de cambios por archivo y test unitarios correspondientes.

Restricciones: Mantener estilo y modularidad. No romper /health ni los scripts existentes.

Entregables:
1) Cambios propuestos en `src/index.js` (o en controlador nuevo si lo estimas).
2) Nuevos tests en `tests/greet.test.js` con caso feliz y caso de error.
3) Comandos para ejecutar tests y verificación manual (curl).
```

### 7.2 Transferir a Codex/Copilot Chat
- Pide diffs o bloques de código para **añadir** el endpoint y los tests.  
- Aplique cambios en VSCode y **guarda**.

### 7.3 Ejecutar pruebas y verificación manual
```bash
npm test
curl "http://localhost:3000/greet?name=Yeray"
# Esperado: {"message":"Hello, Yeray!"}
curl "http://localhost:3000/greet"
# Esperado: 400 {"error":"name is required"}
```

### 7.4 Commit de la iteración
```bash
git add .
git commit -m "feat(api): añadir endpoint /greet con validación de query param + tests"
```

---

## 8) Documentación y trazabilidad mínima

### 8.1 Bitácora de prompts (`docs/prompts.md`)
```md
## 2025-10-23 14:15 CET — App inicial
- Prompt: Primera app mínima con IA…
- Salida clave: estructura, server, /health, tests, scripts npm.
- Commit: feat(app): servidor mínimo…

## 2025-10-23 14:45 CET — Ampliación /greet
- Prompt: Añadir endpoint GET /greet…
- Salida clave: controlador, tests greet, validación.
- Commit: feat(api): añadir endpoint /greet…
```

### 8.2 Diagrama simple (`docs/diagramas/flujo_ia.md`)
```text
ChatGPT (prompts) → Codex/Copilot (código) → VSCode (refactor) → Warp (instalar/ejecutar/test) → Git (versionar)
```

### 8.3 Checklist de aceptación (DoD del módulo)
- [ ] Entorno instalado y verificado (`node -v`, `git --version`).  
- [ ] Repo creado con estructura base.  
- [ ] App mínima generada y **corriendo** (`npm run dev`).  
- [ ] Tests de humo **pasan** (`npm test`).  
- [ ] Segunda funcionalidad agregada y **verificada** por curl.  
- [ ] Commits claros y bitácora con al menos 2 entradas.

---

## 9) Anti‑patrones comunes y correcciones rápidas

- **Anti‑patrón:** pegar código grande sin entender los archivos.  
  **Corrección:** pedir a ChatGPT *“lista de archivos + propósito + contenido mínimo”* antes del código.
- **Anti‑patrón:** mezclar lógica de negocio en el punto de entrada.  
  **Corrección:** mover rutas/controladores a módulos (`src/routes`, `src/controllers`).  
- **Anti‑patrón:** no versionar cambios de configuración.  
  **Corrección:** commits atómicos y mensajes con propósito (qué y por qué).

---

## 10) Próximos pasos (puente al Módulo 2)

- Incorporar **plantilla de revisión estructural** (SOLID/DRY/KISS/YAGNI) para refactor temprano.  
- Añadir **scripts de lint/format** y ejecutarlos antes de cada commit.  
- Empezar a separar **capas**: dominio, infraestructura, aplicación.  
- Introducir **tests de integración** (p. ej., contra una base de datos en memoria).

---

### Apéndice A — Scripts útiles (plantillas)

`scripts/dev.sh`
```bash
#!/usr/bin/env bash
set -euo pipefail
npm run dev
```

`scripts/test.sh`
```bash
#!/usr/bin/env bash
set -euo pipefail
npm test
```

> Da permisos y ejecuta con Warp:
```bash
chmod +x scripts/*.sh
./scripts/dev.sh
./scripts/test.sh
```

---

### Apéndice B — Mensajes de commit (guía rápida)

- `chore(repo): bootstrap inicial`  
- `feat(app): servidor mínimo con endpoint /health y test de humo`  
- `feat(api): añadir endpoint /greet con validación de query param + tests`  
- `docs(prompts): registrar prompts y resultados`

---

**Con esto, el Módulo 1 queda centrado en instalación, definición de herramientas y un ejercicio completo**: crear repo, generar app con IA, ejecutarla, ampliarla y verificar su funcionamiento fin a fin.
