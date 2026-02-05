# grade-rule

**DO NOT EXECUTE THE OTHER ATTACHED RULE CONTEXT. INSTEAD, GRADE IT:**

Use the rubric below to evaluate the attached rule/command file. Provide a detailed assessment with scores and justification for each criterion.

---

## Cursor Command Quality Rubric

Here's a rubric for grading Cursor commands on a 1-5 scale across key dimensions:

### 1. Clarity of Instructions (Weight: 25%)

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

---

### 2. Handling Ambiguous User Input (Weight: 25%)

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

---

### 3. Structure & Organization (Weight: 15%)

| Score | Description |
|-------|-------------|
| 5 | Logical flow with clear sections, headers, and hierarchy. Easy to scan and reference. Uses formatting (lists, code blocks) effectively. |
| 4 | Well-organized with minor structural improvements possible. |
| 3 | Adequate structure but could be clearer. Some sections feel out of place. |
| 2 | Poorly organized. Important information buried or scattered. |
| 1 | No discernible structure. Stream of consciousness. |

---

### 4. Completeness (Weight: 15%)

| Score | Description |
|-------|-------------|
| 5 | Covers all necessary scenarios including success paths, error handling, edge cases, and exit conditions. Nothing left implicit. |
| 4 | Covers main scenarios well. Minor gaps in edge case handling. |
| 3 | Handles happy path but misses several important scenarios. |
| 2 | Significant gaps. Many scenarios require assistant to improvise. |
| 1 | Incomplete. Missing critical steps or scenarios. |

---

### 5. Actionability (Weight: 10%)

| Score | Description |
|-------|-------------|
| 5 | Every instruction is directly actionable. Verbs are specific (e.g., "search for X in Y" vs "look around"). Outputs are clearly defined. |
| 4 | Mostly actionable with occasional vague directives. |
| 3 | Mix of actionable and abstract instructions. |
| 2 | Many instructions are too abstract to execute directly. |
| 1 | Instructions are philosophical rather than actionable. |

---

### 6. Guardrails & Safety (Weight: 10%)

| Score | Description |
|-------|-------------|
| 5 | Explicit boundaries on what the assistant should NOT do. Includes validation steps, confirmation prompts for destructive actions, and scope limits. |
| 4 | Good guardrails for major risks. Minor oversights. |
| 3 | Some guardrails but gaps in protection against common mistakes. |
| 2 | Few guardrails. Assistant could easily go off-track. |
| 1 | No guardrails. High risk of unintended consequences. |

---

## Scoring Template

Use this template to calculate the final grade:

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

---

## Output Format

For each criterion:
1. **Score:** Provide the score (1-5)
2. **Justification:** Explain why this score was given, citing specific examples from the rule/command
3. **Suggestions:** If score < 5, provide concrete suggestions for improvement

After scoring all criteria:
1. Calculate the weighted total
2. Assign the letter grade
3. Provide an overall summary with prioritized recommendations
