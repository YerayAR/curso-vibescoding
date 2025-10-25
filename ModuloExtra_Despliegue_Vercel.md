# Módulo Extra — Despliegue en Vercel: de local a producción en minutos

> **Objetivo del módulo**
> Aprender a desplegar tu proyecto web estático en Vercel, configurar dominios personalizados, gestionar variables de entorno y automatizar deploys desde Git. Pasarás de tener tu web funcionando solo en tu máquina a tenerla accesible públicamente con HTTPS y certificados automáticos.
>
> **Nota para quien empieza**
> No necesitas conocimientos previos de DevOps o servidores. Vercel abstrae toda la complejidad y te permite desplegar con un solo comando o desde la interfaz web.

---

## 1) Resultados de aprendizaje

Al finalizar, podrás:
1. **Explicar** qué es un servicio de hosting estático y por qué Vercel es una opción ideal.
2. **Desplegar** un proyecto web estático desde la CLI o desde la interfaz web.
3. **Configurar** dominios personalizados y variables de entorno.
4. **Automatizar** deploys desde GitHub/GitLab con integración continua.
5. **Diagnosticar** errores comunes de despliegue y resolverlos rápidamente.
6. **Optimizar** el rendimiento con headers, redirects y configuración de caché.

---

## 2) ¿Qué es Vercel y por qué usarlo?

### 2.1 Definición
**Vercel** es una plataforma de hosting especializada en sitios estáticos y aplicaciones frontend. Ofrece:
- **Deploy instantáneo** (30-60 segundos)
- **HTTPS automático** con certificados SSL
- **CDN global** para velocidad óptima
- **Preview deploys** para cada branch/PR
- **Zero-config** para proyectos estáticos

### 2.2 Ventajas clave
- ✅ **Gratis para proyectos personales** (límites generosos)
- ✅ **No requiere configurar servidores** ni Docker
- ✅ **Integración nativa con Git** (GitHub, GitLab, Bitbucket)
- ✅ **Analytics y Web Vitals** incluidos
- ✅ **Rollback instantáneo** a versiones anteriores

### 2.3 Casos de uso ideales
- Landing pages y portfolios
- Documentación técnica
- SPAs (Single Page Applications)
- Sitios generados estáticamente
- Prototipos y demos

---

## 3) Requisitos previos

### 3.1 Cuenta en Vercel
1. Ve a [vercel.com/signup](https://vercel.com/signup)
2. Regístrate con GitHub, GitLab o email
3. Completa el onboarding básico

### 3.2 Instalación de Vercel CLI
```bash
npm install -g vercel
# O con pnpm
pnpm add -g vercel
# O con yarn
yarn global add vercel
```

**Verificar instalación:**
```bash
vercel --version
```

### 3.3 Login desde la terminal
```bash
vercel login
```
- Se abrirá el navegador para autenticarte
- Una vez autenticado, ya puedes desplegar desde CLI

---

## 4) Estructura del proyecto para Vercel

### 4.1 Proyecto estático simple
```text
mi-proyecto/
├─ public/              # Carpeta con archivos estáticos
│  ├─ index.html
│  ├─ assets/
│  │  ├─ css/
│  │  ├─ js/
│  │  └─ img/
│  └─ favicon.ico
├─ vercel.json          # Configuración opcional
└─ .gitignore
```

### 4.2 Archivo `vercel.json` (opcional)
```json
{
  "version": 2,
  "buildCommand": null,
  "outputDirectory": "public",
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    }
  ]
}
```

---

## 5) Despliegue desde la CLI

### 5.1 Despliegue de prueba (preview)
Desde la raíz del proyecto:
```bash
vercel
```
- Responde las preguntas del wizard
- Se generará una URL temporal: `https://tu-proyecto-xxx.vercel.app`
- Este deploy es temporal y sirve para testear

### 5.2 Despliegue a producción
```bash
vercel --prod
```
- Despliega directamente a la URL de producción
- Se asigna automáticamente a tu dominio vercel.app
- Opcionalmente vincula a un dominio custom

### 5.3 Opciones útiles de CLI
```bash
# Ver logs del último deploy
vercel logs

# Listar deploys
vercel ls

# Inspeccionar un deploy específico
vercel inspect [URL]

# Eliminar un proyecto
vercel remove [nombre-proyecto]

# Vincular proyecto existente
vercel link
```

---

## 6) Despliegue desde la interfaz web

### 6.1 Import desde Git
1. Ve a [vercel.com/new](https://vercel.com/new)
2. Conecta tu cuenta de GitHub/GitLab
3. Selecciona el repositorio
4. Configura:
   - **Framework Preset:** Other (para estáticos puros)
   - **Root Directory:** `./` o `./public`
   - **Build Command:** (dejar vacío si no hay build)
   - **Output Directory:** `public`
5. Click en **Deploy**

### 6.2 Ventajas del deploy desde Git
- ✅ **Deploys automáticos** en cada push a main/master
- ✅ **Preview URLs** para cada Pull Request
- ✅ **Rollback fácil** desde el dashboard
- ✅ **Collaboration** con equipo

---

## 7) Configuración avanzada

### 7.1 Dominios personalizados

**Desde el dashboard:**
1. Ve a tu proyecto → Settings → Domains
2. Añade tu dominio: `tudominio.com`
3. Configura DNS según instrucciones:
   ```text
   Tipo: CNAME
   Nombre: www
   Valor: cname.vercel-dns.com
   
   Tipo: A
   Nombre: @
   Valor: 76.76.21.21
   ```
4. Espera propagación (1-48h, usualmente <5 min)

**Desde CLI:**
```bash
vercel domains add tudominio.com
```

### 7.2 Variables de entorno

**Desde dashboard:**
1. Proyecto → Settings → Environment Variables
2. Añade variables:
   - `API_KEY`
   - `ANALYTICS_ID`
   - etc.
3. Selecciona entornos: Production, Preview, Development

**Desde CLI:**
```bash
vercel env add API_KEY
```

**Uso en código (si tienes build process):**
```js
const apiKey = process.env.API_KEY;
```

### 7.3 Redirects y Rewrites

**En `vercel.json`:**
```json
{
  "redirects": [
    {
      "source": "/blog",
      "destination": "https://blog.midominio.com"
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.backend.com/:path*"
    }
  ]
}
```

### 7.4 Headers personalizados

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

---

## 8) Troubleshooting común

### 8.1 Error 404 en rutas
**Síntoma:** Las rutas `/about`, `/contact` dan 404

**Solución (SPA):**
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 8.2 Build falla
**Síntoma:** "Error: Build failed with exit code 1"

**Diagnóstico:**
```bash
vercel logs [URL-del-deploy]
```

**Causas comunes:**
- Comando de build incorrecto
- Dependencias faltantes
- Variables de entorno no configuradas

### 8.3 Assets no se cargan
**Síntoma:** CSS/JS/imágenes no aparecen

**Solución:**
- Verifica rutas relativas vs absolutas
- Para estáticos: usa rutas absolutas `/assets/...`
- Revisa `outputDirectory` en vercel.json

### 8.4 Caché antiguo
**Síntoma:** Cambios no se reflejan

**Solución:**
- Ctrl+Shift+R (hard refresh)
- Incrementa versión de archivos
- Configura headers de caché correctos

---

## 9) Optimizaciones de rendimiento

### 9.1 Compresión de imágenes
```bash
# Antes de desplegar, optimiza imágenes
npm install -g sharp-cli
sharp -i ./assets/img/*.jpg -o ./assets/img/ --format webp
```

### 9.2 Cache-Control headers
```json
{
  "headers": [
    {
      "source": "/assets/img/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).html",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

### 9.3 Preload de recursos críticos
```html
<link rel="preload" href="/assets/css/critical.css" as="style">
<link rel="preload" href="/assets/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
```

---

## 10) Workflow recomendado

### 10.1 Desarrollo local
```bash
# Desarrollo con servidor local
npx serve public
# O
python -m http.server 8000 -d public
```

### 10.2 Preview deploy
```bash
git checkout -b feature/nueva-funcionalidad
# Haz cambios...
git add .
git commit -m "feat: nueva funcionalidad"
git push origin feature/nueva-funcionalidad
# Vercel creará automáticamente un preview deploy
```

### 10.3 Merge a producción
```bash
# Después de revisar preview
git checkout main
git merge feature/nueva-funcionalidad
git push origin main
# Deploy automático a producción
```

---

## 11) Checklist de despliegue

Antes de desplegar a producción, verifica:

- [ ] **Imágenes optimizadas** (WebP, comprimidas)
- [ ] **Meta tags** completos (title, description, og:image)
- [ ] **Favicon** presente (SVG + fallbacks)
- [ ] **robots.txt** configurado
- [ ] **sitemap.xml** generado
- [ ] **404.html** personalizado
- [ ] **Analytics** configurados (opcional)
- [ ] **Lighthouse score** > 90 (Performance, Accessibility, SEO)
- [ ] **HTTPS** funcionando (automático en Vercel)
- [ ] **Dominio custom** configurado (si aplica)
- [ ] **Redirects** de URLs antiguas (si aplica)
- [ ] **Headers de seguridad** configurados
- [ ] **Pruebas en móvil** (responsive)
- [ ] **Pruebas de carga** (todas las páginas cargan correctamente)

---

## 12) Recursos adicionales

### 12.1 Documentación oficial
- [Vercel Docs](https://vercel.com/docs)
- [vercel.json Reference](https://vercel.com/docs/project-configuration)
- [CLI Documentation](https://vercel.com/docs/cli)

### 12.2 Plantillas y ejemplos
- [Vercel Templates](https://vercel.com/templates)
- [Ejemplo estático HTML/CSS/JS](https://github.com/vercel/vercel/tree/main/examples/static)

### 12.3 Comunidad
- [Discord de Vercel](https://vercel.com/discord)
- [GitHub Discussions](https://github.com/vercel/vercel/discussions)

---

## 13) Ejercicio práctico

### 13.1 Despliegue básico
1. Toma tu proyecto del Módulo 1
2. Añade un `vercel.json` con configuración básica
3. Despliega con `vercel --prod`
4. Comparte la URL generada

### 13.2 Configuración avanzada
1. Añade un dominio personalizado
2. Configura headers de seguridad
3. Crea un redirect de una URL antigua
4. Añade variables de entorno para Analytics

### 13.3 CI/CD automático
1. Sube tu proyecto a GitHub
2. Conecta el repo con Vercel
3. Crea una rama `dev`
4. Haz un cambio y push
5. Verifica que se crea un preview deploy
6. Merge a `main` y verifica deploy a producción

---

## 14) Criterios de aceptación

Al completar este módulo, deberías tener:
- ✅ Web desplegada y accesible públicamente
- ✅ HTTPS funcionando automáticamente
- ✅ Deploys automáticos desde Git
- ✅ Preview URLs para branches
- ✅ Configuración de dominio (opcional)
- ✅ Headers de seguridad configurados
- ✅ Lighthouse score > 85 en todas las métricas
- ✅ Documentación del proceso en tu bitácora

---

## 15) Próximos pasos

Una vez domines el despliegue básico, puedes explorar:
- **Vercel Analytics** para métricas de tráfico
- **Edge Functions** para lógica serverless
- **Image Optimization** con Next.js Image
- **Middleware** para A/B testing
- **Monorepos** con múltiples proyectos

---

**¡Felicidades!** Ahora dominas el ciclo completo: desarrollar localmente, versionar con Git y desplegar a producción en Vercel. Tu web ya es accesible para el mundo entero. 🚀
