# DerWeParent - Sistema de Coordinación Parental

## Resumen General

DerWeParent ("We Parent") es una Aplicación Web Progresiva (PWA) integral de coordinación parental diseñada para gestionar actividades, fechas de custodia y comunicación entre co-padres. La aplicación permite a los co-padres coordinar horarios, gestionar actividades de sus hijos, manejar arreglos de custodia, enviar solicitudes de cambio y recibir notificaciones.

El proyecto es una aplicación full-stack con un backend API REST en Spring Boot y un frontend PWA en React. Tanto el backend como el frontend están completamente implementados, probados y listos para producción. Este es un Trabajo Final de Grado (TFG) de Ingeniería en Software de la Universidad Siglo 21 realizado por Romina Gianoboli.

## Preferencias del Usuario

Estilo de comunicación preferido: Lenguaje simple y cotidiano.

## Arquitectura del Sistema

### Arquitectura del Frontend

**Stack Tecnológico:**
- React 18.2 con Vite 5.0.8 como herramienta de construcción
- Aplicación Web Progresiva (PWA) con service worker y manifest
- React Router 6.20 para enrutamiento del lado del cliente
- Axios 1.6.2 para peticiones HTTP con interceptores JWT
- Servidor de desarrollo corriendo en puerto 5000

**Funcionalidades Implementadas:**
- ✅ Sistema completo de autenticación (Login, Registro) con persistencia JWT
- ✅ Dashboard/Home con selector de hijos y navegación
- ✅ Vista de calendario mensual con actividades y fechas de custodia (colores LILA/CELESTE)
- ✅ CRUD completo de actividades (listar, crear, editar, eliminar)
- ✅ Gestión de custodias con navegación mensual
- ✅ Centro de notificaciones con estado leído/no leído
- ✅ Gestión de hijos (agregar hijo, invitar co-padre)
- ✅ Rutas protegidas con componente PrivateRoute
- ✅ Persistencia en LocalStorage para autenticación y selección de hijo

**Decisiones de Diseño:**
- **Implementación PWA**: Proporciona capacidades offline y experiencia similar a una aplicación nativa sin requerir distribución en tiendas de aplicaciones. El service worker cachea respuestas de la API usando estrategia NetworkFirst con expiración de 5 minutos.
- **Sistema de Construcción Vite**: Seleccionado por builds de desarrollo más rápidos y mejor rendimiento. Proporciona reemplazo de módulos en caliente y builds de producción optimizados.
- **Arquitectura de Componentes**: Componentes funcionales con React hooks para gestión de estado. AuthContext proporciona estado de autenticación centralizado.
- **Variables de Entorno**: URL de la API configurada vía VITE_API_URL para flexibilidad de entorno (localhost en desarrollo, ruta relativa en producción).
- **Persistencia en LocalStorage**: La selección de hijo persiste entre sesiones para soportar deep-linking de PWA y navegación.

**Configuración:**
- Colores del tema personalizados: Naranja/durazno (#ff9b71) primario, Beige/crema (#f5f0e8) fondo
- Branding "We Parent" en toda la aplicación
- Sistema de diseño UI basado en gradientes que coincide con mockups de Figma
- Diseño responsive con enfoque mobile-first
- Service worker configurado para cacheo de API con estrategia NetworkFirst
- Meta tags de PWA para Apple iOS para soporte de instalación

### Arquitectura del Backend

**Stack Tecnológico:**
- Java 17 con Spring Boot 3.2
- Spring Security con autenticación JWT
- JPA/Hibernate para ORM
- Base de datos PostgreSQL (H2 para desarrollo)
- Backend corriendo en puerto 8080

**Capas Arquitectónicas:**

1. **Capa de Controladores** (8 Controladores REST):
   - AuthController - Autenticación y autorización
   - InvitacionController - Gestión de invitaciones a co-padres
   - HijoController - Gestión de perfiles de hijos
   - ActividadController - Programación y seguimiento de actividades
   - FechaCustodiaController - Gestión de fechas de custodia
   - SolicitudCambioController - Flujo de solicitudes de cambio
   - NotificacionController - Entrega de notificaciones
   - CalendarioController - Agregación y vistas de calendario

2. **Capa de Servicios** (9 Servicios de Negocio):
   - Contiene lógica de negocio y orquestación entre repositorios
   - Maneja validación, controles de autorización y operaciones complejas
   - Los servicios reflejan los controladores más PadreService para gestión de padres

3. **Capa de Repositorios** (8 Repositorios JPA):
   - Métodos de consulta personalizados para recuperación compleja de datos
   - Aprovecha Spring Data JPA para operaciones CRUD

4. **Objetos de Transferencia de Datos**:
   - 7 DTOs de Request para validación de datos entrantes
   - 10 DTOs de Response para respuestas API consistentes
   - La separación asegura seguridad (no exposición de entidades) y flexibilidad de versionado de API

5. **Modelo de Dominio**:
   - 8 Entidades representando objetos de negocio principales
   - 5 Enums para seguridad de tipos y gestión de estado
   - Relaciones JPA configuradas para asociaciones padre-hijo

**Arquitectura de Seguridad:**
- Autenticación stateless basada en JWT
- Autorización basada en tokens para endpoints de API
- Cadena de filtros de Spring Security para validación de peticiones
- Control de acceso basado en roles para funcionalidades de coordinación parental

**Fundamentación del Diseño:**
- **Arquitectura en Capas**: Separación clara de responsabilidades mejora mantenibilidad y testabilidad. Cada capa tiene responsabilidad única.
- **Autenticación JWT**: Autenticación stateless elegida para soportar clientes móviles/PWA y permitir escalado horizontal sin sobrecarga de gestión de sesiones.
- **Patrón DTO**: Previene sobre-obtención, protege estructura de entidades internas y permite evolución de API sin cambios de esquema de base de datos.
- **JPA/Hibernate**: Proporciona abstracción de base de datos, reduciendo dependencia de proveedor y simplificando generación de consultas complejas.

### Almacenamiento de Datos

**Base de Datos:**
- PostgreSQL para entorno de producción
- Base de datos H2 en memoria para desarrollo/pruebas

**Diseño de Esquema:**
- Entidades: Padre, Hijo, Actividad, FechaCustodia, SolicitudCambio, Notificacion, Invitacion, RelacionPadreHijo, Calendario
- Las relaciones soportan escenarios multi-padre y arreglos de custodia compartida
- Los Enums refuerzan integridad de datos para estados y tipos

**Decisiones de Diseño:**
- **Selección de PostgreSQL**: Elegido para producción por su robusto soporte JSON (para cargas de notificación flexibles), fuerte cumplimiento ACID (crítico para coordinación de custodia) y escalabilidad probada.
- **Base de Datos de Desarrollo H2**: Permite desarrollo local rápido sin dependencias de base de datos externa y simplifica pruebas.

### Autenticación y Autorización

**Mecanismo:**
- JWT (JSON Web Tokens) para autenticación stateless
- Control de acceso basado en tokens para todos los endpoints protegidos
- Integración de Spring Security con filtros personalizados

**Flujo:**
1. El usuario se autentica vía AuthController
2. Se emite token JWT con claims del usuario
3. El cliente incluye el token en el header Authorization
4. Spring Security valida el token en cada petición
5. Se establece contexto de usuario para controles de autorización

**Fundamentación:**
- El diseño stateless soporta escenarios offline de PWA
- Los tokens pueden almacenarse en local storage del navegador
- No requiere gestión de sesión del lado del servidor
- Habilita arquitectura de microservicios en el futuro

### Diseño de API

**Convenciones RESTful:**
- Métodos HTTP estándar (GET, POST, PUT, DELETE)
- Estructura de URL basada en recursos
- Formato de request/response JSON
- Estructura de respuesta de error consistente

**Organización de Endpoints:**
- `/api/auth/*` - Operaciones de autenticación
- `/api/invitaciones/*` - Gestión de invitaciones
- `/api/hijos/*` - Perfiles de hijos
- `/api/actividades/*` - CRUD de actividades
- `/api/custodias/*` - Programación de custodias
- `/api/solicitudes-cambio/*` - Solicitudes de cambio
- `/api/notificaciones/*` - Notificaciones
- `/api/calendario/*` - Vistas de calendario

## Dependencias Externas

### Bibliotecas de Terceros

**Backend:**
- Spring Boot 3.2 - Framework de aplicación
- Spring Security - Autenticación y autorización
- Spring Data JPA - Capa de acceso a datos
- Hibernate - Implementación ORM
- Driver JDBC PostgreSQL - Conectividad de base de datos
- Bibliotecas JWT - Generación/validación de tokens

**Frontend:**
- React 18.2 - Framework de UI
- React Router DOM 6.20 - Enrutamiento del lado del cliente
- Axios 1.6.2 - Cliente HTTP
- Vite 5.0.8 - Herramienta de construcción y servidor de desarrollo
- Vite Plugin PWA 0.17.4 - Capacidades de Aplicación Web Progresiva

### Servicios Externos

**Base de Datos:**
- PostgreSQL - Base de datos principal de producción
- Detalles de conexión configurados en propiedades de aplicación Spring

**Herramientas de Desarrollo:**
- Maven - Gestión de dependencias y construcción del backend
- npm - Gestión de dependencias del frontend
- Servidor de desarrollo Vite - Recarga en caliente durante desarrollo

### Puntos de Integración de API

**Backend a Frontend:**
- API REST expuesta en puerto 8080
- Configuración CORS requerida para acceso desde puerto 5000
- Tokens JWT pasados vía headers Authorization

**Service Worker de PWA:**
- Cachea respuestas de API con estrategia NetworkFirst
- Expiración de caché de 5 minutos para llamadas de API
- Capacidad offline para datos previamente accedidos

### Construcción y Despliegue

**Backend:**
- Proceso de construcción basado en Maven
- Compilado a archivo JAR
- Corre como aplicación Spring Boot standalone

**Frontend:**
- La construcción de Vite genera assets estáticos optimizados
- Manifest de PWA y service worker generados automáticamente
- Los archivos estáticos pueden servirse desde cualquier servidor web o CDN

## Decisiones Técnicas Clave

### ¿Por qué PWA en lugar de Aplicación Nativa?

1. **Compatibilidad Multi-Plataforma**: Una única base de código funciona en iOS, Android y web
2. **Sin Barreras de Distribución**: No requiere aprobación de tiendas de aplicaciones
3. **Actualizaciones Instantáneas**: Los cambios se despliegan inmediatamente sin aprobación de tiendas
4. **Capacidades Offline**: Service workers permiten funcionalidad offline similar a aplicaciones nativas
5. **Menor Costo de Desarrollo**: Equipo de desarrollo único en lugar de equipos separados iOS/Android
6. **Instalable**: Los usuarios pueden "instalar" la PWA en sus dispositivos como aplicación nativa

### ¿Por qué Spring Boot para el Backend?

1. **Ecosistema Maduro**: Amplia comunidad, extensos recursos y soporte empresarial
2. **Seguridad Integrada**: Spring Security proporciona autenticación robusta lista para usar
3. **Productividad del Desarrollador**: Configuración automática reduce código boilerplate
4. **Escalabilidad**: Arquitectura comprobada para aplicaciones empresariales
5. **Soporte JPA**: Integración ORM simplifica acceso a base de datos y gestión
6. **Conocimiento Académico**: Alineado con plan de estudios de Ingeniería en Software de Universidad Siglo 21

## Estado del Proyecto

**Estado Actual (Noviembre 2025):**
- ✅ Backend MVP completo y operacional
- ✅ Frontend PWA completamente implementado
- ✅ Sistema de autenticación JWT funcional
- ✅ CRUD completo de actividades
- ✅ Gestión de calendario y custodias
- ✅ Sistema de notificaciones
- ✅ Invitaciones a co-padres
- ✅ Listo para despliegue de producción

**Próximos Pasos Sugeridos:**
1. Pruebas de usuario con co-padres reales
2. Mejoras de UX basadas en feedback
3. Optimización de rendimiento para conjuntos de datos grandes
4. Notificaciones push para dispositivos móviles
5. Integración con calendarios externos (Google Calendar, iCal)
6. Exportación de informes en PDF
7. Chat en tiempo real entre co-padres
