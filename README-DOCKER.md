# 🐳 DerWeParent - Guía Docker

## Requisitos

- Docker Desktop instalado ([descargar aquí](https://www.docker.com/products/docker-desktop/))
- Docker Compose (incluido en Docker Desktop)

## 🚀 Levantar el proyecto completo

### Opción 1: Comando único (recomendado)

```bash
docker-compose up --build
```

Este comando:
- Construye las imágenes de backend y frontend
- Levanta PostgreSQL
- Conecta todos los servicios
- Muestra los logs en tiempo real

### Opción 2: En segundo plano

```bash
docker-compose up -d --build
```

Para ver los logs:
```bash
docker-compose logs -f
```

---

## 🌐 Acceder a la aplicación

Una vez levantado:

- **Frontend:** [http://localhost:5000](http://localhost:5000)
- **Backend API:** [http://localhost:8080](http://localhost:8080)
- **PostgreSQL:** `localhost:5432` (acceso directo con pgAdmin)

---

## 🛠️ Comandos útiles

### Ver estado de los servicios
```bash
docker-compose ps
```

### Ver logs de un servicio específico
```bash
# Backend
docker-compose logs -f backend

# Frontend
docker-compose logs -f frontend

# PostgreSQL
docker-compose logs -f postgres
```

### Reiniciar un servicio
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Detener todos los servicios
```bash
docker-compose down
```

### Detener y eliminar volúmenes (⚠️ BORRA LA BASE DE DATOS)
```bash
docker-compose down -v
```

### Reconstruir solo un servicio
```bash
docker-compose up -d --build backend
docker-compose up -d --build frontend
```

### Entrar a la consola de un contenedor
```bash
# Backend
docker exec -it derwe-backend sh

# Frontend
docker exec -it derwe-frontend sh

# PostgreSQL
docker exec -it derwe-postgres psql -U derwe_user -d derwe_parent
```

---

## 🔧 Configuración de variables de entorno

Las variables están configuradas en `docker-compose.yml`:

### Backend
- `SPRING_DATASOURCE_URL`: Conexión a PostgreSQL
- `JWT_SECRET`: Clave secreta para tokens JWT
- `JWT_EXPIRATION`: Tiempo de expiración del token (24 horas)

### Frontend
- `VITE_API_URL`: URL del backend (http://localhost:8080/api)

### PostgreSQL
- `POSTGRES_DB`: derwe_parent
- `POSTGRES_USER`: derwe_user
- `POSTGRES_PASSWORD`: derwe_password_2024

**⚠️ IMPORTANTE:** Cambia estas credenciales para producción.

---

## 📊 Verificar que todo funciona

1. **Backend:** Visita http://localhost:8080/actuator/health
2. **Frontend:** Abre http://localhost:5000 en el navegador
3. **PostgreSQL:** Conéctate con pgAdmin usando:
   - Host: localhost
   - Puerto: 5432
   - Usuario: derwe_user
   - Password: derwe_password_2024
   - Base de datos: derwe_parent

---

## 🐛 Resolución de problemas

### El backend no se conecta a la base de datos
```bash
# Verifica que PostgreSQL esté corriendo
docker-compose ps postgres

# Revisa los logs
docker-compose logs postgres
```

### El frontend no puede comunicarse con el backend
```bash
# Verifica que el backend esté corriendo
docker-compose ps backend

# Verifica la URL del backend en docker-compose.yml
# Debe ser: VITE_API_URL: http://localhost:8080/api
```

### Puerto ya en uso
Si ves errores como "port is already allocated":
```bash
# Detén todos los servicios
docker-compose down

# Cambia los puertos en docker-compose.yml
# Por ejemplo: "5001:80" en lugar de "5000:80"
```

### Reconstruir desde cero
```bash
# Detener todo
docker-compose down -v

# Limpiar imágenes antiguas
docker system prune -a

# Reconstruir
docker-compose up --build
```

---

## 📦 Despliegue en producción

Para producción, considera:

1. **Usar variables de entorno externas:**
   ```bash
   docker-compose --env-file .env.production up -d
   ```

2. **Cambiar credenciales de base de datos**

3. **Usar HTTPS con reverse proxy (Nginx/Traefik)**

4. **Configurar límites de recursos:**
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '1'
         memory: 1G
   ```

5. **Usar Docker Swarm o Kubernetes para orquestación**

---

## 📝 Notas adicionales

- Los datos de PostgreSQL se guardan en un volumen Docker (`postgres_data`)
- Si eliminas el volumen con `docker-compose down -v`, perderás todos los datos
- Para backups de la base de datos:
  ```bash
  docker exec derwe-postgres pg_dump -U derwe_user derwe_parent > backup.sql
  ```

- Para restaurar:
  ```bash
  docker exec -i derwe-postgres psql -U derwe_user derwe_parent < backup.sql
  ```
