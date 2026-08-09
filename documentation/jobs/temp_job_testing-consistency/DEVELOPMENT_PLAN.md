# Development plan: Testing consistency for fork-safe boilerplate

## Summary

- **Goal:** Make the repo’s test setup **extremely consistent and clear** so apps built on this starter pick one obvious pattern — runner choice, file placement, naming, shared wrappers, and documentation — without drift across example files.
- **Why:** Prior analysis found a solid Vitest foundation but fork risks from (1) dual-runner ambiguity (`vitest` vs `node:test`), (2) `testing/RULE.md` contradicting actual colocation, (3) three naming styles across 8 example files, (4) `tests/test-utils.tsx` existing but unused, and (5) no single human-facing testing guide.
- **Complexity:** S — docs + shared test utilities + refactors across ~10 existing test/support files; no app features, migrations, or schema changes.
- **Plan review:** Not required (S; no new user-visible product behavior — developer/contract documentation only).
- **Scope / constraints:**
  - **In:** `documentation/DOC_TESTING.md` (new SSOT); align `.cursor/rules/testing/RULE.md`; expand `tests/test-utils.tsx`; refactor existing `src/**/*.test.*` to shared patterns; update README, `DOC_INDEX.md`, `DOC_CONTRIBUTING.md`, agent skills cross-links; explicit dual-runner decision tree.
  - **Out:** Vitest unification for `scripts/*.test.cjs` (optional follow-up); E2E framework (Playwright/Cypress); CI coverage thresholds; changing pre-commit test classifier behavior (separate job on `feature/staged-precommit-tests`).
  - **Branch:** Implement on `feature/testing-consistency` off synced `develop`. Do not stack on `feature/staged-precommit-tests` unless user explicitly wants one PR — keeps review scope clean.
  - **Naming standard (proposed default):** `"should [expected behavior] when [condition]"` for all `it()` names — matches majority of examples and `testing/RULE.md`.

## Phase overview

| Phase | Goal | Gate | Status |
|-------|------|------|--------|
| 1 | Lock decisions + author `DOC_TESTING.md` | Doc complete; runner tree + colocation + naming documented | Done |
| 2 | Fix `testing/RULE.md` + cross-links | Rule matches colocation; points to DOC_TESTING | Done |
| 3 | Expand `tests/test-utils.tsx` | Shared `renderWithProviders` (+ optional auth/router defaults) | Done |
| 4 | Refactor example tests + naming | All 8 Vitest files use utilities where applicable; one naming style | Done |
| 5 | Human + agent doc sweep | INDEX, README, CONTRIBUTING, skills aligned; no stale guidance | Done |

## Conflict & compliance

- **Applicable rules:**
  - `testing/RULE.md` — SSOT for test standards; **will be edited** (protected — see consent).
  - `file-placement/RULE.md` — colocated `src/**/*.test.ts(x)`; support files in `tests/`; `documentation/DOC_*.md`.
  - `code-style/RULE.md` — test files follow double quotes / Prettier scope (`src/` + `tests/`).
  - `architecture/RULE.md` — no new features; test-utils stays in `tests/` (shared test infra, not app layer).
  - `workflow/RULE.md` — branch strategy; protected files batch for rule edits.
  - `projectStructure.config.cjs` — `tests/test-utils.tsx`, `tests/setup.ts`, `documentation/DOC_*.md` already whitelisted; **no config change expected**.

- **File placements (confirmed):**

  | Path | Action |
  |------|--------|
  | `documentation/DOC_TESTING.md` | **Create** — human + agent quick-start SSOT |
  | `tests/test-utils.tsx` | **Extend** — `renderWithProviders`, re-export patterns |
  | `tests/setup.ts` | Unchanged (RTL cleanup) |
  | `src/**/*.test.ts(x)` | **Edit** — naming + wrapper adoption (8 files) |
  | `.cursor/rules/testing/RULE.md` | **Edit** — colocation, runner tree pointer, trim duplication |
  | `documentation/DOC_INDEX.md` | Add Testing row + SSOT map entry |
  | `README.md` | Link `DOC_TESTING.md`; keep command list |
  | `documentation/DOC_CONTRIBUTING.md` | Link testing SSOT |
  | `.agents/skills/start/SKILL.md` | Point verification to DOC_TESTING |
  | `.agents/skills/prime/SKILL.md` | Optional one-line testing pointer |

- **Protected-file consent (before Phase 2):** `.cursor/rules/testing/RULE.md` — request batch approval with implement.

- **Risks / attention points:**
  - **Dual-runner stays:** `src/` → Vitest; `scripts/*.test.cjs` → `node:test` via `pnpm test:classify`. Document clearly; do not merge runners in this job (higher risk, low fork value).
  - **test-utils scope creep:** Keep helpers minimal (Router + QueryClient + optional auth mock defaults). No full app shell — avoids hiding integration bugs.
  - **Refactor-only test changes:** Renaming `it()` strings and swapping wrappers should not change assertions; run full suite after Phase 4.
  - **SignInPanel** has no Router today — only add wrapper if needed; don’t over-wrap pure unit tests.
  - **`projectStructure.config.cjs` comment** already says colocation + `tests/integration|e2e` — align DOC_TESTING with that (integration folder empty today).

- **Open questions for user (resolve at implement if not answered now):**
  1. **Branch:** Separate `feature/testing-consistency` off `develop`, or continue on current branch?
  2. **Vitest unification for scripts:** Defer (recommended) or include as Phase 6?
  3. **Naming:** Confirm `"should … when …"` as mandatory for all new tests?

- **Standards diversions:**
  - **Intentional:** Two test runners (Vitest + node:test) — industry norm for Vite SPA + CJS tooling; documented explicitly instead of hidden.
  - **Intentional:** No E2E in boilerplate — manual/browser per existing workflow; DOC_TESTING states this boundary.

## Pattern & precedent

| Field | Value |
|-------|--------|
| **Capability** | Fork-safe testing conventions: one doc, one colocation rule, one naming style, shared render helpers. |
| **Precedents** | Create React App / Vite starters (Vitest + RTL colocation); Kent C. Dodds Testing Library docs (`render` wrappers); Nx monorepo “testing.md” per stack. |
| **Aspects reviewed** | Colocation vs separate test tree; shared test harness; dual-runner split; documentation layering (human doc vs agent rule). |

| Aspect | Aligns / diverges | Risk if we proceed |
|--------|-------------------|-------------------|
| Colocation | Aligns — `*.test.ts(x)` beside source is Vite/React norm | None |
| Shared `renderWithProviders` | Aligns — RTL custom render pattern | Over-abstraction if we wrap everything including pure utils |
| Dual-runner | Diverges acceptably — scripts stay on node:test | Fork adds tests in wrong runner without DOC_TESTING |
| Docs split (DOC + RULE) | Aligns — human guide + enforceable rule | Duplication unless RULE points to DOC |

| **Verdict** | **Aligns with precedent** |
| **Options** | A: Docs only. **B: Docs + test-utils + example refactors (chosen).** C: B + migrate scripts to Vitest workspaces. |

**Pattern review:** Skipped formal `pattern-review` invoke — S complexity, no user-visible product contract; precedent table above is sufficient.

## Source / context

- User question: “how well organized are our current tests?” — analysis in prior chat (Vitest primary, node:test for scripts, naming drift, unused test-utils).
- User: `/plan` to make setup “extremely consistent and clear” for downstream apps.

## Existing functionality (reuse)

| Asset | Role today | Reuse |
|-------|------------|-------|
| `vitest.config.ts` | Vitest + jsdom + `@/` alias | Unchanged; reference in DOC_TESTING |
| `tests/setup.ts` | RTL `cleanup` after each test | Unchanged |
| `tests/test-utils.tsx` | `createTestQueryClient`, `createQueryClientWrapper` | Extend with `renderWithProviders` |
| `src/**/*.test.*` | Layer examples (utils, service, hook, component) | Refactor to SSOT patterns |
| `scripts/*.test.cjs` | Classifier/executor tests | Document only; no migration |
| `.cursor/rules/testing/RULE.md` | Agent test authority + commit tiers | Trim + link DOC_TESTING |
| `documentation/DOC_AGENT_WORKFLOW_LAYERS.md` | Commit vs merge test authority | Cross-link from DOC_TESTING |

## Scope / out-of-scope

| In scope | Out of scope |
|----------|--------------|
| `DOC_TESTING.md` | Playwright/Cypress setup |
| Rule + README + INDEX updates | CI coverage % gates |
| `test-utils` + 8 file refactors | Migrating `scripts/` tests to Vitest |
| Naming standardization | New production features |
| Dual-runner documentation | Changing staged pre-commit classifier |

---

## Phase 1 — Decisions + `DOC_TESTING.md`

### Goal

Single human-facing testing guide that answers “where does this test go?” and “which command do I run?” in under one page.

### Steps

1. Record naming + dual-runner decisions in **Decisions made** (if user confirms defaults).
2. Create `documentation/DOC_TESTING.md` with sections:
   - **Quick commands** — `test`, `test:run`, `test:classify`, `test:staged`, `test:staged:live`, `test:coverage`
   - **Runner decision tree** — `src/**` → Vitest; `scripts/*.cjs` → `node:test` / `pnpm test:classify`; never both for same file
   - **File placement** — colocated `Component.test.tsx` beside source; `tests/` only for `setup.ts`, `test-utils.tsx`, future `integration/` / `e2e/`
   - **Naming** — `describe(module)` → `it("should … when …")`
   - **Layers** — table mapping layer → test type → example file path
   - **Shared utilities** — when to use `renderWithProviders` vs inline `render`
   - **Mocking** — `vi.mock` at top; prefer mocking services over components for unit tests
   - **What not to automate** — Edge Functions, full E2E (pointer to workflow rule)
   - **Commit vs merge authority** — link `DOC_AGENT_WORKFLOW_LAYERS.md` § Local git (no duplication of full table)
   - **Adding a new test checklist** — 5-step fork checklist

### Gate

- `pnpm validate:structure` passes with new `DOC_TESTING.md`
- `pnpm validate:docs` passes
- Manual: a new contributor can answer runner + placement from DOC alone

---

## Phase 2 — `testing/RULE.md` alignment

### Goal

Agent rule matches repo reality; defers prose to DOC_TESTING where appropriate.

### Steps

1. **File structure §** — Replace “mirror in test directory” with **colocation** as default; `tests/` for shared setup, utils, integration/e2e only.
2. **Add § Testing documentation SSOT** — `documentation/DOC_TESTING.md` for human + agent onboarding; this rule for authority philosophy + commit tiers.
3. **Add § Runner selection** — bullet tree matching DOC (3 lines + link).
4. **Test naming §** — Mandate `"should … when …"`; note `scripts/*.test.cjs` may use `test()` but same naming string.
5. **Trim overlap** — Local test authority table stays (agent always-applied); link DOC for examples.
6. Update `.cursor/rules/INDEX.md` testing bullets — add DOC_TESTING pointer.

### Gate

- No contradictory “mirror test directory” language remains in `testing/RULE.md`
- `rg "mirror source file structure in test directory" .cursor` → zero hits

---

## Phase 3 — `tests/test-utils.tsx` expansion

### Goal

One obvious wrapper for component/hook tests that need Router + QueryClient.

### Steps

1. Add `renderWithProviders(ui, options?)` using `@testing-library/react` `render` + composable wrappers:
   - `BrowserRouter` (default on)
   - `QueryClientProvider` via `createTestQueryClient()` (default on)
   - Optional `initialEntries` for router
2. Export `renderHookWithProviders` thin wrapper (or document `renderHook` + manual wrapper for hooks — pick one, document in DOC).
3. Add **minimal** `defaultAuthContext` mock factory (optional opt-in) — typed from `AuthContext` shape used in ProfileMenu tests; avoid importing production context in a way that creates circular deps.
4. JSDoc with `@example` for component + hook cases.
5. Do **not** add ThemeProvider unless an existing test needs it (MUI tests work without full theme in current suite).

### Gate

- `pnpm type-check` passes
- `tests/test-utils.tsx` exports documented in `DOC_TESTING.md`

---

## Phase 4 — Refactor example tests + naming

### Goal

All Vitest examples demonstrate the same patterns downstream apps should copy.

### Steps

**Naming pass (all 8 `src/` test files):**

| File | Current drift | Target |
|------|---------------|--------|
| `SignInPanel.test.tsx` | `"renders …"` | `"should render … when …"` |
| `authErrorMessages.test.ts` | `"maps …"` | `"should map … when …"` |
| `appTasksDomain.test.ts` | `"parses …"` | `"should parse … when …"` |
| Others | Mostly `should` | Normalize edge cases only |

**Wrapper pass (where applicable):**

| File | Action |
|------|--------|
| `ProfileMenu.test.tsx` | Use `renderWithProviders`; remove inline `BrowserRouter` wrapper |
| `useAuthRedirect.test.tsx` | Use `renderHookWithProviders` or shared wrapper |
| `SignInPanel.test.tsx` | Keep plain `render` if no Router needed |
| Utils/services/domain tests | No wrapper changes |

**Import convention:** Tests import helpers from `@/../tests/test-utils` or relative `../../../../tests/test-utils` — **prefer vitest alias** if already configured; else add `@/tests/*` → `tests/*` alias in `vitest.config.ts` **only if** `tsconfig` paths can mirror without breaking architecture rules (check `architecture/RULE.md` § path aliases — `tests/` is outside `src/`, so likely **relative import from test-utils or `tests/test-utils` path in vitest only**).

Recommended: add vitest resolve alias `tests` → `./tests` for clean imports (`import { renderWithProviders } from "tests/test-utils"`). Document in DOC_TESTING. Verify `dependency-cruiser` does not flag test-only imports.

### Gate

```text
pnpm test:run
pnpm lint
pnpm type-check
```

All 72+ Vitest tests green; no behavior change (rename + wrapper only).

---

## Phase 5 — Human + agent doc sweep

### Goal

No stale or scattered testing guidance.

### Steps

1. `documentation/DOC_INDEX.md` — Quick link + SSOT row for Testing → `DOC_TESTING.md`
2. `README.md` § Testing — link DOC_TESTING as primary guide; keep command block
3. `documentation/DOC_CONTRIBUTING.md` — “How to write tests” → DOC_TESTING
4. `.agents/skills/start/SKILL.md` — verification checklist references DOC_TESTING
5. `.agents/skills/prime/SKILL.md` — optional bullet under governance
6. `ARCHITECTURE.md` — if testing mentioned, one-line pointer to DOC_TESTING (grep first; edit only if stale)
7. Grep gate:

```text
rg -i "mirror.*test directory|tests on push" README.md documentation .cursor .agents
→ only intentional historical notes or zero
```

### Gate

- `pnpm validate:docs`
- Spot-check: README → DOC_TESTING → example test file chain is obvious

---

## Notes during development

- Implemented on `feature/testing-consistency` (2026-07-09).
- Gates: `pnpm test:run` (72), `pnpm type-check`, `pnpm lint` (0 errors), `pnpm validate:structure`, `pnpm validate:docs` — all green.
- Vitest alias `tests` → `./tests` added in `vitest.config.ts` for `import from "tests/test-utils"`.

## Decisions made

| # | Topic | Choice | User asked? |
|---|-------|--------|-------------|
| 1 | Scope | Docs + test-utils + example refactors; **no** script runner migration | No — plan default (Option B) |
| 2 | Naming | `"should [behavior] when [condition]"` for all `it()` names | Yes — user: `implement` |
| 3 | Branch | `feature/testing-consistency` | Yes — user: `implement` |
| 4 | Protected files | `testing/RULE.md` edit with implement | Yes — user: `implement` |
| 5 | Vitest scripts migration | **Deferred** | No — plan default |
