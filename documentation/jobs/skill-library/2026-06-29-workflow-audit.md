# Skill library audit — workflow / Model A (2026-06-29)

Scope: branch strategy, promote workflow, ruleset onboarding. Triggered after Model A implementation + PAT/bypass correction.

## Registry (workflow-touching skills)

| Skill | Primary outcome | Lifecycle | Mutates? | Inputs | Outputs | Owns |
|-------|-----------------|-----------|----------|--------|---------|------|
| `start` | Human fork/template onboarding | Onboard | No | Empty vision, backlog | Verified dev env | Click-path checklist; links SSOT |
| `feature` | Product/requirements artifact | Plan | No | Feature request | Spec + decision stops | Phase gates; branch check |
| `plan` | `DEVELOPMENT_PLAN.md` | Plan | No | Scope | Execution plan | Plan template compliance |
| `implement` | Phase execution | Build | Yes | Plan file | Code + plan updates | Phase gates |
| `validate` | Rule-shaped audit | Verify | Optional | Impl/plan | Findings report | Depth selection |
| `finish` | Local commit + version | Land | Yes | Clean impl | Local commit | Changelog/version SSOT |
| `push` | Remote sync only | Land | No | Existing commits | Pushed branch | Push safety flow |
| `router` | Pick next skill | Route | No | User intent | Invoked skill | Situation → skill table |

**Branch/release SSOT owner:** `.cursor/rules/workflow/RULE.md` (not any skill).

## Invariants check

| Invariant | Status |
|-----------|--------|
| Single SSOT for branch model | ✅ `workflow/RULE.md` |
| Promote not in `finish` | ✅ `finish` defers to workflow RULE |
| Router lists promote once | ✅ Row in situation table |
| No PAT/trunk stale refs in skills | ✅ After this audit |
| `start` duplicates ruleset prose | ⚠️ Summary bullets OK; now links SSOT |

## Lens findings

### SSOT / duplication (must-fix: applied)

| Finding | Classification | Action |
|---------|----------------|--------|
| `cloud-functions/RULE.md` + `testing/RULE.md` said "merge develop → main" | Outdated | **Applied** → Promote to production |
| `push/SKILL.md` "rulesets block main" | Overly broad | **Applied** → except promote/bootstrap |
| Plan file (external) said GitHub Actions bypass | Misleading | Not edited (user-owned plan file) |
| `workflow/RULE.md` lacked anti-PAT/anti-Actions-bypass guard | Gap | **Applied** § Ruleset design |

### Conflicts (none blocking)

| Pair | Issue | Resolution |
|------|-------|------------|
| `finish` vs `router` promote | Both mention promote | OK — finish says "not finish"; router routes to workflow |
| `start` vs `workflow/RULE` rulesets | Duplicate bullets | Narrowed — start links SSOT |

### Composition / handoffs

```
start → feature/plan → implement → validate → finish → push → (PR develop) → promote workflow → main
```

- **Orphan:** none
- **Dead end:** promote has no skill (correct — one-shot `gh workflow run` in workflow RULE)
- **Bootstrap gap:** first ff to `main` documented in workflow RULE; not duplicated in `start` (acceptable)

### Optional nice-to-have (gate — not applied)

| # | Finding | Proposed fix | Risk |
|---|---------|--------------|------|
| 1 | `finish` could link `gh workflow run` one-liner | Add cross-link only | Low |
| 2 | `plan` checklist still says "not developing on main" only | Add "or develop" | Low |
| 3 | Full 33-skill library audit | Run `/improve-skill-library` without workflow scope | Medium effort |

## No-loss pass (this edit batch)

| Unit | Class |
|------|-------|
| workflow RULE anti-regression bullets | PRESERVED + added |
| cloud-functions release wording | MOVED concept → promote terminology |
| testing release gate heading | MOVED concept → promote terminology |
| push main exception | NARROWED |
| start SSOT link | ADDED (no deletion) |

**MISSING:** 0

## Current repo workflow health (live)

| Check | State |
|-------|-------|
| `origin/main` == `origin/develop` | ✅ `9c3a0ff` |
| `main` ruleset | ✅ `deletion`, `non_fast_forward` only |
| `develop` ruleset | ✅ PR + `test` + `non_fast_forward` + `deletion` |
| Workflows registered | ✅ CI + Promote to production |
| Promote e2e with `develop` ahead | ⏳ Not tested since branches aligned |
