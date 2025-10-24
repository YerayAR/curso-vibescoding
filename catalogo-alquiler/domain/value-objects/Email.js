// Value Object: Email
// Propósito: encapsular y validar direcciones de correo electrónico básicas.

export function createEmail(rawEmail) {
  if (typeof rawEmail !== 'string') {
    throw new TypeError('El correo electrónico debe ser una cadena.');
  }

  const trimmed = rawEmail.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(trimmed)) {
    throw new Error('Formato de correo electrónico inválido.');
  }

  return Object.freeze({
    value: trimmed.toLowerCase(),
    toString() {
      return this.value;
    },
  });
}

// TODO: integrar reglas adicionales (dominios permitidos, listas de bloqueo, etc.).
