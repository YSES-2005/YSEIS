# Young-Software-Engineers-Inventory-System

How to setup (Windows)

Requirements (requires Docker & Docker Compose):
Make sure you install Docker first

1. From the repository root, build and start everything:

```powershell
docker compose up --build
```

2. Open the frontend at http://localhost:3000 and the backend API health at http://localhost:5000/api/health. Use localhost:5173 when actively developing.

Stopping:
```powershell
docker compose down
```

Notes:
- This repository is using pnpm instead of npm(sabi ni robbie) inside Docker images. Locally you can use pnpm as well.
- To install and run locally without Docker, install pnpm (Node 16+ includes corepack; enable it with `corepack enable`), then:

```powershell
cd backend
pnpm install
pnpm run dev

cd ..\frontend
pnpm install
pnpm run dev
```

For linux users kaya nyo na yan