# Puerto: RentalRepository

Describe los métodos que debe implementar cualquier repositorio de alquileres.

- **findById(id)**: retorna un alquiler o `null` cuando no existe.
- **findActiveByProductAndRange(productId, dateRange)**: devuelve una lista de alquileres que podrían solaparse.
- **create(rentalData)**: persiste un alquiler y retorna la instancia creada.
- **updateStatus(id, status)**: actualiza el estado de un alquiler existente.
- **delete(id)**: elimina o marca como eliminado un alquiler.
- **listByProduct(productId)**: obtiene los alquileres asociados a un producto.

> Nota: los métodos deben ser seguros frente a condiciones de carrera y validar entradas.
