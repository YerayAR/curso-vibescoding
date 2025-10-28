# Módulo 3 — Diseño del Dominio (DDD pragmático, sin dependencias)
> **Objetivo del módulo**
> Diseñar el **corazón lógico** de la aplicación sin atarla a frameworks: **Ubiquitous Language**, **entidades**, **Value Objects**, **casos de uso** y **repositorios abstractos**. Todo en archivos planos (JS/TS/psuedocódigo) y **sin instalaciones**. Validaremos el modelo con **pruebas mínimas** (manuales o funciones de verificación) y una **bitácora** de decisiones.

> **Nota para quienes vienen de otras disciplinas**
> Pensá en este módulo como armar el plano de una casa antes de construirla. Definimos palabras en común, reglas y pasos sin comprometernos con herramientas complejas.

---

## 1) Resultados de aprendizaje
Al finalizar, podrás:
1. Construir un **lenguaje ubicuo** y un **mapa de contexto** básico.  
2. Modelar **entidades y VOs** con **invariantes explícitas**.  
3. Definir **casos de uso** como **servicios de aplicación** finos que orquestan el dominio.  
4. Declarar **repositorios abstractos (puertos)** y **fakes en memoria** para validar reglas.  
5. Documentar el dominio con prompts, **criterios de aceptación** y ejemplos Given‑When‑Then.

---

## 2) Herramientas: papel en este módulo
- **ChatGPT**: generar el **glosario**, proponer **entidades/VOs**, escribir **invariantes** y **escenarios de prueba**; revisar consistencia.  
- **Copilot/Codex**: producir **archivos de contrato** (interfaces) y **stubs** de casos de uso; extraer helpers.  
- **VSCode**: organizar carpetas, refactor de nombres, *split files*.  
- **Terminal** (opcional): crear/mover archivos.  
- **Bitácora** (`/docs/`): decisiones (ADR), prompts y ejemplos.

---

## 3) Estructura base del dominio
Crea (o verifica) esta estructura mínima:
```text
/domain
  ├─ glossary.md          # Ubiquitous Language (términos y definiciones)
  ├─ entities/            # Entidades (con identidad e invariantes)
  ├─ value-objects/       # Objetos de valor (inmutables)
  ├─ use-cases/           # Casos de uso (servicios de aplicación)
  ├─ ports/               # Interfaces (p. ej., Repositorios)
  └─ fakes/               # Implementaciones en memoria para validar reglas
```

---

## 4) Prompts base (multifase Yeray)

### 4.1 Lenguaje ubicuo + límites de contexto
```text
Título: Lenguaje ubicuo y mapa de contexto

Contexto: Quiero definir el dominio de [tema], con foco en una primera iteración simple.

Solicito:
1) Glosario (término → definición breve, con ejemplos si aplica).
2) Eventos o reglas clave (qué no puede ocurrir).
3) Primer mapa de contexto: “Núcleo” + “Soportes” (si aplica).

Formato: Markdown para `domain/glossary.md`.
```

### 4.2 Entidades y VOs con invariantes
```text
Título: Entidades y Value Objects (con invariantes)

Contexto: A partir del glosario, propón entidades y VOs. Para cada una: propósito, campos, invariantes y ejemplos válidos/no válidos.

Solicito:
- 2–3 Entidades (con identidad clara).
- 2–3 Value Objects (inmutables, validados al crear).
- Reglas: qué debe fallar.
- Firmas de constructores/factories y métodos mínimos.

Formato: listo para `domain/entities/*` y `domain/value-objects/*`.
```

### 4.3 Casos de uso y puertos
```text
Título: Casos de uso y repositorios abstractos

Contexto: Necesito 2–3 casos de uso mínimos y los puertos que requieren (repositorios). No incluir detalles de persistencia.

Solicito:
- Descripción de cada caso (Given-When-Then).
- Interfaz del repositorio (métodos y contratos).
- Esbozo del caso de uso (pasos y precondiciones).

Formato: para `domain/use-cases/*` y `domain/ports/*`.
```

---

## 5) Ejemplo guiado (dominio: **Catálogo y alquiler**)

### 5.1 Glosario (extracto)
Archivo: `domain/glossary.md`
```md
## Términos clave
- Producto: elemento alquilable con atributos como marca y disponibilidad.
- Marca: agrupador comercial de productos.
- Alquiler: reserva de un producto por fechas con política de cancelación.
- Cliente: quien solicita un alquiler; identificado por email y nombre.
- Disponibilidad: regla que impide solapar reservas para el mismo producto.
```

### 5.2 Value Objects
Archivo: `domain/value-objects/Email.js`
```js
export function makeEmail(value){
  const ok = typeof value === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
  if(!ok) throw new Error('Email inválido');
  return Object.freeze({ value, toString: ()=>value });
}
```

Archivo: `domain/value-objects/DateRange.js`
```js
export function makeDateRange({from, to}){
  const f = new Date(from), t = new Date(to);
  if(isNaN(f) || isNaN(t) || f >= t) throw new Error('Rango de fechas inválido');
  return Object.freeze({
    from: f, to: t,
    overlaps(other){ return f < other.to && other.from < t; }
  });
}
```

### 5.3 Entidades (con factories)
Archivo: `domain/entities/Product.js`
```js
export function makeProduct({id, name, brand}){
  if(!id || !name || !brand) throw new Error('Producto inválido');
  return Object.freeze({ id, name, brand });
}
```

Archivo: `domain/entities/Rental.js`
```js
export function makeRental({id, productId, customerEmail, range}){
  if(!id || !productId) throw new Error('Alquiler inválido');
  return Object.freeze({ id, productId, customerEmail, range });
}
```

### 5.4 Puertos (repositorios abstractos)
Archivo: `domain/ports/RentalRepository.d.ts` (o `.js` con JSDoc)
```ts
export interface RentalRepository {
  findByProduct(productId: string): Promise<Rental[]> | Rental[];
  save(rental: Rental): Promise<void> | void;
}
```

### 5.5 Caso de uso: **Crear alquiler** (evitar solapamientos)
Archivo: `domain/use-cases/createRental.js`
```js
export async function createRental({rentalRepo, productRepo}, dto){
  // Precondiciones
  const rental = dtoToRental(dto); // convertir DTO a entidad + VOs
  // Regla de disponibilidad (no solapar)
  const existing = await rentalRepo.findByProduct(rental.productId);
  const overlap = existing.some(r => rental.range.overlaps(r.range));
  if(overlap) throw new Error('Rango no disponible');
  await rentalRepo.save(rental);
  return rental;
}

// helper de ensamblaje (DTO → Entidad)
import { makeRental } from '../entities/Rental.js';
import { makeEmail } from '../value-objects/Email.js';
import { makeDateRange } from '../value-objects/DateRange.js';

function dtoToRental(dto){
  const email = makeEmail(dto.customerEmail);
  const range = makeDateRange(dto.range);
  return makeRental({ id: dto.id, productId: dto.productId, customerEmail: email, range });
}
```

### 5.6 Fake Repository (validación sin persistencia real)
Archivo: `domain/fakes/InMemoryRentalRepository.js`
```js
export function makeInMemoryRentalRepository(seed = []){
  const data = [...seed];
  return Object.freeze({
    findByProduct(productId){
      return data.filter(r => r.productId === productId);
    },
    save(rental){
      data.push(rental);
    },
    _dump(){ return [...data]; } // para ver estado en pruebas manuales
  });
}
```

---

## 6) Verificación mínima (sin herramientas externas)
Crea `domain/use-cases/_manual-test.js` (ejecútalo con doble clic si tu sistema abre .js con un motor, o léelo como pseudocódigo):
```js
import { makeInMemoryRentalRepository } from '../fakes/InMemoryRentalRepository.js';
import { createRental } from './createRental.js';

const repo = makeInMemoryRentalRepository([]);
const dto1 = { id:'r1', productId:'p1', customerEmail:'a@b.com', range:{ from:'2025-10-25', to:'2025-10-28' } };
const dto2 = { id:'r2', productId:'p1', customerEmail:'c@d.com', range:{ from:'2025-10-27', to:'2025-10-29' } };

const r1 = await createRental({ rentalRepo: repo }, dto1); // OK
console.log('r1 ok', r1);

try {
  await createRental({ rentalRepo: repo }, dto2); // Debe fallar por solape
  console.error('ERROR: se esperaba solape');
} catch (e) {
  console.log('OK: solape detectado', e.message);
}
```

Si no puedes ejecutar, **“simula”** el resultado esperado y documenta el razonamiento en `docs/decisiones.md`.

---

## 7) Criterios de aceptación (DoD del módulo)
- [ ] `domain/glossary.md` con términos acordados.  
- [ ] 2–3 **Entidades** y 2–3 **VOs** con invariantes documentadas.  
- [ ] 2–3 **Casos de uso** descritos (Given‑When‑Then) y uno implementado.  
- [ ] **Repositorios abstractos** definidos y un **fake en memoria**.  
- [ ] Verificación mínima (manual o simulada) con **resultado esperado** documentado.  
- [ ] Bitácora con prompts y decisiones clave.

---

## 8) Ejercicio guiado (paso a paso)
1. Ejecuta el prompt de **glosario y contexto** (§4.1) y guarda en `domain/glossary.md`.  
2. Ejecuta el prompt de **entidades y VOs** (§4.2); crea archivos bajo `entities/` y `value-objects/`.  
3. Ejecuta el prompt de **casos de uso y puertos** (§4.3); crea archivos bajo `use-cases/` y `ports/`.  
4. Implementa **un caso de uso** completo con un **fake** en `fakes/`.  
5. Realiza una **verificación mínima** (manual o con un script simple).  
6. Registra en `/docs/` el prompt, la decisión y el resultado esperado.

**Checklist de revisión**
- [ ] Reglas de negocio explícitas (comentarios/doc).  
- [ ] VOs **inmutables** y validados al construir.  
- [ ] Casos de uso **no** dependen de infraestructura.  
- [ ] Puertos **simples** (métodos necesarios, nada extra).

---

## 9) Anti‑patrones a evitar
- **Dominar con infraestructura**: meter persistencia o detalles externos en el dominio.  
- **Entidades anémicas**: sin invariantes ni métodos de negocio.  
- **Varios orígenes de verdad**: reglas duplicadas en distintos sitios.  
- **Diseño “por si acaso”**: agregar parámetros o capas que no necesitas ahora.

**Correcciones rápidas**
- Extraer VO para campos con reglas (p. ej., Email, DateRange).  
- Mover reglas al **caso de uso** o a la **entidad** cuando corresponda.  
- Reducir firmas a lo **mínimo indispensable**.

---

## 10) Bitácora y documentación (ligera)
- `docs/prompts.md`: prompts de glosario, entidades/VOs y casos de uso.  
- `docs/decisiones.md`: por qué cierta regla se ubicó en VO vs entidad; por qué un puerto tiene esos métodos.  
- (Opcional) `docs/adr/ADR-0002.md`: “Principios de dominio y puertos”.

---

## 11) Preparación para el Módulo 4 (Infraestructura)
- Identifica **qué puertos** requieren implementación concreta (p. ej., `RentalRepository`).
- Define **contratos de errores** y **DTOs de entrada/salida** estables.
- Lista **datos de prueba** para seeds (sin exponer PII real).

---

## Glosario esencial del módulo
- **Caso de uso:** historia breve que describe cómo alguien utiliza el sistema para lograr un objetivo específico.
- **Dominio:** conjunto de reglas y conceptos que representan el problema real que tu aplicación resuelve.
- **Entidad:** objeto con identidad propia y atributos que pueden cambiar en el tiempo.
- **Lenguaje ubicuo:** vocabulario común acordado por todas las personas del equipo para evitar confusiones.
- **Repositorio (abstracto):** contrato que define cómo obtener o guardar datos sin especificar la tecnología utilizada.
- **Value Object (VO):** objeto que representa un valor con reglas claras (por ejemplo, un correo válido) y que no cambia por referencia.

---

### Apéndice A — Mini‑prompt de consistencia de dominio
```text
Valida consistencia del dominio:
- ¿Hay invariantes no expresadas?
- ¿Qué reglas dependen de fechas/zonas horarias?
- ¿Qué asunciones estoy haciendo en los casos de uso?
- Proponer 2 casos borde adicionales por caso de uso.
```

### Apéndice B — Mini‑prompt para pruebas sin framework
```text
Dame una secuencia de comprobaciones manuales (Given-When-Then) para este caso de uso, con datos concretos y resultados esperados, sin emplear frameworks de testing.
```
