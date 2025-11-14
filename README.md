# WeParent - Sistema de Coordinación Parental

WeParent es una aplicación de coordinación parental, diseñada para gestionar actividades, calendarios de custodia y comunicación entre co-padres.

**Trabajo Final de Grado (TFG)** - Ingeniería en Software  
**Universidad:** Universidad Siglo 21  
**Autora:** Romina Gianoboli

---

## Arquitectura Técnica

### Backend
- **Framework:** Spring Boot 3.2
- **Lenguaje:** Java 17
- **Seguridad:** JWT (JSON Web Tokens)
- **Base de datos:** PostgreSQL
- **ORM:** Spring Data JPA
- **Puerto:** 8080

### Frontend
- **Framework:** React 18.2
- **Build Tool:** Vite 5.0.8
- **Routing:** React Router 6.20
- **HTTP Client:** Axios 1.6.2
- **Puerto:** 5000

---

## Instalación con Docker (Recomendado)

### Requisitos Previos

Solamente necesitás tener instalado:

- **Docker** (versión 20.10 o superior)
  - [Descargar Docker Desktop](https://www.docker.com/products/docker-desktop/)
  - Verificar instalación: `docker --version`

-  **Docker Compose** (generalmente incluido con Docker Desktop)
  - Verificar instalación: `docker-compose --version`

### Pasos de Instalación

#### 1. Clonar el repositorio

bash
git clone https://github.com/TU_USUARIO/derwe-parent.git
cd derwe-parent

#### 2. Levantar los contenedores
docker-compose up -d

#### 3. Verificar que todo está funcionando
docker-compose ps

Deberías ver 3 contenedores corriendo:

derwe-parent-db-1 (PostgreSQL)
derwe-parent-backend-1 (Spring Boot)
derwe-parent-frontend-1 (React + Vite)

#### 4. Acceder a la aplicación

Abrí tu navegador en:

Frontend (aplicación principal): http://localhost:5000
Backend API: http://localhost:8080/api
Base de datos PostgreSQL: localhost:5432
