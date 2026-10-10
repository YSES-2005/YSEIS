<h1 align="center">Young Software Engineers Inventory System</h1>

<img width="2084" height="1198" alt="image" src="https://github.com/user-attachments/assets/6f5e955d-c25d-4000-b20d-a5195ed98c8c" />

### Background

The Young Software Engineers Inventory System was designed in order to address the various inefficiencies in managing YSES' shared resources. YSEIS provides a centralized database that enables transparent inventory tracking, structured borrowing, and role based access for members and admins.

### Features

- Role-based authentication (Admin / Member)
- Centralized inventory management
- Borrowing and return request workflow
- Real-time item availability tracking
- Admin approval, rejection, and override of requests
- Transaction history with search and filters
- Automated overdue and low-stock alerts
- Responsive UI for desktop and mobile browsers

### URL

https://yseis.hatagi.org/

---

## Developer Quickstart & Quality Standards

### Prerequisites

- **Node.js**: `v20.x` or `v22.x` (LTS)
- **pnpm**: `v10.18.3` (Enable via `corepack enable && corepack prepare pnpm@10.18.3 --activate`)
- **Docker & Docker Compose**: For local MongoDB and containerized dev environments

---

### Step-by-Step Local Setup

1. **Clone & Switch to Feature Branch**

   ```bash
   git clone git@github.com:YSES-2005/YSEIS.git
   cd YSEIS
   git checkout staging
   git pull origin staging
   git checkout -b feat/your-feature-name
   ```

2. **Install Dependencies & Configure Git Hooks**

   ```bash
   # Installs dependencies and activates Husky pre-commit hooks
   pnpm install
   ```

3. **Build Shared Schemas (Required)**

   ```bash
   # Both frontend and backend rely on compiled shared schemas
   pnpm run build:shared
   ```

4. **Environment Configuration**
   Copy sample environment files (obtain secrets from team lead):

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

5. **Start Local Development Environment**
   ```bash
   # Starts Dockerized MongoDB, backend API, and Vite frontend
   make dev
   ```

---

### Quality Assurance & Testing Workflow

Before opening any Pull Request to `staging` or `main`, ensure all quality gates pass locally:

- [ ] **Formatting Check:**

  ```bash
  # Check formatting
  pnpm run format:check

  # Auto-fix formatting
  pnpm run format
  ```

- [ ] **Linting Check:**

  ```bash
  # Run ESLint across backend, frontend, and shared
  pnpm run lint

  # Auto-fix linting issues where possible
  pnpm run lint:fix
  ```

- [ ] **Typecheck Verification:**
  ```bash
  pnpm run build
  ```
- [ ] **Unit & Integration Tests (Coverage >= 80% Required):**
  ```bash
  # Run all tests with coverage verification
  pnpm run test:coverage
  ```
- [ ] **Pre-commit Hook Check:**
  - Git hooks (`husky` + `lint-staged`) automatically validate and format staged files on `git commit`. Do not bypass using `--no-verify`.
