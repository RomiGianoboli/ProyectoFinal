# DerWeParent - Sistema de Coordinación Parental

## Overview

DerWeParent ("We Parent") is a comprehensive parental coordination Progressive Web App (PWA) designed to manage activities, custody dates, and communication between co-parents. The application enables co-parents to coordinate schedules, manage child activities, handle custody arrangements, submit change requests, and receive notifications.

The project is a full-stack application with a Spring Boot REST API backend and React PWA frontend. Both backend and frontend are fully implemented, tested, and production-ready. This is a final degree project (TFG) for Software Engineering at Universidad Siglo 21 by Romina Gianoboli.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18.2 with Vite 5.0.8 as the build tool
- Progressive Web App (PWA) with service worker and manifest
- React Router 6.20 for client-side routing
- Axios 1.6.2 for HTTP requests with JWT interceptors
- Development server runs on port 5000

**Implemented Features:**
- ✅ Complete authentication system (Login, Registro) with JWT persistence
- ✅ Dashboard/Home with child selector and navigation
- ✅ Monthly calendar view with activities and custody dates (LILA/CELESTE colors)
- ✅ Full activity CRUD (list, create, edit, delete)
- ✅ Custody management with monthly navigation
- ✅ Notification center with read/unread status
- ✅ Child management (add child, invite co-parent)
- ✅ Protected routes with PrivateRoute component
- ✅ LocalStorage persistence for authentication and child selection

**Design Decisions:**
- **PWA Implementation**: Provides offline capabilities and app-like experience on mobile devices without requiring app store distribution. The service worker caches API responses using a NetworkFirst strategy with 5-minute expiration.
- **Vite Build System**: Selected for faster development builds and better performance. Provides hot module replacement and optimized production builds.
- **Component Architecture**: Functional components with React hooks for state management. AuthContext provides centralized authentication state.
- **Environment Variables**: API URL configured via VITE_API_URL for environment flexibility (localhost in dev, relative path in production).
- **LocalStorage Persistence**: Child selection persists across sessions to support PWA deep-linking and navigation.

**Configuration:**
- Custom theme colors: Orange/peach (#ff9b71) primary, Beige/cream (#f5f0e8) background
- "We Parent" branding throughout the application
- Gradient-based UI design system matching Figma mockups
- Responsive design targeting mobile-first approach
- Service worker configured for API caching with NetworkFirst strategy
- Apple PWA meta tags for iOS installation support

### Backend Architecture

**Technology Stack:**
- Java 17 with Spring Boot 3.2
- Spring Security with JWT authentication
- JPA/Hibernate for ORM
- PostgreSQL database (H2 for development)
- Backend runs on port 8080

**Architectural Layers:**

1. **Controller Layer** (8 REST Controllers):
   - AuthController - Authentication and authorization
   - InvitacionController - Co-parent invitation management
   - HijoController - Child profile management
   - ActividadController - Activity scheduling and tracking
   - FechaCustodiaController - Custody date management
   - SolicitudCambioController - Change request workflow
   - NotificacionController - Notification delivery
   - CalendarioController - Calendar aggregation and views

2. **Service Layer** (9 Business Services):
   - Contains business logic and orchestration between repositories
   - Handles validation, authorization checks, and complex operations
   - Services mirror controllers plus PadreService for parent management

3. **Repository Layer** (8 JPA Repositories):
   - Custom query methods for complex data retrieval
   - Leverages Spring Data JPA for CRUD operations

4. **Data Transfer Objects**:
   - 7 Request DTOs for incoming data validation
   - 10 Response DTOs for consistent API responses
   - Separation ensures security (no entity exposure) and API versioning flexibility

5. **Domain Model**:
   - 8 Entities representing core business objects
   - 5 Enums for type safety and state management
   - JPA relationships configured for parent-child associations

**Security Architecture:**
- JWT-based stateless authentication
- Token-based authorization for API endpoints
- Spring Security filter chain for request validation
- Role-based access control for parental coordination features

**Design Rationale:**
- **Layered Architecture**: Clear separation of concerns improves maintainability and testability. Each layer has single responsibility.
- **JWT Authentication**: Stateless authentication chosen to support mobile/PWA clients and enable horizontal scaling without session management overhead.
- **DTO Pattern**: Prevents over-fetching, protects internal entity structure, and allows API evolution without database schema changes.
- **JPA/Hibernate**: Provides database abstraction, reducing vendor lock-in and simplifying complex query generation.

### Data Storage

**Database:**
- PostgreSQL for production environment
- H2 in-memory database for development/testing

**Schema Design:**
- Entities: Padre (Parent), Hijo (Child), Actividad (Activity), FechaCustodia (Custody Date), SolicitudCambio (Change Request), Notificacion (Notification), Invitacion (Invitation), Calendario (Calendar)
- Relationships support multi-parent scenarios and shared custody arrangements
- Enums enforce data integrity for states and types

**Design Decisions:**
- **PostgreSQL Selection**: Chosen for production due to robust JSON support (for flexible notification payloads), strong ACID compliance (critical for custody coordination), and proven scalability.
- **H2 Development Database**: Enables rapid local development without external database dependencies and simplifies testing.

### Authentication & Authorization

**Mechanism:**
- JWT (JSON Web Tokens) for stateless authentication
- Token-based access control for all protected endpoints
- Spring Security integration with custom filters

**Flow:**
1. User authenticates via AuthController
2. JWT token issued with user claims
3. Client includes token in Authorization header
4. Spring Security validates token on each request
5. User context established for authorization checks

**Rationale:**
- Stateless design supports PWA offline scenarios
- Tokens can be stored in browser local storage
- No server-side session management required
- Enables microservices architecture in future

### API Design

**RESTful Conventions:**
- Standard HTTP methods (GET, POST, PUT, DELETE)
- Resource-based URL structure
- JSON request/response format
- Consistent error response structure

**Endpoint Organization:**
- `/api/auth/*` - Authentication operations
- `/api/invitaciones/*` - Invitation management
- `/api/hijos/*` - Child profiles
- `/api/actividades/*` - Activity CRUD
- `/api/fechas-custodia/*` - Custody scheduling
- `/api/solicitudes-cambio/*` - Change requests
- `/api/notificaciones/*` - Notifications
- `/api/calendario/*` - Calendar views

## External Dependencies

### Third-Party Libraries

**Backend:**
- Spring Boot 3.2 - Application framework
- Spring Security - Authentication and authorization
- Spring Data JPA - Data access layer
- Hibernate - ORM implementation
- PostgreSQL JDBC Driver - Database connectivity
- JWT libraries (implied) - Token generation/validation

**Frontend:**
- React 18.2 - UI framework
- React Router DOM 6.20 - Client-side routing
- Axios 1.6.2 - HTTP client
- Vite 5.0.8 - Build tool and dev server
- Vite Plugin PWA 0.17.4 - Progressive Web App capabilities

### External Services

**Database:**
- PostgreSQL - Primary production database
- Connection details configured in Spring application properties

**Development Tools:**
- Maven - Backend dependency management and build
- npm - Frontend dependency management
- Vite dev server - Hot reload during development

### API Integration Points

**Backend to Frontend:**
- REST API exposed on port 8080
- CORS configuration required for port 5000 access
- JWT tokens passed via Authorization headers

**PWA Service Worker:**
- Caches API responses with NetworkFirst strategy
- 5-minute cache expiration for API calls
- Offline capability for previously accessed data

### Build and Deployment

**Backend:**
- Maven-based build process
- Compiled to JAR file
- Runs as standalone Spring Boot application

**Frontend:**
- Vite build generates optimized static assets
- PWA manifest and service worker generated automatically
- Static files can be served from any web server or CDN