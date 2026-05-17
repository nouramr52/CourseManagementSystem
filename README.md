# Course Management System

A full-stack web application for managing courses, instructors, and students with secure authentication and role-based access control.

## Project Overview

The Course Management System is a modern platform for academic course administration featuring:

- **User Authentication** — JWT + Supabase OAuth with bcrypt password hashing
- **Course Management & Enrollment** — Create, manage, and enroll in courses
- **Instructor Dashboard** — Track students and manage course schedules
- **Schedule Conflict Detection** — Prevents instructor scheduling overlaps
- **Role-Based Access Control** — Student, Instructor, and Admin roles
- **File Management** — Upload and manage course materials

### Design Patterns & SOLID Principles

**Repository Pattern** (`repositories/`)
- Data access layer abstraction (courseRepos, enrollmentRepo, userRepos)
- Services never call Prisma directly — always through repositories
- Decouples business logic from database implementation

**Service Layer Pattern** (`services/`)
- Business logic isolated from HTTP and database layers
- Services contain validation, conflict detection, and authorization checks
- Controllers call services instead of directly manipulating data

**MVC Architecture**
- **Model:** Prisma schema defines data models
- **View:** JSON API responses
- **Controller:** HTTP request handlers (`controllers/`)
- **Service:** Business logic layer
- **Repository:** Data access layer

**Singleton Pattern** (`config/db.js`)
- Single PrismaClient instance shared across entire application
- Prevents connection pool exhaustion from multiple instances

**Single Responsibility Principle (SRP)**
- Controllers: HTTP parsing and response formatting only
- Services: Business logic and validation only
- Repositories: Database queries only
- Each layer has exactly one reason to change

**Dependency Inversion Principle (DIP)**
- Services depend on repositories (abstractions), not Prisma directly
- Controllers depend on services, not business logic implementation
- Easy to swap implementations without affecting calling code

**Interface Segregation Principle (ISP)**
- Repositories expose only the methods each service needs
- Controllers receive only relevant data from services
- No bloated interfaces or unnecessary data exposure

**Open/Closed Principle (OCP)**
- Authorization checks centralized in services
- New roles can be added to middleware without modifying existing logic
- Schedule conflict detection is isolated and reusable

**Code Quality**
- Helper functions (`toMinutes`, `timesOverlap`) encapsulated in services
- Middleware-based authentication and authorization
- Consistent error handling with descriptive error messages
- Clean separation of concerns across all layers

## Technologies Used

**Frontend:**
- React 18.3.1 + Vite 5.3.1
- React Router DOM 6.23.1
- Axios 1.16.0
- Supabase JS 2.49.4

**Backend:**
- Node.js + Express 5.2.1
- Prisma 6.19.3 (ORM)
- PostgreSQL (via Supabase)
- JWT authentication
- Bcrypt password hashing
- Multer 2.1.1 file uploads

## Setup Instructions

### Prerequisites
- Node.js v16+
- npm or yarn
- Git
- Supabase account

### Backend Setup

```bash
cd Backend
npm install

# Create .env file
PORT=5000
DATABASE_URL=your_supabase_database_url
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

# Setup database
npx prisma migrate dev
npx prisma db seed

# Start server
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd Frontend
npm install

# Create .env file
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Start development
npm run dev
```

Frontend runs on `http://localhost:5173`

### Available Scripts

**Backend:**
- `npm run dev` — Development server with hot reload
- `npm run start` — Production server
- `npm run seed` — Seed database

**Frontend:**
- `npm run dev` — Development server
- `npm run build` — Production build
- `npm run preview` — Preview build

## Team Members

- **Ameera ElGhamry**
- **Nour Amr**
- **Sherry Nader**
- **Youssef Diaa**
- **Abdelrahman Fouda**
