// Value Object: DateRange
// Propósito: representar intervalos de fechas cerrados y válidos.

export function createDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error('Las fechas proporcionadas no son válidas.');
  }

  if (end < start) {
    throw new Error('La fecha de término debe ser posterior a la fecha de inicio.');
  }

  return Object.freeze({
    start,
    end,
    durationInDays() {
      const millisecondsPerDay = 1000 * 60 * 60 * 24;
      return Math.ceil((this.end - this.start) / millisecondsPerDay);
    },
  });
}

// TODO: validar zonas horarias y rangos máximos permitidos.
