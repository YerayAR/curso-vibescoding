-- Idempotent seed data for the products catalog.
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL
);

INSERT INTO products (id, name, brand)
VALUES
    (1, 'Starter Pack', 'VibesCo'),
    (2, 'Premium Pack', 'VibesCo Plus')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    brand = EXCLUDED.brand;
