# <Topic title> — cross-repo adoption guide

> **Reference implementation (<SOURCE_REPO_DISPLAY_NAME>):** Explain **why** the home repository introduced <capability>, **what** to add in **your** repository, and **how** to wire it. Paths and URLs in §3 are **illustrative** — adapt everything to your stack.  
> **SSOT runbook / procedure (home repo):** `<relative link — do not duplicate body>`  
> **Layer model (if applicable):** `<workflow-layers doc + anchor>`

---

## What it is / what it is not

| **It is** | **It is not** |
|-----------|----------------|
| … | … |

**One line:** *<elevator pitch for adopters in any repo>*

---

## 1. Problem this addresses

<Repo-agnostic symptoms and process failure. Optional one-line instance; no home-repo name.>

---

## 2. What to introduce in a repository

<Generic properties and artifact names — no home-repo paths.>

### 2.1 Artifacts to create (generic names)

| Artifact | Contents |
|----------|----------|
| … | … |

### 2.3 Boundaries

| Use this capability for | Use something else for |
|-------------------------|-------------------------|
| … | … |

---

## 3. Illustrative wiring (home repository only)

> **Do not copy paths or URLs from this section into your repository.**  
> They show how one team wired the learning. Your layout, ports, auth hosts, and folders will differ.

### 3.1 Example file map

| Role | Example path (home repo) |
|------|--------------------------|
| Procedure (SSOT) | … |
| … | … |

### 3.2 Example integration (home repo)

| Stage | Example integration (home repo) |
|-------|----------------------------------|
| … | … |

**Principle:** one SSOT; other layers **link** — no duplicate checklists.

---

## 4. Portable substance

<Copyable ideas only — **no** home-repo name, **no** home-repo paths. Link to SSOT for full procedure.>

---

## 5. Teaching example (one instance — home repository)

> **Illustrative only.** Not a spec for your repo. Reuse the *problem → verification → layers* pattern; do not copy paths, slugs, or URLs verbatim.

<Short concrete story from home repo.>

---

## 6. Workflow (human and agent)

<Optional mermaid; repo-agnostic labels.>

---

## 7. How to adopt in another repository

### 7.1 Step-by-step

| Step | Action |
|------|--------|
| 1 | … |

### 7.2 Minimum vs recommended

| Level | You get |
|-------|---------|
| Minimum (humans) | … |
| Recommended (agents) | … |

### 7.3 Target repo discovery checklist

| Question | If missing |
|----------|------------|
| … | … |

### 7.4 Illustrative mapping (home repo → your repo)

*Left column: examples from one implementation — not required names.*

| Example (home repo) | Your equivalent |
|---------------------|-----------------|
| … | … |

### 7.5 Adoption anti-patterns

- Do not copy §3 paths verbatim into unrelated repos.
- …

---

## 8. Edge cases (optional)

---

## 9. Summary

<One paragraph: portable layers + idea; full procedure stays in home-repo SSOT — no repeat of home-repo product name.>
