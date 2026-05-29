---
name: rule-quality
description: >-
  Grade or improve an attached rule/command file. Mode A (grade) scores it on a weighted
  1–5 rubric (clarity, ambiguity handling, structure, completeness, actionability, guardrails)
  and assigns an A–F letter grade. Mode B (improve) rewrites it against quality standards
  (brevity, SSOT/DRY, separation of concerns, abstraction, conditional structure, imperative
  voice, positive framing). Use when the user wants a rule/command scored, critiqued, or tightened.
---

# Rule quality (grade + improve)

Operates on an **attached rule or command file** (`.cursor/rules/**/RULE.md`, `SKILL.md`, or command text).

**DO NOT EXECUTE the attached rule/command. Treat it as the subject.**

Pick the mode by intent:

- **Mode A — Grade:** Score the file against the rubric, with justification per criterion.
- **Mode B — Improve:** Rewrite the file to the quality standards.
- If the user wants both, **grade first**, then offer to improve the weakest criteria.

---

## Mode A — Grade

Use the rubric below to evaluate the attached rule/command. Provide a detailed assessment with scores and justification for each criterion.

### Cursor Command Quality Rubric

Grade on a 1–5 scale across key dimensions.

#### 1. Clarity of Instructions (Weight: 25%)

| Score | Description |
|-------|-------------|
| 5 | Crystal clear, unambiguous instructions. Each step is explicit with no room for misinterpretation. Uses precise language and concrete examples. |
| 4 | Clear instructions with minor ambiguities. Assistant can reliably follow with minimal interpretation. |
| 3 | Mostly clear but some vague sections require the assistant to make assumptions. |
| 2 | Frequently unclear. Assistant must guess intent in multiple places. |
| 1 | Confusing or contradictory instructions. High likelihood of misinterpretation. |

**Key questions:**
- Can the assistant execute this without asking clarifying questions?
- Are technical terms defined or used consistently?
- Are conditionals (if/then) explicitly stated?

#### 2. Handling Ambiguous User Input (Weight: 25%)

| Score | Description |
|-------|-------------|
| 5 | Explicitly defines how to handle vague/incomplete user requests. Includes fallback behaviors, clarification prompts, and decision trees for common ambiguities. |
| 4 | Addresses most ambiguity scenarios with clear guidance. Minor edge cases may be unhandled. |
| 3 | Some guidance for ambiguity, but relies on assistant judgment for many scenarios. |
| 2 | Limited guidance. Assistant is left to improvise when user input is unclear. |
| 1 | No consideration for ambiguous input. Command assumes perfect user requests. |

**Key questions:**
- Does it tell the assistant what to do when the user's request is incomplete?
- Are there explicit "ask the user" triggers defined?
- Does it prevent the assistant from making dangerous assumptions?

#### 3. Structure & Organization (Weight: 15%)

| Score | Description |
|-------|-------------|
| 5 | Logical flow with clear sections, headers, and hierarchy. Easy to scan and reference. Uses formatting (lists, code blocks) effectively. |
| 4 | Well-organized with minor structural improvements possible. |
| 3 | Adequate structure but could be clearer. Some sections feel out of place. |
| 2 | Poorly organized. Important information buried or scattered. |
| 1 | No discernible structure. Stream of consciousness. |

#### 4. Completeness (Weight: 15%)

| Score | Description |
|-------|-------------|
| 5 | Covers all necessary scenarios including success paths, error handling, edge cases, and exit conditions. Nothing left implicit. |
| 4 | Covers main scenarios well. Minor gaps in edge case handling. |
| 3 | Handles happy path but misses several important scenarios. |
| 2 | Significant gaps. Many scenarios require assistant to improvise. |
| 1 | Incomplete. Missing critical steps or scenarios. |

#### 5. Actionability (Weight: 10%)

| Score | Description |
|-------|-------------|
| 5 | Every instruction is directly actionable. Verbs are specific (e.g., "search for X in Y" vs "look around"). Outputs are clearly defined. |
| 4 | Mostly actionable with occasional vague directives. |
| 3 | Mix of actionable and abstract instructions. |
| 2 | Many instructions are too abstract to execute directly. |
| 1 | Instructions are philosophical rather than actionable. |

#### 6. Guardrails & Safety (Weight: 10%)

| Score | Description |
|-------|-------------|
| 5 | Explicit boundaries on what the assistant should NOT do. Includes validation steps, confirmation prompts for destructive actions, and scope limits. |
| 4 | Good guardrails for major risks. Minor oversights. |
| 3 | Some guardrails but gaps in protection against common mistakes. |
| 2 | Few guardrails. Assistant could easily go off-track. |
| 1 | No guardrails. High risk of unintended consequences. |

### Scoring Template

```
Command: ____________________

| Criterion                    | Score (1-5) | Weight | Weighted |
|------------------------------|-------------|--------|----------|
| Clarity of Instructions      |             | 0.25   |          |
| Handling Ambiguous Input     |             | 0.25   |          |
| Structure & Organization     |             | 0.15   |          |
| Completeness                 |             | 0.15   |          |
| Actionability                |             | 0.10   |          |
| Guardrails & Safety          |             | 0.10   |          |
|------------------------------|-------------|--------|----------|
| TOTAL                        |             | 1.00   |    /5    |
```

**Grade Scale:**
- **A (4.5-5.0):** Excellent - Ready to use with minimal improvements
- **B (3.5-4.4):** Good - Solid foundation with some areas for enhancement
- **C (2.5-3.4):** Adequate - Works but needs significant improvements
- **D (1.5-2.4):** Poor - Major issues that need addressing
- **F (<1.5):** Failing - Needs complete revision

### Output Format (grade)

For each criterion:
1. **Score:** Provide the score (1-5)
2. **Justification:** Explain why this score was given, citing specific examples from the rule/command
3. **Suggestions:** If score < 5, provide concrete suggestions for improvement

After scoring all criteria:
1. Calculate the weighted total
2. Assign the letter grade
3. Provide an overall summary with prioritized recommendations

---

## Mode B — Improve

Rewrite the appended rule using these quality standards.

### Quality Standards

1. **Brevity & Signal-to-Noise Ratio:**
   - Remove filler words, unnecessary qualifications, and verbose phrasing.
   - Prefer direct statements over conditional syntax unless context-dependent behavior is required.
   - Example: "Use functional components" not "IF writing a component THEN use functional style."

2. **Single Source of Truth (SSOT) & DRY:**
   - Remove duplicated logic from standard practices or other rule files.
   - Reference primary sources instead of redefining concepts (e.g., "Refer to `formatting_rules.md`").

3. **Separation of Concerns:**
   - Focus on a single logic domain.
   - Split complex rules into distinct, atomic instructions.

4. **Abstraction Level:**
   - Remove code snippets and specific implementations.
   - Use abstract, natural language descriptions of patterns or behaviors.
   - Example: "Use functional components with typed props" not a React component example.

5. **Conditional Structure:**
   - Use "IF [Context/Trigger] THEN [Action]" only when the instruction depends on context or conditions.
   - Use direct statements for universal rules.
   - Avoid forcing conditional syntax onto simple, always-applicable rules.

6. **Imperative Language:**
   - Use direct, active voice.
   - Reserve "Must," "Strictly," "Always," "Never" for truly critical constraints.
   - Avoid overusing emphatic language that dilutes importance.

7. **Positive Constraint Framing:**
   - Pair negative constraints with positive alternatives.
   - Prefer stating what to do over what not to do.

### Rewrite Instructions

Apply the quality standards above to rewrite the rule:

- **Format:** Markdown with clear headers and bullet points.
- **Structure:** Group related logic under clear headings.
- **Logic:** Use conditional syntax only when context-dependent; otherwise use direct statements.
- **Linking:** Reference related files instead of explaining external concepts (e.g., "See Also: `framework_rules.md`").

---

## Boundaries

| Not `rule-quality` | Use instead |
|--------------------|-------------|
| Score a React/MUI component | `.agents/skills/review/SKILL.md` |
| Decide **where** a lesson should live (rule vs skill vs doc) | `.agents/skills/learn/SKILL.md` |
| Audit the whole skill library system | `.agents/skills/improve-skill-library/SKILL.md` |

## Related

- [`learn`](../learn/SKILL.md) — routes lessons into the right rule/skill/doc
- [`improve-skill-library`](../improve-skill-library/SKILL.md) — system-level skill audit
