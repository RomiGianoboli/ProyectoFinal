# DerWeParent - Sistema de Coordinación Parental

## Descripción General
Sistema integral de coordinación parental para gestionar actividades, fechas de custodia y comunicación entre padres/tutores.

## Estado Actual del Proyecto
El proyecto se encuentra en fase de configuración inicial con la estructura base creada para desarrollo fullstack.

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
- **Base de Datos**: H2 (desarrollo configurado)
- **Puerto**: 8080
- **Seguridad**: Spring Security + JWT (configurado en pom.xml)

**Archivos creados:**
- `pom.xml` - Dependencias Maven configuradas
- `application.properties` - Configuración de BD y JWT
- `DerWeParentApplication.java` - Clase principal Spring Boot

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
- H2 Database
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

## Próximos Pasos de Desarrollo

1. **Modelos de Dominio**: Crear entidades JPA (Usuario, Hijo, Actividad, Custodia)
2. **Repositorios**: Implementar interfaces JPA Repository
3. **Servicios**: Desarrollar lógica de negocio
4. **Controladores**: Crear endpoints REST API
5. **Seguridad**: Implementar autenticación JWT
6. **Frontend**: Desarrollar pantallas y componentes
7. **Integración**: Conectar frontend con backend

## Ejecución (cuando esté implementado)

### Backend
```bash
cd backend
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

La aplicación PWA se ejecutará en http://localhost:5000 con hot reload.

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
