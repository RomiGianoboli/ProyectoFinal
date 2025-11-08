# DerWeParent - Sistema de Coordinación Parental

## Descripción General
Sistema integral de coordinación parental para gestionar actividades, fechas de custodia y comunicación entre padres/tutores.

## Estado Actual del Proyecto (Actualizado: 08/11/2025)

✅ **BACKEND REST API MVP - 100% COMPLETADO Y OPERACIONAL**
- 67 archivos Java compilados y funcionando
- 8 Controllers REST con JWT authentication
- 9 Services con business logic completa
- 8 Repositories JPA con queries personalizadas
- 17 DTOs (Request/Response)
- Sistema de seguridad JWT implementado
- Base de datos PostgreSQL conectada y operacional
- Backend corriendo en puerto 8080

✅ **FRONTEND PWA - CONFIGURADO Y LISTO PARA DESARROLLO**
- React 18.2 + Vite configurado
- PWA con service worker y manifest
- Frontend corriendo en puerto 5000

## Estructura del Proyecto

```
DerWeParent/
├── backend/                     # Backend Spring Boot ✅ COMPLETADO
│   ├── src/main/java/com/derwe/parent/
│   │   ├── controller/         # 8 REST Controllers
│   │   │   ├── AuthController.java
│   │   │   ├── InvitacionController.java
│   │   │   ├── HijoController.java
│   │   │   ├── ActividadController.java
│   │   │   ├── FechaCustodiaController.java
│   │   │   ├── SolicitudCambioController.java
│   │   │   ├── NotificacionController.java
│   │   │   └── CalendarioController.java
│   │   ├── service/            # 9 Business Services
│   │   │   ├── AuthService.java
│   │   │   ├── PadreService.java
│   │   │   ├── InvitacionService.java
│   │   │   ├── HijoService.java
│   │   │   ├── ActividadService.java
│   │   │   ├── FechaCustodiaService.java
│   │   │   ├── SolicitudCambioService.java
│   │   │   ├── NotificacionService.java
│   │   │   └── CalendarioService.java
│   │   ├── repository/         # 8 JPA Repositories
│   │   ├── model/              # 8 Entities + 5 Enums
│   │   ├── dto/                # 7 Request + 10 Response DTOs
│   │   ├── config/             # JWT + Security Config
│   │   ├── exception/          # Custom Exceptions + Handler
│   │   └── DerWeParentApplication.java
│   └── pom.xml
├── frontend/                    # Frontend PWA ⚙️ CONFIGURADO
│   ├── src/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
├── PROYECTO.md                  # Documentación técnica
└── README.md
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

### Capa de Servicios (COMPLETADO - 08/11/2025)

**9 Servicios Business Logic:**
1. `AuthService` - Registro, login, validación JWT
2. `PadreService` - Gestión de padres/tutores
3. `InvitacionService` - Enviar/aceptar invitaciones a co-padres
4. `HijoService` - Gestión de hijos con asignación de colores (LILA/CELESTE)
5. `ActividadService` - CRUD actividades + sistema de aprobación automática
6. `FechaCustodiaService` - Establecer/consultar fechas de custodia
7. `SolicitudCambioService` - Solicitudes de cambio con aprobación/rechazo
8. `NotificacionService` - Sistema de notificaciones automáticas en tiempo real
9. `CalendarioService` - Generación de vista de calendario mensual con actividades y custodias

### Capa de Controladores REST (COMPLETADO - 08/11/2025)

**8 Controladores REST API (67 archivos Java total):**

1. **AuthController** - `/api/auth`
   - POST `/register` - Registro de nuevo padre
   - POST `/login` - Login con JWT
   - GET `/validate` - Validar token

2. **InvitacionController** - `/api/invitaciones`
   - POST `/enviar` - Enviar invitación a co-padre
   - POST `/aceptar/{token}` - Aceptar invitación
   - GET `/pendientes` - Listar invitaciones pendientes

3. **HijoController** - `/api/hijos`
   - POST `/crear` - Crear hijo y asignar color
   - POST `/vincular` - Vincular hijo a padre invitado
   - GET `/mis-hijos` - Listar hijos del padre

4. **ActividadController** - `/api/actividades`
   - POST - Crear actividad
   - PUT `/{id}` - Editar actividad (requiere aprobación del co-padre)
   - DELETE `/{id}` - Eliminar actividad
   - GET `/hijo/{hijoId}/fecha/{fecha}` - Actividades por día
   - GET `/hijo/{hijoId}/mes/{anio}/{mes}` - Actividades por mes

5. **FechaCustodiaController** - `/api/custodias`
   - POST - Establecer fecha de custodia
   - GET `/hijo/{hijoId}/mes/{anio}/{mes}` - Custodias del mes

6. **SolicitudCambioController** - `/api/solicitudes-cambio`
   - POST - Crear solicitud de cambio
   - POST `/{id}/aprobar` - Aprobar solicitud
   - POST `/{id}/rechazar` - Rechazar solicitud
   - GET `/pendientes` - Listar solicitudes pendientes

7. **NotificacionController** - `/api/notificaciones`
   - GET `/mis-notificaciones` - Listar notificaciones del padre
   - POST `/{id}/leer` - Marcar como leída
   - GET `/no-leidas/count` - Contador de no leídas

8. **CalendarioController** - `/api/calendario`
   - GET `/hijo/{hijoId}/mes/{anio}/{mes}` - Vista de calendario mensual completa

**Características implementadas:**
- ✅ Autenticación JWT en todos los endpoints protegidos
- ✅ Validación automática de permisos por padre
- ✅ Sistema de notificaciones automáticas entre co-padres
- ✅ Gestión de colores UI (LILA/CELESTE) por relación padre-hijo
- ✅ Sistema de aprobación para actividades modificadas por co-padre
- ✅ Solicitudes de cambio de custodia con aprobación/rechazo

## Resumen de Implementación Backend

### Arquitectura en Capas (Completa ✅)

```
📦 67 archivos Java compilados

📂 Model Layer (13 archivos)
   ├── 8 Entidades JPA (Padre, Hijo, RelacionPadreHijo, Invitacion, 
   │                    Actividad, FechaCustodia, SolicitudCambio, Notificacion)
   └── 5 Enums (EstadoInvitacion, EstadoCustodia, TipoNotificacion,
                EstadoActividad, EstadoSolicitud)

📂 Repository Layer (8 repositorios JPA)
   └── Queries JPQL personalizadas para operaciones complejas

📂 DTO Layer (17 archivos)
   ├── 7 Request DTOs con validaciones Jakarta
   └── 10 Response DTOs (incluyendo CalendarioResponseDTO y ApiResponseDTO)

📂 Service Layer (9 servicios)
   └── Business logic completa con validaciones y notificaciones automáticas

📂 Controller Layer (8 controladores REST)
   └── Endpoints protegidos con JWT authentication

📂 Config Layer (3 archivos)
   ├── SecurityConfig - CORS + JWT + endpoints públicos/protegidos
   ├── JwtAuthenticationFilter - Filtro de autenticación
   └── JwtTokenProvider - Generación y validación de tokens

📂 Exception Layer (5 archivos)
   ├── GlobalExceptionHandler - Manejo centralizado de errores
   └── Custom Exceptions (ResourceNotFoundException, etc.)
```

### Características Implementadas

✅ **Autenticación y Seguridad**
- JWT token-based authentication
- Endpoints públicos: /api/auth/*
- Endpoints protegidos: Todos los demás
- CORS configurado para desarrollo

✅ **Sistema de Colores UI**
- LILA/CELESTE asignados automáticamente
- Diferenciación visual entre co-padres
- Persistido en RelacionPadreHijo

✅ **Sistema de Notificaciones Automáticas**
- Notificación al co-padre en cada acción
- Tipos: ACTIVIDAD_CREADA, ACTIVIDAD_EDITADA, CUSTODIA_CAMBIADA, etc.
- Contador de no leídas
- Marca de leído individual

✅ **Sistema de Aprobación**
- Actividades editadas por co-padre quedan PENDIENTE_APROBACION
- El padre creador debe aprobar/rechazar
- Notificaciones automáticas en todo el flujo

✅ **Calendario Mensual**
- Vista consolidada mes a mes
- Integra actividades + custodias + solicitudes
- Color de custodia por día
- Indicador de cambios solicitados

## Próximos Pasos de Desarrollo

1. **Frontend React PWA**: Desarrollar componentes y pantallas de usuario
2. **Integración**: Conectar frontend con backend REST API
3. **Testing**: Pruebas de integración y end-to-end
4. **Deployment**: Preparar para producción

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
