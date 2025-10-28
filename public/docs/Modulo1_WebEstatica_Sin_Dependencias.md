# Módulo 1 — Núcleo (Web estática, sin dependencias): herramientas, prompting y primera app con IA
> **Objetivo del módulo**
> Preparar el entorno mínimo, definir el **plan de uso** de cada herramienta (qué es, para qué sirve y cómo usarla), practicar **prompts efectivos**, y construir **tu primera web estática** (HTML/CSS/JS puro). La secuencia es: **pedir contenido → generar → ejecutar → iterar**, sin instalaciones adicionales.
>
> **Nota para quien empieza desde cero**
> No necesitas experiencia previa en programación. Iremos paso a paso, explicando cada término técnico y proponiendo ejemplos sencillos que podrás adaptar a tu proyecto.

---

## 1) Resultados de aprendizaje
Al finalizar, podrás:
1. **Explicar** el rol de ChatGPT, Copilot/Codex, VSCode y el terminal (Warp o similar) dentro del flujo de trabajo.  
2. **Redactar prompts eficaces** (formato multifase Yeray) para obtener especificaciones claras y código legible.  
3. **Generar una web estática** (HTML, CSS y JS) y **abrirla directamente en el navegador**.  
4. **Iterar con un segundo prompt**, validar el cambio y documentar decisiones.  
5. **Mantener trazabilidad** con una bitácora mínima de prompts y cambios (opcional con Git).

---

## 2) Herramientas: definición y utilidad práctica

### 2.1 ChatGPT
- **Qué es:** un asistente que convierte ideas generales en **explicaciones claras** y genera ejemplos de textos o instrucciones.
- **Para qué lo uso:** redactar el **brief de contenido**, diseñar **prompts** (pedidos detallados), revisar coherencia y explicar cambios.
- **Buenas prácticas:** pedir **listas de archivos y responsabilidades** antes del código; exigir **criterios de aceptación** y **checklists** (listas de verificación).

### 2.2 Copilot Chat / Codex (VibesCoding / GitHub Copilot Chat)
- **Qué es:** un asistente que escribe **bloques de código** cuando le das instrucciones claras; ideal para producir **HTML/CSS/JS** de forma rápida.
- **Para qué lo uso:** transformar la especificación (del prompt de ChatGPT) en **archivos concretos** y proponer mejoras pequeñas.
- **Buenas prácticas:** pegar el **brief** y pedir **archivos completos** con contenido, evitando dependencias o librerías externas.

### 2.3 VSCode
- **Qué es:** editor de código (similar a un bloc de notas avanzado) con integración de Copilot Chat y vista previa básica.
- **Para qué lo uso:** **editar**, **ordenar** y **revisar** los archivos; abrir `index.html` para ver la web; tomar notas en `/docs`.
- **Buenas prácticas:** separar estilos en `assets/css/styles.css` y scripts en `js/main.js`; usar nombres semánticos (que describen su función).

### 2.4 Warp Terminal (o cualquier terminal)
- **Qué es:** una consola o ventana de comandos para **crear carpetas/archivos** y ejecutar utilidades básicas del sistema.
- **Para qué lo uso:** estructurar el proyecto (carpetas), copiar/renombrar archivos, y (opcional) gestionar control de versiones.
- **Buenas prácticas:** mantener comandos **simples y reproducibles**; usar el explorador del sistema si prefieres.

### 2.5 Git (opcional recomendado)
- **Qué es:** sistema de **control de versiones** (historial de cambios con opción a volver atrás).
- **Para qué lo uso:** crear **puntos de restauración** y documentar cambios con mensajes claros.
- **Buenas prácticas:** un cambio por commit; mensajes con **qué** y **por qué**.

---

## 3) Prompts eficaces (formato multifase Yeray)

### 3.1 Principios de prompting
- **Especifica el contexto** (objetivo, restricciones, público).  
- **Divide en fases** (inventario → estructura → criterios de calidad → pruebas manuales).  
- **Exige entregables concretos** (archivos, rutas, bloques de código).  
- **Incluye criterios de aceptación** y un **checklist rápido**.

### 3.2 Plantilla base (para pedir contenido — “brief”)
Copia en ChatGPT y responde a las preguntas:
```text
Título: Brief de contenido para landing web estática (sin librerías)

Contexto: Voy a crear una landing HTML/CSS/JS puro. Necesito el contenido antes del código.

Solicita y organiza:
1) Nombre de marca/proyecto y eslogan breve (≤12 palabras).
2) Subtítulo (≤20 palabras).
3) Secciones: Hero, Beneficios (3 bullets), Servicios/Productos (3 ítems), Testimonios (2), Contacto (correo y enlaces).
4) Paleta (3–4 colores con nombres y hex) y tipografía (sistema o Google Fonts).
5) Tono y estilo (formal/técnico/dinámico). 
6) CTAs (3 textos + destino interno por ancla).
7) Imágenes/rutas o placeholders.
8) Footer (datos legales básicos).

Entrega en Markdown listo para `docs/brief.md`.
```

### 3.3 Plantilla (para generar la web a partir del brief)
Usa en Copilot Chat (o ChatGPT):
```text
Título: Generar landing estática accesible (HTML/CSS/JS puro)

Contexto: Tengo el brief (pegado arriba). Quiero HTML semántico, CSS modular y JS mínimo.

Restricciones:
- Sin librerías. Archivos: `index.html`, `assets/css/styles.css`, `js/main.js`.
- Accesible (alt en imágenes, roles cuando aplique, contraste suficiente).
- Responsive básico (mobile-first, un breakpoint).
- Paleta/tipografía del brief. CTAs a secciones internas.

Entregables (bloques de código listos para pegar):
1) `index.html` completo.
2) `assets/css/styles.css` con variables de color, tipografía y layout base.
3) `js/main.js` con scroll suave y toggle de menú móvil.
4) Instrucciones para abrir el sitio en el navegador.
```

### 3.4 Plantilla (para iterar una mejora puntual)
```text
Título: Añadir modo oscuro y transición suave

Contexto: Sobre la landing existente, quiero un toggle accesible para tema claro/oscuro con CSS variables y persistencia local.

Entregables (dif o bloques de código por archivo):
1) Cambios en `styles.css` (variables y prefers-color-scheme).
2) Cambios en `index.html` (botón con aria-pressed).
3) Cambios en `main.js` (guardar y restaurar preferencia).
4) Pasos para probar manualmente.
```

---

## 4) Estructura base del proyecto (sin dependencias)
Crea la carpeta del proyecto (con explorador o terminal):
```text
mi-web-estatica/
├─ assets/
│  ├─ img/
│  └─ css/
├─ js/
├─ index.html
└─ docs/
   ├─ brief.md
   └─ prompts.md
```

---

## 5) Flujo práctico del módulo (paso a paso)
1. **Pedir contenido** con el prompt de brief (§3.2) y guardarlo en `docs/brief.md`.  
2. **Generar la web** con el prompt de generación (§3.3) y colocar los archivos en su ruta.  
3. **Abrir la web**: doble clic en `index.html` para verla en el navegador.  
4. **Iterar** con el prompt de mejora (§3.4) y validar que el cambio **funciona**.  
5. **Documentar** en `docs/prompts.md` los prompts usados y las decisiones (1–2 líneas por cambio).

**Checklist de aceptación**
- [ ] `index.html` carga y es navegable.  
- [ ] Estilos en `assets/css/styles.css` (no inline).  
- [ ] `js/main.js` activa scroll suave y menú móvil.  
- [ ] Modo oscuro activable (si aplicaste la mejora).  
- [ ] Bitácora con al menos 2 entradas (generación + mejora).

---

## 6) Ejemplo final (demostrativo, adaptarlo a tu brief)

**`index.html`**
```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Acme Studio — Diseño Web</title>
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
  <header class="site-header">
    <nav class="nav">
      <a class="brand" href="#hero">Acme Studio</a>
      <button id="themeToggle" class="btn" aria-pressed="false" aria-label="Cambiar tema">🌓</button>
      <button id="menuToggle" class="btn btn--ghost" aria-expanded="false" aria-controls="menu">☰</button>
      <ul id="menu" class="menu">
        <li><a href="#beneficios">Beneficios</a></li>
        <li><a href="#servicios">Servicios</a></li>
        <li><a href="#testimonios">Testimonios</a></li>
        <li><a href="#contacto" class="btn btn--primary">Contacto</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section id="hero" class="hero">
      <h1>Tu web, clara y efectiva</h1>
      <p class="lead">Sitios rápidos, accesibles y orientados a objetivos.</p>
      <a href="#servicios" class="btn btn--primary">Ver servicios</a>
      <a href="#contacto" class="btn btn--ghost">Pedir presupuesto</a>
    </section>

    <section id="beneficios" class="section">
      <h2>Beneficios</h2>
      <ul class="cards">
        <li class="card"><h3>Claridad</h3><p>Estructura semántica con jerarquía visual.</p></li>
        <li class="card"><h3>Rapidez</h3><p>Recursos ligeros y buenas prácticas.</p></li>
        <li class="card"><h3>Escala</h3><p>Código mantenible para crecer sin fricción.</p></li>
      </ul>
    </section>

    <section id="servicios" class="section">
      <h2>Servicios</h2>
      <ul class="grid-3">
        <li><h3>Landing Pages</h3><p>Enfocadas en conversión.</p></li>
        <li><h3>Catálogos</h3><p>Muestra tu producto con claridad.</p></li>
        <li><h3>Soporte</h3><p>Mejoras y mantenimiento continuo.</p></li>
      </ul>
    </section>

    <section id="testimonios" class="section">
      <h2>Testimonios</h2>
      <blockquote>“Rápidos y profesionales.” — <cite>Ana M.</cite></blockquote>
      <blockquote>“Mejoró nuestras ventas.” — <cite>Comercial D.</cite></blockquote>
    </section>

    <section id="contacto" class="section">
      <h2>Contacto</h2>
      <p>Escríbenos a <a href="mailto:hola@acme.example">hola@acme.example</a> o visita nuestras redes:</p>
      <p><a href="#" aria-label="LinkedIn">LinkedIn</a> · <a href="#" aria-label="X">X</a> · <a href="#" aria-label="Instagram">Instagram</a></p>
    </section>
  </main>

  <footer class="site-footer">
    <small>© 2025 Acme Studio. Todos los derechos reservados.</small>
  </footer>

  <script src="js/main.js"></script>
</body>
</html>
```

**`assets/css/styles.css`**
```css
:root{
  --bg:#ffffff; --fg:#111111; --primary:#2563eb; --muted:#6b7280;
}

@media (prefers-color-scheme: dark){
  :root{ --bg:#0b0e14; --fg:#e5e7eb; --primary:#3b82f6; --muted:#9ca3af; }
}

[data-theme="dark"]{
  --bg:#0b0e14; --fg:#e5e7eb; --primary:#3b82f6; --muted:#9ca3af;
}

*{ box-sizing:border-box }
html,body{ margin:0; padding:0; background:var(--bg); color:var(--fg); font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial; line-height:1.6 }

a{ color:var(--primary); text-decoration:none }
a:hover{ text-decoration:underline }

.site-header{ position:sticky; top:0; backdrop-filter:saturate(1.2) blur(6px); background:color-mix(in srgb, var(--bg) 85%, transparent); border-bottom:1px solid color-mix(in srgb, var(--fg) 10%, transparent) }
.nav{ max-width:1080px; margin:0 auto; display:flex; align-items:center; gap:1rem; padding:0.75rem 1rem }
.brand{ font-weight:700 }
.menu{ list-style:none; display:flex; gap:1rem; margin-left:auto; padding:0 }
.menu a{ padding:0.5rem 0.75rem; border-radius:8px }

.hero{ max-width:1080px; margin:2.5rem auto; padding:0 1rem; text-align:center }
.lead{ color:var(--muted); margin:0.5rem auto 1.25rem }

.section{ max-width:1080px; margin:2rem auto; padding:0 1rem }
.cards, .grid-3{ list-style:none; display:grid; gap:1rem; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); padding:0 }
.card{ border:1px solid color-mix(in srgb, var(--fg) 10%, transparent); border-radius:12px; padding:1rem }

.btn{ border:1px solid color-mix(in srgb, var(--fg) 15%, transparent); background:transparent; color:var(--fg); padding:0.5rem 0.75rem; border-radius:10px; cursor:pointer }
.btn--primary{ background:var(--primary); color:#fff; border:none }
.btn--ghost{ background:transparent }

.site-footer{ border-top:1px solid color-mix(in srgb, var(--fg) 10%, transparent); padding:1rem; text-align:center; margin-top:2rem }

@media (max-width:720px){
  #menu{ display:none }
  #menu[aria-expanded="true"]{ display:flex; flex-direction:column; gap:0.5rem }
}
```

**`js/main.js`**
```js
(function(){
  // Scroll suave para anclas internas
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if(target){
        e.preventDefault();
        target.scrollIntoView({ behavior:'smooth', block:'start' });
        history.pushState(null, '', id);
      }
    });
  });

  // Toggle de menú móvil
  const menuBtn = document.getElementById('menuToggle');
  const menu = document.getElementById('menu');
  if(menuBtn && menu){
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      menu.setAttribute('aria-expanded', String(!expanded));
    });
  }

  // Modo oscuro con persistencia
  const themeBtn = document.getElementById('themeToggle');
  const root = document.documentElement;
  const key = 'pref-theme';

  function apply(theme){
    if(theme === 'dark'){
      root.setAttribute('data-theme','dark');
      themeBtn?.setAttribute('aria-pressed','true');
    }else{
      root.removeAttribute('data-theme');
      themeBtn?.setAttribute('aria-pressed','false');
    }
  }

  const saved = localStorage.getItem(key);
  if(saved){ apply(saved); }

  themeBtn?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(key, next);
    apply(next);
  });
})();
```

**Cómo abrirla:** doble clic a `index.html`. **No se requiere ninguna instalación adicional.**

---

## 7) Documentación y trazabilidad (ligera)
- `docs/brief.md`: contenido recibido/definido.  
- `docs/prompts.md`: prompts empleados y resultado.  
- (Opcional) Control de versiones con Git para registrar cambios y revertir si hace falta.

---

## 8) Próximos pasos
- Publicar en **GitHub Pages** o similar (copiando la carpeta tal cual).
- Añadir **SEO básico** (metadatos, `og:` tags), favicon y sitemap.
- Incluir **accesibilidad** adicional (focus visible, labels en formularios).
- Documentar una **política de cambios**: qué se modifica en cada iteración y por qué.

---

## Glosario esencial del módulo
- **Accesibilidad:** conjunto de prácticas para que cualquier persona (incluidas personas con discapacidad) pueda usar tu sitio sin obstáculos.
- **Brief:** resumen del contenido y estilo que deseas para tu proyecto. Sirve como guía para generar textos y diseño.
- **Checklist:** lista corta de puntos que revisas para confirmar que algo está terminado.
- **HTML / CSS / JS:** lenguajes básicos de la web. HTML define el contenido, CSS el aspecto visual y JS (JavaScript) agrega interactividad.
- **Prompt:** instrucción clara que le das a una IA para recibir una respuesta útil.
- **Repositorio (Git):** carpeta controlada por Git que guarda el historial de cambios de tus archivos.
- **Tema oscuro/claro:** variantes de colores que facilitan la lectura en distintos ambientes de luz.

---

**Con esto, dominas el núcleo del flujo con IA para una web estática sin dependencias**: pedir contenido, generar, ejecutar y mejorar, con criterios claros y sin fricción técnica.
