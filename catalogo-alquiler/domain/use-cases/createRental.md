# Caso de uso: Crear alquiler

## Historia
Como gestor de catálogo quiero crear un alquiler para un producto disponible evitando solapamientos.

## Escenario principal (Given-When-Then)
- **Given** que el producto existe y tiene disponibilidad en el rango solicitado.
- **And** que el cliente tiene un correo electrónico válido registrado.
- **When** se recibe una solicitud de creación de alquiler con fechas específicas.
- **Then** se registra el alquiler y se marca el producto como reservado en ese rango.
- **And** se notifica al cliente con los detalles del alquiler.

## Escenario alternativo: solapamiento
- **Given** que ya existe un alquiler activo para el mismo producto en el rango solicitado.
- **When** se intenta crear un nuevo alquiler.
- **Then** el sistema rechaza la solicitud con un error de conflicto (409).
- **And** se registra un evento para seguimiento operativo.

TODO: implementar orquestación de validaciones y persistencia.
