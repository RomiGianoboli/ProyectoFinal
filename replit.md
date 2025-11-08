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

## Próximos Pasos de Desarrollo

1. **Servicios**: Desarrollar lógica de negocio
2. **Seguridad**: Implementar autenticación JWT completa
3. **Controladores**: Crear endpoints REST API
4. **Frontend**: Desarrollar componentes y pantallas
5. **Integración**: Conectar frontend con backend

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
