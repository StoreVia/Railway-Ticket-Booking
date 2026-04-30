# RailX - Railway Ticket Booking System

RailX is a full-stack railway booking application with separate user and admin flows.
Users can search trains, book seats, make payments, view notifications, and manage bookings.
Admins can manage trains/schedules and monitor bookings from an admin dashboard.

## Stack

- Frontend: React 19, Vite, React Router, Tailwind CSS, Framer Motion
- Backend: Express, Mongoose, JWT, bcrypt
- Database: MongoDB

## Key Features

- User authentication (register/login/logout/session validation)
- Train search by source, destination, and date
- Booking flow with seat selection and confirmation
- Payment and cancellation flows
- Notification center and user profile management
- Admin authentication and protected admin dashboard
- Admin CRUD for trains and schedules
- Admin booking overview and cancellation actions
- QR generation endpoint for booking confirmation

## Project Structure

```text
.
├── src/                      # Frontend (React + Vite)
│   ├── app/                  # Pages and route-level UI
│   ├── components/           # Shared UI components/providers
│   └── context/              # Auth and local-storage contexts
├── backend/
│   └── src/
│       ├── models/           # Mongoose schemas
│       ├── routes/           # Express route handlers
│       ├── middleware/       # Auth middleware
│       ├── lib/              # DB and JWT helpers
│       ├── seed.js           # Seed script
│       └── server.js         # Backend entrypoint
├── run.sh                    # Start frontend and backend together
└── README.md
```

## Prerequisites

- Node.js 18 or newer
- npm
- Local MongoDB instance running (default: `mongodb://localhost:27017`)

## Setup

1) Install frontend dependencies (repo root):

```bash
npm install
```

2) Install backend dependencies:

```bash
cd backend
npm install
cd ..
```

3) Create backend environment file:

```bash
cp backend/.env.example backend/.env
```

4) Update `backend/.env` as needed:

```env
DB_HOST="mongodb://localhost:27017"
DB_NAME="railway_booking"
JWT_SECRET="replace_with_a_strong_secret"
PORT=5001
NODE_ENV="development"
```

## Run Locally

### Option A: Start both services with one command

```bash
./run.sh
```

### Option B: Start services in separate terminals

Frontend (from repo root):

```bash
npm run dev
```

Backend (from `backend/`):

```bash
npm run dev
```

## Default Local URLs

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5001`
- Health check: `http://localhost:5001/health`

## Database Seeding

Seed stations, trains, schedules, and admin records:

```bash
cd backend
npm run seed
```

## Available Scripts

### Root scripts

- `npm run dev` - start Vite development server (frontend)
- `npm run build` - build frontend for production
- `npm run start` - preview built frontend on port 3000
- `npm run lint` - run ESLint
- `npm run dev:full` - calls `node scripts/start-dev.js` (ensure this script exists before use)

### Backend scripts (`backend/`)

- `npm run dev` - start backend with nodemon
- `npm run start` - start backend with Node.js
- `npm run build` - placeholder build script (no compile step)
- `npm run seed` - seed MongoDB with sample data

## API Route Groups

- `/api/auth` - user authentication/session routes
- `/api/admin-auth` - admin authentication routes
- `/api/admin` - admin management and dashboard stats
- `/api/stations` - station listing
- `/api/trains` - train search
- `/api/schedules` - schedule details
- `/api/bookings` - booking creation/listing
- `/api/payments` - payment operations
- `/api/cancellations` - cancellation operations
- `/api/notifications` - user notifications
- `/api/profile` - user profile and password updates
- `/api/qr` - QR generation

## Notes

- Frontend API URLs are currently hardcoded to `http://localhost:5001`.
- Keep secrets out of version control (`.env` should stay local).
