# Foreign content detection

Raised by **Lens 7 (foreign / orphan)**. Hand off intake to [`update-harness`](../../update-harness/SKILL.md).

## Definition

Content is **foreign** when **all** are true:

1. **Unreferenced** — not reachable from `documentation/jobs/harness/entry-points.yaml` roots via link-walk (`harness_scan` `orphanCandidates`), AND
2. **At least one of:**
   - Broken internal refs to harness paths
   - No provenance (no router row, no layers doc mention, no inbound link from editable corpus)
   - Appears copy-pasted from external template (vendor header, foreign license block, mismatched stack)

## Not foreign

- Archived job docs under `documentation/jobs/**` (historical; out of live sweep)
- User/plugin skills (`~/.cursor/`, plugins) — reference-only per scope table
- Deliberately quarantined inbox drop before `update-harness` runs

## Issue table fields

`tier | domain | where | issue | why | resolution | SSOT owner`

Suggested resolutions:

| Signal | Resolution |
|--------|------------|
| Valuable external skill | `update-harness` ingest + disposition report |
| Orphan with no provenance | Remove or merge into owner after user confirm |
| Broken refs only | Fix links (blocking if router/spine) |
| Duplicate of in-repo skill | Supersede; link to owner |

## Escalation

Structural SSOT move or >handful of files → stop and run [`plan`](../../plan/SKILL.md).
