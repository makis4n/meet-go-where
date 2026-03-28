# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend (`frontend/`)
```bash
npm run dev      # Vite dev server (http://localhost:5173)
npm run build    # TypeScript compile + Vite bundle → dist/
npm run lint     # ESLint with TypeScript and React rules
npm run preview  # Preview production build
```

### Backend (`backend/`)
```bash
source venv/bin/activate
uvicorn main:app --reload   # Dev server (http://localhost:8000), docs at /docs
```

No test suite is configured yet for either frontend or backend.

## Architecture

Monorepo with a React frontend and a FastAPI backend, both connected to the same Supabase project.

**Data flow**: React → FastAPI → Supabase (PostgreSQL, Auth, Realtime, Storage)

**Frontend** uses the Supabase JS client with the anon (public) key for client-side auth and database access. Environment variables must be prefixed with `VITE_` to be accessible in the browser (see `frontend/.env.local`).

**Backend** uses the Supabase Python client with the service role (secret) key for server-side operations. Currently only exposes a health-check endpoint (`GET /` → `{"status": "Backend is alive"}`). Add new routes in `backend/main.py`.

**TypeScript** is configured in strict mode (ES2023 target, `noUnusedLocals`, `noUnusedParameters`). ESLint uses the flat config format (`eslint.config.js`) with React hooks and React Refresh plugins.

**ML/data libraries** (NumPy, Pandas, Scikit-learn, SciPy, PyIceberg) are installed in the backend but not yet used — they indicate planned analytics or ML features.
