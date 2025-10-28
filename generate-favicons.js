const fs = require('fs');
const path = require('path');

// Para este proyecto, simplemente copiaremos la imagen de portada a los archivos necesarios
// y crearemos un SVG simple para el favicon

const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#080c1a"/>
  <text x="50" y="70" font-size="60" text-anchor="middle" fill="#00d4ff">⚡</text>
</svg>`;

// Crear favicon.svg
fs.writeFileSync(path.join(__dirname, 'public', 'favicon.svg'), svgFavicon);

console.log('✅ favicon.svg generado correctamente');
console.log('⚠️  Para generar los PNG (apple-touch-icon.png, icon-192.png, og-image.png),');
console.log('    usa una herramienta online como:');
console.log('    - https://realfavicongenerator.net/');
console.log('    - https://favicon.io/');
console.log('    Sube asset/portada-curso.jpg y descarga los iconos generados.');
