# Workspace

## Overview

**StudyAbroad AI Counselor** — A full-stack AI-powered study abroad advisory platform. Students can chat with an AI counselor, browse 54+ top universities with contact details, explore field insights with future scope and job opportunities, and get visa guidance.

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Auth**: Replit Auth (OIDC/PKCE via `@workspace/replit-auth-web`)
- **AI**: OpenAI GPT (via Replit AI Integration, RAG-grounded)
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + Wouter routing

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/             # Express API server (port 8080)
│   ├── study-abroad-chat/      # React+Vite frontend (root path /)
│   └── mockup-sandbox/         # Component preview server for design
├── lib/
│   ├── api-spec/               # OpenAPI spec + Orval codegen config
│   ├── api-client-react/       # Generated React Query hooks
│   ├── api-zod/                # Generated Zod schemas from OpenAPI
│   ├── db/                     # Drizzle ORM schema + DB connection
│   └── replit-auth-web/        # useAuth hook for Replit Auth
├── scripts/                    # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── tsconfig.json
```

## Key Features Implemented

### Database (lib/db/src/schema/)
- `universities` — 54 universities with fields, scholarships, financial services
- `university_contacts` — admissions, international office, visa counselor, financial aid contacts
- `programs` — degree programs linked to universities, with IELTS/TOEFL requirements
- `visa_requirements` — country-specific visa requirements with counselor tips
- `field_insights` — 9 study fields with future scope, competition, salary, trends
- `field_job_opportunities` — 45+ job roles with salary ranges and demand levels
- `conversations` / `messages` — AI chat history (per-user if authenticated)

### API Routes (artifacts/api-server/src/routes/)
- `GET /api/knowledge/universities` — list with search/country/field filters
- `GET /api/knowledge/universities/:id` — university details + contacts + programs
- `GET /api/knowledge/programs` — programs with filters
- `GET /api/knowledge/visa-requirements` — visa info by country
- `GET /api/fields` — all field insights
- `GET /api/fields/:slug` — field detail with job opportunities
- `POST /api/openai/chat` — RAG AI chat (SSE streaming)
- `GET /api/auth/user` — current user
- `GET /api/login`, `GET /api/logout` — Replit Auth redirects

### Frontend Pages (artifacts/study-abroad-chat/src/pages/)
- **LoginPage** — branded landing with auth gate, "Sign In to Get Started"
- **ChatPage** — SSE-streaming AI chat with conversation history
- **KnowledgeBasePage** — tabbed browser: Universities | Programs | Visa Requirements | Study Fields
- **UniversityDetailPage** — full university profile with contacts, programs, financial services, visa tips
- **FieldInsightsPage** — all study fields with competition/salary/growth cards
- **FieldDetailPage** — deep field analysis: future scope, job opportunities table, skills, trends

### Auth Architecture
- `@workspace/replit-auth-web` provides `useAuth()` hook
- `login()` redirects to `/api/login?returnTo=BASE_URL`
- `logout()` redirects to `/api/logout`
- Auth gate wraps entire app — unauthenticated users always see LoginPage
- User info shown in nav header (name + avatar + logout)

### AI Architecture
- RAG (Retrieval Augmented Generation): all university/visa/field knowledge fetched from DB and passed as system context
- Zero hallucination — AI only answers from the knowledge base
- Model: GPT (via Replit OpenAI integration)
- Streaming via SSE (fetch + ReadableStream, NOT EventSource)

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API client + Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — sync DB schema in development

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS (credentials: true), JSON parsing, auth middleware, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers
- Depends on: `@workspace/db`, `@workspace/api-zod`

### `artifacts/study-abroad-chat` (`@workspace/study-abroad-chat`)

React + Vite frontend. Served at root path `/`.

- Uses `@workspace/replit-auth-web` for auth (`useAuth()` hook)
- Uses `@workspace/api-client-react` for all API calls (generated hooks)
- Wouter for client-side routing
- Tailwind CSS + shadcn/ui for styling
- framer-motion for animations, react-markdown for chat messages

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports all schema tables
- `src/schema/` — table definitions
- `drizzle.config.ts` — Drizzle Kit config (uses `DATABASE_URL`)

Production migrations: use `pnpm --filter @workspace/db run push` in development.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`).

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec.

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec. Used by `api-server` for response validation.

### `lib/replit-auth-web` (`@workspace/replit-auth-web`)

Provides `useAuth()` React hook for Replit Auth. Returns `{ user, isLoading, isAuthenticated, login, logout }`.

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`.
