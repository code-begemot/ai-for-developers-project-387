# Project AGENTS.md

## Overview
Calendar booking system (Hexlet project). Monorepo under `calendar-booking/` with a Python FastAPI backend, React frontend, and TypeSpec API contract.

## Architecture
- **Backend** (`calendar-booking/backend/`): FastAPI + uvicorn, in-memory dicts (no DB). Runs on `localhost:8000`.
- **Frontend** (`calendar-booking/frontend/`): React 18 + Vite + TypeScript + Mantine 7. Runs on `localhost:3000`.
- **API spec** (`calendar-booking/specs/main.tsp`): TypeSpec contract. Compiles to `calendar-booking/openapi/openapi.yaml`.
- Frontend proxies `/api/*` → `http://localhost:8000/*` (see `vite.config.ts`).

## Developer Commands

### Backend
```bash
cd calendar-booking/backend
pip install -r requirements.txt
python main.py          # starts uvicorn on :8000
```

### Frontend
```bash
cd calendar-booking/frontend
npm install
npm run dev             # starts Vite on :3000
npm run build           # tsc + vite build
```

### API Spec (TypeSpec)
```bash
cd calendar-booking
npm install
npm run compile         # generates openapi/openapi.yaml from specs/main.tsp
```

### Mock Server (Prism)
```bash
cd calendar-booking/frontend
npm run prism           # mocks API from openapi.yaml on :4011
```

## Key Constraints
- Backend uses **in-memory storage** (`event_types_db`, `bookings_db` dicts) — data resets on restart.
- No test suite exists yet; CI is managed by Hexlet via `.github/workflows/hexlet-check.yml` — **do not modify**.
- Do not delete, edit, or rename the repository.

## Conventions
- Ask the human in Russian; write all code/files in English.
- Frontend uses `axios` for API calls (`src/api/client.ts`).
- Strict TypeScript: `noUnusedLocals`, `noUnusedParameters` enabled.
