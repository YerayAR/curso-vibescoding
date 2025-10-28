# Módulo 5 — Aplicación y API (REST/GraphQL) limpia, validada y documentada
> **Objetivo del módulo**
> Exponer el dominio mediante una **API limpia y delgada** (REST o GraphQL), con **validación de entrada**, **seguridad en la frontera**, **mecanismo uniforme de errores** y **documentación OpenAPI**. Todo con ejemplos **stack-agnostic** (sin depender de gestores de paquetes).

> **Nota si nunca construiste una API**
> Pensá en una API como un mostrador donde otras aplicaciones hacen pedidos y reciben respuestas claras. Aprenderás a proteger ese mostrador y a explicar cómo usarlo con palabras simples.

---

## 1) Resultados de aprendizaje
Al finalizar, podrás:
1. Diseñar **endpoints** que llamen a **casos de uso** del dominio sin mezclar lógica de negocio.  
2. Implementar **validación** y **middleware** de seguridad (AuthN/AuthZ) en la capa de aplicación.  
3. Crear un **contrato OpenAPI** y mantenerlo sincronizado con los endpoints.  
4. Ejecutar **pruebas de contrato** con `curl` o archivos `.http` (VSCode REST Client).  
5. Aislar dependencias externas mediante **adaptadores**.

---

## 2) Rol de herramientas (en esta capa)
- **ChatGPT**: generar la **tabla de rutas**, DTOs y esquemas de validación; redactar OpenAPI y casos de prueba.  
- **Copilot/Codex**: proponer controladores finos y middlewares; producir stubs de GraphQL si se requiere.  
- **VSCode**: organizar `/app`, editar `openapi.yaml`, crear `.http` y ver diffs.  
- **Terminal** (Warp o similar): ejecutar `curl` para pruebas de contrato.  
- **Bitácora** (`/docs/`): apuntar prompts, decisiones y evidencias.

---

## 3) Estructura base de la capa de aplicación
```text
/app
  ├─ routes/                 # mapeo endpoint → controlador
  ├─ controllers/            # invocan casos de uso (sin reglas de negocio)
  ├─ dto/                    # request/response DTOs
  ├─ schemas/                # validación declarativa (JSON Schema u otros)
  ├─ middlewares/            # auth, rate limit, logging, error handling
  ├─ adapters/               # p. ej., Notifier, PaymentGateway (hacia infra)
  └─ server/                 # bootstrap del servidor (placeholder agnóstico)
/docs
  ├─ openapi.yaml            # contrato de la API
  └─ tests.http              # pruebas de contrato (VSCode REST Client) o curl.md
```

> **Regla de oro**: los **controladores** solo **traducen** HTTP ↔ DTO ↔ caso de uso. Nada de lógica de negocio aquí.

---

## 4) Prompts de trabajo (multifase Yeray)

### 4.1 Mapa de endpoints ↔ casos de uso
```text
Título: Tabla de rutas y contratos (REST)

Contexto: Tengo estos casos de uso en `domain/use-cases`: [listarProductos, crearAlquiler, cancelarAlquiler]. Quiero una API REST mínima y limpia.

Solicito:
1) Tabla de rutas (método + path) ↔ caso de uso ↔ DTO de entrada/salida.
2) Esquemas de validación para cada DTO (JSON Schema).
3) Errores estandarizados (status, code, message, details).
4) Consideraciones de seguridad (AuthN/AuthZ) por ruta y scopes/roles.
```

### 4.2 Controladores y middlewares (delgados)
```text
Título: Controladores delgados y middlewares de validación/seguridad

Contexto: Genera controladores que llamen a los casos de uso sin lógica de negocio. Añade:
- Middleware de validación (contra JSON Schema).
- Middleware de AuthN/AuthZ (token o clave simple; placeholder).
- Manejador de errores uniforme (problem+json).

Entregables: archivos por carpeta (`routes/`, `controllers/`, `schemas/`, `middlewares/`), sin dependencias externas.
```

### 4.3 OpenAPI y pruebas de contrato
```text
Título: OpenAPI + pruebas de contrato (curl/.http)

Contexto: Redacta `docs/openapi.yaml` coherente con las rutas propuestas y crea `docs/tests.http` con requests de prueba (OK y errores). Incluye ejemplos y descripciones.
```

---

## 5) Ejemplo REST (stack‑agnostic)

### 5.1 Tabla de rutas (ejemplo)
| Método | Ruta                | Caso de uso         | Auth | Descripción |
|-------|----------------------|---------------------|------|-------------|
| GET   | /products            | listarProductos     | No   | Lista productos del catálogo |
| POST  | /rentals             | crearAlquiler       | Sí   | Crea un alquiler si hay disponibilidad |
| DELETE| /rentals/{id}        | cancelarAlquiler    | Sí   | Cancela un alquiler por ID |
| GET   | /health              | —                   | No   | Salud del servicio |

### 5.2 DTOs y esquemas (extracto)
`/app/dto/rental.dto.json`
```json
{
  "$id": "rental.create.request",
  "type": "object",
  "required": ["id", "productId", "customerEmail", "range"],
  "properties": {
    "id": { "type": "string", "minLength": 1 },
    "productId": { "type": "string", "minLength": 1 },
    "customerEmail": { "type": "string", "format": "email" },
    "range": {
      "type": "object",
      "required": ["from", "to"],
      "properties": {
        "from": { "type": "string" },
        "to": { "type": "string" }
      }
    }
  },
  "additionalProperties": false
}
```

`/app/dto/error.problem.json`
```json
{
  "type": "object",
  "required": ["type", "title", "status"],
  "properties": {
    "type":   { "type": "string", "format": "uri-reference" },
    "title":  { "type": "string" },
    "status": { "type": "integer" },
    "detail": { "type": "string" },
    "instance": { "type": "string" },
    "code":   { "type": "string" }
  },
  "additionalProperties": true
}
```

### 5.3 Controlador (pseudocódigo neutral)
`/app/controllers/rental.controller.js`
```js
import { createRental } from "../../domain/use-cases/createRental.js";

export async function postRental(ctx){
  // ctx: abstracción neutral (request/response)
  const payload = ctx.body(); // DTO ya validado por middleware
  // AuthZ basada en contexto (ej. rol "customer")
  if(!ctx.user() || !ctx.user().has("customer")) return ctx.forbid();

  try{
    const rental = await createRental(ctx.services(), payload);
    return ctx.created(rental); // 201 + body
  }catch(e){
    if(e.message.includes('Rango no disponible')){
      return ctx.conflict({ type:"https://errors/app/range-conflict", title:"No disponible", status:409 });
    }
    return ctx.error(e); // fallback → problem+json
  }
}
```

### 5.4 Middleware de validación (pseudocódigo)
`/app/middlewares/validate.js`
```js
export function validate(schema){
  return async (ctx, next) => {
    const data = ctx.body();
    const errors = validateAgainstSchema(schema, data); // implementa JSON Schema mínimo
    if(errors.length) return ctx.badRequest({ type:"https://errors/app/invalid-payload", title:"Entrada inválida", status:400, detail:errors[0] });
    return next();
  };
}
```

### 5.5 Middleware de AuthN/AuthZ (placeholder)
`/app/middlewares/auth.js`
```js
export function bearerAuth(required=true){
  return async (ctx, next) => {
    const token = ctx.header("authorization")?.replace(/^Bearer /,"");
    if(required && !token) return ctx.unauthorized();
    // Placeholder: decodifica/verifica y carga ctx.user()
    ctx.setUser(parseToken(token)); // mock o simple mapa
    return next();
  };
}
```

### 5.6 Rutas (enrutador mínimo)
`/app/routes/index.js`
```js
import { postRental } from "../controllers/rental.controller.js";
import { validate } from "../middlewares/validate.js";
import { bearerAuth } from "../middlewares/auth.js";
import rentalCreateSchema from "../dto/rental.dto.json" assert { type: "json" };

export function registerRoutes(app){
  app.get ("/health", (ctx)=> ctx.ok({status:"ok"}));
  app.get ("/products", (ctx)=> ctx.ok(ctx.services().productRepo.list()));
  app.post("/rentals", bearerAuth(true), validate(rentalCreateSchema), postRental);
  app.delete("/rentals/:id", bearerAuth(true), (ctx)=> {/* cancelar */});
}
```

> **Nota:** la “abstracción `ctx`” simula el framework. Puedes mapearla a tu tecnología preferida cuando implementes.

---

## 6) OpenAPI (extracto) — `docs/openapi.yaml`
```yaml
openapi: 3.0.3
info:
  title: Demo API
  version: 0.1.0
servers:
  - url: http://localhost:8081
paths:
  /health:
    get:
      summary: Health check
      responses:
        "200": { description: OK }
  /products:
    get:
      summary: Listar productos
      responses:
        "200":
          description: Lista de productos
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id: { type: string }
                    name: { type: string }
                    brand: { type: string }
  /rentals:
    post:
      summary: Crear alquiler
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/RentalCreate"
      responses:
        "201":
          description: Creado
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Rental"
        "400": { $ref: "#/components/responses/BadRequest" }
        "401": { $ref: "#/components/responses/Unauthorized" }
        "409": { $ref: "#/components/responses/Conflict" }
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
  schemas:
    RentalCreate:
      type: object
      required: [id, productId, customerEmail, range]
      properties:
        id: { type: string }
        productId: { type: string }
        customerEmail: { type: string, format: email }
        range:
          type: object
          required: [from, to]
          properties:
            from: { type: string }
            to: { type: string }
    Rental:
      type: object
      properties:
        id: { type: string }
        productId: { type: string }
        customerEmail: { type: string }
        range:
          type: object
          properties:
            from: { type: string }
            to: { type: string }
  responses:
    BadRequest:
      description: Entrada inválida
    Unauthorized:
      description: No autorizado
    Conflict:
      description: Conflicto de disponibilidad
```

> Mantén este archivo **fuente de verdad** del contrato. Cualquier cambio en endpoints debe **reflejarse aquí**.

---

## 7) Pruebas de contrato (curl / `.http`)

### 7.1 `docs/tests.http` (VSCode REST Client)
```http
### Health
GET http://localhost:8081/health

### Listar productos
GET http://localhost:8081/products

### Crear alquiler (OK)
POST http://localhost:8081/rentals
Authorization: Bearer demo-token
Content-Type: application/json

{
  "id": "r100",
  "productId": "p1",
  "customerEmail": "a@b.com",
  "range": { "from":"2025-10-25", "to":"2025-10-28" }
}

### Crear alquiler (solape → 409)
POST http://localhost:8081/rentals
Authorization: Bearer demo-token
Content-Type: application/json

{
  "id": "r101",
  "productId": "p1",
  "customerEmail": "x@y.com",
  "range": { "from":"2025-10-27", "to":"2025-10-29" }
}
```

### 7.2 `docs/curl.md` (alternativa)
```md
# Pruebas con curl
curl -i http://localhost:8081/health

curl -i http://localhost:8081/products

curl -i -X POST http://localhost:8081/rentals \
  -H "Authorization: Bearer demo-token" \
  -H "Content-Type: application/json" \
  -d '{"id":"r100","productId":"p1","customerEmail":"a@b.com","range":{"from":"2025-10-25","to":"2025-10-28"}}'
```

---

## 8) Seguridad en la frontera (resumen)
- **AuthN/AuthZ**: exigir token en rutas de mutación; roles/claims mínimas.  
- **Validación** estricta de entrada; **sanitización** de salida si interpolas HTML (no recomendado).  
- **Rate limiting** y **cabeceras** (CORS, cache, no revelar versión del servidor).  
- **Registro** de intentos fallidos y respuestas uniformes (evitar filtrar detalles).  
- **Idempotencia** en POST sensibles (si aplica) mediante claves de deduplicación.

> La **capa de seguridad extendida** se detalla en el módulo dedicado posterior.

---

## 9) Procedimiento reproducible (paso a paso)
1. Genera la **tabla de rutas** y DTOs con el prompt §4.1.  
2. Crea **controladores**, **middlewares** y **rutas** con el prompt §4.2 (sin lógica de negocio).  
3. Redacta `docs/openapi.yaml` con el prompt §4.3.  
4. Prepara `docs/tests.http` o `docs/curl.md` y **ejecuta** las pruebas de contrato.  
5. Documenta en `/docs/` decisiones y cambios detectados.

**Checklist de aceptación**
- [ ] Endpoints mapeados a casos de uso (sin reglas en controladores).  
- [ ] Validación y Auth aplicadas donde corresponde.  
- [ ] OpenAPI actualizado y coherente.  
- [ ] Pruebas de contrato reproducibles.  
- [ ] Errores estandarizados (problem+json o similar).

---

## 10) Anti‑patrones y correcciones
- **Controladores gordos**: trasladar reglas al dominio o a un servicio dedicado.  
- **Validación dispersa**: centralizar en `schemas/` y middleware único.  
- **Contrato desincronizado**: OpenAPI es **fuente de verdad**; actualizar en cada cambio.  
- **Dependencia directa** a clientes externos: envolver en `adapters/`.

**Correcciones rápidas**
- Extraer DTOs y esquemas; añadir manejador de errores global; aislar proveedores externos.

---

## 11) Entregables del módulo
- `/app` con `routes/`, `controllers/`, `dto/`, `schemas/`, `middlewares/`, `adapters/`, `server/`.
- `docs/openapi.yaml` y `docs/tests.http` (o `curl.md`).
- Bitácora con prompts y evidencias de pruebas.

---

## Glosario esencial del módulo
- **Endpoint:** dirección a la que se envía una petición (por ejemplo, `POST /clientes`) para obtener una acción concreta.
- **Middleware:** función intermedia que revisa la petición antes de que llegue al controlador (por ejemplo, validar datos o permisos).
- **OpenAPI:** documento que describe tu API en un formato estándar para que otras personas la entiendan y prueben fácilmente.
- **DTO (Data Transfer Object):** objeto que define la forma exacta en la que entran o salen los datos de tu API.
- **REST / GraphQL:** formas de diseñar APIs; REST usa rutas y verbos HTTP, GraphQL utiliza consultas flexibles en un único punto.
- **Validación:** proceso de comprobar que la información recibida cumple las reglas acordadas antes de procesarla.

---

### Apéndice A — Prompt para GraphQL (opcional)
```text
Diseña un esquema GraphQL (types, queries, mutations) para [Productos y Alquileres], alineado con los mismos casos de uso. Incluye ejemplos de queries/mutations y notas de autorización por campo.
```

### Apéndice B — Prompt de errores uniformes
```text
Propón un formato de errores (problem+json) con campos: type, title, status, code, detail, instance. Define mapeos por código HTTP y ejemplos por endpoint.
```

---

Con esto, tu **capa de aplicación y API** queda lista, alineada con el dominio (Módulo 3) y preparada para integrarse con la infraestructura (Módulo 4). El siguiente paso será profundizar en **seguridad** o avanzar hacia **integración visual** según el plan.
