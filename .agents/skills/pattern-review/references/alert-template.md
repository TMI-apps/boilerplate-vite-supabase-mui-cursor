# Pattern risk alert template

Use when pattern review finds **material** divergence from common industry practice. Summarize the same substance in plan § **Pattern & precedent**.

```markdown
### Pattern risk — review before implementing

**Capability:** <one line>

**Precedents considered:** <1–3 familiar products or patterns>

| Aspect (agent-chosen) | This design | Common practice | Risk if we proceed |
|-----------------------|-------------|-----------------|-------------------|
| … | … | … | … |

**Verdict:** `Aligns with precedent` | `Acceptable product-specific` | `Non-standard — waiver recommended`

**Options (if non-standard):**
- **A** — Align with common practice: …
- **B** — Alternative mainstream approach: …
- **C** — Proceed as proposed because …

**Needs from you:** pick A/B/C or waive with one-line reason.
```

Do **not** add new structural coupling in application code until the owner decides (plan **Decisions made** or explicit chat waiver).
