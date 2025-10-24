// Entidad: Rental
// Representa una reserva confirmada para un producto en un rango de fechas.

import { createDateRange } from '../value-objects/DateRange.js';
import { createEmail } from '../value-objects/Email.js';

export function createRental({ id, productId, customerEmail, startDate, endDate, status }) {
  if (!id || typeof id !== 'string') {
    throw new Error('El alquiler requiere un identificador de tipo cadena.');
  }

  if (!productId || typeof productId !== 'string') {
    throw new Error('El alquiler debe referenciar un producto existente.');
  }

  const email = createEmail(customerEmail);
  const period = createDateRange(startDate, endDate);

  const allowedStatus = ['pending', 'confirmed', 'returned', 'cancelled'];
  const normalizedStatus = allowedStatus.includes(status) ? status : 'pending';

  return Object.freeze({
    id,
    productId,
    customerEmail: email,
    period,
    status: normalizedStatus,
    // TODO: incluir reglas de negocio sobre cancelaciones y extensiones.
  });
}
