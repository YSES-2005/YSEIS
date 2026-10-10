## Pull Request Title Format

Format PR title as: `[TICKET ID] feat/fix/chore(scope): Short description`  
**Example:** `[YSEIS-42] feat(backend): Add atomic stock reservation for borrow approvals`

---

## Description

### What does this PR do?

<!-- Provide a concise summary of the changes introduced. Explain the problem being solved or the feature being added. -->

- **Fixes/Closes:** #<!-- GitHub issue number if applicable -->

---

## Workspaces Affected

- [ ] `shared` (`@yseis/shared` - Schemas, Types, Validations)
- [ ] `backend` (Express API, Mongoose Models, Sockets)
- [ ] `frontend` (Vite, React, TanStack Router/Query, Tailwind)
- [ ] `docs` (Documentation, README, API specs)

---

## Type of Change

- [ ] **New Feature** (non-breaking change adding functionality)
- [ ] **Bug Fix** (non-breaking change fixing an issue)
- [ ] **Security / Auth Patch** (privilege escalation, IDOR, input sanitation, secret handling)
- [ ] **Performance / Concurrency** (race conditions, query optimization, memory leak fixes)
- [ ] **Breaking Change** (fix or feature that would cause existing functionality/contracts to break)
- [ ] **Refactor / Tech Debt** (no functional change, internal cleanup)
- [ ] **Documentation** (updates to docs, README, or examples)

---

## Architectural & Security Impact

- [ ] **Contract Integrity:** If schemas in `@yseis/shared` were modified, was dual ESM/CJS build verified (`pnpm run build:shared`) and are both `frontend` and `backend` aligned?
- [ ] **Authorization & RBAC:** Does this PR expose new routes or state changes? Have user roles (`admin` vs `user`) and ownership checks been verified against IDOR?
- [ ] **Data Consistency & Atomicity:** Are inventory allocations, return completions, or multi-step database mutations atomic / protected against race conditions?
- [ ] **Environment Configuration:** Were new environment variables introduced? If yes, are they added to `backend/.env.example` or `frontend/.env.example` and validated via Zod?

---

## Verification & Quality Gates

Ensure all automated checks pass locally before requesting review:

```bash
# 1. Format check
pnpm run format:check

# 2. Workspace linting
pnpm run lint

# 3. Monorepo typecheck & build
pnpm run build

# 4. Test suites & coverage enforcement
pnpm run test:coverage
```

### Checklist

- [ ] Code follows project formatting and style guidelines (`prettier`, `eslint`)
- [ ] `pnpm run build` succeeds across all workspaces without type errors
- [ ] Unit/Integration tests added or updated for new business logic
- [ ] `pnpm run test:coverage` passes without threshold regressions
- [ ] Verified no circular dependencies were introduced (`madge`)
- [ ] Self-review conducted on diff prior to opening PR
- [ ] No sensitive credentials, debug logs (`console.dir`), or hardcoded secrets left behind

---

## Visual / UI Changes (Frontend Only)

<!-- If this PR changes the UI, include before/after screenshots or screen recordings (desktop & mobile). -->

|      Before       |       After       |
| :---------------: | :---------------: |
| _(Image / Video)_ | _(Image / Video)_ |

---

## Additional Notes / Deployment Considerations

<!-- Any special deployment instructions, database migrations, seed updates, or operational notes for reviewers. -->
