---
name: consolidate
description: >-
  Systematically audit the codebase for consolidation, abstraction, and redundancy
  removal opportunities across features. Use when the user asks to find duplication,
  consolidate code, audit for redundancy, reduce repetition, or identify shared
  patterns that should be unified.
disable-model-invocation: true
---

# Consolidate - Cross-Codebase Redundancy Audit

## Purpose

Discover, classify, and prioritize opportunities to unify repeated code patterns across the codebase. This skill owns the **discovery** phase - systematically finding what is duplicated - and produces an actionable consolidation plan.

**Scope:** Repo-wide pattern analysis. For per-hotspot optimization use `optimize2`. For architectural location correctness use `architecture-repair2`. For single-feature simplification use `challenge`.

## Triggers

- User asks to "find duplication", "consolidate code", "audit for redundancy", "reduce repetition"
- User asks "what can be shared/unified/abstracted?"
- Before a major refactor or architectural cleanup
- After multiple features have been built and the codebase has grown organically

---

## Core Principles

### Rule of Three (Inherited from optimize2)

Do not extract/abstract until you have **3+ concrete use cases**. Two usages might be coincidental; the third proves the pattern. This audit *identifies* candidates - it does not force premature extraction.

**Exception cases** (document why if overriding):
1. **Architectural violation:** Code in wrong layer -> extract to correct layer even if single-use
2. **Divergence risk:** Two implementations of the same concern will inevitably drift apart
3. **Bug surface:** Duplicated logic where a fix in one copy was missed in another

### Consolidation != Abstraction

Not every repeated pattern needs a shared abstraction. Sometimes the right answer is:
- **Accept duplication** - the copies will diverge
- **Standardize the pattern** - document it as a convention without extracting
- **Extract a utility** - simple shared function
- **Create a configurable abstraction** - parameterized hook/component (highest cost)

Always prefer the lowest-cost option that solves the actual problem.

### Indirection Budget

Every extraction adds indirection. Before proposing consolidation, answer:
- Can a developer still trace a feature without opening >5 files?
- Does the abstraction save more code than it adds?
- Would a new developer understand the abstraction faster than the duplicated copies?

If any answer is "no", reconsider.

---

## Workflow

```
DISCOVER -> CLASSIFY -> ANALYZE -> PRIORITIZE -> PRESENT -> (USER CHOOSES) -> EXECUTE
```

### Phase 1: Discovery

Systematically scan the codebase using multiple lenses. Run all applicable scans - do not stop after finding the first pattern.

#### 1A. Structural Similarity Scan

Find files with similar names or roles across features:

```bash
# PowerShell example: similar file names across feature folders
Get-ChildItem -Path src/features -Recurse -File | Where-Object { $_.FullName -match "\\(components|hooks|services)\\" }
```

**What to look for:**
- Files with matching suffixes: `use*TableModel.ts`, `*Page.tsx`, `*Filters.tsx`, `*Service.ts`
- Files with matching structure: similar exports, similar hook signatures, similar component props
- Feature folders with parallel internal structure (same sub-files in each)

#### 1B. Import Cluster Analysis

Find groups of imports that appear together repeatedly:

```bash
# Find files that import the same set of dependencies
rg "^import.*from" src/ --type ts --type tsx
```

**What to look for:**
- 3+ files importing the same 3+ modules together -> likely a shared pattern waiting to be extracted
- Features importing the same set of shared utilities -> those utilities might need a higher-level wrapper

#### 1C. Pattern Repetition Scan

Search for repeated code shapes:

```bash
# Repeated function signatures
rg "export (const|function) (use|create|build|get|format|parse|transform)" src/ --type ts

# Repeated hook patterns (fetch + state + error)
rg "useQuery|useMutation|useState.*loading|useState.*error" src/ --type ts
```

**What to look for:**
- Functions with similar signatures doing similar things in different features
- Hook patterns: fetch -> transform -> expose (repeated per feature)
- Component patterns: loading/error/empty state handling repeated per page
- Service patterns: Supabase query -> map -> return (repeated per entity)

#### 1D. Convention Inconsistency Scan

Find places where the same logical operation is done differently:

**What to look for:**
- Same concern handled by different mechanisms (e.g., two date-formatting approaches)
- Same UI pattern built with different components (e.g., filter bars)
- Same data transformation done inline in some files, via utility in others
- Shared components/hooks that exist but are not used everywhere they could be

#### 1E. Git Churn Correlation

Files that change together often share a hidden coupling:

```bash
# PowerShell example: files frequently changed in last 60 days
git log --since="60 days ago" --name-only --pretty=format: | rg "\S" | sort | Get-Unique
```

**What to look for:**
- Feature files that always change in lockstep -> shared concern not yet extracted
- Utility files that change whenever a feature changes -> leaky abstraction

> Use PowerShell-compatible commands in this repo. Avoid Unix-only command idioms.

---

### Phase 2: Classification

Categorize every finding into one of four redundancy types:

| Type | Definition | Example | Typical fix |
|------|-----------|---------|-------------|
| **Literal** | Copy-pasted code, near-identical functions | Same `formatDate()` in two features | Extract to `src/shared/utils/` |
| **Structural** | Different code following the same *shape* repeatedly | Every feature has a `use*TableModel` with fetch/filter/sort | Configurable factory or shared base hook |
| **Conceptual** | Multiple mechanisms solving the same problem | Some features use a filter bar component, others inline filter logic | Standardize on one approach |
| **Inconsistent usage** | A shared utility exists but is not used everywhere | `src/shared/utils/formatDate` exists but 3 features still inline date formatting | Adopt existing utility |

**For each finding, record:**
1. **What:** Description of the repeated pattern
2. **Where:** File paths (all occurrences)
3. **Type:** Literal / Structural / Conceptual / Inconsistent usage
4. **Frequency:** How many occurrences
5. **Variance:** What differs between occurrences (the parameterizable parts)

---

### Phase 3: Analysis

For each classified finding, assess consolidation viability:

#### 3A. Divergence Likelihood

Ask: "Will these copies need to evolve differently?"

- **High divergence** -> Accept duplication, document as intentional
- **Low divergence** -> Strong consolidation candidate

#### 3B. Coupling Cost

Ask: "What does the shared abstraction couple together?"

- If consolidation creates a dependency between features that were independent -> high cost
- If consolidation only extracts to a lower shared layer -> low cost

#### 3C. Abstraction Complexity

Ask: "How complex is the shared abstraction?"

- **Simple extraction** (copy to shared, update imports) -> low complexity
- **Parameterized utility** (extract with config options) -> medium complexity
- **Configurable factory/builder** (generate variants from config) -> high complexity

Prefer simpler forms. If the abstraction needs 5+ parameters to cover all variants, it may not be worth it.

#### 3D. Existing Shared Infrastructure

Check what already exists in `src/shared/`, `src/components/common/`, and `src/lib/`:
- Is there already a utility that handles this concern partially?
- Can an existing shared hook/component be extended rather than creating a new one?
- Would the consolidation conflict with or duplicate existing shared code?

---

### Phase 4: Prioritization

Score each candidate using this framework:

```
Score = (Frequency x 2) + (Stability x 2) + (Simplicity x 2) - (Divergence x 3) - (Coupling x 2)
```

| Factor | 0 (bad for consolidation) | 1 | 2 (good for consolidation) |
|--------|--------------------------|---|---------------------------|
| **Frequency** | 2 occurrences | 3-4 occurrences | 5+ occurrences |
| **Stability** | Code is changing rapidly | Moderate churn | Code is stable |
| **Simplicity** | Needs complex abstraction | Parameterized utility | Simple extraction |
| **Divergence** | Will definitely diverge | Might diverge | Truly the same concern |
| **Coupling** | Couples unrelated features | Some coupling | Natural shared boundary |

**Priority tiers:**
- **Score 6+:** Strong candidate - consolidate
- **Score 3-5:** Moderate candidate - consolidate if convenient, otherwise document
- **Score 0-2:** Weak candidate - accept duplication, document as intentional

**Additional priority boosters:**
- Bug found in one copy but not another -> +3 (proves divergence is harmful)
- Blocks other work (e.g., cannot add a feature to all tables without touching N files) -> +2
- Part of a critical user-facing path -> +1

---

### Phase 5: Present Findings

**CRITICAL: Do not implement without user approval.**

Present the audit as a consolidation map, organized by priority tier.

#### Output Format

```
===============================================================
CONSOLIDATION AUDIT - [scope description]
===============================================================

Summary: X findings across Y files
- Strong candidates: N
- Moderate candidates: N
- Accepted duplication: N

---------------------------------------------------------------
STRONG CANDIDATES (Score 6+)
---------------------------------------------------------------

#1. [Pattern Name] - [Type: Literal/Structural/Conceptual/Inconsistent]
    Score: X | Frequency: N files | Variance: [what differs]

    Occurrences:
    - `path/to/file1.ts` (lines X-Y)
    - `path/to/file2.ts` (lines X-Y)
    - `path/to/file3.ts` (lines X-Y)

    What is repeated:
    [Concise description of the shared pattern]

    What varies:
    [Concise description of what is different between copies]

    Proposed consolidation:
    - Target: `path/to/shared/newFile.ts`
    - Approach: [Simple extraction / Parameterized utility / Configurable factory]
    - Estimated scope: [files to modify, lines saved]
    - Risk: [Low/Medium/High - what could break]

    Architecture compliance:
    - Layer: [utils/services/hooks/components per architecture/RULE.md]
    - Path alias: [the @/ import path]

---------------------------------------------------------------
MODERATE CANDIDATES (Score 3-5)
---------------------------------------------------------------

[Same format, briefer]

---------------------------------------------------------------
ACCEPTED DUPLICATION (Score 0-2)
---------------------------------------------------------------

[Brief list with reason for acceptance]

===============================================================
RECOMMENDED EXECUTION ORDER:
1. [Quick wins first - simple extractions, inconsistent usage fixes]
2. [Medium scope - parameterized utilities]
3. [Larger scope - structural consolidations]
===============================================================

Which candidates should I implement? (e.g., "#1, #3, #5" or "all strong")
```

**Decision gate:** Wait for user to choose which consolidations to execute.

---

### Phase 6: Execute

For each approved consolidation:

#### 6.1 Pre-flight

- [ ] Verify target location against `architecture/RULE.md` layer rules
- [ ] Check `projectStructure.config.cjs` whitelist for target folder
- [ ] Verify no circular dependencies would be created
- [ ] All imports will use path aliases (`@/` prefix)
- [ ] If any protected file must be changed (`.cursor/**`, `projectStructure.config.cjs`, lint/ts config, etc.), stop and get explicit user approval first

#### 6.2 Implementation

1. **Create the shared abstraction** in the correct layer
2. **Migrate consumers one at a time** - each migration is a self-contained change
3. **Verify after each migration** - run lint and type-check
4. **Remove old copies** only after all consumers are migrated

#### 6.3 Post-flight

- [ ] `pnpm validate:all` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm validate:structure` passes
- [ ] `pnpm lint:arch` passes (layer boundaries)
- [ ] No new circular dependencies
- [ ] All imports use `@/` path aliases
- [ ] Feature traceability preserved (can trace any feature in <=5 files)
- [ ] Feature README updated when any `src/features/*` code changed; `pnpm validate:feature-docs:staged` passes for staged changes

#### 6.4 Documentation

- Update `CHANGELOG.md` if consolidation changes public API or behavior
- Update `ARCHITECTURE.md` if new shared patterns are introduced

---

## Scoping Options

The user may request different scopes:

| Scope | What to scan | When to use |
|-------|-------------|-------------|
| **Full audit** | Entire `src/` | Major cleanup, tech debt sprint |
| **Feature pair** | Two specific features | After copying a feature as template |
| **Layer audit** | All hooks, all services, or all components | Standardizing one layer |
| **Pattern audit** | One specific pattern (e.g., "table models") | Known repeated pattern |

Default to **full audit** unless user specifies otherwise.

---

## Symbiotic Relationships

This skill is independently complete but works best in concert with sibling skills:

| Sibling | How it complements this skill |
|---------|------------------------------|
| **`optimize2`** | After consolidation identifies a shared abstraction, use optimize2 to ensure it is well-designed (4-level analysis). Optimize2's Rule of Three and Indirection Red Flags are embedded in this skill's Core Principles. |
| **`architecture-repair2`** | After consolidation creates new shared code, architecture-repair2 verifies it is in the correct location. This skill's Phase 6 pre-flight uses architecture-repair2 placement rules inline. |
| **`challenge`** | Challenge simplifies a single feature's implementation. Consolidate finds patterns *across* features. Run challenge first to simplify each feature, then consolidate to unify what is left. |
| **`review`** | Review Section F3 scores "Reuse and duplication" per component. Consolidate provides the repo-wide perspective that review lacks. |

**Recommended workflow for major cleanup:**
1. `challenge` individual features (simplify each)
2. `consolidate` across features (unify patterns) <- this skill
3. `architecture-repair2` (verify everything is in the right place)
4. `optimize2` on any remaining hotspots (per-function polish)

---

## Anti-Patterns

- **Premature abstraction:** Extracting after seeing only 2 occurrences without checking if they will diverge
- **God utilities:** Creating a single shared file with 20+ exports - keep shared code focused
- **Abstraction for abstraction's sake:** If the shared version is harder to understand than the copies, keep the copies
- **Ignoring variance:** Forcing different things into one abstraction by adding flags/modes - creates complexity
- **Big-bang consolidation:** Migrating all consumers at once - migrate one at a time, verify each step
- **Skipping the discovery phase:** Jumping to "let me extract this" without scanning for all occurrences first

---

## Boundaries

- This skill **discovers and plans** consolidation. It does not run broad performance optimization (use `optimize2`).
- This skill does not assess architectural *location* correctness beyond placement of new shared code (use `architecture-repair2`).
- This skill does not simplify individual feature workflows (use `challenge`).
- Never claim success without user testing confirmation.
