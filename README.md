# Link Manager Application

A simple, fully functional link management application with a clean, modern UI. Users can store and manage links that will later be processed by a RAG system.

## Features

- **Email-only authentication** - Simple login without passwords
- **Link management** - Full CRUD operations for links
- **Status tracking** - Pending, Processing, Completed states
- **Dashboard** - Statistics and recent activity overview
- **Modern UI** - Clean, responsive dark theme design

## Tech Stack

### Backend
- **Python 3.11+**
- **FastAPI** - Modern, fast web framework
- **SQLAlchemy 2.0** - Async ORM
- **PostgreSQL** - Production-ready database
- **Pydantic** - Data validation

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Axios** - HTTP client
- **Lucide React** - Icons

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+

### 1. Setup PostgreSQL Database

```bash
# Create database and run schema
psql -U postgres -c "CREATE DATABASE link_manager;"
psql -U postgres -d link_manager -f backend/schema.sql
```

### 2. Start the Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set database connection (adjust credentials as needed)
export DATABASE_URL="postgresql+asyncpg://postgres:yourpassword@localhost:5432/link_manager"

# Start the server
uvicorn app.main:app --reload --port 8000
```

The API will be available at http://localhost:8000
- API Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 3. Start the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at http://localhost:5173

## Demo Accounts

After running the seed script, you can use these demo accounts:
- `demo@example.com` (5 sample links)
- `test@example.com` (2 sample links)

## Environment Variables

### Backend
| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql+asyncpg://postgres:postgres@localhost:5432/link_manager` |

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email |
| POST | `/api/auth/register` | Register new user |

### Links (requires X-User-ID header)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/links` | Get all user's links |
| GET | `/api/links/{id}` | Get specific link |
| POST | `/api/links` | Create new link |
| PUT | `/api/links/{id}` | Update link |
| DELETE | `/api/links/{id}` | Delete link |

### Dashboard (requires X-User-ID header)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Get dashboard statistics |

## Project Structure

```
link-manager/
├── backend/
│   ├── app/
│   │   ├── api/           # API route handlers
│   │   ├── core/          # Database config
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   └── main.py        # App entry point
│   ├── schema.sql         # Database schema script
│   ├── .env.example       # Environment template
│   ├── requirements.txt
│   ├── seed.py            # Database seeder (optional)
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── types/         # TypeScript types
│   │   ├── App.tsx
│   │   └── App.css
│   ├── package.json
│   └── README.md
│
└── README.md
```

## Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| email | VARCHAR(255) | Unique email |
| created_at | TIMESTAMP | Account creation time |

### Links Table
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| user_id | INTEGER | Foreign key to users |
| url | TEXT | The actual URL |
| title | VARCHAR(255) | Optional title |
| status | VARCHAR(20) | pending/processing/completed |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

## Future Enhancements

- RAG API integration for knowledge base creation
- Full-text search across links
- Tags/categories for links
- JWT authentication for production
- Export/import functionality

## License

MIT
