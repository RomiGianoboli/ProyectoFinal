# DerWeParent - Sistema de Coordinación Parental

## Descripción General
Sistema integral de coordinación parental para gestionar actividades, fechas de custodia y comunicación entre padres/tutores.

## Estado Actual del Proyecto
El proyecto cuenta con la capa de modelo y persistencia completamente implementada. Backend Spring Boot funcionando con PostgreSQL y frontend PWA configurado.

## Estructura del Proyecto

```
ProyectoFinal/
├── backend/              # Backend Spring Boot (en configuración)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/derwe/parent/
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── model/
│   │   │   │   ├── dto/
│   │   │   │   ├── config/
│   │   │   │   ├── exception/
│   │   │   │   └── DerWeParentApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
├── frontend/             # Frontend PWA React + Vite (configurado)
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── context/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── database/
│   └── migrations/
└── docs/
```

## Configuración Actual

### Backend
- **Framework**: Spring Boot 3.2.0
- **Java**: 17
- **Base de Datos**: PostgreSQL (persistente)
- **Puerto**: 8080
- **Seguridad**: Spring Security + JWT (en pom.xml)

**Modelo de Dominio (13 archivos):**
- 5 Enums: EstadoInvitacion, EstadoCustodia, TipoNotificacion, EstadoActividad, EstadoSolicitud
- 8 Entidades JPA: Padre, Hijo, RelacionPadreHijo, Invitacion, Actividad, FechaCustodia, SolicitudCambio, Notificacion

**Capa de Persistencia (8 archivos):**
- PadreRepository - Gestión de padres/tutores con búsqueda por email
- HijoRepository - Gestión de hijos con búsqueda por padre (JPQL)
- RelacionPadreHijoRepository - Relaciones padre-hijo con colores UI (LILA/CELESTE)
- InvitacionRepository - Invitaciones con token único y estados
- ActividadRepository - Actividades con filtros por fecha/rango/estado
- FechaCustodiaRepository - Calendario de custodia por hijo/padre/fecha
- SolicitudCambioRepository - Solicitudes de cambio con filtros
- NotificacionRepository - Notificaciones con contador de no leídas

### Frontend (PWA)
- **Framework**: React 18.2.0 + Vite 5.0.8
- **Tipo**: Progressive Web App (PWA)
- **Puerto**: 5000 (0.0.0.0)
- **Navegación**: React Router DOM 6.20
- **HTTP**: Axios 1.6.2
- **PWA**: vite-plugin-pwa con Workbox

**Archivos creados:**
- `package.json` - Dependencias npm y scripts
- `vite.config.js` - Configuración de Vite, PWA y proxy al backend
- `index.html` - Punto de entrada HTML
- `src/main.jsx` - Entry point React
- `src/App.jsx` - Componente principal con enrutamiento
- `src/App.css` - Estilos principales
- `src/index.css` - Estilos globales

## Tecnologías Configuradas

### Backend
- Spring Boot Starter Web
- Spring Boot Starter Data JPA
- Spring Boot Starter Security
- JWT (jjwt 0.11.5)
- PostgreSQL Driver
- Lombok
- Validation

### Frontend (PWA)
- React 18.2.0
- React DOM 18.2.0
- React Router DOM 6.20
- Vite 5.0.8
- @vitejs/plugin-react 4.2.1
- vite-plugin-pwa 0.17.4
- Axios 1.6.2
- Service Worker (generado automáticamente)
- Web App Manifest (configurado)

## Componentes Completados

✅ **Modelos de Dominio**: 8 entidades JPA + 5 enums
✅ **Repositorios**: 8 interfaces JPA Repository con queries personalizadas
✅ **Base de Datos**: PostgreSQL persistente con 8 tablas y relaciones
✅ **Frontend PWA**: React + Vite configurado con service worker
✅ **Autenticación JWT**: Sistema completo production-ready
✅ **Manejo de Excepciones**: GlobalExceptionHandler con códigos HTTP apropiados
✅ **Servicios**: PadreService y AuthService implementados
✅ **Controladores**: AuthController con endpoints /register, /login y /validate

### Sistema de Autenticación (COMPLETADO - 08/11/2025)

**Servicios (2 archivos):**
- `PadreService` - Registro de padres con validación de email duplicado
- `AuthService` - Login, validación de tokens, generación JWT

**DTOs (7 archivos):**
- Request: PadreRequestDTO, LoginRequestDTO, InvitacionRequestDTO, HijoRequestDTO, ActividadRequestDTO, SolicitudCambioRequestDTO, FechaCustodiaRequestDTO
- Response: PadreResponseDTO (sin password), LoginResponseDTO (token + datos)

**Excepciones Personalizadas (4 archivos):**
- `DuplicateEmailException` → HTTP 409 CONFLICT
- `InvalidCredentialsException` → HTTP 401 UNAUTHORIZED
- `AccountDeactivatedException` → HTTP 403 FORBIDDEN
- `ResourceNotFoundException` → HTTP 404 NOT FOUND

**GlobalExceptionHandler:**
- Maneja excepciones personalizadas con códigos HTTP apropiados
- Validación de campos → HTTP 400 BAD REQUEST
- Errores genéricos → HTTP 500 (sin exponer detalles internos)

**Seguridad:**
- `JwtUtil` - Generación y validación de tokens con secret key y expiración de 24h
- `SecurityConfig` - CORS habilitado, endpoints públicos (/register, /login), filtro JWT
- `JwtAuthenticationFilter` - Validación automática de tokens en requests
- `CustomUserDetailsService` - Carga usuarios desde PadreRepository

**Endpoints REST API:**
- `POST /api/auth/register` - Registro de nuevos padres/tutores (HTTP 201)
- `POST /api/auth/login` - Login con email/password (HTTP 200)
- `GET /api/auth/validate` - Validación de token JWT (HTTP 200/401)

**Pruebas Manuales Exitosas:**
✅ Registro de usuario nuevo → HTTP 201 + JWT token
✅ Login con credenciales válidas → HTTP 200 + JWT token
✅ Validación de token válido → HTTP 200 (true)
✅ Email duplicado → HTTP 409 CONFLICT
✅ Credenciales inválidas → HTTP 401 UNAUTHORIZED
✅ Header Authorization faltante → HTTP 401 UNAUTHORIZED

## Próximos Pasos de Desarrollo

1. **Servicios Business Logic**: HijoService, ActividadService, FechaCustodiaService, etc.
2. **Controladores REST**: HijoController, ActividadController, NotificacionController, etc.
3. **Frontend**: Desarrollar componentes React y pantallas de usuario
4. **Integración**: Conectar frontend PWA con backend REST API

## Ejecución

### Backend (Puerto 8080)
```bash
cd backend
mvn spring-boot:run
```
Estado: ✅ FUNCIONANDO con PostgreSQL

### Frontend (Puerto 5000)
```bash
cd frontend
npm run dev
```
Estado: ✅ PWA configurada con hot reload

**Base de Datos:**
- PostgreSQL persistente activa
- 8 tablas con relaciones creadas
- Datos no se pierden al reiniciar

## Funcionalidades Planificadas
- Registro e invitación de co-padres
- Gestión de hijos
- Calendario de custodia
- Gestión de actividades
- Solicitudes de cambio
- Sistema de notificaciones

## Autor
**Romina Gianoboli**  
Trabajo Final de Grado - Ingeniería en Software  
Universidad Siglo 21 - 2025
