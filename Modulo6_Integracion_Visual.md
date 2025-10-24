# Módulo 6 — Integración visual (opcional): coherencia UI ↔ dominio ↔ API (sin generadores gráficos)
> **Objetivo del módulo**
> Validar la **coherencia visual y semántica** de la interfaz con el **dominio** y la **API**, sin usar IA generativa de imágenes. Se realizarán **auditorías de semántica, accesibilidad, estados y contenidos**, con **capturas comentadas**, propuestas de mejora y verificación manual.

> **Nota para perfiles no técnicos**
> Miraremos la interfaz como lo haría una persona usuaria exigente. No necesitamos herramientas complicadas: solo sentido común, buenas preguntas y atención al detalle.

---

## 1) Resultados de aprendizaje
Al finalizar, podrás:
1. Aplicar un **checklist visual y semántico** (estructura, jerarquía, estados).  
2. Alinear **nombres y flujos de UI** con el **lenguaje ubicuo** definido en el dominio.  
3. Detectar **desajustes** entre UI ↔ DTOs/contratos de la API.  
4. Documentar **capturas comentadas** y proponer **cambios mínimos** de alto impacto.  
5. Verificar **accesibilidad básica**: contraste, foco visible, navegación por teclado, aria‑*.

---

## 2) Herramientas y papel en este módulo
- **ChatGPT**: análisis guiado (prompts de auditoría UI), propuestas de mejora y reescritura semántica del HTML.  
- **VSCode**: edición de HTML/CSS/JS; ajustes semánticos y de estilos.  
- **Navegador**: **DevTools** (inspección de DOM, contrast checker en extensiones), **Lighthouse** opcional.  
- **Capturas de pantalla**: sistema operativo o extensión para documentar estados.  
- **Bitácora** (`/docs/ui-review.md`): capturas, comentarios y decisiones.

> Mantén la **web estática** del Módulo 1 como base. No se requieren dependencias ni servidores.

---

## 3) Entradas y entregables
**Entradas**: `index.html`, `assets/css/styles.css`, `js/main.js`, `docs/openapi.yaml` (si ya existe), `domain/glossary.md`.  
**Entregables**:  
- `docs/ui-review.md` con **capturas comentadas** (Hero, navegación, sección de datos, formulario si hay).  
- Lista de **incoherencias** (nombres, datos, flujos) y **propuestas** con difs de HTML/CSS/JS.  
- **Checklist de accesibilidad** pasado y anotado (ver §7).

---

## 4) Prompts de trabajo (multifase Yeray)

### 4.1 Auditoría de coherencia UI ↔ Dominio/API
```text
Título: Auditoría de coherencia UI con dominio y API

Contexto: Tengo una web estática con secciones [Hero, Beneficios, Servicios, Testimonios, Contacto]. Mi dominio contiene [Producto, Alquiler, Disponibilidad] y mi API expone [GET /products, POST /rentals].

Fases:
1) Semántica: revisar encabezados (h1–h3), roles, listas y vínculos; detectar etiquetas mal usadas.
2) Lenguaje ubicuo: alinear textos/labels con términos de dominio.
3) Datos: detectar UI que promete datos que la API no ofrece o viceversa.
4) Estados: definir estados vacíos/errores/carga para cada bloque.
5) Propuestas: difs de HTML/CSS/JS mínimos, sin dependencias.

Criterios de aceptación: jerarquía clara, nombres consistentes, estados definidos y sin promesas que la API no cumpla.
```

### 4.2 Auditoría de accesibilidad mínima (A11y)
```text
Título: Auditoría de accesibilidad básica

Contexto: Quiero verificar contraste, foco visible, navegación por teclado y atributos aria-* esenciales.

Solicito:
- Tabla de contraste (texto principal, enlaces, botones) con umbrales (≥4.5:1).
- Revisión de foco (indicador visible en elementos interactivos).
- Navegación por teclado (orden y trampas de foco).
- Aria-label y roles donde sea necesario.
- Difs CSS/HTML mínimos para cumplir.
```

### 4.3 Auditoría de performance percibida (ligera)
```text
Título: Performance percibida (sin herramientas externas)

Contexto: Sugerencias para mejorar carga y respuesta visual sin toolchains.

Solicito:
- Optimizar imágenes (dimensiones, formatos, lazy loading si aplica).
- Orden del CSS y JS (CSS primero, JS al final; evitar bloqueos).
- Cache de assets (cabeceras sugeridas para Nginx si aplica).
- Difs en HTML/CSS/JS mínimos.
```

---

## 5) Ejemplos de mejora (antes/después)

### 5.1 Semántica de navegación y encabezados
**Antes**
```html
<div class="header">
  <div class="logo">Acme</div>
  <div class="menu">
    <a href="#beneficios">Beneficios</a>
    <a href="#servicios">Servicios</a>
  </div>
</div>
<h2>Acme Studio</h2>
```
**Problemas**: falta `<header>`/`<nav>`, marca sin jerarquía; el primer título no es `<h1>`.

**Después**
```html
<header class="site-header">
  <nav class="nav" aria-label="Principal">
    <a class="brand" href="#hero">Acme Studio</a>
    <ul class="menu" role="list">
      <li><a href="#beneficios">Beneficios</a></li>
      <li><a href="#servicios">Servicios</a></li>
    </ul>
  </nav>
</header>
<main>
  <section id="hero" class="hero">
    <h1>Tu web, clara y efectiva</h1>
    <!-- ... -->
  </section>
</main>
```

### 5.2 Contraste y foco visible
**Antes (CSS)**
```css
.btn--primary{ background:#7aa7ff; color:#fff; outline: none; }
a { color:#7aa7ff }
```
**Después (CSS)**
```css
:root{
  --primary:#2563eb; /* mejor contraste */
  --focus: #111;     /* alto contraste para foco */
}
a{ color:var(--primary) }
a:focus-visible, .btn:focus-visible{
  outline: 3px solid var(--focus);
  outline-offset: 2px;
}
```

### 5.3 Estados vacíos/errores (texto y estilos)
**Antes**
```html
<section id="servicios" class="section">
  <h2>Servicios</h2>
  <ul class="grid-3" id="servicesList"></ul>
</section>
```
**Después**
```html
<section id="servicios" class="section" aria-live="polite">
  <h2>Servicios</h2>
  <div id="servicesState" class="state state--idle">Cargando…</div>
  <ul class="grid-3" id="servicesList" hidden></ul>
</section>
```
```js
// js/main.js
const state = document.getElementById('servicesState');
const list  = document.getElementById('servicesList');

function showLoading(){ state.textContent = 'Cargando…'; state.hidden=false; list.hidden=true; }
function showEmpty(){ state.textContent = 'Sin servicios disponibles'; state.hidden=false; list.hidden=true; }
function showError(){ state.textContent = 'Error al cargar'; state.hidden=false; list.hidden=true; }
function showList(){ state.hidden=true; list.hidden=false; }
```

### 5.4 Alineación con la API (nombres y DTOs)
**Antes**
```html
<li><h3>Items</h3><p>Tenemos 120 ítems</p></li>
```
**Después**
```html
<li><h3>Productos</h3><p>Tenemos 120 productos</p></li>
<!-- alineado con GET /products -->
```

---

## 6) Capturas comentadas (formato sugerido)
En `docs/ui-review.md`, por cada captura incluye:

```md
### Pantalla: Inicio — Hero
![captura-hero](./img/hero.png)

**Observaciones**
- Semántica correcta: `h1` presente, CTA como `<a>` con rol de botón si aplica.
- Contraste de subtítulo borderline (revisar).

**Acciones propuestas**
- Aumentar contraste del subtítulo al menos a 4.5:1.
- Añadir `aria-label` al botón de menú móvil.
```

> Guarda las imágenes en `docs/img/` (pueden ser capturas locales del navegador).

---

## 7) Checklist de accesibilidad mínima
- [ ] **Jerarquía**: un solo `h1` por página; títulos descendentes ordenados.  
- [ ] **Navegación por teclado**: orden lógico; no hay trampas de foco.  
- [ ] **Foco visible**: en todos los elementos interactivos.  
- [ ] **Contraste**: texto y controles ≥ **4.5:1**.  
- [ ] **Texto alternativo** en imágenes informativas (`alt`).  
- [ ] **ARIA** solo cuando sea necesario (no sustituye semántica nativa).  
- [ ] **Estados**: vacío/error/carga indicados y anunciados (`aria-live` si aplica).  
- [ ] **Idioma** del documento (`<html lang="es">`).

---

## 8) Procedimiento reproducible (paso a paso)
1. Realiza **capturas** de las secciones clave (Hero, navegación, listados, contacto).  
2. Ejecuta el **prompt 4.1** en ChatGPT con el HTML y el glosario del dominio.  
3. Ejecuta el **prompt 4.2** para accesibilidad; aplica los difs mínimos en HTML/CSS/JS.  
4. Verifica manualmente: **teclado**, **foco**, **contraste** (usa una extensión si la tienes).  
5. Documenta en `docs/ui-review.md` las **capturas comentadas** y los cambios.  
6. Revisa coherencia con la **API** (nombres y DTOs): que UI no prometa datos que el backend no expone.

**Criterios de aceptación**
- [ ] `docs/ui-review.md` con 4–6 capturas y comentarios.  
- [ ] HTML semántico y **accesibilidad mínima** verificada.  
- [ ] Nombres/UI alineados con dominio y API.  
- [ ] Estados vacíos/errores/carga contemplados.

---

## 9) Anti‑patrones frecuentes
- **Encabezados fuera de orden** (h3 antes que h2).  
- **Botones que son enlaces** (o viceversa) sin semántica correcta.  
- **Placeholders como labels** (no accesibles).  
- **Color como único indicador** (añade iconos/texto).  
- **Prometer datos** que tu API no ofrece.

**Correcciones rápidas**
- Reordenar encabezados; usar `<button>` para acciones y `<a>` para navegación.  
- Añadir `<label>` a inputs y descripciones (`aria-describedby`).  
- Añadir texto de apoyo además del color.

---

## 10) Entregables del módulo
- `docs/ui-review.md` con capturas y comentarios.
- Difs o bloques de código (HTML/CSS/JS) aplicados.
- Checklist de accesibilidad completado.
- Bitácora de prompts (sección UI).

---

## Glosario esencial del módulo
- **Accesibilidad:** prácticas que aseguran que todas las personas puedan usar la interfaz sin barreras.
- **Estado vacío / error / carga:** situaciones que muestran mensajes cuando no hay datos, hay un problema o la información está llegando.
- **Microcopy:** textos cortos que guían al usuario (por ejemplo, el texto de un botón o un mensaje de ayuda).
- **Semántica HTML:** uso correcto de etiquetas (como `<button>` o `<nav>`) para que el navegador y las herramientas de asistencia entiendan la estructura.
- **UI (User Interface):** la parte visual con la que interactúa la persona usuaria.

---

### Apéndice A — Prompt de microcopys
```text
Mejora estos microcopys para mayor claridad y consistencia con el dominio. Mantén tono [formal/profesional]. Devuelve tabla antes→después con justificación breve.
```

### Apéndice B — Prompt de colores y contraste
```text
Con esta paleta, dime combinaciones texto/fondo que cumplan 4.5:1. Propón variables CSS y difs mínimos para aplicarlas.
```

---

Con este módulo garantizas que la **UI comunica fielmente el dominio y la API**, es **comprensible y accesible**, y queda **documentada** para evoluciones posteriores.
