-- Script de inicialización de base de datos
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  daily_rate NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

INSERT INTO products (id, name, description, daily_rate)
VALUES
  ('prod-001', 'Cámara DSLR', 'Cámara profesional para eventos y sesiones fotográficas.', 45.00),
  ('prod-002', 'Proyector HD', 'Proyector de alta definición ideal para presentaciones.', 35.00)
ON CONFLICT (id) DO NOTHING;
