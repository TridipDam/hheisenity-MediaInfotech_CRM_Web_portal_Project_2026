# CRM Project 2026 - Monorepo

A full-stack CRM application with separate frontend and backend in a monorepo structure.

## Project Structure

```
crmdemo/
├── frontend/              # Next.js React frontend
├── backend/               # Express.js API backend
├── packages/
│   └── shared/            # Shared types and utilities
├── package.json           # Root workspace configuration
└── README.md
```

## Features

### Frontend (Next.js)
- **QR Code Scanner**: Dashboard integration for inventory management
- **Attendance Management**: Employee check-in/check-out system
- **Ticket System**: Support ticket creation and management
- **Stock Management**: Inventory tracking with QR codes
- **Payroll**: Employee payroll management

### Backend (Express.js)
- **RESTful API**: Clean API endpoints for all CRM features
- **Authentication**: User authentication and authorization
- **Database Integration**: Ready for your preferred database
- **CORS & Security**: Configured with helmet and CORS

### Shared Package
- **Common Types**: TypeScript interfaces shared between frontend and backend
- **Utilities**: Common helper functions and validators

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install all dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration
```

### Development

Start both frontend and backend in development mode:

```bash
# Start frontend (Next.js on port 3000)
npm run dev:frontend

# Start backend (Express on port 3001) 
npm run dev:backend

# Or start frontend only (default)
npm run dev
```

### Building for Production

```bash
# Build all apps
npm run build

# Build individually
npm run build:frontend
npm run build:backend
```

### Available Scripts

- `npm run dev` - Start frontend development server
- `npm run dev:frontend` - Start frontend only
- `npm run dev:backend` - Start backend only  
- `npm run build` - Build all applications
- `npm run start:frontend` - Start frontend production server
- `npm run start:backend` - Start backend production server
- `npm run lint` - Lint all applications
- `npm run clean` - Clean all node_modules

## API Endpoints

The backend runs on `http://localhost:3001` with the following endpoints:

- `GET /health` - Health check
- `GET /api/v1/test` - Test endpoint

## Frontend Access

The frontend runs on `http://localhost:3000` and includes:
- Dashboard with QR scanner
- Attendance management
- Ticket system
- Stock management  
- Payroll features

## Development Workflow

1. **Backend-First Approach**: Start by implementing API endpoints in `apps/backend/src/`
2. **Shared Types**: Define common interfaces in `packages/shared/src/types/`
3. **Frontend Integration**: Connect frontend components to backend APIs
4. **Testing**: Add tests for both frontend and backend

## Next Steps

1. Set up your preferred database (PostgreSQL, MongoDB, etc.)
2. Implement authentication system
3. Add API endpoints for CRM features
4. Connect frontend components to backend APIs
5. Add comprehensive testing

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
