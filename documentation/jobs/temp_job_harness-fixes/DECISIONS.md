# Decisions — harness-fixes

Job: `temp_job_harness-fixes`
Updated: 2026-08-13

Scope: structural harness follow-ups deferred from `temp_job_harness-skills` Phase 7 (D17 cap) plus the Model B / harness-skills branch divergence discovered during planning.

## Closed

| id | topic | status | choice | source | notes |
|----|-------|--------|--------|--------|-------|
| D1 | Branch strategy | closed | Branch `feature/harness-fixes` from `feature/harness-skills`; **merge `origin/develop`** before structural fixes | plan | `develop` is one commit ahead (`8d6da35` Model B). Harness-skills lacks `git-workflow.json`, `validate-git-workflow`, and mode-aware `git-workflow` rule body. Cherry-pick-only is fragile across ~38 overlapping files |
| D2 | Missing `PROJECT-STRUCTURE-VALIDATION.md` | closed | **Create** `documentation/PROJECT-STRUCTURE-VALIDATION.md` (lean user guide) | plan | Subdirectory path — no `DOC_` prefix required. Retargeting 5+ live refs (always-on rules + scripts + `review` skill) costs more than a short doc. Remove `ALLOWED_MISSING` band-aid in `validate-cursor-doc-references.js` once the file exists |
| D3 | D12 always-on restructure (2,044 lines) | closed | **Out of scope** — separate job (`harness/BACKLOG.md`) | plan | Advisory-only per harness-skills D12; this job fixes broken pointers and SSOT chain, not context budget |
| D4 | `.husky/pre-commit` vs `CHANGELOG.md` location | closed | **Non-issue** — close without edit | plan | Investigated: hook comment says `public/documentation/CHANGELOG.md`; root `CHANGELOG.md` is correct per `architecture/RULE.mdc`. Original deferred bullet was stale |
| D5 | `git-workflow.json` fate | closed | **Keep** AGENTS.md pointer; restore file + validator from develop during merge | plan | Dropping the mode gate would regress Model B onboarding completed in PR #50. File is the machine SSOT; rule § Mode-aware branch gate is behavior SSOT |
| D6 | PR #51 disposition | closed | **One integrated PR** from `feature/harness-fixes` supersedes PR #51; close #51 when opening the new PR | plan-review R3 | #51 is CONFLICTING with develop until Model B + `.mdc` migration reconcile on one branch |
| D7 | `architecture.md` allowlist | closed | **Retarget** live refs to root `ARCHITECTURE.md`; remove `architecture.md` from `ALLOWED_MISSING` | plan-review R6 | Root file exists; lowercase path is a case-contract bug, not a missing doc |

## Open

| id | topic | status | options briefly | blocked phase |
|----|-------|--------|-----------------|---------------|
| — | — | — | — | — |

## Log

- 2026-08-13 — D1–D5 closed during plan (investigation: harness-skills @ `34de46e` missing develop Model B commit; `PROJECT-STRUCTURE-VALIDATION.md` never in git history)
- 2026-08-13 — Six-lens plan review; findings folded into plan phases; D6–D7 closed
