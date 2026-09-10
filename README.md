# TodoApp

A full-stack todo application built with FastAPI, PostgreSQL, React, TypeScript, Vite, and Tailwind CSS.

## Features

- User registration and login
- Cookie-based access and refresh tokens
- Authenticated todo creation and listing
- Todo editing and deletion
- User-owned todo access
- Dark responsive frontend
- Async FastAPI backend
- Alembic database migrations
- Pytest API test suite

## Project Structure

```text
backend/    FastAPI application, database models, services, and migrations
frontend/   React + TypeScript + Vite application
```

## Requirements

- Python 3.14 or compatible Python version
- Node.js and npm
- PostgreSQL

## Backend Setup

Open a terminal in the repository root:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create `backend/.env` locally. Do not commit this file:

```env
DB_USER=your_postgres_user
DB_PASS=your_postgres_password
DB_NAME=todoapp
DB_PORT=5432
DB_HOST=localhost
SECRET_KEY=replace_with_a_long_random_secret
FRONTEND_URL=http://localhost:5173
```

Run database migrations:

```powershell
cd backend
..\backend\venv\Scripts\python.exe -m alembic upgrade head
```

Start the API:

```powershell
cd backend
..\backend\venv\Scripts\python.exe -m uvicorn main:app --reload
```

The API runs at `http://localhost:8000`.

Interactive API documentation is available at:

- `http://localhost:8000/docs`
- `http://localhost:8000/redoc`

## Frontend Setup

In another terminal:

```powershell
cd frontend
npm install
```

Create `frontend/.env` locally:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Start the frontend:

```powershell
cd frontend
npm run dev
```

The frontend runs at `http://localhost:5173`.

## Testing

Run the backend test suite from the repository root:

```powershell
backend\venv\Scripts\python.exe -m pytest -q
```

The tests use an isolated in-memory SQLite database and do not require PostgreSQL to be running. The suite covers authentication, protected routes, todo CRUD, and cross-user access protection.

## Frontend Checks

```powershell
cd frontend
npm run build
npm run lint
```

## Security Notes

- Never commit `.env` files, database credentials, or production secrets.
- Use a unique long `SECRET_KEY` in each environment.
- The root `.gitignore` excludes local environments, dependencies, caches, build output, logs, and environment files.
