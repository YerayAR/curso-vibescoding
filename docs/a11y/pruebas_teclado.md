# Guía de pruebas de teclado

## Recorrido básico
1. Acceder con `Tab` desde la barra de direcciones.
2. Seguir el orden lógico de navegación en la landing.
3. Asegurar que no existan trampas de foco en modales o menús.
4. Validar presencia de enlace "Saltar al contenido" al inicio.
5. TODO: Documentar elementos que requieren orden específico.

## Estados y feedback
- Confirmar que cada foco tenga estado visible consistente.
- Verificar que los menús desplegables puedan abrirse con teclado.
- Revisar que componentes dinámicos disparen `aria-live` cuando cambian.
- Validar mensajes de error accesibles tras enviar formularios.
- TODO: Añadir capturas o grabaciones de flujos críticos.
