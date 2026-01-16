# DerWeParent - Documentación Técnica Completa

## Información General del Proyecto

**Nombre del Proyecto:** DerWeParent ("We Parent")  
**Tipo de Aplicación:** Progressive Web Application (PWA)  
**Propósito:** Sistema de coordinación parental para gestión de actividades, calendarios de custodia y comunicación entre co-padres  
**Universidad:** Universidad Siglo 21  
**Trabajo Final de Grado:** Ingeniería en Software  
**Autora:** Romina Gianoboli

---

## Cómo Funciona DerWeParent - Explicación General

### ¿Qué es DerWeParent?

DerWeParent es una aplicación web diseñada para facilitar la coordinación entre padres separados o divorciados. Imagina dos padres que comparten la custodia de sus hijos: cada uno necesita saber cuándo le toca cuidar a los niños, qué actividades tienen programadas, y poder comunicarse sobre cambios en el calendario. Esta aplicación resuelve exactamente ese problema.

### ¿Cómo está construida?

La aplicación funciona como una **página web especial** que se puede instalar en el celular como si fuera una app nativa. Esto se llama PWA (Progressive Web Application). La ventaja es que no necesita descargarse desde una tienda de aplicaciones, simplemente se accede desde el navegador y se puede agregar a la pantalla de inicio.

El sistema tiene **tres partes principales** que trabajan juntas:

1. **Lo que ve el usuario (Frontend):** Es la interfaz visual, los botones, los calendarios, los formularios. Está hecho con React, una herramienta muy popular para crear interfaces web interactivas. Cuando el usuario toca un botón o llena un formulario, esta parte se encarga de mostrarlo bonito y enviar la información al servidor.

2. **El cerebro de la aplicación (Backend):** Es el servidor que procesa toda la lógica. Cuando un padre crea una actividad, el servidor la guarda, verifica que tenga permiso para hacerlo, y notifica al otro padre. Está hecho con Spring Boot, un framework de Java muy usado en aplicaciones empresariales.

3. **La memoria de la aplicación (Base de Datos):** Es donde se guardan todos los datos: los usuarios, los hijos, las actividades, las fechas de custodia, las notificaciones. Usa PostgreSQL, una base de datos robusta y confiable.

### El Flujo de Uso Típico

#### Paso 1: Registro e Inicio de Sesión
Un padre se registra con su email y contraseña. El sistema crea su cuenta y le da un "token" (como una llave digital) que usa para identificarse en cada acción.

#### Paso 2: Agregar Hijos
El padre registra a sus hijos en el sistema. Cada hijo tiene un nombre y una fecha de nacimiento.

#### Paso 3: Invitar al Co-Padre
El padre invita al otro padre por email. Cuando el co-padre acepta la invitación, queda vinculado al mismo hijo y pueden empezar a coordinar.

#### Paso 4: Selección de Colores
Cada padre elige un color que lo identificará en el calendario: **lila (violeta claro)** o **celeste (azul claro)**. El primero que elige se queda con su color preferido, el segundo recibe el que queda. Estos colores son permanentes y ayudan a identificar visualmente quién tiene la custodia cada día.

#### Paso 5: Establecer Fechas de Custodia
Los padres pueden solicitar fechas de custodia. Hay dos tipos de solicitudes:
- **ESTABLECER:** Para pedir fechas que todavía nadie tiene asignadas.
- **CAMBIO:** Para solicitar modificar fechas que ya están asignadas (incluso las del otro padre).

Cuando un padre hace una solicitud, el otro recibe una notificación y puede aprobarla o rechazarla.

#### Paso 6: Calendario Compartido
Ambos padres ven el mismo calendario con los días coloreados según quién tiene la custodia. También pueden agregar actividades (médico, escuela, cumpleaños) que ambos pueden ver.

#### Paso 7: Notificaciones
Cada vez que algo importante pasa (nueva actividad, solicitud de cambio, aprobación), el padre correspondiente recibe una notificación. Hay un icono de campana que muestra cuántas notificaciones sin leer tiene.

### La Comunicación Entre Partes

Cuando el usuario hace algo en la pantalla (por ejemplo, crear una actividad), sucede lo siguiente:

1. **El Frontend** recoge los datos del formulario
2. **Los envía al Backend** como un mensaje en formato JSON (un formato de texto estructurado)
3. **El Backend** recibe el mensaje, verifica que el usuario esté autorizado, procesa la lógica (crear la actividad, notificar al co-padre)
4. **Guarda los datos** en la Base de Datos
5. **Responde al Frontend** con el resultado (éxito o error)
6. **El Frontend** muestra el resultado al usuario

Todo esto sucede en fracciones de segundo, dando la sensación de que la aplicación responde instantáneamente.

### Seguridad

La aplicación usa **JWT (JSON Web Tokens)** para la seguridad. Es como un pase VIP digital: cuando el usuario inicia sesión correctamente, recibe este token. Cada vez que hace algo en la app, envía el token junto con su pedido. El servidor verifica que el token sea válido y que pertenezca a ese usuario antes de hacer cualquier cosa. Así nadie puede ver o modificar datos de otros usuarios.

### Cómo Están Conectadas las Capas

La aplicación tiene tres capas que se comunican entre sí de forma ordenada:

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│    FRONTEND     │  ────►  │    BACKEND      │  ────►  │  BASE DE DATOS  │
│     (React)     │  ◄────  │  (Spring Boot)  │  ◄────  │  (PostgreSQL)   │
└─────────────────┘         └─────────────────┘         └─────────────────┘
     Puerto 5000                Puerto 8080
```

**Conexión Frontend → Backend:**
- El frontend usa una librería llamada **Axios** para enviar peticiones HTTP al backend
- Todas las peticiones van al puerto 8080 donde escucha el servidor Spring Boot
- Los datos viajan en formato **JSON** (JavaScript Object Notation), que es texto estructurado
- Cada petición incluye el **token JWT** en el encabezado para identificar al usuario
- El archivo `api.js` centraliza todas las llamadas al backend

**Conexión Backend → Base de Datos:**
- El backend usa **Spring Data JPA** con **Hibernate** como ORM (Object-Relational Mapping)
- El ORM traduce objetos Java a tablas de base de datos automáticamente
- La conexión se hace mediante **JDBC** (Java Database Connectivity)
- Las credenciales de conexión se guardan en variables de entorno por seguridad

### Tecnologías Utilizadas y Por Qué

#### Frontend (Lo que ve el usuario)

| Tecnología | Para qué se usa |
|------------|-----------------|
| **React 18.2** | Crear la interfaz de usuario con componentes reutilizables. Cada pantalla (calendario, formularios, listas) es un componente React. |
| **React Router 6.20** | Manejar la navegación entre pantallas sin recargar la página. Permite ir de Login a Home a Calendario fluidamente. |
| **Axios 1.6.2** | Enviar y recibir datos del servidor. Es más fácil de usar que fetch nativo y permite interceptar todas las peticiones. |
| **Vite 5.0.8** | Compilar y servir la aplicación. Es mucho más rápido que alternativas como Webpack. |
| **vite-plugin-pwa** | Convertir la web en una PWA instalable con soporte offline y notificaciones. |
| **CSS puro** | Estilos visuales. Se optó por CSS puro sin frameworks para tener control total del diseño Figma. |

#### Backend (El cerebro)

| Tecnología | Para qué se usa |
|------------|-----------------|
| **Java 17** | Lenguaje de programación robusto y muy usado en aplicaciones empresariales. |
| **Spring Boot 3.2** | Framework que simplifica crear aplicaciones Java. Configura automáticamente muchas cosas. |
| **Spring Web** | Crear los endpoints REST (las URLs que reciben peticiones del frontend). |
| **Spring Security** | Manejar la autenticación y autorización. Protege los endpoints para que solo usuarios autorizados accedan. |
| **Spring Data JPA** | Simplificar el acceso a base de datos. Con solo definir interfaces, genera automáticamente las consultas SQL. |
| **JJWT 0.11.5** | Generar y validar tokens JWT para la autenticación segura. |
| **Lombok** | Reducir código repetitivo en Java (getters, setters, constructores). |
| **Maven** | Gestionar dependencias y compilar el proyecto. |

#### Base de Datos (La memoria)

| Tecnología | Para qué se usa |
|------------|-----------------|
| **PostgreSQL** | Base de datos relacional robusta y gratuita. Guarda todos los datos de forma permanente. |
| **Hibernate** | ORM que traduce objetos Java a tablas SQL. Evita escribir SQL manualmente. |

### Flujo de una Petición Completa (Ejemplo: Crear Actividad)

1. **Usuario** toca "Guardar" en el formulario de nueva actividad
2. **React** captura los datos y llama a `actividadAPI.crear(datos)`
3. **Axios** envía POST a `http://servidor:8080/api/actividades` con:
   - Body: `{ hijoId: 1, titulo: "Dentista", fecha: "2026-01-20", ... }`
   - Header: `Authorization: Bearer eyJhbGciOiJIUz...` (el token JWT)
4. **Spring Security** intercepta la petición y valida el token
5. **ActividadController** recibe la petición y llama al servicio
6. **ActividadService** aplica la lógica de negocio:
   - Verifica que el padre tenga permiso sobre ese hijo
   - Crea el objeto Actividad
   - Busca al co-padre para notificarlo
7. **ActividadRepository** guarda la actividad en PostgreSQL
8. **NotificacionService** crea una notificación para el co-padre
9. **Spring** devuelve respuesta 200 OK con los datos de la actividad creada
10. **Axios** recibe la respuesta y la pasa al componente React
11. **React** actualiza la pantalla mostrando la nueva actividad

Todo esto ocurre en menos de un segundo.

---

## Arquitectura General del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        USUARIO (Navegador)                       │
│                    PWA - Progressive Web App                     │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ HTTP/HTTPS (Puerto 5000)
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│              React 18.2 + Vite 5.0 + React Router 6             │
│                        (Puerto 5000)                             │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ REST API + JWT (Puerto 8080)
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│                 Spring Boot 3.2 + Spring Security               │
│                        (Puerto 8080)                             │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ JDBC + JPA/Hibernate
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BASE DE DATOS                               │
│                        PostgreSQL                                │
└─────────────────────────────────────────────────────────────────┘
```

---

# FRONTEND

## Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 18.2.0 | Librería de componentes UI |
| React DOM | 18.2.0 | Renderizado de componentes |
| React Router DOM | 6.20.0 | Enrutamiento y navegación |
| Axios | 1.6.2 | Cliente HTTP para API calls |
| Vite | 5.0.8 | Build tool y servidor de desarrollo |
| vite-plugin-pwa | 0.17.4 | Generación de Service Worker y manifest |
| @vitejs/plugin-react | 4.2.1 | Plugin React para Vite |

## Estructura de Carpetas del Frontend

```
frontend/
├── public/                      # Archivos estáticos públicos
│   ├── icons/                   # Iconos PWA (192x192, 512x512)
│   ├── favicon.ico              # Favicon del sitio
│   └── apple-touch-icon.png     # Icono para iOS
│
├── src/                         # Código fuente
│   ├── context/                 # Contextos de React
│   │   └── AuthContext.jsx      # Contexto de autenticación global
│   │
│   ├── pages/                   # Páginas/Vistas de la aplicación
│   │   ├── Login.jsx            # Página de inicio de sesión
│   │   ├── Registro.jsx         # Página de registro de usuarios
│   │   ├── Home.jsx             # Página principal (lista de hijos)
│   │   ├── ListaHijos.jsx       # Lista de hijos del padre
│   │   ├── AgregarHijo.jsx      # Formulario para agregar hijo
│   │   ├── HomeHijoSeleccionado.jsx  # Home después de seleccionar hijo
│   │   ├── Calendario.jsx       # Calendario mensual con custodias
│   │   ├── SeleccionDia.jsx     # Vista de actividades de un día
│   │   ├── Actividades.jsx      # Lista de actividades
│   │   ├── AgregarActividad.jsx # Formulario nueva actividad
│   │   ├── EditarActividad.jsx  # Formulario editar actividad
│   │   ├── EliminarActividad.jsx # Confirmación eliminar actividad
│   │   ├── Custodias.jsx        # Gestión de custodias
│   │   ├── EstablecerCustodia.jsx    # Establecer fechas de custodia
│   │   ├── SolicitarCambio.jsx       # Solicitar cambio de custodia
│   │   ├── AprobarRechazarCambio.jsx # Aprobar/rechazar solicitudes
│   │   ├── Notificaciones.jsx   # Lista de notificaciones
│   │   ├── Invitacion.jsx       # Aceptar invitación de co-padre
│   │   └── *.css                # Estilos CSS de cada página
│   │
│   ├── services/                # Servicios y API
│   │   └── api.js               # Configuración Axios y endpoints
│   │
│   ├── App.jsx                  # Componente raíz con rutas
│   ├── App.css                  # Estilos globales
│   ├── main.jsx                 # Punto de entrada de React
│   └── index.css                # Estilos base
│
├── index.html                   # HTML principal
├── vite.config.js               # Configuración de Vite y PWA
└── package.json                 # Dependencias y scripts
```

## Conexión Frontend - Backend

### Archivo: `src/services/api.js`

Este archivo centraliza TODA la comunicación con el backend.

#### Configuración de Axios

```javascript
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});
```

#### Interceptores

**Request Interceptor:** Agrega automáticamente el token JWT a cada petición:
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Response Interceptor:** Maneja errores 401 (no autorizado):
```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### APIs Disponibles en el Frontend

| API | Métodos | Descripción |
|-----|---------|-------------|
| `authAPI` | register, login, validate | Autenticación de usuarios |
| `hijoAPI` | crear, misHijos, vincular, seleccionarColor | Gestión de hijos |
| `actividadAPI` | crear, editar, eliminar, porFecha, porMes | Gestión de actividades |
| `custodiaAPI` | establecer, porHijo, porMes | Gestión de fechas de custodia |
| `calendarioAPI` | mesCompleto | Calendario con actividades y custodias |
| `notificacionAPI` | misNotificaciones, noLeidas, marcarLeida, etc. | Notificaciones |
| `invitacionAPI` | enviar, aceptar, enviadas, recibidas | Invitaciones a co-padres |
| `solicitudAPI` | crear, aprobar, rechazar, enviadas, recibidas, pendientes | Solicitudes de cambio |

### Detalle de Endpoints por API

#### authAPI
- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión
- `GET /auth/validate` - Validar token JWT

#### hijoAPI
- `POST /hijos` - Crear nuevo hijo
- `GET /hijos` - Obtener hijos del padre
- `POST /hijos/vincular` - Vincular padre a hijo existente
- `PUT /hijos/{id}/seleccionar-color` - Seleccionar color de custodia

#### actividadAPI
- `POST /actividades` - Crear actividad
- `PUT /actividades/{id}` - Editar actividad
- `DELETE /actividades/{id}` - Eliminar actividad
- `GET /actividades/hijo/{hijoId}/fecha/{fecha}` - Actividades por fecha
- `GET /actividades/hijo/{hijoId}/mes/{anio}/{mes}` - Actividades del mes

#### custodiaAPI
- `POST /custodias` - Establecer custodia
- `GET /custodias/hijo/{hijoId}` - Custodias por hijo
- `GET /custodias/hijo/{hijoId}/mes/{anio}/{mes}` - Custodias del mes

#### notificacionAPI
- `GET /notificaciones` - Todas las notificaciones
- `GET /notificaciones/no-leidas` - Solo no leídas
- `PUT /notificaciones/{id}/leer` - Marcar como leída
- `PUT /notificaciones/leer-todas` - Marcar todas como leídas
- `GET /notificaciones/contador` - Contador de no leídas
- `DELETE /notificaciones/{id}` - Eliminar notificación

#### solicitudAPI
- `POST /solicitudes-cambio` - Crear solicitud
- `PUT /solicitudes-cambio/{id}/aprobar` - Aprobar solicitud
- `PUT /solicitudes-cambio/{id}/rechazar` - Rechazar solicitud
- `GET /solicitudes-cambio/enviadas` - Solicitudes enviadas
- `GET /solicitudes-cambio/recibidas` - Solicitudes recibidas
- `GET /solicitudes-cambio/pendientes` - Solicitudes pendientes

---

# BACKEND

## Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Java | 17 | Lenguaje de programación |
| Spring Boot | 3.2.0 | Framework de aplicación |
| Spring Web | 3.2.0 | REST Controllers |
| Spring Data JPA | 3.2.0 | ORM y repositorios |
| Spring Security | 3.2.0 | Autenticación y autorización |
| JJWT | 0.11.5 | Generación y validación de JWT |
| PostgreSQL | - | Base de datos producción |
| H2 Database | - | Base de datos desarrollo/testing |
| Lombok | - | Reducción de código boilerplate |
| Spring Validation | 3.2.0 | Validación de DTOs |
| Maven | - | Gestión de dependencias |

## Estructura de Carpetas del Backend

```
backend/
├── src/main/java/com/derwe/parent/
│   │
│   ├── controller/              # Controladores REST (8 archivos)
│   │   ├── AuthController.java           # /api/auth/*
│   │   ├── HijoController.java           # /api/hijos/*
│   │   ├── ActividadController.java      # /api/actividades/*
│   │   ├── FechaCustodiaController.java  # /api/custodias/*
│   │   ├── CalendarioController.java     # /api/calendario/*
│   │   ├── NotificacionController.java   # /api/notificaciones/*
│   │   ├── InvitacionController.java     # /api/invitaciones/*
│   │   └── SolicitudCambioController.java # /api/solicitudes-cambio/*
│   │
│   ├── service/                 # Servicios de negocio (9 archivos)
│   │   ├── AuthService.java              # Interface autenticación
│   │   ├── PadreService.java             # Interface padres
│   │   ├── HijoService.java              # Lógica de hijos
│   │   ├── ActividadService.java         # Lógica de actividades
│   │   ├── FechaCustodiaService.java     # Lógica de custodias
│   │   ├── CalendarioService.java        # Lógica calendario
│   │   ├── NotificacionService.java      # Lógica notificaciones
│   │   ├── InvitacionService.java        # Lógica invitaciones
│   │   ├── SolicitudCambioService.java   # Lógica solicitudes
│   │   └── impl/                         # Implementaciones
│   │       ├── AuthServiceImpl.java
│   │       └── PadreServiceImpl.java
│   │
│   ├── repository/              # Repositorios JPA (8 archivos)
│   │   ├── PadreRepository.java
│   │   ├── HijoRepository.java
│   │   ├── RelacionPadreHijoRepository.java
│   │   ├── ActividadRepository.java
│   │   ├── FechaCustodiaRepository.java
│   │   ├── NotificacionRepository.java
│   │   ├── InvitacionRepository.java
│   │   └── SolicitudCambioRepository.java
│   │
│   ├── model/                   # Entidades JPA (12 archivos)
│   │   ├── Padre.java                    # Entidad usuario/padre
│   │   ├── Hijo.java                     # Entidad hijo
│   │   ├── RelacionPadreHijo.java        # Relación N:N padre-hijo
│   │   ├── Actividad.java                # Entidad actividad
│   │   ├── FechaCustodia.java            # Entidad fecha custodia
│   │   ├── Notificacion.java             # Entidad notificación
│   │   ├── Invitacion.java               # Entidad invitación
│   │   ├── SolicitudCambio.java          # Entidad solicitud
│   │   ├── EstadoActividad.java          # Enum estados actividad
│   │   ├── EstadoInvitacion.java         # Enum estados invitación
│   │   ├── EstadoCustodia.java           # Enum estados custodia
│   │   ├── EstadoSolicitud.java          # Enum estados solicitud
│   │   ├── TipoNotificacion.java         # Enum tipos notificación
│   │   └── TipoSolicitudCustodia.java    # Enum tipos solicitud
│   │
│   ├── dto/                     # Data Transfer Objects (17 archivos)
│   │   ├── request/                      # DTOs de entrada
│   │   │   ├── PadreRequestDTO.java
│   │   │   ├── LoginRequestDTO.java
│   │   │   ├── HijoRequestDTO.java
│   │   │   ├── ActividadRequestDTO.java
│   │   │   ├── FechaCustodiaRequestDTO.java
│   │   │   ├── InvitacionRequestDTO.java
│   │   │   ├── SeleccionColorRequestDTO.java
│   │   │   └── SolicitudCambioRequestDTO.java
│   │   │
│   │   └── response/                     # DTOs de salida
│   │       ├── PadreResponseDTO.java
│   │       ├── LoginResponseDTO.java
│   │       ├── HijoResponseDTO.java
│   │       ├── ActividadResponseDTO.java
│   │       ├── FechaCustodiaResponseDTO.java
│   │       ├── NotificacionResponseDTO.java
│   │       ├── InvitacionResponseDTO.java
│   │       ├── CalendarioResponseDTO.java
│   │       ├── SeleccionColorResponseDTO.java
│   │       ├── SolicitudCambioResponseDTO.java
│   │       └── ApiResponseDTO.java
│   │
│   ├── config/                  # Configuración (4 archivos)
│   │   ├── SecurityConfig.java           # Configuración Spring Security
│   │   ├── JwtAuthenticationFilter.java  # Filtro JWT
│   │   ├── JwtUtil.java                  # Utilidades JWT
│   │   └── CustomUserDetailsService.java # Carga de usuarios
│   │
│   ├── exception/               # Excepciones personalizadas (5 archivos)
│   │   ├── GlobalExceptionHandler.java   # Manejador global
│   │   ├── DuplicateEmailException.java
│   │   ├── InvalidCredentialsException.java
│   │   ├── AccountDeactivatedException.java
│   │   └── ResourceNotFoundException.java
│   │
│   └── DerWeParentApplication.java  # Clase principal Spring Boot
│
├── src/main/resources/
│   └── application.properties   # Configuración de la aplicación
│
└── pom.xml                      # Dependencias Maven
```

## Patrón de Arquitectura: MVC en Capas

```
┌──────────────────────────────────────────────────────────────┐
│                    CONTROLLER (Capa de Presentación)          │
│  Recibe peticiones HTTP, valida entrada, retorna respuestas   │
│  Archivos: *Controller.java                                   │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    SERVICE (Capa de Negocio)                  │
│  Contiene la lógica de negocio, validaciones, reglas          │
│  Archivos: *Service.java                                      │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                   REPOSITORY (Capa de Datos)                  │
│  Acceso a base de datos mediante Spring Data JPA              │
│  Archivos: *Repository.java                                   │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                   MODEL (Entidades JPA)                       │
│  Mapeo objeto-relacional con la base de datos                 │
│  Archivos: Padre.java, Hijo.java, Actividad.java, etc.        │
└──────────────────────────────────────────────────────────────┘
```

## Detalle de Controladores (APIs REST)

### AuthController.java
**Base URL:** `/api/auth`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/register` | Registra nuevo padre |
| POST | `/login` | Inicia sesión, retorna JWT |
| GET | `/validate` | Valida token JWT actual |

### HijoController.java
**Base URL:** `/api/hijos`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/` | Crea nuevo hijo |
| GET | `/` | Lista hijos del padre autenticado |
| POST | `/vincular` | Vincula padre a hijo existente |
| PUT | `/{id}/seleccionar-color` | Selecciona color de custodia (LILA/CELESTE) |

### ActividadController.java
**Base URL:** `/api/actividades`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/` | Crea nueva actividad |
| PUT | `/{id}` | Edita actividad existente |
| DELETE | `/{id}` | Elimina actividad |
| GET | `/hijo/{hijoId}/fecha/{fecha}` | Actividades de un día |
| GET | `/hijo/{hijoId}/mes/{anio}/{mes}` | Actividades del mes |

### FechaCustodiaController.java
**Base URL:** `/api/custodias`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/` | Establece fecha de custodia |
| GET | `/hijo/{hijoId}` | Todas las custodias de un hijo |
| GET | `/hijo/{hijoId}/mes/{anio}/{mes}` | Custodias del mes |

### CalendarioController.java
**Base URL:** `/api/calendario`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/hijo/{hijoId}/mes/{anio}/{mes}` | Calendario completo del mes |

### NotificacionController.java
**Base URL:** `/api/notificaciones`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Todas las notificaciones |
| GET | `/no-leidas` | Solo notificaciones no leídas |
| PUT | `/{id}/leer` | Marca como leída |
| PUT | `/leer-todas` | Marca todas como leídas |
| GET | `/contador` | Cuenta de no leídas |
| DELETE | `/{id}` | Elimina notificación |

### InvitacionController.java
**Base URL:** `/api/invitaciones`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/` | Envía invitación a co-padre |
| POST | `/{token}/aceptar` | Acepta invitación |
| GET | `/enviadas` | Invitaciones enviadas |
| GET | `/recibidas` | Invitaciones recibidas |

### SolicitudCambioController.java
**Base URL:** `/api/solicitudes-cambio`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/` | Crea solicitud de cambio/establecimiento |
| PUT | `/{id}/aprobar` | Aprueba solicitud |
| PUT | `/{id}/rechazar` | Rechaza solicitud |
| GET | `/enviadas` | Solicitudes enviadas |
| GET | `/recibidas` | Solicitudes recibidas |
| GET | `/pendientes` | Solicitudes pendientes |

## Detalle de Servicios (Lógica de Negocio)

### HijoService.java
**Métodos principales:**
- `crearHijo(HijoRequestDTO, email)` - Crea hijo y relación con padre creador
- `obtenerHijosDelPadre(email)` - Lista hijos del padre
- `vincularPadre(token, email)` - Vincula co-padre mediante token de invitación
- `seleccionarColor(hijoId, color, email)` - Asigna color al padre (inmutable)

### ActividadService.java
**Métodos principales:**
- `crearActividad(ActividadRequestDTO, email)` - Crea actividad y notifica co-padre
- `editarActividad(id, ActividadRequestDTO, email)` - Edita y notifica
- `eliminarActividad(id, email)` - Elimina y notifica
- `obtenerPorFecha(hijoId, fecha, email)` - Actividades de un día
- `obtenerPorMes(hijoId, anio, mes, email)` - Actividades del mes

### SolicitudCambioService.java
**Métodos principales:**
- `crearSolicitud(SolicitudCambioRequestDTO, email)` - Crea solicitud y notifica
- `aprobarSolicitud(id, email)` - Aprueba, crea fechas custodia, notifica
- `rechazarSolicitud(id, email)` - Rechaza y notifica
- `obtenerPendientes(email)` - Solicitudes pendientes de aprobar

### NotificacionService.java
**Métodos principales:**
- `crearNotificacion(tipo, mensaje, padreDestino, referenciaId)` - Crea notificación
- `obtenerNoLeidas(email)` - Notificaciones sin leer
- `marcarComoLeida(id, email)` - Marca una como leída
- `contadorNoLeidas(email)` - Cuenta para badge

## Conexión Backend - Base de Datos

### Configuración JPA
La conexión se configura en `application.properties`:

```properties
spring.datasource.url=${DATABASE_URL}
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### Repositorios (Spring Data JPA)
Los repositorios extienden `JpaRepository<Entity, ID>` y proveen:
- Métodos CRUD automáticos
- Queries personalizados con `@Query`
- Métodos derivados del nombre

**Ejemplo - ActividadRepository.java:**
```java
public interface ActividadRepository extends JpaRepository<Actividad, Long> {
    List<Actividad> findByHijoIdAndFecha(Long hijoId, LocalDate fecha);
    List<Actividad> findByHijoIdAndFechaBetween(Long hijoId, LocalDate inicio, LocalDate fin);
}
```

---

# BASE DE DATOS

## Diagrama Entidad-Relación

```
                    ┌──────────────┐
                    │    PADRES    │
                    ├──────────────┤
                    │ id (PK)      │
                    │ nombre       │
                    │ apellido     │
                    │ email (UK)   │
                    │ password     │
                    │ activo       │
                    │ fecha_registro│
                    └──────┬───────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
┌──────────────────┐ ┌───────────┐ ┌─────────────────┐
│RELACION_PADRE_HIJO│ │INVITACIONES│ │ NOTIFICACIONES  │
├──────────────────┤ ├───────────┤ ├─────────────────┤
│ id (PK)          │ │ id (PK)   │ │ id (PK)         │
│ padre_id (FK)    │ │ padre_emisor│ │ padre_destinatario│
│ hijo_id (FK)     │ │ email_co  │ │ tipo            │
│ es_padre_creador │ │ token     │ │ mensaje         │
│ color_asignado   │ │ estado    │ │ leida           │
│ fecha_asignacion │ │ fecha_envio│ │ referencia_id   │
└────────┬─────────┘ └───────────┘ └─────────────────┘
         │
         ▼
    ┌──────────────┐
    │    HIJOS     │
    ├──────────────┤
    │ id (PK)      │
    │ nombre       │
    │ apellido     │
    │ fecha_nacimiento│
    │ fecha_registro│
    └──────┬───────┘
           │
     ┌─────┴─────┬──────────────┐
     ▼           ▼              ▼
┌───────────┐ ┌──────────────┐ ┌─────────────────┐
│ACTIVIDADES│ │FECHAS_CUSTODIA│ │SOLICITUDES_CAMBIO│
├───────────┤ ├──────────────┤ ├─────────────────┤
│ id (PK)   │ │ id (PK)      │ │ id (PK)         │
│ hijo_id   │ │ hijo_id      │ │ hijo_id         │
│ nombre    │ │ fecha        │ │ padre_solicitante│
│ descripcion│ │ padre_resp   │ │ padre_receptor  │
│ fecha     │ │ estado       │ │ tipo_solicitud  │
│ hora_inicio│ │ tipo_custodia│ │ fecha_desde     │
│ hora_fin  │ │ created_at   │ │ fecha_hasta     │
│ estado    │ └──────────────┘ │ estado          │
│ padre_creador│               │ motivo          │
│ padre_modificador│           │ fecha_solicitud │
│ created_at │                 │ fecha_resolucion│
│ updated_at │                 └─────────────────┘
└───────────┘
```

## Detalle de Tablas

### Tabla: `padres`
Almacena los usuarios (padres) del sistema.

| Columna | Tipo | Nullable | Descripción |
|---------|------|----------|-------------|
| id | BIGINT | NO | Clave primaria autoincremental |
| nombre | VARCHAR | NO | Nombre del padre |
| apellido | VARCHAR | NO | Apellido del padre |
| email | VARCHAR | NO | Email único (para login) |
| password | VARCHAR | NO | Contraseña encriptada (BCrypt) |
| activo | BOOLEAN | NO | Estado de la cuenta |
| fecha_registro | TIMESTAMP | NO | Fecha de creación |

### Tabla: `hijos`
Almacena los hijos de los padres.

| Columna | Tipo | Nullable | Descripción |
|---------|------|----------|-------------|
| id | BIGINT | NO | Clave primaria |
| nombre | VARCHAR | NO | Nombre del hijo |
| apellido | VARCHAR | NO | Apellido del hijo |
| fecha_nacimiento | DATE | YES | Fecha de nacimiento |
| fecha_registro | TIMESTAMP | NO | Fecha de creación |

### Tabla: `relacion_padre_hijo`
Tabla intermedia N:N entre padres e hijos.

| Columna | Tipo | Nullable | Descripción |
|---------|------|----------|-------------|
| id | BIGINT | NO | Clave primaria |
| padre_id | BIGINT | NO | FK a padres |
| hijo_id | BIGINT | NO | FK a hijos |
| es_padre_creador | BOOLEAN | NO | Si creó el registro del hijo |
| color_asignado | VARCHAR | YES | LILA o CELESTE (inmutable) |
| fecha_asignacion | TIMESTAMP | NO | Fecha de vinculación |

### Tabla: `actividades`
Actividades programadas para los hijos.

| Columna | Tipo | Nullable | Descripción |
|---------|------|----------|-------------|
| id | BIGINT | NO | Clave primaria |
| hijo_id | BIGINT | NO | FK a hijos |
| nombre | VARCHAR | NO | Nombre de la actividad |
| descripcion | VARCHAR | YES | Descripción opcional |
| fecha | DATE | NO | Fecha de la actividad |
| hora_inicio | TIME | NO | Hora de inicio |
| hora_fin | TIME | NO | Hora de fin |
| estado | VARCHAR | NO | PROGRAMADA, COMPLETADA, CANCELADA |
| padre_creador_id | BIGINT | NO | Padre que creó |
| padre_modificador_id | BIGINT | YES | Último que modificó |
| created_at | TIMESTAMP | NO | Fecha creación |
| updated_at | TIMESTAMP | YES | Fecha modificación |

### Tabla: `fechas_custodia`
Fechas de custodia asignadas.

| Columna | Tipo | Nullable | Descripción |
|---------|------|----------|-------------|
| id | BIGINT | NO | Clave primaria |
| hijo_id | BIGINT | NO | FK a hijos |
| fecha | DATE | NO | Fecha de custodia |
| padre_responsable_id | BIGINT | NO | Padre con custodia ese día |
| estado | VARCHAR | NO | ESTABLECIDA, CAMBIO_SOLICITADO |
| tipo_custodia | VARCHAR | YES | REGULAR, ESPECIAL |
| created_at | TIMESTAMP | NO | Fecha creación |

### Tabla: `notificaciones`
Notificaciones entre padres.

| Columna | Tipo | Nullable | Descripción |
|---------|------|----------|-------------|
| id | BIGINT | NO | Clave primaria |
| padre_destinatario_id | BIGINT | NO | Padre que recibe |
| tipo | VARCHAR | NO | ACTIVIDAD_CREADA, SOLICITUD_CUSTODIA, etc. |
| mensaje | VARCHAR | NO | Texto de la notificación |
| referencia_id | BIGINT | NO | ID del objeto relacionado |
| leida | BOOLEAN | NO | Si fue leída |
| fecha_creacion | TIMESTAMP | NO | Fecha creación |
| fecha_lectura | TIMESTAMP | YES | Fecha de lectura |

### Tabla: `invitaciones`
Invitaciones para vincular co-padres.

| Columna | Tipo | Nullable | Descripción |
|---------|------|----------|-------------|
| id | BIGINT | NO | Clave primaria |
| padre_emisor_id | BIGINT | NO | Padre que invita |
| email_co_padre | VARCHAR | NO | Email del invitado |
| nombre_co_padre | VARCHAR | NO | Nombre del invitado |
| apellido_co_padre | VARCHAR | NO | Apellido del invitado |
| token | VARCHAR | NO | Token único para aceptar |
| estado | VARCHAR | NO | PENDIENTE, ACEPTADA, EXPIRADA |
| fecha_envio | TIMESTAMP | NO | Fecha de envío |
| fecha_expiracion | TIMESTAMP | NO | Fecha límite |
| fecha_aceptacion | TIMESTAMP | YES | Fecha de aceptación |

### Tabla: `solicitudes_cambio`
Solicitudes de custodia entre padres.

| Columna | Tipo | Nullable | Descripción |
|---------|------|----------|-------------|
| id | BIGINT | NO | Clave primaria |
| hijo_id | BIGINT | NO | FK a hijos |
| padre_solicitante_id | BIGINT | NO | Padre que solicita |
| padre_receptor_id | BIGINT | NO | Padre que debe aprobar |
| tipo_solicitud | VARCHAR | NO | ESTABLECER o CAMBIO |
| fecha_desde | DATE | NO | Inicio del rango |
| fecha_hasta | DATE | NO | Fin del rango |
| estado | VARCHAR | NO | PENDIENTE, APROBADA, RECHAZADA |
| motivo | VARCHAR | YES | Motivo de la solicitud |
| fecha_solicitud | TIMESTAMP | NO | Fecha de creación |
| fecha_resolucion | TIMESTAMP | YES | Fecha de resolución |

---

# ENUMS Y ESTADOS

## Estados de Actividad (EstadoActividad)
- `PROGRAMADA` - Actividad pendiente
- `COMPLETADA` - Actividad realizada
- `CANCELADA` - Actividad cancelada

## Estados de Invitación (EstadoInvitacion)
- `PENDIENTE` - Esperando aceptación
- `ACEPTADA` - Invitación aceptada
- `EXPIRADA` - Tiempo límite excedido

## Estados de Solicitud (EstadoSolicitud)
- `PENDIENTE` - Esperando aprobación
- `APROBADA` - Aprobada por co-padre
- `RECHAZADA` - Rechazada por co-padre

## Tipos de Solicitud (TipoSolicitudCustodia)
- `ESTABLECER` - Establecer nuevas fechas (no puede tocar fechas ya asignadas)
- `CAMBIO` - Solicitar cambio (puede proponer cualquier fecha)

## Tipos de Notificación (TipoNotificacion)
- `ACTIVIDAD_CREADA` - Nueva actividad agregada
- `ACTIVIDAD_EDITADA` - Actividad modificada
- `ACTIVIDAD_ELIMINADA` - Actividad eliminada
- `SOLICITUD_CUSTODIA` - Nueva solicitud de custodia
- `SOLICITUD_APROBADA` - Solicitud aprobada
- `SOLICITUD_RECHAZADA` - Solicitud rechazada

## Colores de Custodia
- `LILA` - Color #d8b4fe (morado claro)
- `CELESTE` - Color #7dd3fc (celeste)

**Regla de negocio:** El primer padre que selecciona color lo conserva permanentemente. El segundo padre recibe automáticamente el color opuesto.

---

# SEGURIDAD

## Autenticación JWT

### Flujo de autenticación:
1. Usuario envía email/password a `/api/auth/login`
2. Backend valida credenciales
3. Si son válidas, genera JWT con claims (email, id)
4. Frontend almacena token en localStorage
5. Cada request incluye header `Authorization: Bearer <token>`
6. Filtro `JwtAuthenticationFilter` valida token en cada petición

### Endpoints públicos (sin autenticación):
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/invitaciones/{token}/aceptar`

### Endpoints protegidos:
Todos los demás requieren JWT válido.

---

# PWA - Progressive Web App

## Características PWA implementadas:
- **Service Worker** - Cache de recursos y API calls
- **Web App Manifest** - Instalable en dispositivos
- **Offline Support** - Funcionalidad básica sin conexión
- **Push Notifications** - Preparado para implementar

## Archivos de configuración:
- `vite.config.js` - Configuración PWA con vite-plugin-pwa
- `public/manifest.json` - Manifest de la aplicación
- `public/icons/` - Iconos para home screen

---

# COMANDOS ÚTILES

## Frontend
```bash
cd frontend
npm install          # Instalar dependencias
npm run dev          # Iniciar servidor desarrollo (puerto 5000)
npm run build        # Compilar para producción
```

## Backend
```bash
cd backend
mvn spring-boot:run  # Iniciar servidor (puerto 8080)
mvn clean install    # Compilar proyecto
mvn test             # Ejecutar tests
```

---

# RESUMEN DE ARCHIVOS

| Tipo | Cantidad | Ubicación |
|------|----------|-----------|
| Controladores | 8 | backend/src/.../controller/ |
| Servicios | 9 | backend/src/.../service/ |
| Repositorios | 8 | backend/src/.../repository/ |
| Modelos/Entidades | 12 | backend/src/.../model/ |
| DTOs | 17 | backend/src/.../dto/ |
| Configuración | 4 | backend/src/.../config/ |
| Excepciones | 5 | backend/src/.../exception/ |
| Páginas React | 22 | frontend/src/pages/ |
| Servicios API | 1 | frontend/src/services/ |
| Contextos | 1 | frontend/src/context/ |

**Total archivos Java:** 70
**Total archivos React:** 22

---

*Documentación generada: Enero 2026*
*Versión del sistema: 1.0.0*
