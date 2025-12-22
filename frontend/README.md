# Link Manager - Frontend

A modern React frontend for the Link Manager application.

## Requirements

- Node.js 18+
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at http://localhost:5173

## Configuration

The API URL is configured in `src/services/api.ts`. By default, it points to `http://localhost:8000/api`.

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── AddLinkModal.tsx
│   │   ├── LinkItem.tsx
│   │   ├── LinkList.tsx
│   │   └── StatsCard.tsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.ts
│   │   └── useLinks.ts
│   ├── pages/            # Page components
│   │   ├── LoginPage.tsx
│   │   └── DashboardPage.tsx
│   ├── services/         # API service layer
│   │   └── api.ts
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx           # Main app component
│   ├── App.css           # Main styles
│   └── main.tsx          # Entry point
├── package.json
└── README.md
```

## Features

- Email-only authentication
- Dashboard with statistics
- CRUD operations for links
- Status indicators (pending/processing/completed)
- Modern, responsive design
- Dark theme

## Tech Stack

- React 18
- TypeScript
- Vite
- Axios
- Lucide React (icons)
