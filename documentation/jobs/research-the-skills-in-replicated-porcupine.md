# Research: High-Meaning Vocabulary in the Rules Files

## Context

The user asked for an analytic survey of the repo's `.cursor/skills/` and `.cursor/rules/` content, focused on the **rules** files: extract the 50 words that carry the most meaning, propose a ranking method for "priming effectiveness," and apply it to pick a top 10. This is a research deliverable, not an implementation plan — the output below *is* the answer.

## Corpus surveyed

- `.cursor/rules/INDEX.md` and the 10 `RULE.md` files (architecture, file-placement, code-style, workflow, testing, security, database, debugging, cloud-functions, project-specific) — ~3,300 lines.
- 24 `.cursor/skills/*/SKILL.md` files — orientation only; the question targets rules.

The rules form a layered governance system: **architecture + file-placement** define structure, **code-style + workflow** define process, the rest are domain rules. The architecture and file-placement rules carry SSOT status; others reference them.

## The 50 highest-meaning words / phrases

Selection criterion: words whose removal would materially weaken the rule's directive force. Generic English ("code", "use", "should") was excluded; project-specific or enforcement-bearing terms were kept. Compound terms count as one entry where the meaning is inseparable.

**Architecture & placement (16)**
1. SSOT
2. boundaries
3. whitelist
4. layers
5. downward (import direction)
6. path aliases (`@/`)
7. features/
8. shared/
9. common/
10. pages
11. hooks
12. services
13. utils
14. types
15. barrel (files)
16. circular (dependency)

**Tooling & enforcement artifacts (12)**
17. `projectStructure.config.cjs`
18. `.dependency-cruiser.cjs`
19. dependency-cruiser
20. `eslint-plugin-boundaries`
21. `validate:structure`
22. `arch:check`
23. `validate:feature-docs`
24. baseline (`.dependency-cruiser-baseline.json`)
25. pre-commit
26. husky / lint-staged
27. GTS
28. Prettier

**Code-style enforcement (7)**
29. strict (TypeScript strict mode)
30. complexity (cyclomatic / cognitive)
31. JSDoc / TSDoc
32. PascalCase / camelCase
33. double quotes
34. styling scope (sx / theme / instance)
35. `defaultTheme.ts`

**Workflow & governance (10)**
36. CHANGELOG
37. semantic versioning
38. conventional commits
39. develop (branch)
40. main (branch)
41. feature/*
42. squash merge
43. protected files
44. immutable (rules)
45. emergency override

**Documentation & file conventions (5)**
46. `DOC_` prefix
47. `temp_` prefix
48. README.md (feature-local)
49. `documentation/jobs/`
50. ARCHITECTURE.md

## Ranking method: priming effectiveness

"Priming" here means: when this word appears in a system prompt or short context, how strongly does it pull the assistant toward the *correct project-specific* behavior — as opposed to generic best practice?

Score each candidate on five orthogonal axes, 0–3 each (max 15):

| Axis | Question |
| ---- | -------- |
| **Specificity** | Does the word name a concrete repo artifact / convention rather than a generic concept? Generic = 0; uniquely-this-repo = 3. |
| **Enforcement coupling** | Is there an automated check (ESLint, dep-cruiser, pre-commit, CI) that fails if violated? None = 0; multi-tool blocking = 3. |
| **Behavioral leverage** | Does knowing the word change *what action the assistant takes* (placement, command choice, refusal), not just how it phrases things? |
| **Cross-rule recurrence** | Referenced from how many rule files / skills? 1 = 0; 5+ = 3. |
| **Failure cost** | If the assistant ignores it, how expensive is the recovery (commit revert, file move, rule rewrite)? Trivial = 0; high = 3. |

A high score means the word, even on its own, points the assistant at a specific behavior backed by a specific check — which is the definition of effective priming. A word can be common in the corpus (high TF) yet score low if it doesn't change behavior; conversely, a rare word like `DOC_` scores very high because it gates a single specific action.

Tie-breaker: prefer **orthogonal coverage** — top picks should span architecture, placement, style, workflow, and governance rather than clustering in one axis.

## Top 10 (audit applied)

| # | Word | Spec | Enf | Lev | Recur | Cost | Total | Why it primes |
|---|------|-----:|----:|----:|------:|-----:|------:|---------------|
| 1 | **SSOT** | 3 | 1 | 3 | 3 | 3 | 13 | Meta-instruction: tells the assistant not to invent rules but look up the canonical source. Reframes the entire `.cursor/rules/` tree. |
| 2 | **boundaries** | 3 | 3 | 3 | 3 | 3 | 15 | Names the layer-import enforcement (`eslint-plugin-boundaries` + dep-cruiser). Triggers awareness of the `pages → components → hooks → services → utils → types` direction. |
| 3 | **whitelist** | 3 | 3 | 3 | 2 | 3 | 14 | Reframes file creation as "validate against `projectStructure.config.cjs` first." Without this word the assistant defaults to "create wherever feels right." |
| 4 | **path aliases** (`@/`) | 3 | 3 | 3 | 3 | 2 | 14 | One word eliminates an entire class of relative-import errors that would otherwise pass review locally and fail ESLint. |
| 5 | **features/** | 3 | 2 | 3 | 3 | 3 | 14 | The placement unit. Pairs with `shared/` to govern almost every "where does this go" decision. |
| 6 | **shared/** | 3 | 2 | 3 | 3 | 2 | 13 | The cross-feature counterpart to `features/`. Without it, generic utilities silently land in `components/common/` (wrong layer). |
| 7 | **CHANGELOG** | 2 | 3 | 3 | 3 | 3 | 14 | Primes the version-sync workflow: any user-facing change requires an entry, and the commit subject must mirror it. Skipping fails `/finish` and `pre-commit`. |
| 8 | **develop** (branch) | 3 | 2 | 3 | 2 | 3 | 13 | Triggers the "never develop on main" rule. One token prevents irreversible commits to a protected branch. |
| 9 | **protected files** | 3 | 1 | 3 | 2 | 3 | 12 | Tells the assistant to *stop and ask* before touching `.gitignore`, `projectStructure.config.cjs`, `.cursor/**`, husky hooks, etc. — the most common silent-overreach failure mode. |
| 10 | **complexity** | 2 | 3 | 2 | 2 | 2 | 11 | Names the enforced limits (cyclomatic ≤10, cognitive ≤15, ≤100 lines). Without it, generated code routinely fails ESLint complexity rules and `/check`. |

### Why these ten and not others

- **`projectStructure.config.cjs`** and **`dependency-cruiser`** are higher-specificity but their behavioral effect is already pulled in by **whitelist** and **boundaries** respectively — including them would double-count.
- **SSOT** beats individual rule names because it's the *meta-key* that unlocks the whole rules tree on demand.
- **DOC_** and **temp_** are extremely high-specificity but narrow — they govern one decision each. They sit at #11–#12.
- **Pre-commit** is implied by **CHANGELOG**, **boundaries**, **whitelist**, and **complexity** all having pre-commit enforcement; calling it out separately would be redundant in a top-10.
- **Strict mode** and **double quotes** are real rules but Prettier/`tsc` correct them automatically, so the priming value is low — the tool catches lapses cheaply.

## Verification

This document is the deliverable. To validate the choice:

1. Run a fresh assistant with only the top-10 words as a system prompt prefix and ask it to scaffold a new feature; check whether it (a) places files under `src/features/<name>/`, (b) uses `@/` imports, (c) avoids importing `components/` from `hooks/`, (d) updates `CHANGELOG.md`, (e) refuses to edit `projectStructure.config.cjs` without consent.
2. Compare against the same prompt with words 11–50 substituted in — the top-10 set should preserve more correct behaviors per word.
