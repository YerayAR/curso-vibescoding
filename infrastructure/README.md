# Despliegue local con Docker Compose

1. Asegúrate de contar con Docker y el complemento Docker Compose v2 instalados y funcionando.
2. Concede permisos de ejecución a los scripts: `chmod +x scripts/up.sh scripts/down.sh scripts/logs.sh scripts/smoke.sh scripts/status.sh`.
3. Inicia la infraestructura base con `./scripts/up.sh` (agrega `--profile admin` si necesitas pgAdmin).
4. Comprueba los servicios abiertos visitando `http://localhost:8080` (web), `http://localhost:8081/health` (API) y, si habilitaste el perfil, `http://localhost:8082` (pgAdmin).
5. Ejecuta la prueba de humo para verificar los endpoints críticos: `./scripts/smoke.sh`.
6. Supervisa el estado general cuando lo necesites mediante `./scripts/status.sh` o sigue logs puntuales con `./scripts/logs.sh [servicio]`.
7. Apaga y limpia los contenedores, redes y volúmenes creados con `./scripts/down.sh`.

## Variables de entorno destacadas

- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`: personaliza la base de datos sin modificar archivos.
- `PGADMIN_DEFAULT_EMAIL`, `PGADMIN_DEFAULT_PASSWORD`: credenciales de pgAdmin, solo necesarias al usar el perfil `admin`.

> **Nota:** la semilla SQL se aplica automáticamente la primera vez que se levanta la base de datos y es idempotente para que puedas repetir el proceso con seguridad.
