# WeParent - Sistema de Coordinación Parental

## Descripción
Sistema integral de coordinación parental para gestionar actividades, fechas de custodia y comunicación entre co-padres.

Aplicación web progresiva (PWA) desarrollada como Trabajo Final de Grado de Ingeniería en Software.

## Estructura del Proyecto
```
ProyectoFinal/
├── backend/          # API REST Spring Boot (Java 17)
├── frontend/         # Aplicación Web Progresiva React (PWA)
└── ARQUITECTURA.md   # Documentación técnica completa
```

## Tecnologías

### Backend
- Java 17
- Spring Boot 3.2
- Spring Security con JWT
- Spring Data JPA
- PostgreSQL (producción) / H2 (desarrollo)

### Frontend
- React 18.2
- Vite 5.0.8
- React Router 6.20
- Axios 1.6.2
- PWA con Service Worker

## Configuración y Ejecución

### Backend
```bash
cd backend
mvn spring-boot:run
```

El servidor correrá en `http://localhost:8080`

### Frontend

1. Copiar el archivo de configuración de ejemplo:
```bash
cd frontend
cp .env.example .env
```

2. Instalar dependencias y ejecutar:
```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5000`

## Variables de Entorno

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8080/api
```

Para producción, usar `.env.production` con:
```env
VITE_API_URL=/api
```

## Funcionalidades Principales

- ✅ Registro e inicio de sesión con JWT
- ✅ Invitación y vinculación de co-padres
- ✅ Gestión completa de hijos (múltiples hijos por padre)
- ✅ Calendario mensual de actividades y custodias
- ✅ CRUD de actividades (crear, editar, eliminar)
- ✅ Gestión de fechas de custodia
- ✅ Sistema de notificaciones con contador
- ✅ Solicitudes de cambio con aprobación/rechazo
- ✅ Interfaz responsive mobile-first
- ✅ PWA instalable en dispositivos móviles

## Despliegue

### Compilar Frontend para Producción
```bash
cd frontend
npm run build
```

Los archivos compilados estarán en `frontend/dist/`

### Notas de Despliegue
- Configurar `VITE_API_URL` según el dominio del backend
- El backend debe estar en el mismo dominio o configurar CORS
- PostgreSQL requerido para producción

## Autor

**Romina Gianoboli**  
Trabajo Final de Grado - Ingeniería en Software  
Universidad Siglo 21 - 2025

## Licencia

Proyecto académico - Todos los derechos reservados
