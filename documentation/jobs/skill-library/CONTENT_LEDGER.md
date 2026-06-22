# Skill library content ledger (Phase 0 ground truth)

**Captured:** 2026-06-20 before any corpus edits  
**Purpose:** No-loss pass baseline — every `id` must classify PRESERVED | MOVED | DROPPED | MISSING after edits

## Unit counts by skill

| skill | file | unit count (approx) |
|-------|------|---------------------|
| router | `.agents/skills/router/SKILL.md` | 33 |
| router (ref) | `router/references/dev-cycle-matrix.md` | 4 |
| improve-skill-library | `.agents/skills/improve-skill-library/SKILL.md` | 14 |
| improve-skill-library (ref) | `references/subagent-briefs.md` | 8 |
| plan | `.agents/skills/plan/SKILL.md` | 22 |
| implement | `.agents/skills/implement/SKILL.md` | 12 |
| validate | `.agents/skills/validate/SKILL.md` | 14 |
| check | `.agents/skills/check/SKILL.md` | 10 |
| finish | `.agents/skills/finish/SKILL.md` | 18 |
| push | `.agents/skills/push/SKILL.md` | 8 |
| quick-piv | `.agents/skills/quick-piv/SKILL.md` | 10 |
| prime | `.agents/skills/prime/SKILL.md` | 9 |
| start | `.agents/skills/start/SKILL.md` | 16 |
| feature | `.agents/skills/feature/SKILL.md` | 20 |
| debug | `.agents/skills/debug/SKILL.md` | 14 |
| grill-me | `.agents/skills/grill-me/SKILL.md` | 9 |
| challenge | `.agents/skills/challenge/SKILL.md` | 12 |
| consolidate | `.agents/skills/consolidate/SKILL.md` | 14 |
| learn | `.agents/skills/learn/SKILL.md` | 12 |
| optimize2 | `.agents/skills/optimize2/SKILL.md` | 20+ |
| pattern-review | `.agents/skills/pattern-review/SKILL.md` | 10 |
| review-dev-plan | `.agents/skills/review-dev-plan/SKILL.md` | 10 |
| write-adoption-guide | `.agents/skills/write-adoption-guide/SKILL.md` | 12 |
| review | `.agents/skills/review/SKILL.md` | 14 |
| rule-quality | `.agents/skills/rule-quality/SKILL.md` | 8 |
| airtable-inspect | `.agents/skills/airtable-inspect/SKILL.md` | 10 |
| **vercel-react-best-practices** | `.agents/skills/vercel-react-best-practices/SKILL.md` | **90** (see below) |

Full YAML for all skills was produced by Phase 0 subagent; this file records **stable ids** for the Vercel skill (focus) and index for others.

---

## vercel-react-best-practices — atomic units (full)

```yaml
skill: vercel-react-best-practices
file: .agents/skills/vercel-react-best-practices/SKILL.md
units:
  - id: vercel-react-best-practices.t1
    kind: trigger
    text: "Writing, reviewing, or refactoring React/Next.js code; components, pages, data fetching, bundle optimization, performance"
  - id: vercel-react-best-practices.i1
    kind: instruction
    text: "Comprehensive guide: 70 rules across 8 categories prioritized by impact"
  - id: vercel-react-best-practices.c1
    kind: table
    text: "When to Apply: new components/pages, data fetching, performance review, refactor, bundle/load optimization"
  - id: vercel-react-best-practices.c2
    kind: table
    text: "Rule Categories by Priority: async- CRITICAL | bundle- CRITICAL | server- HIGH | client- MEDIUM-HIGH | rerender- MEDIUM | rendering- MEDIUM | js- LOW-MEDIUM | advanced- LOW"
  - id: vercel-react-best-practices.c3
    kind: table
    text: "Quick Reference §1 Eliminating Waterfalls (6 rules)"
  - id: vercel-react-best-practices.c4
    kind: table
    text: "Quick Reference §2 Bundle (6 rules)"
  - id: vercel-react-best-practices.c5
    kind: table
    text: "Quick Reference §3 Server (10 rules)"
  - id: vercel-react-best-practices.c6
    kind: table
    text: "Quick Reference §4 Client (4 rules)"
  - id: vercel-react-best-practices.c7
    kind: table
    text: "Quick Reference §5 Rerender (15 rules)"
  - id: vercel-react-best-practices.c8
    kind: table
    text: "Quick Reference §6 Rendering (11 rules)"
  - id: vercel-react-best-practices.c9
    kind: table
    text: "Quick Reference §7 JS (14 rules)"
  - id: vercel-react-best-practices.c10
    kind: table
    text: "Quick Reference §8 Advanced (4 rules)"
  - id: vercel-react-best-practices.i2
    kind: instruction
    text: "How to Use: read individual rule files under rules/"
  - id: vercel-react-best-practices.i3
    kind: instruction
    text: "Each rule file: why, incorrect, correct, context"
  - id: vercel-react-best-practices.l1
    kind: link
    text: "-> AGENTS.md (full compiled document)"
  # Rule ids vercel-react-best-practices.r.<rule-slug> for all 70 rules — preserved in rules/*.md + Quick Reference bullets
```

**Note:** 70 rule one-liners in Quick Reference (`vercel-react-best-practices.r.*`) are duplicated in `rules/<slug>.md`; SSOT for rule bodies is `rules/*.md`; `AGENTS.md` is compiled output.
