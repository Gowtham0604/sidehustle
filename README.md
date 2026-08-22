# SideHustlesJob

SideHustlesJob is a Bengaluru company discovery platform. This repository contains the public React frontend and Go API foundations; database schema, API operations, and product UI are intentionally not implemented yet.

## Repository layout

- `frontend/` — React, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS, and Leaflet foundation
- `backend/` — Go API foundation organized by bounded context
- `database/` — reserved for future SQL migrations and tooling-compatible seed directory
- `docs/` — API contract documentation
- `scripts/` — repository automation

## Local development

```sh
npm --prefix frontend install
npm --prefix frontend run dev

cd backend && go test ./...
```

Copy each `.env.example` file to a local `.env` file before adding environment-specific configuration. Do not commit secrets.
