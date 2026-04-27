# Project AGENTS.md

## Overview
Calendar booking system (Hexlet project). Monorepo under `calendar-booking/` with a Python FastAPI backend, React frontend, and TypeSpec API contract.

## Architecture
- **Backend** (`calendar-booking/backend/`): FastAPI + uvicorn, in-memory dicts (no DB). Runs on `localhost:8000`. Serves frontend static files from `dist/` in production.
- **Frontend** (`calendar-booking/frontend/`): React 18 + Vite + TypeScript + Mantine 7. Runs on `localhost:3000` in dev.
- **API spec** (`calendar-booking/specs/main.tsp`): TypeSpec contract. Compiles to `calendar-booking/openapi/openapi.yaml`.
- Frontend proxies `/api/*` → `http://localhost:8000/*` in dev (see `vite.config.ts`).

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
npm run test-e2e        # Playwright e2e tests
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

### E2E Tests (Playwright)
```bash
cd calendar-booking/frontend
npx playwright test     # runs e2e tests (auto-starts backend + frontend)
npx playwright test --ui  # interactive UI mode
```

### Docker
```bash
docker build -t calendar-booking .
docker run -p 8000:8000 calendar-booking
```

## Key Constraints
- Backend uses **in-memory storage** (`event_types_db`, `bookings_db` dicts) — data resets on restart.
- E2E tests: `playwright.config.ts` auto-starts backend (uvicorn) and frontend (vite preview) via `webServer`.
- CI: `.github/workflows/hexlet-check.yml` — **do not modify or delete**.
- Docker image reads port from `PORT` env var (default 8000).
- Do not delete, edit, or rename the repository.

## Conventions
- Ask the human in Russian; write all code/files in English.
- Frontend uses `axios` for API calls (`src/api/client.ts`).
- Strict TypeScript: `noUnusedLocals`, `noUnusedParameters` enabled.
