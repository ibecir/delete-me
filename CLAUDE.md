# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack link management application designed for storing URLs that will be processed by a RAG system. Features email-only authentication, link CRUD operations, and status tracking (pending/processing/completed).

## Development Commands

### Backend (FastAPI)
```bash
# Setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Database setup (PostgreSQL required)
psql -U postgres -c "CREATE DATABASE link_manager;"
psql -U postgres -d link_manager -f schema.sql

# Run server
export DATABASE_URL="postgresql+asyncpg://postgres:yourpassword@localhost:5432/link_manager"
uvicorn app.main:app --reload --port 8000

# Optional: Seed database with test data
python seed.py
```

### Frontend (React + TypeScript + Vite)
```bash
# Setup and run
cd frontend
npm install
npm run dev          # Development server at localhost:5173

# Build and lint
npm run build        # TypeScript compile + production build
npm run lint         # ESLint check
```

## Architecture

### Backend Structure

**Layer Architecture:**
- `api/` - FastAPI route handlers (thin controllers)
- `services/` - Business logic layer (e.g., `LinkService`, `UserService`)
- `models/` - SQLAlchemy 2.0 async ORM models
- `schemas/` - Pydantic request/response validation
- `core/` - Database configuration and session management

**Database:**
- Async SQLAlchemy with `asyncpg` driver
- Session management via `get_db()` dependency injection
- Tables auto-created on startup via `lifespan` event in `main.py`
- Manual schema in `schema.sql` for reference/initial setup

**Authentication:**
- Email-only (no password) authentication system
- User ID passed via `X-User-ID` header after login/register
- No JWT tokens - uses localStorage on frontend to persist user

**Service Pattern:**
- Services instantiated per-request with `AsyncSession`
- All data access goes through service layer
- Services handle business logic and database queries

### Frontend Structure

**State Management:**
- Custom hooks pattern (`useAuth`, `useLinks`)
- React hooks with localStorage for persistence
- No external state management library

**API Communication:**
- Singleton `ApiService` class in `services/api.ts`
- Axios interceptors auto-inject `X-User-ID` header
- API URL hardcoded to `http://localhost:8000/api`

**Component Hierarchy:**
```
App.tsx (routing logic)
├── LoginPage (unauthenticated)
└── DashboardPage (authenticated)
    ├── StatsCard (metrics display)
    ├── AddLinkModal (create link)
    └── LinkList
        └── LinkItem (edit/delete actions)
```

**Authentication Flow:**
1. User logs in via email → API returns User object
2. `useAuth` hook stores user in localStorage
3. `ApiService.setUserId()` configures header for subsequent requests
4. App.tsx conditionally renders LoginPage vs DashboardPage

### Link Status Lifecycle

Links have three states defined in `backend/app/models/link.py`:
- `pending` - Default state when created
- `processing` - Currently being processed by RAG system
- `completed` - Processing finished

Status changes are handled via PUT `/api/links/{id}` endpoint.

## Key Implementation Details

**CORS Configuration:** Backend allows `localhost:5173`, `localhost:3000`, and `127.0.0.1:5173` origins (see `main.py:29`).

**Database Sessions:** Always use `Depends(get_db)` in route handlers to get `AsyncSession`. Sessions are automatically closed after request completion.

**User Scoping:** All link operations in `LinkService` require `user_id` parameter to ensure data isolation between users.

**Timestamps:** `updated_at` is manually set in service layer when updating links (see `link_service.py:61`).

## Environment Variables

### Backend
- `DATABASE_URL` - PostgreSQL connection string (default: `postgresql+asyncpg://postgres:postgres@localhost:5432/link_manager`)

### Frontend
- API URL configured in `src/services/api.ts` (no env var)
