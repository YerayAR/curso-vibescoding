# 📸 Cómo generar favicons correctos

## Estado actual

Los favicons actuales están temporalmente usando la imagen de portada completa (`asset/portada-curso.jpg`). Esto funciona, pero los archivos son más grandes de lo necesario (~1.8MB cada uno).

## Archivos de iconos

- ✅ `public/favicon.svg` - SVG generado con el rayo ⚡ del curso
- ✅ `public/favicon.ico` - Favicon ICO original (176 bytes)
- ⚠️ `public/apple-touch-icon.png` - Copia temporal de portada-curso.jpg
- ⚠️ `public/icon-192.png` - Copia temporal de portada-curso.jpg
- ✅ `public/og-image.jpg` - Imagen para redes sociales (portada del curso)

## Cómo generar favicons optimizados

### Opción 1: Herramientas online (Recomendado)

1. Ve a **[RealFaviconGenerator](https://realfavicongenerator.net/)** o **[Favicon.io](https://favicon.io/)**
2. Sube `asset/portada-curso.jpg`
3. Configura:
   - iOS: 180x180px
   - Android: 192x192px y 512x512px
   - Favicon clásico: 32x32px
4. Descarga el paquete generado
5. Reemplaza los archivos en `public/`:
   - `apple-touch-icon.png` (180x180)
   - `icon-192.png` (192x192)
   - Opcionalmente: `icon-512.png` (512x512)

### Opción 2: ImageMagick (CLI)

Si instalas [ImageMagick](https://imagemagick.org/), ejecuta:

```bash
# Apple Touch Icon (180x180)
magick asset/portada-curso.jpg -resize 180x180 -gravity center -extent 180x180 public/apple-touch-icon.png

# Android icon (192x192)
magick asset/portada-curso.jpg -resize 192x192 -gravity center -extent 192x192 public/icon-192.png

# Android icon (512x512)
magick asset/portada-curso.jpg -resize 512x512 -gravity center -extent 512x512 public/icon-512.png
```

### Opción 3: Node.js con sharp

```bash
npm install sharp
```

```js
const sharp = require('sharp');

sharp('asset/portada-curso.jpg')
  .resize(180, 180, { fit: 'cover' })
  .toFile('public/apple-touch-icon.png');

sharp('asset/portada-curso.jpg')
  .resize(192, 192, { fit: 'cover' })
  .toFile('public/icon-192.png');

sharp('asset/portada-curso.jpg')
  .resize(512, 512, { fit: 'cover' })
  .toFile('public/icon-512.png');
```

## Verificación en Vercel

Después del deploy, verifica:

1. **Favicon en navegador**: Debe mostrar el rayo ⚡ (desde `favicon.svg`)
2. **OG Image en redes sociales**: Usa [OpenGraph.xyz](https://www.opengraph.xyz/) para previsualizar
3. **PWA icons**: Instala la web como app y verifica el icono

## Referencias

- [Web.dev: Add a web app manifest](https://web.dev/add-manifest/)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Favicon.io](https://favicon.io/)
