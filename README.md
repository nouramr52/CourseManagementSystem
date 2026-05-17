# Course Management System

A full-stack web application for managing courses, instructors, and students with secure authentication and role-based access control.

## Project Overview

The Course Management System is a modern platform for academic course administration featuring:

- **User Authentication** — JWT + Supabase OAuth with token expiry (7 days)
- **Course Management & Enrollment** — Create, manage, and enroll in courses
- **Instructor Dashboard** — Track students and course materials
- **Role-Based Access Control** — Student, Instructor, and Admin roles
- **File Management** — Upload course materials

**Architecture Highlights:**
- **Factory Pattern** — Centralized JWT token creation (`authFactory.js`)
- **Observer Pattern** — Event-driven side effects (`eventEmitter.js`)
- **Repository Pattern** — Data access abstraction
- **Service Layer Pattern** — Business logic separation
- **MVC + DIP** — Controllers, Services, Repositories follow SOLID principles
- **Middleware Factory** — Role-based authorization
- **DTO Validation** — Input validation at request boundary
- **Centralized Error Handling** — Consistent error responses
- **DRY Helpers** — Shared utility functions (`helpers.js`)

All patterns follow **SOLID principles** (SRP, OCP, LSP, ISP, DIP).

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
- JWT + Bcrypt authentication
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

