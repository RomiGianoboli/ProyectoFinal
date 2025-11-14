# WeParent - Sistema de Coordinación Parental


WeParent es una app diseñada para facilitar la coordinación entre co-padres en el cuidado de sus hijos. La aplicación permite gestionar calendarios de custodia, actividades compartidas, y mantener una comunicación organizada.

**Trabajo Final de Grado (TFG)** - Ingeniería en Software  
**Universidad:** Universidad Siglo 21  
**Autora:** Romina Gianoboli

---

## Características Principales

- Gestión de calendarios de custodia con codificación visual por colores
- Registro y seguimiento de actividades de los hijos
- Sistema de notificaciones entre co-padres
- Solicitud y aprobación de cambios en fechas de custodia
- Soporte para múltiples hijos
- Progressive Web App (instalable en dispositivos móviles)
- Diseño optimizado para iPhone 11 y superiores

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
- **PWA:** Service Worker + Manifest
- **Puerto:** 5000

---

## Requisitos Previos

Antes de instalar DerWeParent, asegúrate de tener instalado el siguiente software:

### Backend
- ☕ **Java Development Kit (JDK) 17 o superior**
  - [Descargar OpenJDK](https://adoptium.net/)
  - Verificar instalación: `java -version`

- 📦 **Apache Maven 3.8 o superior**
  - [Descargar Maven](https://maven.apache.org/download.cgi)
  - Verificar instalación: `mvn -version`

- 🐘 **PostgreSQL 14 o superior**
  - [Descargar PostgreSQL](https://www.postgresql.org/download/)
  - Verificar instalación: `psql --version`

### Frontend
- 🟢 **Node.js 18.x o superior** (incluye npm)
  - [Descargar Node.js](https://nodejs.org/)
  - Verificar instalación: `node -v` y `npm -v`

### Herramientas adicionales
- 🔧 **Git**
  - [Descargar Git](https://git-scm.com/downloads)
  - Verificar instalación: `git --version`

- 💻 **IDE recomendado:**
  - IntelliJ IDEA o VS Code (backend)
  - VS Code (frontend)

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/derwe-parent.git
cd derwe-parent
```

### 2. Configuración de la Base de Datos

#### 2.1. Crear la base de datos PostgreSQL

Abre una terminal de PostgreSQL:

```bash
psql -U postgres
```

Ejecuta los siguientes comandos SQL:

```sql
CREATE DATABASE derwe_parent;
CREATE USER derwe_user WITH PASSWORD 'tu_password_segura';
GRANT ALL PRIVILEGES ON DATABASE derwe_parent TO derwe_user;
\q
```

#### 2.2. Configurar conexión del backend

Edita el archivo `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/derwe_parent
spring.datasource.username=derwe_user
spring.datasource.password=tu_password_segura

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

jwt.secret=TU_CLAVE_SECRETA_JWT_MUY_LARGA_Y_SEGURA_DE_AL_MENOS_256_BITS
jwt.expiration=86400000
```

> **Nota de seguridad:** Cambia `jwt.secret` por una clave única y segura de al menos 256 bits.

### 3. Instalación del Backend

#### 3.1. Navegar a la carpeta del backend

```bash
cd backend
```

#### 3.2. Instalar dependencias y compilar

```bash
mvn clean install
```

Este comando:
- Descargará todas las dependencias de Maven
- Compilará el código Java
- Ejecutará los tests (si existen)
- Generará el archivo JAR ejecutable

#### 3.3. Ejecutar el backend

```bash
mvn spring-boot:run
```

El backend estará disponible en: `http://localhost:8080`

**Verificación:** Abre tu navegador y visita `http://localhost:8080` para confirmar que el servidor está activo.

### 4. Instalación del Frontend

#### 4.1. Abrir una nueva terminal y navegar al frontend

```bash
cd frontend
```

#### 4.2. Instalar dependencias

```bash
npm install
```

Este comando descargará todas las dependencias de Node.js especificadas en `package.json`.

#### 4.3. Configurar variables de entorno

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

Edita el archivo `.env` y configura la URL del backend:

```env
VITE_API_URL=http://localhost:8080/api
```

#### 4.4. Ejecutar el frontend en modo desarrollo

```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:5000`

**Verificación:** Abre tu navegador en `http://localhost:5000` y deberías ver la pantalla de login de DerWeParent.

---




