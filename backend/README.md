# Link Manager API - Backend

A FastAPI-based REST API for managing links with PostgreSQL database.

## Requirements

- Python 3.11+
- PostgreSQL 14+
- pip

## Setup

### 1. Create PostgreSQL database and schema:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE link_manager;

# Connect to the new database
\c link_manager

# Run the schema script
\i schema.sql

# Exit
\q
```

Or run it in one command:
```bash
psql -U postgres -c "CREATE DATABASE link_manager;"
psql -U postgres -d link_manager -f schema.sql
```

### 2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install dependencies:
```bash
pip install -r requirements.txt
```

### 4. Configure database connection:
```bash
# Option 1: Set environment variable
export DATABASE_URL="postgresql+asyncpg://postgres:yourpassword@localhost:5432/link_manager"

# Option 2: Create .env file (copy from .env.example)
cp .env.example .env
# Then edit .env with your credentials
```

### 5. Run the server:
```bash
uvicorn app.main:app --reload --port 8000
```

### 6. (Optional) Seed the database with sample data:
```bash
python seed.py
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql+asyncpg://postgres:postgres@localhost:5432/link_manager` |

## Database Schema

The `schema.sql` file contains all necessary DDL commands:
- Creates `users` and `links` tables
- Sets up indexes for performance
- Adds foreign key constraints
- Includes trigger for auto-updating `updated_at`

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email
- `POST /api/auth/register` - Register new user

### Links (requires X-User-ID header)
- `GET /api/links` - Get all user's links
- `GET /api/links/{id}` - Get specific link
- `POST /api/links` - Create new link
- `PUT /api/links/{id}` - Update link
- `DELETE /api/links/{id}` - Delete link

### Dashboard (requires X-User-ID header)
- `GET /api/dashboard/stats` - Get dashboard statistics

## Project Structure

```
backend/
├── app/
│   ├── api/           # API route handlers
│   │   ├── auth.py
│   │   ├── links.py
│   │   └── dashboard.py
│   ├── core/          # Core configurations
│   │   └── database.py
│   ├── models/        # SQLAlchemy models
│   │   ├── user.py
│   │   └── link.py
│   ├── schemas/       # Pydantic schemas
│   │   ├── user.py
│   │   ├── link.py
│   │   └── dashboard.py
│   ├── services/      # Business logic
│   │   ├── user_service.py
│   │   └── link_service.py
│   └── main.py        # Application entry point
├── schema.sql         # Database schema (run this first!)
├── .env.example       # Environment template
├── requirements.txt
├── seed.py            # Database seeder (optional)
└── README.md
```

## Test Users

After running the seed script:
- `demo@example.com` (5 sample links)
- `test@example.com` (2 sample links)
