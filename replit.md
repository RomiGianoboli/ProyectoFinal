# DerWeParent - Parental Coordination System

## Overview

DerWeParent ("We Parent") is a comprehensive Progressive Web Application (PWA) for parental coordination designed to manage activities, custody schedules, and communication between co-parents. The application is a full-stack solution with a Spring Boot REST API backend and a React PWA frontend. The backend is fully implemented and operational (67 Java files compiled), while the frontend is configured and ready for development.

The system helps divorced or separated parents coordinate childcare responsibilities, track activities, manage custody schedules, and maintain organized communication about their children.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture: Layered MVC Pattern for REST APIs

**Technology Stack:**
- Java 17
- Spring Boot 3.2
- Spring Security with JWT authentication
- Spring Data JPA for data persistence
- PostgreSQL (production) / H2 (development)
- Running on port 8080

**Architecture Pattern:**
The backend implements a layered architecture based on the Model-View-Controller (MVC) pattern, adapted for modern REST services:

- **Model Layer**: 8 JPA entities + 17 DTOs representing business domain
- **View Layer**: Response DTOs serialized to JSON (no traditional HTML views in REST)
- **Controller Layer**: 8 REST Controllers handling HTTP requests
- **Service Layer**: 9 services containing business logic, separated from controllers
- **Repository Layer**: 8 JPA repositories following the DAO (Data Access Object) pattern with custom queries

**Architectural Benefits:**
- Separation of concerns across distinct layers
- Independent testability of each layer
- Maintainable and scalable codebase
- Business logic reusability

**Security:**
- JWT (JSON Web Token) based authentication
- Token stored in localStorage on client side
- Bearer token sent in Authorization header
- 401 responses trigger automatic logout and redirect to login

### Frontend Architecture: Component-Based React Application

**Technology Stack:**
- React 18.2 with functional components
- Vite 5.0.8 as build tool and development server
- React Router 6.20 for client-side routing
- Axios 1.6.2 for HTTP requests with JWT interceptors
- PWA capabilities with service worker and manifest
- Running on port 5000 (development server on 0.0.0.0 for network access)

**Architecture Pattern:**
- **Component-Based Architecture**: Reusable, modular React components
- **Context API**: Global state management (AuthContext for authentication)
- **API Service Layer**: Centralized HTTP communication with backend (api.js)
- **Client-Side Routing**: React Router for SPA navigation
- **PWA Features**: Service worker for offline capability, manifest for installability

**Key Pages:**
- Login/Registration (Form.jsx, Login.jsx)
- Home dashboard (Home.jsx)
- Activities management (Actividades.jsx)
- Custody schedule (Custodias.jsx, Calendario.jsx)
- Notifications (Notificaciones.jsx)

**Styling Approach:**
- Component-scoped CSS files
- Consistent design system with CSS variables
- Mobile-first responsive design
- Gradient backgrounds and modern UI patterns

### Communication Pattern

**REST API Architecture:**
- Backend exposes RESTful endpoints
- Frontend consumes endpoints via Axios service layer
- Request/Response cycle uses JSON serialization
- JWT tokens authenticate each request via interceptor

**API Structure:**
- `/auth/*` - Authentication endpoints (register, login, validate)
- `/hijos/*` - Children management endpoints
- `/actividades/*` - Activities endpoints
- Additional endpoints for custody, notifications, etc.

### Data Flow

1. User interacts with React components
2. Components call API service functions (api.js)
3. Axios interceptor adds JWT token to request headers
4. Backend REST controller receives request
5. Controller delegates to Service layer
6. Service executes business logic and calls Repository
7. Repository performs database operations via JPA
8. Response flows back through layers as DTOs
9. Frontend receives JSON response and updates UI

### PWA Capabilities

**Manifest Configuration:**
- App name: "We Parent - Coordinación Parental"
- Theme color: #ff9b71
- Background color: #f5f0e8
- Display mode: standalone (appears as native app)
- Orientation: portrait
- Icons: 192x192 and 512x512 (maskable)

**Service Worker:**
- Auto-update registration type
- Runtime caching for API calls with NetworkFirst strategy
- Cache expiration: max 50 entries, 300 seconds max age
- Offline functionality for previously visited pages

## External Dependencies

### Backend Dependencies

**Core Framework:**
- Spring Boot 3.2 - Application framework
- Spring Web - REST API development
- Spring Data JPA - Database abstraction and ORM
- Spring Security - Authentication and authorization

**Database:**
- PostgreSQL - Production relational database
- H2 Database - Development/testing in-memory database

**Security:**
- JWT (JSON Web Tokens) - Stateless authentication mechanism
- BCrypt - Password hashing (likely via Spring Security)

**Build Tool:**
- Maven - Dependency management and build automation

### Frontend Dependencies

**Core Libraries:**
- React 18.2.0 - UI library
- React DOM 18.2.0 - DOM rendering
- React Router DOM 6.20.0 - Client-side routing

**HTTP Client:**
- Axios 1.6.2 - Promise-based HTTP client with interceptor support

**Build Tools:**
- Vite 5.0.8 - Fast build tool and dev server
- @vitejs/plugin-react 4.2.1 - React integration for Vite
- vite-plugin-pwa 0.17.4 - PWA manifest and service worker generation

**Environment Configuration:**
- `.env` file for environment variables (example: `.env.example`)
- `VITE_API_URL` - Backend API base URL configuration

### Development Infrastructure

**Frontend Development Server:**
- Vite dev server on port 5000
- Configured to listen on 0.0.0.0 (network accessible)
- Hot module replacement for rapid development

**Backend Server:**
- Spring Boot embedded Tomcat on port 8080
- Development and production profiles available

### Database Schema

**Entities (8 total):**
The system manages entities for users, children (hijos), activities (actividades), custody schedules (custodias), and notifications. Specific entity details would be found in the backend JPA entity classes.

**DTOs (17 total):**
Separate Request and Response DTOs ensure clean API contracts and prevent over/under-fetching of data.