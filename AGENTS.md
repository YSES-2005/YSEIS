# AGENTS.md — Contributor & AI Agent Guide

Welcome to the **Young Software Engineers Inventory System (YSEIS)** repository. This document serves as the single source of truth for AI agents (and human contributors) operating within this codebase. Follow these instructions and architectural patterns strictly to maintain code quality, security, and developer velocity.

---

## 1. Project Overview & Architecture

YSEIS is a full-stack monorepo designed to streamline resource tracking, borrowing workflows, inventory management, role-based access control, and notification alerts for YSES.

### Workspace Architecture

The monorepo is managed via **pnpm workspaces** (`pnpm-workspace.yaml`):

```
YSEIS/
├── shared/                 # @yseis/shared (Zod schemas, shared types, validators)
├── backend/                # inventory-backend (Express 5, Mongoose 8, Socket.io)
├── frontend/               # YSEIS React App (Vite, React 19, TanStack Router/Query, Tailwind v4)
├── docker-compose.dev.yml  # Local multi-container development environment
├── docker-compose.yml      # Production container composition
├── Makefile                # Make targets for local container management
└── package.json            # Root workspace scripts and tooling
```

---

## 2. Environment & Tooling Standards

- **Node.js**: `v20.x` or `v22.x` (CI uses Node 22).
- **Package Manager**: `pnpm` (strictly `v10.18.3`). Enable using:
  ```bash
  corepack enable && corepack prepare pnpm@10.18.3 --activate
  ```
- **Formatting**: Prettier (`.prettierrc`, `.prettierignore`).
- **Linting**: ESLint 9 flat configuration across root, backend, frontend, and shared.
- **Git Hooks**: Husky + `lint-staged` (`.lintstagedrc.json`). **Never bypass git hooks using `--no-verify`.**

### Core CLI Commands

Always run these commands from the repository root:

| Command                  | Purpose                                                                             |
| :----------------------- | :---------------------------------------------------------------------------------- |
| `pnpm install`           | Install monorepo dependencies and initialize Husky hooks                            |
| `pnpm run build:shared`  | Compile `@yseis/shared` (ESM & CJS). **Required before building backend/frontend.** |
| `pnpm run build`         | Compile shared schemas, backend, and build frontend production bundle               |
| `pnpm run lint`          | Run ESLint across all workspaces in parallel                                        |
| `pnpm run lint:fix`      | Automatically fix ESLint warnings and errors across workspaces                      |
| `pnpm run format:check`  | Verify formatting of all source files with Prettier                                 |
| `pnpm run format`        | Auto-format all files using Prettier                                                |
| `pnpm run test`          | Run all test suites across `shared`, `backend`, and `frontend`                      |
| `pnpm run test:coverage` | Run all test suites and verify coverage thresholds (>= 80% required in CI)          |
| `make dev`               | Launch Dockerized MongoDB, backend API, Vite frontend, and watch shared schemas     |

---

## 3. Workspace Specifics & Architectural Rules

### 3.1 `@yseis/shared` (`shared/`)

- **Role**: Single source of truth for data models, validation schemas, and TypeScript interfaces shared across backend and frontend.
- **Build Output**: Emits both ESM (`dist/index.js`) and CJS (`dist/cjs/index.js`) via `tsconfig.json` and `tsconfig.cjs.json`.
- **Key Rules**:
  1. Whenever modifying or creating schemas in `shared/schemas/`, **always run `pnpm run build:shared`** before running backend or frontend tests or builds.
  2. Re-export all schemas in `shared/schemas/index.ts`.
  3. Validate schemas with comprehensive Vitest tests in `shared/tests/`.

### 3.2 `backend/` (`inventory-backend`)

- **Role**: RESTful API and WebSocket server built with Express 5, TypeScript, MongoDB (Mongoose 8), Socket.io, and Nodemailer.
- **Directory Layout**: Feature-driven module architecture under `backend/features/`:
  ```
  backend/features/<feature>/
  ├── <feature>.controller.ts   # Express request handlers & business logic
  ├── <feature>.model.ts        # Mongoose schema and model definition
  ├── <feature>.route.ts        # Express router, middleware attachment, Swagger annotations
  ├── <feature>.service.ts      # (Optional) Feature business services (e.g. notifications)
  └── <feature>.cron.ts         # (Optional) Scheduled cron jobs (e.g. overdue alerts)
  ```
- **Architectural Rules**:
  1. **Error Handling**:
     - Never send ad-hoc `res.status(500).json(...)` or unstructured error payloads.
     - Always throw or pass typed error classes from `backend/errors.ts` (`BadRequestError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, etc.) into `next(err)`.
     - Centralized error response serialization is handled by `backend/middleware/error.ts`.
  2. **Authentication & Authorization**:
     - Protect authenticated routes using `authenticate` from `backend/middleware/auth.ts`.
     - Use `authorize(Role.ADMIN)` for role-restricted operations.
     - Extract current user information from `req.userId` and `req.userRole`.
     - Always guard against Insecure Direct Object References (IDOR) by verifying ownership or admin status before mutating user or transaction records.
  3. **Input Validation**:
     - Validate all incoming request bodies using the `validate(schema)` middleware from `backend/middleware/validate.ts` with schemas imported from `@yseis/shared`.
  4. **Data Consistency & Concurrency**:
     - Multi-step inventory operations (borrow approvals, stock allocation, returns) must be atomic. Guard against race conditions when deducting or incrementing stock quantities.
  5. **API Documentation**:
     - Document all endpoints with JSDoc `@swagger` annotations directly within the respective `*.route.ts` file.
  6. **Environment Configuration**:
     - All environment variables are validated at startup with Zod in `backend/config/env.ts`.
     - If adding a new environment variable, document it in `backend/.env.example` and update the Zod schema in `backend/config/env.ts`.

### 3.3 `frontend/` (`YSEIS`)

- **Role**: Single Page Application built with React 19, Vite, TanStack Router, TanStack Query, Tailwind CSS v4, and shadcn/ui.
- **Architecture**: Strict **MVVM (Model-View-ViewModel)** structure under `frontend/src/features/`:
  ```
  frontend/src/features/<feature>/
  ├── services/                 # Model / Data Access layer (Axios API calls via apiClient)
  ├── viewmodels/               # ViewModel layer (Custom hooks: state, mutations, queries)
  └── views/                    # View layer (Pure UI components delegating to ViewModels)
  ```
- **Architectural Rules**:
  1. **Separation of Concerns**:
     - **Views** must remain "dumb" presentation components. Never place direct API calls or heavy business calculations inside View components.
     - **ViewModels** (`use<Feature>ViewModel.ts`) encapsulate business logic, local UI state, and TanStack Query (`useQuery` / `useMutation`).
     - **Services** (`<feature>Service.ts`) make network requests via `apiClient` or `api` from `frontend/src/lib/apiClient.ts`.
  2. **API Client Behavior**:
     - `apiClient` has a response interceptor that returns `response.data` directly and triggers Sonner toasts on errors. Keep this in mind when typing service return values.
  3. **File-Based Routing**:
     - Routes are managed by TanStack Router in `frontend/src/routes/`.
     - Do NOT manually edit `frontend/src/routeTree.gen.ts`; it is generated automatically by TanStack Router.
     - Protected routes must implement `beforeLoad` authentication checks with redirects.
  4. **Component Library & Design Tokens**:
     - Use pre-built shadcn/ui components in `frontend/src/components/ui/`.
     - Style components using Tailwind CSS utility classes adhering to the dark-mode compatible design system in `frontend/src/index.css`.
  5. **Resource Cleanup**:
     - Prevent memory leaks by properly unsubscribing from Socket.io events, clearing intervals/timers, and canceling pending requests in `useEffect` cleanup callbacks.

---

## 4. Quality Standards & Verification Gates

Before submitting any code, opening a Pull Request, or completing an agent task, verify that all quality gates pass:

```bash
# 1. Format check
pnpm run format:check

# 2. Workspace linting
pnpm run lint

# 3. Monorepo typecheck & build
pnpm run build

# 4. Unit & Integration tests with coverage
pnpm run test:coverage
```

### Coverage Requirement

- CI strictly enforces **>= 80% coverage** for `shared`, `backend`, and `frontend`.
- When adding new business logic, controllers, services, or utilities, always write accompanying tests using Vitest (`*.test.ts` / `*.spec.ts`).

---

## 5. Git & PR Conventions

- **Branching Strategy**:
  - Feature branches must branch off `staging`: `git checkout -b feat/your-feature-name`.
  - All feature Pull Requests must target `staging` (never `main` directly).
- **Commit & PR Title Format**:
  Follow Conventional Commits with ticket references:
  ```
  [TICKET-ID] feat/fix/chore/refactor(scope): Short imperative description
  ```
  _Examples:_
  - `[YSEIS-42] feat(backend): Add atomic stock reservation for borrow approvals`
  - `[YSEIS-88] fix(frontend): Prevent duplicate socket listeners on route change`
- **Cleanliness Guardrails**:
  - Do NOT commit sensitive tokens, secrets, or `.env` files.
  - Remove all temporary debugging artifacts (e.g. `console.log`, `console.dir`, commented-out code).
  - Verify that no circular dependencies are introduced.
