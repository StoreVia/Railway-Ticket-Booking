# RailX Fullstack Application

RailX is a fullstack railway booking system with:
- a Next.js frontend in the repository root
- an Express + TypeScript backend in `backend/`
- MongoDB as the primary database

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS, Framer Motion
- Backend: Express, TypeScript, Mongoose, JWT authentication
- Database: MongoDB

## Project Structure

- `src/`: frontend application code (App Router pages and UI)
- `backend/src/`: backend APIs, routes, models, and middleware
- `scripts/`: helper scripts, including local development startup
- `run.sh`: simple shell script to run frontend and backend together

## Prerequisites

- Node.js 18+ (recommended)
- npm
- MongoDB running locally at `mongodb://localhost:27017` (default setup)

## Installation

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
cd ..
```

## Environment Setup

Create `backend/.env` with values similar to:

```env
DB_HOST="mongodb://localhost:27017"
DB_NAME="railway_booking"
JWT_SECRET="replace_with_a_strong_secret"
PORT=5001
NODE_ENV="development"
```

## Running the App

Option 1: Run both services with the helper script:

```bash
npm run dev:full
```

Option 2: Run services manually in separate terminals:

Terminal 1 (frontend):

```bash
npm run dev
```

Terminal 2 (backend):

```bash
cd backend
npm run dev
```

## Build for Production

Frontend:

```bash
npm run build
npm start
```

Backend:

```bash
cd backend
npm run build
npm start
```

## Security Notes

- Do not commit real secrets or production credentials.
- Move all secrets to environment variables and keep `.env` files out of version control.
- Rotate any secret that has been exposed in source code history.

## Scripts

Root scripts:
- `npm run dev`: start frontend development server
- `npm run build`: build frontend
- `npm run start`: start built frontend
- `npm run lint`: lint frontend code
- `npm run dev:full`: install deps, prepare backend env, and start both servers

Backend scripts:
- `npm run dev`: start backend with nodemon
- `npm run build`: compile backend TypeScript
- `npm run start`: run compiled backend
- `npm run seed`: seed database
