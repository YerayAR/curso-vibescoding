// Entidad: Product
// Encapsula datos básicos de un producto disponible para alquiler.

export function createProduct({ id, name, description, dailyRate }) {
  if (!id || typeof id !== 'string') {
    throw new Error('El producto debe tener un identificador de tipo cadena.');
  }

  if (!name || typeof name !== 'string') {
    throw new Error('El producto debe tener un nombre legible.');
  }

  if (typeof dailyRate !== 'number' || dailyRate < 0) {
    throw new Error('La tarifa diaria debe ser un número mayor o igual a cero.');
  }

  return Object.freeze({
    id,
    name,
    description: description || '',
    dailyRate,
    // TODO: agregar invariantes sobre estado de disponibilidad y categorías.
  });
}
