# Adoption guide voice and naming

**Audience:** Agents and humans implementing the capability in a **target repository** (which may not be the repo where this file was authored).

---

## Rule: one home-repo name

Use `SOURCE_REPO_DISPLAY_NAME` from the skill config **at most once** in the adoption guide body — in the purpose block, e.g.:

```markdown
> **Reference implementation (<SOURCE_REPO_DISPLAY_NAME>):** …
```

After that, do **not** repeat the product or repo name. Use:

| Instead of repeating the repo name | Use |
|-----------------------------------|-----|
| “`<name>` path”, “in `<name>`”, “`<name>` SSOT” | **home repository**, **source repository**, **SSOT runbook (home repo)** |
| “`<name>` integration” | **example wiring (home repo)** |
| “`<name>` → your repo” | **Example (home repo) → your repo** |

The guide explains a **portable learning**. The home repo is one instance, not the destination.

---

## Section 3 — illustrative only

- Title: **`## 3. Illustrative wiring (home repository only)`** — not `Reference implementation (<name>)`.
- Open with a blockquote:

```markdown
> **Do not copy paths or URLs from this section into your repository.**  
> They show how one team wired the learning. Your layout, port, auth host, and folders will differ.
```

- Table column: **`Example path (home repo)`** — not a product-specific path column.
- Lifecycle table: **`Example integration (home repo)`** — not a product-specific integration column.

---

## Section 4 — portable substance

- **No** home-repo name, **no** repo-specific paths (except generic placeholders: port **N**, `DOC_*`).
- IdP/stack hints stay generic ("Supabase-style", "Vite dev server") unless essential.

---

## Section 5 — teaching example

- Title: **`## 5. Teaching example (one instance — home repository)`**
- Open with:

```markdown
> **Illustrative only.** This story is not a spec for your repo. Reuse the *problem → verification → layers* pattern; do not copy file paths, job slugs, or URLs verbatim.
```

---

## Section 7.4 — term mapping

- Title: **`### 7.4 Illustrative mapping (home repo → your repo)`**
- Subtitle: left column is **examples from one implementation**, not required names.

---

## Section 9 — summary

- No home-repo name.
- Say: "Full procedure remains in the **home-repo SSOT**" with a link only if the guide lives in that repo; otherwise "see the SSOT path named in §3."

---

## Quality gate (count)

Before finishing, search the guide body (below the purpose block) for `SOURCE_REPO_DISPLAY_NAME` / configured repo name. **Zero matches** required.
