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

## Uso de la Aplicación

### Primera ejecución

1. **Registrar el primer usuario:**
   - Abre `http://localhost:5000` en tu navegador
   - Haz clic en "Registrarse"
   - Completa el formulario con:
     - Nombre
     - Email
     - Contraseña
     - Color de custodia (Lila o Celeste)

2. **Agregar hijos:**
   - Después de iniciar sesión, ve a "Mis Hijos"
   - Agrega la información de tus hijos

3. **Invitar co-padre:**
   - En la sección de invitaciones, envía una invitación al otro padre
   - El co-padre recibirá automáticamente acceso con color complementario

4. **Establecer custodia:**
   - Ve al calendario
   - Selecciona las fechas de custodia para cada padre
   - Los días se mostrarán con los colores asignados (lila/celeste)

### Funcionalidades principales

- **Calendario:** Visualiza y gestiona fechas de custodia
- **Actividades:** Registra actividades de los hijos con horarios
- **Notificaciones:** Recibe alertas sobre cambios y solicitudes
- **Cambios de custodia:** Solicita y aprueba cambios de fechas

---

## Scripts Disponibles

### Backend

```bash
# Compilar el proyecto
mvn clean compile

# Ejecutar tests
mvn test

# Crear JAR ejecutable
mvn package

# Ejecutar la aplicación
mvn spring-boot:run
```

### Frontend

```bash
# Modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de la compilación
npm run preview

# Linting del código
npm run lint
```

---

## Estructura del Proyecto

```
derwe-parent/
├── backend/                    # Aplicación Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/          # Código fuente Java
│   │   │   │   └── com/derwe/parent/
│   │   │   │       ├── controller/    # REST Controllers
│   │   │   │       ├── service/       # Lógica de negocio
│   │   │   │       ├── repository/    # Acceso a datos (JPA)
│   │   │   │       ├── model/         # Entidades JPA
│   │   │   │       ├── dto/           # DTOs
│   │   │   │       └── security/      # Configuración JWT
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/              # Tests unitarios
│   └── pom.xml                # Dependencias Maven
│
├── frontend/                   # Aplicación React PWA
│   ├── public/                # Archivos estáticos
│   │   ├── manifest.json      # Configuración PWA
│   │   └── sw.js             # Service Worker
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   ├── context/          # Context API (AuthContext)
│   │   ├── pages/            # Páginas/Vistas
│   │   ├── services/         # API service (Axios)
│   │   ├── App.jsx           # Componente principal
│   │   └── main.jsx          # Punto de entrada
│   ├── .env                  # Variables de entorno
│   ├── package.json          # Dependencias npm
│   └── vite.config.js        # Configuración Vite
│
└── README.md                  # Este archivo
```

---

## Despliegue en Producción

### Backend

1. **Compilar JAR:**
   ```bash
   cd backend
   mvn clean package -DskipTests
   ```

2. **Ejecutar JAR:**
   ```bash
   java -jar target/derwe-parent-0.0.1-SNAPSHOT.jar
   ```

3. **Configurar perfil de producción:**
   - Crear `application-prod.properties`
   - Configurar base de datos PostgreSQL de producción
   - Usar variables de entorno para credenciales sensibles

### Frontend

1. **Compilar para producción:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Archivos generados:**
   - Los archivos optimizados estarán en `frontend/dist/`
   - Puedes servir estos archivos con cualquier servidor web (Nginx, Apache, etc.)

3. **Configurar variables de entorno:**
   - Crear `.env.production` con la URL del backend de producción
   - Ejemplo: `VITE_API_URL=https://api.tudominio.com/api`

---

## Resolución de Problemas

### El backend no inicia

**Problema:** Error de conexión a PostgreSQL

**Solución:**
- Verifica que PostgreSQL esté corriendo: `pg_isready`
- Verifica credenciales en `application.properties`
- Confirma que la base de datos existe: `psql -U postgres -c "\l"`

**Problema:** Puerto 8080 ya en uso

**Solución:**
- Cambia el puerto en `application.properties`: `server.port=8081`

### El frontend no carga datos

**Problema:** Error de CORS

**Solución:**
- Verifica que el backend esté corriendo
- Confirma la configuración de CORS en el backend
- Verifica la URL en `.env` del frontend

**Problema:** 401 Unauthorized

**Solución:**
- Borra el token almacenado (localStorage)
- Vuelve a iniciar sesión

---

## Tecnologías Utilizadas

### Backend
- Spring Boot 3.2
- Spring Security
- Spring Data JPA
- PostgreSQL
- JWT (JSON Web Tokens)
- Maven

### Frontend
- React 18.2
- Vite 5.0.8
- React Router 6.20
- Axios 1.6.2
- PWA (Service Worker + Manifest)

---

## Licencia

Este proyecto es un Trabajo Final de Grado académico.

---

## Contacto

**Autora:** Romina Gianoboli  
**Universidad:** Universidad Siglo 21  
**Carrera:** Ingeniería en Software

---

## Agradecimientos

Este proyecto fue desarrollado como Trabajo Final de Grado para la carrera de Ingeniería en Software de la Universidad Siglo 21.
