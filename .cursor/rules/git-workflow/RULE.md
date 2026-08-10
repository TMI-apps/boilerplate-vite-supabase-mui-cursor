---
description: "Git branch model (Model A), PRs, and production promotion"
alwaysApply: false
---

# Git Workflow

Branch strategy, pull requests, and production promotion. **Semver, changelog, and commit format:** `.agents/skills/finish/SKILL.md` (do not duplicate here).

## Version Control Standards

**SSOT:** `.agents/skills/finish/SKILL.md` — semantic versioning, changelog gate (including no-bump types), commit format, and `package.json` / `CHANGELOG.md` sync when a bump is required.

**Note:** Configuration lives in `.env` only. Onboarding checklist: `src/config/app-tasks.json` (see `src/features/tasks/README.md`).

## Branch Strategy

### Project Branch Pattern (Model A — develop staging + ff-only promotion)

Project uses **two long-lived branches** with a strict one-way promotion rule:
- **`develop` branch:** Integration branch and stable staging deploy (Cloudflare preview). All daily work merges here via squash PR.
- **`main` branch:** Production only (protected). Updated **only** by the **Promote to production** workflow (`promote-to-production.yml`), which fast-forwards `main` to `develop`. Every push to `main` deploys production via Cloudflare Workers Builds.
- **Feature branches:** Short-lived `feature/*` (and `fix/*`) branches created **from `develop`** for all work, merged back via Pull Request to `develop`.

**Invariant:** `main` is always an ancestor of `develop`. Promotion only moves `main` forward; it never creates a commit on `main` that `develop` lacks.

**Workflow:**
- **Never commit directly to `main` or `develop`.** All changes land via a `feature/*` Pull Request to `develop`; rulesets enforce this.
- Start work from the latest `develop` (`git switch develop` + `git pull origin develop`), then `git switch -c feature/<name>`.
- Daily flow: `feature/*` → `develop` via squash Pull Request after the `test` check is green.
- **Release / production:** when staging on `develop` looks good, run **Promote to production** (`gh workflow run promote-to-production.yml` or Actions UI). This fast-forwards `main` to `develop` — no squash PR, no back-merge.
- **Forbidden:** squash PRs `develop` → `main`; any `main` → `develop` back-merge; direct pushes to `main` or `develop` (except the promote workflow on `main`).
- **Hotfixes:** `feature/*` or `fix/*` off `develop` → merge to `develop` → promote. Emergency direct-to-`main` remains the rare exception below.
- Per-branch Cloudflare preview URLs still work for `feature/*` PRs; `develop` is the **stable** staging URL.

### Branch Protection

**Critical Rule: Never Commit Directly to Main**

The AI must verify the current git branch before editing any code file. **Direct commits to `main` and `develop` are prohibited.** All work happens on `feature/*` branches and lands via Pull Request to `develop`.

**Protected Branch Merge Model (Current Repo Decision):**
- Require a Pull Request for every `develop` update (no direct-push flow).
- Merge method for `develop`: **Squash merge** (primary for `feature/*` PRs).
- `main` updates only via **Promote to production** workflow (fast-forward push using the built-in `GITHUB_TOKEN`; no PAT or bypass actor needed — see § Promote to production).
- Enable "Automatically delete head branches" so merged `feature/*` branches are cleaned up.

#### Verification Process

1. Check the current branch at the start of code-related conversations
2. If unsure, ask: "Which branch are you currently on?"
3. Proceed only after confirming the branch is NOT `main` or `develop` (for code changes)

#### Branch-Specific Rules

- Feature branches (`feature/*`, `fix/*`): All code changes allowed (created from `develop`).
- `develop`: **Direct code changes blocked.** Work on a feature branch and open a PR to `develop`.
- `main`: **Direct code changes blocked.** Production updates only via promote workflow. Emergency override only (see § Exceptions).
- Other branches: Ask user before proceeding.

#### When User is on Main or Develop Branch

If code changes are requested while on `main` or `develop`:

**Stop immediately.** Do not make any code changes. Display warning:
- You are on a protected long-lived branch (`main` or `develop`). **Never commit directly.**
- Create a feature branch first: `git switch develop` + `git pull origin develop`, then `git switch -c feature/<name>`
- Once switched, proceed with requested changes

Do not make code changes until on a feature branch.

### Exceptions

#### Safe to Edit on Any Branch

These files may be edited on any branch after user confirmation:
- Documentation files (`documentation/**/*.md`), including plan files (`documentation/jobs/**/DEVELOPMENT_PLAN.md`)
- Cursor rules (`.cursor/rules/**`)
- README files

App code (`src/**`, configs, migrations, etc.) still requires a `feature/*` branch per § Branch Strategy above.

#### Emergency Main Branch Changes (Rare Exception)

Only proceed with main branch code changes when ALL of the following are true:
1. User explicitly states "emergency fix on main"
2. User confirms with "yes, proceed on main"
3. User acknowledges the risk

Default: **Never commit directly to `main`.** When in doubt, create a `feature/*` branch.

#### Implementation Checklist

Before editing code files:
- [ ] Verify current branch (ask user if unsure)
- [ ] Confirm branch is a `feature/*` branch, OR user gave explicit override
- [ ] If on `main` or `develop`, show warning and wait for a feature-branch switch
- [ ] Proceed with changes only after confirmation

#### Integration with Workflow

**During Development:**
- Start of session: "Which branch are you working on?"
- Before first code edit: Verify branch is a `feature/*` branch, not `main` or `develop`
- Before merge: Remind that merging to `develop` updates staging; production requires promote workflow

**During Git Operations:**
- Before providing commit instructions: Confirm on a `feature/*` branch
- When user requests merge: Verify `feature/*` -> `develop` (squash)
- When user requests production release: Run or guide **Promote to production** workflow (not a squash PR)
- During changelog updates: Note which changes are user-facing

## Pull Requests

- Keep PRs focused and reasonably sized
- Include clear description of changes
- Link related issues or tickets
- Request reviews from appropriate team members
- Use PRs from `feature/*` -> `develop` for all work.
- **After push, when offering or creating a PR:** Always target **`develop`**. Prefer `gh pr create --base develop --head <feature-branch>`. **Never** paste GitHub's bare `…/pull/new/<branch>` URL without an explicit `base=develop` — that UI defaults to the repo default branch (`main` here) and risks a production-bound PR.
- **Create with `gh` (required pattern):**
  1. Confirm branch is pushed: `git push -u origin HEAD` if needed.
  2. Create: `gh pr create --base develop --head <feature-branch> --title "<type>: <short title>" --body "<markdown>"`.
  3. Verify base before sharing the URL: `gh pr view --json baseRefName,url` — **`baseRefName` must be `develop`**.
  4. On PowerShell, do **not** use bash `<<'EOF'` heredocs (they fail). Pass `--body` via a PowerShell here-string (`$body = @"…"@`) or a temp file.
- **PR body template** (keep this shape):

```markdown
## Summary
- <1–3 bullets: why / what landed>

## Test plan
- [ ] Confirm PR base is `develop` (not `main`)
- [ ] CI `test` green
- [ ] <scoped checks for this change>
```

- Title: conventional `type: Subject` (match the primary commit / changelog subject when versioned).
- Wait for the required `test` check to pass before merging.
- Ensure the PR branch is up to date with `develop` before merge.
- Use squash merge for `feature/*` -> `develop`.
- "Automatically delete head branches" cleans up merged feature branches; `main` and `develop` are never deleted (deletion-protected).

### Diagnosing "merge blocked" / "rule violation"

When a user reports a merge was blocked, do not assume the ruleset is broken. First inspect PR state:

- `gh pr view <N> --json mergeable,mergeStateStatus,statusCheckRollup`
- `mergeable: MERGEABLE` + `mergeStateStatus: BLOCKED` almost always means a **required status check is still `IN_PROGRESS` or missing** — wait with `gh pr checks <N> --watch`, then re-check.
- Only investigate deeper (stale branch, missing approval, signed-commits, etc.) once `statusCheckRollup` is fully green but state is still `BLOCKED`.

### Model A divergence prevention

The old broken model used squash `develop` → `main` plus mandatory `main` → `develop` back-merge, which caused perpetual PR conflicts. **Model A forbids both.** Production promotion is **fast-forward only** via `promote-to-production.yml`; `main` must stay an ancestor of `develop`.

If a `feature/*` PR shows `CONFLICTING`, the branch is behind `develop`: merge the latest `develop` into the feature branch (`git switch feature/<name>` → `git merge origin/develop`), resolve, push, then re-check.

If **Promote to production** fails with "main is not an ancestor of develop", someone merged to `main` outside the promote workflow — stop and reconcile with a maintainer before forcing history.

This repo enforces merge requirements via GitHub **Rulesets**, not classic branch protection:
- Classic endpoint `gh api repos/OWNER/REPO/branches/main/protection` returns `404 Branch not protected` — that is **not** evidence that `main` is unprotected.
- Use `gh api repos/OWNER/REPO/rules/branches/main` to list the active rules (required checks, PR requirements, deletion/non-fast-forward guards).

## Promote to production

**Workflow:** `.github/workflows/promote-to-production.yml` (`workflow_dispatch` only — **Promote to production** in Actions UI).

**Preconditions:**
- `main` is a strict ancestor of `develop` (fast-forward possible).
- `develop` is ahead of `main` (something to promote).
- Latest commit on `develop` has green combined status (`test` CI).

**Agent UX:** When the user says "promote to production", run `gh workflow run promote-to-production.yml` and watch the run (`gh run watch`).

**Why no PAT or bypass actor is needed:** `main`'s ruleset only enforces `deletion` + `non_fast_forward`. Those rules block force-pushes and deletion but **allow** an ordinary fast-forward push, so the workflow's built-in `GITHUB_TOKEN` (with `contents: write`) can promote. There is **no** PR-required or status-check rule on `main` — daily integration and CI happen on `develop`, and the workflow re-checks `develop`'s tip is green before pushing. This keeps fork onboarding zero-config: no PAT, no secret, no bypass list entry.

**Setup (one-time per repo):** none beyond the `main` ruleset (`deletion` + `non_fast_forward`) and the `develop` ruleset. Workflow → Settings → Actions → Workflow permissions must allow **Read and write** (GitHub default for most repos).

**Ruleset design (do not regress):**
- **Never** instruct users to add **GitHub Actions** to a ruleset bypass list — `github-actions[bot]` is not a selectable bypass actor; the REST API rejects it.
- **Never** require a fine-grained PAT (`PROMOTE_GH_TOKEN`) for fork onboarding — that adds setup friction boilerplate users should not need.
- **Preferred pattern:** `develop` carries PR + `test` + non-ff + deletion; `main` carries **only** `deletion` + `non_fast_forward` so the promote workflow's built-in `GITHUB_TOKEN` can fast-forward push. Alternative (heavier): custom GitHub App on bypass + `actions/create-github-app-token` — only when `main` must also require PRs.

**Failure modes:**
- `403` / `Changes must be made through a pull request` — `main`'s ruleset has a `pull_request` or `required_status_checks` rule that should not be there; reduce it to `deletion` + `non_fast_forward`.
- `main is not an ancestor of develop` — someone merged to `main` outside this workflow; do not squash-merge or back-merge; escalate.
- `develop and main are already at the same commit` — nothing to promote.

**One-time fork setup:** After forking, create `develop` from `main` (`git push origin main:develop`) and configure `develop` + `main` rulesets per onboarding (`start` skill).

**First promotion bootstrap:** GitHub only registers `workflow_dispatch` once the workflow file exists on the default branch (`main`). On a fresh fork, after the first Model A PR merges to `develop`, fast-forward `main` once locally (`git fetch origin && git checkout main && git merge --ff-only origin/develop && git push origin main`) to seed the workflow onto `main`. Subsequent releases use **Promote to production**.

## Commit and Push Workflow

**Automated Workflow:** Use `.agents/skills/finish/SKILL.md` and `.agents/skills/push/SKILL.md` as a split workflow (SSOT for semver, changelog, commit format, and push safety).

#### Agent-Executed Flow

1. **After completing changes**, the agent summarizes changes and asks: "Are you ready to commit these changes?"
2. **User responds** with explicit confirmation or denial
3. **Finish phase (`finish` command):** cleanup, changelog/version, `git add` + `git commit` after confirmation — never push
4. **Push phase (`push` command):** clean tree, existing commits only, no `git add`/`git commit`, push `feature/*` after confirmation; sync when behind remote
5. **General commit safety:** Never assume the user wants to commit; commit messages need a detailed body (see `finish` skill)

---

## Related Rules

**When modifying this rule, check these rules for consistency:**

- `workflow/RULE.md` — hub; code review and development process
- `agent-behavior/RULE.md` — protected files, user-test gate
- `platform/RULE.md` — PowerShell command rules for git/gh invocations

**Rules that reference this rule:**

- `cloud-functions/RULE.md` — branch model for Edge deploys
- `testing/RULE.md` — branch model for function testing
