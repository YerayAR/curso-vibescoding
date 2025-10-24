# Fake: InMemoryRentalRepository

Este doble de prueba simula un repositorio en memoria para escenarios controlados.

- Mantiene un arreglo en memoria con objetos de alquiler.
- Implementa los métodos del puerto `RentalRepository` sin persistencia real.
- Responde búsquedas filtrando por identificador o rango de fechas.
- Permite configurar alquileres iniciales para escenarios de pruebas.
- Los métodos `create` y `delete` actualizan la colección en memoria.
- `findActiveByProductAndRange` debe reproducir la lógica de detección de solapamientos simple.

TODO: definir estructura de datos exacta y registrar métricas de uso si es necesario.
