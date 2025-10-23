# Módulo 1 — Núcleo (Web estática, sin dependencias): instalación mínima, definición de herramientas y primera app con IA
> **Objetivo del módulo**  
> Preparar el entorno mínimo, definir el **plan de uso** de cada herramienta y construir **tu primera web estática** (HTML/CSS/JS puro) generada con IA. Primero **solicitarás el contenido** de la web al cliente (o a ti mismo), luego lo transformarás en una landing funcional, la **ejecutarás en local** y, por último, **añadirás una mejora** con un segundo prompt. Cero instaladores pesados y **sin npm**.

---

## 1) Resultados de aprendizaje
Al finalizar, podrás:
1. **Instalar/usar** las herramientas base con configuración mínima (ChatGPT, Copilot Chat, VSCode, Warp/Terminal, Git opcional).  
2. **Solicitar y estructurar contenido** antes de escribir código (brief funcional).  
3. **Generar una web estática** con IA (HTML/CSS/JS) y **abrirla en el navegador** sin servidores.  
4. **Iterar** la web con un segundo prompt (p. ej., modo oscuro, animaciones suaves, secciones nuevas).  
5. **Documentar** decisiones y mantener trazabilidad básica (bitácora de prompts).

---

## 2) Definiciones y plan de uso de herramientas
### 2.1 Herramientas (mínimas)
- **ChatGPT**: diseño de prompts, guía de estructura, redacción de textos y refactors de HTML/CSS/JS.  
- **Copilot Chat** (o Codex en VibesCoding): generación rápida de **bloques de código** y ajustes sintácticos en VSCode.  
- **VSCode**: edición del código y vista previa (doble clic en `index.html` abre el navegador por defecto).  
- **Warp/Terminal** (opcional): utilidades básicas (crear carpetas/archivos); no es obligatorio.  
- **Git** (opcional, recomendado): control de versiones y trazabilidad.

### 2.2 Plan de uso (circuito IA, sin depender de npm)
1. **Pedir contenido con ChatGPT** (brief).  
2. **Generar estructura HTML/CSS/JS** con Copilot Chat (o ChatGPT si lo prefieres).  
3. **Refinar en VSCode** (nombres, semántica, accesibilidad básica).  
4. **Abrir `index.html`** directamente en el navegador (o usar Live Preview de VSCode si lo tienes).  
5. **Iterar** con un segundo prompt y validar el resultado.

---

## 3) Instalación mínima y verificación
> Puedes saltar Git/Warp si no los necesitas. Para este módulo **basta con VSCode y un navegador**.
- **VSCode**: [code.visualstudio.com](https://code.visualstudio.com/)  
  - Extensión opcional: *GitHub Copilot Chat*.  
- **Navegador** actualizado (Chrome/Edge/Firefox/Safari).  
- **(Opcional) Git**: para versionar.  
- **(Opcional) Warp Terminal**: para utilidades de archivos (o el explorador del SO).

**Verificación rápida:** abre VSCode y crea un archivo `prueba.html`. Escribe `¡Hola!` y ábrelo con doble clic en el navegador. Si lo ves, estás listo.

---

## 4) Estructura base de la web (carpetas/archivos)
```text
web-estatica/
├─ assets/
│  ├─ img/          # imágenes (opcional)
│  └─ css/          # estilos
├─ js/              # scripts
├─ index.html       # landing principal
└─ docs/            # bitácora de prompts y decisiones (MD)
