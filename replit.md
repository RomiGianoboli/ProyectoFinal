# We Parent - Parental Coordination System

## Overview

We Parent (DerWeParent) is a comprehensive Progressive Web Application (PWA) designed for parental coordination and co-parenting management. The system enables parents to manage activities, custody dates, and communication between co-parents through an intuitive web interface.

The application is a full-stack solution with:
- **Backend**: RESTful API built with Spring Boot (Java 17)
- **Frontend**: Progressive Web Application built with React 18.2
- **Database**: PostgreSQL (production) / H2 (development)

The project is fully implemented and operational, with both frontend and backend tested and ready for deployment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18.2 with Vite 5.0.8 as build tool
- Progressive Web App (PWA) with service worker and manifest
- React Router 6.20 for client-side routing
- Axios 1.6.2 for HTTP requests with JWT interceptors
- Development server running on port 5000

**Implemented Features:**
- Complete authentication system (Login, Register) with JWT persistence
- Dashboard/Home with child selector and navigation
- Monthly calendar view with activities and custody dates (PURPLE/LIGHT BLUE color coding)
- Full CRUD for activities (list, create, edit, delete)
- Custody management with monthly navigation
- Notification center with read/unread status
- Child management (add child, invite co-parent)
- Protected routes with PrivateRoute component
- LocalStorage persistence for authentication and child selection

**Key Design Decisions:**

1. **PWA Implementation**: Provides offline capabilities and native-like app experience without requiring app store distribution. Service worker caches API responses using NetworkFirst strategy for optimal performance.

2. **Vite Build System**: Selected for faster development builds and better performance compared to traditional bundlers. Provides hot module replacement and optimized production builds.

3. **Component Architecture**: Functional components with React hooks for state management. AuthContext provides centralized authentication state across the application.

4. **Environment Variables**: API URL configured via VITE_API_URL for environment flexibility (localhost in development, relative path in production).

5. **LocalStorage Persistence**: Child selection persists between sessions to support PWA deep-linking and navigation continuity.

**Configuration:**
- Custom theme colors: Orange/Peach (#ff9b71) primary, Beige/Cream (#f5f0e8) background
- "We Parent" branding throughout application
- Gradient-based UI design system matching Figma mockups
- Responsive design with mobile-first approach
- Service worker configured for API caching with NetworkFirst strategy
- PWA meta tags for Apple iOS installation support

### Backend Architecture

**Technology Stack:**
- Java 17
- Spring Boot 3.2
- Spring Security with JWT authentication
- Spring Data JPA for data persistence
- PostgreSQL database (production) / H2 (development)
- Backend server running on port 8080

**Implementation Status:**
- 67 compiled Java files fully operational
- 8 REST Controllers with JWT authentication
- 9 Services with complete business logic
- 8 JPA Repositories with custom queries
- 17 DTOs (Request/Response objects)
- Complete JWT security system

**Core Components:**

1. **REST Controllers (8 endpoints)**:
   - AuthController: User registration and login
   - InvitacionController: Co-parent invitations
   - HijoController: Child management
   - ActividadController: Activity CRUD operations
   - FechaCustodiaController: Custody date management
   - SolicitudCambioController: Change requests
   - NotificacionController: Notification system
   - CalendarioController: Calendar aggregation

2. **Service Layer (9 services)**: 
   - Implements all business logic
   - Handles data validation and transformation
   - Manages relationships between entities

3. **Repository Layer (8 JPA repositories)**:
   - Data access abstraction
   - Custom query methods
   - Relationship management

4. **Domain Model**:
   - 8 JPA entities (Padre, Hijo, Actividad, FechaCustodia, etc.)
   - 5 enums for type safety
   - Bidirectional relationships

**Security Architecture:**
- JWT-based authentication with Bearer tokens
- Token interceptor on frontend for automatic header injection
- 401 response handling with automatic logout and redirect
- Stateless session management

## External Dependencies

### Frontend Dependencies

**Core Libraries:**
- `react` (^18.2.0): UI framework
- `react-dom` (^18.2.0): React DOM rendering
- `react-router-dom` (^6.20.0): Client-side routing
- `axios` (^1.6.2): HTTP client with interceptor support

**Build Tools:**
- `vite` (^5.0.8): Build tool and dev server
- `@vitejs/plugin-react` (^4.2.1): React support for Vite
- `vite-plugin-pwa` (^0.17.4): PWA manifest and service worker generation

### Backend Dependencies

**Spring Boot Ecosystem:**
- Spring Boot 3.2: Application framework
- Spring Security: JWT authentication and authorization
- Spring Data JPA: Data persistence layer
- Spring Web: REST API support

**Database:**
- PostgreSQL: Production database
- H2: Development/testing database

### Configuration

**Environment Variables (Frontend):**
- `VITE_API_URL`: Backend API base URL
  - Development: `http://localhost:8080` (or as configured)
  - Production: Relative path `/api`

**Ports:**
- Frontend development server: 5000
- Backend API server: 8080

**Data Storage:**
- LocalStorage: JWT token, user data, selected child ID
- Service Worker Cache: API responses (NetworkFirst strategy, 5-minute expiration)