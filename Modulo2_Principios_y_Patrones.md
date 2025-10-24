# Módulo 2 — Principios y Patrones: Guía de revisión estructural para código generado por IA
> **Objetivo del módulo**  
> Enseñar a **entrenar a la IA** y no depender ciegamente de ella: aplicar **SOLID, DRY, KISS, YAGNI**, usar **Clean Code** y **Clean Architecture** como filtros de revisión, incorporar patrones **Factory, Repository, Adapter, Strategy** cuando aporten valor, y establecer una **validación continua con ChatGPT** antes de ejecutar.

---

## 1) Resultados de aprendizaje
Al finalizar, podrás:
1. **Diagnosticar** problemas típicos del código generado por IA (acoplamiento, duplicación, nombres ambiguos).  
2. **Refactorizar** con criterios **SOLID/DRY/KISS/YAGNI** y reglas de **Clean Code**.  
3. **Aplicar patrones** (Factory, Repository, Adapter, Strategy) **solo cuando resuelvan un problema real**.  
4. **Estandarizar prompts de revisión** (plantillas Yeray) y ejecutarlos como **puertas de calidad**.  
5. **Documentar antes/después** para construir conocimiento reusable.

---

## 2) Herramientas y rol en este módulo
- **ChatGPT**: auditorías guiadas (prompts de revisión), propuestas de refactor y documentación “antes/después”.  
- **Copilot/Codex**: generación de diffs sugeridos y extracción de funciones/métodos.  
- **VSCode**: aplicar refactors, navegar dependencias, ejecutar comparativas (*diff view*).  
- **Terminal** (Warp o similar): utilidades de búsqueda de duplicados (`grep`, `find`) o métricas básicas (opcional).  
- **Bitácora** (`/docs/prompts.md` + `/docs/refactors.md`): registro de decisiones y evidencias.

> **Nota:** seguimos sin dependencias externas. Todos los ejemplos usan pseudo‑código o JavaScript/TypeScript **sin toolchains**.

---

## 3) Principios esenciales (resumen operativo)

### 3.1 SOLID (interpretación práctica)
- **S**ingle Responsibility: cada módulo **tiene un motivo único** para cambiar.  
- **O**pen/Closed: extender por **nuevas implementaciones**, no editar lógica estable.  
- **L**iskov Substitution: las implementaciones **no rompen expectativas** del contrato.  
- **I**nterface Segregation: **interfaces pequeñas** y específicas; evita “interfaces dios”.  
- **D**ependency Inversion: dependencias hacia **abstracciones**, no concretos.

### 3.2 DRY / KISS / YAGNI
- **DRY**: elimina duplicaciones **con sentido**; abstrae solo si simplifica mantenimiento.  
- **KISS**: elige la **solución más simple** que cumple los requisitos.  
- **YAGNI**: **no** implementes lo que **no** se necesita ahora (deja espacio para crecer).

### 3.3 Clean Code / Clean Architecture (como filtros)
- **Nombres** expresivos (sustantivos para entidades, verbos para acciones).  
- **Funciones** cortas, parámetros pocos y claros.  
- **Separación** de **dominio** vs **infra** vs **aplicación** (controladores).  
- **Sin lógica** de negocio en controladores o adaptadores.

---

## 4) Plantilla de prompts de revisión (Yeray Style)

### 4.1 Prompt general de auditoría estructural
```text
Título: Revisión estructural (SOLID/DRY/KISS/YAGNI + Clean)

Contexto: Tengo este módulo [nombre y breve propósito]. Quiero detectar acoplamientos, duplicación, nombres pobres y violaciones de principios.

Fases:
1) Diagnóstico: lista de code smells por archivo (breve), dependencias críticas y riesgos.
2) Refactor propuesto: pasos concretos (por archivo), sin romper contratos públicos.
3) Patrones aplicables: [Factory/Repository/Adapter/Strategy] solo si simplifican; justificar.
4) Validación: checklist de aceptación; casos de prueba manuales y unitarios mínimos.
5) Entregables: diffs sugeridos (alto nivel), nuevos nombres, interfaces y estructura de carpetas.

Criterios de aceptación:
- Bajo acoplamiento, alta cohesión, nombres claros.
- DRY sin sobre‑abstracción; KISS; YAGNI respetado.
- Dependencias hacia abstracciones; tests pasan.
```

### 4.2 Prompt para **nombres y contratos**
```text
Título: Mejora de nombres y contratos públicos

Contexto: Necesito uniformar naming y contratos sin romper compatibilidad.

Solicito:
- Tabla “antes → después” para clases/métodos/variables clave.
- Justificación breve de cada cambio (intención, claridad de dominio).
- Verificación: lista de llamadas afectadas y cómo actualizarlas (si procede).
```

### 4.3 Prompt para **eliminar duplicación** (DRY)
```text
Título: Duplicación y funciones utilitarias

Contexto: Detecta bloques repetidos y sugiere extracción mínima (sin sobre‑diseño).

Solicito:
- Lista de duplicaciones con rutas y líneas aproximadas.
- Propuesta de función/módulo utilitario con firma clara.
- Riesgos de sobre‑abstracción y cómo evitarlos.
```

---

## 5) Ejemplos antes/después (mini‑casos)

### 5.1 KISS + SRP (Single Responsibility)
**Antes**
```js
// loginAndRender.js
function handleLoginAndRender(userRepo, ui) {
  const user = userRepo.findByEmail(ui.email());
  if (!user || user.password !== ui.password()) {
    ui.showError("Credenciales inválidas");
    return;
  }
  ui.setTheme(user.prefTheme || "light");
  ui.showDashboard(user);
}
```
**Problemas**: función hace autenticación **y** presentación; difícil de testear.

**Después**
```js
// auth.js
export function authenticate(userRepo, email, password) {
  const user = userRepo.findByEmail(email);
  if (!user || user.password !== password) return null;
  return user;
}

// presenter.js
export function renderDashboard(ui, user) {
  ui.setTheme(user.prefTheme || "light");
  ui.showDashboard(user);
}

// controlador (orquestador)
const user = authenticate(userRepo, ui.email(), ui.password());
if (!user) ui.showError("Credenciales inválidas");
else renderDashboard(ui, user);
```
**Beneficios**: responsabilidades separadas, tests más simples.

---

### 5.2 DRY (utilidad compartida)
**Antes**
```js
function formatPriceEUR(n){ return `${n.toFixed(2)} €`; }
function formatPriceUSD(n){ return `$ ${n.toFixed(2)}`; }
```
**Después**
```js
function formatPrice(n, symbol, suffix=false){
  const v = n.toFixed(2);
  return suffix ? `${v} ${symbol}` : `${symbol} ${v}`;
}
```
**Beneficios**: una única función configurable, menor duplicación.

---

### 5.3 Dependency Inversion + Repository
**Antes** (controlador depende de detalles de almacenamiento)
```js
import { writeFileSync, readFileSync } from 'fs';
export function getUserById(id){
  const data = JSON.parse(readFileSync('users.json','utf-8'));
  return data.find(u => u.id === id);
}
```
**Después** (depender de una **abstracción**)
```js
// domain/ports/UserRepository.ts
export interface UserRepository {
  findById(id: string): User | null;
}

// infra/FileUserRepository.ts (implementación concreta)
export class FileUserRepository implements UserRepository {
  constructor(filePath){ this.filePath = filePath; }
  findById(id){
    const data = JSON.parse(readFileSync(this.filePath,'utf-8'));
    return data.find(u => u.id === id) ?? null;
  }
}

// app/controller.js
export function showUserProfile(userRepo, id){
  const user = userRepo.findById(id);
  // ...
}
```
**Beneficios**: pruebas con **dobles** (fakes/mocks) y cambio de almacenamiento sin tocar la app.

---

### 5.4 Adapter (integración externa)
**Antes**
```js
function sendNotification(msg){
  // librería externa con firma rara
  return ExtLib.XYZnotify(msg, true, "L1");
}
```
**Después**
```js
// app/ports/Notifier.ts
export interface Notifier { send(message: string): Promise<void>; }

// infra/ExtLibNotifier.ts
export class ExtLibNotifier implements Notifier {
  async send(message){
    return ExtLib.XYZnotify(message, true, "L1");
  }
}

// uso: dependemos de Notifier, no de ExtLib
```
**Beneficios**: se aísla la librería; si cambia, solo se edita el adaptador.

---

### 5.5 Strategy (variantes de un algoritmo)
**Antes**
```js
function calcShipping(cost, country){
  if(country==='ES') return cost*0.1;
  if(country==='FR') return cost*0.12;
  return cost*0.2;
}
```
**Después**
```js
// strategies
const ES = cost => cost*0.1;
const FR = cost => cost*0.12;
const DEFAULT = cost => cost*0.2;

function calcShipping(cost, strategy=DEFAULT){
  return strategy(cost);
}
// uso: calcShipping(100, ES)
```
**Beneficios**: añadir nuevos países sin tocar el código existente (**Open/Closed**).

---

### 5.6 Factory (creación controlada)
**Antes**
```js
const user = { id, email, role, prefTheme };
```
**Después**
```js
function makeUser({id, email, role='user', prefTheme='light'}){
  if(!id || !email) throw new Error('User inválido');
  return Object.freeze({ id, email, role, prefTheme });
}
```
**Beneficios**: invariantes de dominio al nacer; objetos válidos por construcción.

---

## 6) Clean Architecture (aplicación pragmática)
**Regla de dependencias**: dominio **no conoce** infraestructura.  
**Capas mínimas**:
- **domain/**: entidades, value objects, casos de uso, **puertos** (interfaces).  
- **app/**: controladores/adaptadores de entrada; orquestan casos de uso.  
- **infra/**: repositorios concretos, clientes externos (adaptadores de salida).

**Checklist rápido**
- [ ] ¿Algún import del dominio apunta a infra? → **Error**.  
- [ ] ¿Controladores contienen lógica de negocio? → **Mover al dominio**.  
- [ ] ¿Interfaces y DTOs están claros y versionados? → **Estabilizar**.

---

## 7) Procedimiento de revisión (paso a paso)
1. **Leer propósito** del módulo y **mapa de dependencias** (VSCode: *Go to Definition/References*).  
2. **Ejecutar prompt de auditoría** (§4.1) en ChatGPT con **rutas/archivos clave**.  
3. **Aplicar refactor** en VSCode (renombrados, extracción de funciones, mover archivos).  
4. **Validar** con checklist (nombres, SRP, DRY razonable, dependencias hacia puertos).  
5. **Documentar antes/después** en `/docs/refactors.md` con fragmentos pequeños.  
6. **Iterar**: si surge un patrón, justificarlo con beneficios concretos y tests.

---

## 8) Entregables del módulo
- **Plantilla de prompts de revisión** (los §4.1–4.3).  
- **Ejemplos antes/después** (al menos 3 aplicados al proyecto del alumno).  
- **Checklist de calidad** (principios + arquitectura).  
- **Refactors documentados** en `/docs/refactors.md`.

---

## 9) Ejercicio guiado
1. Elige un archivo del proyecto de la **web estática** creada en el Módulo 1 (por ejemplo, `js/main.js`).  
2. **Aplica** el prompt de auditoría (§4.1) en ChatGPT con el contenido del archivo.  
3. **Refactoriza** siguiendo las propuestas viables (p. ej., separar menú móvil, tema y scroll en módulos pequeños).  
4. **Documenta** el *antes/después* (fragmentos) y el **por qué**.  
5. **Repite** con otra sección (p. ej., extraer un “helper” para manejo de atributos `aria-*`).

**Criterios de aceptación**
- [ ] Se aplicó al menos **un refactor SRP** y **un refactor DRY**.  
- [ ] Se evaluó la **necesidad real** de un patrón (y se justificó si se aplicó).  
- [ ] Hay **antes/después** con 1–3 fragmentos y explicación breve.  
- [ ] Bitácora actualizada (`/docs/prompts.md` y `/docs/refactors.md`).

---

## 10) Anti‑patrones frecuentes
- **Sobre‑abstracción**: crear interfaces o capas sin necesidad (viola KISS/YAGNI).  
- **“Controlador dios”**: controladores con lógica de negocio.  
- **Nombres crípticos**: abreviaturas sin contexto, violan Clean Code.  
- **Patrones por moda**: usar Strategy o Factory si **realmente** resuelve un problema.

**Correcciones rápidas**
- Consolidar en 1–2 funciones si la abstracción no aporta.  
- Mover reglas de negocio a **casos de uso** en `domain/`.  
- Renombrar con **intención**; añadir docstring breve si aplica.

---

## 11) Cierre del módulo (Definition of Done)
- [ ] Código auditado con **prompts de revisión** y **refactor aplicado**.  
- [ ] **Principios** (SOLID/DRY/KISS/YAGNI) evidentes en el resultado.  
- [ ] **Patrones** usados con justificación; sin sobre‑diseño.  
- [ ] **Documentación antes/después** presente y clara.  
- [ ] Proyecto listo para avanzar al **Módulo 3 (Diseño del Dominio)**.

---

### Apéndice A — Mini‑prompt para checklist instantáneo
```text
Dame un checklist de verificación rápida para este archivo, cubriendo:
- Nombres (intención clara), tamaño de funciones, parámetros.
- SRP, acoplamientos y dependencias.
- Oportunidades DRY razonables (sin sobre‑abstracción).
- Puntos KISS/YAGNI: ¿qué sobra?
- Sugerencias de prueba manual/unitaria breve.
Devuélvelo en formato lista marcable [ ] listo para pegar en el PR.
```
