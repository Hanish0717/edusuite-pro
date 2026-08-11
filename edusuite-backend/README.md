# EduSuite Pro ERP Backend API & Database Service

This folder contains the decoupled backend API server and Dockerized PostgreSQL database service for the EduSuite Pro College ERP.

## Technology Stack
* **Runtime**: Node.js (with TypeScript)
* **Framework**: Express.js
* **Database**: PostgreSQL 16 (running via Docker Compose)
* **ORM**: Prisma ORM

## Project Structure
```
edusuite-backend/
  ├── prisma/
  │     └── schema.prisma        # Database schema definitions
  ├── src/
  │     ├── routes/              # Express API route modules
  │     ├── db.ts                # Prisma client initialization
  │     └── index.ts             # Express server entry point
  ├── docker-compose.yml         # Docker config for Postgres & PgAdmin
  ├── .env                       # Environment configs & Database URI
  ├── package.json               # Backend script triggers & packages
  └── tsconfig.json              # TypeScript compiler settings
```

## Running locally

### 1. Prerequisite
Install and run **Docker Desktop** on your local machine.

### 2. Boot the PostgreSQL & PgAdmin Containers
In the root directory of the backend, execute:
```bash
docker compose up -d
```
* **PostgreSQL** runs on port `5433` with connection URL: `postgresql://postgres:postgres_password@localhost:5433/edusuite_db`
* **PgAdmin** (database visual dashboard) runs on `http://localhost:5051` with login `admin@edusuite.com` / `admin_password`.

### 3. Install packages
Install npm dependencies:
```bash
npm install
```

### 4. Push Database Schema & Seed Data
Synchronize the PostgreSQL tables with our schema:
```bash
npx prisma db push
```

Populate default student accounts, semester course catalogs, and sample alerts:
```bash
curl -X POST http://localhost:5000/api/db/seed
```

### 5. Boot the API Server in Dev Mode
Launch Express with hot-reloading:
```bash
npm run dev
```
The server will run on `http://localhost:5000` with the following endpoints available:
* `/api/health` - API connectivity check
* `/api/auth/login` - User login
* `/api/auth/profile` - Authenticated profile details
* `/api/courses` - Semester course catalog and registrations
* `/api/exams` - Exam registration & hall ticket generator
* `/api/attendance` - Student attendance log calendar
* `/api/notifications` - Alert announcements
